import React, { useState } from 'react';
import { Scale, Lock, User, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CURRENT_OFFICER } from '../data/mockData';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [officerId, setOfficerId] = useState<string>(CURRENT_OFFICER.officerId);
  const [pin, setPin] = useState<string>('••••••');
  const [jurisdiction, setJurisdiction] = useState<string>(CURRENT_OFFICER.jurisdiction);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 select-none relative overflow-hidden">
      {/* Subtle background ambient light */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-slate-800/40 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 relative z-10">
        <div className="relative inline-block">
          <div className="w-12 h-12 mx-auto rounded-xl bg-slate-900 border border-slate-700 p-0.5 shadow-xl flex items-center justify-center text-white">
            <Scale className="w-6 h-6 text-blue-400 stroke-[2.2]" />
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-slate-950" />
        </div>
        <div>
          <div className="inline-block px-3 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-semibold mb-1 shadow-2xs">
            Official Enforcement Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Metri<span className="text-blue-500">Scan</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ministry of Consumer Affairs • Legal Metrology Division
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-md py-8 px-6 sm:px-10 rounded-2xl shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Enforcement Officer ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  required
                  className="w-full text-xs font-mono pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Officer Security PIN / Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                  className="w-full text-xs font-mono pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Jurisdiction Circle
              </label>
              <input
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                readOnly
                className="w-full text-xs pl-3 pr-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember Credentials</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">Station: DL-04</span>
            </div>

            <button
              id="btn-officer-login"
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs cursor-pointer"
            >
              <span>Sign In as Lead Inspector (Demo)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Officer credentials badge info */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-white font-semibold block">Pre-Authenticated Demo Profile:</span>
              <span className="text-slate-400">{CURRENT_OFFICER.name} • {CURRENT_OFFICER.designation} ({CURRENT_OFFICER.badgeNumber})</span>
            </div>
          </div>

          {/* Legal Security Disclaimer */}
          <div className="pt-2 text-center text-[11px] text-slate-500 leading-relaxed">
            <ShieldAlert className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
            Authorized statutory access only. All actions, image uploads, and inspection decisions are logged under Legal Metrology Act provisions.
          </div>
        </div>
      </div>
    </div>
  );
};
