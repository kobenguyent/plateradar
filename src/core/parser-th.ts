import { PlateParseResult, PlateCategory } from '../types';
import { THAI_PROVINCES } from '../data/districts-th';

const provinceMap = new Map<string, (typeof THAI_PROVINCES)[0]>();
for (const p of THAI_PROVINCES) {
  provinceMap.set(p.code.toUpperCase(), p);
  const cleanName = p.name.replace(/\s*\(.*\)/, '').trim().toUpperCase();
  provinceMap.set(cleanName, p);
  provinceMap.set(cleanName.split(' ')[0], p);
  const thaiName = p.fullName.split(' ')[0].trim();
  provinceMap.set(thaiName, p);
}

export function findThaiProvince(nameOrCode: string) {
  const norm = nameOrCode.trim().toUpperCase();
  if (provinceMap.has(norm)) return provinceMap.get(norm)!;
  for (const [key, val] of provinceMap.entries()) {
    if (norm.includes(key) || key.includes(norm)) {
      return val;
    }
  }
  return THAI_PROVINCES[0]; // defaults to Bangkok
}

export function parseThaiPlate(input: string, userOverrides?: Partial<PlateParseResult>): PlateParseResult {
  const rawInput = input;
  const cleaned = input.trim();
  const errors: string[] = [];

  const baseResult: PlateParseResult = {
    country: 'TH',
    rawInput,
    normalizedPlate: cleaned,
    isValid: false,
    category: 'standard',
    categoryName: 'Thai Private Passenger Plate',
    categoryNameDe: 'Thailändisches Standard-Kennzeichen (ป้ายขาว)',
    categoryDescription: 'Standard private passenger vehicle plate under the Department of Land Transport (DLT).',
    textColor: 'black',
    backgroundColor: 'white',
    hasEuroBand: false,
    hasGermanFlag: false,
    hasYellowBand: false,
    hasRedBand: false,
    hasSeasonBand: false,
    bottomLineText: 'กรุงเทพมหานคร (Bangkok)',
    specialPerks: [],
    legalBasis: 'Motor Vehicle Act of Thailand B.E. 2522 (พ.ร.บ. รถยนต์)',
    errors,
    fontType: 'FE',
  };

  if (!cleaned) {
    errors.push('Please enter a Thai license plate number.');
    return baseResult;
  }

  // Temporary plate "ป้ายแดง" (Red plate with black text)
  const isRedPlate = cleaned.includes('แดง') || cleaned.includes('RED') || userOverrides?.category === 'short_term';
  if (isRedPlate) {
    const numPart = cleaned.replace(/[^0-9]/g, '') || '9999';
    return {
      ...baseResult,
      isValid: true,
      category: 'short_term',
      categoryName: 'Thai Temporary Plate (ป้ายแดง)',
      categoryNameDe: 'Rotes Überführungskennzeichen (Thailand)',
      categoryDescription: 'Red temporary plate issued for new vehicles before official permanent registration. Restricted to daytime travel unless police logbook permit is approved.',
      normalizedPlate: `ก-${numPart} ป้ายแดง`,
      numberPart: numPart,
      textColor: 'black',
      backgroundColor: 'red',
      bottomLineText: 'กรุงเทพมหานคร',
      specialPerks: ['Temporary operation for new vehicles (max 30 days)'],
    };
  }

  // Format: [Prefix 1-3 chars (letters or digit+letters)] [Space or dash] [1-4 digits] [Optional Province]
  // e.g. "1กข 1234 กรุงเทพมหานคร", "1กข 1234", "กข 1234", "1AB 1234 Bangkok", "7กก 9999"
  const thaiMatch = cleaned.match(/^([0-9]?[^\s0-9]{1,3}|[A-Z0-9]{2,4})\s*([0-9]{1,4})(?:\s+(.*))?$/);

  if (thaiMatch) {
    const prefix = thaiMatch[1];
    const number = thaiMatch[2];
    const provinceQuery = thaiMatch[3] || 'Bangkok';

    const prov = findThaiProvince(provinceQuery);

    let textColor: PlateParseResult['textColor'] = 'black';
    let bgColor: PlateParseResult['backgroundColor'] = 'white';
    let category: PlateCategory = 'standard';
    let catName = 'Private Passenger Sedan (White / Black)';
    let catNameDe = 'Privater Pkw (Weiß / Schwarz)';

    if (userOverrides?.textColor === 'green' || userOverrides?.category === 'commercial') {
      textColor = 'green';
      category = 'commercial';
      catName = 'Private Pickup Truck (White / Green)';
      catNameDe = 'Privater Pick-up (Weiß / Grün)';
    } else if (userOverrides?.textColor === 'blue') {
      textColor = 'blue';
      catName = 'Private Passenger Van >7 Seats (White / Blue)';
      catNameDe = 'Privater Van / Minibus (Weiß / Blau)';
    } else if (userOverrides?.backgroundColor === 'yellow') {
      bgColor = 'yellow';
      textColor = 'black';
      category = 'commercial';
      catName = 'Public Transport / Taxi (Yellow / Black)';
      catNameDe = 'Öffentliches Taxi (Gelb / Schwarz)';
    }

    return {
      ...baseResult,
      isValid: true,
      category,
      categoryName: catName,
      categoryNameDe: catNameDe,
      normalizedPlate: `${prefix} ${number}`,
      districtCode: prov.code,
      districtName: prov.name.replace(/\s*\(.*\)/, '').trim(),
      state: prov.state,
      middleLetters: prefix,
      numberPart: number,
      bottomLineText: prov.fullName.split(' ')[0],
      textColor,
      backgroundColor: bgColor,
      specialPerks: ['Official annual vehicle tax disc issued by Department of Land Transport (DLT)'],
    };
  }

  errors.push(`Could not parse Thai plate "${cleaned}". Example format: "1กข 1234", "กข 5678", "1AB 1234 Bangkok", "ป้ายแดง 9999" (Red plate).`);
  return baseResult;
}

export function getRandomThaiPlate(): { plate: string; category: PlateCategory } {
  const samples: { plate: string; category: PlateCategory }[] = [
    { plate: '1กข 1234 Bangkok', category: 'standard' },
    { plate: '8กก 8888 Bangkok', category: 'standard' },
    { plate: '2ขค 5678 Chiang Mai', category: 'standard' },
    { plate: 'ก-9999 แดง', category: 'short_term' },
    { plate: '3ขง 4040 Phuket', category: 'standard' },
  ];
  return samples[Math.floor(Math.random() * samples.length)];
}
