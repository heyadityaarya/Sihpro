import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, HelpCircle, MinusCircle } from 'lucide-react';
import { ComplianceStatus } from '../types';

interface StatusBadgeProps {
  status: ComplianceStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const configs: Record<
    ComplianceStatus,
    {
      label: string;
      bg: string;
      text: string;
      border: string;
      icon: React.ComponentType<{ className?: string }>;
    }
  > = {
    PASS: {
      label: 'PASS',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      icon: CheckCircle2,
    },
    POTENTIAL_NON_COMPLIANCE: {
      label: 'POTENTIAL NON-COMPLIANCE',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-300',
      icon: AlertCircle,
    },
    REQUIRES_REVIEW: {
      label: 'REQUIRES REVIEW',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      icon: AlertTriangle,
    },
    NOT_APPLICABLE: {
      label: 'NOT APPLICABLE',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      icon: MinusCircle,
    },
    COULD_NOT_VERIFY: {
      label: 'COULD NOT VERIFY',
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      border: 'border-sky-300',
      icon: HelpCircle,
    },
  };

  const config = configs[status] || configs.COULD_NOT_VERIFY;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide whitespace-nowrap ${sizeClasses[size]} ${config.bg} ${config.text} ${config.border} ${className}`}
      role="status"
    >
      {showIcon && <IconComponent className={`${iconSizes[size]} shrink-0`} />}
      <span>{config.label}</span>
    </span>
  );
};
