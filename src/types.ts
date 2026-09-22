export type ComplianceStatus =
  | 'PASS'
  | 'POTENTIAL_NON_COMPLIANCE'
  | 'REQUIRES_REVIEW'
  | 'NOT_APPLICABLE'
  | 'COULD_NOT_VERIFY';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type CheckType =
  | 'PRESENCE'
  | 'FORMAT'
  | 'VALUE'
  | 'CONDITIONAL'
  | 'CROSS_FIELD'
  | 'IMAGE_BASED'
  | 'MANUAL';

export interface BoundingBox {
  x: number; // percentage from left (0 - 100)
  y: number; // percentage from top (0 - 100)
  width: number; // percentage width (0 - 100)
  height: number; // percentage height (0 - 100)
}

export interface ExtractedField {
  id: string;
  fieldKey: string;
  label: string;
  value: string;
  confidence: ConfidenceLevel;
  verificationState: 'DETECTED' | 'UNCERTAIN' | 'NOT_DETECTED' | 'MANUALLY_EDITED' | 'VERIFIED';
  sourceImageId: string;
  sourcePanel: string;
  bbox?: BoundingBox;
  legalReference?: string;
  isEdited?: boolean;
}

export interface ComplianceCheck {
  id: string;
  requirementName: string;
  legalReference: string; // e.g. "Rule 6(1)(e) - LMPC Rules, 2011"
  category: 'MANDATORY_DECLARATION' | 'NUMERICAL_ACCURACY' | 'CONSUMER_RIGHTS' | 'PACKAGING_STANDARDS';
  checkType: CheckType;
  detectedInformation: string;
  validationMessage: string;
  result: ComplianceStatus;
  explanation: string;
  whereFound: string;
  evidenceImage: string;
  evidenceBBox?: BoundingBox;
  requiresOfficerAction: boolean;
}

export interface OfficerFinding {
  id: string;
  checkId: string;
  what: string;
  where: string;
  why: string;
  evidence: string;
  evidenceBBox?: BoundingBox;
  rule: string;
  severity: 'CRITICAL' | 'MODERATE' | 'ADVISORY';
  officerDecision: 'PENDING' | 'CONFIRMED' | 'RESOLVED' | 'DISMISSED' | 'OVERRIDDEN';
  officerComment?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface PackageImage {
  id: string;
  panelType: 'FRONT_PANEL' | 'BACK_PANEL' | 'SIDE_PANEL' | 'BOTTOM_STAMP' | 'OTHER';
  label: string;
  imageUrl: string;
  rotation: number;
  isEnhanced: boolean;
  capturedAt: string;
}

export interface InspectionRecord {
  id: string;
  inspectionNumber: string;
  date: string;
  time: string;
  productName: string;
  brandName: string;
  commodityCategory: string;
  premisesName: string;
  premisesAddress: string;
  officerId: string;
  officerName: string;
  officerDesignation: string;
  status: ComplianceStatus;
  packageImages: PackageImage[];
  extractedFields: ExtractedField[];
  complianceChecks: ComplianceCheck[];
  findings: OfficerFinding[];
  officerNotes?: string;
  isCompleted: boolean;
  reportGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OfficerUser {
  id: string;
  officerId: string;
  name: string;
  designation: string;
  jurisdiction: string;
  badgeNumber: string;
  avatarUrl?: string;
}

export type AppView =
  | 'SPLASH'
  | 'LOGIN'
  | 'DASHBOARD'
  | 'NEW_INSPECTION'
  | 'IMAGE_REVIEW'
  | 'PROCESSING'
  | 'EXTRACTED_INFO'
  | 'COMPLIANCE_RESULTS'
  | 'OFFICER_REVIEW'
  | 'INSPECTION_SUMMARY'
  | 'INSPECTION_HISTORY'
  | 'INSPECTION_DETAIL'
  | 'REPORT_PREVIEW'
  | 'HELP';
