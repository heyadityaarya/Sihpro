import React, { useState, useEffect } from 'react';
import {
  AppView,
  InspectionRecord,
  PackageImage,
  ExtractedField,
  OfficerFinding,
} from './types';
import { CURRENT_OFFICER, DEMO_PRESETS } from './data/mockData';
import { inspectionService } from './services/inspectionService';
import { extractionService } from './services/extractionService';
import { complianceService, ValidationOutput } from './services/complianceService';

// Components
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { NewInspectionView } from './components/NewInspectionView';
import { ImageReviewModal } from './components/ImageReviewModal';
import { ProcessingView } from './components/ProcessingView';
import { ExtractedInfoView } from './components/ExtractedInfoView';
import { ComplianceResultsView } from './components/ComplianceResultsView';
import { OfficerReviewView } from './components/OfficerReviewView';
import { InspectionSummaryView } from './components/InspectionSummaryView';
import { InspectionHistoryView } from './components/InspectionHistoryView';
import { InspectionDetailView } from './components/InspectionDetailView';
import { LegalReferenceView } from './components/LegalReferenceView';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<AppView>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Local storage records
  const [records, setRecords] = useState<InspectionRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  // Active Inspection In-Progress State
  const [activeImages, setActiveImages] = useState<PackageImage[]>([]);
  const [activeMetadata, setActiveMetadata] = useState<{
    premisesName: string;
    premisesAddress: string;
    commodityCategory: string;
    presetHint?: string;
  }>({
    premisesName: 'Om Supermarket & Retail Store',
    premisesAddress: 'Shop 14, Main Market, Connaught Place, New Delhi - 110001',
    commodityCategory: 'Packaged Food & Cereals',
  });

  const [activeInspectionNumber, setActiveInspectionNumber] = useState<string>('');
  const [activeExtractedFields, setActiveExtractedFields] = useState<ExtractedField[]>([]);
  const [activeProductName, setActiveProductName] = useState<string>('');
  const [activeBrandName, setActiveBrandName] = useState<string>('');
  const [activeValidationOutput, setActiveValidationOutput] = useState<ValidationOutput | null>(null);
  const [activeRecord, setActiveRecord] = useState<InspectionRecord | null>(null);

  // Load records on start
  useEffect(() => {
    const loaded = inspectionService.getInspections();
    setRecords(loaded);
  }, []);

  const handleResetData = () => {
    inspectionService.resetToDemoData();
    const loaded = inspectionService.getInspections();
    setRecords(loaded);
    setCurrentView('DASHBOARD');
  };

  // Step 1: Start Inspection from New Inspection View
  const handleStartAnalysis = (
    images: PackageImage[],
    metadata: {
      premisesName: string;
      premisesAddress: string;
      commodityCategory: string;
      presetHint?: string;
    }
  ) => {
    setActiveImages(images);
    setActiveMetadata(metadata);
    setActiveInspectionNumber(inspectionService.generateInspectionNumber());
    // Move to image review / preprocessing
    setCurrentView('IMAGE_REVIEW');
  };

  // Step 2: From Image Preprocessing, proceed to AI Processing pipeline
  const handleProceedToProcessing = () => {
    setCurrentView('PROCESSING');
  };

  // Step 3: When 7-step pipeline finishes, extract declarations and show ExtractedInfoView
  const handleProcessingComplete = async () => {
    const result = await extractionService.extractDeclarationsFromImages(
      activeImages,
      activeMetadata.presetHint
    );
    setActiveExtractedFields(result.extractedFields);
    setActiveProductName(result.productName);
    setActiveBrandName(result.brandName);
    setCurrentView('EXTRACTED_INFO');
  };

  // Allow officer to update an extracted field
  const handleUpdateExtractedField = (fieldId: string, updatedValue: string) => {
    setActiveExtractedFields((prev) =>
      prev.map((f) =>
        f.id === fieldId ? { ...f, value: updatedValue, isEdited: true } : f
      )
    );
  };

  // Step 4: Run Legal Metrology Rule Engine
  const handleRunComplianceEngine = () => {
    const validation = complianceService.evaluateCompliance(
      activeExtractedFields,
      activeImages,
      activeMetadata.commodityCategory
    );
    setActiveValidationOutput(validation);
    setCurrentView('COMPLIANCE_RESULTS');
  };

  // Update finding decision in Officer Review or Findings modal
  const handleUpdateFindingDecision = (
    findingId: string,
    decision: OfficerFinding['officerDecision'],
    comment: string
  ) => {
    if (!activeValidationOutput) return;
    setActiveValidationOutput((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        findings: prev.findings.map((f: OfficerFinding) =>
          f.id === findingId
            ? { ...f, officerDecision: decision, officerComment: comment }
            : f
        ),
      };
    });
  };

  // Step 5: Finalize inspection and construct record
  const handleFinalizeInspection = (officerNotes: string) => {
    const now = new Date();
    if (!activeValidationOutput) return;

    const finalRecord: InspectionRecord = {
      id: `rec-${Date.now()}`,
      inspectionNumber: activeInspectionNumber,
      date: now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      time: now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      officerId: CURRENT_OFFICER.officerId,
      officerName: CURRENT_OFFICER.name,
      officerDesignation: CURRENT_OFFICER.designation,
      premisesName: activeMetadata.premisesName,
      premisesAddress: activeMetadata.premisesAddress,
      commodityCategory: activeMetadata.commodityCategory,
      productName: activeProductName,
      brandName: activeBrandName,
      packageImages: activeImages,
      extractedFields: activeExtractedFields,
      complianceChecks: activeValidationOutput.complianceChecks,
      findings: activeValidationOutput.findings,
      status: activeValidationOutput.overallStatus,
      officerNotes: officerNotes,
      isCompleted: true,
      reportGenerated: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    setActiveRecord(finalRecord);
    inspectionService.saveInspection(finalRecord);
    setRecords(inspectionService.getInspections());
    setCurrentView('INSPECTION_SUMMARY');
  };

  // One-click Preset trigger from Dashboard
  const handleStartWithPreset = (presetId: string) => {
    const preset = DEMO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const presetImages: PackageImage[] = preset.images.map((img, idx) => ({
      id: `img-${Date.now()}-${idx}`,
      panelType: img.panelType,
      label: img.label,
      imageUrl: img.imageUrl,
      rotation: 0,
      isEnhanced: false,
      capturedAt: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));

    handleStartAnalysis(presetImages, {
      premisesName: 'Om Supermarket & Retail Store',
      premisesAddress: 'Connaught Place, New Delhi - 110001',
      commodityCategory: preset.category,
      presetHint: preset.id,
    });
  };

  // Navigate to inspection detail
  const handleSelectRecord = (recordId: string) => {
    setSelectedRecordId(recordId);
    setCurrentView('INSPECTION_DETAIL');
  };

  // Splash Screen
  if (showSplash) {
    return <SplashScreen onEnter={() => setShowSplash(false)} />;
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={() => {
          setIsAuthenticated(true);
        }}
      />
    );
  }

  const selectedRecord = records.find((r) => r.id === selectedRecordId);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onLogout={() => {
          setIsAuthenticated(false);
          setShowSplash(false);
        }}
      />

      {/* Main layout container with Sidebar and Content */}
      <div className="flex-1 flex w-full">
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => {
            setCurrentView(view);
            setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onResetData={handleResetData}
        />

        {/* Content Area */}
        <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
          {/* DASHBOARD VIEW */}
          {currentView === 'DASHBOARD' && (
            <DashboardView
              records={records}
              onNavigate={setCurrentView}
              onSelectRecord={handleSelectRecord}
              onStartWithPreset={handleStartWithPreset}
            />
          )}

          {/* NEW INSPECTION (CAPTURE/UPLOAD) VIEW */}
          {currentView === 'NEW_INSPECTION' && (
            <NewInspectionView onStartAnalysis={handleStartAnalysis} />
          )}

          {/* IMAGE REVIEW & PREPROCESSING VIEW */}
          {currentView === 'IMAGE_REVIEW' && (
            <ImageReviewModal
              images={activeImages}
              onUpdateImage={(id, updates) => {
                setActiveImages((prev) =>
                  prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
                );
              }}
              onRemoveImage={(id) => {
                setActiveImages((prev) => prev.filter((img) => img.id !== id));
              }}
              onAddMore={() => setCurrentView('NEW_INSPECTION')}
              onContinue={handleProceedToProcessing}
              onCancel={() => setCurrentView('NEW_INSPECTION')}
            />
          )}

          {/* PROCESSING 7-STEP PIPELINE VIEW */}
          {currentView === 'PROCESSING' && (
            <ProcessingView onComplete={handleProcessingComplete} />
          )}

          {/* EXTRACTED DECLARATIONS VIEW */}
          {currentView === 'EXTRACTED_INFO' && (
            <ExtractedInfoView
              productName={activeProductName}
              brandName={activeBrandName}
              category={activeMetadata.commodityCategory}
              extractedFields={activeExtractedFields}
              images={activeImages}
              onUpdateField={handleUpdateExtractedField}
              onValidate={handleRunComplianceEngine}
              onViewImage={() => {}}
            />
          )}

          {/* COMPLIANCE RESULTS & INDIVIDUAL CHECKS VIEW */}
          {currentView === 'COMPLIANCE_RESULTS' && activeValidationOutput && (
            <ComplianceResultsView
              overallStatus={activeValidationOutput.overallStatus}
              complianceChecks={activeValidationOutput.complianceChecks}
              findings={activeValidationOutput.findings}
              images={activeImages}
              productName={activeProductName}
              onProceedToReview={() => setCurrentView('OFFICER_REVIEW')}
              onConfirmFinding={(findingId, comment) =>
                handleUpdateFindingDecision(findingId, 'CONFIRMED', comment)
              }
              onDismissFinding={(findingId, comment) =>
                handleUpdateFindingDecision(findingId, 'DISMISSED', comment)
              }
            />
          )}

          {/* OFFICER REVIEW VIEW */}
          {currentView === 'OFFICER_REVIEW' && activeValidationOutput && (
            <OfficerReviewView
              findings={activeValidationOutput.findings}
              checks={activeValidationOutput.complianceChecks}
              images={activeImages}
              productName={activeProductName}
              onUpdateFindingDecision={handleUpdateFindingDecision}
              onCompleteReview={handleFinalizeInspection}
            />
          )}

          {/* INSPECTION SUMMARY VIEW */}
          {currentView === 'INSPECTION_SUMMARY' && activeRecord && (
            <InspectionSummaryView
              record={activeRecord}
              onSaveToHistory={() => {
                inspectionService.saveInspection(activeRecord);
                setRecords(inspectionService.getInspections());
              }}
              onNewInspection={() => setCurrentView('NEW_INSPECTION')}
              onBackToDashboard={() => setCurrentView('DASHBOARD')}
            />
          )}

          {/* INSPECTION HISTORY ARCHIVE */}
          {currentView === 'INSPECTION_HISTORY' && (
            <InspectionHistoryView
              records={records}
              onSelectRecord={handleSelectRecord}
              onNewInspection={() => setCurrentView('NEW_INSPECTION')}
            />
          )}

          {/* DEDICATED INSPECTION DETAIL DOSSIER */}
          {currentView === 'INSPECTION_DETAIL' && selectedRecord && (
            <InspectionDetailView
              record={selectedRecord}
              onBack={() => setCurrentView('INSPECTION_HISTORY')}
            />
          )}

          {/* LEGAL RULES REFERENCE GUIDE */}
          {currentView === 'HELP' && <LegalReferenceView />}
          </div>
        </main>
      </div>
    </div>
  );
}
