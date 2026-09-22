import React, { useState } from 'react';
import { BookOpen, Scale, ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink, Search } from 'lucide-react';

export const LegalReferenceView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const rules = [
    {
      rule: 'Rule 6(1)(a)',
      title: 'Manufacturer / Packer / Importer Name & Address',
      statute: 'Legal Metrology (Packaged Commodities) Rules, 2011',
      description:
        'Every pre-packaged commodity must clearly declare the name and complete physical address of the manufacturer, or packer if packed by an entity other than manufacturer. For imported goods, the name and address of the importer must be declared.',
      practicalCheck:
        'Must contain complete address with city, state, and pincode enabling physical identification.',
      category: 'Identity',
    },
    {
      rule: 'Rule 6(1)(b)',
      title: 'Generic or Common Name of Commodity',
      statute: 'Legal Metrology (Packaged Commodities) Rules, 2011',
      description:
        'The common or generic name of the commodity contained in the package must be prominently displayed on the Principal Display Panel (PDP).',
      practicalCheck:
        'Trade names alone are insufficient; e.g. "Instant Noodles" or "Refined Soyabean Oil" must be explicitly stated.',
      category: 'Identity',
    },
    {
      rule: 'Rule 6(1)(c) & Rule 13',
      title: 'Net Quantity in Standard Units of Measurement',
      statute: 'Legal Metrology (Packaged Commodities) Rules, 2011',
      description:
        'Net quantity must be declared in standard legal units: g, kg, ml, l, m, cm, mm, or number (N / U). Symbols must be strictly in lowercase legal standard notation (e.g. "g" not "gm" or "gms", "kg" not "kgs"). Dual declaration (mass and volume) is mandatory for edible oils and ghee.',
      practicalCheck:
        'Reject non-standard abbreviations like "gms", "KG", "ML", or unqualified numerals.',
      category: 'Quantity',
    },
    {
      rule: 'Rule 6(1)(d)',
      title: 'Month and Year of Manufacture or Pre-packing',
      statute: 'Legal Metrology (Packaged Commodities) Rules, 2011',
      description:
        'The month and year in which the commodity is manufactured, packed or imported must be printed clearly. Format can be MM/YY, MM/YYYY, or Month and Year in words.',
      practicalCheck:
        'Must not be ambiguous or obscured by fold lines, batch overprinting, or seals.',
      category: 'Date',
    },
    {
      rule: 'Rule 6(1)(e)',
      title: 'Maximum Retail Price (MRP) & Tax Clause',
      statute: 'Legal Metrology (Packaged Commodities) Rules, 2011',
      description:
        'Retail sale price must be declared as Maximum Retail Price (MRP) in Indian Rupees (₹ or Rs.) followed by the mandatory statutory phrase "(inclusive of all taxes)" or "incl. of all taxes". Dual MRP on identical packages is strictly prohibited.',
      practicalCheck:
        'Omission of the tax clause phrase constitutes a statutory violation under Section 36.',
      category: 'Pricing',
    },
    {
      rule: 'Rule 6(1)(da)',
      title: 'Unit Sale Price (USP)',
      statute: 'Legal Metrology (Packaged Commodities) Rules, 2011 (Amendment 2021)',
      description:
        'Mandatory declaration of Unit Sale Price rounded off to nearest two decimal places: price per gram or kilogram for solid commodities, price per milliliter or liter for liquids, price per number for items sold by count.',
      practicalCheck:
        'Applies where package net quantity is not exactly 1 kg, 1 liter, or 1 unit.',
      category: 'Pricing',
    },
    {
      rule: 'Rule 6(1)(n)',
      title: 'Consumer Grievance Care Cell & Contact Details',
      statute: 'Legal Metrology (Packaged Commodities) Rules, 2011',
      description:
        'Every package must declare the name, address, telephone number, and email address of the person or office that can be contacted in case of consumer complaints or queries.',
      practicalCheck:
        'Telephone helpline number and working email address are both mandatory.',
      category: 'Consumer Redressal',
    },
    {
      rule: 'Rule 6(10)',
      title: 'Country of Origin Declaration',
      statute: 'Legal Metrology (Packaged Commodities) Rules, 2011',
      description:
        'Mandatory declaration of the country of manufacture or assembly for all pre-packaged commodities, including both domestic products ("Made in India") and imported goods.',
      practicalCheck:
        'Must be stated unambiguously without misleading geopolitical labels.',
      category: 'Origin',
    },
  ];

  const filteredRules = rules.filter(
    (r) =>
      r.rule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Statutory Knowledge Base
            </span>
            <span className="text-xs text-slate-500 font-mono font-medium">
              Legal Metrology Act, 2009
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Legal Metrology (Packaged Commodities) Rules, 2011
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official statutory reference guide codified in the MetriScan compliance validation rule engine.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search rules by rule number, declaration title, or requirement keywords..."
            className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Rules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.rule}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                  {rule.rule}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {rule.category}
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {rule.title}
              </h2>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {rule.description}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
              <strong className="block text-slate-900 mb-1 font-bold">Enforcement Check Criteria:</strong>
              {rule.practicalCheck}
            </div>
          </div>
        ))}
      </div>

      {/* Statutory Exemptions Note */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Statutory Exemptions (Rule 26)
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Nothing in these rules applies to pre-packaged food packages containing a quantity of 10 grams or 10 milliliters or less, packages meant for industrial or institutional consumers with explicit marking, or agricultural commodities in bags exceeding 50 kg.
        </p>
      </div>
    </div>
  );
};
