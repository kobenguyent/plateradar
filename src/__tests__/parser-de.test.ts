import { describe, it, expect } from 'vitest';
import { parseGermanPlate } from '../core/parser-de';

describe('German License Plate Parser (parseGermanPlate)', () => {
  describe('Standard Euro Plates', () => {
    it('parses single-letter district plate correctly', () => {
      const res = parseGermanPlate('B MW 1234');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('standard');
      expect(res.districtCode).toBe('B');
      expect(res.districtName).toBe('Berlin');
      expect(res.state).toBe('Berlin');
      expect(res.middleLetters).toBe('MW');
      expect(res.numberPart).toBe('1234');
      expect(res.hasEuroBand).toBe(true);
      expect(res.textColor).toBe('black');
    });

    it('parses three-letter district plate (e.g. DAH)', () => {
      const res = parseGermanPlate('DAH GT 500');
      expect(res.isValid).toBe(true);
      expect(res.districtCode).toBe('DAH');
      expect(res.districtName).toBe('Dachau');
      expect(res.state).toBe('Bayern');
    });

    it('handles plates with dashes and lowercase inputs gracefully', () => {
      const res = parseGermanPlate('hh-ab-99');
      expect(res.isValid).toBe(true);
      expect(res.districtCode).toBe('HH');
      expect(res.districtName).toBe('Hamburg');
      expect(res.middleLetters).toBe('AB');
      expect(res.numberPart).toBe('99');
    });
  });

  describe('Electric Vehicle Plates (E-Kennzeichen)', () => {
    it('recognizes electric vehicle suffix "E"', () => {
      const res = parseGermanPlate('B MW 1234 E');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('electric');
      expect(res.suffix).toBe('E');
      expect(res.specialPerks.some((p) => p.includes('charging') || p.includes('bus lane') || p.includes('parking'))).toBe(true);
    });

    it('recognizes electric seasonal plate (E + Saison)', () => {
      const res = parseGermanPlate('S EV 100 E 03/11');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('electric_seasonal');
      expect(res.suffix).toBe('E');
      expect(res.seasonStart).toBe(3);
      expect(res.seasonEnd).toBe(11);
      expect(res.hasSeasonBand).toBe(true);
    });
  });

  describe('Historic Classic Vehicle Plates (H-Kennzeichen)', () => {
    it('recognizes historic oldtimer suffix "H"', () => {
      const res = parseGermanPlate('HH CL 70 H');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('classic');
      expect(res.suffix).toBe('H');
      expect(res.specialPerks.some((p) => p.includes('Umweltzone') || p.includes('Low Emission'))).toBe(true);
    });

    it('recognizes historic seasonal plate (H + Saison)', () => {
      const res = parseGermanPlate('K RS 73 H 04/10');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('classic_seasonal');
      expect(res.suffix).toBe('H');
      expect(res.seasonStart).toBe(4);
      expect(res.seasonEnd).toBe(10);
      expect(res.hasSeasonBand).toBe(true);
    });
  });

  describe('Seasonal Plates (Saisonkennzeichen)', () => {
    it('parses seasonal operating window with slash', () => {
      const res = parseGermanPlate('M SP 911 04/10');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('seasonal');
      expect(res.seasonStart).toBe(4);
      expect(res.seasonEnd).toBe(10);
      expect(res.hasSeasonBand).toBe(true);
    });
  });

  describe('Short-Term Transfer Plates (Kurzzeitkennzeichen)', () => {
    it('parses 5-day transfer plate starting with 04 and date', () => {
      const res = parseGermanPlate('B 04123 28/11/26');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('short_term');
      expect(res.hasYellowBand).toBe(true);
      expect(res.expiryDay).toBe(28);
      expect(res.expiryMonth).toBe(11);
      expect(res.expiryYear).toBe(2026);
    });
  });

  describe('Export Plates (Ausfuhrkennzeichen)', () => {
    it('parses export plate with trailing letter and red band', () => {
      const res = parseGermanPlate('M 1234 A 15/06/27');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('export');
      expect(res.hasRedBand).toBe(true);
      expect(res.expiryDay).toBe(15);
      expect(res.expiryMonth).toBe(6);
      expect(res.expiryYear).toBe(2027);
    });
  });

  describe('Dealer & Vintage Collection Red Plates', () => {
    it('parses dealer plate (06)', () => {
      const res = parseGermanPlate('B 06123');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('dealer_collector_red');
      expect(res.textColor).toBe('red');
    });

    it('parses classic collector plate (07)', () => {
      const res = parseGermanPlate('M 07123');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('dealer_collector_red');
      expect(res.textColor).toBe('red');
    });
  });

  describe('Highest Federal Officials & Supreme Organs', () => {
    it('recognizes Federal President (0-1)', () => {
      const res = parseGermanPlate('0-1');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('federal_leadership');
      expect(res.categoryDescription).toContain('Federal President');
    });

    it('recognizes Federal Chancellor (0-2)', () => {
      const res = parseGermanPlate('0-2');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('federal_leadership');
      expect(res.categoryDescription).toContain('Federal Chancellor');
    });
  });

  describe('Diplomatic Missions', () => {
    it('identifies Ambassador diplomatic plate (0 17-1)', () => {
      const res = parseGermanPlate('0 17-1');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('diplomatic');
      expect(res.diplomaticInfo?.country).toBe('United States of America');
      expect(res.diplomaticInfo?.role).toContain('Ambassador');
    });

    it('identifies Berlin Embassy staff (B 35-123 France)', () => {
      const res = parseGermanPlate('B 35-123');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('diplomatic');
      expect(res.diplomaticInfo?.country).toBe('France');
    });
  });

  describe('Official Authorities: Armed Forces, Police, THW, Customs', () => {
    it('identifies Bundeswehr Armed Forces (Y-482195)', () => {
      const res = parseGermanPlate('Y-482195');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('federal_armed_forces');
      expect(res.hasGermanFlag).toBe(true);
      expect(res.hasEuroBand).toBe(false);
    });

    it('identifies Federal Police (BP 18-450)', () => {
      const res = parseGermanPlate('BP 18-450');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('federal_police');
    });

    it('identifies THW disaster relief (THW-86412)', () => {
      const res = parseGermanPlate('THW-86412');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('federal_thw');
    });

    it('identifies Bundeszollverwaltung Customs (BWZ 24-810)', () => {
      const res = parseGermanPlate('BWZ 24-810');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('federal_customs');
    });

    it('identifies State Police (NRW 4-2819)', () => {
      const res = parseGermanPlate('NRW 4-2819');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('state_police');
      expect(res.state).toBe('Nordrhein-Westfalen');
    });
  });

  describe('Insurance Moped Plates', () => {
    it('identifies small moped insurance plate (123 ABC)', () => {
      const res = parseGermanPlate('123 ABC');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('insurance_moped');
      expect(res.hasEuroBand).toBe(false);
    });
  });

  describe('Prohibited Combinations & Validation Violations', () => {
    it('flags nationwide banned Nazi abbreviation SS', () => {
      const res = parseGermanPlate('B SS 123');
      expect(res.isValid).toBe(false);
      expect(res.prohibitedWarning).toBeDefined();
      expect(res.prohibitedWarning).toContain('FZV');
    });

    it('flags nationwide banned Nazi abbreviation HJ', () => {
      const res = parseGermanPlate('M HJ 88');
      expect(res.isValid).toBe(false);
      expect(res.prohibitedWarning).toBeDefined();
    });

    it('rejects plates exceeding the maximum 8-character limit', () => {
      const res = parseGermanPlate('DAH XY 1234 H');
      expect(res.isValid).toBe(false);
      expect(res.errors.some((e) => e.includes('8 characters'))).toBe(true);
    });

    it('rejects unrecognized district codes', () => {
      const res = parseGermanPlate('XYZ AB 123');
      expect(res.isValid).toBe(false);
      expect(res.errors.some((e) => e.includes('not a recognized German Unterscheidungszeichen'))).toBe(true);
    });
  });
});
