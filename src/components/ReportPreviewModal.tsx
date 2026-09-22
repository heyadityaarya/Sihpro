import React from 'react';
import { X, Printer, Download, ShieldCheck, Scale, CheckCircle2, AlertCircle } from 'lucide-react';
import { CURRENT_OFFICER } from '../data/mockData';
import { InspectionRecord } from '../types';
import { StatusBadge } from './StatusBadge';

interface ReportPreviewModalProps {
  record: InspectionRecord;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  record,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-300 rounded-2xl shadow-2xl flex flex-col my-6 max-h-[92vh]">
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="print:hidden px-6 py-4 border-b border-slate-800 bg-slate-900 text-white flex items-center justify-between shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight block">
                Official Inspection Memorandum Preview
              </span>
              <span className="text-[10px] text-slate-400">MetriScan Compliance Record</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Generate PDF / Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close report"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Document Content */}
        <div className="p-6 sm:p-12 overflow-y-auto print:p-0 print:overflow-visible text-slate-900 space-y-6 print:space-y-4">
          {/* Official Letterhead */}
          <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
            <div className="text-[11px] font-bold tracking-widest uppercase text-slate-600">
              Government of India • Ministry of Consumer Affairs, Food &amp; Public Distribution
            </div>
            <div className="text-lg sm:text-xl font-extrabold uppercase tracking-tight text-slate-950">
              Legal Metrology Enforcement Division
            </div>
            <div className="text-xs font-semibold text-slate-700">
              Preliminary Compliance Inspection Memorandum under Legal Metrology (Packaged Commodities) Rules, 2011
            </div>
            <div className="text-[10px] font-mono text-slate-500 pt-1">
              Statutory Basis: Sections 18 &amp; 36 of The Legal Metrology Act, 2009 (Act No. 1 of 2010)
            </div>
          </div>

          {/* Inspection Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Inspection ID</span>
              <span className="font-mono font-bold text-slate-900">{record.inspectionNumber}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Date &amp; Time</span>
              <span className="font-medium text-slate-900">{record.date} • {record.time}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Inspecting Officer</span>
              <span className="font-medium text-slate-900">{record.officerName}</span>
              <span className="text-[10px] text-slate-500 block">ID: {record.officerId}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Preliminary Status</span>
              <div className="mt-0.5">
                <StatusBadge status={record.status} size="sm" />
              </div>
            </div>
          </div>

          {/* Section 1: Premises & Retailer Particulars */}
          <div className="space-y-1 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
              1. Inspection Premises &amp; Commercial Particulars
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-700">
              <div>
                <strong>Premises Name:</strong> {record.premisesName || 'On-site Retail Store'}
              </div>
              <div>
                <strong>Premises Location:</strong> {record.premisesAddress || 'Enforcement Jurisdiction'}
              </div>
            </div>
          </div>

          {/* Section 2: Commodity & Brand Particulars */}
          <div className="space-y-1 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
              2. Pre-Packaged Commodity Particulars
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-slate-700">
              <div>
                <strong>Product Name:</strong> {record.productName}
              </div>
              <div>
                <strong>Brand / Trade Mark:</strong> {record.brandName}
              </div>
              <div>
                <strong>Commodity Category:</strong> {record.commodityCategory}
              </div>
            </div>
          </div>

          {/* Section 3: Extracted Statutory Declarations Table */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
              3. Statutory Declarations Extracted from Packaging (Rule 6)
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2 border-r border-slate-200">Rule Ref</th>
                    <th className="p-2 border-r border-slate-200">Mandatory Particular</th>
                    <th className="p-2 border-r border-slate-200">Declared Value Detected</th>
                    <th className="p-2">Verification State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {record.extractedFields.map((field) => (
                    <tr key={field.id}>
                      <td className="p-2 border-r border-slate-200 font-mono text-[11px] text-amber-800">
                        {field.legalReference || 'Rule 6(1)'}
                      </td>
                      <td className="p-2 border-r border-slate-200 font-semibold">
                        {field.label}
                      </td>
                      <td className="p-2 border-r border-slate-200 font-mono text-[11px]">
                        {field.value}
                      </td>
                      <td className="p-2">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                          {field.verificationState}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Compliance Findings & Evidence */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
              4. Preliminary Compliance Findings &amp; Evidence Log
            </h3>
            {record.findings.length === 0 ? (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                No statutory discrepancies detected. All evaluated mandatory declarations satisfy LMPC Rules, 2011 provisions.
              </div>
            ) : (
              <div className="space-y-3">
                {record.findings.map((f, idx) => (
                  <div key={f.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        Item 4.{idx + 1}: {f.what}
                      </span>
                      <span className="font-mono text-[11px] text-amber-800 font-semibold">
                        {f.rule}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-700">
                      <strong>Location / Panel:</strong> {f.where}
                    </div>
                    <div className="text-[11px] text-slate-700">
                      <strong>Analysis Reason:</strong> {f.why}
                    </div>
                    <div className="text-[11px] text-slate-900 pt-1 border-t border-slate-200 flex items-center justify-between">
                      <span>
                        <strong>Officer Determination:</strong> {f.officerDecision}
                      </span>
                      {f.officerComment && (
                        <span className="italic text-slate-600">"{f.officerComment}"</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Officer Certification & Digital Seal */}
          <div className="pt-4 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <div className="font-bold uppercase tracking-wider text-slate-800 mb-1">
                Official Inspection Remarks:
              </div>
              <p className="text-slate-700 italic leading-relaxed">
                {record.officerNotes || 'Preliminary inspection performed with automated OCR assistance. Physical package examined on premises.'}
              </p>
            </div>

            <div className="text-right space-y-1">
              <div className="inline-block border-2 border-slate-800 p-2 text-center rounded mb-1">
                <div className="text-[9px] uppercase font-bold tracking-widest text-slate-500">
                  Govt. of India • Legal Metrology
                </div>
                <div className="text-xs font-black text-slate-900">PRELIMINARY INSPECTION</div>
                <div className="text-[10px] font-mono text-blue-700 font-bold">{record.inspectionNumber}</div>
              </div>
              <div className="font-bold text-slate-900">{record.officerName}</div>
              <div className="text-slate-600">{record.officerDesignation}</div>
              <div className="font-mono text-[11px] text-slate-500">
                Officer ID: {record.officerId}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
