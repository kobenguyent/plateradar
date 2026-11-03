import React, { useState, useMemo } from 'react';
import { CountryCode, District } from '../../types';
import { CountryAdapters, SUPPORTED_COUNTRIES } from '../../core/country-registry';
import { GERMAN_DIPLOMATIC_CODES } from '../../data/diplomatic-codes-de';
import { Search, MapPin, Building, BookOpen, ExternalLink, Globe2 } from 'lucide-react';

interface DistrictDirectoryProps {
  country: CountryCode;
  onInspectPlate: (plateText: string) => void;
  onSwitchCountry?: (country: CountryCode) => void;
}

export const DistrictDirectory: React.FC<DistrictDirectoryProps> = ({ 
  country, 
  onInspectPlate,
  onSwitchCountry 
}) => {
  const adapter = CountryAdapters[country];
  
  // Base geographic districts
  const baseDistricts = adapter.getDistricts();

  // Country-specific enriching (e.g. diplomatic & federal codes)
  const allEntries: (District & { isDiplomatic?: boolean; samplePlate?: string })[] = useMemo(() => {
    if (country === 'DE') {
      const diplomaticEntries = Object.values(GERMAN_DIPLOMATIC_CODES).map((d) => ({
        code: `0 ${d.code}`,
        name: d.country,
        state: 'Diplomatisches Korps / Bund',
        stateCode: 'bundesadler',
        fullName: `${d.flag} ${d.countryDe}`,
        isDiplomatic: true,
        samplePlate: `0 ${d.code}-1`,
      }));
      return [...baseDistricts, ...diplomaticEntries];
    }

    if (country === 'US') {
      const usSpecial = [
        {
          code: 'DOS',
          name: 'U.S. Department of State',
          state: 'Federal Diplomatic (OFM)',
          stateCode: 'dc',
          fullName: 'Office of Foreign Missions (OFM) Diplomatic Corps',
          slogan: 'Vienna Convention Diplomatic Immunity',
          samplePlate: 'D 1234',
        },
        {
          code: 'USG',
          name: 'General Services Administration',
          state: 'Federal Civilian Fleet',
          stateCode: 'dc',
          fullName: 'U.S. Government Official Interagency Fleet',
          slogan: 'For Official Use Only',
          samplePlate: 'G12-3456',
        },
      ];
      return [...baseDistricts, ...usSpecial];
    }

    return baseDistricts;
  }, [country, baseDistricts]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'historical' | 'diplomatic'>('all');

  // Extract unique states for filter tabs
  const states = useMemo(() => {
    const set = new Set<string>();
    for (const d of allEntries) {
      if (d.state) set.add(d.state);
    }
    return Array.from(set).sort();
  }, [allEntries]);

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    let q = searchQuery.trim().toLowerCase();
    // Normalize 'O 320' to '0 320' for diplomatic queries
    if (/^o\s*[0-9]/i.test(q)) {
      q = q.replace(/^o/i, '0');
    }

    return allEntries.filter((d) => {
      // Search matches (checks code without spaces or formatted)
      const cleanCode = d.code.toLowerCase().replace(/\s+/g, '');
      const cleanQ = q.replace(/\s+/g, '');

      const matchesSearch =
        !q ||
        d.code.toLowerCase().includes(q) ||
        cleanCode.includes(cleanQ) ||
        d.name.toLowerCase().includes(q) ||
        d.fullName.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        (d.slogan && d.slogan.toLowerCase().includes(q));

      // State matches
      const matchesState = selectedState === 'all' || d.state === selectedState;

      // Filter matches
      const matchesType =
        filterType === 'all' ||
        (filterType === 'historical' && d.isHistorical) ||
        (filterType === 'active' && !d.isHistorical && !d.isDiplomatic) ||
        (filterType === 'diplomatic' && d.isDiplomatic);

      return matchesSearch && matchesState && matchesType;
    });
  }, [allEntries, searchQuery, selectedState, filterType]);

  const searchPlaceholder =
    country === 'DE' ? 'Search by district code (e.g. B, 0 320, M, DAH) or city...' :
    country === 'US' ? 'Search by state code (e.g. CA, NY, TX) or state name (California, Texas)...' :
    country === 'JP' ? 'Search by office (e.g. 品川, Shinagawa, 横浜)...' :
    country === 'TH' ? 'Search by province (e.g. Bangkok, Chiang Mai, เชียงใหม่)...' :
    country === 'VN' ? 'Search by code (e.g. 29, 30, 51, 80) or city (Hà Nội)...' :
    country === 'AU' ? 'Search by state (e.g. NSW, VIC, QLD)...' :
    country === 'NZ' ? 'Search by region (e.g. Auckland, Wellington)...' :
    'Search by code or region...';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Search Header */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 backdrop-blur shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-400" />
              {adapter.info.flag} {adapter.info.name} District Code &amp; Jurisdiction Directory
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Browse and search through all {allEntries.length} official registration districts, states, and special authorities.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300 font-mono">
            <span>Showing:</span>
            <span className="font-bold text-blue-400 text-sm">{filteredDistricts.length}</span>
            <span>/ {allEntries.length}</span>
          </div>
        </div>

        {/* Quick Country Selector Switcher inside Directory */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5 pt-3 border-t border-slate-700/60">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-blue-400" /> Country:
          </span>
          {SUPPORTED_COUNTRIES.map((c) => (
            <button
              key={c.id}
              onClick={() => onSwitchCountry && onSwitchCountry(c.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                country === c.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-700/70 border border-slate-700/60'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Search input & Filter row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none transition"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none transition"
            >
              <option value="all">All States &amp; Jurisdictions ({states.length})</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none transition"
            >
              <option value="all">All Classifications</option>
              <option value="active">Active Primary Districts</option>
              {country === 'DE' && <option value="historical">Historic / Liberalized Codes</option>}
              {(country === 'DE' || country === 'US') && <option value="diplomatic">Diplomatic &amp; Agency Codes</option>}
            </select>
          </div>
        </div>
      </div>

      {/* District Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDistricts.map((district) => {
          const badgePath = country === 'CH'
            ? `./badges/ch/${district.stateCode}.svg`
            : country === 'AT'
            ? `./badges/at/${district.stateCode}.svg`
            : `./badges/de/${district.stateCode}.svg`;

          const inspectCode = district.samplePlate || (
            country === 'JP'
              ? `${district.code} 300 さ 12-34`
              : country === 'TH'
              ? `1กข 1234 ${district.name.split(' ')[0]}`
              : country === 'VN'
              ? `${district.code}A-123.45`
              : country === 'AU'
              ? `${district.code} AA-12-BB`
              : country === 'NZ'
              ? `ABC 123`
              : country === 'US'
              ? `${district.code} ${(district as any).defaultFormat || '7SAM123'}`
              : `${district.code} AB 123`
          );

          return (
            <div
              key={district.code}
              className="group bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-blue-500/50 rounded-2xl p-4 transition-all duration-200 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  {/* Plate Code Tag */}
                  <span className={`font-mono font-bold text-2xl px-3 py-1 rounded-lg border shadow-inner ${
                    district.isDiplomatic 
                      ? 'bg-blue-950 text-blue-300 border-blue-700' 
                      : 'bg-slate-950 text-white border-slate-700 group-hover:border-blue-500 transition'
                  }`}>
                    {district.code}
                  </span>

                  {/* Federal State Badge or Country Flag */}
                  <div className="w-7 h-7 rounded-full bg-white/80 p-0.5 shadow-sm border border-slate-400 flex items-center justify-center overflow-hidden shrink-0">
                    {country === 'DE' || country === 'AT' || country === 'CH' ? (
                      <img
                        src={badgePath}
                        alt={district.state}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = './badges/de/bundesadler.svg';
                        }}
                      />
                    ) : (
                      <span className="text-base select-none leading-none">{adapter.info.flag}</span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-white text-lg group-hover:text-blue-300 transition line-clamp-1">
                  {district.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 mb-3">
                  {district.slogan ? district.slogan : district.fullName}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-400" />
                  {district.state}
                </span>

                <button
                  onClick={() => onInspectPlate(inspectCode)}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/10 hover:bg-blue-500/20 transition"
                >
                  Inspect <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDistricts.length === 0 && (
        <div className="text-center py-16 bg-slate-800/40 rounded-2xl border border-slate-700/60 p-8">
          <Building className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No districts found</h3>
          <p className="text-sm text-slate-400">
            No registration district matched your query "{searchQuery}". Try searching for another code or clear filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedState('all');
              setFilterType('all');
            }}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
