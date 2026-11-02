import { describe, it, expect } from 'vitest';
import { CountryAdapters, autoDetectCountry, SUPPORTED_COUNTRIES } from '../core/country-registry';

describe('Multi-Country Extensible Architecture', () => {
  it('registers all 8 supported countries with complete metadata', () => {
    expect(SUPPORTED_COUNTRIES.length).toBe(8);
    const countryIds = SUPPORTED_COUNTRIES.map((c) => c.id);
    expect(countryIds).toEqual(
      expect.arrayContaining(['DE', 'AT', 'CH', 'JP', 'TH', 'VN', 'AU', 'NZ'])
    );
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

    it('parses Austrian state plate O 320 320 (Oberösterreich)', () => {
      const res = at.parse('O 320 320');
      expect(res.isValid).toBe(true);
      expect(res.country).toBe('AT');
      expect(res.districtCode).toBe('O');
      expect(res.districtName).toBe('Oberösterreich');
      expect(res.state).toBe('Oberösterreich');
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

  describe('Japan Adapter (JP)', () => {
    const jp = CountryAdapters.JP;

    it('parses standard passenger car plate (品川 300 さ 12-34)', () => {
      const res = jp.parse('品川 300 さ 12-34');
      expect(res.isValid).toBe(true);
      expect(res.country).toBe('JP');
      expect(res.category).toBe('standard');
      expect(res.districtCode).toBe('品川');
      expect(res.districtName).toBe('Shinagawa (Tokyo)');
      expect(res.topLineText).toBe('品川 300');
      expect(res.middleLetters).toBe('さ');
      expect(res.numberPart).toBe('12-34');
      expect(res.textColor).toBe('green');
      expect(res.backgroundColor).toBe('white');
    });

    it('identifies Kei Car mini-vehicle (横浜 580 わ 56-78)', () => {
      const res = jp.parse('横浜 580 わ 56-78');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('kei_car');
      expect(res.textColor).toBe('black');
      expect(res.backgroundColor).toBe('yellow');
      expect(res.specialPerks.some((p) => p.includes('Kei-jidōshazei'))).toBe(true);
    });

    it('parses diplomatic plate (外 1234)', () => {
      const res = jp.parse('外 1234');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('diplomatic');
      expect(res.textColor).toBe('white');
      expect(res.backgroundColor).toBe('blue');
      expect(res.numberPart).toBe('1234');
      expect(res.specialPerks.some((p) => p.includes('Vienna Convention'))).toBe(true);
    });

    it('recognizes SOFA US Military characters (沖縄 500 Y 45-67)', () => {
      const res = jp.parse('沖縄 500 Y 45-67');
      expect(res.isValid).toBe(true);
      expect(res.districtCode).toBe('沖縄');
      expect(res.middleLetters).toBe('Y');
      expect(res.specialPerks.some((p) => p.includes('SOFA'))).toBe(true);
    });

    it('parses Romaji place name (Shinagawa 300 Sa 12-34)', () => {
      const res = jp.parse('Shinagawa 300 Sa 12-34');
      expect(res.isValid).toBe(true);
      expect(res.districtCode).toBe('品川');
    });
  });

  describe('Thailand Adapter (TH)', () => {
    const th = CountryAdapters.TH;

    it('parses Thai passenger sedan plate (1กข 1234 Bangkok)', () => {
      const res = th.parse('1กข 1234 Bangkok');
      expect(res.isValid).toBe(true);
      expect(res.country).toBe('TH');
      expect(res.middleLetters).toBe('1กข');
      expect(res.numberPart).toBe('1234');
      expect(res.districtCode).toBe('BKK');
      expect(res.bottomLineText).toBe('กรุงเทพมหานคร');
      expect(res.textColor).toBe('black');
      expect(res.backgroundColor).toBe('white');
    });

    it('parses Thai temporary red plate (ก-9999 แดง)', () => {
      const res = th.parse('ก-9999 แดง');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('short_term');
      expect(res.textColor).toBe('black');
      expect(res.backgroundColor).toBe('red');
      expect(res.specialPerks.some((p) => p.includes('30 days'))).toBe(true);
    });

    it('handles regional provinces (2ขค 5678 Chiang Mai)', () => {
      const res = th.parse('2ขค 5678 Chiang Mai');
      expect(res.isValid).toBe(true);
      expect(res.districtCode).toBe('CNX');
      expect(res.districtName).toBe('Chiang Mai');
      expect(res.bottomLineText).toBe('เชียงใหม่');
    });
  });

  describe('Vietnam Adapter (VN)', () => {
    const vn = CountryAdapters.VN;

    it('parses Hanoi civilian plate (30A-123.45)', () => {
      const res = vn.parse('30A-123.45');
      expect(res.isValid).toBe(true);
      expect(res.country).toBe('VN');
      expect(res.category).toBe('standard');
      expect(res.districtCode).toBe('30');
      expect(res.districtName).toBe('Hà Nội');
      expect(res.middleLetters).toBe('A');
      expect(res.numberPart).toBe('123.45');
      expect(res.textColor).toBe('black');
      expect(res.backgroundColor).toBe('white');
    });

    it('identifies Central Government blue plate (80A-001.01)', () => {
      const res = vn.parse('80A-001.01');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('government');
      expect(res.textColor).toBe('white');
      expect(res.backgroundColor).toBe('blue');
      expect(res.districtCode).toBe('80');
      expect(res.specialPerks.some((p) => p.includes('urgent official duties'))).toBe(true);
    });

    it('identifies People’s Army military red plate (QA-12-34)', () => {
      const res = vn.parse('QA-12-34');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('federal_armed_forces');
      expect(res.textColor).toBe('white');
      expect(res.backgroundColor).toBe('red');
      expect(res.specialPerks.some((p) => p.includes('toll'))).toBe(true);
    });

    it('errors on invalid province code', () => {
      const res = vn.parse('00A-123.45');
      expect(res.isValid).toBe(false);
      expect(res.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Australia Adapter (AU)', () => {
    const au = CountryAdapters.AU;

    it('parses NSW state plate (NSW AA-12-BB)', () => {
      const res = au.parse('NSW AA-12-BB');
      expect(res.isValid).toBe(true);
      expect(res.country).toBe('AU');
      expect(res.districtCode).toBe('NSW');
      expect(res.districtName).toBe('New South Wales');
      expect(res.backgroundColor).toBe('yellow');
      expect(res.bottomLineText).toBe('NEW SOUTH WALES');
    });

    it('parses Victoria Education State plate (VIC 1AA-2BB)', () => {
      const res = au.parse('VIC 1AA-2BB');
      expect(res.isValid).toBe(true);
      expect(res.districtCode).toBe('VIC');
      expect(res.districtName).toBe('Victoria');
      expect(res.bottomLineText).toBe('VICTORIA - THE EDUCATION STATE');
    });

    it('auto-detects Queensland plate by pattern (123-AA1)', () => {
      const res = au.parse('123-AA1');
      expect(res.isValid).toBe(true);
      expect(res.districtCode).toBe('QLD');
      expect(res.bottomLineText).toBe('QUEENSLAND - SUNSHINE STATE');
    });

    it('errors on invalid length', () => {
      const res = au.parse('NSW A');
      expect(res.isValid).toBe(false);
      expect(res.errors[0]).toContain('between 3 and 7');
    });
  });

  describe('New Zealand Adapter (NZ)', () => {
    const nz = CountryAdapters.NZ;

    it('parses standard modern format (ABC 123)', () => {
      const res = nz.parse('ABC 123');
      expect(res.isValid).toBe(true);
      expect(res.country).toBe('NZ');
      expect(res.category).toBe('standard');
      expect(res.middleLetters).toBe('ABC');
      expect(res.numberPart).toBe('123');
      expect(res.bottomLineText).toBe('NEW ZEALAND');
    });

    it('parses legacy pre-2001 format (AA 1234)', () => {
      const res = nz.parse('AA 1234');
      expect(res.isValid).toBe(true);
      expect(res.category).toBe('classic');
      expect(res.middleLetters).toBe('AA');
      expect(res.numberPart).toBe('1234');
    });

    it('parses custom personalised KiwiPlate (KIWI)', () => {
      const res = nz.parse('KIWI');
      expect(res.isValid).toBe(true);
      expect(res.categoryName).toContain('KiwiPlate');
      expect(res.specialPerks.some((p) => p.includes('Lifetime ownership'))).toBe(true);
    });
  });

  describe('Auto Detection Helper', () => {
    it('detects Switzerland for cantonal format (ZH 12345)', () => {
      expect(autoDetectCountry('ZH 12345')).toBe('CH');
    });

    it('detects Austria for Austrian police (BP 12345)', () => {
      expect(autoDetectCountry('BP 12345')).toBe('AT');
    });

    it('detects Japan for Kanji/Hiragana (品川 300 さ 12-34)', () => {
      expect(autoDetectCountry('品川 300 さ 12-34')).toBe('JP');
    });

    it('detects Thailand for Thai script (1กข 1234)', () => {
      expect(autoDetectCountry('1กข 1234')).toBe('TH');
    });

    it('detects Vietnam for standard pattern (30A-123.45)', () => {
      expect(autoDetectCountry('30A-123.45')).toBe('VN');
    });

    it('detects Australia for state prefix (NSW AA-12-BB)', () => {
      expect(autoDetectCountry('NSW AA-12-BB')).toBe('AU');
    });

    it('detects New Zealand for standard format (ABC 123)', () => {
      expect(autoDetectCountry('ABC 123')).toBe('NZ');
    });

    it('defaults to Germany for German plates (B MW 1234 E)', () => {
      expect(autoDetectCountry('B MW 1234 E')).toBe('DE');
    });
  });
});
