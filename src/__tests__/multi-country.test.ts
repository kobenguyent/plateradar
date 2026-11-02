import { describe, it, expect } from 'vitest';
import { CountryAdapters, autoDetectCountry, SUPPORTED_COUNTRIES } from '../core/country-registry';

describe('Multi-Country Extensible Architecture', () => {
  it('registers supported countries with complete metadata', () => {
    expect(SUPPORTED_COUNTRIES.length).toBeGreaterThanOrEqual(3);
    const countryIds = SUPPORTED_COUNTRIES.map((c) => c.id);
    expect(countryIds).toContain('DE');
    expect(countryIds).toContain('AT');
    expect(countryIds).toContain('CH');
  });

  describe('Austria Adapter (AT)', () => {
    const at = CountryAdapters.AT;

    it('parses Austrian standard plates (W 12345 A)', () => {
      const res = at.parse('W 12345 A');
      expect(res.isValid).toBe(true);
      expect(res.country).toBe('AT');
      expect(res.districtCode).toBe('W');
      expect(res.districtName).toBe('Wien');
      expect(res.state).toBe('Wien');
      expect(res.hasEuroBand).toBe(true);
    });

    it('parses Austrian electric plates with green font', () => {
      const res = at.parse('L 4040 E');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('electric');
      expect(res.textColor).toBe('green');
      expect(res.specialPerks.some((p) => p.includes('IG-L'))).toBe(true);
    });

    it('identifies Austrian Federal Police (BP 12345)', () => {
      const res = at.parse('BP 12345');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('federal_police');
      expect(res.districtName).toContain('Bundespolizei');
    });

    it('identifies Austrian Armed Forces (BH 67890)', () => {
      const res = at.parse('BH 67890');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('federal_armed_forces');
      expect(res.districtName).toContain('Bundesheer');
    });
  });

  describe('Switzerland Adapter (CH)', () => {
    const ch = CountryAdapters.CH;

    it('parses Swiss cantonal plates (ZH 854123)', () => {
      const res = ch.parse('ZH 854123');
      expect(res.isValid).toBe(true);
      expect(res.country).toBe('CH');
      expect(res.districtCode).toBe('ZH');
      expect(res.districtName).toBe('Zürich');
      expect(res.hasEuroBand).toBe(false);
      expect(res.specialPerks.some((p) => p.includes('Wechselschild'))).toBe(true);
    });

    it('identifies Swiss Military vehicles (M 12345)', () => {
      const res = ch.parse('M 12345');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('federal_armed_forces');
      expect(res.districtName).toContain('Schweizer Armee');
    });
  });

  describe('Auto Detection Helper', () => {
    it('detects Switzerland for cantonal format (ZH 12345)', () => {
      expect(autoDetectCountry('ZH 12345')).toBe('CH');
    });

    it('detects Austria for Austrian police (BP 12345)', () => {
      expect(autoDetectCountry('BP 12345')).toBe('AT');
    });

    it('defaults to Germany for German plates (B MW 1234 E)', () => {
      expect(autoDetectCountry('B MW 1234 E')).toBe('DE');
    });
  });
});
