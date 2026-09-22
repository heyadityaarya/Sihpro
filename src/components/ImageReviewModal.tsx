import React, { useState } from 'react';
import { RotateCw, Sparkles, Trash2, Check, ArrowRight, Layers } from 'lucide-react';
import { PackageImage } from '../types';

interface ImageReviewModalProps {
  images: PackageImage[];
  onUpdateImage: (id: string, updates: Partial<PackageImage>) => void;
  onRemoveImage: (id: string) => void;
  onAddMore: () => void;
  onContinue: () => void;
  onCancel: () => void;
}

export const ImageReviewModal: React.FC<ImageReviewModalProps> = ({
  images,
  onUpdateImage,
  onRemoveImage,
  onAddMore,
  onContinue,
  onCancel,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const currentImage = images[selectedIndex] || images[0];

  if (!currentImage) {
    return null;
  }

  const handleRotate = () => {
    const nextRotation = ((currentImage.rotation || 0) + 90) % 360;
    onUpdateImage(currentImage.id, { rotation: nextRotation });
  };

  const handleToggleEnhance = () => {
    onUpdateImage(currentImage.id, { isEnhanced: !currentImage.isEnhanced });
  };

  const handlePanelChange = (panelType: PackageImage['panelType'], label: string) => {
    onUpdateImage(currentImage.id, { panelType, label });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Top Header */}
      <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Image Preprocessing &amp; Panel Tagging
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Verify image orientation, enhance OCR contrast, and classify package surfaces.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddMore}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg transition cursor-pointer border border-slate-200"
          >
            + Add Another Side
          </button>
          <button
            onClick={onContinue}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition shadow-xs cursor-pointer"
          >
            <span>Proceed to AI Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-5 sm:p-6">
        {/* Left 2 Cols: Main Image Preview with interactive filters */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center bg-slate-950 rounded-xl p-4 sm:p-8 min-h-[360px] relative overflow-hidden shadow-inner border border-slate-800">
          <div className="relative max-h-[460px] max-w-full flex items-center justify-center">
            <img
              src={currentImage.imageUrl}
              alt={currentImage.label}
              style={{
                transform: `rotate(${currentImage.rotation || 0}deg)`,
                filter: currentImage.isEnhanced ? 'contrast(1.25) brightness(1.05)' : 'none',
              }}
              className="max-h-[420px] w-auto object-contain rounded-lg shadow-2xl transition-all duration-300"
            />
          </div>

          {/* Quick action overlay bar */}
          <div className="mt-4 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-xs text-white shadow-lg">
            <button
              onClick={handleRotate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer text-slate-200 font-semibold"
            >
              <RotateCw className="w-3.5 h-3.5 text-blue-400" />
              <span>Rotate 90°</span>
            </button>

            <button
              onClick={handleToggleEnhance}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                currentImage.isEnhanced
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>{currentImage.isEnhanced ? 'Enhanced' : 'Enhance Text'}</span>
            </button>

            {images.length > 1 && (
              <button
                onClick={() => onRemoveImage(currentImage.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 rounded-lg transition cursor-pointer font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>
        </div>

        {/* Right 1 Col: Panel selector & Thumbnails */}
        <div className="space-y-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Package Side Classification</span>
            </div>

            <div className="space-y-2">
              {[
                {
                  type: 'FRONT_PANEL' as const,
                  label: 'Front Display Panel (PDP)',
                  desc: 'Principal Display: Commodity name, brand, net quantity, logo',
                },
                {
                  type: 'BACK_PANEL' as const,
                  label: 'Back Statutory Declaration Panel',
                  desc: 'Manufacturer address, consumer care cell, ingredients, FSSAI',
                },
                {
                  type: 'SIDE_PANEL' as const,
                  label: 'Side / Flap Panel',
                  desc: 'Storage instructions, handling symbols, batch numbers',
                },
                {
                  type: 'BOTTOM_STAMP' as const,
                  label: 'MRP & Date Stamp Region',
                  desc: 'Maximum Retail Price, Unit Sale Price, packaging date code',
                },
              ].map((panel) => {
                const isSelected = currentImage.panelType === panel.type;
                return (
                  <button
                    key={panel.type}
                    onClick={() => handlePanelChange(panel.type, panel.label)}
                    className={`w-full text-left p-3.5 rounded-xl border transition text-xs cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-950 font-medium shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{panel.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{panel.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thumbnails of multi-panel package */}
          <div>
            <div className="text-xs font-bold text-slate-900 mb-2">
              Scanned Package Panels ({images.length})
            </div>
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                    idx === selectedIndex ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[9px] font-mono font-bold text-slate-200 px-1 py-0.5 truncate text-center">
                    Panel {idx + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
