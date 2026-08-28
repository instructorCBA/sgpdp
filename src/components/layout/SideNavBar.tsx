import React, { useEffect } from 'react';
import { useCaseContext } from '../../context/CaseContext';
import { ViewType } from '../../types';

export const SideNavBar: React.FC = () => {
  const { activeView, navigateTo, isMobileDrawerOpen, closeMobileDrawer } = useCaseContext();

  const isViewActive = (views: ViewType[]) => views.includes(activeView);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileDrawerOpen) {
        closeMobileDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileDrawerOpen, closeMobileDrawer]);

  const navContent = (
    <div className="flex flex-col justify-between h-full">
      {/* Top Section */}
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#2d2f2f] flex items-center justify-between">
          <div 
            onClick={() => navigateTo('dashboard')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#39a900] flex items-center justify-center text-white font-bold text-xl shadow-[0_0_12px_rgba(57,169,0,0.35)] shrink-0 group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-tight group-hover:text-[#39a900] transition-colors">
                SENA SGPDP
              </h1>
              <p className="text-[11px] text-gray-400 font-medium">Debido Proceso • Ac. 0009</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={closeMobileDrawer}
            className="lg:hidden w-8 h-8 rounded-lg bg-[#252727] text-gray-400 hover:text-white flex items-center justify-center"
            title="Cerrar menú"
          >
            ✕
          </button>
        </div>

        {/* Action Button: Nuevo Caso */}
        <div className="p-4">
          <button
            onClick={() => navigateTo('smart-triage')}
            className="w-full bg-[#39a900] hover:bg-[#329600] active:scale-[0.98] text-white py-2.5 px-4 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_rgba(57,169,0,0.25)] hover:shadow-[0_6px_20px_rgba(57,169,0,0.4)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              add
            </span>
            <span>Nuevo Caso</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="px-2 space-y-1 mt-1">
          {/* Dashboard */}
          <button
            onClick={() => navigateTo('dashboard')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-full text-sm font-medium transition-all text-left cursor-pointer ${
              activeView === 'dashboard'
                ? 'bg-[#39a900] text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#252727]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeView === 'dashboard' ? "'FILL' 1" : "'FILL' 0" }}>
              dashboard
            </span>
            <span>Dashboard SLA</span>
          </button>

          {/* Expedientes */}
          <button
            onClick={() => navigateTo('case-detail', 'EXP-2024-0892')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-full text-sm font-medium transition-all text-left cursor-pointer ${
              isViewActive(['case-detail', 'cases-list', 'executor-session', 'plan-evaluation'])
                ? 'bg-[#39a900] text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#252727]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: isViewActive(['case-detail', 'cases-list']) ? "'FILL' 1" : "'FILL' 0" }}>
              folder_shared
            </span>
            <span>Expedientes</span>
          </button>

          {/* Medidas Formativas (1er Llamado) */}
          <button
            onClick={() => navigateTo('warning-1')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-full text-sm font-medium transition-all text-left cursor-pointer ${
              isViewActive(['warning-1'])
                ? 'bg-[#39a900] text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#252727]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: isViewActive(['warning-1']) ? "'FILL' 1" : "'FILL' 0" }}>
              edit_note
            </span>
            <span>1er Llamado</span>
          </button>

          {/* Medidas Formativas (2do Llamado) */}
          <button
            onClick={() => navigateTo('warning-2')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-full text-sm font-medium transition-all text-left cursor-pointer ${
              isViewActive(['warning-2'])
                ? 'bg-[#39a900] text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#252727]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: isViewActive(['warning-2']) ? "'FILL' 1" : "'FILL' 0" }}>
              rate_review
            </span>
            <span>2do Llamado</span>
          </button>

          {/* Citaciones */}
          <button
            onClick={() => navigateTo('executor-citation', 'EXP-2024-001')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-full text-sm font-medium transition-all text-left cursor-pointer ${
              isViewActive(['executor-citation'])
                ? 'bg-[#39a900] text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#252727]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: isViewActive(['executor-citation']) ? "'FILL' 1" : "'FILL' 0" }}>
              event_note
            </span>
            <span>Citaciones</span>
          </button>

          {/* Comités */}
          <button
            onClick={() => navigateTo('committee-schedule', 'EXP-2024-0842')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-full text-sm font-medium transition-all text-left cursor-pointer ${
              isViewActive(['committee-schedule', 'committee-request'])
                ? 'bg-[#39a900] text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#252727]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: isViewActive(['committee-schedule', 'committee-request']) ? "'FILL' 1" : "'FILL' 0" }}>
              gavel
            </span>
            <span>Comités</span>
          </button>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-[#2d2f2f] space-y-1">
        <button
          onClick={() => navigateTo('public-portal')}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-sm text-gray-400 hover:text-gray-200 hover:bg-[#252727] transition-all text-left cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">
            menu_book
          </span>
          <span>Portal Normativo</span>
        </button>

        <button
          onClick={() => navigateTo('smart-triage')}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-sm text-gray-400 hover:text-gray-200 hover:bg-[#252727] transition-all text-left cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">
            tune
          </span>
          <span>Simulador Triaje</span>
        </button>

        <button
          onClick={() => navigateTo('auth')}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-sm text-gray-400 hover:text-red-400 hover:bg-[#252727] transition-all text-left cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">
            logout
          </span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-[280px] bg-[#1a1c1c] border-r border-[#2d2f2f] h-screen fixed left-0 top-0 z-40 flex-col select-none shadow-2xl">
        {navContent}
      </aside>

      {/* Mobile Drawer (Responsive Navigation) */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={closeMobileDrawer}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-[280px] max-w-[85vw] bg-[#1a1c1c] border-r border-[#2d2f2f] h-full shadow-2xl z-10 animate-fadeIn">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
