import { PlateParseResult, PlateCategory } from '../types';
import { SWISS_CANTONS } from '../data/districts-ch';

const cantonMap = new Map<string, (typeof SWISS_CANTONS)[0]>();
for (const c of SWISS_CANTONS) {
  cantonMap.set(c.code.toUpperCase(), c);
}

export function findSwissCanton(code: string) {
  return cantonMap.get(code.toUpperCase());
}

export function parseSwissPlate(input: string): PlateParseResult {
  const rawInput = input;
  const cleaned = input.trim().toUpperCase();
  const errors: string[] = [];

  const baseResult: PlateParseResult = {
    country: 'CH',
    rawInput,
    normalizedPlate: cleaned,
    isValid: false,
    category: 'unknown',
    categoryName: 'Unknown',
    categoryNameDe: 'Unbekanntes Kontrollschild',
    categoryDescription: 'The plate format could not be recognized as a valid Swiss license plate.',
    textColor: 'black',
    hasEuroBand: false,
    hasGermanFlag: false,
    hasYellowBand: false,
    hasRedBand: false,
    hasSeasonBand: false,
    specialPerks: [],
    legalBasis: 'Verkehrsversicherungsverordnung (VVV) / Art. 84 VZV',
    errors,
    fontType: 'FE',
    badgeStateCode: 'ZH',
  };

  if (!cleaned) {
    errors.push('Please enter a Swiss license plate number.');
    return baseResult;
  }

  // 1. Swiss Military (M+numbers, e.g. M 12345 or M-123456)
  const militaryMatch = cleaned.match(/^M[- ]?([0-9]{1,6})$/);
  if (militaryMatch) {
    const num = militaryMatch[1];
    return {
      ...baseResult,
      isValid: true,
      category: 'federal_armed_forces',
      categoryName: 'Swiss Armed Forces (Schweizer Armee)',
      categoryNameDe: 'Militärfahrzeug der Schweizer Armee',
      categoryDescription: 'Official military vehicle of the Swiss Armed Forces (Armee-Kontrollschild). Displays the Swiss national cross on the left and black lettering on white background.',
      normalizedPlate: `M ${num}`,
      districtCode: 'M',
      districtName: 'Schweizer Armee (Logistikbasis der Armee)',
      state: 'Bund',
      stateCode: 'CH',
      badgeStateCode: 'CH',
      numberPart: num,
      specialPerks: ['Exempt from Swiss motorway vignette and heavy vehicle fee (LSVA)'],
    };
  }

  // 2. Standard Swiss Cantonal Plate: [Canton 2 letters] [1-6 digits], e.g. "ZH 854123"
  const standardMatch = cleaned.match(/^([A-Z]{2})[- ]?([0-9]{1,6})$/);
  if (standardMatch) {
    const cantonCode = standardMatch[1];
    const num = standardMatch[2];
    const canton = findSwissCanton(cantonCode);

    if (!canton) {
      errors.push(`Swiss canton code "${cantonCode}" is unrecognized.`);
      return { ...baseResult, districtCode: cantonCode, numberPart: num, errors };
    }

    return {
      ...baseResult,
      isValid: true,
      category: 'standard',
      categoryName: 'Swiss Cantonal Plate (Kontrollschild)',
      categoryNameDe: 'Schweizer Kontrollschild',
      categoryDescription: `Standard Swiss vehicle registration plate for ${canton.fullName}. Features the Swiss federal cross on the left and the official cantonal coat of arms on the right.`,
      normalizedPlate: `${cantonCode} ${num}`,
      districtCode: cantonCode,
      districtName: canton.name,
      state: canton.state,
      stateCode: canton.stateCode,
      badgeStateCode: canton.stateCode,
      numberPart: num,
      specialPerks: ['Transferable plate system: One plate pair can be used alternately between 2 vehicles (Wechselschild)'],
    };
  }

  errors.push(`Could not parse Swiss plate "${cleaned}". Example format: "ZH 854123", "BE 12345", "GE 9000".`);
  return baseResult;
}

export function getRandomSwissPlate(): { plate: string; category: PlateCategory } {
  const samples: { plate: string; category: PlateCategory }[] = [
    { plate: 'ZH 854123', category: 'standard' },
    { plate: 'BE 12345', category: 'standard' },
    { plate: 'GE 999111', category: 'standard' },
    { plate: 'TI 45678', category: 'standard' },
    { plate: 'M 12345', category: 'federal_armed_forces' },
  ];
  return samples[Math.floor(Math.random() * samples.length)];
}
