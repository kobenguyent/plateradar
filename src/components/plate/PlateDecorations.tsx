import React from 'react';
import { PlateParseResult } from '../../types';

interface USStateDecorationProps {
  plate: PlateParseResult;
  textColorClass?: string;
}

/**
 * Authentic US State Visual Decorations:
 * Renders state-specific header typography, central emblems/separators,
 * background watermark silhouettes, and registration validation corner stickers.
 */
export const USStateDecoration: React.FC<USStateDecorationProps> = ({ plate, textColorClass = 'text-zinc-900' }) => {
  const code = (plate.districtCode || 'CA').toUpperCase();
  const category = plate.category;

  // Diplomatic OFM
  if (category === 'diplomatic' || code === 'DOS') {
    return (
      <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none">
        {/* Top Diplomatic Header Bar */}
        <div className="w-full bg-[#002868] text-white py-1 px-3 flex items-center justify-between rounded-t-sm shadow-sm">
          <div className="w-5 h-5 rounded-full border border-amber-300 bg-amber-400/20 flex items-center justify-center">
            <span className="text-[7px] font-bold text-amber-300">★</span>
          </div>
          <span className="text-[10px] md:text-xs font-black tracking-widest font-sans uppercase">
            U.S. DEPARTMENT OF STATE
          </span>
          <div className="w-5 h-5 rounded-full border border-amber-300 bg-amber-400/20 flex items-center justify-center">
            <span className="text-[7px] font-bold text-amber-300">★</span>
          </div>
        </div>

        {/* Center Diplomatic Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-24 h-24 rounded-full border-4 border-[#002868] flex items-center justify-center">
            <span className="text-4xl font-serif font-black text-[#002868]">USA</span>
          </div>
        </div>

        {/* Bottom Slogan */}
        <div className="w-full flex items-center justify-center pb-0.5">
          <span className="text-[9px] md:text-[11px] font-black tracking-widest text-[#002868] uppercase">
            {plate.bottomLineText || 'DIPLOMAT'}
          </span>
        </div>
      </div>
    );
  }

  // Federal Government GSA Fleet
  if (category === 'government' || code === 'USG') {
    return (
      <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none">
        <div className="w-full bg-[#1e3a8a] text-white py-0.5 px-3 flex items-center justify-center rounded-t-sm shadow-sm">
          <span className="text-[10px] md:text-xs font-black tracking-widest uppercase">
            U.S. GOVERNMENT
          </span>
        </div>
        <div className="w-full flex items-center justify-center pb-0.5">
          <span className="text-[8px] md:text-[10px] font-bold tracking-widest text-slate-700 uppercase">
            FOR OFFICIAL USE ONLY
          </span>
        </div>
      </div>
    );
  }

  // State-specific visual decorations
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* 1. California (CA): Red cursive header + corner stickers */}
      {code === 'CA' && (
        <>
          <div className="absolute top-1 left-2 w-5 h-4 md:w-6 md:h-5 rounded-[2px] bg-blue-700 text-white font-mono font-bold text-[8px] md:text-[9px] flex items-center justify-center shadow-inner border border-blue-900 leading-none z-10">
            OCT
          </div>
          <div className="absolute top-0.5 inset-x-0 flex items-center justify-center z-10">
            <span
              className="text-red-700 text-lg md:text-2xl font-bold italic tracking-normal drop-shadow-sm"
              style={{ fontFamily: 'Georgia, "Brush Script MT", cursive, serif' }}
            >
              California
            </span>
          </div>
          <div className="absolute top-1 right-2 w-5 h-4 md:w-6 md:h-5 rounded-[2px] bg-amber-400 text-black font-mono font-bold text-[8px] md:text-[9px] flex items-center justify-center shadow-inner border border-amber-600 leading-none z-10">
            26
          </div>
          <div className="absolute bottom-1 inset-x-0 flex items-center justify-center">
            <span className="text-[8px] md:text-[9px] font-bold tracking-widest text-slate-600 uppercase">
              dmv.ca.gov
            </span>
          </div>
        </>
      )}

      {/* 2. Texas (TX): Bold TEXAS + Lone Star + State Map Watermark */}
      {code === 'TX' && (
        <>
          <div className="absolute top-1 left-3 flex items-center gap-1 z-10">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 md:w-4 md:h-4 fill-zinc-900">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          </div>
          <div className="absolute top-1 inset-x-0 flex items-center justify-center z-10">
            <span className="font-black text-sm md:text-lg tracking-[0.2em] text-zinc-900 font-sans">
              TEXAS
            </span>
          </div>
          <div className="absolute top-1 right-3 flex items-center gap-1 z-10">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 md:w-4 md:h-4 fill-zinc-900">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          </div>
          {/* Texas Silhouette Map in Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <svg viewBox="0 0 100 100" className="w-20 h-20 fill-zinc-900">
              <path d="M20,15 L65,15 L65,45 L85,45 L90,65 L70,95 L40,95 L30,65 L15,40 Z" />
            </svg>
          </div>
          <div className="absolute bottom-1 inset-x-0 flex items-center justify-center">
            <span className="text-[8px] md:text-[9px] font-bold tracking-widest text-zinc-700 uppercase">
              THE LONE STAR STATE
            </span>
          </div>
        </>
      )}

      {/* 3. New York (NY): Dark blue & gold top banner + Empire State */}
      {code === 'NY' && (
        <>
          <div className="absolute top-0 inset-x-0 h-6 md:h-7 bg-[#0d2847] border-b-2 border-[#eab308] flex items-center justify-center z-10">
            <span className="font-black text-xs md:text-sm tracking-widest text-[#facc15] font-sans">
              NEW YORK
            </span>
          </div>
          {/* Statue of Liberty Torch Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <svg viewBox="0 0 40 80" className="w-10 h-20 fill-[#0d2847]">
              <path d="M20,5 L23,15 L17,15 Z M18,17 L22,17 L24,35 L16,35 Z M14,35 L26,35 L20,75 Z" />
            </svg>
          </div>
          <div className="absolute bottom-1 inset-x-0 flex items-center justify-center">
            <span className="text-[8px] md:text-[10px] font-black tracking-widest text-[#0d2847] uppercase">
              EMPIRE STATE
            </span>
          </div>
        </>
      )}

      {/* 4. Florida (FL): Oranges Graphic in Center + Green Header */}
      {code === 'FL' && (
        <>
          <div className="absolute top-1 inset-x-0 flex items-center justify-center z-10">
            <span className="font-black text-sm md:text-lg tracking-widest text-emerald-800 font-sans">
              MYFLORIDA.COM
            </span>
          </div>
          {/* Authentic Oranges Graphic in Center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-85 z-0">
            <svg viewBox="0 0 60 60" className="w-7 h-7 md:w-9 md:h-9">
              {/* Leaves */}
              <path d="M30,16 C26,8 18,10 16,16 C22,18 28,18 30,16 Z" fill="#16a34a" />
              <path d="M30,16 C34,8 42,10 44,16 C38,18 32,18 30,16 Z" fill="#15803d" />
              {/* Twin Oranges */}
              <circle cx="23" cy="33" r="12" fill="#ea580c" stroke="#c2410c" strokeWidth="1" />
              <circle cx="37" cy="33" r="12" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
              <circle cx="34" cy="27" r="3" fill="#fed7aa" opacity="0.6" />
            </svg>
          </div>
          <div className="absolute bottom-1 inset-x-0 flex items-center justify-center">
            <span className="text-[8px] md:text-[9px] font-bold tracking-widest text-emerald-900 uppercase">
              SUNSHINE STATE
            </span>
          </div>
        </>
      )}

      {/* 5. Washington (WA): Mount Rainier silhouette backdrop */}
      {code === 'WA' && (
        <>
          <div className="absolute inset-0 flex items-end justify-center pointer-events-none opacity-25">
            <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
              <polygon points="10,100 70,55 100,20 130,55 190,100" fill="#93c5fd" />
              <polygon points="90,34 100,20 110,34 105,31 100,36 95,31" fill="#ffffff" />
            </svg>
          </div>
          <div className="absolute top-1 inset-x-0 flex items-center justify-center z-10">
            <span className="font-black text-sm md:text-lg tracking-widest text-blue-900 font-sans">
              WASHINGTON
            </span>
          </div>
          <div className="absolute bottom-1 inset-x-0 flex items-center justify-center">
            <span className="text-[8px] md:text-[9px] font-bold tracking-widest text-slate-700 uppercase">
              EVERGREEN STATE
            </span>
          </div>
        </>
      )}

      {/* 6. Colorado (CO): Rocky Mountain jagged peaks & green base */}
      {code === 'CO' && (
        <>
          <div className="absolute inset-0 pointer-events-none">
            <svg viewBox="0 0 300 150" className="w-full h-full" preserveAspectRatio="none">
              <polygon points="0,150 0,95 40,55 80,90 130,35 170,80 220,30 260,75 300,50 300,150" fill="#14532d" opacity="0.85" />
              <polygon points="30,67 40,55 50,67 40,63" fill="#ffffff" />
              <polygon points="120,50 130,35 140,50 130,45" fill="#ffffff" />
              <polygon points="210,45 220,30 230,45 220,40" fill="#ffffff" />
            </svg>
          </div>
          <div className="absolute bottom-1 inset-x-0 flex items-center justify-center z-10">
            <span className="font-black text-xs md:text-sm tracking-widest text-white uppercase drop-shadow">
              COLORADO
            </span>
          </div>
        </>
      )}

      {/* 7. Hawaii (HI): Arched Rainbow across center */}
      {code === 'HI' && (
        <>
          <div className="absolute inset-0 pointer-events-none opacity-45">
            <svg viewBox="0 0 300 150" className="w-full h-full" preserveAspectRatio="none">
              <path d="M-20,135 Q150,-20 320,135" fill="none" stroke="#ef4444" strokeWidth="8" />
              <path d="M-20,143 Q150,-12 320,143" fill="none" stroke="#f97316" strokeWidth="8" />
              <path d="M-20,151 Q150,-4 320,151" fill="none" stroke="#eab308" strokeWidth="8" />
              <path d="M-20,159 Q150,4 320,159" fill="none" stroke="#22c55e" strokeWidth="8" />
              <path d="M-20,167 Q150,12 320,167" fill="none" stroke="#3b82f6" strokeWidth="8" />
            </svg>
          </div>
          <div className="absolute top-1 inset-x-0 flex items-center justify-center z-10">
            <span className="font-black text-sm md:text-lg tracking-widest text-zinc-900 font-sans">
              HAWAII
            </span>
          </div>
          <div className="absolute bottom-1 inset-x-0 flex items-center justify-center z-10">
            <span className="text-[8px] md:text-[9px] font-bold tracking-widest text-zinc-700 uppercase">
              ALOHA STATE
            </span>
          </div>
        </>
      )}

      {/* 8. Arizona (AZ): Desert Sunset Gradient + Saguaro Cactus */}
      {code === 'AZ' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-orange-50 to-amber-100 opacity-60" />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70 z-0">
            <svg viewBox="0 0 40 80" className="w-4 h-8 md:w-5 md:h-10 fill-amber-900">
              <path d="M18,80 L22,80 L22,8 L18,8 Z M10,28 L14,28 L14,48 L18,48 L18,52 L10,52 Z M30,36 L26,36 L26,55 L22,55 L22,60 L30,60 Z" />
            </svg>
          </div>
          <div className="absolute top-1 inset-x-0 flex items-center justify-center z-10">
            <span className="font-black text-sm md:text-lg tracking-widest text-amber-950 font-sans">
              ARIZONA
            </span>
          </div>
          <div className="absolute bottom-1 inset-x-0 flex items-center justify-center">
            <span className="text-[8px] md:text-[9px] font-bold tracking-widest text-amber-900 uppercase">
              GRAND CANYON STATE
            </span>
          </div>
        </>
      )}

      {/* 9. Pennsylvania (PA): Top/Bottom bars + Keystone Separator */}
      {code === 'PA' && (
        <>
          <div className="absolute top-0 inset-x-0 h-4 md:h-5 bg-[#1e3a8a] flex items-center justify-center z-10">
            <span className="font-black text-[9px] md:text-[11px] tracking-wider text-amber-300">
              visitPA.com
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-80 z-0">
            <svg viewBox="0 0 100 100" className="w-5 h-5 md:w-6 md:h-6 fill-[#1e3a8a]">
              <polygon points="10,10 90,10 80,45 95,90 5,90 20,45" />
            </svg>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-4 md:h-5 bg-[#facc15] flex items-center justify-center z-10">
            <span className="font-black text-[9px] md:text-[11px] tracking-wider text-[#1e3a8a]">
              KEYSTONE STATE
            </span>
          </div>
        </>
      )}

      {/* 10. New Mexico (NM): Zia Sun Symbol in Center */}
      {code === 'NM' && (
        <>
          <div className="absolute inset-0 flex items-center justify-center opacity-75 z-0">
            <svg viewBox="0 0 100 100" className="w-7 h-7 md:w-9 md:h-9 stroke-red-600 fill-none" strokeWidth="4">
              <circle cx="50" cy="50" r="16" />
              <line x1="44" y1="30" x2="44" y2="10" /><line x1="48" y1="30" x2="48" y2="4" /><line x1="52" y1="30" x2="52" y2="4" /><line x1="56" y1="30" x2="56" y2="10" />
              <line x1="44" y1="70" x2="44" y2="90" /><line x1="48" y1="70" x2="48" y2="96" /><line x1="52" y1="70" x2="52" y2="96" /><line x1="56" y1="70" x2="56" y2="90" />
              <line x1="30" y1="44" x2="10" y2="44" /><line x1="30" y1="48" x2="4" y2="48" /><line x1="30" y1="52" x2="4" y2="52" /><line x1="30" y1="56" x2="10" y2="56" />
              <line x1="70" y1="44" x2="90" y2="44" /><line x1="70" y1="48" x2="96" y2="48" /><line x1="70" y1="52" x2="96" y2="52" /><line x1="70" y1="56" x2="90" y2="56" />
            </svg>
          </div>
          <div className="absolute top-1 inset-x-0 flex items-center justify-center z-10">
            <span className="font-black text-sm md:text-lg tracking-widest text-red-700 font-sans">
              New Mexico
            </span>
          </div>
          <div className="absolute bottom-1 inset-x-0 flex items-center justify-center">
            <span className="text-[8px] md:text-[9px] font-bold tracking-widest text-red-900 uppercase">
              Land of Enchantment
            </span>
          </div>
        </>
      )}

      {/* 11. Oregon (OR): Douglas Fir Tree in Center */}
      {code === 'OR' && (
        <>
          <div className="absolute inset-0 flex items-center justify-center opacity-85 z-0">
            <svg viewBox="0 0 24 24" className="w-6 h-7 md:w-7 md:h-8 fill-emerald-800">
              <polygon points="12,2 8,8 10,8 6,14 9,14 5,20 19,20 15,14 18,14 14,8 16,8" />
              <rect x="11" y="20" width="2" height="3" fill="#78350f" />
            </svg>
          </div>
          <div className="absolute top-1 inset-x-0 flex items-center justify-center z-10">
            <span className="font-black text-sm md:text-lg tracking-widest text-blue-900 font-sans">
              OREGON
            </span>
          </div>
          <div className="absolute bottom-1 inset-x-0 flex items-center justify-center">
            <span className="text-[8px] md:text-[9px] font-bold tracking-widest text-slate-700 uppercase">
              PACIFIC WONDERLAND
            </span>
          </div>
        </>
      )}

      {/* 12. Georgia (GA): Peach in Center */}
      {code === 'GA' && (
        <>
          <div className="absolute inset-0 flex items-center justify-center opacity-80 z-0">
            <svg viewBox="0 0 40 40" className="w-6 h-6 md:w-8 md:h-8">
              <path d="M20,10 C22,5 28,6 29,10 C25,12 22,12 20,10 Z" fill="#15803d" />
              <path d="M20,12 C10,12 6,22 10,30 C14,38 20,38 20,38 C20,38 26,38 30,30 C34,22 30,12 20,12 Z" fill="#ea580c" />
              <path d="M19,13 C12,14 8,23 11,29 C14,35 19,36 19,36 C19,36 17,28 17,21 C17,16 19,13 19,13 Z" fill="#f97316" />
            </svg>
          </div>
          <div className="absolute top-1 inset-x-0 flex items-center justify-center z-10">
            <span className="font-black text-sm md:text-lg tracking-widest text-zinc-900 font-sans">
              GEORGIA
            </span>
          </div>
          <div className="absolute bottom-1 inset-x-0 flex items-center justify-center">
            <span className="text-[8px] md:text-[9px] font-bold tracking-widest text-zinc-700 uppercase">
              ...on my mind
            </span>
          </div>
        </>
      )}

      {/* 13. Utah (UT): Delicate Arch Silhouette */}
      {code === 'UT' && (
        <>
          <div className="absolute inset-0 flex items-center justify-center opacity-75 z-0">
            <svg viewBox="0 0 60 60" className="w-7 h-7 md:w-9 md:h-9 fill-orange-700">
              <path d="M10,55 C12,30 20,10 35,10 C50,10 52,25 50,55 L42,55 C44,35 40,22 35,22 C30,22 24,35 20,55 Z" />
            </svg>
          </div>
          <div className="absolute top-1 inset-x-0 flex items-center justify-center z-10">
            <span className="font-black text-sm md:text-lg tracking-widest text-blue-900 font-sans">
              UTAH
            </span>
          </div>
          <div className="absolute bottom-1 inset-x-0 flex items-center justify-center">
            <span className="text-[8px] md:text-[9px] font-bold tracking-widest text-orange-950 uppercase">
              Life Elevated
            </span>
          </div>
        </>
      )}

      {/* 14. Wyoming (WY): Bucking Horse & Rider */}
      {code === 'WY' && (
        <>
          <div className="absolute inset-0 flex items-center justify-center opacity-70 z-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 fill-amber-900">
              <path d="M12 2c1 0 2 1 2 2v2l2-1 3 2-2 3 2 4-3 1-1 4-2-1-1 3h-2l1-4-2-1v-4l-2-2 1-3 3 1v-3c0-1 0-2 0-2z" />
            </svg>
          </div>
          <div className="absolute top-1 inset-x-0 flex items-center justify-center z-10">
            <span className="font-black text-sm md:text-lg tracking-widest text-amber-950 font-sans">
              WYOMING
            </span>
          </div>
          <div className="absolute bottom-1 inset-x-0 flex items-center justify-center">
            <span className="text-[8px] md:text-[9px] font-bold tracking-widest text-amber-900 uppercase">
              Cowboy State
            </span>
          </div>
        </>
      )}

      {/* 15. North Carolina (NC): First in Flight + Wright Flyer */}
      {code === 'NC' && (
        <>
          <div className="absolute top-1 inset-x-0 flex items-center justify-center gap-1 z-10">
            <span className="text-[8px] md:text-[9px] font-bold tracking-wider text-blue-900 uppercase">
              FIRST IN FLIGHT
            </span>
            <svg viewBox="0 0 24 24" className="w-4 h-3 md:w-5 md:h-3.5 fill-blue-900">
              <path d="M2 10h20v2H2zM6 8h12v1H6zM11 5h2v8h-2z" />
            </svg>
          </div>
          <div className="absolute bottom-1 inset-x-0 flex items-center justify-center">
            <span className="font-black text-xs md:text-sm tracking-widest text-red-700 uppercase">
              NORTH CAROLINA
            </span>
          </div>
        </>
      )}

      {/* 16. South Carolina (SC): Palmetto Tree & Crescent Moon */}
      {code === 'SC' && (
        <>
          <div className="absolute inset-0 flex items-center justify-center opacity-70 z-0">
            <svg viewBox="0 0 40 40" className="w-6 h-6 md:w-8 md:h-8 fill-blue-950">
              <path d="M10,8 C12,6 14,8 14,12 C14,16 10,18 8,16 C10,14 10,10 10,8 Z" />
              <path d="M18,36 L22,36 L21,22 C24,20 28,18 28,14 C25,14 22,17 20,20 C18,17 15,14 12,14 C12,18 16,20 19,22 Z" />
            </svg>
          </div>
          <div className="absolute top-1 inset-x-0 flex items-center justify-center z-10">
            <span className="font-black text-sm md:text-lg tracking-widest text-blue-950 font-sans">
              SOUTH CAROLINA
            </span>
          </div>
          <div className="absolute bottom-1 inset-x-0 flex items-center justify-center">
            <span className="text-[8px] md:text-[9px] font-bold tracking-widest text-slate-700 uppercase">
              While I Breathe, I Hope
            </span>
          </div>
        </>
      )}

      {/* Fallback for all other US states: Standard DMV layout with state title & slogan */}
      {!['CA', 'TX', 'NY', 'FL', 'WA', 'CO', 'HI', 'AZ', 'PA', 'NM', 'OR', 'GA', 'UT', 'WY', 'NC', 'SC'].includes(code) && (
        <>
          <div className="absolute top-1 left-2 w-5 h-4 md:w-6 md:h-5 rounded-[2px] bg-blue-700 text-white font-mono font-bold text-[8px] md:text-[9px] flex items-center justify-center shadow-inner border border-blue-900 leading-none z-10">
            OCT
          </div>
          <div className="absolute top-1 inset-x-0 flex items-center justify-center z-10">
            <span className={`font-black text-sm md:text-lg tracking-widest ${textColorClass} font-sans uppercase`}>
              {plate.topLineText || plate.districtName || 'UNITED STATES'}
            </span>
          </div>
          <div className="absolute top-1 right-2 w-5 h-4 md:w-6 md:h-5 rounded-[2px] bg-amber-400 text-black font-mono font-bold text-[8px] md:text-[9px] flex items-center justify-center shadow-inner border border-amber-600 leading-none z-10">
            26
          </div>
          {plate.bottomLineText && (
            <div className="absolute bottom-1 inset-x-0 flex items-center justify-center">
              <span className={`text-[8px] md:text-[9px] font-bold tracking-widest ${textColorClass} opacity-80 uppercase truncate max-w-[85%]`}>
                {plate.bottomLineText}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

interface AUStateDecorationProps {
  plate: PlateParseResult;
  textColorClass?: string;
}

/**
 * Authentic Australian State Visual Decorations:
 * Features iconic state emblems, color schemes, and official slogans.
 */
export const AUStateDecoration: React.FC<AUStateDecorationProps> = ({ plate }) => {
  const code = (plate.districtCode || 'NSW').toUpperCase();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Victoria (VIC): Southern Cross / State Crown Emblem */}
      {code === 'VIC' && (
        <div className="absolute top-1 inset-x-0 flex items-center justify-center opacity-85 z-0">
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-blue-900">
              <path d="M12,2 L14,7 L19,4 L16,9 L22,10 L16,13 L20,18 L14,16 L13,22 L11,16 L5,18 L9,13 L3,10 L9,9 L6,4 L11,7 Z" />
            </svg>
            <span className="text-[10px] md:text-xs font-black tracking-widest text-blue-900 font-sans">
              VIC
            </span>
          </div>
        </div>
      )}

      {/* Queensland (QLD): State Crown Emblem */}
      {code === 'QLD' && (
        <div className="absolute top-1 inset-x-0 flex items-center justify-center opacity-85 z-0">
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-red-900">
              <path d="M5,16 L19,16 L21,9 L16,12 L12,6 L8,12 L3,9 Z" />
            </svg>
            <span className="text-[10px] md:text-xs font-black tracking-widest text-red-900 font-sans">
              QUEENSLAND
            </span>
          </div>
        </div>
      )}

      {/* Western Australia (WA): State Swan Emblem */}
      {code === 'WA' && (
        <div className="absolute top-1 inset-x-0 flex items-center justify-center opacity-85 z-0">
          <span className="text-[10px] md:text-xs font-bold italic tracking-wide text-blue-900 font-serif">
            Western Australia
          </span>
        </div>
      )}

      {/* Tasmania (TAS): Tasmanian Devil Silhouette */}
      {code === 'TAS' && (
        <div className="absolute top-1 inset-x-0 flex items-center justify-center opacity-80 z-0">
          <div className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-emerald-800">
              <circle cx="12" cy="12" r="9" />
            </svg>
            <span className="text-[10px] md:text-xs font-black tracking-widest text-emerald-900 font-sans">
              TASMANIA
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

interface JPIllustratedDecorationProps {
  plate: PlateParseResult;
}

/**
 * Authentic Japanese Regional Illustrated Background:
 * Renders Mount Fuji (富士山) heritage illustrated backdrop and prefecture sealing bolt.
 */
export const JPIllustratedDecoration: React.FC<JPIllustratedDecorationProps> = ({ plate }) => {
  const isMtFuji = plate.districtCode?.includes('富士山');

  if (!isMtFuji) return null;

  return (
    <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
      {/* Mount Fuji Silhouette with Red Rising Sun Glow */}
      <svg viewBox="0 0 300 150" className="w-full h-full" preserveAspectRatio="none">
        <circle cx="230" cy="50" r="35" fill="#f87171" opacity="0.4" />
        <polygon points="50,150 140,40 160,40 250,150" fill="#6366f1" />
        <polygon points="125,60 140,40 160,40 175,60 160,56 150,65 140,56" fill="#ffffff" />
      </svg>
    </div>
  );
};

interface THGraphicDecorationProps {
  plate: PlateParseResult;
}

/**
 * Authentic Thai DLT Graphic Lucky Plate Background:
 * Renders picturesque pictorial backgrounds for Bangkok, Chiang Mai, and Phuket.
 */
export const THGraphicDecoration: React.FC<THGraphicDecorationProps> = ({ plate }) => {
  const norm = plate.normalizedPlate || '';
  const isLuckyNumber = /(?:8888|9999|7777|1111|5555|2222|3333|4444|6666)/.test(norm) || plate.category === 'commercial';

  if (!isLuckyNumber) return null;

  const isBKK = norm.includes('Bangkok') || norm.includes('ก');
  const isCNX = norm.includes('Chiang Mai');
  const isHKT = norm.includes('Phuket');

  return (
    <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
      {isBKK ? (
        /* Bangkok Temple / Wat Phra Kaew Spires */
        <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
          <polygon points="50,100 65,30 80,100" fill="#d97706" />
          <polygon points="110,100 125,15 140,100" fill="#b45309" />
          <polygon points="180,100 195,35 210,100" fill="#d97706" />
        </svg>
      ) : isCNX ? (
        /* Chiang Mai Mountain Peaks & Pagoda */
        <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
          <polygon points="0,100 80,40 160,100" fill="#047857" />
          <polygon points="120,100 200,30 280,100" fill="#065f46" />
        </svg>
      ) : isHKT ? (
        /* Phuket Tropical Waves */
        <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,80 Q75,50 150,80 T300,80 L300,100 L0,100 Z" fill="#0284c7" />
        </svg>
      ) : (
        <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
          <circle cx="150" cy="50" r="40" fill="#eab308" opacity="0.3" />
        </svg>
      )}
    </div>
  );
};

interface VNSealDecorationProps {
  plate: PlateParseResult;
}

/**
 * Authentic Vietnamese National Star Seal:
 * Circular golden star emblem positioned between the province code and numbers.
 */
export const VNSealDecoration: React.FC<VNSealDecorationProps> = ({ plate }) => {
  if (plate.country !== 'VN') return null;

  return (
    <div
      className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-amber-500 bg-amber-400/20 flex items-center justify-center shrink-0 shadow-sm mx-0.5"
      title="Official Seal of the Socialist Republic of Vietnam (Quốc huy Việt Nam)"
    >
      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 md:w-3 md:h-3 fill-amber-500">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    </div>
  );
};
