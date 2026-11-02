import { PlateParseResult, PlateCategory } from '../types';
import { VIETNAMESE_PROVINCES } from '../data/districts-vn';

const provinceMap = new Map<string, (typeof VIETNAMESE_PROVINCES)[0]>();
for (const p of VIETNAMESE_PROVINCES) {
  provinceMap.set(p.code, p);
}

export function findVietnameseProvince(code: string) {
  return provinceMap.get(code.trim());
}

export function parseVietnamesePlate(input: string, userOverrides?: Partial<PlateParseResult>): PlateParseResult {
  const rawInput = input;
  const cleaned = input.trim().toUpperCase().replace(/\s+/g, ' ');
  const errors: string[] = [];

  const baseResult: PlateParseResult = {
    country: 'VN',
    rawInput,
    normalizedPlate: cleaned,
    isValid: false,
    category: 'standard',
    categoryName: 'Vietnamese Civil Vehicle Plate (Biển Trắng)',
    categoryNameDe: 'Vietnamesisches Pkw-Kennzeichen (Zivil)',
    categoryDescription: 'Standard civilian vehicle registration plate under the Traffic Police Department (Cục Cảnh sát giao thông).',
    textColor: 'black',
    backgroundColor: 'white',
    hasEuroBand: false,
    hasGermanFlag: false,
    hasYellowBand: false,
    hasRedBand: false,
    hasSeasonBand: false,
    specialPerks: [],
    legalBasis: 'Circular 24/2023/TT-BCA of the Ministry of Public Security (Thông tư 24/2023/TT-BCA)',
    errors,
    fontType: 'FE',
  };

  if (!cleaned) {
    errors.push('Please enter a Vietnamese license plate string.');
    return baseResult;
  }

  // 1. Military Vehicles (Quân đội: QA-12-34, TM-12-34)
  const militaryMatch = cleaned.match(/^([A-Z]{2})[- ]?([0-9]{2})[- ]?([0-9]{2})$/);
  if (militaryMatch) {
    const unit = militaryMatch[1];
    const nums = `${militaryMatch[2]}-${militaryMatch[3]}`;
    return {
      ...baseResult,
      isValid: true,
      category: 'federal_armed_forces',
      categoryName: 'Vietnam People’s Army Military Plate (Biển Đỏ)',
      categoryNameDe: 'Militärkennzeichen Vietnam (Rot / Weiß)',
      categoryDescription: `Official vehicle of the Vietnam People’s Army (Quân đội Nhân dân Việt Nam). Unit prefix "${unit}". Red background with white embossed characters.`,
      normalizedPlate: `${unit}-${nums}`,
      districtCode: unit,
      districtName: 'Bộ Quốc Phòng (Ministry of National Defence)',
      state: 'Quân đội',
      numberPart: nums,
      textColor: 'white',
      backgroundColor: 'red',
      specialPerks: ['Exempt from standard civil road toll booths (BOT) during military missions'],
    };
  }

  // 2. Standard format: [Province Code 2 digits] [Series Letter 1-2] [- or space] [4-5 digits with dot or clean]
  // e.g. "30A-123.45", "51H 999.99", "80A-001.01", "29B-1234"
  const standardMatch = cleaned.match(/^([0-9]{2})([A-Z]{1,2})[- ]?([0-9]{3,5}(?:\.[0-9]{2})?|[0-9]{4,5})$/);
  if (standardMatch) {
    const provCode = standardMatch[1];
    const series = standardMatch[2];
    const numPart = standardMatch[3];

    const prov = findVietnameseProvince(provCode);
    if (!prov) {
      errors.push(`Vietnamese province code "${provCode}" is unrecognized.`);
      return { ...baseResult, districtCode: provCode, middleLetters: series, numberPart: numPart, errors };
    }

    // Blue Plate: Code 80 or user selected
    const isGovBlue = provCode === '80' || userOverrides?.backgroundColor === 'blue' || userOverrides?.category === 'government';
    // Yellow Plate: Commercial transport (Circular 58/2020)
    const isCommercialYellow = userOverrides?.backgroundColor === 'yellow' || userOverrides?.category === 'commercial';

    let textColor: PlateParseResult['textColor'] = 'black';
    let bgColor: PlateParseResult['backgroundColor'] = 'white';
    let category: PlateCategory = 'standard';
    let catName = 'Civilian Private Vehicle Plate (Biển Trắng)';
    let catNameDe = 'Privates Kfz-Kennzeichen (Weiß / Schwarz)';
    const perks: string[] = [];

    if (isGovBlue) {
      category = 'government';
      catName = 'State & Government Authority Plate (Biển Xanh 80)';
      catNameDe = 'Behördenkennzeichen (Blau / Weiß)';
      textColor = 'white';
      bgColor = 'blue';
      perks.push('Priority rights under the Law on Road Traffic when executing urgent official duties');
    } else if (isCommercialYellow) {
      category = 'commercial';
      catName = 'Commercial Transport Business Plate (Biển Vàng)';
      catNameDe = 'Gewerbliches Kennzeichen (Gelb / Schwarz)';
      textColor = 'black';
      bgColor = 'yellow';
      perks.push('Commercial transport operating license under Department of Transport');
    }

    return {
      ...baseResult,
      isValid: true,
      category,
      categoryName: catName,
      categoryNameDe: catNameDe,
      normalizedPlate: `${provCode}${series}-${numPart}`,
      districtCode: provCode,
      districtName: prov.name,
      state: prov.state,
      middleLetters: series,
      numberPart: numPart,
      textColor,
      backgroundColor: bgColor,
      specialPerks: perks,
    };
  }

  errors.push(`Could not parse Vietnamese plate "${cleaned}". Example format: "30A-123.45", "51H-999.99", "80A-001.01" (Blue government), "QA-12-34" (Military red).`);
  return baseResult;
}

export function getRandomVietnamesePlate(): { plate: string; category: PlateCategory } {
  const samples: { plate: string; category: PlateCategory }[] = [
    { plate: '30A-123.45', category: 'standard' },
    { plate: '51H-888.88', category: 'standard' },
    { plate: '80A-001.01', category: 'government' },
    { plate: '43A-567.89', category: 'standard' },
    { plate: 'QA-12-34', category: 'federal_armed_forces' },
  ];
  return samples[Math.floor(Math.random() * samples.length)];
}
