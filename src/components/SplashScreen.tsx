import React, { useEffect } from 'react';
import { Scale, ShieldCheck, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  useEffect(() => {
    // Auto proceed after 2.5 seconds if user doesn't click
    const timer = setTimeout(() => {
      onEnter();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onEnter]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-950 text-white p-6 select-none overflow-hidden">
      {/* Subtle background ambient light */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-slate-800/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Ministry Crest */}
      <div className="text-center pt-8 space-y-1 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-medium shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Government of India • Ministry of Consumer Affairs</span>
        </div>
        <div className="text-xs font-mono text-slate-400 mt-1">
          Legal Metrology Enforcement Division
        </div>
      </div>

      {/* Center Icon & Branding */}
      <div className="text-center max-w-md space-y-5 relative z-10">
        <div className="relative inline-block">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 border border-slate-700/80 p-0.5 shadow-xl flex items-center justify-center text-white">
            <Scale className="w-7 h-7 text-blue-400 stroke-[2.2]" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500 ring-2 ring-slate-950" />
        </div>

        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-blue-950/60 border border-blue-800/50 text-blue-400 text-xs font-mono font-semibold">
            <span>LMPC Rules, 2011 Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Metri<span className="text-blue-500">Scan</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            Automated preliminary compliance screening &amp; inspection dossier management for packaged commodities.
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-44 h-1 bg-slate-800 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Footer Enter / Skip Button */}
      <div className="pb-8 text-center space-y-3 relative z-10">
        <button
          id="btn-splash-enter-portal"
          onClick={onEnter}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs cursor-pointer"
        >
          <span>Access Enforcement Portal</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5 font-mono">
          <span>Official Preliminary Screening Tool</span>
          <span>•</span>
          <span>Version 2.4.0</span>
        </div>
      </div>
    </div>
  );
};
