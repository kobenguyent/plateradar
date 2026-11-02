import React, { useState } from 'react';
import { CountryCode, PlateParseResult } from '../../types';
import { CountryAdapters, autoDetectCountry, SUPPORTED_COUNTRIES } from '../../core/country-registry';
import { PlateRenderer } from '../plate/PlateRenderer';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Sparkles, 
  Info, 
  Building2, 
  Calendar,
  Copy,
  Check,
  Globe2,
  ArrowRight
} from 'lucide-react';

interface PlateCheckerProps {
  country: CountryCode;
  initialValue?: string;
  onSelectDistrict?: (code: string) => void;
  onSwitchCountry?: (country: CountryCode, query: string) => void;
}

const SAMPLES_BY_COUNTRY: Record<CountryCode, { label: string; plate: string }[]> = {
  DE: [
    { label: 'Electric (E)', plate: 'B MW 1234 E' },
    { label: 'Historic Oldtimer (H)', plate: 'M CL 1972 H' },
    { label: 'AMLA EU Agency (320)', plate: '0 320 320' },
    { label: 'Seasonal (Cabrio)', plate: 'HH SP 911 04/10' },
    { label: '5-Day Transfer (Yellow)', plate: 'B 04123 28/11/26' },
    { label: 'Export (Red)', plate: 'M 4567 A 15/06/27' },
    { label: 'Diplomat (Ambassador)', plate: '0 17-1' },
    { label: 'Embassy Staff', plate: 'B 35-123' },
    { label: 'Armed Forces (Y)', plate: 'Y-482195' },
    { label: 'Federal Police (BP)', plate: 'BP 18-450' },
    { label: 'THW Relief', plate: 'THW-86412' },
    { label: 'Red Dealer (06)', plate: 'B 06123' },
    { label: 'Green Tax-Exempt', plate: 'FFB AG 123' },
    { label: 'Chancellor / Head of State', plate: '0-1' },
    { label: 'Pre-1995 DIN Font', plate: 'DAH GT 500' },
  ],
  AT: [
    { label: 'Vienna Standard (W)', plate: 'W 12345 A' },
    { label: 'Oberösterreich State (O)', plate: 'O 320 320' },
    { label: 'Electric Green (IG-L)', plate: 'L 4040 E' },
    { label: 'Federal Police (BP)', plate: 'BP 12345' },
    { label: 'Federal Armed Forces (BH)', plate: 'BH 67890' },
    { label: 'Salzburg (S)', plate: 'S 8888 AA' },
    { label: 'Tyrol Innsbruck (IL)', plate: 'IL 999 ZZ' },
  ],
  CH: [
    { label: 'Zürich Canton (ZH)', plate: 'ZH 854123' },
    { label: 'Bern Canton (BE)', plate: 'BE 12345' },
    { label: 'Geneva Canton (GE)', plate: 'GE 555666' },
    { label: 'Swiss Military (M)', plate: 'M 12345' },
    { label: 'Vaud Canton (VD)', plate: 'VD 98765' },
    { label: 'Ticino Canton (TI)', plate: 'TI 45678' },
  ],
  JP: [
    { label: 'Standard White (品川)', plate: '品川 300 さ 12-34' },
    { label: 'Kei Car Mini (横浜 580)', plate: '横浜 580 わ 56-78' },
    { label: 'Osaka Large (大阪 330)', plate: '大阪 330 な 88-88' },
    { label: 'Mt. Fuji Heritage (富士山)', plate: '富士山 500 す 37-76' },
    { label: 'SOFA US Military (沖縄 Y)', plate: '沖縄 500 Y 45-67' },
    { label: 'Diplomatic Blue (外)', plate: '外 1234' },
  ],
  TH: [
    { label: 'Bangkok Sedan (1กข)', plate: '1กข 1234 Bangkok' },
    { label: 'Lucky Double Letter (8กก)', plate: '8กก 8888 Bangkok' },
    { label: 'Chiang Mai (2ขค)', plate: '2ขค 5678 Chiang Mai' },
    { label: 'Phuket Island (3ขง)', plate: '3ขง 4040 Phuket' },
    { label: 'Temporary Red (ป้ายแดง)', plate: 'ก-9999 แดง' },
    { label: 'Chonburi Pattaya (4กจ)', plate: '4กจ 7777 Chonburi' },
  ],
  VN: [
    { label: 'Hà Nội Capital (30A)', plate: '30A-123.45' },
    { label: 'TP. Hồ Chí Minh (51H)', plate: '51H-888.88' },
    { label: 'Central Gov Blue (80A)', plate: '80A-001.01' },
    { label: 'Đà Nẵng Coastal (43A)', plate: '43A-567.89' },
    { label: 'People’s Army Red (QA)', plate: 'QA-12-34' },
    { label: 'Hải Phòng Port (15A)', plate: '15A-999.99' },
  ],
  AU: [
    { label: 'NSW (First State)', plate: 'NSW AA-12-BB' },
    { label: 'VIC (Education State)', plate: 'VIC 1AA-2BB' },
    { label: 'QLD (Sunshine State)', plate: 'QLD 123-AA1' },
    { label: 'WA (Wildflower State)', plate: 'WA 1AAA-123' },
    { label: 'SA (Festival State)', plate: 'SA S123-AAA' },
    { label: 'ACT (Nation’s Capital)', plate: 'ACT YAA-12A' },
    { label: 'TAS (Explore Possibilities)', plate: 'TAS A-12-BB' },
  ],
  NZ: [
    { label: 'Current Standard (ABC 123)', plate: 'ABC 123' },
    { label: 'Modern Series (KOB 789)', plate: 'KOB 789' },
    { label: 'Legacy Pre-2001 (AA 1234)', plate: 'AA 1234' },
    { label: 'Personalised KiwiPlate', plate: 'KIWI' },
    { label: 'Electric Vehicle Custom', plate: 'EV 2026' },
    { label: 'Turbo Custom', plate: 'TURBO' },
  ],
};

