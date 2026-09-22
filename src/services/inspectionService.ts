import { CURRENT_OFFICER, INITIAL_INSPECTION_HISTORY } from '../data/mockData';
import { ComplianceStatus, InspectionRecord, OfficerFinding } from '../types';

const STORAGE_KEY = 'sih_legal_metrology_inspections_v1';

export const inspectionService = {
  /**
   * Retrieves all inspection records, initializing from initial mock data if empty.
   */
  getInspections(): InspectionRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INSPECTION_HISTORY));
        return INITIAL_INSPECTION_HISTORY;
      }
      return JSON.parse(data) as InspectionRecord[];
    } catch {
      return INITIAL_INSPECTION_HISTORY;
    }
  },

  /**
   * Retrieves a single inspection by its ID or inspection number.
   */
  getInspectionById(id: string): InspectionRecord | undefined {
    const list = this.getInspections();
    return list.find((item) => item.id === id || item.inspectionNumber === id);
  },

  /**
   * Saves or updates an inspection record in persistent storage.
   */
  saveInspection(record: InspectionRecord): InspectionRecord {
    const list = this.getInspections();
    const index = list.findIndex((item) => item.id === record.id);
    let updatedList: InspectionRecord[];

    const now = new Date().toISOString();
    const recordToSave = {
      ...record,
      updatedAt: now,
    };

    if (index >= 0) {
      updatedList = [...list];
      updatedList[index] = recordToSave;
    } else {
      updatedList = [recordToSave, ...list];
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Storage quota exceeded, keeping in memory', e);
    }
    return recordToSave;
  },

  /**
   * Updates an officer finding verification decision and adds audit remarks.
   */
  updateOfficerFinding(
    inspectionId: string,
    findingId: string,
    decision: OfficerFinding['officerDecision'],
    comment: string
  ): InspectionRecord | undefined {
    const record = this.getInspectionById(inspectionId);
    if (!record) return undefined;

    const updatedFindings = record.findings.map((f) => {
      if (f.id === findingId) {
        return {
          ...f,
          officerDecision: decision,
          officerComment: comment,
          reviewedAt: new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          reviewedBy: CURRENT_OFFICER.name,
        };
      }
      return f;
    });

    // Re-evaluate overall status if all findings were resolved / dismissed
    let newStatus = record.status;
    const remainingPendingOrConfirmed = updatedFindings.filter(
      (f) => f.officerDecision === 'CONFIRMED' || f.officerDecision === 'PENDING'
    );

    if (remainingPendingOrConfirmed.some((f) => f.officerDecision === 'CONFIRMED')) {
      newStatus = 'POTENTIAL_NON_COMPLIANCE';
    } else if (remainingPendingOrConfirmed.length === 0) {
      newStatus = 'PASS';
    }

    const updatedRecord: InspectionRecord = {
      ...record,
      findings: updatedFindings,
      status: newStatus,
    };

    return this.saveInspection(updatedRecord);
  },

  /**
   * Computes key metrics for the enforcement officer dashboard.
   */
  getDashboardStats(): {
    totalInspections: number;
    passed: number;
    requiresReview: number;
    potentialNonCompliance: number;
    couldNotVerify: number;
    notApplicable: number;
  } {
    const list = this.getInspections();
    let passed = 0;
    let requiresReview = 0;
    let potentialNonCompliance = 0;
    let couldNotVerify = 0;
    let notApplicable = 0;

    list.forEach((item) => {
      if (item.status === 'PASS') passed++;
      else if (item.status === 'REQUIRES_REVIEW') requiresReview++;
      else if (item.status === 'POTENTIAL_NON_COMPLIANCE') potentialNonCompliance++;
      else if (item.status === 'COULD_NOT_VERIFY') couldNotVerify++;
      else if (item.status === 'NOT_APPLICABLE') notApplicable++;
    });

    return {
      totalInspections: list.length,
      passed,
      requiresReview,
      potentialNonCompliance,
      couldNotVerify,
      notApplicable,
    };
  },

  /**
   * Resets local storage to clean demonstration data.
   */
  resetToDemoData(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INSPECTION_HISTORY));
  },

  resetToDefaults(): void {
    this.resetToDemoData();
  },

  getAllRecords(): InspectionRecord[] {
    return this.getInspections();
  },

  saveRecord(record: InspectionRecord): InspectionRecord {
    return this.saveInspection(record);
  },

  generateInspectionNumber(): string {
    const list = this.getInspections();
    const nextSeq = 126 + list.length;
    return `SIH-LM-2026-00${nextSeq}`;
  },
};
