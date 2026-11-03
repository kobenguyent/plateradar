import { PlateParseResult, PlateCategory } from '../types';

export function parseNewZealandPlate(input: string, userOverrides?: Partial<PlateParseResult>): PlateParseResult {
  const rawInput = input;
  const cleaned = input.trim().toUpperCase().replace(/\s+/g, '');
  const errors: string[] = [];

  const baseResult: PlateParseResult = {
    country: 'NZ',
    rawInput,
    normalizedPlate: cleaned,
    isValid: false,
    category: 'standard',
    categoryName: 'New Zealand Standard Registration Plate',
    categoryNameDe: 'Neuseeländisches Kfz-Kennzeichen',
    categoryDescription: 'Official New Zealand vehicle registration plate issued by Waka Kotahi (NZ Transport Agency).',
    textColor: 'black',
    backgroundColor: 'white',
    hasEuroBand: false,
    hasGermanFlag: false,
    hasYellowBand: false,
    hasRedBand: false,
    hasSeasonBand: false,
    bottomLineText: 'NEW ZEALAND',
    specialPerks: [],
    legalBasis: 'Land Transport Act 1998 / Waka Kotahi NZTA',
    errors,
    fontType: 'FE',
  };

  const finalize = (res: PlateParseResult): PlateParseResult =>
    userOverrides ? { ...res, ...userOverrides } : res;

  if (!cleaned) {
    errors.push('Please enter a New Zealand license plate string.');
    return finalize(baseResult);
  }

  // 1. Current standard format: 3 letters + 3 digits (e.g. "ABC123", "KOB789")
  const standardMatch = cleaned.match(/^([A-Z]{3})([0-9]{3})$/);
  if (standardMatch) {
    const letters = standardMatch[1];
    const nums = standardMatch[2];
    return finalize({
      ...baseResult,
      isValid: true,
      category: 'standard',
      categoryName: 'Standard New Zealand Series (ABC 123)',
      categoryNameDe: 'Standard-Serie Neuseeland (3 Buchstaben + 3 Ziffern)',
      categoryDescription: 'Standard issue series introduced in 2001, printed on reflective aluminum with embossed characters.',
      normalizedPlate: `${letters} ${nums}`,
      districtCode: 'NZ',
      districtName: 'Waka Kotahi NZTA (National)',
      state: 'New Zealand',
      middleLetters: letters,
      numberPart: nums,
      specialPerks: ['Continuous vehicle licensing (rego) & WoF integration'],
    });
  }

  // 2. Legacy pre-2001 format: 2 letters + 4 digits (e.g. "AA1234", "ZZ9999")
  const legacyMatch = cleaned.match(/^([A-Z]{2})([0-9]{4})$/);
  if (legacyMatch) {
    const letters = legacyMatch[1];
    const nums = legacyMatch[2];
    return finalize({
      ...baseResult,
      isValid: true,
      category: 'classic',
      categoryName: 'Legacy Pre-2001 Series (AA 1234)',
      categoryNameDe: 'Klassische Vor-2001-Serie (2 Buchstaben + 4 Ziffern)',
      categoryDescription: 'Historic series issued between 1964 and 2001, fully transferable and road legal.',
      normalizedPlate: `${letters} ${nums}`,
      districtCode: 'NZ',
      districtName: 'Waka Kotahi NZTA (Legacy)',
      state: 'New Zealand',
      middleLetters: letters,
      numberPart: nums,
    });
  }

  // 3. Personalised plate (1 to 6 characters, e.g. "KIWI", "TURBO", "KOBET")
  const personalisedMatch = cleaned.match(/^[A-Z0-9]{1,6}$/);
  if (personalisedMatch) {
    return finalize({
      ...baseResult,
      isValid: true,
      category: 'standard',
      categoryName: 'Personalised KiwiPlate',
      categoryNameDe: 'Individuelles Wunschkennzeichen (KiwiPlate)',
      categoryDescription: 'Official custom personalised plate issued via KiwiPlates. Can be transferred between vehicles or held as an investment asset.',
      normalizedPlate: cleaned,
      districtCode: 'NZ',
      districtName: 'KiwiPlates / Waka Kotahi',
      state: 'New Zealand',
      numberPart: cleaned,
      specialPerks: ['Lifetime ownership rights and transferable asset status'],
    });
  }

  errors.push(`Could not parse New Zealand plate "${cleaned}". Standard format: "ABC 123" (e.g. "KOB 789"), legacy "AA 1234", or custom personalised "KIWI".`);
  return finalize(baseResult);
}

export function getRandomNewZealandPlate(): { plate: string; category: PlateCategory } {
  const samples: { plate: string; category: PlateCategory }[] = [
    { plate: 'ABC 123', category: 'standard' },
    { plate: 'KOB 789', category: 'standard' },
    { plate: 'AA 1234', category: 'classic' },
    { plate: 'KIWI', category: 'standard' },
    { plate: 'EV 2026', category: 'standard' },
  ];
  return samples[Math.floor(Math.random() * samples.length)];
}
