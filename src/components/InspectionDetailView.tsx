import React, { useState } from 'react';
import {
  ArrowLeft,
  Printer,
  Calendar,
  MapPin,
  Store,
  User,
  ShieldCheck,
  FileText,
  Camera,
  Layers,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { InspectionRecord } from '../types';
import { StatusBadge } from './StatusBadge';
import { ReportPreviewModal } from './ReportPreviewModal';
import { FindingDetailModal } from './FindingDetailModal';

interface InspectionDetailViewProps {
  record: InspectionRecord;
  onBack: () => void;
}

export const InspectionDetailView: React.FC<InspectionDetailViewProps> = ({
  record,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DECLARATIONS' | 'CHECKS' | 'IMAGES'>('OVERVIEW');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [selectedCheckId, setSelectedCheckId] = useState<string | null>(null);

  const selectedCheck = record.complianceChecks.find((c) => c.id === selectedCheckId) || null;
  const selectedFinding = record.findings.find((f) => f.checkId === selectedCheckId);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inspections</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Inspection Dossier: <span className="font-mono">{record.inspectionNumber}</span>
            </h1>
            <StatusBadge status={record.status} size="sm" />
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {record.productName} • {record.premisesName}
          </p>
        </div>

        <button
          onClick={() => setIsReportOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs shrink-0 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>View / Print Memorandum</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 bg-white px-4 rounded-t-2xl pt-2">
        {[
          { id: 'OVERVIEW', label: 'Overview & Findings' },
          { id: 'DECLARATIONS', label: `Declarations (${record.extractedFields.length})` },
          { id: 'CHECKS', label: `Rule Checks (${record.complianceChecks.length})` },
          { id: 'IMAGES', label: `Package Evidence (${record.packageImages.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition cursor-pointer rounded-t-lg ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Date &amp; Time</span>
              </div>
              <div className="text-sm font-bold text-slate-900">{record.date}</div>
              <div className="text-[11px] text-slate-500 font-mono">{record.time}</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
                <Store className="w-3.5 h-3.5 text-blue-600" />
                <span>Premises</span>
              </div>
              <div className="text-sm font-bold text-slate-900 truncate">{record.premisesName}</div>
              <div className="text-[11px] text-slate-500 truncate">{record.premisesAddress}</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Inspecting Officer</span>
              </div>
              <div className="text-sm font-bold text-slate-900">{record.officerName}</div>
              <div className="text-[11px] text-blue-700 font-mono font-semibold">{record.officerId}</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Status</span>
              </div>
              <div className="mt-1">
                <StatusBadge status={record.status} size="md" />
              </div>
            </div>
          </div>

          {/* Officer Findings */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Adjudicated Findings &amp; Officer Determination
            </h2>

            {record.findings.length === 0 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>All evaluated statutory declarations conformed with the Legal Metrology (Packaged Commodities) Rules, 2011.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {record.findings.map((f, idx) => (
                  <div key={f.id} className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">
                        Finding #{idx + 1}: {f.what}
                      </span>
                      <span className="font-mono text-xs text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-semibold">
                        {f.rule}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                      <div>
                        <strong>Package Location:</strong> {f.where}
                      </div>
                      <div>
                        <strong>System Flag Reason:</strong> {f.why}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-xs flex items-center justify-between">
                      <div>
                        <strong>Officer Decision:</strong>{' '}
                        <span className="font-bold text-slate-900">{f.officerDecision}</span>
                        {f.officerComment && (
                          <span className="text-slate-600 ml-2 italic">({f.officerComment})</span>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedCheckId(f.checkId)}
                        className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Evidence</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: DECLARATIONS */}
      {activeTab === 'DECLARATIONS' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200/80">
                <tr>
                  <th className="p-4">Rule Reference</th>
                  <th className="p-4">Statutory Declaration</th>
                  <th className="p-4">Detected Value</th>
                  <th className="p-4">Confidence</th>
                  <th className="p-4">Source Panel</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {record.extractedFields.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 font-mono text-[11px] text-blue-800 font-semibold">{f.legalReference || 'Rule 6(1)'}</td>
                    <td className="p-4 font-bold text-slate-900">{f.label}</td>
                    <td className="p-4 font-mono text-[11px] text-slate-800">{f.value}</td>
                    <td className="p-4 font-medium text-slate-600">{f.confidence}</td>
                    <td className="p-4 text-slate-500">{f.sourcePanel}</td>
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
      )}

      {/* Tab 3: CHECKS */}
      {activeTab === 'CHECKS' && (
        <div className="space-y-3">
          {record.complianceChecks.map((c) => (
            <div
              key={c.id}
              className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <StatusBadge status={c.result} size="sm" />
                  <span className="font-mono text-xs text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">{c.legalReference}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{c.requirementName}</h3>
                <div className="text-xs text-slate-600">
                  Detected: <span className="font-mono text-slate-900 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">{c.detectedInformation}</span>
                </div>
                <p className="text-xs text-slate-500">{c.validationMessage}</p>
              </div>

              <button
                onClick={() => setSelectedCheckId(c.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50 text-xs font-semibold transition shrink-0 self-start md:self-center cursor-pointer shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>View Evidence</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: IMAGES */}
      {activeTab === 'IMAGES' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {record.packageImages.map((img, idx) => (
            <div key={img.id} className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
              <div className="aspect-3/4 bg-slate-950 p-2 flex items-center justify-center">
                <img src={img.imageUrl} alt={img.label} className="w-full h-full object-contain" />
              </div>
              <div className="p-4 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-900">{img.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                  Panel #{idx + 1} • {img.panelType}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Finding Detail Modal */}
      {selectedCheck && (
        <FindingDetailModal
          check={selectedCheck}
          finding={selectedFinding}
          isOpen={Boolean(selectedCheck)}
          onClose={() => setSelectedCheckId(null)}
        />
      )}

      {/* Report Preview Modal */}
      <ReportPreviewModal
        record={record}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
};
