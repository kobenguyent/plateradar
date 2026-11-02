import { PlateParseResult, PlateCategory } from '../types';
import { GERMAN_DISTRICTS } from '../data/districts-de';
import { GERMAN_DIPLOMATIC_CODES, GERMAN_HIGHEST_OFFICIALS } from '../data/diplomatic-codes-de';
import { checkProhibitedGermanPlate } from '../data/prohibited-combos-de';

// Build fast district lookup maps
const districtMap = new Map<string, (typeof GERMAN_DISTRICTS)[0]>();
for (const d of GERMAN_DISTRICTS) {
  districtMap.set(d.code.toUpperCase(), d);
}

export function findGermanDistrict(code: string) {
  return districtMap.get(code.toUpperCase());
}

export function parseGermanPlate(input: string, userOverrides?: Partial<PlateParseResult>): PlateParseResult {
  const rawInput = input;
  // Clean input: remove redundant spaces, dashes, dots, normalize uppercase
  const cleaned = input.trim().toUpperCase();
  const errors: string[] = [];

  // Default base result
  const baseResult: PlateParseResult = {
    country: 'DE',
    rawInput,
    normalizedPlate: cleaned,
    isValid: false,
    category: 'unknown',
    categoryName: 'Unknown',
    categoryNameDe: 'Unbekanntes Kennzeichen',
    categoryDescription: 'The entered plate format could not be recognized as a valid German license plate.',
    textColor: 'black',
    hasEuroBand: true,
    hasGermanFlag: false,
    hasYellowBand: false,
    hasRedBand: false,
    hasSeasonBand: false,
    specialPerks: [],
    legalBasis: 'Fahrzeug-Zulassungsverordnung (FZV)',
    errors,
    fontType: 'FE',
    tuevYear: 2026,
    tuevMonth: 10,
    badgeStateCode: 'bundesadler',
  };

  if (!cleaned) {
    errors.push('Please enter a license plate string.');
    return baseResult;
  }

  // 1. Highest Federal Officials (e.g. 0-1, 0-2, 0-3, 0-4)
  const officialMatch = cleaned.match(/^0[- ]?([1-4])$/);
  if (officialMatch) {
    const code = `0-${officialMatch[1]}`;
    const role = GERMAN_HIGHEST_OFFICIALS[code];
    return {
      ...baseResult,
      isValid: true,
      category: 'federal_leadership',
      categoryName: 'Highest Federal Official Plate',
      categoryNameDe: 'Höchste Verfassungsorgane des Bundes',
      categoryDescription: `Official vehicle plate of the ${role}. Registered directly through the Federal Ministry of the Interior.`,
      normalizedPlate: code,
      districtCode: '0',
      districtName: 'Berlin (Bund)',
      state: 'Bund',
      stateCode: 'bundesadler',
      badgeStateCode: 'bundesadler',
      specialPerks: ['Special right of way in official escort (§ 35/38 StVO)', 'Exempt from toll and environmental zone regulations'],
      legalBasis: '§ 8 Abs. 1 FZV Anlage 2 (Oberste Bundesorgane)',
    };
  }

  // 2. Armed Forces (Bundeswehr: Y-123456 or Y 123456)
  const bundeswehrMatch = cleaned.match(/^Y[- ]?([0-9]{1,6})$/);
  if (bundeswehrMatch) {
    const num = bundeswehrMatch[1];
    return {
      ...baseResult,
      isValid: true,
      category: 'federal_armed_forces',
      categoryName: 'Bundeswehr (German Armed Forces)',
      categoryNameDe: 'Bundeswehr Kennzeichen (Streitkräfte)',
      categoryDescription: 'Vehicle of the German Armed Forces (Bundeswehr). Displays the German federal flag instead of the EU strip on the left.',
      normalizedPlate: `Y-${num}`,
      districtCode: 'Y',
      districtName: 'Bundeswehr (Zentrum Kraftfahrwesen der Bundeswehr, Mönchengladbach)',
      state: 'Bund',
      stateCode: 'bundesadler',
      numberPart: num,
      hasEuroBand: false,
      hasGermanFlag: true,
      badgeStateCode: 'bundesadler',
      specialPerks: ['Military vehicle exemptions under § 35 Abs. 1 StVO', 'Exempt from low emission zone restrictions'],
      legalBasis: '§ 8 Abs. 1 Satz 3 FZV (Dienstfahrzeuge der Bundeswehr)',
    };
  }

  // 3. NATO Military Vehicles (X-1234)
  const natoMatch = cleaned.match(/^X[- ]?([0-9]{1,4})$/);
  if (natoMatch) {
    const num = natoMatch[1];
    return {
      ...baseResult,
      isValid: true,
      category: 'federal_armed_forces',
      categoryName: 'NATO Forces Headquarters',
      categoryNameDe: 'NATO Dienstfahrzeuge',
      categoryDescription: 'Service vehicles assigned to NATO headquarters stationed in Germany.',
      normalizedPlate: `X-${num}`,
      districtCode: 'X',
      districtName: 'NATO Hauptquartiere in Deutschland',
      state: 'Bund',
      stateCode: 'bundesadler',
      numberPart: num,
      badgeStateCode: 'bundesadler',
      specialPerks: ['NATO Status of Forces Agreement (SOFA) privileges'],
      legalBasis: 'FZV Anlage 2 (NATO-Streitkräfte)',
    };
  }

  // 4. Federal Police (Bundespolizei: BP 12-345 or BP 12345 or BP 10000..99999)
  const bpMatch = cleaned.match(/^BP[- ]?([0-9]{2,5})$|^BP[- ]?([0-9]{2})[- ]([0-9]{3,4})$/);
  if (bpMatch) {
    const num = bpMatch[1] || `${bpMatch[2]}-${bpMatch[3]}`;
    return {
      ...baseResult,
      isValid: true,
      category: 'federal_police',
      categoryName: 'Federal Police (Bundespolizei)',
      categoryNameDe: 'Bundespolizei',
      categoryDescription: 'Official service vehicle of the German Federal Police (formerly Bundesgrenzschutz / BG).',
      normalizedPlate: `BP ${num}`,
      districtCode: 'BP',
      districtName: 'Bundespolizeipräsidium (Potsdam)',
      state: 'Bund',
      stateCode: 'bundesadler',
      numberPart: num,
      badgeStateCode: 'bundesadler',
      specialPerks: ['Special rights under § 35 StVO for emergency response', 'Exempt from low emission zone restrictions'],
      legalBasis: 'FZV Anlage 2 (Bundespolizei)',
    };
  }

  // 5. THW (Technisches Hilfswerk: THW-81234 or THW 90123)
  const thwMatch = cleaned.match(/^THW[- ]?([0-9]{4,5})$/);
  if (thwMatch) {
    const num = thwMatch[1];
    return {
      ...baseResult,
      isValid: true,
      category: 'federal_thw',
      categoryName: 'Federal Agency for Technical Relief (THW)',
      categoryNameDe: 'Bundesanstalt Technisches Hilfswerk (THW)',
      categoryDescription: 'Official civil protection and disaster relief vehicle of the Technisches Hilfswerk.',
      normalizedPlate: `THW-${num}`,
      districtCode: 'THW',
      districtName: 'Bundesanstalt Technisches Hilfswerk (Bonn)',
      state: 'Bund',
      stateCode: 'bundesadler',
      numberPart: num,
      badgeStateCode: 'bundesadler',
      specialPerks: ['Blue light / emergency siren privileges during disaster response missions (§ 35/38 StVO)', 'Motor vehicle tax exempt'],
      legalBasis: 'FZV Anlage 2 (Technisches Hilfswerk)',
    };
  }

  // 6. Bundeszollverwaltung (BWZ 12-345 or BWZ 12345)
  const bwzMatch = cleaned.match(/^BWZ[- ]?([0-9]{2,5})$|^BWZ[- ]?([0-9]{2})[- ]([0-9]{3})$/);
  if (bwzMatch) {
    const num = bwzMatch[1] || `${bwzMatch[2]}-${bwzMatch[3]}`;
    return {
      ...baseResult,
      isValid: true,
      category: 'federal_customs',
      categoryName: 'Federal Customs Administration (Bundeszollverwaltung)',
      categoryNameDe: 'Bundeszollverwaltung (Zoll)',
      categoryDescription: 'Official vehicle of the German Customs Administration (Generalzolldirektion).',
      normalizedPlate: `BWZ ${num}`,
      districtCode: 'BWZ',
      districtName: 'Generalzolldirektion (Bonn)',
      state: 'Bund',
      stateCode: 'bundesadler',
      numberPart: num,
      badgeStateCode: 'bundesadler',
      specialPerks: ['Customs authority special rights under § 35 StVO'],
      legalBasis: 'FZV Anlage 2 (Zollverwaltung)',
    };
  }

  // 7. Dealer / Vintage Collection Red Plates (Rote Kennzeichen: 05..., 06... or 07...)
  // Check BEFORE diplomatic staff because dealer plate numbers start with 05, 06, or 07!
  // e.g. "B 06123", "M 07123"
  const redPlateMatch = cleaned.match(/^([A-ZÄÖÜ]{1,3})[- ]?(0[567][0-9]{2,4})$/);
  if (redPlateMatch) {
    const distCode = redPlateMatch[1];
    const numPart = redPlateMatch[2];
    const dist = findGermanDistrict(distCode);

    if (dist) {
      const isClassicCollector = numPart.startsWith('07');
      const isDealer = numPart.startsWith('06');
      const isTesting = numPart.startsWith('05');

      const desc = isClassicCollector
        ? 'Red collector license plate for classic vehicles (Oldtimer / Youngtimer) at least 30 years old, used for club events, parades, test runs, and maintenance trips.'
        : isDealer
        ? 'Red dealer plate for car dealerships, garages, and vehicle manufacturers for temporary test and transfer runs (Händlerkennzeichen).'
        : 'Red inspection plate for recognized motor vehicle inspection organizations.';

      return {
        ...baseResult,
        isValid: true,
        category: 'dealer_collector_red',
        categoryName: isClassicCollector ? 'Classic Collector Red Plate (07-Kennzeichen)' : 'Dealer Red Plate (06-Kennzeichen)',
        categoryNameDe: isClassicCollector ? 'Rotes Oldtimer-Kennzeichen (07)' : 'Rotes Händlerkennzeichen (06)',
        categoryDescription: desc,
        normalizedPlate: `${distCode} ${numPart}`,
        districtCode: distCode,
        districtName: dist.name,
        state: dist.state,
        stateCode: dist.stateCode,
        badgeStateCode: dist.stateCode,
        numberPart: numPart,
        textColor: 'red',
        specialPerks: [
          isClassicCollector
            ? 'Can be assigned to multiple classic vehicles alternately with a single logbook (Fahrtenbuch)'
            : 'Reusable across all vehicles in dealer inventory for test runs and vehicle transfers',
          'Flat-rate annual vehicle taxation',
        ],
        legalBasis: isClassicCollector ? '§ 17 FZV (Oldtimerfahrten)' : '§ 16 FZV (Prüfungs-, Probe- und Überführungsfahrten)',
      };
    }
  }

  // 8. Kurzzeitkennzeichen (Short-term 5-day transfer plate: e.g. B 04123 28/11/26)
  // Starts with 03 or 04 in numbers, e.g. "B 04123" or with dates "B 04123 28/11/26"
  const shortTermMatch = cleaned.match(/^([A-ZÄÖÜ]{1,3})[- ]?(0[34][0-9]{2,4})(?:[- /]?([0-3][0-9])[- /]?([0-1][0-9])[- /]?([2-3][0-9]))?$/);
  if (shortTermMatch) {
    const distCode = shortTermMatch[1];
    const numPart = shortTermMatch[2];
    const dist = findGermanDistrict(distCode);

    if (dist) {
      const day = shortTermMatch[3] ? parseInt(shortTermMatch[3], 10) : 28;
      const month = shortTermMatch[4] ? parseInt(shortTermMatch[4], 10) : 11;
      const year = shortTermMatch[5] ? parseInt(`20${shortTermMatch[5]}`, 10) : 2026;

      return {
        ...baseResult,
        isValid: true,
        category: 'short_term',
        categoryName: 'Short-Term Plate (Kurzzeitkennzeichen)',
        categoryNameDe: 'Kurzzeitkennzeichen (Gelbes Band)',
        categoryDescription: `Short-term vehicle plate for transfer, inspection, and test drives (Überführungsfahrten). Has a distinctive yellow date band on the right and is valid for a maximum of 5 calendar days.`,
        normalizedPlate: `${distCode} ${numPart}`,
        districtCode: distCode,
        districtName: dist.name,
        state: dist.state,
        stateCode: dist.stateCode,
        badgeStateCode: dist.stateCode,
        numberPart: numPart,
        hasYellowBand: true,
        expiryDay: day,
        expiryMonth: month,
        expiryYear: year,
        specialPerks: ['Valid for 5 days without full vehicle inspection or permanent registration'],
        legalBasis: '§ 16a Fahrzeug-Zulassungsverordnung (FZV)',
      };
    }
  }

  // 9. Export Plate (Ausfuhrkennzeichen: e.g. M 1234 A or B 123 B with red date band)
  // Format: [District] [Numbers] [Letter], e.g. "M 1234 A" or "HH 456 B"
  const exportMatch = cleaned.match(/^([A-ZÄÖÜ]{1,3})[- ]?([0-9]{1,4})[- ]?([A-Z])(?:[- /]?([0-3][0-9])[- /]?([0-1][0-9])[- /]?([2-3][0-9]))?$/);
  if (exportMatch) {
    const distCode = exportMatch[1];
    const numPart = exportMatch[2];
    const letterPart = exportMatch[3];
    const dist = findGermanDistrict(distCode);

    if (dist) {
      const day = exportMatch[4] ? parseInt(exportMatch[4], 10) : 15;
      const month = exportMatch[5] ? parseInt(exportMatch[5], 10) : 6;
      const year = exportMatch[6] ? parseInt(`20${exportMatch[6]}`, 10) : 2027;

      return {
        ...baseResult,
        isValid: true,
        category: 'export',
        categoryName: 'Export / Customs Plate (Ausfuhrkennzeichen)',
        categoryNameDe: 'Ausfuhrkennzeichen / Zollkennzeichen (Rotes Band)',
        categoryDescription: 'Customs transit plate for exporting a vehicle out of Germany permanently. Displays a red date band on the right denoting expiration of liability insurance and international registration.',
        normalizedPlate: `${distCode} ${numPart}${letterPart}`,
        districtCode: distCode,
        districtName: dist.name,
        state: dist.state,
        stateCode: dist.stateCode,
        badgeStateCode: dist.stateCode,
        numberPart: numPart,
        middleLetters: letterPart,
        hasRedBand: true,
        expiryDay: day,
        expiryMonth: month,
        expiryYear: year,
        specialPerks: ['Permits international transport without domestic vehicle registration'],
        legalBasis: '§ 19 Fahrzeug-Zulassungsverordnung (FZV)',
      };
    }
  }

  // 10. Diplomatic Corps Ambassador Plate (0 [CountryCode]-[Rank/Serial], e.g. 0 17-1 or 0 17 1)
  const diplomatAmbassadorMatch = cleaned.match(/^0[- ]?([0-9]{2,3})[- ]?([0-9]{1,3})$/);
  if (diplomatAmbassadorMatch) {
    const countryCode = diplomatAmbassadorMatch[1];
    const serial = diplomatAmbassadorMatch[2];
    const country = GERMAN_DIPLOMATIC_CODES[countryCode];
    const isAmbassador = serial === '1';

    return {
      ...baseResult,
      isValid: true,
      category: 'diplomatic',
      categoryName: 'Diplomatic Mission (Corps Diplomatique)',
      categoryNameDe: 'Diplomatenkennzeichen (Botschaftsfahrzeug)',
      categoryDescription: `Official diplomatic vehicle assigned to ${country ? country.country : `Country Code ${countryCode}`}. ${isAmbassador ? 'Number "1" identifies this as the official vehicle of the Ambassador (Head of Mission).' : `Rank/serial identifier: ${serial}.`}`,
      normalizedPlate: `0 ${countryCode}-${serial}`,
      districtCode: '0',
      districtName: 'Diplomatisches Korps (Auswärtiges Amt)',
      state: 'Bund',
      stateCode: 'bundesadler',
      badgeStateCode: 'bundesadler',
      diplomaticInfo: country ? { ...country, role: isAmbassador ? 'Ambassador / Head of Mission' : 'Diplomatic Staff' } : undefined,
      specialPerks: ['Diplomatic immunity and protection under the Vienna Convention on Diplomatic Relations (VCDR)', 'Exempt from vehicle tax and municipal parking fees in embassy zones'],
      legalBasis: '§ 8 Abs. 1 Satz 5 FZV (Diplomatisches Korps)',
    };
  }

  // 11. Diplomatic Administrative / Consular Staff (B [CountryCode]-[Serial] or BN [CountryCode]-[Serial])
  const diplomatStaffMatch = cleaned.match(/^(B|BN)[- ]?([1-9][0-9]{1,2})[- ]?([0-9]{1,4})$/);
  if (diplomatStaffMatch) {
    const city = diplomatStaffMatch[1];
    const countryCode = diplomatStaffMatch[2];
    const serial = diplomatStaffMatch[3];
    const country = GERMAN_DIPLOMATIC_CODES[countryCode];
    const cityName = city === 'B' ? 'Berlin' : 'Bonn';

    return {
      ...baseResult,
      isValid: true,
      category: 'diplomatic',
      categoryName: 'Diplomatic Mission Staff / Embassy',
      categoryNameDe: 'Botschafts- und Konsulatsangehörige',
      categoryDescription: `Embassy/Consular staff vehicle of ${country ? country.country : `Country Code ${countryCode}`} based in ${cityName}.`,
      normalizedPlate: `${city} ${countryCode}-${serial}`,
      districtCode: city,
      districtName: `${cityName} (Diplomatische Vertretung)`,
      state: city === 'B' ? 'Berlin' : 'Nordrhein-Westfalen',
      stateCode: city === 'B' ? 'berlin' : 'nordrhein-westfalen',
      badgeStateCode: city === 'B' ? 'berlin' : 'nordrhein-westfalen',
      diplomaticInfo: country ? { ...country, role: 'Embassy / Consular Vehicle' } : undefined,
      specialPerks: ['Vienna Convention diplomatic protections', 'Tax exemption status'],
      legalBasis: '§ 8 Abs. 1 Satz 5 FZV',
    };
  }

  // 12. State Government / State Leadership / State Police (e.g. NRW 4-123, WI 4-123, BW 1-123, BY 4-123)
  const statePoliceMatch = cleaned.match(/^(NRW|BW|BY|LSA|LSN|MVL|RPL|SAL|SH|THL|HEL)[- ]?([0-9]{1,2})[- ]?([0-9]{2,5})$/);
  if (statePoliceMatch) {
    const statePrefix = statePoliceMatch[1];
    const division = statePoliceMatch[2];
    const serial = statePoliceMatch[3];
    const dist = findGermanDistrict(statePrefix);

    const isPolice = division === '4' || division === '5' || division === '6';
    return {
      ...baseResult,
      isValid: true,
      category: 'state_police',
      categoryName: isPolice ? 'State Police (Landespolizei)' : 'State Government Vehicle',
      categoryNameDe: isPolice ? 'Landespolizei' : 'Landesbehördenfahrzeug',
      categoryDescription: isPolice
        ? `Official patrol or operational vehicle of the ${dist ? dist.state : statePrefix} State Police.`
        : `Official government vehicle of the federal state of ${dist ? dist.state : statePrefix}.`,
      normalizedPlate: `${statePrefix} ${division}-${serial}`,
      districtCode: statePrefix,
      districtName: dist ? dist.fullName : statePrefix,
      state: dist ? dist.state : statePrefix,
      stateCode: dist ? dist.stateCode : 'bundesadler',
      badgeStateCode: dist ? dist.stateCode : 'bundesadler',
      numberPart: `${division}-${serial}`,
      specialPerks: ['Emergency privileges under § 35 StVO for police operations', 'Exempt from toll and environmental zone regulations'],
      legalBasis: 'FZV Anlage 2 (Fahrzeuge der Länder)',
    };
  }

  // 13. Insurance Moped Plate (Versicherungskennzeichen: 3 digits over 3 letters, e.g. 123 ABC)
  const mopedMatch = cleaned.match(/^([0-9]{3})[- ]?([A-Z]{3})$/);
  if (mopedMatch) {
    const nums = mopedMatch[1];
    const letters = mopedMatch[2];
    return {
      ...baseResult,
      isValid: true,
      category: 'insurance_moped',
      categoryName: 'Insurance Plate (Versicherungskennzeichen)',
      categoryNameDe: 'Versicherungskennzeichen (Moped / E-Scooter)',
      categoryDescription: 'Small insurance license plate for mopeds (up to 50cc / 45 km/h), light quads, and e-scooters. Color alternates annually (black, blue, green) and expires each year on the last day of February.',
      normalizedPlate: `${nums} ${letters}`,
      numberPart: nums,
      middleLetters: letters,
      hasEuroBand: false,
      textColor: 'blue',
      specialPerks: ['Requires only liability insurance contract instead of full administrative vehicle registration'],
      legalBasis: '§ 26 Fahrzeug-Zulassungsverordnung (FZV)',
    };
  }

  // 14. Standard, Electric, Historic, Seasonal, Combinations (E, H, Saison 04/10, E 04/10, H 04/10)
  // General format: [1-3 District letters] [1-3 Middle letters] [1-5 Numbers] [Optional E or H suffix] [Optional Season XX/YY]
  const standardPattern = /^([A-ZÄÖÜ]{1,3})[- ]?([A-ZÄÖÜ]{1,3})[- ]?([0-9]{1,5})[- ]?([EH])?(?:[- /]?([0-1][0-9])[- /]?([0-1][0-9]))?$/;
  const match = cleaned.match(standardPattern);

  if (match) {
    const distCode = match[1];
    const middle = match[2];
    const num = match[3];
    const suffix = match[4]; // 'E' or 'H' or undefined
    const seasonStart = match[5] ? parseInt(match[5], 10) : undefined;
    const seasonEnd = match[6] ? parseInt(match[6], 10) : undefined;

    const dist = findGermanDistrict(distCode);
    if (!dist) {
      errors.push(`District code "${distCode}" is not a recognized German Unterscheidungszeichen.`);
      return {
        ...baseResult,
        districtCode: distCode,
        middleLetters: middle,
        numberPart: num,
        suffix,
        errors,
      };
    }

    // Check middle letters count (FZV permits max 2 letters in middle group)
    if (middle.length > 2) {
      errors.push(`German license plates permit at most 2 middle letters (received "${middle}").`);
    }

    // Check total character length rule:
    // German plates allow a maximum of 8 characters (or 7 characters for seasonal/E/H plates)
    const letterCount = distCode.length + middle.length + num.length + (suffix ? 1 : 0);
    if (letterCount > 8) {
      errors.push(`German license plates permit a maximum of 8 characters. Entered plate has ${letterCount} characters.`);
    }

    // Check prohibited combinations
    const prohibitedReason = checkProhibitedGermanPlate(distCode, middle, num);

    // Determine category
    let category: PlateCategory = 'standard';
    let catName = 'Standard Euro Plate';
    let catNameDe = 'Standard EU-Kennzeichen';
    let catDesc = 'Standard German European vehicle registration plate with blue EU euroband and FE-Schrift.';
    const specialPerks: string[] = [];

    if (suffix === 'E' && seasonStart && seasonEnd) {
      category = 'electric_seasonal';
      catName = 'Electric Seasonal Plate (E + Saison)';
      catNameDe = 'E-Saisonkennzeichen';
      catDesc = `Electric vehicle plate registered for seasonal operation between month ${seasonStart} and month ${seasonEnd}.`;
      specialPerks.push('Free parking / bus lane access in participating cities (EmoG)');
      specialPerks.push(`Vehicle tax active only during operating period (months ${seasonStart}-${seasonEnd})`);
    } else if (suffix === 'H' && seasonStart && seasonEnd) {
      category = 'classic_seasonal';
      catName = 'Historic Seasonal Plate (H + Saison)';
      catNameDe = 'Oldtimer-Saisonkennzeichen';
      catDesc = `Historic Oldtimer plate (30+ years) registered for seasonal operation between month ${seasonStart} and month ${seasonEnd}.`;
      specialPerks.push('Exempt from Low Emission Zones (Umweltzonen) without green sticker requirement');
      specialPerks.push(`Pro-rated flat-rate historic vehicle tax for operating window`);
    } else if (suffix === 'E') {
      category = 'electric';
      catName = 'Electric Vehicle Plate (E-Kennzeichen)';
      catNameDe = 'E-Kennzeichen (Elektrofahrzeug)';
      catDesc = 'License plate for pure electric vehicles (BEV), fuel-cell vehicles (FCEV), and qualifying plug-in hybrids (PHEV) under the Electric Mobility Act (Elektromobilitätsgesetz - EmoG).';
      specialPerks.push('Privileged parking and designated charging station access');
      specialPerks.push('Access to reserved bus lanes in participating municipalities');
      specialPerks.push('10-year vehicle tax exemption for zero-emission vehicles registered before 2025/2030');
    } else if (suffix === 'H') {
      category = 'classic';
      catName = 'Historic Classic Plate (H-Kennzeichen)';
      catNameDe = 'H-Kennzeichen (Oldtimer)';
      catDesc = 'Official historic collector plate for vehicles at least 30 years old preserved in original condition as cultural automotive heritage (§ 23 StVZO).';
      specialPerks.push('Permanently exempt from Low Emission Zone (Umweltzone) bans without green sticker');
      specialPerks.push('Flat rate annual motor vehicle tax (€191.73 for cars, €46.02 for motorcycles)');
      specialPerks.push('Special collector insurance policy eligibility');
    } else if (seasonStart && seasonEnd) {
      category = 'seasonal';
      catName = 'Seasonal Plate (Saisonkennzeichen)';
      catNameDe = 'Saisonkennzeichen';
      catDesc = `Plate valid only for a defined operating season each year (from month ${seasonStart} to month ${seasonEnd}). Outside this period, vehicle tax and insurance pause, and driving/parking on public roads is prohibited.`;
      specialPerks.push(`Pro-rated insurance and vehicle tax saved during off-season months`);
      specialPerks.push('Automatic annual renewal without recurring administrative registration fees');
    }

    // Check user overrides (e.g. Tax-exempt green plate or DIN font pre-1995)
    let textColor: 'black' | 'red' | 'green' | 'blue' = 'black';
    let fontType: 'FE' | 'DIN' = 'FE';
    let hasEuroBand = true;

    if (userOverrides?.category === 'tax_exempt_green' || userOverrides?.textColor === 'green') {
      category = 'tax_exempt_green';
      catName = 'Tax-Exempt Green Plate (Grünes Kennzeichen)';
      catNameDe = 'Grünes Kennzeichen (Steuerbefreit)';
      catDesc = 'Green license plate for vehicles exempt from motor vehicle tax (Kraftfahrzeugsteuer), such as agricultural/forestry tractors, non-profit rescue services, and sports trailers.';
      textColor = 'green';
      specialPerks.push('100% exempt from German Motor Vehicle Tax (§ 3 KraftStG)');
    }

    if (userOverrides?.category === 'historical_din' || userOverrides?.fontType === 'DIN') {
      fontType = 'DIN';
      hasEuroBand = false;
      category = 'historical_din';
      catName = 'Historical Pre-1995 DIN Plate';
      catNameDe = 'Altes DIN-Kennzeichen (vor 1995)';
      catDesc = 'Pre-1995 German license plate without blue EU strip, utilizing the historic DIN 1451 font. Grandfathered on continuous registrations.';
    }

    const norm = `${distCode} ${middle} ${num}${suffix ? ` ${suffix}` : ''}${seasonStart && seasonEnd ? ` ${String(seasonStart).padStart(2, '0')}/${String(seasonEnd).padStart(2, '0')}` : ''}`;

    return {
      ...baseResult,
      isValid: errors.length === 0 && !prohibitedReason,
      category,
      categoryName: catName,
      categoryNameDe: catNameDe,
      categoryDescription: catDesc,
      normalizedPlate: norm,
      districtCode: distCode,
      districtName: dist.name,
      state: dist.state,
      stateCode: dist.stateCode,
      badgeStateCode: dist.stateCode,
      middleLetters: middle,
      numberPart: num,
      suffix,
      seasonStart,
      seasonEnd,
      textColor,
      fontType,
      hasEuroBand,
      hasSeasonBand: Boolean(seasonStart && seasonEnd),
      specialPerks,
      legalBasis: suffix === 'H' ? '§ 23 StVZO / § 9 Abs. 1 FZV' : suffix === 'E' ? '§ 9 Abs. 2 FZV / EmoG' : seasonStart ? '§ 9 Abs. 3 FZV' : '§ 8 FZV (Fahrzeug-Zulassungsverordnung)',
      prohibitedWarning: prohibitedReason || undefined,
      errors,
    };
  }

  // If no pattern matched
  errors.push(`Could not parse plate format "${cleaned}". Typical German plate format: "B MW 1234", "M AB 123 E", "HH CL 70 H", "0 17-1", "Y-123456", "THW-81234".`);
  return baseResult;
}

