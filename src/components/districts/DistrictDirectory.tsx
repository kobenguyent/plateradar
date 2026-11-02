import React, { useState, useMemo } from 'react';
import { CountryCode, District } from '../../types';
import { CountryAdapters } from '../../core/country-registry';
import { Search, MapPin, Building, Filter, ExternalLink, Sparkles, BookOpen } from 'lucide-react';

interface DistrictDirectoryProps {
  country: CountryCode;
  onInspectPlate: (plateText: string) => void;
}

export const DistrictDirectory: React.FC<DistrictDirectoryProps> = ({ country, onInspectPlate }) => {
  const adapter = CountryAdapters[country];
  const allDistricts = adapter.getDistricts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [filterHistorical, setFilterHistorical] = useState<'all' | 'active' | 'historical'>('all');

  // Extract unique states for filter tabs
  const states = useMemo(() => {
    const set = new Set<string>();
    for (const d of allDistricts) {
      if (d.state) set.add(d.state);
    }
    return Array.from(set).sort();
  }, [allDistricts]);

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allDistricts.filter((d) => {
      // Search matches
      const matchesSearch =
        !q ||
        d.code.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        d.fullName.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q);

      // State matches
      const matchesState = selectedState === 'all' || d.state === selectedState;

      // Historical matches
      const matchesHistorical =
        filterHistorical === 'all' ||
        (filterHistorical === 'historical' && d.isHistorical) ||
        (filterHistorical === 'active' && !d.isHistorical);

      return matchesSearch && matchesState && matchesHistorical;
    });
  }, [allDistricts, searchQuery, selectedState, filterHistorical]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Search Header */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 backdrop-blur shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-400" />
              {adapter.info.name} District Code Directory
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Browse and search through all {allDistricts.length} official vehicle registration districts (Unterscheidungszeichen).
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300 font-mono">
            <span>Showing:</span>
            <span className="font-bold text-blue-400 text-sm">{filteredDistricts.length}</span>
            <span>/ {allDistricts.length}</span>
          </div>
        </div>

        {/* Search input & Filter row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by code (e.g. B, M, HH, DAH) or city name..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none transition"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none transition"
            >
              <option value="all">All Federal States ({states.length})</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={filterHistorical}
              onChange={(e) => setFilterHistorical(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none transition"
            >
              <option value="all">All District Types</option>
              <option value="active">Active Primary Districts</option>
              <option value="historical">Historic / Re-introduced Codes</option>
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

          return (
            <div
              key={district.code}
              className="group bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-blue-500/50 rounded-2xl p-4 transition-all duration-200 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  {/* Plate Code Tag with FE-Schrift style */}
                  <span className="font-mono font-bold text-2xl text-white bg-slate-950 px-3 py-1 rounded-lg border border-slate-700 group-hover:border-blue-500 transition shadow-inner">
                    {district.code}
                  </span>

                  {/* Federal State Badge */}
                  <div className="w-7 h-7 rounded-full bg-white/80 p-0.5 shadow-sm border border-slate-400 flex items-center justify-center overflow-hidden">
                    <img
                      src={badgePath}
                      alt={district.state}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = './badges/de/bundesadler.svg';
                      }}
                    />
                  </div>
                </div>

                <h3 className="font-bold text-white text-lg group-hover:text-blue-300 transition line-clamp-1">
                  {district.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 mb-3">
                  {district.fullName}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-400" />
                  {district.state}
                </span>

                <button
                  onClick={() => onInspectPlate(`${district.code} AB 123`)}
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
              setFilterHistorical('all');
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
