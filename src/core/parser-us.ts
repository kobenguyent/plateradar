import { PlateParseResult, PlateCategory } from '../types';
import { US_STATES, USStateDistrict } from '../data/districts-us';

const stateMap = new Map<string, USStateDistrict>();
for (const s of US_STATES) {
  stateMap.set(s.code.toUpperCase(), s);
  stateMap.set(s.name.toUpperCase(), s);
  stateMap.set(s.fullName.toUpperCase(), s);
}

export function findUSState(codeOrName: string): USStateDistrict | undefined {
  const norm = codeOrName.trim().toUpperCase();
  if (stateMap.has(norm)) return stateMap.get(norm);
  for (const [key, val] of stateMap.entries()) {
    if (norm.includes(key) || key.includes(norm)) {
      return val;
    }
  }
  return undefined;
}

export function parseUSPlate(input: string, userOverrides?: Partial<PlateParseResult>): PlateParseResult {
  const rawInput = input;
  const cleaned = input.trim().replace(/\s+/g, ' ');
  const upper = cleaned.toUpperCase();
  const errors: string[] = [];

  const baseResult: PlateParseResult = {
    country: 'US',
    rawInput,
    normalizedPlate: cleaned,
    isValid: false,
    category: 'standard',
    categoryName: 'U.S. Standard State Registration Plate',
    categoryNameDe: 'US-Kennzeichen (Bundesstaat)',
    categoryDescription: 'Standard motor vehicle registration plate issued by a state Department of Motor Vehicles (DMV).',
    textColor: 'black',
    backgroundColor: 'white',
    hasEuroBand: false,
    hasGermanFlag: false,
    hasYellowBand: false,
    hasRedBand: false,
    hasSeasonBand: false,
    specialPerks: [],
    legalBasis: 'State Motor Vehicle Code & Federal Motor Carrier Safety Administration (FMCSA)',
    errors,
    fontType: 'FE',
  };

  if (!cleaned) {
    errors.push('Please enter a U.S. license plate number.');
    return baseResult;
  }

  // 1. U.S. Department of State Diplomatic Plate (OFM: D 1234, C 1234, S 1234)
  const diploMatch = upper.match(/^(?:US\s+)?(D|C|S|A)[- ]?([0-9]{3,5})$/);
  if (diploMatch || userOverrides?.category === 'diplomatic') {
    const prefix = diploMatch ? diploMatch[1] : 'D';
    const num = diploMatch ? diploMatch[2] : upper.replace(/[^0-9]/g, '') || '1234';
    const title = prefix === 'D' ? 'Diplomat' : prefix === 'C' ? 'Consul' : 'Administrative Staff';

    return {
      ...baseResult,
      isValid: true,
      category: 'diplomatic',
      categoryName: `U.S. Diplomatic Plate (${title})`,
      categoryNameDe: 'Diplomatenkennzeichen USA (OFM)',
      categoryDescription: 'Official diplomatic registration issued by the U.S. Department of State Office of Foreign Missions (OFM). Distinctive blue header and red footer.',
      normalizedPlate: `${prefix} ${num}`,
      topLineText: 'UNITED STATES OF AMERICA',
      bottomLineText: 'ISSUED BY U.S. DEPT OF STATE',
      districtCode: 'DOS',
      districtName: 'U.S. Department of State (OFM)',
      state: 'Federal / Diplomatic',
      numberPart: `${prefix} ${num}`,
      textColor: 'blue',
      backgroundColor: 'white',
      specialPerks: [
        'Vienna Convention on Diplomatic Relations immunity',
        'Exempt from state and local sales tax',
        'Exempt from local parking meter enforcement fees under federal jurisdiction',
      ],
    };
  }

  // 2. U.S. Federal Government Official Vehicle (G-Plate, e.g. G12-3456 or G11-0001)
  const govMatch = upper.match(/^G([0-9]{2})[- ]?([0-9]{3,5})$/);
  if (govMatch || userOverrides?.category === 'government') {
    const num = govMatch ? `G${govMatch[1]}-${govMatch[2]}` : upper;
    return {
      ...baseResult,
      isValid: true,
      category: 'government',
      categoryName: 'U.S. Federal Government Vehicle (GSA Fleet)',
      categoryNameDe: 'Behördenkennzeichen US-Bundesregierung',
      categoryDescription: 'Official vehicle owned or leased by federal civilian agencies via the General Services Administration (GSA Fleet).',
      normalizedPlate: num,
      topLineText: 'U.S. GOVERNMENT',
      bottomLineText: 'FOR OFFICIAL USE ONLY',
      districtCode: 'USG',
      districtName: 'General Services Administration (GSA)',
      state: 'Federal Government',
      numberPart: num,
      textColor: 'blue',
      backgroundColor: 'white',
      specialPerks: [
        'Exempt from state registration fees and motor vehicle excise taxes',
        'Federally insured under General Services Administration fleet management',
      ],
    };
  }

  // 3. State prefix or format detection:
  // e.g. "CA 7SAM123", "CALIFORNIA 1ABC234", "TX ABC-1234", "FL 12A-BCD", "NY ABC-1234"
  let matchedState: USStateDistrict = US_STATES[4]; // Default California
  let serialText = upper;

  // Check if state is prepended (e.g. "CA 7SAM123" or "TEXAS 123-ABC")
  const statePrefixMatch = upper.match(/^([A-Z]{2}|[A-Z\s]{4,15})\s+(.+)$/);
  if (statePrefixMatch) {
    const candidate = findUSState(statePrefixMatch[1]);
    if (candidate) {
      matchedState = candidate;
      serialText = statePrefixMatch[2];
    }
  } else {
    // Auto-detect state by format pattern:
    // California: 1 digit + 3 letters + 3 digits (e.g. 7SAM123, 1ABC234)
    if (/^[0-9][A-Z]{3}[0-9]{3}$/.test(upper)) {
      matchedState = US_STATES.find((s) => s.code === 'CA') || matchedState;
    }
    // Texas: 3 letters + hyphen/space + 4 digits (e.g. ABC-1234)
    else if (/^[A-Z]{3}[- ]?[0-9]{4}$/.test(upper)) {
      matchedState = US_STATES.find((s) => s.code === 'TX') || matchedState;
    }
    // Florida: 3 letters + space + 2 letters/digits (e.g. ABC D12, 12A BCD)
    else if (/^[0-9]{2}[A-Z][- ]?[A-Z0-9]{3}$/.test(upper)) {
      matchedState = US_STATES.find((s) => s.code === 'FL') || matchedState;
    }
  }

  // Check Antique / Classic
  const isAntique = upper.includes('ANTIQUE') || upper.includes('HISTORIC') || userOverrides?.category === 'classic';

  // Clean serial text (if antique/historic tag is embedded, strip it for length validation)
  const effectiveSerial = isAntique ? serialText.replace(/\b(ANTIQUE|HISTORIC)\b/g, '').trim() || serialText : serialText;
  const cleanAlphanumeric = effectiveSerial.replace(/[^A-Z0-9]/g, '');
  if (cleanAlphanumeric.length < 1 || cleanAlphanumeric.length > 8) {
    errors.push(`U.S. license plate registration serials typically have between 1 and 8 characters (received ${cleanAlphanumeric.length}).`);
    return baseResult;
  }
  let category: PlateCategory = isAntique ? 'classic' : 'standard';
  let catName = isAntique ? `${matchedState.name} Antique Vehicle Plate` : `${matchedState.name} Standard Issue Plate`;
  let catDesc = isAntique
    ? `Designated for historic motor vehicles over 25 years old registered in ${matchedState.name}.`
    : `Official motor vehicle registration issued by the ${matchedState.fullName} Department of Motor Vehicles.`;

  const perks: string[] = isAntique
    ? [
        'Exempt from biennial smog and emissions testing in most counties',
        'Reduced annual vehicle registration and licensing fees',
      ]
    : [
        'State highway patrol valid registration & toll tag transponder compatibility',
        'Annual DMV sticker decal validation',
      ];

  const textColor = matchedState.code === 'CA' ? 'black' : matchedState.code === 'NY' ? 'blue' : 'black';

  return {
    ...baseResult,
    isValid: true,
    category,
    categoryName: catName,
    categoryNameDe: `Kfz-Kennzeichen ${matchedState.name}`,
    categoryDescription: catDesc,
    normalizedPlate: serialText,
    topLineText: matchedState.name.toUpperCase(),
    bottomLineText: matchedState.slogan,
    districtCode: matchedState.code,
    districtName: matchedState.name,
    state: matchedState.name,
    stateCode: matchedState.stateCode,
    numberPart: serialText,
    textColor,
    backgroundColor: 'white',
    specialPerks: perks,
  };
}

export function getRandomUSPlate(): { plate: string; category: PlateCategory } {
  const samples: { plate: string; category: PlateCategory }[] = [
    { plate: 'CA 7SAM123', category: 'standard' },
    { plate: 'TX ABC-1234', category: 'standard' },
    { plate: 'NY 123-ABCD', category: 'standard' },
    { plate: 'FL 12A-BCD', category: 'standard' },
    { plate: 'WA BCD-1234', category: 'standard' },
    { plate: 'D 1234', category: 'diplomatic' },
    { plate: 'G12-3456', category: 'government' },
    { plate: 'CALI-EV', category: 'standard' },
  ];
  return samples[Math.floor(Math.random() * samples.length)];
}
