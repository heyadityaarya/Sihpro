import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  FileText,
  Calendar,
  Store,
  ArrowUpDown,
  PlusCircle,
} from 'lucide-react';
import { ComplianceStatus, InspectionRecord } from '../types';
import { StatusBadge } from './StatusBadge';

interface InspectionHistoryViewProps {
  records: InspectionRecord[];
  onSelectRecord: (recordId: string) => void;
  onNewInspection: () => void;
}

export const InspectionHistoryView: React.FC<InspectionHistoryViewProps> = ({
  records,
  onSelectRecord,
  onNewInspection,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | ComplianceStatus>('ALL');

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.inspectionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.premisesName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.brandName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'ALL' ? true : r.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Inspection History &amp; Records Archive
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official repository of compliance screening records under Legal Metrology (Packaged Commodities) Rules, 2011.
          </p>
        </div>

        <button
          onClick={onNewInspection}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Inspection</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product, inspection #, or store..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-1">
          {(
            [
              'ALL',
              'PASS',
              'POTENTIAL_NON_COMPLIANCE',
              'REQUIRES_REVIEW',
              'COULD_NOT_VERIFY',
            ] as const
          ).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedStatus === st
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              {st === 'ALL' ? 'All Records' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200/80">
              <tr>
                <th className="p-3.5">Inspection ID</th>
                <th className="p-3.5">Commodity &amp; Brand</th>
                <th className="p-3.5">Premises Inspected</th>
                <th className="p-3.5">Inspection Date</th>
                <th className="p-3.5">Officer Sign-Off</th>
                <th className="p-3.5">Preliminary Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No inspection records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      {record.inspectionNumber}
                    </td>
                    <td className="p-3.5 font-medium text-slate-900">
                      <div className="font-bold">{record.productName}</div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {record.brandName} • {record.commodityCategory}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800 truncate max-w-[200px]">
                        {record.premisesName}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                        {record.premisesAddress}
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-600">
                      <div>{record.date}</div>
                      <div className="text-[10px] text-slate-400">{record.time}</div>
                    </td>
                    <td className="p-3.5 text-xs text-slate-700">
                      <div className="font-medium">{record.officerName}</div>
                      <div className="font-mono text-[10px] text-blue-700 font-semibold">{record.officerId}</div>
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={record.status} size="sm" />
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onSelectRecord(record.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700 hover:text-blue-600 font-semibold transition shadow-2xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>View File</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
