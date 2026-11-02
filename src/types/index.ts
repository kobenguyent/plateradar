export type CountryCode = 'DE' | 'AT' | 'CH' | 'JP' | 'TH' | 'VN' | 'AU' | 'NZ';

export interface CountryInfo {
  id: CountryCode;
  name: string;
  nativeName: string;
  flag: string;
  euroCode: string;
  description: string;
  supportedCategoriesCount: number;
}

export type PlateCategory =
  | 'standard'
  | 'electric'
  | 'classic'
  | 'seasonal'
  | 'classic_seasonal'
  | 'electric_seasonal'
  | 'short_term'
  | 'export'
  | 'dealer_collector_red'
  | 'tax_exempt_green'
  | 'diplomatic'
  | 'federal_armed_forces'
  | 'federal_police'
  | 'federal_thw'
  | 'federal_customs'
  | 'federal_leadership'
  | 'state_police'
  | 'insurance_moped'
  | 'historical_din'
  | 'kei_car'
  | 'commercial'
  | 'government'
  | 'unknown';

export interface District {
  code: string;
  name: string;
  state: string;
  stateCode: string;
  fullName: string;
  isHistorical?: boolean;
  derivedFrom?: string;
  regionType?: string;
}

export interface DiplomaticMission {
  code: string;
  country: string;
  countryDe: string;
  flag: string;
  role?: string;
}

export interface PlateParseResult {
  country: CountryCode;
  rawInput: string;
  normalizedPlate: string;
  isValid: boolean;
  category: PlateCategory;
  categoryName: string;
  categoryNameDe: string;
  categoryDescription: string;
  districtCode?: string;
  districtName?: string;
  state?: string;
  stateCode?: string;
  middleLetters?: string;
  numberPart?: string;
  suffix?: string; // 'E', 'H', etc.
  seasonStart?: number;
  seasonEnd?: number;
  expiryDay?: number;
  expiryMonth?: number;
  expiryYear?: number;
  diplomaticInfo?: DiplomaticMission;
  textColor: 'black' | 'red' | 'green' | 'blue' | 'yellow' | 'white';
  backgroundColor?: 'white' | 'yellow' | 'green' | 'blue' | 'red' | 'black';
  hasEuroBand: boolean;
  hasGermanFlag: boolean;
  hasYellowBand: boolean;
  hasRedBand: boolean;
  hasSeasonBand: boolean;
  topLineText?: string; // Used for Japanese plates: e.g. "品川 300"
  bottomLineText?: string; // Used for Thai province or Australian state slogan: e.g. "NEW SOUTH WALES"
  tuevYear?: number;
  tuevMonth?: number;
  badgeStateCode?: string;
  specialPerks: string[];
  legalBasis: string;
  prohibitedWarning?: string;
  errors: string[];
  fontType: 'FE' | 'DIN';
  normalizedNotice?: string;
  alternateSuggestion?: {
    country: CountryCode;
    label: string;
    query: string;
  };
}

export interface CountryAdapter {
  id: CountryCode;
  info: CountryInfo;
  parse(plate: string, options?: Partial<PlateParseResult>): PlateParseResult;
  getDistricts(): District[];
  findDistrict(code: string): District | undefined;
  getRandomPlate(): { plate: string; category: PlateCategory };
}

export interface QuizQuestion {
  id: string;
  type: 'code_to_city' | 'city_to_code' | 'special_type';
  question: string;
  platePreview?: string;
  options: { label: string; value: string }[];
  correctAnswer: string;
  explanation: string;
}
