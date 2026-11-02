import React from 'react';
import { ShieldCheck, Heart, Github, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950/80 py-12 text-slate-400 text-xs md:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-mono font-bold text-xs">
                PR
              </div>
              <span className="font-bold text-white text-base">PlateRadar</span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              PlateRadar is the modern, open European vehicle registration plate intelligence platform. Covering all German license plate classifications, electric & historic exemptions, diplomatic corps, and 400+ district codes with authentic FE-Schrift rendering.
            </p>
            <div className="text-[11px] text-slate-500">
              Designed for client-side speed &amp; offline reliability. Ready for GitHub Pages deployment.
            </div>
          </div>

          {/* Legal References */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Statutory Bases</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Fahrzeug-Zulassungsverordnung (FZV)</li>
              <li>• Straßenverkehrs-Zulassungs-Ordnung (§ 23 StVZO)</li>
              <li>• Elektromobilitätsgesetz (EmoG)</li>
              <li>• Kraftfahrzeugsteuergesetz (§ 3 KraftStG)</li>
              <li>• Vienna Convention on Diplomatic Relations (1961)</li>
            </ul>
          </div>

          {/* Expansion Roadmap */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Country Coverage</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="text-blue-400 font-medium">✓ Germany (400+ Districts, 16 Plate Types)</li>
              <li className="text-blue-400 font-medium">✓ Austria (Districts, State Seals, Electric)</li>
              <li className="text-blue-400 font-medium">✓ Switzerland (26 Cantons, Cantonal Badges)</li>
              <li className="text-slate-500">○ Netherlands, France, Italy (Modular Architecture)</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} PlateRadar. Developed with German automotive precision.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              Static SPA • GitHub Pages Deployable
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
