import { PlateParseResult, PlateCategory } from '../types';
import { AUSTRALIAN_STATES } from '../data/districts-au';

const stateMap = new Map<string, (typeof AUSTRALIAN_STATES)[0]>();
for (const s of AUSTRALIAN_STATES) {
  stateMap.set(s.code.toUpperCase(), s);
  stateMap.set(s.name.toUpperCase(), s);
}

export function findAustralianState(codeOrName: string) {
  return stateMap.get(codeOrName.trim().toUpperCase());
}

export function parseAustralianPlate(input: string, userOverrides?: Partial<PlateParseResult>): PlateParseResult {
  const rawInput = input;
  const cleaned = input.trim().toUpperCase().replace(/\s+/g, ' ');
  const errors: string[] = [];

  const baseResult: PlateParseResult = {
    country: 'AU',
    rawInput,
    normalizedPlate: cleaned,
    isValid: false,
    category: 'standard',
    categoryName: 'Australian Standard Registration Plate',
    categoryNameDe: 'Australisches Kfz-Kennzeichen',
    categoryDescription: 'Standard Australian vehicle registration plate issued by state/territory road authority.',
    textColor: 'black',
    backgroundColor: 'white',
    hasEuroBand: false,
    hasGermanFlag: false,
    hasYellowBand: false,
    hasRedBand: false,
    hasSeasonBand: false,
    specialPerks: [],
    legalBasis: 'National Heavy Vehicle Regulator / State Road Transport Acts',
    errors,
    fontType: 'FE',
  };

  const finalize = (res: PlateParseResult): PlateParseResult =>
    userOverrides ? { ...res, ...userOverrides } : res;

  if (!cleaned) {
    errors.push('Please enter an Australian license plate string.');
    return finalize(baseResult);
  }

  // Check if a state code was prepended (e.g. "NSW AA-12-BB" or "VIC 1AA-2BB")
  let state = AUSTRALIAN_STATES[0]; // Default NSW
  let plateWithoutState = cleaned;

  const statePrefixMatch = cleaned.match(/^(NSW|VIC|QLD|WA|SA|TAS|ACT|NT)\s+(.+)$/);
  if (statePrefixMatch) {
    const s = findAustralianState(statePrefixMatch[1]);
    if (s) state = s;
    plateWithoutState = statePrefixMatch[2];
  } else {
    // Auto-detect state by format pattern
    if (/^[A-Z]{2}[- ]?[0-9]{2}[- ]?[A-Z]{2}$/.test(cleaned)) {
      state = AUSTRALIAN_STATES.find((s) => s.code === 'NSW') || state;
    } else if (/^1[A-Z]{2}[- ]?[0-9][A-Z]{2}$/.test(cleaned)) {
      state = AUSTRALIAN_STATES.find((s) => s.code === 'VIC') || state;
    } else if (/^[0-9]{3}[- ]?[A-Z]{2}[0-9]$/.test(cleaned)) {
      state = AUSTRALIAN_STATES.find((s) => s.code === 'QLD') || state;
    } else if (/^1[A-Z]{3}[- ]?[0-9]{3}$/.test(cleaned)) {
      state = AUSTRALIAN_STATES.find((s) => s.code === 'WA') || state;
    } else if (/^S[0-9]{3}[- ]?[A-Z]{3}$/.test(cleaned)) {
      state = AUSTRALIAN_STATES.find((s) => s.code === 'SA') || state;
    } else if (/^[A-Z][- ]?[0-9]{2}[- ]?[A-Z]{2}$/.test(cleaned)) {
      state = AUSTRALIAN_STATES.find((s) => s.code === 'TAS') || state;
    } else if (/^Y[A-Z]{2}[- ]?[0-9]{2}[A-Z]$/.test(cleaned)) {
      state = AUSTRALIAN_STATES.find((s) => s.code === 'ACT') || state;
    }
  }

  // Format validation: 3 to 7 alphanumeric characters (with optional hyphens)
  const cleanAlphanumeric = plateWithoutState.replace(/[^A-Z0-9]/g, '');
  if (cleanAlphanumeric.length < 3 || cleanAlphanumeric.length > 7) {
    errors.push(`Australian registration numbers typically have between 3 and 7 characters (received ${cleanAlphanumeric.length}).`);
    return baseResult;
  }

  const textColor = (state.color as PlateParseResult['textColor']) || 'black';
  const bgColor = (state.bg as PlateParseResult['backgroundColor']) || 'white';

  return finalize({
    ...baseResult,
    isValid: true,
    category: 'standard',
    categoryName: `${state.name} State Plate`,
    categoryNameDe: `Kfz-Kennzeichen ${state.name}`,
    categoryDescription: `Official registration plate for the ${state.fullName}. Features the official state slogan "${state.slogan}".`,
    normalizedPlate: plateWithoutState,
    districtCode: state.code,
    districtName: state.name,
    state: state.name,
    stateCode: state.stateCode,
    numberPart: plateWithoutState,
    textColor,
    backgroundColor: bgColor,
    bottomLineText: state.slogan,
    specialPerks: ['Compulsory Third Party (CTP) insurance integration'],
  });
}

export function getRandomAustralianPlate(): { plate: string; category: PlateCategory } {
  const samples: { plate: string; category: PlateCategory }[] = [
    { plate: 'NSW AA-12-BB', category: 'standard' },
    { plate: 'VIC 1AA-2BB', category: 'standard' },
    { plate: 'QLD 123-AA1', category: 'standard' },
    { plate: 'WA 1AAA-123', category: 'standard' },
    { plate: 'SA S123-AAA', category: 'standard' },
    { plate: 'ACT YAA-12A', category: 'standard' },
  ];
  return samples[Math.floor(Math.random() * samples.length)];
}
