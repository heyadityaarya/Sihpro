import React, { useState } from 'react';
import {
  Camera,
  Upload,
  Layers,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  RefreshCw,
  Info,
  Store,
  MapPin,
  Package,
} from 'lucide-react';
import { DEMO_PRESETS } from '../data/mockData';
import { PackageImage } from '../types';
import { CameraModal } from './CameraModal';

interface NewInspectionViewProps {
  onStartAnalysis: (
    images: PackageImage[],
    metadata: {
      premisesName: string;
      premisesAddress: string;
      commodityCategory: string;
      presetHint?: string;
    }
  ) => void;
}

export const NewInspectionView: React.FC<NewInspectionViewProps> = ({ onStartAnalysis }) => {
  const [images, setImages] = useState<PackageImage[]>([]);
  const [premisesName, setPremisesName] = useState<string>('Om Supermarket & Retail Store');
  const [premisesAddress, setPremisesAddress] = useState<string>('Shop 14, Main Market, Connaught Place, New Delhi - 110001');
  const [commodityCategory, setCommodityCategory] = useState<string>('Packaged Food & Cereals');
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string | undefined>(undefined);

  // Load a pre-calibrated sample package for testing
  const handleSelectPreset = (presetId: string) => {
    const preset = DEMO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setActivePresetId(presetId);
    setCommodityCategory(preset.category);

    const loadedImages: PackageImage[] = preset.images.map((img, idx) => ({
      id: `img-${Date.now()}-${idx}`,
      panelType: img.panelType,
      label: img.label,
      imageUrl: img.imageUrl,
      rotation: 0,
      isEnhanced: false,
      capturedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }));

    setImages(loadedImages);
  };

  // Add camera snapshot
  const handleCameraCapture = (dataUrl: string) => {
    const newImg: PackageImage = {
      id: `img-cam-${Date.now()}`,
      panelType: images.length === 0 ? 'FRONT_PANEL' : 'BACK_PANEL',
      label: images.length === 0 ? 'Front Principal Display Panel' : `Panel ${images.length + 1}`,
      imageUrl: dataUrl,
      rotation: 0,
      isEnhanced: false,
      capturedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setImages((prev) => [...prev, newImg]);
    setActivePresetId(undefined);
  };

  // Add file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const newImg: PackageImage = {
            id: `img-file-${Date.now()}-${index}`,
            panelType: images.length + index === 0 ? 'FRONT_PANEL' : 'BACK_PANEL',
            label: images.length + index === 0 ? 'Front Principal Display Panel' : `Panel ${images.length + index + 1}`,
            imageUrl: reader.result,
            rotation: 0,
            isEnhanced: false,
            capturedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          };
          setImages((prev) => [...prev, newImg]);
        }
      };
      reader.readAsDataURL(file);
    });
    setActivePresetId(undefined);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleContinue = () => {
    if (images.length === 0) return;
    onStartAnalysis(images, {
      premisesName,
      premisesAddress,
      commodityCategory,
      presetHint: activePresetId,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Stage 1: Image Capture
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Packaged Commodity Screening
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            New Package Inspection
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Capture package photos directly via camera, upload image files of multiple panels, or load standard test commodities.
          </p>
        </div>

        {images.length > 0 && (
          <button
            id="btn-analyze-package-images"
            onClick={handleContinue}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs shrink-0 cursor-pointer"
          >
            <span>Proceed to Image Preprocessing ({images.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Preset Test Packages Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Pre-Calibrated Test Commodities (One-Click Testing)
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Click any sample commodity below to instantly test different Legal Metrology compliance outcomes:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DEMO_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`text-left p-4 rounded-xl border transition flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 shadow-2xs ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400 truncate">
                      {preset.category}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        preset.status === 'PASS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : preset.status === 'POTENTIAL_NON_COMPLIANCE'
                          ? 'bg-rose-100 text-rose-800'
                          : preset.status === 'REQUIRES_REVIEW'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {preset.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-2">
                    {preset.name}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {preset.summaryDescription}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-semibold text-blue-600">
                  {isSelected ? '✓ Loaded into Inspector' : 'Click to Load Package →'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Camera / Upload Dropzone */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
              Capture or Upload Package Panels
            </h2>

            {/* Action Buttons: Camera vs File Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <button
                id="btn-trigger-camera-modal"
                onClick={() => setIsCameraOpen(true)}
                className="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-400 transition group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                  <Camera className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900">Take Photo with Camera</div>
                  <div className="text-[11px] text-slate-500">Live webcam / rear lens scanner</div>
                </div>
              </button>

              <label className="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-400 transition cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900">Upload Image Files</div>
                  <div className="text-[11px] text-slate-500">JPG, PNG, WEBP (Multiple sides)</div>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Scanned Images Carousel / List */}
            {images.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Selected Package Panels ({images.length})</span>
                  <button
                    onClick={() => setImages([])}
                    className="text-slate-400 hover:text-rose-600 transition text-[11px] font-bold cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={img.id}
                      className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900 aspect-3/4 flex flex-col justify-between p-2 group shadow-2xs"
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.label}
                        className="absolute inset-0 w-full h-full object-contain p-2"
                      />

                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-900/80 text-white border border-white/20 backdrop-blur-xs">
                          Panel {idx + 1}
                        </span>
                        <button
                          onClick={() => removeImage(img.id)}
                          className="p-1 rounded-md bg-rose-600/90 text-white hover:bg-rose-700 transition cursor-pointer"
                          title="Remove image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="relative z-10 bg-slate-900/90 text-[10px] text-white px-2 py-1 rounded-lg truncate backdrop-blur-xs border border-white/10">
                        {img.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50">
                <Package className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-700">No Package Images Captured Yet</div>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                  Take a photo of the principal display panel (front) and the statutory declaration panel (back/side).
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Inspection Premises & Category metadata */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Inspection Context &amp; Premises
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-blue-600" />
                <span>Retail / Premises Name</span>
              </label>
              <input
                type="text"
                value={premisesName}
                onChange={(e) => setPremisesName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                placeholder="E.g. City Supermarket & Retailers"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Shop / Premises Address</span>
              </label>
              <textarea
                value={premisesAddress}
                onChange={(e) => setPremisesAddress(e.target.value)}
                rows={2}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                placeholder="Market address, street, city..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Commodity Category</span>
              </label>
              <select
                value={commodityCategory}
                onChange={(e) => setCommodityCategory(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                <option value="Packaged Food & Cereals">Packaged Food &amp; Cereals (Rule 6)</option>
                <option value="Edible Oils & Fats">Edible Oils &amp; Fats (Dual Vol/Mass)</option>
                <option value="Household Care / Detergents">Household Care / Detergents</option>
                <option value="Cosmetics & Toiletries">Cosmetics &amp; Toiletries</option>
                <option value="General Packaged Commodity">General Packaged Commodity</option>
              </select>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={handleContinue}
                disabled={images.length === 0}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs disabled:opacity-40 cursor-pointer"
              >
                <span>Continue ({images.length} Images)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong>Guidance:</strong> Ensure text on the Maximum Retail Price (MRP) stamp and consumer grievance helpline is in focus to minimize <em>Could Not Verify</em> results.
            </p>
          </div>
        </div>
      </div>

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
};
