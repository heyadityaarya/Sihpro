import React, { useEffect, useState } from 'react';
import {
  UploadCloud,
  FileSearch,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ListFilter,
  FileCheck,
} from 'lucide-react';

interface ProcessingViewProps {
  onComplete: () => void;
}

const PIPELINE_STEPS = [
  {
    id: 1,
    title: 'Image uploaded & normalized',
    description: 'De-skewing and optimizing contrast for label surface',
    icon: UploadCloud,
  },
  {
    id: 2,
    title: 'Reading package declarations',
    description: 'Applying optical character recognition and layout analysis',
    icon: FileSearch,
  },
  {
    id: 3,
    title: 'Extracting statutory declarations',
    description: 'Parsing product name, net quantity, MRP, and addresses',
    icon: Cpu,
  },
  {
    id: 4,
    title: 'Identifying commodity category',
    description: 'Matching schedule standards and packaging size mandates',
    icon: Layers,
  },
  {
    id: 5,
    title: 'Checking applicable requirements',
    description: 'Retrieving statutory rules under LMPC Rules, 2011',
    icon: ListFilter,
  },
  {
    id: 6,
    title: 'Running compliance checks',
    description: 'Executing unit format, tax clause, and helpline validations',
    icon: ShieldCheck,
  },
  {
    id: 7,
    title: 'Preparing evidence & findings',
    description: 'Synthesizing visual bounding boxes for officer review',
    icon: FileCheck,
  },
];

export const ProcessingView: React.FC<ProcessingViewProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(10);

  useEffect(() => {
    const totalSteps = PIPELINE_STEPS.length;
    const stepDuration = 450; // ms per step

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        if (next >= totalSteps) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 350);
          return totalSteps - 1;
        }
        setProgress(Math.round(((next + 1) / totalSteps) * 100));
        return next;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span>AI-Assisted Inspection Pipeline Running</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Analyzing Package Declarations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Extracting statutory declarations and evaluating compliance against Legal Metrology Rules, 2011.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center text-xs font-bold text-slate-900 mb-2">
            <span>Overall Inspection Progress</span>
            <span className="font-mono text-blue-600">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/70 p-0.5">
            <div
              className="h-full bg-blue-600 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Vertical Pipeline Steps */}
        <div className="space-y-3">
          {PIPELINE_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-200 ${
                  isCurrent
                    ? 'bg-blue-50/60 border border-blue-200 ring-2 ring-blue-500/20 shadow-2xs'
                    : isCompleted
                    ? 'bg-slate-50/60 border border-slate-200/70 opacity-90'
                    : 'opacity-40 border border-transparent'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : isCurrent
                      ? 'bg-blue-600 text-white font-bold shadow-xs animate-pulse'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4.5 h-4.5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-bold tracking-tight ${
                        isCurrent ? 'text-slate-900' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
                      Step {step.id} of 7
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer legal disclaimer */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Legal Metrology (Packaged Commodities) Rules, 2011 • Screening assistant generates evidence-backed findings for final human officer verification.
          </p>
        </div>
      </div>
    </div>
  );
};
