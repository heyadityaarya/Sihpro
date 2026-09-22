import { InspectionRecord } from '../types';

export const reportService = {
  /**
   * Generates a printable version of the inspection report and triggers native browser printing
   */
  printReport(record: InspectionRecord): void {
    window.print();
  },

  /**
   * Formats the report title and timestamp
   */
  getReportHeader(record: InspectionRecord) {
    return {
      department: 'GOVERNMENT OF INDIA',
      ministry: 'MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION',
      division: 'LEGAL METROLOGY ENFORCEMENT DIVISION',
      formTitle: 'PRELIMINARY COMPLIANCE INSPECTION MEMORANDUM',
      subTitle: 'Under Rule 6 & Rule 24 of Legal Metrology (Packaged Commodities) Rules, 2011',
      reportId: record.inspectionNumber,
      generatedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  },
};
