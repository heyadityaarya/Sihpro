import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  UserCheck,
  ArrowRight,
  MessageSquare,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { CURRENT_OFFICER } from '../data/mockData';
import { ComplianceCheck, OfficerFinding, PackageImage } from '../types';
import { StatusBadge } from './StatusBadge';

interface OfficerReviewViewProps {
  findings: OfficerFinding[];
  checks: ComplianceCheck[];
  images: PackageImage[];
  productName: string;
  onUpdateFindingDecision: (
    findingId: string,
    decision: OfficerFinding['officerDecision'],
    comment: string
  ) => void;
  onCompleteReview: (officerNotes: string) => void;
}

export const OfficerReviewView: React.FC<OfficerReviewViewProps> = ({
  findings,
  checks,
  images,
  productName,
  onUpdateFindingDecision,
  onCompleteReview,
}) => {
  const [officerNotes, setOfficerNotes] = useState<string>(
    'Physical packaging inspection performed on premises. Evidence verified in presence of store manager.'
  );
  const [comments, setComments] = useState<Record<string, string>>({});
  const [isAffirmed, setIsAffirmed] = useState<boolean>(true);

  const handleCommentChange = (id: string, text: string) => {
    setComments((prev) => ({ ...prev, [id]: text }));
  };

  const pendingIssuesCount = findings.filter(
    (f) => f.officerDecision === 'PENDING'
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Stage 5: Human Verification
            </span>
            <span className="text-xs text-slate-400 font-mono font-medium">
              Enforcement Officer Audit
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Officer Review &amp; Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            You hold final statutory authority. Review each automated finding, input on-site verification notes, and certify preliminary compliance findings.
          </p>
        </div>

        <button
          id="btn-finalize-inspection-summary"
          onClick={() => onCompleteReview(officerNotes)}
          disabled={!isAffirmed}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs disabled:opacity-40 cursor-pointer shrink-0"
        >
          <FileCheck className="w-4 h-4 text-blue-200" />
          <span>Finalize Inspection Record</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Human In The Loop Principle Banner */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-slate-900">Statutory Human-in-the-Loop Protocol:</strong>
          <p className="mt-0.5 leading-relaxed text-slate-600 text-[11px]">
            Automated image processing identifies potential non-compliance or unverified declarations for officer assistance. The system does not issue penal notices autonomously; your physical assessment and sign-off determines the final inspection record.
          </p>
        </div>
      </div>

      {/* Findings Verification List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Items Requiring Officer Decision ({findings.length})
          </h2>
          {pendingIssuesCount > 0 ? (
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {pendingIssuesCount} Pending Officer Review
            </span>
          ) : (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              All Findings Adjudicated
            </span>
          )}
        </div>

        {findings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center shadow-2xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No Actionable Issues Flagged</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              All mandatory declarations conformed with Legal Metrology (Packaged Commodities) Rules, 2011. You may add general inspection remarks below.
            </p>
          </div>
        ) : (
          findings.map((finding) => {
            const check = checks.find((c) => c.id === finding.checkId);
            const userComment = comments[finding.id] || finding.officerComment || '';

            return (
              <div
                key={finding.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold">
                      {finding.rule}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {finding.what}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">Current Decision:</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        finding.officerDecision === 'CONFIRMED'
                          ? 'bg-rose-100 text-rose-800'
                          : finding.officerDecision === 'RESOLVED' || finding.officerDecision === 'DISMISSED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {finding.officerDecision}
                    </span>
                  </div>
                </div>

                {/* Finding Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-1">
                    <strong className="text-slate-700">Package Location:</strong>
                    <p className="text-slate-600">{finding.where}</p>
                    <div className="pt-2">
                      <strong className="text-slate-700">System Analysis:</strong>
                      <p className="text-slate-600 leading-relaxed">{finding.why}</p>
                    </div>
                  </div>

                  {/* Thumbnail of evidence */}
                  <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80 flex items-center gap-3">
                    <div className="w-20 h-24 bg-slate-900 rounded-lg overflow-hidden shrink-0 border border-slate-700">
                      <img
                        src={finding.evidence}
                        alt="Evidence snippet"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-xs text-slate-500">
                      <strong className="text-slate-800 block mb-1">Visual Evidence</strong>
                      <p className="text-[11px] leading-snug">
                        Statutory panel scanned during inspection. Officer may override if packaging shows clear declarations upon physical examination.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Officer remarks input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Officer Remarks / Justification:
                  </label>
                  <input
                    type="text"
                    value={userComment}
                    onChange={(e) => handleCommentChange(finding.id, e.target.value)}
                    placeholder="E.g., Confirmed omission of telephone helpline on retail pack; or verified present under folded seam"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() =>
                      onUpdateFindingDecision(
                        finding.id,
                        'DISMISSED',
                        userComment || 'Verified compliant upon physical inspection'
                      )
                    }
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                      finding.officerDecision === 'DISMISSED'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    Mark Verified / Dismiss Issue
                  </button>

                  <button
                    onClick={() =>
                      onUpdateFindingDecision(
                        finding.id,
                        'RESOLVED',
                        userComment || 'Rectified / Clarified on-site'
                      )
                    }
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                      finding.officerDecision === 'RESOLVED'
                        ? 'bg-emerald-700 text-white'
                        : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    Resolve with Remark
                  </button>

                  <button
                    onClick={() =>
                      onUpdateFindingDecision(
                        finding.id,
                        'CONFIRMED',
                        userComment || 'Potential non-compliance confirmed by officer'
                      )
                    }
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                      finding.officerDecision === 'CONFIRMED'
                        ? 'bg-rose-700 text-white shadow-2xs'
                        : 'text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    Confirm Potential Non-Compliance
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Officer Certification & Overall Notes */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <UserCheck className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">
            Enforcement Officer Certification
          </h2>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            General Inspection Observations &amp; Premises Notes:
          </label>
          <textarea
            value={officerNotes}
            onChange={(e) => setOfficerNotes(e.target.value)}
            rows={3}
            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            placeholder="Add general remarks regarding packaging condition, batch availability, retailer statement..."
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            <div className="font-bold text-slate-900">{CURRENT_OFFICER.name}</div>
            <div>{CURRENT_OFFICER.designation}</div>
            <div className="font-mono text-blue-700 font-semibold text-[11px]">
              ID: {CURRENT_OFFICER.officerId} • Badge: {CURRENT_OFFICER.badgeNumber}
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isAffirmed}
              onChange={(e) => setIsAffirmed(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 accent-blue-600"
            />
            <span>I certify that this preliminary screening was verified on-site.</span>
          </label>
        </div>
      </div>
    </div>
  );
};
