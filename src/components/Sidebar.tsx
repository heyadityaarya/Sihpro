import React from 'react';
import {
  LayoutDashboard,
  ScanLine,
  FileCheck2,
  FileText,
  BookOpen,
  RotateCcw,
  X,
  Info,
  ExternalLink,
} from 'lucide-react';
import { AppView } from '../types';
import { StatusBadge } from './StatusBadge';
import { CURRENT_OFFICER } from '../data/mockData';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpen,
  onClose,
  onResetData,
}) => {
  const navItems: {
    view: AppView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    {
      view: 'DASHBOARD',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      view: 'NEW_INSPECTION',
      label: 'New Inspection',
      icon: ScanLine,
      badge: 'Scan',
    },
    {
      view: 'INSPECTION_HISTORY',
      label: 'Inspection Records',
      icon: FileCheck2,
    },
    {
      view: 'HELP',
      label: 'Legal Rules Reference',
      icon: BookOpen,
      badge: 'Rules 2011',
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-full select-none">
      {/* Drawer / Sidebar Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-slate-800 bg-slate-950 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-950 animate-pulse" />
          <div className="flex flex-col">
            <span className="font-extrabold text-xs text-white uppercase tracking-wider">
              Enforcement Menu
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Legal Metrology Division
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition"
          aria-label="Close navigation"
          title="Close Menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Officer & Terminal Details Banner */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">
            AS
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">
              {CURRENT_OFFICER.name}
            </div>
            <div className="text-[10px] text-blue-400 font-mono font-semibold flex items-center gap-1">
              <span>{CURRENT_OFFICER.officerId}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Station DL-01</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation links and compliance tools (Scrollable container filling available space) */}
      <div className="flex-1 p-2.5 space-y-3 overflow-y-auto w-full">
        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Inspection Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                id={`nav-link-${item.view.toLowerCase()}`}
                onClick={() => {
                  onNavigate(item.view);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/90'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isActive
                      ? 'bg-blue-700 text-white border border-blue-500'
                      : 'bg-slate-800 text-blue-300 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legal Metrology Rules 2011 Standards Card */}
        <div className="space-y-1">
          <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Statutory Standards
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/90 border border-slate-700/80 shadow-2xs">
            <div className="text-white font-bold text-xs mb-1 flex items-center justify-between">
              <span>LMPC Rules, 2011</span>
              <span className="text-[9px] text-blue-300 font-mono font-bold bg-blue-950 px-1.5 py-0.5 rounded border border-blue-800">Rule 6(1)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Mandatory Declarations on Retail Packages:
            </p>
            <ul className="mt-1.5 space-y-0.5 text-[10px] text-slate-400 list-disc list-inside">
              <li>Generic Name of Commodity</li>
              <li>Net Quantity with Std Units</li>
              <li>MRP (Inclusive of all taxes)</li>
              <li>Month &amp; Year of Mfg / Import</li>
              <li>Customer Care &amp; Address</li>
            </ul>
          </div>
        </div>

        {/* Screening State Legend Guide */}
        <div className="space-y-1">
          <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Audit State Legend
          </div>
          <div className="space-y-0.5 p-1 bg-slate-950/40 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between text-xs py-1 px-2 rounded-md hover:bg-slate-800/60 transition">
              <span className="text-slate-300 font-medium text-[11px]">Compliant</span>
              <StatusBadge status="PASS" size="sm" />
            </div>
            <div className="flex items-center justify-between text-xs py-1 px-2 rounded-md hover:bg-slate-800/60 transition">
              <span className="text-slate-300 font-medium text-[11px]">Potential Defect</span>
              <StatusBadge status="POTENTIAL_NON_COMPLIANCE" size="sm" />
            </div>
            <div className="flex items-center justify-between text-xs py-1 px-2 rounded-md hover:bg-slate-800/60 transition">
              <span className="text-slate-300 font-medium text-[11px]">Officer Review</span>
              <StatusBadge status="REQUIRES_REVIEW" size="sm" />
            </div>
            <div className="flex items-center justify-between text-xs py-1 px-2 rounded-md hover:bg-slate-800/60 transition">
              <span className="text-slate-300 font-medium text-[11px]">Uncertain OCR</span>
              <StatusBadge status="COULD_NOT_VERIFY" size="sm" />
            </div>
            <div className="flex items-center justify-between text-xs py-1 px-2 rounded-md hover:bg-slate-800/60 transition">
              <span className="text-slate-300 font-medium text-[11px]">Non-Applicable</span>
              <StatusBadge status="NOT_APPLICABLE" size="sm" />
            </div>
          </div>
        </div>

        {/* System & Enforcement Authority Info */}
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[10.5px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-semibold">Regulatory Act:</span>
            <span className="text-slate-300">Act 1 of 2010</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-semibold">System Server:</span>
            <span className="text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Online (LMPC)
            </span>
          </div>
        </div>
      </div>

      {/* Footer / Reset Demo Data (Anchored cleanly at the bottom) */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 shrink-0 w-full">
        <button
          onClick={() => {
            if (confirm('Reset sample inspection records to default demo data?')) {
              onResetData();
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer border border-slate-700 bg-slate-800/80 shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Sample Records</span>
        </button>
        <div className="text-[10px] text-center text-slate-500 font-medium mt-2">
          MetriScan Enforcement Suite • v2.4.1
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] w-64 xl:w-72 bg-slate-900 border-r border-slate-800 z-20">
        {content}
      </aside>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative flex-1 flex flex-col w-72 sm:w-80 max-w-[85vw] bg-slate-900 border-r border-slate-800 z-50 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
