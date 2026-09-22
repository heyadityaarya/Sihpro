import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  MinusCircle,
  CheckCircle2,
  ArrowRight,
  Filter,
  Eye,
  FileCheck2,
  BookOpen,
} from 'lucide-react';
import { ComplianceCheck, ComplianceStatus, OfficerFinding, PackageImage } from '../types';
import { StatusBadge } from './StatusBadge';
import { FindingDetailModal } from './FindingDetailModal';

interface ComplianceResultsViewProps {
  overallStatus: ComplianceStatus;
  complianceChecks: ComplianceCheck[];
  findings: OfficerFinding[];
  images: PackageImage[];
  productName: string;
  onProceedToReview: () => void;
  onConfirmFinding?: (findingId: string, comment: string) => void;
  onDismissFinding?: (findingId: string, comment: string) => void;
}

export const ComplianceResultsView: React.FC<ComplianceResultsViewProps> = ({
  overallStatus,
  complianceChecks,
  findings,
  images,
  productName,
  onProceedToReview,
  onConfirmFinding,
  onDismissFinding,
}) => {
  const [selectedCheck, setSelectedCheck] = useState<ComplianceCheck | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | ComplianceStatus>('ALL');

  const findingMap = new Map<string, OfficerFinding>();
  findings.forEach((f) => findingMap.set(f.checkId, f));

  const filteredChecks = complianceChecks.filter((c) => {
    if (statusFilter === 'ALL') return true;
    return c.result === statusFilter;
  });

  // Calculate status counts
  const counts = {
    pass: complianceChecks.filter((c) => c.result === 'PASS').length,
    potentialNonCompliance: complianceChecks.filter((c) => c.result === 'POTENTIAL_NON_COMPLIANCE').length,
    requiresReview: complianceChecks.filter((c) => c.result === 'REQUIRES_REVIEW').length,
    couldNotVerify: complianceChecks.filter((c) => c.result === 'COULD_NOT_VERIFY').length,
    notApplicable: complianceChecks.filter((c) => c.result === 'NOT_APPLICABLE').length,
  };

  const getOverallBannerConfig = (status: ComplianceStatus) => {
    switch (status) {
      case 'PASS':
        return {
          title: 'PRELIMINARY SCREENING: ALL MANDATORY CHECKS SATISFIED',
          sub: 'All standard declarations under Legal Metrology Rules, 2011 detected in compliant formats.',
          bg: 'bg-slate-900 border-emerald-500/40 text-white',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
          icon: CheckCircle2,
          iconColor: 'text-emerald-400',
        };
      case 'POTENTIAL_NON_COMPLIANCE':
        return {
          title: 'PRELIMINARY SCREENING: POTENTIAL NON-COMPLIANCE DETECTED',
          sub: 'System identified potential deviations from statutory mandates. Requires officer verification and evidence review.',
          bg: 'bg-slate-900 border-rose-500/40 text-white',
          badgeBg: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
          icon: AlertCircle,
          iconColor: 'text-rose-400',
        };
      case 'REQUIRES_REVIEW':
        return {
          title: 'PRELIMINARY SCREENING: HUMAN OFFICER REVIEW REQUIRED',
          sub: 'Uncertain declaration formats or partial information detected. Final verification rests with the enforcement officer.',
          bg: 'bg-slate-900 border-amber-500/40 text-white',
          badgeBg: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
          icon: AlertTriangle,
          iconColor: 'text-amber-400',
        };
      case 'COULD_NOT_VERIFY':
        return {
          title: 'PRELIMINARY SCREENING: COULD NOT VERIFY ALL DECLARATIONS',
          sub: 'Image clarity, glare, or label occlusion prevented conclusive OCR parsing. Physical packaging check necessary.',
          bg: 'bg-slate-900 border-slate-700 text-white',
          badgeBg: 'bg-slate-800 text-slate-200 border border-slate-700',
          icon: HelpCircle,
          iconColor: 'text-slate-400',
        };
      default:
        return {
          title: 'PRELIMINARY COMPLIANCE SCREENING COMPLETE',
          sub: 'Statutory rule validations generated for officer audit.',
          bg: 'bg-slate-900 border-slate-700 text-white',
          badgeBg: 'bg-slate-800 text-slate-200 border border-slate-700',
          icon: ShieldCheck,
          iconColor: 'text-blue-400',
        };
    }
  };

  const banner = getOverallBannerConfig(overallStatus);
  const BannerIcon = banner.icon;

  return (
    <div className="space-y-6">
      {/* Overall Inspection Status Banner (NO arbitrary percentages!) */}
      <div className={`rounded-2xl border p-5 sm:p-6 shadow-sm ${banner.bg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
              <BannerIcon className={`w-6 h-6 ${banner.iconColor}`} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">
                  Overall Preliminary Outcome
                </span>
                <StatusBadge status={overallStatus} size="sm" />
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                {banner.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {banner.sub}
              </p>
            </div>
          </div>

          <button
            id="btn-proceed-to-officer-review"
            onClick={onProceedToReview}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs shrink-0 cursor-pointer"
          >
            <span>Proceed to Officer Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Legal Reminder Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-[11px]">
            <strong className="text-slate-200">Legal Metrology Protocol:</strong> This automated preliminary screening does not constitute a final legal adjudication. All findings require human-in-the-loop verification by an authorized enforcement officer.
          </span>
        </div>
      </div>

      {/* Breakdown count chips (Interactive filter) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
            statusFilter === 'ALL'
              ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 text-slate-900 shadow-2xs'
              : 'border-slate-200/90 bg-white hover:border-slate-300 text-slate-700'
          }`}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">All Checks</div>
          <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">{complianceChecks.length}</div>
        </button>

        <button
          onClick={() => setStatusFilter('PASS')}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
            statusFilter === 'PASS'
              ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 text-slate-900 shadow-2xs'
              : 'border-slate-200/90 bg-white hover:border-slate-300 text-slate-700'
          }`}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">Pass</div>
          <div className="text-lg font-bold font-mono text-emerald-800 mt-0.5">{counts.pass}</div>
        </button>

        <button
          onClick={() => setStatusFilter('POTENTIAL_NON_COMPLIANCE')}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
            statusFilter === 'POTENTIAL_NON_COMPLIANCE'
              ? 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-500/20 text-slate-900 shadow-2xs'
              : 'border-slate-200/90 bg-white hover:border-slate-300 text-slate-700'
          }`}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider text-rose-700">Non-Compliant</div>
          <div className="text-lg font-bold font-mono text-rose-800 mt-0.5">{counts.potentialNonCompliance}</div>
        </button>

        <button
          onClick={() => setStatusFilter('REQUIRES_REVIEW')}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
            statusFilter === 'REQUIRES_REVIEW'
              ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20 text-slate-900 shadow-2xs'
              : 'border-slate-200/90 bg-white hover:border-slate-300 text-slate-700'
          }`}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider text-amber-700">Needs Review</div>
          <div className="text-lg font-bold font-mono text-amber-800 mt-0.5">{counts.requiresReview}</div>
        </button>

        <button
          onClick={() => setStatusFilter('COULD_NOT_VERIFY')}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
            statusFilter === 'COULD_NOT_VERIFY'
              ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 text-slate-900 shadow-2xs'
              : 'border-slate-200/90 bg-white hover:border-slate-300 text-slate-700'
          }`}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-700">Unverified</div>
          <div className="text-lg font-bold font-mono text-indigo-800 mt-0.5">{counts.couldNotVerify}</div>
        </button>

        <button
          onClick={() => setStatusFilter('NOT_APPLICABLE')}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
            statusFilter === 'NOT_APPLICABLE'
              ? 'border-slate-600 bg-slate-100 ring-2 ring-slate-400/20 text-slate-900 shadow-2xs'
              : 'border-slate-200/90 bg-white hover:border-slate-300 text-slate-700'
          }`}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">N/A</div>
          <div className="text-lg font-bold font-mono text-slate-700 mt-0.5">{counts.notApplicable}</div>
        </button>
      </div>

      {/* Individual Compliance Requirement Checks */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Statutory Requirement Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Legal Metrology (Packaged Commodities) Rules, 2011 • Rule 6(1) Declarations
            </p>
          </div>
          <span className="text-xs font-mono text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            Showing {filteredChecks.length} of {complianceChecks.length} checks
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredChecks.map((check) => {
            const finding = findingMap.get(check.id);
            const isAttention =
              check.result === 'POTENTIAL_NON_COMPLIANCE' ||
              check.result === 'REQUIRES_REVIEW' ||
              check.result === 'COULD_NOT_VERIFY';

            return (
              <div
                key={check.id}
                className={`p-5 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                  isAttention ? 'bg-slate-50/40 hover:bg-slate-50/80' : 'hover:bg-slate-50/30'
                }`}
              >
                {/* Left: Requirement Details */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={check.result} size="sm" />
                    <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      {check.legalReference}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      {check.category.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {check.requirementName}
                  </h3>

                  <div className="text-xs text-slate-600 flex items-start gap-1">
                    <strong className="text-slate-800 shrink-0 font-bold">Detected Info:</strong>
                    <span className="font-mono bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md text-slate-900 font-medium break-all text-[11px]">
                      {check.detectedInformation}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-normal">
                    {check.validationMessage}
                  </p>
                </div>

                {/* Right: Evidence button and action */}
                <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
                  <button
                    onClick={() => setSelectedCheck(check)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>View Evidence &amp; Rule</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Finding Detail Modal */}
      {selectedCheck && (
        <FindingDetailModal
          check={selectedCheck}
          finding={findingMap.get(selectedCheck.id)}
          isOpen={Boolean(selectedCheck)}
          onClose={() => setSelectedCheck(null)}
          onConfirmFinding={onConfirmFinding}
          onDismissFinding={onDismissFinding}
        />
      )}
    </div>
  );
};
