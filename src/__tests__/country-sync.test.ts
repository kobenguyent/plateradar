import { describe, it, expect } from 'vitest';
import { SUPPORTED_COUNTRIES, DEFAULT_PLATE_BY_COUNTRY, CountryAdapters } from '../core/country-registry';
import { CountryCode } from '../types';
import { QUIZ_QUESTIONS_BY_COUNTRY } from '../components/quiz/PlateQuiz';
import { STUDIO_PRESETS_BY_COUNTRY } from '../components/studio/PlateStudio';

describe('Country Switching & Preview Synchronization', () => {
  const allCountryCodes: CountryCode[] = ['DE', 'AT', 'CH', 'JP', 'TH', 'VN', 'AU', 'NZ', 'US'];

  it('provides supported info and adapter for every country code', () => {
    for (const code of allCountryCodes) {
      const info = SUPPORTED_COUNTRIES.find((c) => c.id === code);
      expect(info).toBeDefined();
      expect(info?.name).toBeTruthy();
      expect(info?.flag).toBeTruthy();

      const adapter = CountryAdapters[code];
      expect(adapter).toBeDefined();
      expect(adapter.id).toBe(code);
    }
  });

  it('provides an authentic DEFAULT_PLATE_BY_COUNTRY for every country that parses validly', () => {
    for (const code of allCountryCodes) {
      const defaultPlate = DEFAULT_PLATE_BY_COUNTRY[code];
      expect(defaultPlate, `Missing DEFAULT_PLATE_BY_COUNTRY for ${code}`).toBeTruthy();

      const adapter = CountryAdapters[code];
      const result = adapter.parse(defaultPlate);

      expect(result.isValid, `Default plate "${defaultPlate}" for ${code} must be valid`).toBe(true);
      expect(result.country).toBe(code);
    }
  });

  it('provides dedicated quiz questions for every supported country', () => {
    for (const code of allCountryCodes) {
      const questions = QUIZ_QUESTIONS_BY_COUNTRY[code];
      expect(questions, `Missing quiz questions for ${code}`).toBeDefined();
      expect(questions.length).toBeGreaterThanOrEqual(4);

      for (const q of questions) {
        expect(q.id).toBeTruthy();
        expect(q.question).toBeTruthy();
        expect(q.options.length).toBeGreaterThanOrEqual(3);
        expect(q.explanation).toBeTruthy();

        // The correct answer must be one of the options
        const match = q.options.some((opt) => opt.value === q.correctAnswer);
        expect(match, `Question "${q.id}" correctAnswer must match an option value`).toBe(true);
      }
    }
  });

  it('provides rich Studio presets for every supported country', () => {
    for (const code of allCountryCodes) {
      const presets = STUDIO_PRESETS_BY_COUNTRY[code];
      expect(presets, `Missing studio presets for ${code}`).toBeDefined();
      expect(presets.length).toBeGreaterThanOrEqual(3);

      for (const p of presets) {
        expect(p.label).toBeTruthy();
        expect(p.districtCode).toBeTruthy();
        expect(p.numberPart).toBeDefined();
      }
    }
  });

  it('correctly associates US states with their iconic slogans and identifiers', () => {
    const usAdapter = CountryAdapters.US;

    const ca = usAdapter.parse('CA 7SAM123');
    expect(ca.isValid).toBe(true);
    expect(ca.districtCode).toBe('CA');
    expect(ca.topLineText).toBe('CALIFORNIA');
    expect(ca.bottomLineText).toContain('The Golden State');

    const tx = usAdapter.parse('TX ABC-1234');
    expect(tx.isValid).toBe(true);
    expect(tx.districtCode).toBe('TX');
    expect(tx.topLineText).toBe('TEXAS');
    expect(tx.bottomLineText).toBe('The Lone Star State');

    const ny = usAdapter.parse('NY 123-ABCD');
    expect(ny.isValid).toBe(true);
    expect(ny.districtCode).toBe('NY');
    expect(ny.topLineText).toBe('NEW YORK');
    expect(ny.bottomLineText).toContain('Empire State');

    const fl = usAdapter.parse('FL 12A-BCD');
    expect(fl.isValid).toBe(true);
    expect(fl.districtCode).toBe('FL');
    expect(fl.topLineText).toBe('FLORIDA');
    expect(fl.bottomLineText).toContain('Sunshine State');

    const co = usAdapter.parse('CO ABC-D12');
    expect(co.isValid).toBe(true);
    expect(co.districtCode).toBe('CO');
    expect(co.bottomLineText).toContain('Rocky Mountains');

    const wa = usAdapter.parse('WA ABC-1234');
    expect(wa.isValid).toBe(true);
    expect(wa.districtCode).toBe('WA');
    expect(wa.bottomLineText).toContain('The Evergreen State');

    const hi = usAdapter.parse('HI ABC-123');
    expect(hi.isValid).toBe(true);
    expect(hi.districtCode).toBe('HI');
    expect(hi.bottomLineText).toBe('Aloha State');

    const diplo = usAdapter.parse('D 1234');
    expect(diplo.isValid).toBe(true);
    expect(diplo.category).toBe('diplomatic');
    expect(diplo.districtCode).toBe('DOS');

    const gsa = usAdapter.parse('G12-3456');
    expect(gsa.isValid).toBe(true);
    expect(gsa.category).toBe('government');
    expect(gsa.districtCode).toBe('USG');
  });

  it('correctly sets state coats of arms and badges for Austria, Switzerland, and Germany', () => {
    // Austria: W (Vienna) has stateCode 'W', S (Salzburg) has stateCode 'S'
    const atAdapter = CountryAdapters.AT;
    const wien = atAdapter.parse('W 12345 A');
    expect(wien.isValid).toBe(true);
    expect(wien.badgeStateCode).toBe('W');

    const salzburg = atAdapter.parse('S 911 GT');
    expect(salzburg.isValid).toBe(true);
    expect(salzburg.badgeStateCode).toBe('S');

    // Electric vehicle in Austria has green font
    const ev = atAdapter.parse('L 4040 E');
    expect(ev.isValid).toBe(true);
    expect(ev.textColor).toBe('green');

    // Switzerland: ZH (Zurich) has badgeStateCode 'ZH', GE (Geneva) has 'GE'
    const chAdapter = CountryAdapters.CH;
    const zurich = chAdapter.parse('ZH 854123');
    expect(zurich.isValid).toBe(true);
    expect(zurich.badgeStateCode).toBe('ZH');

    // Germany: M (Munich) has stateCode 'bayern', B (Berlin) has 'berlin'
    const deAdapter = CountryAdapters.DE;
    const munich = deAdapter.parse('M CL 1970 H');
    expect(munich.isValid).toBe(true);
    expect(munich.badgeStateCode).toBe('bayern');
  });
});
