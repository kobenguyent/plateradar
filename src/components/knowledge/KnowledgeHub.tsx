import React from 'react';
import { BookOpen, ShieldAlert, Zap, History, Calendar, CheckCircle2, FileText, AlertOctagon } from 'lucide-react';

export const KnowledgeHub: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 md:p-8 backdrop-blur shadow-xl">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-400" />
          European License Plate Knowledge & Regulations Hub
        </h2>
        <p className="text-slate-300 mt-2 text-sm md:text-base leading-relaxed">
          Comprehensive guide to vehicle registration laws, legal plate classifications, FE-Schrift anti-forgery typography, and federal inspection sticker specifications under the German <em>Fahrzeug-Zulassungsverordnung (FZV)</em>.
        </p>
      </div>

      {/* Grid of Knowledge Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: All German License Plate Types */}
        <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-3 text-blue-400">
            <FileText className="w-6 h-6" />
            <h3 className="font-bold text-lg text-white">Full License Plate Types Spectrum</h3>
          </div>
          <div className="space-y-3 text-xs md:text-sm text-slate-300">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold mb-0.5">Standard Euro Plate (Euro-Kennzeichen)</strong>
              Blue Euroband with 'D' and 12 EU stars on left. Max 8 total characters, FE-Schrift font, dual round stickers.
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold mb-0.5">Electric Vehicles ('E-Kennzeichen')</strong>
              Ends with 'E'. Granted under the Electric Mobility Act (EmoG) for BEV, FCEV, and PHEV. Grants municipal bus lane and reserved charging parking perks.
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold mb-0.5">Historic Oldtimer ('H-Kennzeichen')</strong>
              Ends with 'H'. Vehicles at least 30 years old preserved in original condition (§ 23 StVZO). 100% exempt from Low Emission Zone (Umweltzone) bans!
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold mb-0.5">Seasonal Plate (Saisonkennzeichen)</strong>
              Stacked digits on right (e.g. 04 over 10). Operating window from 2 to 11 months. Vehicle tax & insurance apply only during active window.
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold mb-0.5">Short-Term Transfer (Kurzzeitkennzeichen)</strong>
              Yellow date band on the right. Numbers start with 03 or 04. Valid for 5 days for test drives and transfers.
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold mb-0.5">Customs Export (Ausfuhrkennzeichen)</strong>
              Red date band on right. Used to export vehicles abroad permanently with temporary liability insurance.
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold mb-0.5">Dealer & Collector Red Plates (Rote Kennzeichen)</strong>
              Red font and border. '06' for car dealerships and workshops; '07' for vintage classic collectors.
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold mb-0.5">Tax-Exempt Green Plates (Grüne Kennzeichen)</strong>
              Green font and border. For agricultural/forestry machinery, charitable rescue services, and sports/glider trailers (§ 3 KraftStG).
            </div>
          </div>
        </div>

        {/* Section 2: Anti-Forgery FE-Schrift & Anatomy */}
        <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <History className="w-6 h-6" />
            <h3 className="font-bold text-lg text-white">Why FE-Schrift was Engineered</h3>
          </div>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Prior to 1995, Germany used standard DIN 1451 font. Criminals could easily modify letters with a small piece of black tape or white paint (e.g., turning a <span className="font-mono font-bold text-white">P</span> into an <span className="font-mono font-bold text-white">R</span>, an <span className="font-mono font-bold text-white">F</span> into an <span className="font-mono font-bold text-white">E</span>, or an <span className="font-mono font-bold text-white">O</span> into a <span className="font-mono font-bold text-white">Q</span>).
          </p>
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700 space-y-2">
            <strong className="text-emerald-300 text-sm block">Fälschungserschwerende Schrift (FE-Schrift):</strong>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Engineered by Karlgeorg Hoefer and the Federal Highway Research Institute (BASt).</li>
              <li>Every glyph has a unique asymmetrical silhouette and distinct cutouts.</li>
              <li>An <strong>O</strong> cannot be morphed into a <strong>Q</strong> without looking deformed.</li>
              <li>A <strong>P</strong> cannot be morphed into an <strong>R</strong> because the leg curve sits in an unmatched spot.</li>
              <li>Optimized for automated license plate recognition (ALPR / ANPR) optical cameras.</li>
            </ul>
          </div>

          <div className="pt-2">
            <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5 text-amber-300">
              <Calendar className="w-4 h-4" />
              TÜV / HU Inspection Plakette Cycle
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              The rear plate features the circular Hauptuntersuchungsplakette (HU). Its color rotates through a 6-year cycle:
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono font-bold">
              <div className="p-2 rounded bg-emerald-600 text-white">2024: Green</div>
              <div className="p-2 rounded bg-amber-600 text-white">2025: Orange</div>
              <div className="p-2 rounded bg-blue-600 text-white">2026: Blue</div>
              <div className="p-2 rounded bg-yellow-400 text-black">2027: Yellow</div>
              <div className="p-2 rounded bg-amber-900 text-white">2028: Brown</div>
              <div className="p-2 rounded bg-pink-600 text-white">2029: Pink</div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              The sticker is rotated so the month due sits at 12 o'clock, with a black arc segment spanning months 11, 12, 1 for long-distance police visibility.
            </p>
          </div>
        </div>

        {/* Section 3: Official & Diplomatic Formats */}
        <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-3 text-purple-400">
            <ShieldAlert className="w-6 h-6" />
            <h3 className="font-bold text-lg text-white">Official & Diplomatic Formats</h3>
          </div>
          <div className="space-y-2.5 text-xs md:text-sm text-slate-300">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold">Bundespräsident & Chancellor (0-1, 0-2)</strong>
              Special constitutional authority plates directly authorized under FZV Annex 2.
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold">Diplomatic Corps (0 [CountryCode]-[Serial])</strong>
              Reserved for accredited ambassadors and diplomats under the Vienna Convention on Diplomatic Relations.
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold">Bundeswehr (Y-XXXXXX)</strong>
              German Armed Forces service vehicles. German tricolor flag replaces the blue Euroband.
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold">Bundespolizei (BP XX-XXX)</strong>
              Federal Police operational vehicles with nationwide jurisdiction.
            </div>
          </div>
        </div>

        {/* Section 4: Prohibited Combinations Law */}
        <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-3 text-red-400">
            <AlertOctagon className="w-6 h-6" />
            <h3 className="font-bold text-lg text-white">Prohibited Combinations (§ 8 Abs. 1 FZV)</h3>
          </div>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Under German vehicle registration law, license plate combinations that violate public morals, constitutional order, or human dignity are strictly forbidden:
          </p>
          <div className="p-4 bg-red-950/30 border border-red-500/40 rounded-xl space-y-2 text-xs text-red-200">
            <strong className="block text-red-300 text-sm">Nationwide Banned Letter Combinations:</strong>
            <p>
              <span className="font-mono font-bold text-white">HJ</span> (Hitlerjugend), <span className="font-mono font-bold text-white">KZ</span> (Konzentrationslager), <span className="font-mono font-bold text-white">NS</span> (Nationalsozialismus), <span className="font-mono font-bold text-white">SA</span> (Sturmabteilung), <span className="font-mono font-bold text-white">SS</span> (Schutzstaffel).
            </p>
            <strong className="block text-red-300 text-sm pt-2">State-Specific Bans:</strong>
            <p>
              Combinations such as <span className="font-mono font-bold text-white">SD</span> (Sicherheitsdienst), and numeric neo-Nazi codes like <span className="font-mono font-bold text-white">18</span> (Adolf Hitler), <span className="font-mono font-bold text-white">88</span> (Heil Hitler), <span className="font-mono font-bold text-white">28</span> (Blood & Honour) combined with certain prefixes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
