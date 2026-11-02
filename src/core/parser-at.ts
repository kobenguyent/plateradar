import { PlateParseResult, PlateCategory } from '../types';
import { AUSTRIAN_DISTRICTS } from '../data/districts-at';

const districtMap = new Map<string, (typeof AUSTRIAN_DISTRICTS)[0]>();
for (const d of AUSTRIAN_DISTRICTS) {
  districtMap.set(d.code.toUpperCase(), d);
}

export function findAustrianDistrict(code: string) {
  return districtMap.get(code.toUpperCase());
}

export function parseAustrianPlate(input: string, userOverrides?: Partial<PlateParseResult>): PlateParseResult {
  const rawInput = input;
  const cleaned = input.trim().toUpperCase().replace(/\s+/g, ' ');
  const errors: string[] = [];

  const baseResult: PlateParseResult = {
    country: 'AT',
    rawInput,
    normalizedPlate: cleaned,
    isValid: false,
    category: 'unknown',
    categoryName: 'Unknown',
    categoryNameDe: 'Unbekanntes Kennzeichen',
    categoryDescription: 'The plate format could not be recognized as a valid Austrian license plate.',
    textColor: 'black',
    hasEuroBand: true,
    hasGermanFlag: false,
    hasYellowBand: false,
    hasRedBand: false,
    hasSeasonBand: false,
    specialPerks: [],
    legalBasis: 'Kraftfahrgesetz 1967 (KFG)',
    errors,
    fontType: 'FE',
    badgeStateCode: 'W',
  };

  if (!cleaned) {
    errors.push('Please enter an Austrian license plate.');
    return baseResult;
  }

  // Official Austrian Plates: BP (Bundespolizei), BH (Bundesheer), FW (Feuerwehr), RD (Rettungsdienst)
  const officialMatch = cleaned.match(/^(BH|BP|FV|WD)[- ]?([0-9]{3,6})$/);
  if (officialMatch) {
    const code = officialMatch[1];
    const num = officialMatch[2];
    const isMilitary = code === 'BH';
    const isPolice = code === 'BP';

    return {
      ...baseResult,
      isValid: true,
      category: isMilitary ? 'federal_armed_forces' : isPolice ? 'federal_police' : 'standard',
      categoryName: isMilitary ? 'Austrian Armed Forces (Bundesheer)' : isPolice ? 'Austrian Federal Police (Bundespolizei)' : 'Federal Authority',
      categoryNameDe: isMilitary ? 'Österreichisches Bundesheer' : isPolice ? 'Österreichische Bundespolizei' : 'Bundesbehörde',
      categoryDescription: `Official government plate for the ${isMilitary ? 'Austrian Armed Forces (Bundesheer)' : 'Federal Police (Bundespolizei)'}. Displays the federal coat of arms of the Republic of Austria.`,
      normalizedPlate: `${code} ${num}`,
      districtCode: code,
      districtName: isMilitary ? 'Bundesministerium für Landesverteidigung (Bundesheer)' : 'Bundesministerium für Inneres (Bundespolizei)',
      state: 'Bund',
      stateCode: 'W',
      badgeStateCode: 'W',
      numberPart: num,
      specialPerks: ['Priority emergency response rights under § 26 StVO'],
    };
  }

  // Standard Austrian Plate format:
  // e.g. "W 12345 A", "S 456 BC", "MD 789 EF", "L 100 EV"
  // Or Official State Plates / Numbers: "O 320 320", "O 1", "W 123456"
  const standardMatch = cleaned.match(/^([A-Z]{1,2})[- ]?([0-9]{1,5})[- ]?([A-Z]{1,3})$|^([A-Z]{1,2})[- ]?([0-9]{1,3})[- ]?([0-9]{1,4})$|^([A-Z]{1,2})[- ]?([0-9]{1,6})$/);
  if (standardMatch) {
    const distCode = standardMatch[1] || standardMatch[4] || standardMatch[7];
    const num = standardMatch[2] || (standardMatch[5] ? `${standardMatch[5]} ${standardMatch[6]}` : standardMatch[8]);
    const letters = standardMatch[3] || '';

    const dist = findAustrianDistrict(distCode);
    if (!dist) {
      errors.push(`Austrian district code "${distCode}" is unrecognized.`);
      return { ...baseResult, districtCode: distCode, numberPart: num, middleLetters: letters, errors };
    }

    // In Austria, green lettering indicates electric vehicles!
    const isElectric = userOverrides?.textColor === 'green' || userOverrides?.category === 'electric' || letters.endsWith('E') || letters.endsWith('EV');
    const textColor = isElectric ? 'green' : 'black';

    // State leadership plate (e.g. O 1, O 320 320, W 1)
    const isStateGov = ['O', 'W', 'N', 'ST', 'K', 'S', 'T', 'B', 'V'].includes(distCode) && !letters;

    return {
      ...baseResult,
      isValid: true,
      category: isElectric ? 'electric' : 'standard',
      categoryName: isElectric
        ? 'Austrian Electric Plate (Grüne Schrift)'
        : isStateGov
        ? `Austrian State Authority Plate (${dist.state})`
        : 'Austrian Standard Plate',
      categoryNameDe: isElectric
        ? 'E-Kennzeichen (Grüne Schrift)'
        : isStateGov
        ? `Landesbehörde / Landesregierung (${dist.state})`
        : 'Österreichisches Standard-Kennzeichen',
      categoryDescription: isElectric
        ? 'Austrian electric vehicle plate featuring distinctive green lettering and state coat of arms. Exempt from IG-L speed limits on designated motorways.'
        : `Official Austrian registration plate for ${dist.fullName}. Displays the official state coat of arms of ${dist.state}.`,
      normalizedPlate: `${distCode} ${num}${letters ? ` ${letters}` : ''}`,
      districtCode: distCode,
      districtName: dist.name,
      state: dist.state,
      stateCode: dist.stateCode,
      badgeStateCode: dist.stateCode,
      middleLetters: letters || undefined,
      numberPart: num,
      textColor,
      specialPerks: isElectric ? ['Exempt from IG-L 100 km/h speed limits on motorways', 'Free municipal parking in cities like Klagenfurt and Linz'] : [],
      alternateSuggestion: distCode === 'O' ? {
        country: 'DE',
        label: 'Looking for German AMLA diplomatic plate 0 320-320?',
        query: `0 ${num.replace(/\s+/g, '-')}`,
      } : undefined,
    };
  }

  errors.push(`Could not parse Austrian plate "${cleaned}". Example format: "W 12345 A", "O 320 320", "S 911 GT", "BP 12345".`);
  return baseResult;
}

export function getRandomAustrianPlate(): { plate: string; category: PlateCategory } {
  const samples: { plate: string; category: PlateCategory }[] = [
    { plate: 'W 12345 A', category: 'standard' },
    { plate: 'O 320 320', category: 'standard' },
    { plate: 'S 911 GT', category: 'standard' },
    { plate: 'L 4040 E', category: 'electric' },
    { plate: 'MD 888 EF', category: 'standard' },
    { plate: 'BP 12345', category: 'federal_police' },
    { plate: 'BH 67890', category: 'federal_armed_forces' },
  ];
  return samples[Math.floor(Math.random() * samples.length)];
}
