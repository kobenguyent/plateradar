import { CountryAdapter, CountryCode, CountryInfo, PlateParseResult } from '../types';
import { parseGermanPlate, findGermanDistrict, getRandomGermanPlate } from './parser-de';
import { parseAustrianPlate, findAustrianDistrict, getRandomAustrianPlate } from './parser-at';
import { parseSwissPlate, findSwissCanton, getRandomSwissPlate } from './parser-ch';
import { parseJapanesePlate, findJapaneseOffice, getRandomJapanesePlate } from './parser-jp';
import { parseThaiPlate, findThaiProvince, getRandomThaiPlate } from './parser-th';
import { parseVietnamesePlate, findVietnameseProvince, getRandomVietnamesePlate } from './parser-vn';
import { parseAustralianPlate, findAustralianState, getRandomAustralianPlate } from './parser-au';
import { parseNewZealandPlate, getRandomNewZealandPlate } from './parser-nz';
import { parseUSPlate, findUSState, getRandomUSPlate } from './parser-us';

import { GERMAN_DISTRICTS } from '../data/districts-de';
import { AUSTRIAN_DISTRICTS } from '../data/districts-at';
import { SWISS_CANTONS } from '../data/districts-ch';
import { JAPANESE_OFFICES } from '../data/districts-jp';
import { THAI_PROVINCES } from '../data/districts-th';
import { VIETNAMESE_PROVINCES } from '../data/districts-vn';
import { AUSTRALIAN_STATES } from '../data/districts-au';
import { NZ_REGIONS } from '../data/districts-nz';
import { US_STATES } from '../data/districts-us';

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
    description: 'Full Austrian district codes, federal state coats of arms, electric green lettering, state government plates (O, W, N...), federal police (BP), and armed forces (BH).',
    supportedCategoriesCount: 7,
  },
  {
    id: 'CH',
    name: 'Switzerland',
    nativeName: 'Schweiz',
    flag: '🇨🇭',
    euroCode: 'CH',
    description: 'All 26 Swiss cantons, Swiss national shield, cantonal crests, and Swiss military vehicles (M).',
    supportedCategoriesCount: 4,
  },
  {
    id: 'JP',
    name: 'Japan',
    nativeName: '日本',
    flag: '🇯🇵',
    euroCode: 'J',
    description: 'Two-line plates with Kanji transport branch offices, vehicle class numbers (3xx/5xx), Hiragana, Kei mini-cars (Yellow/Black), commercial (Green), and diplomatic (Blue 外).',
    supportedCategoriesCount: 5,
  },
  {
    id: 'TH',
    name: 'Thailand',
    nativeName: 'ประเทศไทย',
    flag: '🇹🇭',
    euroCode: 'T',
    description: 'Thai consonant series, 77 provinces (Bangkok, Chiang Mai, Phuket...), commercial taxis (Yellow), private pickups (Green), and red temporary plates (ป้ายแดง).',
    supportedCategoriesCount: 5,
  },
  {
    id: 'VN',
    name: 'Vietnam',
    nativeName: 'Việt Nam',
    flag: '🇻🇳',
    euroCode: 'VN',
    description: 'Province codes (29/30 Hà Nội, 50/51 TP.HCM...), civilian white plates, blue government/police (80A), commercial transport yellow, and military red (Quân đội).',
    supportedCategoriesCount: 5,
  },
  {
    id: 'AU',
    name: 'Australia',
    nativeName: 'Australia',
    flag: '🇦🇺',
    euroCode: 'AUS',
    description: 'All states & territories (NSW, VIC, QLD, WA, SA, TAS, ACT, NT) with official state slogans (Education State, Sunshine State) and iconic state colorways.',
    supportedCategoriesCount: 8,
  },
  {
    id: 'NZ',
    name: 'New Zealand',
    nativeName: 'Aotearoa New Zealand',
    flag: '🇳🇿',
    euroCode: 'NZ',
    description: 'Standard 3-letter + 3-digit series (ABC 123), legacy pre-2001 (AA 1234), and personalised custom KiwiPlates.',
    supportedCategoriesCount: 3,
  },
  {
    id: 'US',
    name: 'United States',
    nativeName: 'United States of America',
    flag: '🇺🇸',
    euroCode: 'USA',
    description: 'All 50 states + Washington D.C., iconic state slogans (The Golden State, Lone Star, Empire State), GSA federal government plates, and U.S. Dept of State diplomatic registrations (OFM).',
    supportedCategoriesCount: 5,
  },
];

