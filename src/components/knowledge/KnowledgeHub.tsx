import React from 'react';
import { BookOpen, ShieldAlert, Zap, History, Calendar, CheckCircle2, FileText, AlertOctagon, Globe, Sparkles } from 'lucide-react';
import { CountryCode } from '../../types';
import { SUPPORTED_COUNTRIES } from '../../core/country-registry';

interface KnowledgeHubProps {
  country?: CountryCode;
  onCountryChange?: (country: CountryCode) => void;
}

export const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ country = 'DE', onCountryChange }) => {
  const activeCountry = SUPPORTED_COUNTRIES.find((c) => c.id === country) || SUPPORTED_COUNTRIES[0];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header & Country Selector */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 md:p-8 backdrop-blur shadow-xl">
        {/* Country Selector Pills */}
        {onCountryChange && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-700/60 scrollbar-thin">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Knowledge Country:
            </span>
            {SUPPORTED_COUNTRIES.map((c) => (
              <button
                key={c.id}
                onClick={() => onCountryChange(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                  country === c.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-400" />
              License Plate Knowledge & Regulations Hub
            </h2>
            <p className="text-slate-300 mt-2 text-sm md:text-base leading-relaxed">
              Comprehensive regulatory guide to vehicle registration laws, legal plate classifications, typography standards, anti-forgery measures, and international conventions.
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-center justify-center p-3.5 bg-slate-900/80 border border-slate-700 rounded-2xl shrink-0">
            <span className="text-3xl">{activeCountry.flag}</span>
            <span className="text-xs font-bold text-white mt-1 uppercase font-mono">{activeCountry.id}</span>
          </div>
        </div>
      </div>

      {/* Country Spotlight Section */}
      <div className="bg-gradient-to-br from-blue-950/40 via-slate-800/90 to-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 text-blue-400">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="font-extrabold text-lg text-white">
            {activeCountry.flag} {activeCountry.name} ({activeCountry.nativeName}) — National Regulatory Spotlight
          </h3>
        </div>

        {country === 'DE' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm text-slate-300">
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">FZV Legal Framework</strong>
              Under the German <em>Fahrzeug-Zulassungsverordnung (FZV)</em>, license plates are limited to 8 characters max. Plates are issued with FE-Schrift typography to prevent character tampering.
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">Eco &amp; Historic Suffixes</strong>
              'E' denotes Electric/PHEV vehicles (granting bus lane and charging station rights); 'H' denotes certified 30+ year oldtimers exempt from low-emission zones (Umweltzone).
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">Inspection &amp; State Badges</strong>
              The rear plate features the 6-year rotating Hauptuntersuchung (HU/TÜV) sticker with month due at 12 o'clock, alongside the official state seal (Zulassungsplakette).
            </div>
          </div>
        )}

        {country === 'US' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm text-slate-300">
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">50 States + D.C. Autonomy</strong>
              Vehicle registrations in the United States are governed by individual state DMVs. Each state features distinct graphic plate designs, state nicknames, and slogans.
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">GSA Federal Civilian Fleet</strong>
              Federal government civilian vehicles bear "G"-prefix plates (e.g., G12-3456) managed under the General Services Administration (GSA Fleet) without state taxes.
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">U.S. Dept of State (OFM)</strong>
              Foreign diplomatic vehicles carry federal blue reflective plates issued by the Office of Foreign Missions with "D" (Diplomat), "C" (Consul), or "S" (Staff).
            </div>
          </div>
        )}

        {country === 'JP' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm text-slate-300">
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">Transport Branch Offices &amp; Class</strong>
              Top line shows the issuing branch office in Kanji (品川, 横浜, 大阪...) and 3-digit class code: 3xx for passenger cars &gt;2000cc, 5xx for compact cars, 2xx for commercial.
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">Fuin (封印) Prefecture Seal</strong>
              Rear plates have a tamper-evident stamped aluminum cup (封印) bolted over the top-left screw, embossed with the prefecture's initial Kanji character (e.g. 東 for Tokyo).
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">Kei Car (軽自動車) Standard</strong>
              Vehicles under 660cc engine capacity carry distinctive yellow plates with black characters. Commercial transport vehicles carry green plates with white characters.
            </div>
          </div>
        )}

        {country === 'TH' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm text-slate-300">
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">Department of Land Transport (DLT)</strong>
              Managed under the Motor Vehicle Act B.E. 2522. Thai consonant series followed by 1 to 4 digits, with full province name stamped in Thai script on the bottom row.
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">Color-Coded Classification</strong>
              White/black for passenger sedans; white/green for private utility pickups; yellow/black for public metered taxis and buses; red/black (ป้ายแดง) for temporary dealer transit.
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">Lucky Number Auctions</strong>
              Auspicious combinations (single digits, quadruple 8s, 9s, and twin-letter combinations like 8กก) are auctioned off as illustrated graphic plates for public road safety funds.
            </div>
          </div>
        )}

        {country === 'VN' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm text-slate-300">
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">Circular 24/2023 Identity Reform</strong>
              The Ministry of Public Security enacted "Biển số định danh", binding license plates permanently to the citizen's personal identification number rather than the chassis.
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">Province Prefix System</strong>
              2-digit code identifies registration province (29-33/40 for Hà Nội, 50-59 for TP. Hồ Chí Minh, 43 for Đà Nẵng, 15 for Hải Phòng, 80 for central government).
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">Color Authority Hierarchy</strong>
              White for civilian cars; blue for state ministries &amp; police; yellow for commercial transport &amp; Grab ride-hailing; crimson red for the People's Army (Quân đội).
            </div>
          </div>
        )}

        {country === 'AU' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm text-slate-300">
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">State Transport Jurisdiction</strong>
              Vehicle licensing (Rego) is regulated by state authorities (Transport for NSW, VicRoads, Translink QLD, DoT WA) rather than the federal government.
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">State Slogans &amp; Colorways</strong>
              NSW features yellow plates; Victoria features blue text with "THE EDUCATION STATE"; Queensland uses maroon with "SUNSHINE STATE"; WA features "THE WILDFLOWER STATE".
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">CTP Insurance Integration</strong>
              Annual registration renewal is integrated with mandatory Compulsory Third Party (CTP) injury cover, verified electronically via automated number plate recognition (ANPR).
            </div>
          </div>
        )}

        {country === 'NZ' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm text-slate-300">
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">Waka Kotahi (NZTA) Standard</strong>
              Since 2001, standard plates follow a 3-letter + 3-number layout (ABC 123) with black embossed characters on reflective white aluminum.
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">Legacy Pre-2001 Series</strong>
              Between 1964 and 2001, New Zealand used a 2-letter + 4-number series (AA 1000 to ZZ 9999), which remain fully legal and transferrable today.
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">KiwiPlates Legal Ownership</strong>
              Personalised plate combinations are legally treated as private property assets that can be owned, bought, traded, or inherited without vehicle attachment.
            </div>
          </div>
        )}

        {country === 'AT' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm text-slate-300">
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">Federal State Coats of Arms</strong>
              Austrian plates feature the colorful official coat of arms (Landeswappen) of the vehicle’s federal state centered between the district code and serial number.
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">Green EV Font (IG-L Exemption)</strong>
              Electric vehicles receive green lettering, granting legal exemption from Immissionsschutzgesetz-Luft (IG-L) environmental 100 km/h speed limits on motorways.
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">Authorities &amp; Armed Forces</strong>
              "BP" denotes Bundespolizei (Federal Police); "BH" denotes Bundesheer (Federal Armed Forces); "W" identifies Vienna (Wien) federal capital vehicles.
            </div>
          </div>
        )}

        {country === 'CH' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm text-slate-300">
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">Cantonal Sovereignty &amp; Crests</strong>
              All 26 cantons issue independent plates featuring the Swiss Confederation cross shield on the left and the canton's official crest on the right.
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">Wechselschild Interchangeability</strong>
              Swiss vehicle registration allows a single pair of plates to be shared interchangeably between two vehicles owned by the same driver.
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5">
              <strong className="text-white block font-semibold">Owner-Attached Registration</strong>
              Swiss plates belong to the individual registered driver, not the automobile. When selling a vehicle, the owner retains their license plate number.
            </div>
          </div>
        )}
      </div>

      {/* Grid of Knowledge Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: All German License Plate Types */}
        <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-3 text-blue-400">
            <FileText className="w-6 h-6" />
            <h3 className="font-bold text-lg text-white">Full German License Plate Types Spectrum</h3>
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
              Stacked digits on right (e.g. 04 over 10). Operating window from 2 to 11 months. Vehicle tax &amp; insurance apply only during active window.
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
              <strong className="text-white block font-semibold mb-0.5">Dealer &amp; Collector Red Plates (Rote Kennzeichen)</strong>
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
            <h3 className="font-bold text-lg text-white">Official &amp; Diplomatic Formats</h3>
          </div>
          <div className="space-y-2.5 text-xs md:text-sm text-slate-300">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold">Bundespräsident &amp; Chancellor (0-1, 0-2)</strong>
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
              Combinations such as <span className="font-mono font-bold text-white">SD</span> (Sicherheitsdienst), and numeric neo-Nazi codes like <span className="font-mono font-bold text-white">18</span> (Adolf Hitler), <span className="font-mono font-bold text-white">88</span> (Heil Hitler), <span className="font-mono font-bold text-white">28</span> (Blood &amp; Honour) combined with certain prefixes.
            </p>
          </div>
        </div>

        {/* Section 5: International Registration Systems */}
        <div className="md:col-span-2 bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-3 text-cyan-400">
            <Globe className="w-6 h-6" />
            <h3 className="font-bold text-lg text-white">International License Plate Systems Overview</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold mb-1">🇯🇵 Japan (日本)</strong>
              Two-line configuration: top row shows the transport branch office in Kanji (品川, 横浜...) and class code (3xx/5xx). Bottom row has Hiragana and numbers. Kei mini-cars (≤660cc) carry yellow plates with black text. Rear plates are sealed with an official tamper-evident aluminum bolt (封印 Fuin).
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold mb-1">🇹🇭 Thailand (ประเทศไทย)</strong>
              Managed by Department of Land Transport (DLT). Font color signifies vehicle type: black for standard passenger cars, green for private pickups, blue for passenger vans (&gt;7 seats), and yellow for public transit/taxis. Red plates with black text (ป้ายแดง) are temporary registration tags.
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold mb-1">🇻🇳 Vietnam (Việt Nam)</strong>
              Regulated under MPS Circular 24/2023. White plates with black characters denote civilian cars. Blue plates with white characters (e.g. 80A) identify central government and state administration. Yellow plates represent commercial transport businesses, and crimson red plates (QA) belong to the People’s Army.
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold mb-1">🇦🇺 Australia</strong>
              Decentralized state jurisdiction: NSW features yellow plates with "NEW SOUTH WALES", Victoria uses blue lettering with "THE EDUCATION STATE", and Queensland features maroon text with "SUNSHINE STATE". Integrated with Compulsory Third Party (CTP) insurance.
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold mb-1">🇳🇿 New Zealand (Aotearoa)</strong>
              Standard 3-letter + 3-digit series (ABC 123) issued by Waka Kotahi NZTA. Legacy pre-2001 plates feature 2 letters + 4 digits (AA 1234). Custom KiwiPlates grant full legal asset ownership that can be bought, sold, or transferred across vehicles.
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold mb-1">🇦🇹 Austria &amp; 🇨🇭 Switzerland</strong>
              Austria uses white reflective plates with federal state coats of arms in the middle and green lettering for EVs. Switzerland features compact aluminum plates with the Swiss national shield on the left and the cantonal crest on the right, linked to the registered owner (Wechselschild).
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <strong className="text-white block font-semibold mb-1">🇺🇸 United States</strong>
              Standard 12 in × 6 in (2:1 aspect ratio) plates issued independently by 50 state DMVs + D.C. Features state nicknames, official slogans (The Golden State, Lone Star, Empire State), and corner expiration tags. The U.S. Dept of State (OFM) issues diplomatic plates (D/C/S), and the GSA oversees federal civilian G-fleet vehicles.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
