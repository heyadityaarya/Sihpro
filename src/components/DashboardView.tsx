import React from 'react';
import {
  ScanLine,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  Eye,
  Sparkles,
  Calendar,
  Store,
  ChevronRight,
  Scale,
} from 'lucide-react';
import { CURRENT_OFFICER, DEMO_PRESETS } from '../data/mockData';
import { AppView, ComplianceStatus, InspectionRecord } from '../types';
import { StatusBadge } from './StatusBadge';

interface DashboardViewProps {
  records: InspectionRecord[];
  onNavigate: (view: AppView) => void;
  onSelectRecord: (recordId: string) => void;
  onStartWithPreset: (presetId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  records,
  onNavigate,
  onSelectRecord,
  onStartWithPreset,
}) => {
  // Compute summary stats
  const total = records.length;
  const passed = records.filter((r) => r.status === 'PASS').length;
  const potentialIssues = records.filter((r) => r.status === 'POTENTIAL_NON_COMPLIANCE').length;
  const requiresReview = records.filter((r) => r.status === 'REQUIRES_REVIEW').length;
  const couldNotVerify = records.filter((r) => r.status === 'COULD_NOT_VERIFY').length;

  // Inspections requiring attention
  const attentionRecords = records.filter(
    (r) => r.status === 'POTENTIAL_NON_COMPLIANCE' || r.status === 'REQUIRES_REVIEW'
  );

  return (
    <div className="space-y-6">
      {/* Officer Welcome & Quick Actions Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-slate-800 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-blue-300 text-xs font-semibold shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>MetriScan Compliance Suite • Legal Metrology</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Package Compliance Inspection
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Preliminary screening assistant under the <em className="text-white">Legal Metrology (Packaged Commodities) Rules, 2011</em>. Scan retail packages to verify statutory declarations, evaluate rule compliance, and prepare audit records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="btn-dashboard-start-scan"
              onClick={() => onNavigate('NEW_INSPECTION')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer"
            >
              <ScanLine className="w-4 h-4 text-white stroke-[2.2]" />
              <span>Start New Inspection</span>
            </button>
          </div>
        </div>

        {/* Subtle royal blue ambient accent glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Scans</span>
            <FileCheck2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{total}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Recorded inspections</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-emerald-200/80 shadow-2xs hover:border-emerald-300 transition">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Compliant</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{passed}</div>
          <div className="text-[11px] text-emerald-600/80 mt-1 font-medium">All rules satisfied</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-rose-200/80 shadow-2xs hover:border-rose-300 transition">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Potential Defect</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-700">{potentialIssues}</div>
          <div className="text-[11px] text-rose-600/80 mt-1 font-medium">Statutory discrepancies</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-amber-200/80 shadow-2xs hover:border-amber-300 transition">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Needs Review</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-800">{requiresReview}</div>
          <div className="text-[11px] text-amber-700/80 mt-1 font-medium">Pending officer check</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-indigo-200/80 shadow-2xs col-span-2 sm:col-span-1 hover:border-indigo-300 transition">
          <div className="flex items-center justify-between text-indigo-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Unverified</span>
            <HelpCircle className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700">{couldNotVerify}</div>
          <div className="text-[11px] text-indigo-600/80 mt-1 font-medium">Unclear text / lighting</div>
        </div>
      </div>

      {/* Urgent Inspections Requiring Attention */}
      {attentionRecords.length > 0 && (
        <div className="bg-rose-50/40 border border-rose-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                Inspections Requiring Enforcement Action ({attentionRecords.length})
              </h2>
            </div>
            <span className="text-[11px] text-rose-700 font-medium">
              Review findings &amp; determine officer disposition
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {attentionRecords.map((r) => (
              <div
                key={r.id}
                onClick={() => onSelectRecord(r.id)}
                className="bg-white p-4 rounded-xl border border-rose-200 hover:border-rose-300 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {r.inspectionNumber}
                    </span>
                    <StatusBadge status={r.status} size="sm" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{r.productName}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                    <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{r.premisesName}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">{r.date}</span>
                  <span className="text-blue-600 font-semibold inline-flex items-center gap-1 hover:text-blue-800">
                    <span>Audit Finding Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* One-Click Quick Presets for Demo */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Instant Compliance Demo Presets
            </h2>
          </div>
          <span className="text-xs text-slate-500">Test different Legal Metrology rules instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DEMO_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => onStartWithPreset(p.id)}
              className="text-left p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-slate-50/60 transition group flex flex-col justify-between shadow-2xs cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase text-slate-500 truncate">
                    {p.category}
                  </span>
                  <StatusBadge status={p.status} size="sm" />
                </div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {p.name}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {p.summaryDescription}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-semibold text-blue-600 flex items-center justify-between group-hover:text-blue-700">
                <span>Run Preset Inspection</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Inspection Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Recent Inspection Records
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Audited pre-packaged commodities across retail and distribution points.
            </p>
          </div>
          <button
            onClick={() => onNavigate('INSPECTION_HISTORY')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1 cursor-pointer"
          >
            <span>View All Records</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200/80">
              <tr>
                <th className="p-4">Inspection ID</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Premises / Store</th>
                <th className="p-4">Date &amp; Time</th>
                <th className="p-4">Preliminary Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {records.slice(0, 5).map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4 font-mono font-bold text-slate-900">
                    {r.inspectionNumber}
                  </td>
                  <td className="p-4 font-medium text-slate-900">
                    <div className="font-bold">{r.productName}</div>
                    <span className="text-[10px] text-slate-500 font-medium">{r.brandName} • {r.commodityCategory}</span>
                  </td>
                  <td className="p-4">
                    <div className="truncate max-w-[180px] font-medium text-slate-800">{r.premisesName}</div>
                    <div className="truncate max-w-[180px] text-[10px] text-slate-400">{r.premisesAddress}</div>
                  </td>
                  <td className="p-4 text-slate-600 font-mono text-[11px]">
                    <div>{r.date}</div>
                    <div className="text-[10px] text-slate-400">{r.time}</div>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={r.status} size="sm" />
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onSelectRecord(r.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold transition cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
