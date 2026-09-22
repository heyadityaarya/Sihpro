import React, { useState } from 'react';
import {
  FileText,
  FileCheck2,
  Printer,
  Save,
  ArrowLeft,
  PlusCircle,
  ShieldCheck,
  Calendar,
  MapPin,
  User,
  CheckCircle2,
} from 'lucide-react';
import { InspectionRecord } from '../types';
import { StatusBadge } from './StatusBadge';
import { ReportPreviewModal } from './ReportPreviewModal';

interface InspectionSummaryViewProps {
  record: InspectionRecord;
  onSaveToHistory: () => void;
  onNewInspection: () => void;
  onBackToDashboard: () => void;
}

export const InspectionSummaryView: React.FC<InspectionSummaryViewProps> = ({
  record,
  onSaveToHistory,
  onNewInspection,
  onBackToDashboard,
}) => {
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    onSaveToHistory();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono">
              Record #{record.inspectionNumber}
            </span>
            <StatusBadge status={record.status} size="sm" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Inspection Summary &amp; Adjudication
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Final review record ready for archival and statutory reporting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsReportOpen(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Generate PDF Report</span>
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs cursor-pointer border border-slate-800"
          >
            <Save className="w-4 h-4 text-blue-400" />
            <span>{savedSuccess ? 'Saved to Records! ✓' : 'Save Inspection'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Inspection successfully saved to official local archive. You can access it anytime from the Inspection Records page.</span>
        </div>
      )}

      {/* Meta Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Inspection Date</span>
          </div>
          <div className="text-sm font-bold text-slate-900">{record.date}</div>
          <div className="text-[11px] text-slate-500 font-mono">{record.time}</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Premises Inspected</span>
          </div>
          <div className="text-sm font-bold text-slate-900 truncate" title={record.premisesName}>
            {record.premisesName}
          </div>
          <div className="text-[11px] text-slate-500 truncate" title={record.premisesAddress}>
            {record.premisesAddress}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>Inspecting Officer</span>
          </div>
          <div className="text-sm font-bold text-slate-900">{record.officerName}</div>
          <div className="text-[11px] text-blue-700 font-mono font-semibold">{record.officerId}</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Overall Verification</span>
          </div>
          <div className="mt-1">
            <StatusBadge status={record.status} size="md" />
          </div>
        </div>
      </div>

      {/* Product & Package Images */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-4 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900">
          Commodity &amp; Package Evidence
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="space-y-2 flex-1">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Product Overview
            </div>
            <div className="text-lg font-bold text-slate-900">{record.productName}</div>
            <div className="text-xs text-slate-600">
              Brand: <strong>{record.brandName}</strong> • Category: <strong>{record.commodityCategory}</strong>
            </div>
            {record.officerNotes && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 mt-2">
                <strong className="block text-slate-900 font-bold mb-0.5">Officer Observation Notes:</strong>
                {record.officerNotes}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 overflow-x-auto py-2">
            {record.packageImages.map((img, idx) => (
              <div
                key={img.id}
                className="w-28 h-36 rounded-xl border border-slate-700 overflow-hidden bg-slate-950 shrink-0 relative shadow-2xs"
              >
                <img src={img.imageUrl} alt={img.label} className="w-full h-full object-contain" />
                <span className="absolute bottom-0 inset-x-0 bg-slate-900/90 text-[10px] font-bold text-slate-300 text-center py-0.5 font-mono">
                  Panel {idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Declarations Summary Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Mandatory Declarations Summary
          </h2>
          <span className="text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 font-mono font-bold">
            {record.extractedFields.length} Recorded Fields
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200/80">
              <tr>
                <th className="p-4">Rule Reference</th>
                <th className="p-4">Requirement</th>
                <th className="p-4">Detected Value</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {record.extractedFields.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4 font-mono text-[11px] text-blue-800 font-bold">{f.legalReference || 'Rule 6(1)'}</td>
                  <td className="p-4 font-bold text-slate-900">{f.label}</td>
                  <td className="p-4 font-mono text-[11px] text-slate-800">{f.value}</td>
                  <td className="p-4 font-medium text-slate-600">{f.confidence}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {f.verificationState}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Nav Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={onNewInspection}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Start Another Inspection</span>
        </button>
      </div>

      {/* Printable Report Modal */}
      <ReportPreviewModal
        record={record}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
};
