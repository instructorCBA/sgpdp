import React from 'react';
import { useCaseContext } from '../../context/CaseContext';
import { ViewType } from '../../types';

interface BreadcrumbItem {
  label: string;
  view?: ViewType;
  caseId?: string;
  isCurrent?: boolean;
}

export const Breadcrumbs: React.FC = () => {
  const { activeView, selectedCase, navigateTo } = useCaseContext();

  const getBreadcrumbTrail = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: 'SGPDP', view: 'dashboard' }
    ];

    switch (activeView) {
      case 'dashboard':
        items.push({ label: 'Panel de Control y Términos SLA', isCurrent: true });
        break;
      case 'cases-list':
      case 'case-detail':
        items.push({ label: 'Expedientes', view: 'dashboard' });
        if (selectedCase) {
          items.push({ label: selectedCase.id, isCurrent: true });
        }
        break;
      case 'smart-triage':
        items.push({ label: 'Triaje y Clasificación de Falta', isCurrent: true });
        break;
      case 'warning-1':
        items.push({ label: 'Medidas Formativas', view: 'dashboard' });
        items.push({ label: '1er Llamado de Atención Escrito', isCurrent: true });
        break;
      case 'warning-2':
        items.push({ label: 'Medidas Formativas', view: 'dashboard' });
        items.push({ label: '2do Llamado con Compromiso', isCurrent: true });
        break;
      case 'executor-citation':
        items.push({ label: 'Equipo Ejecutor', view: 'dashboard' });
        items.push({ label: 'Citación a Descargos', isCurrent: true });
        break;
      case 'executor-session':
        items.push({ label: 'Equipo Ejecutor', view: 'dashboard' });
        items.push({ label: 'Acta de Sesión', isCurrent: true });
        break;
      case 'plan-evaluation':
        items.push({ label: 'Plan de Mejoramiento', view: 'dashboard' });
        items.push({ label: 'Evaluación y Calificación', isCurrent: true });
        break;
      case 'committee-request':
        items.push({ label: 'Comité de Evaluación', view: 'dashboard' });
        items.push({ label: 'Solicitud de Citación', isCurrent: true });
        break;
      case 'committee-schedule':
        items.push({ label: 'Comité de Evaluación', view: 'dashboard' });
        items.push({ label: 'Programación y Quórum', isCurrent: true });
        break;
      case 'not-found':
        items.push({ label: 'Página no encontrada (404)', isCurrent: true });
        break;
      default:
        items.push({ label: 'Vista del Sistema', isCurrent: true });
    }

    return items;
  };

  const trail = getBreadcrumbTrail();

  return (
    <nav 
      aria-label="Migas de pan" 
      className="flex items-center text-xs font-mono text-gray-400 mb-6 py-2 px-3 bg-[#161818] border border-[#2d2f2f] rounded-xl overflow-x-auto select-none"
    >
      <ol className="flex items-center space-x-2 shrink-0">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={index} className="flex items-center space-x-2">
              {index > 0 && (
                <span className="material-symbols-outlined text-[14px] text-gray-500">
                  chevron_right
                </span>
              )}
              {isLast ? (
                <span 
                  className="text-[#39a900] font-semibold flex items-center gap-1"
                  aria-current="page"
                >
                  {index === 0 && (
                    <span className="material-symbols-outlined text-[14px]">home</span>
                  )}
                  <span>{item.label}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => item.view && navigateTo(item.view, item.caseId)}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 focus:outline-none"
                >
                  {index === 0 && (
                    <span className="material-symbols-outlined text-[14px]">home</span>
                  )}
                  <span>{item.label}</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
