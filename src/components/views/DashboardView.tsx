import React from 'react';
import { useCaseContext } from '../../context/CaseContext';
import { SlaSemaphoreBadge } from '../common/SlaSemaphoreBadge';

export const DashboardView: React.FC = () => {
  const { cases, navigateTo, searchQuery, currentUser, openAuthModal } = useCaseContext();

  // Filtrar casos según búsqueda global
  const filteredCases = cases.filter(c => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      c.id.toLowerCase().includes(query) ||
      c.apprentice.name.toLowerCase().includes(query) ||
      c.apprentice.ficha.includes(query) ||
      c.faultCategory.toLowerCase().includes(query) ||
      c.currentPhase.toLowerCase().includes(query)
    );
  });

  // Casos específicos si el usuario autenticado es un Aprendiz
  const isAprendiz = currentUser.role === 'Aprendiz' || currentUser.dbRole === 'APRENDIZ';
  const isInstructor = currentUser.role === 'Instructor';
  const isCoordinador = currentUser.role === 'Coordinador';
  const isComite = currentUser.role === 'Comité';

  const apprenticeCases = isAprendiz
    ? cases.filter(c => 
        (currentUser.documentNumber && c.apprentice.documentNumber === currentUser.documentNumber) ||
        (currentUser.email && c.apprentice.email?.toLowerCase() === currentUser.email?.toLowerCase()) ||
        c.apprentice.name.toLowerCase().includes(currentUser.name.toLowerCase())
      )
    : filteredCases;

  const displayedCases = isAprendiz ? apprenticeCases : filteredCases;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* User Welcome & Institutional Identification Banner */}
      <div className="bg-gradient-to-r from-[#172033] via-[#1a2235] to-[#121927] border border-gray-700/70 rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden text-white">
        {/* Ambient glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#39a900]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* User Details */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#39a900] shadow-[0_0_20px_rgba(57,169,0,0.3)]"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#39a900] border-2 border-[#121927] rounded-full flex items-center justify-center text-[10px] text-white" title="Sesión activa">
                ✓
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#39a900]/20 text-[#39a900] border border-[#39a900]/40">
                  {currentUser.roleTitle}
                </span>
                <span className="text-[11px] font-mono text-gray-400 bg-gray-800/80 px-2 py-0.5 rounded-md border border-gray-700">
                  Rol: {currentUser.role}
                </span>
                {currentUser.documentNumber && (
                  <span className="text-[11px] font-mono text-gray-300 bg-[#0b1222] px-2 py-0.5 rounded-md border border-gray-700">
                    {currentUser.documentType || 'CC'} {currentUser.documentNumber}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {currentUser.name}
              </h2>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-300 mt-1.5 font-mono">
                <span className="flex items-center gap-1 text-gray-400">
                  <span className="material-symbols-outlined text-[16px] text-[#39a900]">domain</span>
                  {currentUser.center}
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <span className="material-symbols-outlined text-[16px] text-blue-400">mail</span>
                  {currentUser.email}
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Supabase PostgreSQL Conectado
                </span>
              </div>
            </div>
          </div>

          {/* Quick User Switcher CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={openAuthModal}
              className="bg-[#0f172a] hover:bg-[#1e293b] text-gray-200 border border-gray-600 hover:border-[#39a900] text-xs font-mono px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              title="Cambiar usuario o perfil de Supabase"
            >
              <span className="material-symbols-outlined text-[18px] text-[#39a900]">switch_account</span>
              <span>Cambiar Perfil DB</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-[#0b1222] border border-gray-700 px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium text-gray-300 shadow-sm">
              <span className="material-symbols-outlined text-[#39a900] text-[18px]">
                calendar_today
              </span>
              <span>28 Ago 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic 4 KPI Cards Tailored to the Logged-in User's Role */}
      {isAprendiz ? (
        /* KPIs for Aprendiz */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* KPI 1: Estado Expediente */}
          <div 
            onClick={() => displayedCases[0]?.id && navigateTo('case-detail', displayedCases[0].id)}
            className="bg-[#1a1c1c] rounded-xl p-6 border border-[#2d2f2f] hover:border-[#39a900]/50 transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#39a900]/15 text-[#39a900] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">badge</span>
              </div>
              <span className="text-[11px] font-mono font-medium text-[#39a900] bg-[#39a900]/10 border border-[#39a900]/20 px-2.5 py-0.5 rounded-full">
                Mi Estado
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white font-mono tracking-tight">Activo en Formación</h3>
            <p className="text-xs font-medium text-gray-400 mt-1">Ficha: 2712489 • CBA Mosquera</p>
          </div>

          {/* KPI 2: Medidas Formativas Notificadas */}
          <div 
            onClick={() => navigateTo('warning-1')}
            className="bg-[#1a1c1c] rounded-xl p-6 border border-[#2d2f2f] hover:border-[#39a900]/50 transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#39a900]/15 text-[#39a900] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">assignment_turned_in</span>
              </div>
              <span className="text-[11px] font-mono font-medium text-[#39a900] bg-[#39a900]/10 border border-[#39a900]/20 px-2.5 py-0.5 rounded-full">
                Art. 45 / 46
              </span>
            </div>
            <h3 className="text-4xl font-bold text-white font-mono tracking-tight">
              {displayedCases[0]?.priorSanctions?.length || 1}
            </h3>
            <p className="text-xs font-medium text-gray-400 mt-1">Medidas Formativas Notificadas</p>
          </div>

          {/* KPI 3: Citaciones / Comités */}
          <div 
            onClick={() => displayedCases[0]?.id && navigateTo('committee-schedule', displayedCases[0].id)}
            className="bg-[#1a1c1c] rounded-xl p-6 border border-[#2d2f2f] hover:border-[#50e5f9]/50 transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#3d6281]/25 text-[#50e5f9] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">gavel</span>
              </div>
              <span className="text-[11px] font-mono font-medium text-[#50e5f9] bg-[#50e5f9]/10 border border-[#50e5f9]/20 px-2.5 py-0.5 rounded-full">
                Garantía Debido Proceso
              </span>
            </div>
            <h3 className="text-4xl font-bold text-white font-mono tracking-tight">
              {displayedCases.length > 0 ? 1 : 0}
            </h3>
            <p className="text-xs font-medium text-gray-400 mt-1">Citaciones a Comité</p>
          </div>

          {/* KPI 4: Término para Descargos */}
          <div 
            onClick={() => displayedCases[0]?.id && navigateTo('case-detail', displayedCases[0].id)}
            className="bg-[#1a1c1c] rounded-xl p-6 border border-emerald-900/40 hover:border-emerald-500 transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/50 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">timer</span>
              </div>
              <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                SLA Término Legal
              </span>
            </div>
            <h3 className="text-4xl font-bold text-emerald-400 font-mono tracking-tight">
              {displayedCases[0]?.slaDaysRemaining || 5} Días
            </h3>
            <p className="text-xs font-medium text-gray-400 mt-1">Plazo para Radicar Descargos</p>
          </div>
        </div>
      ) : isInstructor ? (
        /* KPIs for Instructor */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* KPI 1: Expedientes de Ficha */}
          <div 
            onClick={() => cases[0]?.id && navigateTo('case-detail', cases[0].id)}
            className="bg-[#1a1c1c] rounded-xl p-6 border border-[#2d2f2f] hover:border-[#39a900]/50 transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#39a900]/15 text-[#39a900] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">folder_shared</span>
              </div>
              <span className="text-[11px] font-mono font-medium text-[#39a900] bg-[#39a900]/10 border border-[#39a900]/20 px-2.5 py-0.5 rounded-full">
                Fichas a Cargo
              </span>
            </div>
            <h3 className="text-4xl font-bold text-white font-mono tracking-tight">{cases.length}</h3>
            <p className="text-xs font-medium text-gray-400 mt-1">Expedientes en Seguimiento</p>
          </div>

          {/* KPI 2: Medidas Formativas (Art. 45/46) */}
          <div 
            onClick={() => navigateTo('warning-1')}
            className="bg-[#1a1c1c] rounded-xl p-6 border border-[#2d2f2f] hover:border-[#39a900]/50 transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#39a900]/15 text-[#39a900] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">edit_note</span>
              </div>
              <span className="text-[11px] font-mono font-medium text-[#39a900] bg-[#39a900]/10 border border-[#39a900]/20 px-2.5 py-0.5 rounded-full">
                Pedagógico
              </span>
            </div>
            <h3 className="text-4xl font-bold text-white font-mono tracking-tight">
              {cases.reduce((acc, c) => acc + (c.priorSanctions?.length || 0), 0)}
            </h3>
            <p className="text-xs font-medium text-gray-400 mt-1">Llamados de Atención y Planes</p>
          </div>

          {/* KPI 3: Casos Remitidos a Comité */}
          <div 
            onClick={() => navigateTo('smart-triage')}
            className="bg-[#1a1c1c] rounded-xl p-6 border border-[#2d2f2f] hover:border-[#50e5f9]/50 transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#3d6281]/25 text-[#50e5f9] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">forward_to_inbox</span>
              </div>
              <span className="text-[11px] font-mono font-medium text-[#50e5f9] bg-[#50e5f9]/10 border border-[#50e5f9]/20 px-2.5 py-0.5 rounded-full">
                Remisión
              </span>
            </div>
            <h3 className="text-4xl font-bold text-white font-mono tracking-tight">
              {cases.filter(c => c.severity === 'Grave' || c.severity === 'Gravísima').length}
            </h3>
            <p className="text-xs font-medium text-gray-400 mt-1">Solicitudes Radicadas a Comité</p>
          </div>

          {/* KPI 4: Alertas de Inasistencia / SLA */}
          <div 
            onClick={() => cases[0]?.id && navigateTo('case-detail', cases[0].id)}
            className="bg-[#1a1c1c] rounded-xl p-6 border border-amber-900/40 hover:border-amber-500 transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-950/50 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">notification_important</span>
              </div>
              <span className="text-[11px] font-mono font-medium text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                Seguimiento
              </span>
            </div>
            <h3 className="text-4xl font-bold text-amber-400 font-mono tracking-tight">
              {cases.filter(c => c.slaStatus === 'warning' || c.slaStatus === 'critical').length}
            </h3>
            <p className="text-xs font-medium text-gray-400 mt-1">Alertas Pedagógicas Activas</p>
          </div>
        </div>
      ) : (
        /* KPIs for Coordinador & Comité */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* KPI 1: Casos Activos */}
          <div 
            onClick={() => cases[0]?.id && navigateTo('case-detail', cases[0].id)}
            className="bg-[#1a1c1c] rounded-xl p-6 border border-[#2d2f2f] hover:border-[#39a900]/50 transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#39a900]/15 text-[#39a900] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">folder_open</span>
              </div>
              <span className="text-[11px] font-mono font-medium text-[#39a900] bg-[#39a900]/10 border border-[#39a900]/20 px-2.5 py-0.5 rounded-full">
                Supabase DB
              </span>
            </div>
            <h3 className="text-4xl font-bold text-white font-mono tracking-tight">{cases.length}</h3>
            <p className="text-xs font-medium text-gray-400 mt-1">Expedientes en Base de Datos</p>
          </div>

          {/* KPI 2: Próximos Comités */}
          <div 
            onClick={() => cases[0]?.id && navigateTo('committee-schedule', cases[0].id)}
            className="bg-[#1a1c1c] rounded-xl p-6 border border-[#2d2f2f] hover:border-[#50e5f9]/50 transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#3d6281]/25 text-[#50e5f9] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">gavel</span>
              </div>
              <span className="text-[11px] font-mono font-medium text-[#50e5f9] bg-[#50e5f9]/10 border border-[#50e5f9]/20 px-2.5 py-0.5 rounded-full">
                Debido Proceso
              </span>
            </div>
            <h3 className="text-4xl font-bold text-white font-mono tracking-tight">
              {cases.filter(c => c.timeline?.some(t => t.title.toLowerCase().includes('comité'))).length}
            </h3>
            <p className="text-xs font-medium text-gray-400 mt-1">Sesiones de Comité Programadas</p>
          </div>

          {/* KPI 3: Alertas SLA Críticas */}
          <div 
            onClick={() => cases[0]?.id && navigateTo('case-detail', cases[0].id)}
            className="bg-[#1a1c1c] rounded-xl p-6 border border-red-900/40 hover:border-red-500 transition-all cursor-pointer group shadow-sm relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-950/50 text-[#d32f2f] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">warning</span>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#d32f2f] animate-ping"></div>
            </div>
            <h3 className="text-4xl font-bold text-[#d32f2f] font-mono tracking-tight">
              {cases.filter(c => c.slaStatus === 'critical' || c.slaStatus === 'warning').length}
            </h3>
            <p className="text-xs font-medium text-gray-400 mt-1">Alertas SLA Activas (3 / 15 días)</p>
          </div>

          {/* KPI 4: Planes de Mejoramiento */}
          <div 
            onClick={() => cases[0]?.id && navigateTo('executor-session', cases[0].id)}
            className="bg-[#1a1c1c] rounded-xl p-6 border border-[#2d2f2f] hover:border-[#39a900]/50 transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#39a900]/15 text-[#39a900] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">assignment_turned_in</span>
              </div>
              <span className="text-[11px] font-mono font-medium text-[#39a900] bg-[#39a900]/10 border border-[#39a900]/20 px-2.5 py-0.5 rounded-full">
                Formativo
              </span>
            </div>
            <h3 className="text-4xl font-bold text-white font-mono tracking-tight">
              {cases.reduce((acc, c) => acc + (c.priorSanctions?.length || 0), 0)}
            </h3>
            <p className="text-xs font-medium text-gray-400 mt-1">Medidas Formativas (Art. 45/46)</p>
          </div>
        </div>
      )}

      {/* Role-Specific Quick Action Panel */}
      <div className="bg-[#141b2d] border border-gray-700/60 rounded-xl p-5 shadow-sm text-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-gray-300 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#39a900] text-[20px]">bolt</span>
            <span>Acciones Rápidas Autorizadas para: {currentUser.roleTitle}</span>
          </h3>
          <span className="text-[11px] font-mono text-[#39a900] bg-[#39a900]/10 px-2 py-0.5 rounded">
            Acuerdo 0009 de 2024
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {isAprendiz ? (
            <>
              <button
                onClick={() => displayedCases[0]?.id && navigateTo('case-detail', displayedCases[0].id)}
                className="p-3 bg-[#0f172a] hover:bg-[#1e293b] border border-gray-700 hover:border-[#39a900] rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 text-[#39a900] mb-1 font-bold text-xs">
                  <span className="material-symbols-outlined text-[18px]">folder_shared</span>
                  <span>Consultar Mi Expediente Único</span>
                </div>
                <p className="text-[11px] text-gray-400">Ver hoja de ruta formativa, evidencias y garantías.</p>
              </button>

              <button
                onClick={() => displayedCases[0]?.id && navigateTo('committee-schedule', displayedCases[0].id)}
                className="p-3 bg-[#0f172a] hover:bg-[#1e293b] border border-gray-700 hover:border-[#50e5f9] rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 text-[#50e5f9] mb-1 font-bold text-xs">
                  <span className="material-symbols-outlined text-[18px]">gavel</span>
                  <span>Radicar Escrito de Descargos</span>
                </div>
                <p className="text-[11px] text-gray-400">Presentar versión libre y pruebas ante el comité evaluador.</p>
              </button>

              <button
                onClick={() => navigateTo('warning-1')}
                className="p-3 bg-[#0f172a] hover:bg-[#1e293b] border border-gray-700 hover:border-amber-400 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 text-amber-400 mb-1 font-bold text-xs">
                  <span className="material-symbols-outlined text-[18px]">mark_email_read</span>
                  <span>Constancia de Notificación</span>
                </div>
                <p className="text-[11px] text-gray-400">Verificar notificaciones institucionales recibidas.</p>
              </button>
            </>
          ) : isInstructor ? (
            <>
              <button
                onClick={() => navigateTo('warning-1')}
                className="p-3 bg-[#0f172a] hover:bg-[#1e293b] border border-gray-700 hover:border-[#39a900] rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 text-[#39a900] mb-1 font-bold text-xs">
                  <span className="material-symbols-outlined text-[18px]">edit_document</span>
                  <span>Radicar Medida Formativa (Art. 45)</span>
                </div>
                <p className="text-[11px] text-gray-400">Registrar 1er o 2do llamado de atención académico/disciplinario.</p>
              </button>

              <button
                onClick={() => navigateTo('smart-triage')}
                className="p-3 bg-[#0f172a] hover:bg-[#1e293b] border border-gray-700 hover:border-emerald-400 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 text-emerald-400 mb-1 font-bold text-xs">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                  <span>Triage Normativo con Asistente IA</span>
                </div>
                <p className="text-[11px] text-gray-400">Tipificar faltas y evaluar reincidencia en el reglamento.</p>
              </button>

              <button
                onClick={() => cases[0]?.id && navigateTo('executor-session', cases[0].id)}
                className="p-3 bg-[#0f172a] hover:bg-[#1e293b] border border-gray-700 hover:border-[#50e5f9] rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 text-[#50e5f9] mb-1 font-bold text-xs">
                  <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                  <span>Plan de Mejoramiento (Art. 46)</span>
                </div>
                <p className="text-[11px] text-gray-400">Seguimiento a compromisos pedagógicos concertados.</p>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigateTo('smart-triage')}
                className="p-3 bg-[#0f172a] hover:bg-[#1e293b] border border-gray-700 hover:border-[#39a900] rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 text-[#39a900] mb-1 font-bold text-xs">
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Radicar Caso / Citación a Comité</span>
                </div>
                <p className="text-[11px] text-gray-400">Apertura formal de proceso con trazabilidad criptográfica.</p>
              </button>

              <button
                onClick={() => cases[0]?.id && navigateTo('committee-schedule', cases[0].id)}
                className="p-3 bg-[#0f172a] hover:bg-[#1e293b] border border-gray-700 hover:border-[#50e5f9] rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 text-[#50e5f9] mb-1 font-bold text-xs">
                  <span className="material-symbols-outlined text-[18px]">gavel</span>
                  <span>Sesión de Comité en Curso</span>
                </div>
                <p className="text-[11px] text-gray-400">Deliberación, descargo de pruebas y recomendación.</p>
              </button>

              <button
                onClick={() => cases[0]?.id && navigateTo('case-detail', cases[0].id)}
                className="p-3 bg-[#0f172a] hover:bg-[#1e293b] border border-gray-700 hover:border-amber-400 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 text-amber-400 mb-1 font-bold text-xs">
                  <span className="material-symbols-outlined text-[18px]">draw</span>
                  <span>Firma Electrónica OTP de Actas</span>
                </div>
                <p className="text-[11px] text-gray-400">Verificación de quórum y suscripción con validez jurídica.</p>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Matriz de Control - Casos Recientes Sincronizados desde Supabase */}
      <div className="bg-[#1a1c1c] rounded-xl border border-[#2d2f2f] shadow-lg overflow-hidden">
        {/* Card Header */}
        <div className="p-6 border-b border-[#2d2f2f] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-[#1f2121]">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>{isAprendiz ? 'Mi Expediente Digital Único' : 'Matriz de Control - Expedientes Institucionales'}</span>
              <span className="text-[11px] font-mono text-[#39a900] bg-[#39a900]/15 px-2 py-0.5 rounded-full border border-[#39a900]/30">
                {displayedCases.length} Casos
              </span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {isAprendiz 
                ? `Vista personalizada para el aprendiz ${currentUser.name} • CC ${currentUser.documentNumber || ''}`
                : `Jurisdicción operativa: ${currentUser.center} (${currentUser.roleTitle})`
              }
            </p>
          </div>

          <button 
            onClick={() => navigateTo('smart-triage')}
            className="text-xs font-semibold text-[#39a900] hover:text-[#4ade80] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Ver matriz completa</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#171818] border-b border-[#2d2f2f] text-gray-400 text-[11px] font-mono uppercase tracking-wider">
                <th className="py-3.5 px-6 font-semibold">ID EXPEDIENTE / HASH</th>
                <th className="py-3.5 px-6 font-semibold">APRENDIZ / FICHA</th>
                <th className="py-3.5 px-6 font-semibold">TIPO DE FALTA</th>
                <th className="py-3.5 px-6 font-semibold">FASE ACTUAL</th>
                <th className="py-3.5 px-6 font-semibold text-center">SEMÁFORO SLA</th>
                <th className="py-3.5 px-6 font-semibold text-right">ACCIÓN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262828] text-sm">
              {displayedCases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-6 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-emerald-400 text-3xl">verified_user</span>
                      <p className="text-sm font-medium text-white">
                        {isAprendiz 
                          ? '¡Felicitaciones! No registra procesos disciplinarios activos en su expediente digital.' 
                          : 'No se encontraron expedientes en la base de datos de Supabase.'
                        }
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        Conectado a PostgreSQL (rhbgftvzqifdpwumknpn.supabase.co) • Ficha 2712489
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedCases.slice(0, 10).map((caseItem) => (
                  <tr 
                    key={caseItem.id}
                    onClick={() => navigateTo('case-detail', caseItem.id)}
                    className="hover:bg-[#252727] transition-colors cursor-pointer group"
                  >
                    {/* Case ID / Hash */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-100 group-hover:text-[#39a900] transition-colors">
                        {caseItem.id}
                      </div>
                      <div className="text-[11px] font-mono text-gray-400 mt-0.5 flex items-center gap-1">
                        <span>sha256:{caseItem.sha256.slice(0, 8)}...</span>
                        {caseItem.slaStatus === 'closed' && (
                          <span className="bg-[#2a2c2c] text-gray-300 text-[10px] px-1.5 py-0.2 rounded font-mono">
                            Verificado
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Apprentice */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-200">
                        {caseItem.apprentice.name}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        Ficha: {caseItem.apprentice.ficha} • {caseItem.apprentice.program || 'Tecnología SENA'}
                      </div>
                    </td>

                    {/* Type of fault */}
                    <td className="py-4 px-6 text-gray-300 text-xs font-medium">
                      {caseItem.faultCategory}
                    </td>

                    {/* Current phase */}
                    <td className="py-4 px-6 text-gray-300 text-xs font-medium">
                      {caseItem.currentPhase}
                    </td>

                    {/* Semaphore SLA */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center">
                        <SlaSemaphoreBadge 
                          status={caseItem.slaStatus} 
                          daysRemaining={caseItem.slaDaysRemaining} 
                        />
                      </div>
                    </td>

                    {/* Action button */}
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigateTo('case-detail', caseItem.id)}
                        className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#333] transition-colors cursor-pointer"
                        title="Ver Expediente"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {caseItem.faultCategory === 'Deserción' ? 'gavel' : 'visibility'}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-6 pb-4 border-t border-[#262828] flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-400">
        <div>
          © 2024 SENA - Sistema de Gestión de Rutas del Aprendiz y Debido Proceso. Todos los derechos reservados.
        </div>
        <div className="flex gap-5">
          <button onClick={() => navigateTo('public-portal')} className="hover:text-gray-300 underline cursor-pointer">
            Política de Privacidad
          </button>
          <button onClick={() => navigateTo('public-portal')} className="hover:text-gray-300 underline cursor-pointer">
            Términos de Uso
          </button>
          <button onClick={() => navigateTo('public-portal')} className="hover:text-gray-300 underline cursor-pointer">
            Soporte Técnico
          </button>
        </div>
      </footer>
    </div>
  );
};
