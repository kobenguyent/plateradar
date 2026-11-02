import React, { useState } from 'react';
import { CountryCode, PlateCategory, PlateParseResult } from '../../types';
import { CountryAdapters } from '../../core/country-registry';
import { PlateRenderer } from '../plate/PlateRenderer';
import { Palette, Download, Sparkles, Sliders, Check, Shield } from 'lucide-react';

interface PlateStudioProps {
  country: CountryCode;
}

export const PlateStudio: React.FC<PlateStudioProps> = ({ country }) => {
  const adapter = CountryAdapters[country];
  const districts = adapter.getDistricts();

  const [category, setCategory] = useState<PlateCategory>('standard');
  const [districtCode, setDistrictCode] = useState<string>('B');
  const [middleLetters, setMiddleLetters] = useState<string>('MW');
  const [numberPart, setNumberPart] = useState<string>('1234');
  const [suffix, setSuffix] = useState<string>(''); // '', 'E', 'H'
  const [seasonStart, setSeasonStart] = useState<number>(4);
  const [seasonEnd, setSeasonEnd] = useState<number>(10);
  const [tuevYear, setTuevYear] = useState<number>(2026);
  const [tuevMonth, setTuevMonth] = useState<number>(10);
  const [selectedStateCode, setSelectedStateCode] = useState<string>('berlin');
  const [fontType, setFontType] = useState<'FE' | 'DIN'>('FE');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Sync state badge when district changes
  const handleDistrictChange = (code: string) => {
    setDistrictCode(code);
    const d = adapter.findDistrict(code);
    if (d && d.stateCode) {
      setSelectedStateCode(d.stateCode);
    }
  };

  // Sync category change defaults
  const handleCategoryChange = (cat: PlateCategory) => {
    setCategory(cat);
    if (cat === 'electric') {
      setSuffix('E');
    } else if (cat === 'classic') {
      setSuffix('H');
    } else if (cat === 'dealer_collector_red') {
      setNumberPart('06123');
      setMiddleLetters('');
      setSuffix('');
    } else if (cat === 'short_term') {
      setNumberPart('04123');
      setMiddleLetters('');
      setSuffix('');
    } else if (cat === 'export') {
      setNumberPart('1234');
      setMiddleLetters('A');
      setSuffix('');
    } else if (cat === 'federal_armed_forces') {
      setDistrictCode('Y');
      setMiddleLetters('');
      setNumberPart('482195');
      setSuffix('');
    } else if (cat === 'federal_police') {
      setDistrictCode('BP');
      setMiddleLetters('');
      setNumberPart('18-450');
      setSuffix('');
    } else if (cat === 'diplomatic') {
      setDistrictCode('0');
      setMiddleLetters('');
      setNumberPart('17-1');
      setSuffix('');
    } else if (cat === 'historical_din') {
      setFontType('DIN');
      setSuffix('');
    } else {
      setSuffix('');
      setFontType('FE');
    }
  };

  // Construct plate model
  const customPlate: PlateParseResult = {
    country,
    rawInput: `${districtCode} ${middleLetters} ${numberPart} ${suffix}`.trim(),
    normalizedPlate: `${districtCode} ${middleLetters} ${numberPart} ${suffix}`.trim(),
    isValid: true,
    category,
    categoryName: 'Custom Built Plate',
    categoryNameDe: 'Individuelles Kennzeichen',
    categoryDescription: 'Crafted in PlateRadar Plate Studio.',
    districtCode,
    middleLetters: middleLetters || undefined,
    numberPart: numberPart || undefined,
    suffix: suffix || undefined,
    seasonStart: category === 'seasonal' || category === 'classic_seasonal' || category === 'electric_seasonal' ? seasonStart : undefined,
    seasonEnd: category === 'seasonal' || category === 'classic_seasonal' || category === 'electric_seasonal' ? seasonEnd : undefined,
    textColor: category === 'dealer_collector_red' ? 'red' : category === 'tax_exempt_green' ? 'green' : 'black',
    fontType: category === 'historical_din' ? 'DIN' : fontType,
    hasEuroBand: category !== 'federal_armed_forces' && category !== 'historical_din' && country !== 'CH',
    hasGermanFlag: category === 'federal_armed_forces',
    hasYellowBand: category === 'short_term',
    hasRedBand: category === 'export',
    hasSeasonBand: category === 'seasonal' || category === 'classic_seasonal' || category === 'electric_seasonal',
    expiryDay: 28,
    expiryMonth: 11,
    expiryYear: 2026,
    tuevYear,
    tuevMonth,
    badgeStateCode: selectedStateCode,
    specialPerks: [],
    legalBasis: 'FZV',
    errors: [],
  };

  const handleDownloadSVG = () => {
    // Generate clean SVG representation of the license plate
    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 110" width="520" height="110">
  <defs>
    <linearGradient id="metal" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f9fafb"/>
      <stop offset="50%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#e5e7eb"/>
    </linearGradient>
  </defs>
  <rect width="520" height="110" rx="12" fill="url(#metal)" stroke="${customPlate.textColor === 'red' ? '#b91c1c' : customPlate.textColor === 'green' ? '#047857' : '#111827'}" stroke-width="4.5"/>
  <rect x="3" y="3" width="514" height="104" rx="9" fill="none" stroke="${customPlate.textColor === 'red' ? '#b91c1c' : customPlate.textColor === 'green' ? '#047857' : '#111827'}" stroke-width="1.2" opacity="0.4"/>
  ${customPlate.hasEuroBand ? `
  <rect x="0" y="0" width="46" height="110" rx="10" fill="#003399"/>
  <text x="23" y="90" font-family="sans-serif" font-weight="bold" font-size="20" fill="#ffffff" text-anchor="middle">${country === 'AT' ? 'A' : 'D'}</text>
  ` : ''}
  <text x="270" y="76" font-family="'FE-Schrift', monospace, sans-serif" font-weight="bold" font-size="62" fill="${customPlate.textColor === 'red' ? '#b91c1c' : customPlate.textColor === 'green' ? '#047857' : '#111827'}" text-anchor="middle" letter-spacing="4">
    ${customPlate.normalizedPlate}
  </text>
</svg>
    `.trim();

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `plate-${customPlate.normalizedPlate.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Studio Header & Interactive Preview */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 md:p-8 backdrop-blur shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Palette className="w-6 h-6 text-blue-400" />
              Plate Studio & Generator
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Craft custom license plates with custom districts, letters, numbers, TÜV inspection stickers, and seasonal bands.
            </p>
          </div>
          <button
            onClick={handleDownloadSVG}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition shadow-lg"
          >
            {downloadSuccess ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            {downloadSuccess ? 'Downloaded!' : 'Download Vector SVG'}
          </button>
        </div>

        {/* Live Plate Preview Display */}
        <div className="py-8 flex flex-col items-center justify-center bg-slate-950/70 rounded-2xl border border-slate-800 p-6 shadow-inner">
          <PlateRenderer plate={customPlate} size="xl" showScrews={true} />
        </div>
      </div>

      {/* Customizer Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Plate Category & Typography */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-lg space-y-5">
          <h3 className="font-bold text-white text-lg flex items-center gap-2 border-b border-slate-700/60 pb-3">
            <Sliders className="w-5 h-5 text-blue-400" />
            Category & Style
          </h3>

          {/* Category Selector */}
          <div>
            <label className="text-xs uppercase font-semibold text-slate-400 block mb-2">
              Plate Category
            </label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value as PlateCategory)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="standard">Standard EU Plate (Euro-Kennzeichen)</option>
              <option value="electric">Electric Vehicle (E-Kennzeichen)</option>
              <option value="classic">Historic Oldtimer (H-Kennzeichen)</option>
              <option value="seasonal">Seasonal Plate (Saisonkennzeichen)</option>
              <option value="short_term">Short-Term Transfer (Kurzzeitkennzeichen 04)</option>
              <option value="export">Export Customs Plate (Ausfuhrkennzeichen)</option>
              <option value="dealer_collector_red">Dealer Red Plate (06 / 07)</option>
              <option value="tax_exempt_green">Tax-Exempt Green Plate (Grünes Kennzeichen)</option>
              <option value="diplomatic">Diplomatic Corps (Ambassador 0 / Embassy B)</option>
              <option value="federal_armed_forces">Bundeswehr (Armed Forces Y)</option>
              <option value="federal_police">Federal Police (BP)</option>
              <option value="historical_din">Pre-1995 Historical DIN 1451 Plate</option>
            </select>
          </div>

          {/* District Selector */}
          <div>
            <label className="text-xs uppercase font-semibold text-slate-400 block mb-2">
              District Code (Unterscheidungszeichen)
            </label>
            <div className="flex gap-2">
              <select
                value={districtCode}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none font-mono"
              >
                {districts.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.code} — {d.name} ({d.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Middle Letters & Numbers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase font-semibold text-slate-400 block mb-2">
                Middle Letters
              </label>
              <input
                type="text"
                maxLength={2}
                value={middleLetters}
                onChange={(e) => setMiddleLetters(e.target.value.toUpperCase())}
                placeholder="e.g. MW"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-center font-mono text-lg uppercase focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase font-semibold text-slate-400 block mb-2">
                Numbers Part
              </label>
              <input
                type="text"
                maxLength={4}
                value={numberPart}
                onChange={(e) => setNumberPart(e.target.value)}
                placeholder="e.g. 1234"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-center font-mono text-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Suffix (E / H) */}
          <div>
            <label className="text-xs uppercase font-semibold text-slate-400 block mb-2">
              Suffix Identifier
            </label>
            <div className="flex gap-3">
              {[
                { label: 'None', val: '' },
                { label: 'E (Electric)', val: 'E' },
                { label: 'H (Historic)', val: 'H' },
              ].map((s) => (
                <button
                  key={s.val}
                  onClick={() => setSuffix(s.val)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
                    suffix === s.val
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Stickers, Badges & Seasons */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-lg space-y-5">
          <h3 className="font-bold text-white text-lg flex items-center gap-2 border-b border-slate-700/60 pb-3">
            <Shield className="w-5 h-5 text-blue-400" />
            Inspection & Badges
          </h3>

          {/* TÜV Year & Month */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase font-semibold text-slate-400 block mb-2">
                HU/TÜV Year
              </label>
              <select
                value={tuevYear}
                onChange={(e) => setTuevYear(parseInt(e.target.value, 10))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase font-semibold text-slate-400 block mb-2">
                HU/TÜV Month
              </label>
              <select
                value={tuevMonth}
                onChange={(e) => setTuevMonth(parseInt(e.target.value, 10))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Month {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Federal State Seal Badge */}
          <div>
            <label className="text-xs uppercase font-semibold text-slate-400 block mb-2">
              Official State Coat of Arms (Zulassungsplakette)
            </label>
            <select
              value={selectedStateCode}
              onChange={(e) => setSelectedStateCode(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none capitalize"
            >
              {[
                'baden-wuerttemberg',
                'bayern',
                'berlin',
                'brandenburg',
                'bremen',
                'bundesadler',
                'hamburg',
                'hessen',
                'mecklenburg-vorpommern',
                'niedersachsen',
                'nordrhein-westfalen',
                'rheinland-pfalz',
                'saarland',
                'sachsen-anhalt',
                'sachsen',
                'schleswig-holstein',
                'thueringen',
              ].map((st) => (
                <option key={st} value={st}>
                  {st.replace(/-/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Seasonal Window (Only shown when seasonal active) */}
          {(category === 'seasonal' || category === 'classic_seasonal' || category === 'electric_seasonal') && (
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 space-y-3">
              <span className="text-xs font-bold text-amber-300 uppercase block">
                Operating Months (Saisonzeitraum)
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Start Month</label>
                  <select
                    value={seasonStart}
                    onChange={(e) => setSeasonStart(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {String(m).padStart(2, '0')} (Month {m})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">End Month</label>
                  <select
                    value={seasonEnd}
                    onChange={(e) => setSeasonEnd(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {String(m).padStart(2, '0')} (Month {m})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Font Type Toggle */}
          <div>
            <label className="text-xs uppercase font-semibold text-slate-400 block mb-2">
              Typography
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setFontType('FE')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
                  fontType === 'FE'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                FE-Schrift (Modern Euro)
              </button>
              <button
                onClick={() => setFontType('DIN')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
                  fontType === 'DIN'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                DIN 1451 (Pre-1995 Classic)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