export function getRandomGermanPlate(): { plate: string; category: PlateCategory } {
  const samples: { plate: string; category: PlateCategory }[] = [
    { plate: 'B MW 1234 E', category: 'electric' },
    { plate: 'M CL 1972 H', category: 'classic' },
    { plate: 'HH SP 911 04/10', category: 'seasonal' },
    { plate: 'K RS 73 H 04/10', category: 'classic_seasonal' },
    { plate: 'S EV 1000 E 03/11', category: 'electric_seasonal' },
    { plate: 'B 04123 28/11/26', category: 'short_term' },
    { plate: 'M 4567 A 15/06/27', category: 'export' },
    { plate: 'B 06123', category: 'dealer_collector_red' },
    { plate: 'DAH GT 500', category: 'standard' },
    { plate: '0 17-1', category: 'diplomatic' },
    { plate: 'B 35-123', category: 'diplomatic' },
    { plate: 'Y-482195', category: 'federal_armed_forces' },
    { plate: 'BP 18-450', category: 'federal_police' },
    { plate: 'THW-86412', category: 'federal_thw' },
    { plate: 'BWZ 24-810', category: 'federal_customs' },
    { plate: 'NRW 4-2819', category: 'state_police' },
    { plate: 'WI 4-1029', category: 'state_police' },
    { plate: '0-1', category: 'federal_leadership' },
    { plate: 'FFB AG 123', category: 'tax_exempt_green' },
    { plate: 'DD VW 2024', category: 'standard' },
  ];
  const rand = samples[Math.floor(Math.random() * samples.length)];
  return rand;
}
