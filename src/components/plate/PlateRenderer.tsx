import React, { useRef } from 'react';
import { PlateParseResult } from '../../types';
import { getTuevColor, getMonthRotationDeg } from '../../data/tuev-colors';

interface PlateRendererProps {
  plate: PlateParseResult;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showScrews?: boolean;
  className?: string;
}

export const PlateRenderer: React.FC<PlateRendererProps> = ({
  plate,
  size = 'lg',
  showScrews = true,
  className = '',
}) => {
  const plateRef = useRef<HTMLDivElement>(null);

  // Determine text color classes
  let textColorClass = 'text-zinc-900';
  let borderColorClass = 'border-zinc-900';
  let innerBorderColorClass = 'border-zinc-900';

  if (plate.textColor === 'red') {
    textColorClass = 'text-red-700';
    borderColorClass = 'border-red-700';
    innerBorderColorClass = 'border-red-700';
  } else if (plate.textColor === 'green') {
    textColorClass = 'text-emerald-700';
    borderColorClass = 'border-emerald-700';
    innerBorderColorClass = 'border-emerald-700';
  } else if (plate.textColor === 'blue') {
    textColorClass = 'text-blue-700';
    borderColorClass = 'border-blue-700';
    innerBorderColorClass = 'border-blue-700';
  }

  // Size scaling factors
  const sizeStyles = {
    sm: 'text-2xl h-14 min-w-[280px]',
    md: 'text-3xl h-20 min-w-[380px]',
    lg: 'text-4xl md:text-5xl h-24 md:h-28 min-w-[340px] md:min-w-[480px] max-w-[620px]',
    xl: 'text-5xl md:text-6xl h-28 md:h-32 min-w-[360px] md:min-w-[560px] max-w-[700px]',
  }[size];

  // Font family
  const fontClass = plate.fontType === 'DIN' ? 'font-din' : 'font-fe-schrift';

  // TÜV sticker computation
  const tuevYear = plate.tuevYear || 2026;
  const tuevMonth = plate.tuevMonth || 10;
  const tuevColor = getTuevColor(tuevYear);
  const tuevRotation = getMonthRotationDeg(tuevMonth);

  // Badge source
  const stateBadgeCode = plate.badgeStateCode || 'bundesadler';
  const badgePath = plate.country === 'CH'
    ? `./badges/ch/${stateBadgeCode}.svg`
    : plate.country === 'AT'
    ? `./badges/at/${stateBadgeCode}.svg`
    : `./badges/de/${stateBadgeCode}.svg`;

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* License plate physical container */}
      <div
        ref={plateRef}
        className={`relative flex items-center bg-gradient-to-b from-[#f9fafb] via-[#ffffff] to-[#e5e7eb] 
          rounded-xl border-[4px] md:border-[5px] ${borderColorClass} 
          license-plate-shadow transition-all duration-200 overflow-hidden ${sizeStyles}`}
        style={{ aspectRatio: '520 / 110' }}
      >
        {/* Embossed inner rim */}
        <div className={`absolute inset-[2px] rounded-[7px] border-[1px] md:border-[1.5px] ${innerBorderColorClass} pointer-events-none opacity-40`} />

        {/* Optional Realistic Screw Hole Caps */}
        {showScrews && (
          <>
            <div className="absolute left-16 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 border border-slate-600 shadow-inner opacity-80 pointer-events-none" />
            <div className="absolute right-16 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 border border-slate-600 shadow-inner opacity-80 pointer-events-none" />
          </>
        )}

        {/* --- LEFT SECTION: Euro Strip / Flag / Swiss Shield --- */}
        {plate.hasEuroBand && (
          <div className="h-full bg-[#003399] px-2 md:px-3 flex flex-col items-center justify-between py-1.5 md:py-2 text-white shrink-0 z-10 border-r border-blue-900 shadow-sm">
            {/* 12 EU Stars in a Ring */}
            <div className="relative w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-[#FFCC00]">
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  const cx = 50 + 36 * Math.sin(angle);
                  const cy = 50 - 36 * Math.cos(angle);
                  return (
                    <polygon
                      key={i}
                      points={`${cx},${cy - 6} ${cx + 1.8},${cy - 1.8} ${cx + 6},${cy - 1.8} ${cx + 2.5},${cy + 1.2} ${cx + 4},${cy + 5.5} ${cx},${cy + 2.8} ${cx - 4},${cy + 5.5} ${cx - 2.5},${cy + 1.2} ${cx - 6},${cy - 1.8} ${cx - 1.8},${cy - 1.8}`}
                    />
                  );
                })}
              </svg>
            </div>
            {/* Country Identifier Letter */}
            <span className="font-bold text-sm md:text-xl tracking-tight leading-none text-white drop-shadow">
              {plate.country === 'AT' ? 'A' : 'D'}
            </span>
          </div>
        )}

        {/* Bundeswehr Flag Strip */}
        {plate.hasGermanFlag && (
          <div className="h-full w-8 md:w-11 flex flex-col shrink-0 z-10 border-r border-slate-300 shadow-sm">
            <div className="h-1/3 bg-black" />
            <div className="h-1/3 bg-[#DD0000]" />
            <div className="h-1/3 bg-[#FFCE00]" />
          </div>
        )}

        {/* Swiss Left Shield */}
        {plate.country === 'CH' && (
          <div className="h-full px-2.5 md:px-3.5 flex items-center justify-center shrink-0 border-r border-slate-300">
            <div className="w-6 h-7 md:w-7 md:h-9 bg-[#D52B1E] rounded-b-md flex items-center justify-center shadow-sm">
              {/* Swiss Cross */}
              <div className="relative w-4 h-4 md:w-5 md:h-5">
                <div className="absolute inset-x-1 top-0 bottom-0 bg-white" />
                <div className="absolute inset-y-1 left-0 right-0 bg-white" />
              </div>
            </div>
          </div>
        )}

        {/* --- MAIN CENTER PLATE BODY --- */}
        <div className="flex-1 flex items-center justify-center px-2 md:px-4 gap-2 md:gap-3 overflow-hidden">
          {/* District Code */}
          <span className={`font-bold tracking-wider ${textColorClass} ${fontClass} drop-shadow-sm`}>
            {plate.districtCode || (plate.normalizedPlate.split(' ')[0] || 'B')}
          </span>

          {/* Badges Column (TÜV & State Coat of Arms) - for Germany & Austria */}
          {plate.country !== 'CH' && (
            <div className="flex flex-col items-center justify-center gap-0.5 md:gap-1.5 shrink-0 z-10">
              {/* Top: TÜV / HU Inspection Plakette (Circular sticker with cyclical year color) */}
              <div
                className="relative w-5 h-5 md:w-7 md:h-7 rounded-full flex items-center justify-center shadow-sm border border-slate-400"
                style={{
                  backgroundColor: tuevColor.colorHex,
                  color: tuevColor.textColor,
                  transform: `rotate(${tuevRotation}deg)`,
                }}
                title={`HU/TÜV Inspection Sticker: ${tuevMonth}/${tuevYear} (${tuevColor.colorName})`}
              >
                {/* Black sector for months 11, 12, 1 */}
                <div className="absolute inset-0 rounded-full border-t-[3px] md:border-t-[4px] border-black opacity-80" />
                {/* Year in center */}
                <span className="text-[7px] md:text-[9px] font-bold leading-none font-mono">
                  {String(tuevYear).slice(2)}
                </span>
              </div>

              {/* Bottom: Official State Coat of Arms (Zulassungsplakette) */}
              <div
                className="w-5 h-5 md:w-7 md:h-7 rounded-full overflow-hidden flex items-center justify-center p-0.5 shadow-sm bg-white/70 border border-slate-300"
                title={`State Badge: ${plate.state || 'Federal'}`}
              >
                <img
                  src={badgePath}
                  alt={plate.state || 'Badge'}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to bundesadler if regional SVG missing
                    (e.target as HTMLImageElement).src = './badges/de/bundesadler.svg';
                  }}
                />
              </div>
            </div>
          )}

          {/* Middle Letters & Numbers */}
          <div className="flex items-center gap-1 md:gap-2">
            {plate.middleLetters && (
              <span className={`font-bold tracking-wider ${textColorClass} ${fontClass} drop-shadow-sm`}>
                {plate.middleLetters}
              </span>
            )}
            {plate.numberPart && (
              <span className={`font-bold tracking-wider ${textColorClass} ${fontClass} drop-shadow-sm`}>
                {plate.numberPart}
              </span>
            )}
          </div>

          {/* Suffix (E for Electric, H for Historic) */}
          {plate.suffix && (
            <span className={`font-bold tracking-wider ${textColorClass} ${fontClass} drop-shadow-sm ml-0.5`}>
              {plate.suffix}
            </span>
          )}
        </div>

        {/* --- RIGHT SECTION: Special Plate Bands --- */}

        {/* Swiss Canton Crest on Right */}
        {plate.country === 'CH' && (
          <div className="h-full px-2.5 md:px-3.5 flex items-center justify-center shrink-0 border-l border-slate-300">
            <div className="w-6 h-7 md:w-7 md:h-9 bg-white rounded-b-md flex items-center justify-center shadow-sm overflow-hidden p-0.5 border border-slate-200">
              <img
                src={badgePath}
                alt={plate.districtCode || 'Canton'}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Seasonal Plate Stacked Numerals (e.g. 04 / 10) */}
        {plate.hasSeasonBand && plate.seasonStart && plate.seasonEnd && (
          <div className="h-full px-1.5 md:px-2.5 border-l-2 border-zinc-900 flex flex-col justify-between py-1.5 md:py-2 text-zinc-900 font-mono font-bold leading-none shrink-0 bg-slate-50">
            <span className="text-xs md:text-base border-b border-zinc-900 pb-0.5">
              {String(plate.seasonStart).padStart(2, '0')}
            </span>
            <span className="text-xs md:text-base pt-0.5">
              {String(plate.seasonEnd).padStart(2, '0')}
            </span>
          </div>
        )}

        {/* Kurzzeitkennzeichen: Yellow Date Block (Day, Month, Year) */}
        {plate.hasYellowBand && (
          <div className="h-full bg-[#f1c40f] border-l-2 border-zinc-900 px-1.5 md:px-2.5 flex flex-col justify-between py-1 text-black font-mono font-bold text-[10px] md:text-xs text-center shrink-0 leading-tight shadow-inner">
            <span className="border-b border-black/40">{String(plate.expiryDay || 28).padStart(2, '0')}</span>
            <span className="border-b border-black/40">{String(plate.expiryMonth || 11).padStart(2, '0')}</span>
            <span>{String(plate.expiryYear || 26).slice(2)}</span>
          </div>
        )}

        {/* Ausfuhrkennzeichen: Red Date Block (Day, Month, Year) */}
        {plate.hasRedBand && (
          <div className="h-full bg-[#d32f2f] border-l-2 border-zinc-900 px-1.5 md:px-2.5 flex flex-col justify-between py-1 text-white font-mono font-bold text-[10px] md:text-xs text-center shrink-0 leading-tight shadow-inner">
            <span className="border-b border-white/40">{String(plate.expiryDay || 15).padStart(2, '0')}</span>
            <span className="border-b border-white/40">{String(plate.expiryMonth || 6).padStart(2, '0')}</span>
            <span>{String(plate.expiryYear || 27).slice(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