const PLACEHOLDER_BY_COUNTRY: Record<CountryCode, string> = {
  DE: 'e.g. B MW 1234 E, 0 320 320, 0 17-1, Y-123456...',
  AT: 'e.g. W 12345 A, O 320 320, L 4040 E, BP 12345...',
  CH: 'e.g. ZH 854123, BE 12345, M 12345...',
  JP: 'e.g. 品川 300 さ 12-34, 横浜 580 わ 5678, 外 1234...',
  TH: 'e.g. 1กข 1234 Bangkok, 8กก 8888, ป้ายแดง 9999...',
  VN: 'e.g. 30A-123.45, 51H-888.88, 80A-001.01, QA-12-34...',
  AU: 'e.g. NSW AA-12-BB, VIC 1AA-2BB, QLD 123-AA1...',
  NZ: 'e.g. ABC 123, AA 1234, KIWI, KOB 789...',
};

export const PlateChecker: React.FC<PlateCheckerProps> = ({ 
  country, 
  initialValue,
  onSwitchCountry 
}) => {
  const adapter = CountryAdapters[country];
  const quickSamples = SAMPLES_BY_COUNTRY[country] || SAMPLES_BY_COUNTRY.DE;
  const defaultInitial = quickSamples[0]?.plate || 'B MW 1234 E';

  const [inputVal, setInputVal] = useState<string>(initialValue || defaultInitial);
  const [copied, setCopied] = useState<boolean>(false);

  // Parse plate dynamically
  const parseResult: PlateParseResult = adapter.parse(inputVal);

  // Detect if user typed a plate matching another country
  const detectedOtherCountry = autoDetectCountry(inputVal);
  const showCrossCountryHint = !parseResult.isValid && detectedOtherCountry !== country;
  const otherCountryInfo = SUPPORTED_COUNTRIES.find((c) => c.id === detectedOtherCountry);

  const handleCopy = () => {
    navigator.clipboard.writeText(parseResult.normalizedPlate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRandomize = () => {
    const random = adapter.getRandomPlate();
    setInputVal(random.plate);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Search Bar & Interactive Plate Box */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 md:p-8 backdrop-blur shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
              Plate Inspector & Live Decoder ({adapter.info.flag} {adapter.info.name})
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Type any vehicle license plate to inspect its jurisdiction, category, color coding, legal status, and privileges.
            </p>
          </div>
          <button
            onClick={handleRandomize}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-sm font-semibold transition"
          >
            <Sparkles className="w-4 h-4" />
            Random Plate
          </button>
        </div>

        {/* Big Input Field */}
        <div className="relative mb-6">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={PLACEHOLDER_BY_COUNTRY[country]}
            className="w-full bg-slate-900/90 border-2 border-slate-700 focus:border-blue-500 text-white font-mono text-2xl md:text-3xl px-5 py-4 rounded-xl shadow-inner focus:outline-none transition uppercase tracking-wider"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition"
              title="Copy plate string"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Friendly Normalization Notice */}
        {parseResult.normalizedNotice && (
          <div className="mb-6 p-3 bg-blue-950/40 border border-blue-700/50 rounded-xl flex items-center gap-2 text-xs md:text-sm text-blue-200">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{parseResult.normalizedNotice}</span>
          </div>
        )}

        {/* Cross-Country Alternate Suggestion Banner */}
        {parseResult.alternateSuggestion && onSwitchCountry && (
          <div className="mb-6 p-3.5 bg-indigo-950/50 border border-indigo-600/50 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs md:text-sm text-indigo-200">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{parseResult.alternateSuggestion.label}</span>
            </div>
            <button
              onClick={() => onSwitchCountry(parseResult.alternateSuggestion!.country, parseResult.alternateSuggestion!.query)}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
            >
              Switch Country <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Auto-detected alternate country when parse fails */}
        {showCrossCountryHint && otherCountryInfo && onSwitchCountry && !parseResult.alternateSuggestion && (
          <div className="mb-6 p-3.5 bg-blue-950/50 border border-blue-600/50 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs md:text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                Entered plate looks like a format from {otherCountryInfo.flag} {otherCountryInfo.name}. Would you like to switch?
              </span>
            </div>
            <button
              onClick={() => onSwitchCountry(otherCountryInfo.id, inputVal)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
            >
              Switch to {otherCountryInfo.name} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Realistic Interactive License Plate Display */}
        <div className="py-6 flex flex-col items-center justify-center bg-slate-950/60 rounded-xl border border-slate-800/80 p-4">
          <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-4">
            Official Plate Preview ({adapter.info.name} Authentic Geometry & Seals)
          </span>
          <PlateRenderer plate={parseResult} size="lg" showScrews={true} />
        </div>

        {/* Quick Sample Presets */}
        <div className="mt-6">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 block">
            Explore {adapter.info.name} License Plate Types:
          </span>
          <div className="flex flex-wrap gap-2">
            {quickSamples.map((sample) => (
              <button
                key={sample.label}
                onClick={() => setInputVal(sample.plate)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium ${
                  inputVal === sample.plate
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                    : 'bg-slate-900/60 text-slate-300 border-slate-700/60 hover:border-slate-500 hover:text-white'
                }`}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Warnings & Errors */}
      {parseResult.prohibitedWarning && (
        <div className="bg-red-950/40 border border-red-500/50 rounded-2xl p-5 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-300 font-semibold text-base">Prohibited / Restricted Combination Detected</h3>
            <p className="text-sm text-red-200/90 mt-1">{parseResult.prohibitedWarning}</p>
          </div>
        </div>
      )}

      {parseResult.errors.length > 0 && !parseResult.prohibitedWarning && (
        <div className="bg-amber-950/40 border border-amber-500/50 rounded-2xl p-5 flex items-start gap-4">
          <Info className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-amber-300 font-semibold text-base">Validation Information</h3>
            <ul className="text-sm text-amber-200/90 mt-1 list-disc list-inside space-y-1">
              {parseResult.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Deep Inspection Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Category & Legal Type */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              {parseResult.category === 'electric' ? <Zap className="w-5 h-5 text-emerald-400" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Classification</span>
              <h3 className="text-lg font-bold text-white leading-tight">{parseResult.categoryName}</h3>
            </div>
          </div>
          <div className="text-xs text-blue-300 font-medium mb-3">{parseResult.categoryNameDe}</div>
          <p className="text-sm text-slate-300 mb-4 leading-relaxed">{parseResult.categoryDescription}</p>
          <div className="pt-3 border-t border-slate-700/60 text-xs text-slate-400 flex items-center justify-between">
            <span>Legal Foundation:</span>
            <span className="font-mono text-slate-300 truncate max-w-[180px]">{parseResult.legalBasis}</span>
          </div>
        </div>

        {/* Card 2: District & Geographic Jurisdiction */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Jurisdiction</span>
              <h3 className="text-lg font-bold text-white leading-tight">
                {parseResult.districtName || 'National / Official'}
              </h3>
            </div>
          </div>

          <div className="space-y-2.5 text-sm text-slate-300">
            <div className="flex justify-between items-center py-1 border-b border-slate-700/50">
              <span className="text-slate-400">District / Region:</span>
              <span className="font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                {parseResult.districtCode || '—'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-700/50">
              <span className="text-slate-400">State / Prefecture / Authority:</span>
              <span className="font-semibold text-white">{parseResult.state || adapter.info.name}</span>
            </div>
            {parseResult.diplomaticInfo && (
              <div className="py-2.5 bg-blue-950/50 border border-blue-800/60 rounded-xl p-3 mt-2">
                <span className="text-xs uppercase font-bold text-blue-300 block mb-1">Diplomatic Accreditation / Agency</span>
                <div className="flex items-center gap-2 text-white font-medium">
                  <span className="text-xl">{parseResult.diplomaticInfo.flag}</span>
                  <span className="text-sm font-semibold">{parseResult.diplomaticInfo.country}</span>
                </div>
                <div className="text-xs text-blue-200/90 mt-1 leading-snug">
                  {parseResult.diplomaticInfo.countryDe}
                </div>
                {parseResult.diplomaticInfo.role && (
                  <span className="text-[11px] text-slate-400 block mt-1">Role: {parseResult.diplomaticInfo.role}</span>
                )}
              </div>
            )}
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Environmental Zone / Status:</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-xs bg-emerald-950/60 border border-emerald-700/50 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Road Legal
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Special Privileges & Validity */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Perks & Validity</span>
              <h3 className="text-lg font-bold text-white leading-tight">Privileges & Status</h3>
            </div>
          </div>

          {parseResult.specialPerks.length > 0 ? (
            <ul className="space-y-2 text-sm text-slate-300">
              {parseResult.specialPerks.map((perk, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm">{perk}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 leading-relaxed">
              Standard vehicle registration in {adapter.info.name}. Requires periodic safety inspection, valid registration fees, and compulsory motor vehicle liability insurance.
            </p>
          )}

          {/* Expiry breakdown if applicable */}
          {(parseResult.expiryDay || parseResult.seasonStart) && (
            <div className="mt-4 pt-3 border-t border-slate-700/60 bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs mb-1">
                <Calendar className="w-3.5 h-3.5" />
                {parseResult.hasSeasonBand ? 'Operating Window' : 'Validity Expiration'}
              </div>
              <p className="text-xs text-slate-300">
                {parseResult.hasSeasonBand
                  ? `Active from Month ${parseResult.seasonStart} to Month ${parseResult.seasonEnd} each year.`
                  : `Expires on ${String(parseResult.expiryDay).padStart(2, '0')}.${String(parseResult.expiryMonth).padStart(2, '0')}.${parseResult.expiryYear}.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
