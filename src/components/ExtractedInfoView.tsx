import React, { useState } from 'react';
import {
  FileText,
  Edit3,
  Check,
  X,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import { ExtractedField, PackageImage } from '../types';

interface ExtractedInfoViewProps {
  productName: string;
  brandName: string;
  category: string;
  extractedFields: ExtractedField[];
  images: PackageImage[];
  onUpdateField: (fieldId: string, updatedValue: string) => void;
  onValidate: () => void;
  onViewImage: (imageId: string) => void;
}

export const ExtractedInfoView: React.FC<ExtractedInfoViewProps> = ({
  productName,
  brandName,
  category,
  extractedFields,
  images,
  onUpdateField,
  onValidate,
  onViewImage,
}) => {
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  const startEdit = (field: ExtractedField) => {
    setEditingFieldId(field.id);
    setTempValue(field.value);
  };

  const cancelEdit = () => {
    setEditingFieldId(null);
    setTempValue('');
  };

  const saveEdit = (fieldId: string) => {
    onUpdateField(fieldId, tempValue);
    setEditingFieldId(null);
    setTempValue('');
  };

  const getConfidenceBadge = (confidence: ExtractedField['confidence']) => {
    switch (confidence) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            High Confidence
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Medium Confidence
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Low (Review Advised)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Stage 3: Information Extraction
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {extractedFields.length} Mandatory Declarations Detected
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Extracted Statutory Declarations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Review parsed package text below. You may correct any misread OCR characters before running the Legal Metrology rule engine.
          </p>
        </div>

        <button
          id="btn-run-compliance-validation"
          onClick={onValidate}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs shrink-0 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-blue-200" />
          <span>Run Compliance Validation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Package Header Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
              {brandName || 'Brand Identity'}
            </div>
            <div className="text-base sm:text-lg font-bold text-white tracking-tight">
              {productName}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Commodity Category: <span className="text-slate-200 font-medium">{category}</span>
            </div>
          </div>
        </div>

        {/* Thumbnail previews */}
        <div className="flex items-center gap-2.5 overflow-x-auto py-1">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="relative w-12 h-14 rounded-lg border border-slate-700 overflow-hidden bg-slate-950 shrink-0 shadow-2xs"
              title={img.label}
            >
              <img src={img.imageUrl} alt={img.label} className="w-full h-full object-cover" />
              <span className="absolute bottom-0 inset-x-0 bg-slate-900/90 text-[8px] text-center text-slate-300 font-mono">
                P{idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Extracted Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {extractedFields.map((field) => {
          const isEditing = editingFieldId === field.id;

          return (
            <div
              key={field.id}
              className={`bg-white rounded-2xl border p-5 transition flex flex-col justify-between shadow-2xs ${
                field.isEdited
                  ? 'border-blue-400 bg-blue-50/20 ring-1 ring-blue-400/30'
                  : 'border-slate-200/90 hover:border-blue-300'
              }`}
            >
              <div>
                {/* Header line: label + confidence + rule reference */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      {field.label}
                    </div>
                    {field.legalReference && (
                      <span className="text-[11px] font-mono text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 inline-block mt-1">
                        {field.legalReference}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {getConfidenceBadge(field.confidence)}
                    {field.isEdited && (
                      <span className="text-[10px] font-medium bg-blue-100 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded">
                        Officer Corrected
                      </span>
                    )}
                  </div>
                </div>

                {/* Field Value / Inline Editor */}
                {isEditing ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      rows={3}
                      className="w-full text-xs font-mono p-2.5 border border-blue-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                      placeholder="Enter verified declaration text..."
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={cancelEdit}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(field.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Value</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2.5 bg-slate-50 rounded-xl p-3 border border-slate-200/80 font-mono text-xs text-slate-800 break-words leading-relaxed">
                    {field.value}
                  </div>
                )}
              </div>

              {/* Footer: Source panel and edit trigger */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px] truncate max-w-[200px]" title={field.sourcePanel}>
                  Panel: <strong className="text-slate-700">{field.sourcePanel}</strong>
                </span>

                {!isEditing && (
                  <button
                    onClick={() => startEdit(field)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Value</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom info callout */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          <strong>Inspector Guidance:</strong> All extracted declarations are passed to the automated rule engine next. If a field was not detected due to low lighting or angle, you may edit it manually or let the rule engine tag it as <em>Could Not Verify</em> for on-site physical inspection.
        </p>
      </div>
    </div>
  );
};