export const DEFAULT_PLATE_BY_COUNTRY: Record<CountryCode, string> = {
  DE: 'B MW 1234 E',
  AT: 'W 12345 A',
  CH: 'ZH 854123',
  JP: '品川 300 さ 12-34',
  TH: '1กข 1234 Bangkok',
  VN: '30A-123.45',
  AU: 'NSW AA-12-BB',
  NZ: 'ABC 123',
  US: 'CA 7SAM123',
};

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
  JP: {
    id: 'JP',
    info: SUPPORTED_COUNTRIES[3],
    parse: (plate: string, overrides?: Partial<PlateParseResult>) => parseJapanesePlate(plate, overrides),
    getDistricts: () => JAPANESE_OFFICES,
    findDistrict: (code: string) => findJapaneseOffice(code),
    getRandomPlate: getRandomJapanesePlate,
  },
  TH: {
    id: 'TH',
    info: SUPPORTED_COUNTRIES[4],
    parse: (plate: string, overrides?: Partial<PlateParseResult>) => parseThaiPlate(plate, overrides),
    getDistricts: () => THAI_PROVINCES,
    findDistrict: (code: string) => findThaiProvince(code),
    getRandomPlate: getRandomThaiPlate,
  },
  VN: {
    id: 'VN',
    info: SUPPORTED_COUNTRIES[5],
    parse: (plate: string, overrides?: Partial<PlateParseResult>) => parseVietnamesePlate(plate, overrides),
    getDistricts: () => VIETNAMESE_PROVINCES,
    findDistrict: (code: string) => findVietnameseProvince(code),
    getRandomPlate: getRandomVietnamesePlate,
  },
  AU: {
    id: 'AU',
    info: SUPPORTED_COUNTRIES[6],
    parse: (plate: string, overrides?: Partial<PlateParseResult>) => parseAustralianPlate(plate, overrides),
    getDistricts: () => AUSTRALIAN_STATES,
    findDistrict: (code: string) => findAustralianState(code),
    getRandomPlate: getRandomAustralianPlate,
  },
  NZ: {
    id: 'NZ',
    info: SUPPORTED_COUNTRIES[7],
    parse: (plate: string, overrides?: Partial<PlateParseResult>) => parseNewZealandPlate(plate, overrides),
    getDistricts: () => NZ_REGIONS,
    findDistrict: (code: string) => NZ_REGIONS.find((r) => r.code === code),
    getRandomPlate: getRandomNewZealandPlate,
  },
  US: {
    id: 'US',
    info: SUPPORTED_COUNTRIES[8],
    parse: (plate: string, overrides?: Partial<PlateParseResult>) => parseUSPlate(plate, overrides),
    getDistricts: () => US_STATES,
    findDistrict: (code: string) => findUSState(code),
    getRandomPlate: getRandomUSPlate,
  },
};

export function autoDetectCountry(input: string): CountryCode {
  const cleaned = input.trim();
  const upper = cleaned.toUpperCase();

  // If contains Thai script:
  if (/[\u0E00-\u0E7F]/.test(cleaned)) {
    return 'TH';
  }
  // If contains Japanese Kanji/Hiragana/Katakana:
  if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(cleaned)) {
    return 'JP';
  }
  // If Vietnamese format: 29A-123.45, 51H-..., 80A-...
  if (/^[0-9]{2}[A-Z]{1,2}[- ]?[0-9]{3,5}/.test(upper)) {
    return 'VN';
  }
  // If Australian state prefix or explicit state pattern:
  if (/^(NSW|VIC|QLD|WA|SA|TAS|ACT|NT)\b/i.test(upper)) {
    return 'AU';
  }
  // If Swiss military: M + digits
  if (/^M[- ]?[0-9]{4,6}$/.test(upper)) {
    return 'CH';
  }
  // If starts with Swiss canton code and numbers only, e.g. "ZH 123456"
  const swissMatch = upper.match(/^([A-Z]{2})[- ]?([0-9]{1,6})$/);
  if (swissMatch && findSwissCanton(swissMatch[1])) {
    return 'CH';
  }
  // If Austrian police/military "BP 12345" or "BH 12345"
  if (/^(BH|BP)[- ]?[0-9]{4,6}$/.test(upper)) {
    return 'AT';
  }
  // If U.S. Federal Government G-plate: G12-3456
  if (/^G[0-9]{2}[- ]?[0-9]{3,5}$/.test(upper)) {
    return 'US';
  }
  // If U.S. State explicit prefix (e.g. CA 7SAM123, TX ABC-1234, NY ABC-1234, FL 12A-BCD)
  if (/^(CA|TX|NY|FL|IL|PA|OH|MI|GA|NC|NJ|VA|WA|AZ|MA|CO)\s+[A-Z0-9]/i.test(upper)) {
    return 'US';
  }
  // If California 7-character standard pattern (1 digit + 3 letters + 3 digits, e.g. 7SAM123)
  if (/^[0-9][A-Z]{3}[0-9]{3}$/.test(upper)) {
    return 'US';
  }
  // If New Zealand: ABC 123
  if (/^[A-Z]{3}[- ]?[0-9]{3}$/.test(upper)) {
    return 'NZ';
  }

  // Default to Germany
  return 'DE';
}
