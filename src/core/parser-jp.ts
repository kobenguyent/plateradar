import { PlateParseResult, PlateCategory } from '../types';
import { JAPANESE_OFFICES } from '../data/districts-jp';

const officeMap = new Map<string, (typeof JAPANESE_OFFICES)[0]>();
for (const o of JAPANESE_OFFICES) {
  officeMap.set(o.code, o);
  const cleanName = o.name.replace(/\s*\(.*\)/, '').trim().toUpperCase();
  officeMap.set(cleanName, o);
  officeMap.set(cleanName.split(' ')[0], o);
}

export function findJapaneseOffice(codeOrName: string) {
  const norm = codeOrName.trim();
  const upper = norm.toUpperCase();
  if (officeMap.has(norm)) return officeMap.get(norm);
  if (officeMap.has(upper)) return officeMap.get(upper);
  for (const [key, val] of officeMap.entries()) {
    if (upper.includes(key) || key.includes(upper)) {
      return val;
    }
  }
  return undefined;
}

export function parseJapanesePlate(input: string, userOverrides?: Partial<PlateParseResult>): PlateParseResult {
  const rawInput = input;
  const cleaned = input.trim();
  const errors: string[] = [];

  const baseResult: PlateParseResult = {
    country: 'JP',
    rawInput,
    normalizedPlate: cleaned,
    isValid: false,
    category: 'standard',
    categoryName: 'Japanese Standard Passenger Plate',
    categoryNameDe: 'Japanisches Standard-Kennzeichen (白ナンバー)',
    categoryDescription: 'Standard Japanese passenger car registration plate (White background, Green embossed text).',
    textColor: 'green',
    backgroundColor: 'white',
    hasEuroBand: false,
    hasGermanFlag: false,
    hasYellowBand: false,
    hasRedBand: false,
    hasSeasonBand: false,
    specialPerks: [],
    legalBasis: 'Road Transport Vehicle Act of Japan (道路運送車両法)',
    errors,
    fontType: 'FE',
  };

  if (!cleaned) {
    errors.push('Please enter a Japanese license plate number.');
    return baseResult;
  }

  // 1. Diplomatic plate (外-1234 or GAI 1234)
  const diploMatch = cleaned.match(/^(外|領|DIP|GAI)[- ]?([0-9]{2,5})$/i);
  if (diploMatch) {
    const num = diploMatch[2];
    return {
      ...baseResult,
      isValid: true,
      category: 'diplomatic',
      categoryName: 'Japanese Diplomatic Plate (外ナンバー)',
      categoryNameDe: 'Diplomatenkennzeichen Japan',
      categoryDescription: 'Official diplomatic mission plate in Japan. Distinctive deep blue background with white characters.',
      normalizedPlate: `外 ${num}`,
      topLineText: '外交官 DIPLOMAT',
      numberPart: num,
      textColor: 'white',
      backgroundColor: 'blue',
      specialPerks: ['Vienna Convention diplomatic immunity and port entry privileges'],
    };
  }

  // 2. Standard or Kei car format:
  // e.g. "品川 300 さ 12-34", "横浜 580 わ 5678", "Shinagawa 300 Sa 12-34", "Osaka 500 1234"
  const jpPattern = /^([^\s0-9]+)\s*([0-9]{2,3})\s*([^\s0-9]{1,3})?\s*([0-9]{1,4}(?:-[0-9]{1,4})?|[0-9]{1,4})$/;
  const match = cleaned.match(jpPattern);

  if (match) {
    const place = match[1];
    const classNum = match[2];
    const hiragana = match[3] || 'さ';
    const numPart = match[4];

    const office = findJapaneseOffice(place);
    const placeKanji = office ? office.code : place;
    const placeRomaji = office ? office.name : place;

    // Check Kei car (軽自動車): 580-599 or 480-499 series, or user selected
    const isKei = classNum.startsWith('58') || classNum.startsWith('48') || classNum.startsWith('68') || userOverrides?.category === 'kei_car';
    const isCommercial = userOverrides?.category === 'commercial';
    const isSofaMilitary = hiragana.toUpperCase() === 'Y' || hiragana.toUpperCase() === 'A' || hiragana.toUpperCase() === 'E';

    let category: PlateCategory = 'standard';
    let catName = 'Standard Passenger Plate (White / Green)';
    let catNameDe = 'Standard Pkw-Kennzeichen (3/5er)';
    let catDesc = `Standard passenger car registered through ${placeRomaji}.`;
    let textColor: PlateParseResult['textColor'] = 'green';
    let bgColor: PlateParseResult['backgroundColor'] = 'white';
    const perks: string[] = [];

    if (isKei) {
      category = 'kei_car';
      catName = 'Kei Car Mini-Vehicle Plate (Yellow / Black)';
      catNameDe = 'Kei-Car Kennzeichen (Gelb / 軽自動車)';
      catDesc = `Yellow plate designated for Japanese mini-vehicles (Kei cars, engines ≤660cc, length ≤3.4m).`;
      textColor = 'black';
      bgColor = 'yellow';
      perks.push('Discounted Japanese motor vehicle tax (Kei-jidōshazei)');
      perks.push('Exempt from garage certificate requirement in certain rural regions');
    } else if (isCommercial) {
      category = 'commercial';
      catName = 'Commercial Vehicle Plate (Green / White)';
      catNameDe = 'Gewerbekennzeichen (Grün / 緑ナンバー)';
      catDesc = 'Commercial plate for fare-paying passenger transit (taxis, buses) and commercial logistics.';
      textColor = 'white';
      bgColor = 'green';
    }

    if (isSofaMilitary) {
      perks.push('US-Japan Status of Forces Agreement (SOFA) military registration');
    }

    return {
      ...baseResult,
      isValid: true,
      category,
      categoryName: catName,
      categoryNameDe: catNameDe,
      categoryDescription: catDesc,
      normalizedPlate: `${placeKanji} ${classNum} ${hiragana} ${numPart}`,
      topLineText: `${placeKanji} ${classNum}`,
      districtCode: placeKanji,
      districtName: placeRomaji,
      state: office ? office.state : 'Japan',
      middleLetters: hiragana,
      numberPart: numPart,
      textColor,
      backgroundColor: bgColor,
      specialPerks: perks,
    };
  }

  errors.push(`Could not parse Japanese plate "${cleaned}". Example format: "品川 300 さ 12-34", "Shinagawa 300 Sa 1234", "横浜 580 わ 5678" (Kei car).`);
  return baseResult;
}

export function getRandomJapanesePlate(): { plate: string; category: PlateCategory } {
  const samples: { plate: string; category: PlateCategory }[] = [
    { plate: '品川 300 さ 12-34', category: 'standard' },
    { plate: '横浜 580 わ 56-78', category: 'kei_car' },
    { plate: '大阪 330 な 88-88', category: 'standard' },
    { plate: '富士山 500 す 37-76', category: 'standard' },
    { plate: '沖縄 500 Y 45-67', category: 'standard' },
    { plate: '外 1234', category: 'diplomatic' },
  ];
  return samples[Math.floor(Math.random() * samples.length)];
}
