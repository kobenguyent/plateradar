import React, { useState } from 'react';
import { CountryCode, PlateCategory, PlateParseResult } from '../../types';
import { CountryAdapters } from '../../core/country-registry';
import { PlateRenderer } from '../plate/PlateRenderer';
import { Palette, Download, Sliders, Check, Shield } from 'lucide-react';

interface PlateStudioProps {
  country: CountryCode;
}

export const PlateStudio: React.FC<PlateStudioProps> = ({ country }) => {
  const adapter = CountryAdapters[country];
  const districts = adapter.getDistricts();

  // Country-specific initial state
  const getInitialState = () => {
    switch (country) {
      case 'JP':
        return {
          category: 'standard' as PlateCategory,
          districtCode: '品川',
          classCode: '300',
          middleLetters: 'さ',
          numberPart: '12-34',
        };
      case 'TH':
        return {
          category: 'standard' as PlateCategory,
          districtCode: 'BKK',
          classCode: '',
          middleLetters: '1กข',
          numberPart: '1234',
        };
      case 'VN':
        return {
          category: 'standard' as PlateCategory,
          districtCode: '30',
          classCode: '',
          middleLetters: 'A',
          numberPart: '123.45',
        };
      case 'AU':
        return {
          category: 'standard' as PlateCategory,
          districtCode: 'NSW',
          classCode: '',
          middleLetters: '',
          numberPart: 'AA-12-BB',
        };
      case 'NZ':
        return {
          category: 'standard' as PlateCategory,
          districtCode: 'NZ',
          classCode: '',
          middleLetters: 'ABC',
          numberPart: '123',
        };
      case 'US':
        return {
          category: 'standard' as PlateCategory,
          districtCode: 'CA',
          classCode: '',
          middleLetters: '',
          numberPart: '7SAM123',
        };
      case 'AT':
        return {
          category: 'standard' as PlateCategory,
          districtCode: 'W',
          classCode: '',
          middleLetters: '',
          numberPart: '12345 A',
        };
      case 'CH':
        return {
          category: 'standard' as PlateCategory,
          districtCode: 'ZH',
          classCode: '',
          middleLetters: '',
          numberPart: '854123',
        };
      default:
        return {
          category: 'standard' as PlateCategory,
          districtCode: 'B',
          classCode: '',
          middleLetters: 'MW',
          numberPart: '1234',
        };
    }
  };

  const init = getInitialState();
  const [category, setCategory] = useState<PlateCategory>(init.category);
  const [districtCode, setDistrictCode] = useState<string>(init.districtCode);
  const [classCode, setClassCode] = useState<string>(init.classCode);
  const [middleLetters, setMiddleLetters] = useState<string>(init.middleLetters);
  const [numberPart, setNumberPart] = useState<string>(init.numberPart);
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
    if (country === 'JP') {
      if (cat === 'kei_car') {
        setClassCode('580');
        setMiddleLetters('わ');
      } else if (cat === 'diplomatic') {
        setMiddleLetters('');
        setNumberPart('1234');
      } else if (cat === 'commercial') {
        setClassCode('200');
      } else {
        setClassCode('300');
        setMiddleLetters('さ');
      }
    } else if (country === 'TH') {
      if (cat === 'short_term') {
        setMiddleLetters('ก');
        setNumberPart('9999');
      }
    } else if (country === 'VN') {
      if (cat === 'government') {
        setDistrictCode('80');
        setMiddleLetters('A');
      } else if (cat === 'federal_armed_forces') {
        setMiddleLetters('QA');
        setNumberPart('12-34');
      }
    } else if (country === 'US') {
      if (cat === 'diplomatic') {
        setNumberPart('D 1234');
      } else if (cat === 'government') {
        setNumberPart('G12-3456');
      } else {
        setNumberPart('7SAM123');
      }
    } else if (country === 'DE') {
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
    }
  };

  // Build input text for parser
  const buildPlateString = () => {
    if (country === 'JP') {
      if (category === 'diplomatic') return `外 ${numberPart}`;
      return `${districtCode} ${classCode || '300'} ${middleLetters || 'さ'} ${numberPart}`;
    }
    if (country === 'TH') {
      if (category === 'short_term') return `ก-${numberPart} แดง`;
      const d = adapter.findDistrict(districtCode);
      const provName = d ? d.name.split(' ')[0] : 'Bangkok';
      return `${middleLetters} ${numberPart} ${provName}`;
    }
    if (country === 'VN') {
      if (category === 'federal_armed_forces') return `${middleLetters || 'QA'}-${numberPart}`;
      return `${districtCode}${middleLetters}-${numberPart}`;
    }
    if (country === 'AU') {
      return `${districtCode} ${numberPart}`;
    }
    if (country === 'NZ') {
      return `${middleLetters} ${numberPart}`.trim();
    }
    if (country === 'US') {
      if (category === 'diplomatic') return `D ${numberPart.replace(/[^0-9]/g, '') || '1234'}`;
      if (category === 'government') return `G12-${numberPart.replace(/[^0-9]/g, '') || '3456'}`;
      return `${districtCode} ${numberPart}`;
    }
    if (country === 'CH') {
      return `${districtCode} ${numberPart}`.trim();
    }
    if (country === 'AT') {
      return `${districtCode} ${numberPart}`.trim();
    }
    // Default Germany
    return `${districtCode} ${middleLetters} ${numberPart} ${suffix}`.trim();
  };

  const parsedBase = adapter.parse(buildPlateString(), {
    category,
    tuevYear,
    tuevMonth,
    badgeStateCode: selectedStateCode,
    fontType,
  });

  const customPlate: PlateParseResult = {
    ...parsedBase,
    tuevYear,
    tuevMonth,
    badgeStateCode: selectedStateCode,
    fontType: category === 'historical_din' ? 'DIN' : fontType,
    seasonStart: category === 'seasonal' || category === 'classic_seasonal' || category === 'electric_seasonal' ? seasonStart : undefined,
    seasonEnd: category === 'seasonal' || category === 'classic_seasonal' || category === 'electric_seasonal' ? seasonEnd : undefined,
    hasSeasonBand: category === 'seasonal' || category === 'classic_seasonal' || category === 'electric_seasonal',
  };

  const handleDownloadSVG = () => {
    const isJapan = country === 'JP';
    const width = isJapan ? 330 : 520;
    const height = isJapan ? 165 : 110;
    const bgFill =
      customPlate.backgroundColor === 'yellow'
        ? '#ffcc00'
        : customPlate.backgroundColor === 'green'
        ? '#1b5e20'
        : customPlate.backgroundColor === 'blue'
        ? '#0d47a1'
        : customPlate.backgroundColor === 'red'
        ? '#c62828'
        : '#ffffff';

    const textFill =
      customPlate.textColor === 'red'
        ? '#b91c1c'
        : customPlate.textColor === 'green'
        ? '#047857'
        : customPlate.textColor === 'blue'
        ? '#0d47a1'
        : customPlate.textColor === 'white'
        ? '#ffffff'
        : '#111827';

    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" rx="12" fill="${bgFill}" stroke="${textFill}" stroke-width="4.5"/>
  <rect x="3" y="3" width="${width - 6}" height="${height - 6}" rx="9" fill="none" stroke="${textFill}" stroke-width="1.2" opacity="0.3"/>
  ${
    customPlate.hasEuroBand
      ? `
  <rect x="0" y="0" width="46" height="${height}" rx="10" fill="#003399"/>
  <text x="23" y="${height - 20}" font-family="sans-serif" font-weight="bold" font-size="20" fill="#ffffff" text-anchor="middle">${country === 'AT' ? 'A' : 'D'}</text>
  `
      : ''
  }
  ${
    isJapan
      ? `
  <text x="${width / 2}" y="45" font-family="sans-serif" font-weight="bold" font-size="26" fill="${textFill}" text-anchor="middle" letter-spacing="4">
    ${customPlate.topLineText || `${districtCode} ${classCode}`}
  </text>
  <text x="${width / 2}" y="125" font-family="'FE-Schrift', sans-serif" font-weight="bold" font-size="52" fill="${textFill}" text-anchor="middle" letter-spacing="6">
    ${middleLetters} ${customPlate.numberPart}
  </text>
  `
      : `
  <text x="${width / 2 + (customPlate.hasEuroBand ? 15 : 0)}" y="${height * 0.65}" font-family="'FE-Schrift', monospace, sans-serif" font-weight="bold" font-size="54" fill="${textFill}" text-anchor="middle" letter-spacing="4">
    ${customPlate.normalizedPlate}
  </text>
  ${
    customPlate.bottomLineText
      ? `<text x="${width / 2}" y="${height - 12}" font-family="sans-serif" font-weight="bold" font-size="11" fill="${textFill}" text-anchor="middle" letter-spacing="2" opacity="0.85">${customPlate.bottomLineText}</text>`
      : ''
  }
  `
  }
</svg>
    `.trim();

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `plate-${country}-${customPlate.normalizedPlate.replace(/[\s\/-]+/g, '_')}.svg`;
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
              Plate Studio & Generator ({adapter.info.flag} {adapter.info.name})
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Craft custom license plates with authentic typography, seals, slogans, and regional classifications.
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
              {country === 'DE' && (
                <>
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
                </>
              )}
              {country === 'AT' && (
                <>
                  <option value="standard">Standard Austrian Plate (Wien, Graz, etc.)</option>
                  <option value="electric">Electric Vehicle (Green font / IG-L exempt)</option>
                  <option value="federal_police">Federal Police (BP)</option>
                  <option value="federal_armed_forces">Austrian Armed Forces (BH)</option>
                </>
              )}
              {country === 'CH' && (
                <>
                  <option value="standard">Standard Cantonal Plate (Zürich, Bern...)</option>
                  <option value="federal_armed_forces">Swiss Armed Forces (M)</option>
                </>
              )}
              {country === 'JP' && (
                <>
                  <option value="standard">Standard Passenger Car (White / Green font)</option>
                  <option value="kei_car">Kei Car Mini-Vehicle (Yellow / Black font)</option>
                  <option value="commercial">Commercial Transport (Green / White font)</option>
                  <option value="diplomatic">Diplomatic Corps (Blue / White font 外)</option>
                </>
              )}
              {country === 'TH' && (
                <>
                  <option value="standard">Private Passenger Sedan (White / Black font)</option>
                  <option value="commercial">Private Pickup / Taxi (Green / Yellow)</option>
                  <option value="short_term">Temporary Registration (Red plate ป้ายแดง)</option>
                </>
              )}
              {country === 'VN' && (
                <>
                  <option value="standard">Civilian Vehicle Plate (White / Black)</option>
                  <option value="government">State & Government Plate (Blue / White 80A)</option>
                  <option value="commercial">Commercial Transport (Yellow / Black)</option>
                  <option value="federal_armed_forces">People’s Army Military Plate (Red / White QA)</option>
                </>
              )}
              {country === 'AU' && (
                <>
                  <option value="standard">Standard State Issue Plate</option>
                </>
              )}
              {country === 'NZ' && (
                <>
                  <option value="standard">Standard Series (ABC 123) / Personalised</option>
                  <option value="classic">Legacy Pre-2001 Series (AA 1234)</option>
                </>
              )}
              {country === 'US' && (
                <>
                  <option value="standard">Standard State Issue Plate (DMV)</option>
                  <option value="classic">Antique / Historic Vehicle</option>
                  <option value="diplomatic">U.S. Dept of State Diplomatic (OFM)</option>
                  <option value="government">U.S. Federal Government (GSA Fleet)</option>
                </>
              )}
            </select>
          </div>

          {/* District / State / Province Selector */}
          <div>
            <label className="text-xs uppercase font-semibold text-slate-400 block mb-2">
              {country === 'JP' ? 'Transport Branch Office (Kanji)' : country === 'AU' || country === 'US' ? 'State / Jurisdiction' : country === 'VN' ? 'Province Code' : country === 'CH' ? 'Canton' : 'District Code'}
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

          {/* Japan Specific Class Code */}
          {country === 'JP' && category !== 'diplomatic' && (
            <div>
              <label className="text-xs uppercase font-semibold text-slate-400 block mb-2">
                Vehicle Class Code (3-digit)
              </label>
              <input
                type="text"
                maxLength={3}
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                placeholder="e.g. 300, 500, 580"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-center font-mono text-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Middle Letters & Numbers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase font-semibold text-slate-400 block mb-2">
                {country === 'JP' ? 'Hiragana / Character' : country === 'TH' ? 'Prefix Letters' : country === 'VN' ? 'Series Letter' : 'Letters'}
              </label>
              <input
                type="text"
                maxLength={4}
                value={middleLetters}
                onChange={(e) => setMiddleLetters(e.target.value)}
                placeholder={country === 'JP' ? 'さ' : 'MW'}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-center font-mono text-lg uppercase focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase font-semibold text-slate-400 block mb-2">
                Numbers Part
              </label>
              <input
                type="text"
                maxLength={8}
                value={numberPart}
                onChange={(e) => setNumberPart(e.target.value)}
                placeholder="e.g. 1234"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-center font-mono text-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Suffix (for Germany) */}
          {country === 'DE' && (
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
          )}
        </div>

        {/* Right Column: Stickers, Badges & Seasons */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-lg space-y-5">
          <h3 className="font-bold text-white text-lg flex items-center gap-2 border-b border-slate-700/60 pb-3">
            <Shield className="w-5 h-5 text-blue-400" />
            Inspection & Badges
          </h3>

          {/* TÜV Year & Month (For DE and AT) */}
          {(country === 'DE' || country === 'AT') ? (
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
          ) : (
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 text-xs text-slate-300">
              <span className="font-bold block mb-1 text-blue-300">Regional Authority Specifications:</span>
              Vehicle registration adheres to {adapter.info.name} transport ministry regulations. Official seals and security markings are rendered automatically.
            </div>
          )}

          {/* Federal State Seal Badge (for Germany) */}
          {country === 'DE' && (
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
          )}

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
                FE-Schrift (Modern)
              </button>
              <button
                onClick={() => setFontType('DIN')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
                  fontType === 'DIN'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                DIN 1451 (Classic)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
