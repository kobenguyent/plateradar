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
});
