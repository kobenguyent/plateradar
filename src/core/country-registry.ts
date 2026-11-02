import { CountryAdapter, CountryCode, CountryInfo, PlateParseResult } from '../types';
import { parseGermanPlate, findGermanDistrict, getRandomGermanPlate } from './parser-de';
import { parseAustrianPlate, findAustrianDistrict, getRandomAustrianPlate } from './parser-at';
import { parseSwissPlate, findSwissCanton, getRandomSwissPlate } from './parser-ch';
import { GERMAN_DISTRICTS } from '../data/districts-de';
import { AUSTRIAN_DISTRICTS } from '../data/districts-at';
import { SWISS_CANTONS } from '../data/districts-ch';

export const SUPPORTED_COUNTRIES: CountryInfo[] = [
  {
    id: 'DE',
    name: 'Germany',
    nativeName: 'Deutschland',
    flag: '🇩🇪',
    euroCode: 'D',
    description: 'Complete coverage of 400+ districts, electric (E), classic (H), seasonal, transfer (yellow), export (red), diplomatic, military (Y), police, THW, and customs plates.',
    supportedCategoriesCount: 16,
  },
  {
    id: 'AT',
    name: 'Austria',
    nativeName: 'Österreich',
    flag: '🇦🇹',
    euroCode: 'A',
    description: 'Full Austrian district codes, federal state coats of arms, electric green lettering, federal police (BP), and armed forces (BH).',
    supportedCategoriesCount: 6,
  },
  {
    id: 'CH',
    name: 'Switzerland',
    nativeName: 'Schweiz',
    flag: '🇨🇭',
    euroCode: 'CH',
    description: 'All 26 Swiss cantons, Swiss shield, cantonal crests, and Swiss military vehicles (M).',
    supportedCategoriesCount: 4,
  },
];

export const CountryAdapters: Record<CountryCode, CountryAdapter> = {
  DE: {
    id: 'DE',
    info: SUPPORTED_COUNTRIES[0],
    parse: (plate: string, overrides?: Partial<PlateParseResult>) => parseGermanPlate(plate, overrides),
    getDistricts: () => GERMAN_DISTRICTS,
    findDistrict: (code: string) => findGermanDistrict(code),
    getRandomPlate: getRandomGermanPlate,
  },
  AT: {
    id: 'AT',
    info: SUPPORTED_COUNTRIES[1],
    parse: (plate: string, overrides?: Partial<PlateParseResult>) => parseAustrianPlate(plate, overrides),
    getDistricts: () => AUSTRIAN_DISTRICTS,
    findDistrict: (code: string) => findAustrianDistrict(code),
    getRandomPlate: getRandomAustrianPlate,
  },
  CH: {
    id: 'CH',
    info: SUPPORTED_COUNTRIES[2],
    parse: (plate: string) => parseSwissPlate(plate),
    getDistricts: () => SWISS_CANTONS,
    findDistrict: (code: string) => findSwissCanton(code),
    getRandomPlate: getRandomSwissPlate,
  },
};

export function autoDetectCountry(input: string): CountryCode {
  const cleaned = input.trim().toUpperCase();
  // If Swiss military: M + digits
  if (/^M[- ]?[0-9]{4,6}$/.test(cleaned)) {
    return 'CH';
  }
  // If starts with Swiss canton code and numbers only, e.g. "ZH 123456"
  const swissMatch = cleaned.match(/^([A-Z]{2})[- ]?([0-9]{1,6})$/);
  if (swissMatch && findSwissCanton(swissMatch[1])) {
    return 'CH';
  }
  // If Austrian police/military "BP 12345" or "BH 12345"
  if (/^(BH|BP)[- ]?[0-9]{4,6}$/.test(cleaned)) {
    return 'AT';
  }
  // Default to Germany
  return 'DE';
}
