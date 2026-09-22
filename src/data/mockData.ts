import { ComplianceCheck, ExtractedField, InspectionRecord, OfficerFinding, PackageImage } from '../types';

// Helper to generate clean SVG data URLs for realistic packaged commodity labels
export function generatePackageSvgDataUrl(
  title: string,
  variant: 'noodles' | 'oil' | 'detergent' | 'cream' | 'tea',
  panel: 'front' | 'back' | 'side'
): string {
  const width = 600;
  const height = 800;

  let bgGradient = '<rect width="100%" height="100%" fill="#f8fafc" />';
  let content = '';

  if (variant === 'noodles') {
    if (panel === 'front') {
      bgGradient = `
        <defs>
          <linearGradient id="noodFront" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ea580c"/>
            <stop offset="100%" stop-color="#c2410c"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" rx="16" fill="url(#noodFront)"/>
      `;
      content = `
        <rect x="40" y="40" width="520" height="720" rx="12" fill="#ffffff" opacity="0.96"/>
        <text x="300" y="110" font-family="sans-serif" font-size="28" font-weight="bold" fill="#9a3412" text-anchor="middle">TASTY CRUNCH FOODS</text>
        <text x="300" y="150" font-family="sans-serif" font-size="34" font-weight="900" fill="#1e293b" text-anchor="middle">MASALA MAGIC NOODLES</text>
        <rect x="220" y="170" width="160" height="32" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
        <text x="300" y="192" font-family="sans-serif" font-size="14" font-weight="bold" fill="#b45309" text-anchor="middle">Instant Wheat Noodles</text>
        
        <!-- Imagery container -->
        <rect x="70" y="230" width="460" height="260" rx="12" fill="#fed7aa" stroke="#fb923c" stroke-width="2"/>
        <circle cx="300" cy="360" r="90" fill="#ea580c" opacity="0.8"/>
        <circle cx="300" cy="360" r="70" fill="#fef08a"/>
        <text x="300" y="368" font-family="sans-serif" font-size="20" font-weight="bold" fill="#78350f" text-anchor="middle">DELICIOUS SPICES</text>

        <!-- Front declarations -->
        <rect x="70" y="520" width="460" height="190" rx="8" fill="#f1f5f9" stroke="#cbd5e1"/>
        <text x="90" y="555" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">NET QUANTITY: 70 g</text>
        <text x="90" y="590" font-family="sans-serif" font-size="18" font-weight="bold" fill="#0f172a">MRP: ₹ 14.00 (Incl. of all taxes)</text>
        <text x="90" y="620" font-family="sans-serif" font-size="13" fill="#334155">Unit Sale Price: ₹ 0.20 / g</text>
        <text x="90" y="650" font-family="sans-serif" font-size="13" fill="#334155">Mfg Date: 12/08/2026</text>
        <text x="90" y="680" font-family="sans-serif" font-size="12" fill="#64748b">See back panel for complete statutory declarations</text>
      `;
    } else {
      // back panel
      bgGradient = `
        <rect width="100%" height="100%" rx="16" fill="#f8fafc" stroke="#94a3b8" stroke-width="3"/>
      `;
      content = `
        <rect x="30" y="30" width="540" height="740" fill="#ffffff" rx="8"/>
        <text x="50" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">MANDATORY DECLARATIONS (LMPC Rules 2011)</text>
        <line x1="50" y1="85" x2="550" y2="85" stroke="#cbd5e1" stroke-width="2"/>

        <!-- Box 1: Mfg Info -->
        <rect x="50" y="105" width="500" height="120" fill="#f8fafc" stroke="#e2e8f0" rx="6"/>
        <text x="65" y="130" font-family="sans-serif" font-size="13" font-weight="bold" fill="#334155">Manufactured &amp; Packed by:</text>
        <text x="65" y="152" font-family="sans-serif" font-size="13" fill="#0f172a">Tasty Crunch Foods India Pvt. Ltd.</text>
        <text x="65" y="172" font-family="sans-serif" font-size="12" fill="#475569">Plot No. 42-B, Industrial Area Phase II, Sonipat, Haryana - 131001</text>
        <text x="65" y="195" font-family="sans-serif" font-size="12" fill="#475569">FSSAI Lic. No. 10018021004523</text>

        <!-- Box 2: Consumer Care (DEFICIENT IN SAMPLE 1) -->
        <rect x="50" y="240" width="500" height="110" fill="#fef2f2" stroke="#fca5a5" stroke-width="1.5" rx="6"/>
        <text x="65" y="265" font-family="sans-serif" font-size="13" font-weight="bold" fill="#991b1b">FOR CONSUMER COMPLAINTS / FEEDBACK:</text>
        <text x="65" y="288" font-family="sans-serif" font-size="12" fill="#7f1d1d">Write to Manager, Consumer Care at above manufacturer address</text>
        <text x="65" y="310" font-family="sans-serif" font-size="12" fill="#dc2626" font-weight="bold">[NOTE: Telephone Helpline &amp; Email ID are missing]</text>

        <!-- Box 3: Net Qty, MRP, Batch -->
        <rect x="50" y="365" width="500" height="130" fill="#f8fafc" stroke="#e2e8f0" rx="6"/>
        <text x="65" y="392" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Net Quantity: 70 g</text>
        <text x="65" y="418" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0f172a">Maximum Retail Price (MRP): ₹ 14.00 (Incl. of all taxes)</text>
        <text x="65" y="442" font-family="sans-serif" font-size="13" fill="#475569">USP: ₹ 0.20 / g</text>
        <text x="65" y="468" font-family="sans-serif" font-size="12" fill="#64748b">Batch No: TC-2608 | Pkd: 12/08/2026 | Best Before 9 Months</text>

        <!-- Barcode -->
        <rect x="50" y="510" width="220" height="80" fill="#ffffff" stroke="#94a3b8"/>
        <text x="160" y="555" font-family="monospace" font-size="14" fill="#0f172a" text-anchor="middle">|||| | ||||| ||| ||||</text>
        <text x="160" y="575" font-family="monospace" font-size="11" fill="#475569" text-anchor="middle">8901234567890</text>

        <!-- Generic / Country of Origin -->
        <rect x="290" y="510" width="260" height="80" fill="#f8fafc" stroke="#e2e8f0" rx="6"/>
        <text x="305" y="535" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155">Country of Origin: INDIA</text>
        <text x="305" y="558" font-family="sans-serif" font-size="12" fill="#475569">Vegetarian Commodity [Green Logo]</text>
        <circle cx="510" cy="545" r="14" fill="#ffffff" stroke="#15803d" stroke-width="2"/>
        <circle cx="510" cy="545" r="7" fill="#15803d"/>
      `;
    }
  } else if (variant === 'oil') {
    bgGradient = `
      <rect width="100%" height="100%" rx="16" fill="#fffbeb" stroke="#d97706" stroke-width="3"/>
    `;
    content = `
      <rect x="30" y="30" width="540" height="740" fill="#ffffff" rx="8"/>
      <text x="300" y="80" font-family="sans-serif" font-size="26" font-weight="900" fill="#b45309" text-anchor="middle">GOLDEN HARVEST AGRO</text>
      <text x="300" y="115" font-family="sans-serif" font-size="20" font-weight="bold" fill="#1e293b" text-anchor="middle">REFINED SUNFLOWER OIL</text>
      <text x="300" y="135" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="middle">100% Pure &amp; Healthy Cooking Medium</text>
      
      <rect x="50" y="160" width="500" height="180" fill="#fef3c7" stroke="#f59e0b" rx="8"/>
      <text x="70" y="195" font-family="sans-serif" font-size="16" font-weight="bold" fill="#92400e">STATUTORY DECLARATION UNDER RULE 6(1)</text>
      <text x="70" y="225" font-family="sans-serif" font-size="18" font-weight="900" fill="#1e293b">Net Volume: 1 L (1000 ml) / 910 g</text>
      <text x="70" y="255" font-family="sans-serif" font-size="18" font-weight="900" fill="#1e293b">MRP: ₹ 165.00 (Incl. of all taxes)</text>
      <text x="70" y="285" font-family="sans-serif" font-size="14" fill="#78350f">Unit Sale Price (USP): ₹ 165.00 / L</text>
      <text x="70" y="315" font-family="sans-serif" font-size="13" fill="#78350f">Date of Packaging: 15/09/2026 | Expiry: 9 Months from PKD</text>

      <rect x="50" y="360" width="500" height="150" fill="#f8fafc" stroke="#cbd5e1" rx="8"/>
      <text x="70" y="390" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Manufacturer &amp; Packer Details:</text>
      <text x="70" y="415" font-family="sans-serif" font-size="13" fill="#334155">Golden Harvest Agro Products Ltd.</text>
      <text x="70" y="438" font-family="sans-serif" font-size="12" fill="#475569">Survey 108, Khed SEZ, Pune, Maharashtra - 410501</text>
      <text x="70" y="460" font-family="sans-serif" font-size="12" fill="#475569">Country of Origin: India | FSSAI: 11516038000291</text>

      <rect x="50" y="530" width="500" height="120" fill="#ecfdf5" stroke="#10b981" rx="8"/>
      <text x="70" y="560" font-family="sans-serif" font-size="14" font-weight="bold" fill="#065f46">Consumer Care Cell:</text>
      <text x="70" y="585" font-family="sans-serif" font-size="13" fill="#047857">Toll-Free Helpline: 1800-222-7890 (Mon-Sat 9AM-6PM)</text>
      <text x="70" y="608" font-family="sans-serif" font-size="13" fill="#047857">Email: customercare@goldenharvestagro.com</text>
      <text x="70" y="630" font-family="sans-serif" font-size="12" fill="#059669">Manager, Grievance Officer, Golden Harvest Agro, Pune 410501</text>
    `;
  } else if (variant === 'detergent') {
    bgGradient = `
      <rect width="100%" height="100%" rx="16" fill="#eff6ff" stroke="#3b82f6" stroke-width="3"/>
    `;
    content = `
      <rect x="30" y="30" width="540" height="740" fill="#ffffff" rx="8"/>
      <text x="300" y="80" font-family="sans-serif" font-size="28" font-weight="900" fill="#1d4ed8" text-anchor="middle">SPARKLE ACTIVE</text>
      <text x="300" y="115" font-family="sans-serif" font-size="20" font-weight="bold" fill="#1e293b" text-anchor="middle">PREMIUM DETERGENT POWDER</text>

      <rect x="50" y="150" width="500" height="170" fill="#fee2e2" stroke="#ef4444" stroke-width="2" rx="8"/>
      <text x="70" y="180" font-family="sans-serif" font-size="14" font-weight="bold" fill="#991b1b">QUANTITY DECLARATION ISSUE (NON-COMPLIANT):</text>
      <text x="70" y="210" font-family="sans-serif" font-size="22" font-weight="900" fill="#b91c1c">Net Qty: 450</text>
      <text x="70" y="235" font-family="sans-serif" font-size="13" fill="#7f1d1d">[Missing standard unit of mass 'g' or 'kg' under Rule 13]</text>
      <text x="70" y="265" font-family="sans-serif" font-size="18" font-weight="bold" fill="#1e293b">MRP: Rs. 65</text>
      <text x="70" y="290" font-family="sans-serif" font-size="13" fill="#7f1d1d">[Unit Sale Price NOT declared as required for multi-quantity items]</text>

      <rect x="50" y="340" width="500" height="150" fill="#f8fafc" stroke="#cbd5e1" rx="8"/>
      <text x="70" y="370" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Manufacturer Details:</text>
      <text x="70" y="395" font-family="sans-serif" font-size="13" fill="#334155">Sparkle Chemical Industries Ltd.</text>
      <text x="70" y="418" font-family="sans-serif" font-size="12" fill="#475569">GIDC Estate, Phase IV, Vapi, Gujarat - 396195</text>
      <text x="70" y="440" font-family="sans-serif" font-size="12" fill="#475569">Customer Care: 1800-456-1122 | care@sparkleactive.in</text>

      <rect x="50" y="510" width="500" height="90" fill="#f8fafc" stroke="#cbd5e1" rx="8"/>
      <text x="70" y="540" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">Date &amp; Batch:</text>
      <text x="70" y="565" font-family="sans-serif" font-size="13" fill="#334155">Pkd: 01/2026 | Batch: DTR-882 | Country of Origin: India</text>
    `;
  } else if (variant === 'cream') {
    bgGradient = `
      <rect width="100%" height="100%" rx="16" fill="#faf5ff" stroke="#a855f7" stroke-width="3"/>
    `;
    content = `
      <rect x="30" y="30" width="540" height="740" fill="#ffffff" rx="8"/>
      <text x="300" y="80" font-family="sans-serif" font-size="24" font-weight="900" fill="#6b21a8" text-anchor="middle">LUMIÈRE DERMA CARE</text>
      <text x="300" y="115" font-family="sans-serif" font-size="18" font-weight="bold" fill="#1e293b" text-anchor="middle">HYDRATING MOISTURE CREAM</text>

      <rect x="50" y="150" width="500" height="150" fill="#f1f5f9" stroke="#94a3b8" rx="8"/>
      <text x="70" y="180" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Imported Cosmetic Commodity</text>
      <text x="70" y="205" font-family="sans-serif" font-size="14" fill="#334155">Imported &amp; Marketed by: Global Luxe Imports LLP</text>
      <text x="70" y="230" font-family="sans-serif" font-size="13" fill="#64748b" font-style="italic">Address: [Blurred/Smudged text - cannot resolve street name]</text>
      <text x="70" y="260" font-family="sans-serif" font-size="13" fill="#b91c1c" font-weight="bold">Country of Origin: [Not detected / absent on label]</text>

      <rect x="50" y="320" width="500" height="130" fill="#f8fafc" stroke="#cbd5e1" rx="8"/>
      <text x="70" y="350" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">Net Weight: 50 g</text>
      <text x="70" y="380" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">MRP: ₹ 899.00 (Incl. of all taxes)</text>
      <text x="70" y="410" font-family="sans-serif" font-size="13" fill="#475569">Import Date: 05/2026 | Exp: 04/2028</text>
    `;
  } else {
    // tea
    bgGradient = `
      <rect width="100%" height="100%" rx="16" fill="#f0fdf4" stroke="#22c55e" stroke-width="3"/>
    `;
    content = `
      <rect x="30" y="30" width="540" height="740" fill="#ffffff" rx="8"/>
      <text x="300" y="80" font-family="sans-serif" font-size="24" font-weight="900" fill="#15803d" text-anchor="middle">NILGIRI GOLD TEA</text>
      <text x="300" y="115" font-family="sans-serif" font-size="18" font-weight="bold" fill="#1e293b" text-anchor="middle">Organic Green Tea Bags (25 Pcs)</text>

      <rect x="50" y="160" width="500" height="150" fill="#f8fafc" stroke="#cbd5e1" rx="8"/>
      <text x="70" y="195" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">Net Quantity: 50 g (25 Tea Bags x 2 g)</text>
      <text x="70" y="225" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">MRP: ₹ 220.00 (Incl. of all taxes)</text>
      <text x="70" y="255" font-family="sans-serif" font-size="14" fill="#334155">USP: ₹ 4.40 / g | Pkd: 08/2026</text>

      <rect x="50" y="330" width="500" height="160" fill="#f8fafc" stroke="#cbd5e1" rx="8"/>
      <text x="70" y="360" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Nilgiri Herbal Tea Estates Ltd.</text>
      <text x="70" y="385" font-family="sans-serif" font-size="12" fill="#475569">Coonoor Road, Ooty, Nilgiris, Tamil Nadu - 643001</text>
      <text x="70" y="415" font-family="sans-serif" font-size="13" fill="#15803d">Customer Helpline: 1800-111-9876 | care@nilgirigold.in</text>
      <text x="70" y="445" font-family="sans-serif" font-size="12" fill="#475569">Country of Origin: INDIA</text>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${bgGradient}${content}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Preset pre-configured demo packages for one-click testing
export interface DemoPackagePreset {
  id: string;
  name: string;
  category: string;
  brand: string;
  status: 'REQUIRES_REVIEW' | 'PASS' | 'POTENTIAL_NON_COMPLIANCE' | 'COULD_NOT_VERIFY';
  summaryDescription: string;
  images: {
    panelType: 'FRONT_PANEL' | 'BACK_PANEL' | 'SIDE_PANEL';
    label: string;
    imageUrl: string;
  }[];
  extractedFields: ExtractedField[];
  complianceChecks: ComplianceCheck[];
  findings: OfficerFinding[];
}

export const DEMO_PRESETS: DemoPackagePreset[] = [
  {
    id: 'sample-noodles-01',
    name: 'Masala Magic Instant Noodles (70g)',
    brand: 'Tasty Crunch Foods',
    category: 'Packaged Food & Cereals',
    status: 'REQUIRES_REVIEW',
    summaryDescription: 'Consumer care contact telephone/email is missing on back panel declaration.',
    images: [
      {
        panelType: 'FRONT_PANEL',
        label: 'Front Display Panel (PDP)',
        imageUrl: generatePackageSvgDataUrl('Masala Magic Instant Noodles', 'noodles', 'front'),
      },
      {
        panelType: 'BACK_PANEL',
        label: 'Back Statutory Declaration Panel',
        imageUrl: generatePackageSvgDataUrl('Masala Magic Instant Noodles', 'noodles', 'back'),
      },
    ],
    extractedFields: [
      {
        id: 'ef-101',
        fieldKey: 'product_name',
        label: 'Product Name / Description',
        value: 'Masala Magic Noodles - Instant Wheat Noodles',
        confidence: 'HIGH',
        verificationState: 'DETECTED',
        sourceImageId: 'sample-noodles-01-front',
        sourcePanel: 'Front Display Panel',
        bbox: { x: 10, y: 15, width: 80, height: 12 },
        legalReference: 'Rule 6(1)(a)',
      },
      {
        id: 'ef-102',
        fieldKey: 'manufacturer_name_address',
        label: 'Manufacturer & Packer Name & Address',
        value: 'Tasty Crunch Foods India Pvt. Ltd., Plot No. 42-B, Industrial Area Phase II, Sonipat, Haryana - 131001',
        confidence: 'HIGH',
        verificationState: 'DETECTED',
        sourceImageId: 'sample-noodles-01-back',
        sourcePanel: 'Back Panel - Statutory Declarations',
        bbox: { x: 8, y: 13, width: 84, height: 14 },
        legalReference: 'Rule 6(1)(b)',
      },
      {
        id: 'ef-103',
        fieldKey: 'net_quantity',
        label: 'Net Quantity',
        value: '70 g',
        confidence: 'HIGH',
        verificationState: 'DETECTED',
        sourceImageId: 'sample-noodles-01-front',
        sourcePanel: 'Front Display Panel',
        bbox: { x: 12, y: 68, width: 40, height: 6 },
        legalReference: 'Rule 6(1)(c)',
      },
      {
        id: 'ef-104',
        fieldKey: 'mrp',
        label: 'Retail Sale Price (MRP)',
        value: '₹ 14.00 (Incl. of all taxes)',
        confidence: 'HIGH',
        verificationState: 'DETECTED',
        sourceImageId: 'sample-noodles-01-front',
        sourcePanel: 'Front Display Panel',
        bbox: { x: 12, y: 73, width: 50, height: 6 },
        legalReference: 'Rule 6(1)(e)',
      },
      {
        id: 'ef-105',
        fieldKey: 'unit_sale_price',
        label: 'Unit Sale Price (USP)',
        value: '₹ 0.20 / g',
        confidence: 'HIGH',
        verificationState: 'DETECTED',
        sourceImageId: 'sample-noodles-01-front',
        sourcePanel: 'Front Display Panel',
        bbox: { x: 12, y: 77, width: 40, height: 5 },
        legalReference: 'Rule 6(11)',
      },
      {
        id: 'ef-106',
        fieldKey: 'date_of_manufacture',
        label: 'Date of Manufacture / Packaging',
        value: '12/08/2026',
        confidence: 'HIGH',
        verificationState: 'DETECTED',
        sourceImageId: 'sample-noodles-01-back',
        sourcePanel: 'Back Panel',
        bbox: { x: 12, y: 56, width: 40, height: 5 },
        legalReference: 'Rule 6(1)(d)',
      },
      {
        id: 'ef-107',
        fieldKey: 'consumer_care',
        label: 'Consumer Care Contact Details',
        value: 'Write to Manager, Consumer Care at above manufacturer address [NO PHONE / EMAIL FOUND]',
        confidence: 'MEDIUM',
        verificationState: 'UNCERTAIN',
        sourceImageId: 'sample-noodles-01-back',
        sourcePanel: 'Back Panel - Statutory Declarations',
        bbox: { x: 8, y: 30, width: 84, height: 13 },
        legalReference: 'Rule 6(1)(f)',
      },
      {
        id: 'ef-108',
        fieldKey: 'country_of_origin',
        label: 'Country of Origin',
        value: 'INDIA',
        confidence: 'HIGH',
        verificationState: 'DETECTED',
        sourceImageId: 'sample-noodles-01-back',
        sourcePanel: 'Back Panel',
        bbox: { x: 50, y: 64, width: 42, height: 8 },
        legalReference: 'Rule 6(1)(g)',
      },
    ],
    complianceChecks: [
      {
        id: 'chk-101',
        requirementName: 'Generic Description / Name of Commodity',
        legalReference: 'Rule 6(1)(a) - LMPC Rules, 2011',
        category: 'MANDATORY_DECLARATION',
        checkType: 'PRESENCE',
        detectedInformation: 'Masala Magic Noodles - Instant Wheat Noodles',
        validationMessage: 'Common / generic name clearly declared on principal display panel.',
        result: 'PASS',
        explanation: 'The commodity name is conspicuously declared in standard typography.',
        whereFound: 'Front display panel top section',
        evidenceImage: generatePackageSvgDataUrl('Masala Magic Instant Noodles', 'noodles', 'front'),
        evidenceBBox: { x: 10, y: 15, width: 80, height: 12 },
        requiresOfficerAction: false,
      },
      {
        id: 'chk-102',
        requirementName: 'Manufacturer Name & Complete Postal Address',
        legalReference: 'Rule 6(1)(b) - LMPC Rules, 2011',
        category: 'MANDATORY_DECLARATION',
        checkType: 'PRESENCE',
        detectedInformation: 'Tasty Crunch Foods India Pvt. Ltd., Plot 42-B, Sonipat, Haryana - 131001',
        validationMessage: 'Manufacturer name and complete postal address with PIN code detected.',
        result: 'PASS',
        explanation: 'Full address enabling consumer contact verified against address heuristics.',
        whereFound: 'Back statutory declarations block #1',
        evidenceImage: generatePackageSvgDataUrl('Masala Magic Instant Noodles', 'noodles', 'back'),
        evidenceBBox: { x: 8, y: 13, width: 84, height: 14 },
        requiresOfficerAction: false,
      },
      {
        id: 'chk-103',
        requirementName: 'Standard Unit of Mass & Net Quantity',
        legalReference: 'Rule 6(1)(c) read with Rule 13 - LMPC Rules, 2011',
        category: 'NUMERICAL_ACCURACY',
        checkType: 'FORMAT',
        detectedInformation: '70 g',
        validationMessage: 'Expressed in permissible metric unit symbol (g) with correct font height.',
        result: 'PASS',
        explanation: 'Net weight conforms with standard legal unit symbols. Unit g is lowercase.',
        whereFound: 'Front display panel bottom declaration box',
        evidenceImage: generatePackageSvgDataUrl('Masala Magic Instant Noodles', 'noodles', 'front'),
        evidenceBBox: { x: 12, y: 68, width: 40, height: 6 },
        requiresOfficerAction: false,
      },
      {
        id: 'chk-104',
        requirementName: 'MRP with "Inclusive of all taxes" & USP',
        legalReference: 'Rule 6(1)(e) & Rule 6(11) - LMPC Rules, 2011',
        category: 'CONSUMER_RIGHTS',
        checkType: 'FORMAT',
        detectedInformation: '₹ 14.00 (Incl. of all taxes), USP: ₹ 0.20 / g',
        validationMessage: 'MRP declaration includes mandatory tax phrase and Unit Sale Price.',
        result: 'PASS',
        explanation: 'Declared in Indian Rupees with correct abbreviation and dual unit pricing.',
        whereFound: 'Front display panel declaration box',
        evidenceImage: generatePackageSvgDataUrl('Masala Magic Instant Noodles', 'noodles', 'front'),
        evidenceBBox: { x: 12, y: 73, width: 50, height: 6 },
        requiresOfficerAction: false,
      },
      {
        id: 'chk-105',
        requirementName: 'Consumer Care Contact Details (Phone & Email)',
        legalReference: 'Rule 6(1)(f) - LMPC Rules, 2011',
        category: 'CONSUMER_RIGHTS',
        checkType: 'PRESENCE',
        detectedInformation: 'Postal address only; Telephone Helpline and Email address NOT detected',
        validationMessage: 'Telephone number or email address for grievance redressal appears missing.',
        result: 'POTENTIAL_NON_COMPLIANCE',
        explanation: 'Rule 6(1)(f) mandates name, address, telephone number and email address of grievance person.',
        whereFound: 'Back statutory panel box #2',
        evidenceImage: generatePackageSvgDataUrl('Masala Magic Instant Noodles', 'noodles', 'back'),
        evidenceBBox: { x: 8, y: 30, width: 84, height: 13 },
        requiresOfficerAction: true,
      },
      {
        id: 'chk-106',
        requirementName: 'Month & Year of Manufacture / Pre-packing',
        legalReference: 'Rule 6(1)(d) - LMPC Rules, 2011',
        category: 'MANDATORY_DECLARATION',
        checkType: 'FORMAT',
        detectedInformation: 'Pkd: 12/08/2026',
        validationMessage: 'Format uses day/month/year. Standard permits MM/YYYY or DD/MM/YYYY.',
        result: 'REQUIRES_REVIEW',
        explanation: 'Date stamping detected but officer should verify legibility and date format under Rule 6(1)(d).',
        whereFound: 'Back panel bottom text line',
        evidenceImage: generatePackageSvgDataUrl('Masala Magic Instant Noodles', 'noodles', 'back'),
        evidenceBBox: { x: 8, y: 55, width: 84, height: 8 },
        requiresOfficerAction: true,
      },
      {
        id: 'chk-107',
        requirementName: 'Country of Origin Declaration',
        legalReference: 'Rule 6(1)(g) - LMPC Rules, 2011',
        category: 'MANDATORY_DECLARATION',
        checkType: 'PRESENCE',
        detectedInformation: 'INDIA',
        validationMessage: 'Country of origin declared prominently.',
        result: 'PASS',
        explanation: 'Domestic manufacturing origin stated as India.',
        whereFound: 'Back panel lower right block',
        evidenceImage: generatePackageSvgDataUrl('Masala Magic Instant Noodles', 'noodles', 'back'),
        evidenceBBox: { x: 50, y: 64, width: 42, height: 8 },
        requiresOfficerAction: false,
      },
      {
        id: 'chk-108',
        requirementName: 'Importer / Custom Clearance Particulars',
        legalReference: 'Rule 6(1)(b) Proviso - LMPC Rules, 2011',
        category: 'MANDATORY_DECLARATION',
        checkType: 'CONDITIONAL',
        detectedInformation: 'Not an imported commodity (Domestic manufactured)',
        validationMessage: 'Applies exclusively to imported pre-packaged goods.',
        result: 'NOT_APPLICABLE',
        explanation: 'Since commodity origin is domestic India, importer declaration is not applicable.',
        whereFound: 'N/A',
        evidenceImage: generatePackageSvgDataUrl('Masala Magic Instant Noodles', 'noodles', 'back'),
        requiresOfficerAction: false,
      },
    ],
    findings: [
      {
        id: 'fnd-101',
        checkId: 'chk-105',
        what: 'Missing Mandatory Consumer Care Telephone Helpline and Email ID',
        where: 'Back Statutory Declaration Panel (Box #2 under "For Consumer Complaints / Feedback")',
        why: 'The label specifies "Write to Manager at above address" but omits the mandatory telephone helpline number and electronic mail address required by statute.',
        evidence: generatePackageSvgDataUrl('Masala Magic Instant Noodles', 'noodles', 'back'),
        evidenceBBox: { x: 8, y: 30, width: 84, height: 13 },
        rule: 'Rule 6(1)(f) of Legal Metrology (Packaged Commodities) Rules, 2011',
        severity: 'CRITICAL',
        officerDecision: 'PENDING',
        officerComment: '',
      },
      {
        id: 'fnd-102',
        checkId: 'chk-106',
        what: 'Verification of Pre-packing Date stamping clarity',
        where: 'Back Panel bottom stamp line: "Pkd: 12/08/2026"',
        why: 'Automated OCR flagged standard date formatting. Officer physical check advised to ensure font size conforms with Table 1 height mandates.',
        evidence: generatePackageSvgDataUrl('Masala Magic Instant Noodles', 'noodles', 'back'),
        evidenceBBox: { x: 8, y: 55, width: 84, height: 8 },
        rule: 'Rule 6(1)(d) & Rule 7 (Minimum font size by principal display panel area)',
        severity: 'MODERATE',
        officerDecision: 'PENDING',
        officerComment: '',
      },
    ],
  },

  {
    id: 'sample-detergent-02',
    name: 'Sparkle Active Premium Detergent Powder',
    brand: 'Sparkle Active',
    category: 'Household Care / Detergents',
    status: 'POTENTIAL_NON_COMPLIANCE',
    summaryDescription: 'Net Quantity unit symbol omitted (declared as "450" without "g") and Unit Sale Price missing.',
    images: [
      {
        panelType: 'FRONT_PANEL',
        label: 'Front Display Panel',
        imageUrl: generatePackageSvgDataUrl('Sparkle Active Detergent', 'detergent', 'front'),
      },
    ],
    extractedFields: [
      {
        id: 'ef-201',
        fieldKey: 'product_name',
        label: 'Product Name',
        value: 'Sparkle Active Premium Detergent Powder',
        confidence: 'HIGH',
        verificationState: 'DETECTED',
        sourceImageId: 'sample-detergent-02-front',
        sourcePanel: 'Front Panel',
        bbox: { x: 10, y: 8, width: 80, height: 10 },
        legalReference: 'Rule 6(1)(a)',
      },
      {
        id: 'ef-202',
        fieldKey: 'net_quantity',
        label: 'Net Quantity',
        value: '450 [NO METRIC UNIT SYMBOL]',
        confidence: 'HIGH',
        verificationState: 'DETECTED',
        sourceImageId: 'sample-detergent-02-front',
        sourcePanel: 'Front Panel',
        bbox: { x: 8, y: 22, width: 84, height: 12 },
        legalReference: 'Rule 6(1)(c) & Rule 13',
      },
      {
        id: 'ef-203',
        fieldKey: 'mrp',
        label: 'Retail Sale Price (MRP)',
        value: 'Rs. 65 [USP NOT DECLARED]',
        confidence: 'HIGH',
        verificationState: 'DETECTED',
        sourceImageId: 'sample-detergent-02-front',
        sourcePanel: 'Front Panel',
        bbox: { x: 8, y: 32, width: 84, height: 8 },
        legalReference: 'Rule 6(1)(e)',
      },
      {
        id: 'ef-204',
        fieldKey: 'manufacturer_name_address',
        label: 'Manufacturer Details',
        value: 'Sparkle Chemical Industries Ltd., GIDC Estate Phase IV, Vapi, Gujarat - 396195',
        confidence: 'HIGH',
        verificationState: 'DETECTED',
        sourceImageId: 'sample-detergent-02-front',
        sourcePanel: 'Front Panel',
        bbox: { x: 8, y: 44, width: 84, height: 14 },
        legalReference: 'Rule 6(1)(b)',
      },
    ],
    complianceChecks: [
      {
        id: 'chk-201',
        requirementName: 'Standard Unit of Mass in Net Quantity',
        legalReference: 'Rule 6(1)(c) read with Rule 13 - LMPC Rules, 2011',
        category: 'NUMERICAL_ACCURACY',
        checkType: 'FORMAT',
        detectedInformation: '450 (Unit omitted)',
        validationMessage: 'Statutory unit symbol "g" or "kg" not declared alongside numerical value.',
        result: 'POTENTIAL_NON_COMPLIANCE',
        explanation: 'Rule 13 strictly stipulates that unit of measurement shall be indicated in standard symbols (g/kg). Numerals without metric units are impermissible.',
        whereFound: 'Front display panel middle declaration zone',
        evidenceImage: generatePackageSvgDataUrl('Sparkle Active Detergent', 'detergent', 'front'),
        evidenceBBox: { x: 8, y: 20, width: 84, height: 15 },
        requiresOfficerAction: true,
      },
      {
        id: 'chk-202',
        requirementName: 'Unit Sale Price (USP) Declaration',
        legalReference: 'Rule 6(11) - LMPC Rules, 2011',
        category: 'CONSUMER_RIGHTS',
        checkType: 'PRESENCE',
        detectedInformation: 'Rs. 65 (USP Absent)',
        validationMessage: 'Mandatory Unit Sale Price (₹/g or ₹/kg) not detected on retail package.',
        result: 'POTENTIAL_NON_COMPLIANCE',
        explanation: 'Effective 1st January 2022 amendments, packages must declare Unit Sale Price where net quantity is unequal to 1 kg or 1 L.',
        whereFound: 'Front display panel price block',
        evidenceImage: generatePackageSvgDataUrl('Sparkle Active Detergent', 'detergent', 'front'),
        evidenceBBox: { x: 8, y: 32, width: 84, height: 8 },
        requiresOfficerAction: true,
      },
      {
        id: 'chk-203',
        requirementName: 'Manufacturer Name & Address',
        legalReference: 'Rule 6(1)(b) - LMPC Rules, 2011',
        category: 'MANDATORY_DECLARATION',
        checkType: 'PRESENCE',
        detectedInformation: 'Sparkle Chemical Industries Ltd., Vapi, Gujarat - 396195',
        validationMessage: 'Conforms to name and address requirement.',
        result: 'PASS',
        explanation: 'Complete postal location detected.',
        whereFound: 'Front display panel lower section',
        evidenceImage: generatePackageSvgDataUrl('Sparkle Active Detergent', 'detergent', 'front'),
        evidenceBBox: { x: 8, y: 44, width: 84, height: 14 },
        requiresOfficerAction: false,
      },
    ],
    findings: [
      {
        id: 'fnd-201',
        checkId: 'chk-201',
        what: 'Omission of Metric Unit Symbol in Net Quantity Declaration',
        where: 'Front display panel quantity banner: "Net Qty: 450"',
        why: 'Statute requires standard mass symbol (g or kg). A bare number creates ambiguity for consumers and violates Rule 13.',
        evidence: generatePackageSvgDataUrl('Sparkle Active Detergent', 'detergent', 'front'),
        evidenceBBox: { x: 8, y: 20, width: 84, height: 15 },
        rule: 'Rule 6(1)(c) & Rule 13 (Manner of selection of units of measurement)',
        severity: 'CRITICAL',
        officerDecision: 'PENDING',
        officerComment: '',
      },
      {
        id: 'fnd-202',
        checkId: 'chk-202',
        what: 'Absence of Unit Sale Price (USP)',
        where: 'Front display panel price block next to MRP: Rs. 65',
        why: 'Commodity does not declare per gram / per kilogram unit sale price required under Rule 6(11).',
        evidence: generatePackageSvgDataUrl('Sparkle Active Detergent', 'detergent', 'front'),
        evidenceBBox: { x: 8, y: 32, width: 84, height: 8 },
        rule: 'Rule 6(11) of Legal Metrology (Packaged Commodities) Rules, 2011',
        severity: 'CRITICAL',
        officerDecision: 'PENDING',
        officerComment: '',
      },
    ],
  },

  {
    id: 'sample-oil-03',
    name: 'Golden Harvest Refined Sunflower Oil (1 Litre)',
    brand: 'Golden Harvest Agro',
    category: 'Edible Oils & Fats',
    status: 'PASS',
    summaryDescription: 'Full statutory compliance. Dual volume/mass declaration, MRP with USP, complete manufacturer & helpline.',
    images: [
      {
        panelType: 'FRONT_PANEL',
        label: 'Principal Display Panel',
        imageUrl: generatePackageSvgDataUrl('Golden Harvest Sunflower Oil', 'oil', 'front'),
      },
    ],
    extractedFields: [
      {
        id: 'ef-301',
        fieldKey: 'product_name',
        label: 'Product Name',
        value: 'Refined Sunflower Oil',
        confidence: 'HIGH',
        verificationState: 'DETECTED',
        sourceImageId: 'sample-oil-03-front',
        sourcePanel: 'Front Panel',
        bbox: { x: 10, y: 12, width: 80, height: 8 },
        legalReference: 'Rule 6(1)(a)',
      },
      {
        id: 'ef-302',
        fieldKey: 'net_quantity',
        label: 'Net Quantity',
        value: '1 L (1000 ml) / 910 g',
        confidence: 'HIGH',
        verificationState: 'DETECTED',
        sourceImageId: 'sample-oil-03-front',
        sourcePanel: 'Front Panel',
        bbox: { x: 8, y: 24, width: 84, height: 16 },
        legalReference: 'Rule 6(1)(c)',
      },
      {
        id: 'ef-303',
        fieldKey: 'mrp',
        label: 'Maximum Retail Price (MRP)',
        value: '₹ 165.00 (Incl. of all taxes), USP: ₹ 165.00 / L',
        confidence: 'HIGH',
        verificationState: 'DETECTED',
        sourceImageId: 'sample-oil-03-front',
        sourcePanel: 'Front Panel',
        bbox: { x: 8, y: 28, width: 84, height: 10 },
        legalReference: 'Rule 6(1)(e)',
      },
      {
        id: 'ef-304',
        fieldKey: 'consumer_care',
        label: 'Consumer Care Cell',
        value: '1800-222-7890 | customercare@goldenharvestagro.com',
        confidence: 'HIGH',
        verificationState: 'DETECTED',
        sourceImageId: 'sample-oil-03-front',
        sourcePanel: 'Front Panel',
        bbox: { x: 8, y: 66, width: 84, height: 14 },
        legalReference: 'Rule 6(1)(f)',
      },
    ],
    complianceChecks: [
      {
        id: 'chk-301',
        requirementName: 'Dual Declaration of Net Volume & Equivalent Mass',
        legalReference: 'Rule 6(1)(c) & Schedule II - LMPC Rules, 2011',
        category: 'NUMERICAL_ACCURACY',
        checkType: 'VALUE',
        detectedInformation: '1 L (1000 ml) / 910 g',
        validationMessage: 'Both volume and weight declared with high numerical precision for edible oil.',
        result: 'PASS',
        explanation: 'Under advisory guidelines for edible oils, dual declaration of volume (L) and mass (g) is present.',
        whereFound: 'Principal display panel main statutory box',
        evidenceImage: generatePackageSvgDataUrl('Golden Harvest Sunflower Oil', 'oil', 'front'),
        evidenceBBox: { x: 8, y: 24, width: 84, height: 16 },
        requiresOfficerAction: false,
      },
      {
        id: 'chk-302',
        requirementName: 'MRP Declaration with All Taxes & USP',
        legalReference: 'Rule 6(1)(e) & Rule 6(11) - LMPC Rules, 2011',
        category: 'CONSUMER_RIGHTS',
        checkType: 'FORMAT',
        detectedInformation: '₹ 165.00 (Incl. of all taxes) | USP: ₹ 165.00 / L',
        validationMessage: 'Proper currency symbol, inclusive clause, and Unit Sale Price present.',
        result: 'PASS',
        explanation: 'Compliant with Rule 6(1)(e) price specification guidelines.',
        whereFound: 'Front display panel main statutory box',
        evidenceImage: generatePackageSvgDataUrl('Golden Harvest Sunflower Oil', 'oil', 'front'),
        evidenceBBox: { x: 8, y: 28, width: 84, height: 10 },
        requiresOfficerAction: false,
      },
      {
        id: 'chk-303',
        requirementName: 'Full Grievance Redressal / Consumer Care',
        legalReference: 'Rule 6(1)(f) - LMPC Rules, 2011',
        category: 'CONSUMER_RIGHTS',
        checkType: 'PRESENCE',
        detectedInformation: 'Toll-free 1800-222-7890, Email & Physical Address of Grievance Officer',
        validationMessage: 'Toll-free telephone, official email, and contact officer address fully detected.',
        result: 'PASS',
        explanation: 'All 3 grievance modalities verified.',
        whereFound: 'Bottom green contact box',
        evidenceImage: generatePackageSvgDataUrl('Golden Harvest Sunflower Oil', 'oil', 'front'),
        evidenceBBox: { x: 8, y: 66, width: 84, height: 14 },
        requiresOfficerAction: false,
      },
    ],
    findings: [],
  },

  {
    id: 'sample-cream-04',
    name: 'Lumière Derma Care Hydrating Cream (Imported)',
    brand: 'Lumière Derma',
    category: 'Cosmetics & Toiletries',
    status: 'COULD_NOT_VERIFY',
    summaryDescription: 'Label image has reflection/smudge over importer street address; OCR marked Could Not Verify.',
    images: [
      {
        panelType: 'BACK_PANEL',
        label: 'Outer Carton Declaration Label',
        imageUrl: generatePackageSvgDataUrl('Lumière Derma Care Cream', 'cream', 'front'),
      },
    ],
    extractedFields: [
      {
        id: 'ef-401',
        fieldKey: 'product_name',
        label: 'Product Name',
        value: 'Lumière Derma Care Hydrating Moisture Cream',
        confidence: 'HIGH',
        verificationState: 'DETECTED',
        sourceImageId: 'sample-cream-04-front',
        sourcePanel: 'Front Panel',
        bbox: { x: 10, y: 8, width: 80, height: 10 },
        legalReference: 'Rule 6(1)(a)',
      },
      {
        id: 'ef-402',
        fieldKey: 'packer_importer_address',
        label: 'Importer Name & Address',
        value: 'Global Luxe Imports LLP, [Unreadable Street Address - Low Contrast/Smudge]',
        confidence: 'LOW',
        verificationState: 'UNCERTAIN',
        sourceImageId: 'sample-cream-04-front',
        sourcePanel: 'Front Panel',
        bbox: { x: 8, y: 22, width: 84, height: 14 },
        legalReference: 'Rule 6(1)(b) Proviso',
      },
      {
        id: 'ef-403',
        fieldKey: 'country_of_origin',
        label: 'Country of Origin',
        value: 'NOT DETECTED ON SCANNED PANEL',
        confidence: 'LOW',
        verificationState: 'NOT_DETECTED',
        sourceImageId: 'sample-cream-04-front',
        sourcePanel: 'Front Panel',
        bbox: { x: 8, y: 32, width: 84, height: 8 },
        legalReference: 'Rule 6(1)(g)',
      },
    ],
    complianceChecks: [
      {
        id: 'chk-401',
        requirementName: 'Importer Complete Postal Address',
        legalReference: 'Rule 6(1)(b) Proviso - LMPC Rules, 2011',
        category: 'MANDATORY_DECLARATION',
        checkType: 'PRESENCE',
        detectedInformation: 'Global Luxe Imports LLP [Street address illegible/blurred]',
        validationMessage: 'OCR confidence below 45% due to glare/ink smudge on secondary label.',
        result: 'COULD_NOT_VERIFY',
        explanation: 'Image processing could not reliably parse the street and PIN code. Human officer inspection of physical carton required.',
        whereFound: 'Importer declaration text block',
        evidenceImage: generatePackageSvgDataUrl('Lumière Derma Care Cream', 'cream', 'front'),
        evidenceBBox: { x: 8, y: 22, width: 84, height: 14 },
        requiresOfficerAction: true,
      },
      {
        id: 'chk-402',
        requirementName: 'Country of Origin for Imported Commodity',
        legalReference: 'Rule 6(1)(g) - LMPC Rules, 2011',
        category: 'MANDATORY_DECLARATION',
        checkType: 'PRESENCE',
        detectedInformation: 'Not detected on current image',
        validationMessage: 'May be located on opposite carton panel or under secondary barcode sticker.',
        result: 'REQUIRES_REVIEW',
        explanation: 'Failure to detect does NOT prove absence. Officer should check other package sides.',
        whereFound: 'Label face',
        evidenceImage: generatePackageSvgDataUrl('Lumière Derma Care Cream', 'cream', 'front'),
        evidenceBBox: { x: 8, y: 32, width: 84, height: 8 },
        requiresOfficerAction: true,
      },
    ],
    findings: [
      {
        id: 'fnd-401',
        checkId: 'chk-401',
        what: 'Could Not Verify Complete Importer Address from Scanned Image',
        where: 'Secondary sticker label: "Global Luxe Imports LLP..."',
        why: 'Reflective foil surface created glare during image capture. System conservatively categorizes as "Could Not Verify" rather than alleging violation.',
        evidence: generatePackageSvgDataUrl('Lumière Derma Care Cream', 'cream', 'front'),
        evidenceBBox: { x: 8, y: 22, width: 84, height: 14 },
        rule: 'Rule 6(1)(b) & Rule 24 (Verification protocols)',
        severity: 'MODERATE',
        officerDecision: 'PENDING',
        officerComment: '',
      },
    ],
  },
];

// Realistic Initial Inspection History for the Officer
export const INITIAL_INSPECTION_HISTORY: InspectionRecord[] = [
  {
    id: 'insp-2026-00124',
    inspectionNumber: 'SIH-LM-2026-00124',
    date: '2026-09-18',
    time: '11:45 AM',
    productName: 'Masala Magic Instant Noodles (70g)',
    brandName: 'Tasty Crunch Foods',
    commodityCategory: 'Packaged Food & Cereals',
    premisesName: 'Om Supermarket & Kirana Store',
    premisesAddress: 'Shop 14, Main Market, Connaught Place, New Delhi - 110001',
    officerId: 'LM-INSP-DELHI-402',
    officerName: 'Vikramaditya Sharma',
    officerDesignation: 'Legal Metrology Enforcement Officer (Grade I)',
    status: 'REQUIRES_REVIEW',
    packageImages: [
      {
        id: 'img-1',
        panelType: 'FRONT_PANEL',
        label: 'Front Display Panel (PDP)',
        imageUrl: generatePackageSvgDataUrl('Masala Magic Instant Noodles', 'noodles', 'front'),
        rotation: 0,
        isEnhanced: false,
        capturedAt: '2026-09-18 11:42 AM',
      },
      {
        id: 'img-2',
        panelType: 'BACK_PANEL',
        label: 'Back Statutory Declaration Panel',
        imageUrl: generatePackageSvgDataUrl('Masala Magic Instant Noodles', 'noodles', 'back'),
        rotation: 0,
        isEnhanced: true,
        capturedAt: '2026-09-18 11:44 AM',
      },
    ],
    extractedFields: DEMO_PRESETS[0].extractedFields,
    complianceChecks: DEMO_PRESETS[0].complianceChecks,
    findings: DEMO_PRESETS[0].findings,
    officerNotes: 'Inspected 3 sample packets on shelf. Consumer care cell helpline missing on all 3 sample batches.',
    isCompleted: false,
    reportGenerated: false,
    createdAt: '2026-09-18T11:45:00.000Z',
    updatedAt: '2026-09-18T11:58:00.000Z',
  },
  {
    id: 'insp-2026-00123',
    inspectionNumber: 'SIH-LM-2026-00123',
    date: '2026-09-17',
    time: '03:15 PM',
    productName: 'Golden Harvest Refined Sunflower Oil (1 Litre)',
    brandName: 'Golden Harvest Agro',
    commodityCategory: 'Edible Oils & Fats',
    premisesName: 'Reliance Fresh Super Bazaar',
    premisesAddress: 'Plot 5A, Sector 18, Noida, Uttar Pradesh - 201301',
    officerId: 'LM-INSP-DELHI-402',
    officerName: 'Vikramaditya Sharma',
    officerDesignation: 'Legal Metrology Enforcement Officer (Grade I)',
    status: 'PASS',
    packageImages: [
      {
        id: 'img-oil-1',
        panelType: 'FRONT_PANEL',
        label: 'Principal Display Panel',
        imageUrl: generatePackageSvgDataUrl('Golden Harvest Sunflower Oil', 'oil', 'front'),
        rotation: 0,
        isEnhanced: false,
        capturedAt: '2026-09-17 03:10 PM',
      },
    ],
    extractedFields: DEMO_PRESETS[2].extractedFields,
    complianceChecks: DEMO_PRESETS[2].complianceChecks,
    findings: [],
    officerNotes: 'Full compliance verified. Dual net quantity (L & g) correctly stated. Signed off by officer.',
    isCompleted: true,
    reportGenerated: true,
    createdAt: '2026-09-17T15:15:00.000Z',
    updatedAt: '2026-09-17T15:30:00.000Z',
  },
  {
    id: 'insp-2026-00122',
    inspectionNumber: 'SIH-LM-2026-00122',
    date: '2026-09-16',
    time: '04:50 PM',
    productName: 'Sparkle Active Premium Detergent Powder',
    brandName: 'Sparkle Active',
    commodityCategory: 'Household Care / Detergents',
    premisesName: 'Gupta Wholesale Departmental Stores',
    premisesAddress: 'Shop 8-9, Grain Market, Najafgarh, New Delhi - 110043',
    officerId: 'LM-INSP-DELHI-402',
    officerName: 'Vikramaditya Sharma',
    officerDesignation: 'Legal Metrology Enforcement Officer (Grade I)',
    status: 'POTENTIAL_NON_COMPLIANCE',
    packageImages: [
      {
        id: 'img-dtr-1',
        panelType: 'FRONT_PANEL',
        label: 'Front Display Panel',
        imageUrl: generatePackageSvgDataUrl('Sparkle Active Detergent', 'detergent', 'front'),
        rotation: 0,
        isEnhanced: false,
        capturedAt: '2026-09-16 04:45 PM',
      },
    ],
    extractedFields: DEMO_PRESETS[1].extractedFields,
    complianceChecks: DEMO_PRESETS[1].complianceChecks,
    findings: DEMO_PRESETS[1].findings,
    officerNotes: 'Notice under Section 36 of Legal Metrology Act, 2009 initiated regarding missing metric unit symbol.',
    isCompleted: true,
    reportGenerated: true,
    createdAt: '2026-09-16T16:50:00.000Z',
    updatedAt: '2026-09-16T17:20:00.000Z',
  },
  {
    id: 'insp-2026-00121',
    inspectionNumber: 'SIH-LM-2026-00121',
    date: '2026-09-15',
    time: '01:20 PM',
    productName: 'Lumière Derma Care Hydrating Cream (50g)',
    brandName: 'Lumière Derma',
    commodityCategory: 'Cosmetics & Toiletries',
    premisesName: 'Aesthetic Beauty Boutique',
    premisesAddress: 'Galleria Market, DLF Phase IV, Gurugram, Haryana - 122009',
    officerId: 'LM-INSP-DELHI-402',
    officerName: 'Vikramaditya Sharma',
    officerDesignation: 'Legal Metrology Enforcement Officer (Grade I)',
    status: 'COULD_NOT_VERIFY',
    packageImages: [
      {
        id: 'img-crm-1',
        panelType: 'BACK_PANEL',
        label: 'Carton Back Label',
        imageUrl: generatePackageSvgDataUrl('Lumière Derma Care Cream', 'cream', 'front'),
        rotation: 0,
        isEnhanced: true,
        capturedAt: '2026-09-15 01:15 PM',
      },
    ],
    extractedFields: DEMO_PRESETS[3].extractedFields,
    complianceChecks: DEMO_PRESETS[3].complianceChecks,
    findings: DEMO_PRESETS[3].findings,
    officerNotes: 'Secondary image required due to label reflection. Physical notice pending carton examination.',
    isCompleted: false,
    reportGenerated: false,
    createdAt: '2026-09-15T13:20:00.000Z',
    updatedAt: '2026-09-15T13:40:00.000Z',
  },
];

export const CURRENT_OFFICER: {
  id: string;
  officerId: string;
  name: string;
  designation: string;
  jurisdiction: string;
  badgeNumber: string;
} = {
  id: 'usr-402',
  officerId: 'LM-INSP-DELHI-402',
  name: 'Vikramaditya Sharma',
  designation: 'Enforcement Officer (Legal Metrology, Grade I)',
  jurisdiction: 'Department of Consumer Affairs, Delhi Zone',
  badgeNumber: 'DL-LME-9024',
};
