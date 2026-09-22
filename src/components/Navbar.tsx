import React from 'react';
import { Scale, ShieldCheck, Menu, Plus, User, LogOut, LayoutDashboard, ScanLine, FileCheck2, BookOpen } from 'lucide-react';
import { CURRENT_OFFICER } from '../data/mockData';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onToggleSidebar: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onToggleSidebar,
  onLogout,
}) => {
  const menuTabs: { view: AppView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { view: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { view: 'NEW_INSPECTION', label: 'New Inspection', icon: ScanLine },
    { view: 'INSPECTION_HISTORY', label: 'Records Archive', icon: FileCheck2 },
    { view: 'HELP', label: 'LMPC Rules', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 shadow-md">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Hamburger (mobile) + Brand logo + Direct Navigation Menu */}
          <div className="flex items-center gap-3 sm:gap-5 lg:gap-6">
            <button
              id="btn-toggle-sidebar"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700 transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              id="btn-nav-brand"
              onClick={() => onNavigate('DASHBOARD')}
              className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer shrink-0"
            >
              {/* Sleek Modern Logo Icon */}
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 p-0.5 shadow-sm group-hover:scale-105 transition duration-150 flex items-center justify-center text-blue-400">
                  <Scale className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-slate-900" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-extrabold tracking-tight text-white leading-none">
                    Metri<span className="text-blue-400">Scan</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-slate-800 text-blue-400 border border-slate-700">
                    LMPC 2011
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden sm:inline-block">
                  Legal Metrology Inspection Suite
                </span>
              </div>
            </button>

            {/* Compact, solid menu tabs right next to brand - No awkward empty space */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-800/90 p-1 rounded-lg border border-slate-700/80">
              {menuTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentView === tab.view;
                return (
                  <button
                    key={tab.view}
                    id={`top-menu-${tab.view.toLowerCase()}`}
                    onClick={() => onNavigate(tab.view)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right section: Quick Action + Officer Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Regulatory Portal</span>
            </div>

            <button
              id="btn-navbar-new-inspection"
              onClick={() => onNavigate('NEW_INSPECTION')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">New Inspection</span>
            </button>

            {/* Officer details pill */}
            <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
                <User className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-left leading-tight hidden md:block">
                <div className="text-xs font-bold text-slate-200">
                  {CURRENT_OFFICER.name}
                </div>
                <div className="text-[10px] text-blue-400 font-mono font-semibold">
                  {CURRENT_OFFICER.officerId}
                </div>
              </div>
            </div>

            <button
              id="btn-navbar-logout"
              onClick={onLogout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition focus:outline-none cursor-pointer"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
