import React, { useRef } from 'react';
import { PlateParseResult } from '../../types';
import { getTuevColor, getMonthRotationDeg } from '../../data/tuev-colors';
import {
  USStateDecoration,
  AUStateDecoration,
  JPIllustratedDecoration,
  THGraphicDecoration,
  VNSealDecoration,
} from './PlateDecorations';

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
  } else if (plate.textColor === 'white') {
    textColorClass = 'text-white';
    borderColorClass = 'border-zinc-800';
    innerBorderColorClass = 'border-white';
  } else if (plate.textColor === 'yellow') {
    textColorClass = 'text-yellow-400';
  }

  // Determine background gradient
  let bgClass = 'bg-gradient-to-b from-[#f9fafb] via-[#ffffff] to-[#e5e7eb]';
  if (plate.backgroundColor === 'yellow') {
    bgClass = 'bg-gradient-to-b from-[#fef08a] via-[#facc15] to-[#eab308]';
    borderColorClass = 'border-zinc-950';
    innerBorderColorClass = 'border-zinc-900';
  } else if (plate.backgroundColor === 'green') {
    bgClass = 'bg-gradient-to-b from-[#1b5e20] via-[#2e7d32] to-[#144a18]';
    borderColorClass = 'border-[#0a290c]';
    innerBorderColorClass = 'border-[#4caf50]';
  } else if (plate.backgroundColor === 'blue') {
    bgClass = 'bg-gradient-to-b from-[#1565c0] via-[#0d47a1] to-[#0a3375]';
    borderColorClass = 'border-[#061b3d]';
    innerBorderColorClass = 'border-[#42a5f5]';
  } else if (plate.backgroundColor === 'red') {
    bgClass = 'bg-gradient-to-b from-[#c62828] via-[#b71c1c] to-[#7f0000]';
    borderColorClass = 'border-[#4a0000]';
    innerBorderColorClass = 'border-[#ef5350]';
  } else if (plate.backgroundColor === 'black') {
    bgClass = 'bg-gradient-to-b from-zinc-800 via-zinc-900 to-black';
    borderColorClass = 'border-zinc-700';
    innerBorderColorClass = 'border-zinc-700';
  }

  const isJapan = plate.country === 'JP';
  const isUSA = plate.country === 'US';
  const isCompactAspect = isJapan || isUSA;
  const hasBottomLine = Boolean(plate.bottomLineText);

  // Aspect ratio & sizing (USA and Japan use 12x6 / 2:1 format)
  const aspectRatio = isCompactAspect ? '305 / 152' : hasBottomLine ? '520 / 125' : '520 / 110';

  const sizeStyles = isCompactAspect
    ? {
        sm: 'h-20 min-w-[190px]',
        md: 'h-28 min-w-[260px]',
        lg: 'h-36 min-w-[320px] md:min-w-[360px] max-w-[420px]',
        xl: 'h-44 min-w-[360px] md:min-w-[420px] max-w-[480px]',
      }[size]
    : {
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

  // Badge source for DE / AT / CH
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
        className={`relative flex items-center ${bgClass} 
          rounded-xl border-[4px] md:border-[5px] ${borderColorClass} 
          license-plate-shadow transition-all duration-200 overflow-hidden ${sizeStyles}`}
        style={{ aspectRatio }}
      >
        {/* Embossed inner rim */}
        <div className={`absolute inset-[2px] rounded-[7px] border-[1px] md:border-[1.5px] ${innerBorderColorClass} pointer-events-none opacity-40`} />

        {/* Optional Realistic Screw Hole Caps for Standard Plates */}
        {showScrews && !isCompactAspect && (
          <>
            <div className="absolute left-14 md:left-16 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 border border-slate-600 shadow-inner opacity-80 pointer-events-none" />
            <div className="absolute right-14 md:right-16 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 border border-slate-600 shadow-inner opacity-80 pointer-events-none" />
          </>
        )}

        {/* Four-corner mounting screw caps for US plates */}
        {showScrews && isUSA && (
          <>
            <div className="absolute left-5 top-2.5 w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 border border-slate-600 shadow-inner opacity-70 pointer-events-none" />
            <div className="absolute right-5 top-2.5 w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 border border-slate-600 shadow-inner opacity-70 pointer-events-none" />
            <div className="absolute left-5 bottom-2.5 w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 border border-slate-600 shadow-inner opacity-70 pointer-events-none" />
            <div className="absolute right-5 bottom-2.5 w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 border border-slate-600 shadow-inner opacity-70 pointer-events-none" />
          </>
        )}

        {/* --- LEFT SECTION: Euro Strip / National Flags / Swiss Shield --- */}
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
              <div className="relative w-4 h-4 md:w-5 md:h-5">
                <div className="absolute inset-x-1 top-0 bottom-0 bg-white" />
                <div className="absolute inset-y-1 left-0 right-0 bg-white" />
              </div>
            </div>
          </div>
        )}

        {/* Thailand DLT / National Flag Badge */}
        {plate.country === 'TH' && (
          <div className="h-full px-2 md:px-3 flex items-center justify-center shrink-0 border-r border-slate-300/60">
            <div className="w-6 h-4 md:w-7 md:h-5 rounded-[2px] overflow-hidden flex flex-col shadow-sm border border-slate-300">
              <div className="h-[16.6%] bg-[#A51931]" />
              <div className="h-[16.6%] bg-[#F4F5F8]" />
              <div className="h-[33.4%] bg-[#2D2A4A]" />
              <div className="h-[16.6%] bg-[#F4F5F8]" />
              <div className="h-[16.6%] bg-[#A51931]" />
            </div>
          </div>
        )}

        {/* Vietnam National Flag Badge */}
        {plate.country === 'VN' && (
          <div className="h-full px-2 md:px-3 flex items-center justify-center shrink-0 border-r border-slate-300/60">
            <div className="w-6 h-4 md:w-7 md:h-5 rounded-[2px] overflow-hidden bg-[#DA251D] flex items-center justify-center shadow-sm border border-red-700">
              <svg viewBox="0 0 100 100" className="w-3.5 h-3.5 md:w-4 md:h-4 fill-[#FFFF00]">
                <polygon points="50,15 61.8,45 94.1,45 68,64 77.8,94 50,75 22.2,94 32,64 5.9,45 38.2,45" />
              </svg>
            </div>
          </div>
        )}

        {/* Australia State Identifier Badge */}
        {plate.country === 'AU' && (
          <div className="h-full px-2 md:px-3 flex items-center justify-center shrink-0 border-r border-slate-400/40">
            <div className="flex flex-col items-center justify-center">
              <span className={`text-[9px] md:text-xs font-black tracking-tighter ${textColorClass}`}>
                {plate.districtCode || 'AU'}
              </span>
            </div>
          </div>
        )}

        {/* New Zealand Silver Fern Badge */}
        {plate.country === 'NZ' && (
          <div className="h-full px-2 md:px-3 flex items-center justify-center shrink-0 border-r border-slate-300/60">
            <div className="w-6 h-6 md:w-7 md:h-7 rounded bg-black flex items-center justify-center shadow-sm border border-zinc-800 p-0.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5 fill-white">
                <path d="M17 2c-3 1-5 4-6 7-1-1-3-1-5 0 2 2 3 4 3 7-2-1-4 0-6 2 2 1 4 1 6 0 0 3 1 5 3 6 1-2 2-4 2-6 2 1 4 1 5-1-2-1-3-3-3-5 2 0 4-1 5-3-2-1-3-3-4-4 2-1 3-2 3-3z"/>
              </svg>
            </div>
          </div>
        )}

        {/* --- JAPAN SPECIAL 2-LINE DISPLAY --- */}
        {/* --- JAPAN SPECIAL 2-LINE DISPLAY --- */}
        {isJapan ? (
          <div className="relative flex-1 flex flex-col justify-between items-center py-2 px-3 h-full overflow-hidden">
            <JPIllustratedDecoration plate={plate} />

            {/* Top Row: Left Sealing Bolt, Office Kanji + Class, Right Screw */}
            <div className="w-full flex items-center justify-between px-2 pt-1 z-10">
              {/* Sealing Bolt (Fuin 封印) */}
              {showScrews && (
                <div
                  className="relative w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-tr from-slate-400 via-slate-200 to-slate-400 border border-slate-500 shadow-md flex items-center justify-center shrink-0"
                  title="Official Japanese Vehicle Sealing Bolt (封印 Fuin)"
                >
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border border-slate-400/80 flex items-center justify-center bg-slate-300">
                    <span className="text-[6px] md:text-[8px] font-bold text-slate-700 leading-none">
                      {plate.districtCode ? plate.districtCode[0] : '東'}
                    </span>
                  </div>
                </div>
              )}

              {/* Top Line: e.g. 品川 300 */}
              <div className={`text-base md:text-xl font-bold tracking-widest ${textColorClass} font-sans`}>
                {plate.topLineText || `${plate.districtCode || '品川'} 300`}
              </div>

              {/* Right Screw Cap */}
              {showScrews && (
                <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 border border-slate-600 shadow-inner opacity-80 shrink-0" />
              )}
            </div>

            {/* Bottom Row: Hiragana + Number (e.g. さ 12-34) */}
            <div className="flex items-center justify-center gap-3 md:gap-4 my-auto z-10">
              {plate.category === 'diplomatic' ? (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-white flex items-center justify-center font-bold text-white text-base md:text-xl">
                    外
                  </div>
                  <span className={`font-bold tracking-widest ${textColorClass} ${fontClass} drop-shadow-sm text-3xl md:text-4xl`}>
                    {plate.numberPart || '1234'}
                  </span>
                </div>
              ) : (
                <>
                  <span className={`font-bold text-xl md:text-2xl ${textColorClass} font-sans`}>
                    {plate.middleLetters || 'さ'}
                  </span>
                  <span className={`font-bold tracking-wider ${textColorClass} ${fontClass} drop-shadow-sm text-3xl md:text-5xl`}>
                    {plate.numberPart || '12-34'}
                  </span>
                </>
              )}
            </div>
          </div>
        ) : isUSA ? (
          /* --- US SPECIAL 12x6 INCH PLATE DISPLAY WITH AUTHENTIC STATE DECORATIONS --- */
          <div className="relative flex-1 flex flex-col justify-between items-center py-2 px-3 h-full w-full overflow-hidden">
            <USStateDecoration plate={plate} textColorClass={textColorClass} />

            {/* Center Row: Main Alphanumeric Registration Serial */}
            <div className="flex items-center justify-center my-auto z-10">
              <span className={`font-bold tracking-wider ${textColorClass} ${fontClass} drop-shadow-sm text-3xl md:text-5xl`}>
                {plate.normalizedPlate}
              </span>
            </div>
          </div>
        ) : (
          /* --- MAIN CENTER PLATE BODY FOR STANDARD COUNTRIES --- */
          <div className="flex-1 flex flex-col justify-center items-center px-2 md:px-4 overflow-hidden">
            <div className="flex items-center justify-center gap-2 md:gap-3 w-full">
              {/* Germany Standard Display */}
              {plate.country === 'DE' && (
                <>
                  {/* District Code */}
                  <span className={`font-bold tracking-wider ${textColorClass} ${fontClass} drop-shadow-sm`}>
                    {plate.districtCode || (plate.normalizedPlate.split(' ')[0] || 'B')}
                  </span>

                  {/* Badges Column (TÜV & State Coat of Arms) */}
                  <div className="flex flex-col items-center justify-center gap-0.5 md:gap-1.5 shrink-0 z-10">
                    <div
                      className="relative w-5 h-5 md:w-7 md:h-7 rounded-full flex items-center justify-center shadow-sm border border-slate-400"
                      style={{
                        backgroundColor: tuevColor.colorHex,
                        color: tuevColor.textColor,
                        transform: `rotate(${tuevRotation}deg)`,
                      }}
                      title={`HU/TÜV Inspection Sticker: ${tuevMonth}/${tuevYear} (${tuevColor.colorName})`}
                    >
                      <div className="absolute inset-0 rounded-full border-t-[3px] md:border-t-[4px] border-black opacity-80" />
                      <span className="text-[7px] md:text-[9px] font-bold leading-none font-mono">
                        {String(tuevYear).slice(2)}
                      </span>
                    </div>

                    <div
                      className="w-5 h-5 md:w-7 md:h-7 rounded-full overflow-hidden flex items-center justify-center p-0.5 shadow-sm bg-white/70 border border-slate-300"
                      title={`State Badge: ${plate.state || 'Federal'}`}
                    >
                      <img
                        src={badgePath}
                        alt={plate.state || 'Badge'}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = './badges/de/bundesadler.svg';
                        }}
                      />
                    </div>
                  </div>

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
                </>
              )}

              {/* Austria Standard Display */}
              {plate.country === 'AT' && (
                <>
                  {/* District Code */}
                  <span className={`font-bold tracking-wider ${textColorClass} ${fontClass} drop-shadow-sm`}>
                    {plate.districtCode || (plate.normalizedPlate.split(' ')[0] || 'W')}
                  </span>

                  {/* Prominent Austrian Landeswappen in center */}
                  <div
                    className="w-6 h-7 md:w-8 md:h-10 flex items-center justify-center shrink-0 z-10 mx-1"
                    title={`Landeswappen: ${plate.state || 'Österreich'}`}
                  >
                    <img
                      src={badgePath}
                      alt={plate.state || 'Landeswappen'}
                      className="w-full h-full object-contain drop-shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = './badges/at/W.svg';
                      }}
                    />
                  </div>

                  {/* Numbers & Serial Letters */}
                  <div className="flex items-center gap-1 md:gap-2">
                    {plate.numberPart && (
                      <span className={`font-bold tracking-wider ${textColorClass} ${fontClass} drop-shadow-sm`}>
                        {plate.numberPart}
                      </span>
                    )}
                    {plate.middleLetters && (
                      <span className={`font-bold tracking-wider ${textColorClass} ${fontClass} drop-shadow-sm`}>
                        {plate.middleLetters}
                      </span>
                    )}
                  </div>
                </>
              )}

              {/* Switzerland Format */}
              {plate.country === 'CH' && (
                <div className="flex items-center gap-3">
                  <span className={`font-bold tracking-wider ${textColorClass} ${fontClass} drop-shadow-sm`}>
                    {plate.districtCode || 'ZH'}
                  </span>
                  <span className={`font-bold tracking-wider ${textColorClass} ${fontClass} drop-shadow-sm`}>
                    {plate.numberPart || plate.normalizedPlate.split(' ')[1] || '123456'}
                  </span>
                </div>
              )}

              {/* Thailand Format */}
              {plate.country === 'TH' && (
                <div className="relative flex items-center justify-center gap-2 w-full">
                  <THGraphicDecoration plate={plate} />
                  <span className={`font-bold tracking-wider ${textColorClass} font-sans z-10`}>
                    {plate.middleLetters || '1กข'}
                  </span>
                  <span className={`font-bold tracking-wider ${textColorClass} ${fontClass} drop-shadow-sm z-10`}>
                    {plate.numberPart || '1234'}
                  </span>
                </div>
              )}

              {/* Vietnam Format */}
              {plate.country === 'VN' && (
                <div className="flex items-center gap-1 md:gap-2">
                  <span className={`font-bold tracking-wider ${textColorClass} ${fontClass} drop-shadow-sm`}>
                    {plate.districtCode}{plate.middleLetters || ''}
                  </span>
                  <VNSealDecoration plate={plate} />
                  <span className={`font-bold tracking-wider ${textColorClass} ${fontClass} drop-shadow-sm`}>
                    {plate.numberPart || '123.45'}
                  </span>
                </div>
              )}

              {/* Australia Format */}
              {plate.country === 'AU' && (
                <div className="relative flex items-center justify-center w-full">
                  <AUStateDecoration plate={plate} textColorClass={textColorClass} />
                  <span className={`font-bold tracking-wider ${textColorClass} ${fontClass} drop-shadow-sm text-3xl md:text-5xl z-10`}>
                    {plate.normalizedPlate}
                  </span>
                </div>
              )}

              {/* New Zealand Format */}
              {plate.country === 'NZ' && (
                <span className={`font-bold tracking-widest ${textColorClass} ${fontClass} drop-shadow-sm text-3xl md:text-5xl`}>
                  {plate.normalizedPlate}
                </span>
              )}
            </div>

            {/* Bottom Line Text (Thailand Province / Australia Slogan / New Zealand) */}
            {plate.bottomLineText && (
              <span className={`text-[9px] md:text-[11px] font-bold tracking-widest uppercase opacity-85 ${textColorClass} mt-0.5 text-center truncate max-w-[90%]`}>
                {plate.bottomLineText}
              </span>
            )}
          </div>
        )}

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
