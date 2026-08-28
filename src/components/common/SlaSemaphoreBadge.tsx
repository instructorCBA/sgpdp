import React from 'react';
import { SLAStatus } from '../../types';

interface SlaSemaphoreBadgeProps {
  status: SLAStatus;
  daysRemaining: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SlaSemaphoreBadge: React.FC<SlaSemaphoreBadgeProps> = ({
  status,
  daysRemaining,
  label,
  size = 'md'
}) => {
  if (size === 'lg') {
    const isWarning = status === 'warning';
    const isCritical = status === 'critical' || status === 'expired';
    const isStable = status === 'stable';

    const colorClass = isCritical 
      ? 'border-[#d32f2f] text-[#d32f2f] bg-red-950/20' 
      : isWarning 
      ? 'border-[#fdc300] text-[#fdc300] bg-yellow-950/20'
      : 'border-[#39a900] text-[#39a900] bg-green-950/20';

    return (
      <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          {label || "Tiempo Restante SLA"}
        </h4>
        <div className={`w-24 h-24 rounded-2xl border-4 ${colorClass} flex flex-col items-center justify-center mb-3 shadow-inner`}>
          <span className="text-4xl font-bold font-mono leading-none">
            {Math.abs(daysRemaining)}
          </span>
          <span className="text-[11px] text-gray-400 font-medium mt-1">
            {daysRemaining < 0 ? 'días venc.' : 'días háb.'}
          </span>
        </div>
        <p className="text-xs font-semibold text-gray-200">
          {daysRemaining < 0 ? 'Término procesal vencido' : 'Hábiles restantes para trámite'}
        </p>
      </div>
    );
  }

  if (status === 'stable') {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#39a900] text-white shadow-sm" title={`SLA Estable (${daysRemaining} días restantes)`}>
        <span className="material-symbols-outlined text-[18px]">check_circle</span>
      </span>
    );
  }

  if (status === 'warning') {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#fdc300] text-[#121212] shadow-sm font-bold" title={`SLA en Riesgo (${daysRemaining} días restantes)`}>
        <span className="material-symbols-outlined text-[18px]">schedule</span>
      </span>
    );
  }

  if (status === 'critical') {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#d32f2f] text-white shadow-[0_0_8px_rgba(211,47,47,0.6)] animate-pulse" title={`SLA Vencido / Crítico (${daysRemaining} días)`}>
        <span className="material-symbols-outlined text-[18px]">warning</span>
      </span>
    );
  }

  // closed or expired
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#2f3131] text-gray-400" title="Caso Cerrado / Finalizado">
      <span className="material-symbols-outlined text-[18px]">lock</span>
    </span>
  );
};
