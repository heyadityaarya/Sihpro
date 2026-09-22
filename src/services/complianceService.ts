import { ComplianceCheck, ComplianceStatus, ExtractedField, OfficerFinding, PackageImage } from '../types';

export interface ValidationOutput {
  overallStatus: ComplianceStatus;
  complianceChecks: ComplianceCheck[];
  findings: OfficerFinding[];
  summaryCounts: {
    pass: number;
    potentialNonCompliance: number;
    requiresReview: number;
    notApplicable: number;
    couldNotVerify: number;
  };
}

export const complianceService = {
  /**
   * Evaluates extracted declarations against Legal Metrology (Packaged Commodities) Rules, 2011.
   * Produces evidence-backed checks without computing arbitrary compliance percentages.
   */
  evaluateCompliance(
    fields: ExtractedField[],
    images: PackageImage[],
    category: string = 'General Packaged Commodity'
  ): ValidationOutput {
    const checks: ComplianceCheck[] = [];
    const findings: OfficerFinding[] = [];

    const fieldMap = new Map<string, ExtractedField>();
    fields.forEach((f) => fieldMap.set(f.fieldKey, f));

    const defaultImg = images[0]?.imageUrl || '';

    // 1. Rule 6(1)(a): Product Name / Generic Description
    const nameField = fieldMap.get('product_name');
    if (nameField && nameField.value.trim().length > 3) {
      checks.push({
        id: `chk-rule-6-1-a-${Date.now()}`,
        requirementName: 'Generic Description / Name of Commodity',
        legalReference: 'Rule 6(1)(a) - LMPC Rules, 2011',
        category: 'MANDATORY_DECLARATION',
        checkType: 'PRESENCE',
        detectedInformation: nameField.value,
        validationMessage: 'Common or generic name clearly declared on principal display panel.',
        result: 'PASS',
        explanation: 'The commodity name is conspicuously declared in appropriate lettering.',
        whereFound: nameField.sourcePanel || 'Principal Display Panel',
        evidenceImage: defaultImg,
        evidenceBBox: nameField.bbox,
        requiresOfficerAction: false,
      });
    } else {
      const isLowConf = nameField?.confidence === 'LOW';
      const status: ComplianceStatus = isLowConf ? 'COULD_NOT_VERIFY' : 'POTENTIAL_NON_COMPLIANCE';
      const chkId = `chk-rule-6-1-a-${Date.now()}`;
      checks.push({
        id: chkId,
        requirementName: 'Generic Description / Name of Commodity',
        legalReference: 'Rule 6(1)(a) - LMPC Rules, 2011',
        category: 'MANDATORY_DECLARATION',
        checkType: 'PRESENCE',
        detectedInformation: nameField?.value || 'Not detected on scanned package surfaces',
        validationMessage: isLowConf
          ? 'Image resolution insufficient to resolve generic commodity name.'
          : 'Generic or common name of commodity not declared conspicuously.',
        result: status,
        explanation: 'Rule 6(1)(a) mandates the generic name so consumers understand contents.',
        whereFound: 'Principal Display Panel',
        evidenceImage: defaultImg,
        evidenceBBox: nameField?.bbox,
        requiresOfficerAction: true,
      });

      findings.push({
        id: `fnd-6-1-a-${Date.now()}`,
        checkId: chkId,
        what: 'Generic description of commodity missing or unreadable',
        where: 'Principal Display Panel',
        why: isLowConf
          ? 'OCR confidence is low; officer physical check needed.'
          : 'Package does not state the common generic identity of the goods.',
        evidence: defaultImg,
        evidenceBBox: nameField?.bbox,
        rule: 'Rule 6(1)(a) of Legal Metrology (Packaged Commodities) Rules, 2011',
        severity: 'CRITICAL',
        officerDecision: 'PENDING',
      });
    }

    // 2. Rule 6(1)(b): Manufacturer / Packer / Importer Name & Address
    const mfgField = fieldMap.get('manufacturer_name_address') || fieldMap.get('packer_importer_address');
    if (mfgField) {
      const hasPinOrCity = /\b(\d{6}|[A-Za-z]+,\s*[A-Za-z]+)\b/.test(mfgField.value);
      const isUnreadable = mfgField.value.toLowerCase().includes('unreadable') || mfgField.confidence === 'LOW';

      if (isUnreadable) {
        const chkId = `chk-rule-6-1-b-${Date.now()}`;
        checks.push({
          id: chkId,
          requirementName: 'Manufacturer / Packer Name & Complete Postal Address',
          legalReference: 'Rule 6(1)(b) - LMPC Rules, 2011',
          category: 'MANDATORY_DECLARATION',
          checkType: 'PRESENCE',
          detectedInformation: mfgField.value,
          validationMessage: 'Postal address detected with low optical clarity or partial occlusion.',
          result: 'COULD_NOT_VERIFY',
          explanation: 'Address text could not be verified with high confidence. Human officer inspection needed.',
          whereFound: mfgField.sourcePanel || 'Statutory Panel',
          evidenceImage: images[1]?.imageUrl || defaultImg,
          evidenceBBox: mfgField.bbox,
          requiresOfficerAction: true,
        });

        findings.push({
          id: `fnd-6-1-b-${Date.now()}`,
          checkId: chkId,
          what: 'Manufacturer / Packer address requires physical verification',
          where: mfgField.sourcePanel,
          why: 'Optical recognition encountered glare, font degradation, or smudging.',
          evidence: images[1]?.imageUrl || defaultImg,
          evidenceBBox: mfgField.bbox,
          rule: 'Rule 6(1)(b) of Legal Metrology (Packaged Commodities) Rules, 2011',
          severity: 'MODERATE',
          officerDecision: 'PENDING',
        });
      } else if (hasPinOrCity) {
        checks.push({
          id: `chk-rule-6-1-b-${Date.now()}`,
          requirementName: 'Manufacturer / Packer Name & Complete Postal Address',
          legalReference: 'Rule 6(1)(b) - LMPC Rules, 2011',
          category: 'MANDATORY_DECLARATION',
          checkType: 'PRESENCE',
          detectedInformation: mfgField.value,
          validationMessage: 'Complete corporate identification and postal address detected.',
          result: 'PASS',
          explanation: 'Meets requirements enabling consumer outreach and legal identification.',
          whereFound: mfgField.sourcePanel,
          evidenceImage: images[1]?.imageUrl || defaultImg,
          evidenceBBox: mfgField.bbox,
          requiresOfficerAction: false,
        });
      } else {
        const chkId = `chk-rule-6-1-b-${Date.now()}`;
        checks.push({
          id: chkId,
          requirementName: 'Manufacturer / Packer Name & Complete Postal Address',
          legalReference: 'Rule 6(1)(b) - LMPC Rules, 2011',
          category: 'MANDATORY_DECLARATION',
          checkType: 'FORMAT',
          detectedInformation: mfgField.value,
          validationMessage: 'Postal PIN code or full municipal address appears incomplete.',
          result: 'REQUIRES_REVIEW',
          explanation: 'Address lacks postal code or street details required for complete legal location.',
          whereFound: mfgField.sourcePanel,
          evidenceImage: images[1]?.imageUrl || defaultImg,
          evidenceBBox: mfgField.bbox,
          requiresOfficerAction: true,
        });
      }
    }

    // 3. Rule 6(1)(c) & Rule 13: Net Quantity & Unit Symbol
    const netQtyField = fieldMap.get('net_quantity');
    if (netQtyField) {
      const val = netQtyField.value;
      const hasUnit = /\b(g|kg|ml|l|m|cm|mm|n|units|pcs|tablets)\b/i.test(val);
      const isMissingUnit = val.includes('NO METRIC UNIT') || val.includes('missing') || !hasUnit;

      if (isMissingUnit) {
        const chkId = `chk-rule-6-1-c-${Date.now()}`;
        checks.push({
          id: chkId,
          requirementName: 'Standard Unit of Mass / Volume in Net Quantity',
          legalReference: 'Rule 6(1)(c) read with Rule 13 - LMPC Rules, 2011',
          category: 'NUMERICAL_ACCURACY',
          checkType: 'FORMAT',
          detectedInformation: val,
          validationMessage: 'Numerical quantity declared without permissible metric symbol (g, kg, ml, L).',
          result: 'POTENTIAL_NON_COMPLIANCE',
          explanation: 'Rule 13 explicitly prohibits bare numerical representations without legal units of weight or measure.',
          whereFound: netQtyField.sourcePanel,
          evidenceImage: defaultImg,
          evidenceBBox: netQtyField.bbox,
          requiresOfficerAction: true,
        });

        findings.push({
          id: `fnd-6-1-c-${Date.now()}`,
          checkId: chkId,
          what: 'Missing standard metric unit symbol in Net Quantity declaration',
          where: `${netQtyField.sourcePanel}: "${val}"`,
          why: 'Section 18 of the Legal Metrology Act and Rule 13 mandate standardized SI symbols to prevent consumer deception.',
          evidence: defaultImg,
          evidenceBBox: netQtyField.bbox,
          rule: 'Rule 6(1)(c) & Rule 13 of Legal Metrology (Packaged Commodities) Rules, 2011',
          severity: 'CRITICAL',
          officerDecision: 'PENDING',
        });
      } else {
        checks.push({
          id: `chk-rule-6-1-c-${Date.now()}`,
          requirementName: 'Standard Unit of Mass / Volume in Net Quantity',
          legalReference: 'Rule 6(1)(c) read with Rule 13 - LMPC Rules, 2011',
          category: 'NUMERICAL_ACCURACY',
          checkType: 'FORMAT',
          detectedInformation: val,
          validationMessage: 'Expressed in permissible metric units with compliant typography.',
          result: 'PASS',
          explanation: 'Net quantity conforms with standardized legal metrology measurement units.',
          whereFound: netQtyField.sourcePanel,
          evidenceImage: defaultImg,
          evidenceBBox: netQtyField.bbox,
          requiresOfficerAction: false,
        });
      }
    }

    // 4. Rule 6(1)(e) & Rule 6(11): MRP & Unit Sale Price
    const mrpField = fieldMap.get('mrp');
    if (mrpField) {
      const val = mrpField.value;
      const hasTaxInclusive = /incl|all taxes|taxes/i.test(val);
      const isMissingUSP = val.includes('USP NOT') || val.includes('Missing');

      if (isMissingUSP) {
        const chkId = `chk-rule-6-1-e-${Date.now()}`;
        checks.push({
          id: chkId,
          requirementName: 'Unit Sale Price (USP) Declaration',
          legalReference: 'Rule 6(11) - LMPC Rules, 2011',
          category: 'CONSUMER_RIGHTS',
          checkType: 'PRESENCE',
          detectedInformation: val,
          validationMessage: 'Mandatory Unit Sale Price (e.g. ₹/g, ₹/kg, ₹/ml) is absent.',
          result: 'POTENTIAL_NON_COMPLIANCE',
          explanation: 'Packages with quantity other than standard 1kg/1L must declare per-unit sale price to empower consumer comparison.',
          whereFound: mrpField.sourcePanel,
          evidenceImage: defaultImg,
          evidenceBBox: mrpField.bbox,
          requiresOfficerAction: true,
        });

        findings.push({
          id: `fnd-6-1-e-${Date.now()}`,
          checkId: chkId,
          what: 'Absence of mandatory Unit Sale Price declaration',
          where: mrpField.sourcePanel,
          why: 'Rule 6(11) requires dual declaration of total retail price and unit sale price.',
          evidence: defaultImg,
          evidenceBBox: mrpField.bbox,
          rule: 'Rule 6(11) of Legal Metrology (Packaged Commodities) Rules, 2011',
          severity: 'CRITICAL',
          officerDecision: 'PENDING',
        });
      } else {
        checks.push({
          id: `chk-rule-6-1-e-${Date.now()}`,
          requirementName: 'MRP with "Inclusive of all taxes" & USP',
          legalReference: 'Rule 6(1)(e) & Rule 6(11) - LMPC Rules, 2011',
          category: 'CONSUMER_RIGHTS',
          checkType: 'FORMAT',
          detectedInformation: val,
          validationMessage: hasTaxInclusive
            ? 'Retail price properly formatted in INR with inclusive tax clause.'
            : 'Price detected; officer should verify inclusion of "Incl. of all taxes" phrase.',
          result: hasTaxInclusive ? 'PASS' : 'REQUIRES_REVIEW',
          explanation: 'Complies with mandatory retail sale price provisions.',
          whereFound: mrpField.sourcePanel,
          evidenceImage: defaultImg,
          evidenceBBox: mrpField.bbox,
          requiresOfficerAction: !hasTaxInclusive,
        });
      }
    }

    // 5. Rule 6(1)(f): Consumer Complaints / Helpline Details
    const careField = fieldMap.get('consumer_care');
    if (careField) {
      const val = careField.value;
      const isMissingHelpline =
        val.includes('NO PHONE') || val.includes('NOT DETECTED') || val.includes('unverified');

      if (isMissingHelpline) {
        const chkId = `chk-rule-6-1-f-${Date.now()}`;
        checks.push({
          id: chkId,
          requirementName: 'Consumer Care Contact Details (Phone Helpline & Email)',
          legalReference: 'Rule 6(1)(f) - LMPC Rules, 2011',
          category: 'CONSUMER_RIGHTS',
          checkType: 'PRESENCE',
          detectedInformation: val,
          validationMessage: 'Telephone helpline number or official email for grievance redressal appears absent.',
          result: 'POTENTIAL_NON_COMPLIANCE',
          explanation: 'Rule 6(1)(f) explicitly requires the name, address, telephone number and email of person or office to contact in case of consumer complaints.',
          whereFound: careField.sourcePanel,
          evidenceImage: images[1]?.imageUrl || defaultImg,
          evidenceBBox: careField.bbox,
          requiresOfficerAction: true,
        });

        findings.push({
          id: `fnd-6-1-f-${Date.now()}`,
          checkId: chkId,
          what: 'Incomplete Consumer Care details (Telephone Helpline or Email absent)',
          where: careField.sourcePanel,
          why: 'The statutory notice must provide telephone and electronic contact to facilitate direct consumer dispute resolution.',
          evidence: images[1]?.imageUrl || defaultImg,
          evidenceBBox: careField.bbox,
          rule: 'Rule 6(1)(f) of Legal Metrology (Packaged Commodities) Rules, 2011',
          severity: 'CRITICAL',
          officerDecision: 'PENDING',
        });
      } else {
        checks.push({
          id: `chk-rule-6-1-f-${Date.now()}`,
          requirementName: 'Consumer Care Contact Details',
          legalReference: 'Rule 6(1)(f) - LMPC Rules, 2011',
          category: 'CONSUMER_RIGHTS',
          checkType: 'PRESENCE',
          detectedInformation: val,
          validationMessage: 'Consumer helpline telephone, email, and designated grievance address detected.',
          result: 'PASS',
          explanation: 'Full consumer dispute grievance mechanism declared on package.',
          whereFound: careField.sourcePanel,
          evidenceImage: defaultImg,
          evidenceBBox: careField.bbox,
          requiresOfficerAction: false,
        });
      }
    }

    // 6. Rule 6(1)(d): Month & Year of Manufacture / Packaging
    const dateField = fieldMap.get('date_of_manufacture');
    if (dateField) {
      checks.push({
        id: `chk-rule-6-1-d-${Date.now()}`,
        requirementName: 'Month & Year of Manufacture or Packaging',
        legalReference: 'Rule 6(1)(d) - LMPC Rules, 2011',
        category: 'MANDATORY_DECLARATION',
        checkType: 'FORMAT',
        detectedInformation: dateField.value,
        validationMessage: 'Date stamp detected on package surface.',
        result: 'PASS',
        explanation: 'Declaration specifies date of packing or manufacture.',
        whereFound: dateField.sourcePanel,
        evidenceImage: images[1]?.imageUrl || defaultImg,
        evidenceBBox: dateField.bbox,
        requiresOfficerAction: false,
      });
    }

    // 7. Rule 6(1)(g): Country of Origin
    const originField = fieldMap.get('country_of_origin');
    if (originField) {
      const isAbsent = originField.value.includes('NOT DETECTED') || originField.verificationState === 'NOT_DETECTED';
      if (isAbsent) {
        const chkId = `chk-rule-6-1-g-${Date.now()}`;
        checks.push({
          id: chkId,
          requirementName: 'Country of Origin Declaration',
          legalReference: 'Rule 6(1)(g) - LMPC Rules, 2011',
          category: 'MANDATORY_DECLARATION',
          checkType: 'PRESENCE',
          detectedInformation: 'Not detected on current scanned images',
          validationMessage: 'Country of Origin declaration not found on scanned panels.',
          result: 'REQUIRES_REVIEW',
          explanation: 'Failure to detect does NOT prove absence. Officer physical review recommended.',
          whereFound: 'All Panels',
          evidenceImage: defaultImg,
          requiresOfficerAction: true,
        });

        findings.push({
          id: `fnd-6-1-g-${Date.now()}`,
          checkId: chkId,
          what: 'Country of Origin declaration requires verification',
          where: 'Carton panels',
          why: 'Computer vision could not identify the country of manufacture.',
          evidence: defaultImg,
          rule: 'Rule 6(1)(g) of Legal Metrology (Packaged Commodities) Rules, 2011',
          severity: 'MODERATE',
          officerDecision: 'PENDING',
        });
      } else {
        checks.push({
          id: `chk-rule-6-1-g-${Date.now()}`,
          requirementName: 'Country of Origin Declaration',
          legalReference: 'Rule 6(1)(g) - LMPC Rules, 2011',
          category: 'MANDATORY_DECLARATION',
          checkType: 'PRESENCE',
          detectedInformation: originField.value,
          validationMessage: `Declared origin: ${originField.value}`,
          result: 'PASS',
          explanation: 'Complies with mandatory origin declaration.',
          whereFound: originField.sourcePanel,
          evidenceImage: images[1]?.imageUrl || defaultImg,
          evidenceBBox: originField.bbox,
          requiresOfficerAction: false,
        });
      }
    }

    // Count states
    let pass = 0;
    let potentialNonCompliance = 0;
    let requiresReview = 0;
    let notApplicable = 0;
    let couldNotVerify = 0;

    checks.forEach((c) => {
      if (c.result === 'PASS') pass++;
      else if (c.result === 'POTENTIAL_NON_COMPLIANCE') potentialNonCompliance++;
      else if (c.result === 'REQUIRES_REVIEW') requiresReview++;
      else if (c.result === 'NOT_APPLICABLE') notApplicable++;
      else if (c.result === 'COULD_NOT_VERIFY') couldNotVerify++;
    });

    // Derive overall status: Strict priority order
    // POTENTIAL_NON_COMPLIANCE > REQUIRES_REVIEW > COULD_NOT_VERIFY > PASS
    let overallStatus: ComplianceStatus = 'PASS';
    if (potentialNonCompliance > 0) {
      overallStatus = 'POTENTIAL_NON_COMPLIANCE';
    } else if (requiresReview > 0) {
      overallStatus = 'REQUIRES_REVIEW';
    } else if (couldNotVerify > 0) {
      overallStatus = 'COULD_NOT_VERIFY';
    } else {
      overallStatus = 'PASS';
    }

    return {
      overallStatus,
      complianceChecks: checks,
      findings,
      summaryCounts: {
        pass,
        potentialNonCompliance,
        requiresReview,
        notApplicable,
        couldNotVerify,
      },
    };
  },
};
