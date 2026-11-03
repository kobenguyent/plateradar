import React from 'react';
import { CountryCode } from '../../types';
import { SUPPORTED_COUNTRIES } from '../../core/country-registry';
import { ShieldCheck, Search, Palette, Trophy, BookOpen, Globe2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'checker' | 'directory' | 'studio' | 'quiz' | 'knowledge';
  setActiveTab: (tab: 'checker' | 'directory' | 'studio' | 'quiz' | 'knowledge') => void;
  selectedCountry: CountryCode;
  setSelectedCountry: (country: CountryCode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCountry,
  setSelectedCountry,
}) => {
  const activeCountryInfo = SUPPORTED_COUNTRIES.find((c) => c.id === selectedCountry) || SUPPORTED_COUNTRIES[0];
  const districtsCount = CountryAdapters[selectedCountry]?.getDistricts().length || 50;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('checker')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            {/* Logo Badge imitating a plate strip */}
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 border border-blue-400/30 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-base md:text-lg font-mono tracking-tighter">PR</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl md:text-2xl font-black tracking-tight text-white font-sans">
                  Plate<span className="text-blue-400">Radar</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                  <span>{activeCountryInfo.flag}</span>
                  <span>{activeCountryInfo.euroCode}</span>
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400 -mt-0.5 font-medium">
                {activeCountryInfo.name} &amp; International License Plate Radar
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80">
            <button
              onClick={() => setActiveTab('checker')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition ${
                activeTab === 'checker'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Inspector
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition ${
                activeTab === 'directory'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Search className="w-4 h-4" />
              Directory ({districtsCount})
            </button>

            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition ${
                activeTab === 'studio'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Palette className="w-4 h-4" />
              Plate Studio
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition ${
                activeTab === 'quiz'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Quiz
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition ${
                activeTab === 'knowledge'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Regulations
            </button>
          </nav>

          {/* Right Action: Extensible Country Selector */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 shadow-sm">
              <Globe2 className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value as CountryCode)}
                className="bg-transparent text-white text-xs md:text-sm font-bold focus:outline-none cursor-pointer pr-1"
                title="Select country to inspect"
              >
                {SUPPORTED_COUNTRIES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.flag} {c.name} ({c.euroCode})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 gap-2 border-t border-slate-800/80 no-scrollbar">
          {[
            { id: 'checker', label: 'Inspector', icon: ShieldCheck },
            { id: 'directory', label: 'Districts', icon: Search },
            { id: 'studio', label: 'Studio', icon: Palette },
            { id: 'quiz', label: 'Quiz', icon: Trophy },
            { id: 'knowledge', label: 'Regulations', icon: BookOpen },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
