import React from 'react';
import {
  X,
  ShieldAlert,
  MapPin,
  HelpCircle,
  BookOpen,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { ComplianceCheck, OfficerFinding } from '../types';
import { StatusBadge } from './StatusBadge';

interface FindingDetailModalProps {
  check: ComplianceCheck | null;
  finding?: OfficerFinding;
  isOpen: boolean;
  onClose: () => void;
  onConfirmFinding?: (findingId: string, comment: string) => void;
  onDismissFinding?: (findingId: string, comment: string) => void;
}

export const FindingDetailModal: React.FC<FindingDetailModalProps> = ({
  check,
  finding,
  isOpen,
  onClose,
  onConfirmFinding,
  onDismissFinding,
}) => {
  const [comment, setComment] = React.useState<string>('');

  if (!isOpen || !check) return null;

  const bbox = check.evidenceBBox || finding?.evidenceBBox;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-8 max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <StatusBadge status={check.result} size="md" />
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                {check.requirementName}
              </h2>
              <span className="text-xs font-mono text-blue-700 font-bold">
                {check.legalReference}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - The 5 W's Framework */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* WHAT */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs font-mono">
              WHAT
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Issue Identified
              </h3>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {finding ? finding.what : check.validationMessage}
              </p>
              <div className="mt-2 text-xs font-mono bg-white p-2.5 rounded-lg border border-slate-200 text-slate-900 font-semibold shadow-2xs">
                <strong>Detected Data:</strong> {check.detectedInformation}
              </div>
            </div>
          </div>

          {/* WHERE & EVIDENCE (Visual package image with Bounding Box) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-bold shadow-2xs font-mono">
                  WHERE
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Location on Package &amp; Evidence
                </span>
              </div>
              <span className="text-xs text-blue-700 font-semibold flex items-center gap-1 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{check.whereFound}</span>
              </span>
            </div>

            {/* Evidence Image with Bounding Box */}
            <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-4 min-h-[260px] max-h-[380px] shadow-inner">
              <div className="relative max-h-[340px] inline-block">
                <img
                  src={check.evidenceImage}
                  alt="Evidence panel"
                  className="max-h-[340px] w-auto object-contain rounded-lg shadow-lg"
                />

                {/* Bounding box highlight */}
                {bbox && (
                  <div
                    style={{
                      left: `${bbox.x}%`,
                      top: `${bbox.y}%`,
                      width: `${bbox.width}%`,
                      height: `${bbox.height}%`,
                    }}
                    className="absolute border-2 border-blue-400 bg-blue-500/20 rounded-md pointer-events-none animate-pulse"
                  >
                    <span className="absolute -top-6 left-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs whitespace-nowrap font-mono">
                      Flagged Region
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* WHY */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs font-mono">
              WHY
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Reason System Flagged Finding
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                {finding ? finding.why : check.explanation}
              </p>
            </div>
          </div>

          {/* RULE */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/60 border border-blue-200">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs font-mono">
              RULE
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Statutory Legal Reference
              </h3>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                {check.legalReference}
              </p>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Legal Metrology (Packaged Commodities) Rules, 2011 enacted under Section 18 &amp; 52 of the Legal Metrology Act, 2009.
              </p>
            </div>
          </div>

          {/* Officer Verification Form */}
          {finding && (
            <div className="border-t border-slate-200 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                Human-in-the-Loop Officer Action
              </h3>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter officer notes or inspection justification..."
                rows={2}
                className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 mb-3"
              />
              <div className="flex flex-wrap items-center justify-end gap-2">
                {onDismissFinding && (
                  <button
                    onClick={() => {
                      onDismissFinding(finding.id, comment || 'Verified manually on physical package');
                      onClose();
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition cursor-pointer"
                  >
                    Mark Verified / Dismiss Issue
                  </button>
                )}
                {onConfirmFinding && (
                  <button
                    onClick={() => {
                      onConfirmFinding(finding.id, comment || 'Non-compliance confirmed by officer');
                      onClose();
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition cursor-pointer shadow-xs"
                  >
                    Confirm Potential Non-Compliance
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
