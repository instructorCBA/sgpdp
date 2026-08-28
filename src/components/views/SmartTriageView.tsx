import React, { useState } from 'react';
import { useCaseContext } from '../../context/CaseContext';

export const SmartTriageView: React.FC = () => {
  const { navigateTo, showToast } = useCaseContext();
  const [activeState, setActiveState] = useState<'a' | 'b' | 'c'>('a');
  const [docInput, setDocInput] = useState('');

  const handleSearch = () => {
    showToast('Búsqueda completada para el documento ingresado');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
          Redirección y Escalamiento
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Consulte el documento del aprendiz para determinar la ruta procesal aplicable según el{' '}
          <strong className="text-[#39a900]">Acuerdo 0009 de 2024</strong>.
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-[#39a900] text-[20px]">
            person_search
          </span>
          <span>Búsqueda de Aprendiz</span>
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
              badge
            </span>
            <input
              type="text"
              value={docInput}
              onChange={(e) => setDocInput(e.target.value)}
              placeholder="Número de Documento"
              className="w-full bg-[#252727] border border-[#333] text-white rounded-lg py-2.5 pl-10 pr-4 text-xs font-mono placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#39a900]"
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="bg-[#39a900] hover:bg-[#329600] text-white text-xs font-bold py-2.5 px-5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span>Consultar Historial</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 8 cols left result, 4 cols right metadata & estimated path */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* State A: Sin Antecedentes */}
          {activeState === 'a' && (
            <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 space-y-6 animate-fadeIn shadow-sm">
              <div className="border-b border-[#2d2f2f] pb-4">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-xl font-bold text-white tracking-tight">Juan Pérez Gómez</h4>
                  <span className="bg-[#39a900]/15 text-[#39a900] border border-[#39a900]/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    SIN ANTECEDENTES
                  </span>
                </div>
                <p className="text-xs font-mono text-gray-400">
                  CC 1.020.334.556 | Ficha: 2548900 - ADSO
                </p>
              </div>

              {/* 2 Options Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: Generar 1er Llamado */}
                <div
                  onClick={() => navigateTo('warning-1')}
                  className="bg-[#252727]/70 border border-[#2d2f2f] hover:border-[#39a900] rounded-xl p-5 cursor-pointer transition-all hover:bg-[#39a900]/5 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#1a1c1c] border border-[#333] flex items-center justify-center text-gray-300 group-hover:text-[#39a900] group-hover:border-[#39a900]/40 transition-colors mb-4">
                      <span className="material-symbols-outlined text-[20px]">description</span>
                    </div>
                    <h5 className="text-sm font-bold text-white mb-2 group-hover:text-[#39a900] transition-colors">
                      Generar 1er Llamado de Atención
                    </h5>
                    <p className="text-xs text-gray-400 leading-relaxed font-mono">
                      Inicia el debido proceso por falta leve o académica menor. Requiere firma del instructor.
                    </p>
                  </div>
                </div>

                {/* Option 2: Reportar Falta Gravísima */}
                <div
                  onClick={() => navigateTo('committee-request', 'EXP-2024-GRAVE-01')}
                  className="bg-[#252727]/70 border border-[#2d2f2f] hover:border-red-600 rounded-xl p-5 cursor-pointer transition-all hover:bg-red-950/15 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#1a1c1c] border border-[#333] flex items-center justify-center text-gray-300 group-hover:text-red-400 group-hover:border-red-500/40 transition-colors mb-4">
                      <span className="material-symbols-outlined text-[20px]">gavel</span>
                    </div>
                    <h5 className="text-sm font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                      Reportar Falta Gravísima
                    </h5>
                    <p className="text-xs text-gray-400 leading-relaxed font-mono">
                      Citación directa a Comité de Evaluación y Seguimiento (Art. 32 Acuerdo 0009).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* State B: Con 1er Llamado */}
          {activeState === 'b' && (
            <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 space-y-6 animate-fadeIn shadow-sm">
              <div className="border-b border-[#2d2f2f] pb-4">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-xl font-bold text-white tracking-tight">Juan Pérez Gómez</h4>
                  <span className="bg-[#fdc300]/15 text-[#fdc300] border border-[#fdc300]/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    CON 1ER LLAMADO ACTIVO
                  </span>
                </div>
                <p className="text-xs font-mono text-gray-400">
                  CC 1.020.334.556 | Ficha: 2548900 - ADSO
                </p>
              </div>

              <div className="bg-[#252727] rounded-xl p-4 border border-[#fdc300]/30 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#fdc300] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">history</span>
                    1er Llamado de Atención Escrito
                  </span>
                  <span className="text-gray-400 font-mono">12 Oct 2024</span>
                </div>
                <p className="text-gray-300 font-mono text-[11px] mb-2 leading-relaxed">
                  Inasistencias injustificadas superiores al 20% y retraso en evidencias de aprendizaje.
                </p>
                <div className="text-[10px] font-mono text-gray-400">
                  HASH: <span className="text-gray-300">8f4e2a...b9c1</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Action 1: 2do Llamado */}
                <div
                  onClick={() => navigateTo('warning-2')}
                  className="bg-[#252727]/70 border border-[#2d2f2f] hover:border-[#39a900] rounded-xl p-5 cursor-pointer transition-all hover:bg-[#39a900]/5 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1a1c1c] border border-[#333] flex items-center justify-center text-gray-300 group-hover:text-[#39a900] mb-4">
                    <span className="material-symbols-outlined text-[20px]">edit_note</span>
                  </div>
                  <h5 className="text-sm font-bold text-white mb-2 group-hover:text-[#39a900] transition-colors">
                    Generar 2do Llamado de Atención
                  </h5>
                  <p className="text-xs text-gray-400 leading-relaxed font-mono">
                    Registrar acta de equipo ejecutor y segundo llamado conforme al Art. 46 del Acuerdo 0009.
                  </p>
                </div>

                {/* Action 2: Citación Directa a Comité */}
                <div
                  onClick={() => navigateTo('committee-request', 'EXP-2024-001')}
                  className="bg-[#252727]/70 border border-[#2d2f2f] hover:border-[#fdc300] rounded-xl p-5 cursor-pointer transition-all hover:bg-yellow-950/10 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1a1c1c] border border-[#333] flex items-center justify-center text-gray-300 group-hover:text-[#fdc300] mb-4">
                    <span className="material-symbols-outlined text-[20px]">meeting_room</span>
                  </div>
                  <h5 className="text-sm font-bold text-white mb-2 group-hover:text-[#fdc300] transition-colors">
                    Solicitud de Citación a Comité
                  </h5>
                  <p className="text-xs text-gray-400 leading-relaxed font-mono">
                    Escalamiento por reiteración de faltas o incumplimiento de compromisos formativos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* State C: Expediente Abierto */}
          {activeState === 'c' && (
            <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 space-y-6 animate-fadeIn shadow-sm">
              <div className="border-b border-[#2d2f2f] pb-4">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-xl font-bold text-white tracking-tight">Juan Pérez Gómez</h4>
                  <span className="bg-red-950/30 text-red-400 border border-red-800/40 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">folder_open</span>
                    EXPEDIENTE EN TRÁMITE
                  </span>
                </div>
                <p className="text-xs font-mono text-gray-400">
                  CC 1.020.334.556 | Ficha: 2548900 - ADSO
                </p>
              </div>

              <div className="bg-[#252727] rounded-xl p-4 border-l-4 border-l-red-500 border-y border-r border-[#2d2f2f] text-xs space-y-2">
                <h5 className="font-bold text-white">Principio de Unicidad Procesal</h5>
                <p className="text-gray-300 font-mono text-[11px] leading-relaxed">
                  El aprendiz cuenta con el expediente activo <strong>EXP-2024-001</strong>. Cualquier nuevo hecho probatorio debe adicionarse directamente al expediente vigente.
                </p>
              </div>

              <button
                onClick={() => navigateTo('case-detail', 'EXP-2024-001')}
                className="w-full bg-[#39a900] hover:bg-[#329600] text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">folder_open</span>
                <span>Ver Expediente EXP-2024-001</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Metadatos del Trámite & Ruta Procesal Estimada */}
        <div className="lg:col-span-4 space-y-6">
          {/* Metadatos del Trámite Card */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-5 shadow-sm space-y-3 text-xs">
            <h3 className="font-mono font-bold text-white uppercase tracking-wider border-b border-[#2d2f2f] pb-2 flex items-center gap-2 text-[11px]">
              <span className="material-symbols-outlined text-[16px] text-gray-300">badge</span>
              <span>Metadatos del Trámite</span>
            </h3>

            <div className="space-y-2.5 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Sede:</span>
                <strong className="text-gray-200">Reg. Distrito Capital</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Fecha Actual:</span>
                <strong className="text-gray-200">24 Oct 2024</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">ID Sesión:</span>
                <strong className="text-gray-200">TRX-9982-A</strong>
              </div>
            </div>
          </div>

          {/* Ruta Procesal Estimada Card */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-mono font-bold text-white uppercase tracking-wider border-b border-[#2d2f2f] pb-2 flex items-center gap-2 text-[11px]">
              <span className="material-symbols-outlined text-[16px] text-gray-300">alt_route</span>
              <span>Ruta Procesal Estimada</span>
            </h3>

            <div className="relative pl-6 space-y-5 before:absolute before:inset-y-2 before:left-2.5 before:w-[2px] before:bg-[#2d2f2f]">
              {/* Step 1: Registro Inicial (Active Green) */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-5 h-5 rounded-full border-2 border-[#39a900] bg-[#1a1c1c] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#39a900]"></div>
                </div>
                <h4 className="text-xs font-bold text-white font-mono leading-tight">
                  Registro Inicial
                </h4>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                  Creación del reporte
                </p>
              </div>

              {/* Step 2: Notificación */}
              <div className="relative opacity-60">
                <div className="absolute -left-[27px] top-0 w-5 h-5 rounded-full border-2 border-gray-600 bg-[#1a1c1c] flex items-center justify-center"></div>
                <h4 className="text-xs font-bold text-gray-300 font-mono leading-tight">
                  Notificación
                </h4>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                  SLA: 3 días hábiles
                </p>
              </div>

              {/* Step 3: Respuesta / Descargos */}
              <div className="relative opacity-40">
                <div className="absolute -left-[27px] top-0 w-5 h-5 rounded-full border-2 border-gray-700 bg-[#1a1c1c] flex items-center justify-center"></div>
                <h4 className="text-xs font-bold text-gray-400 font-mono leading-tight">
                  Respuesta / Descargos
                </h4>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                  SLA: 5 días hábiles
                </p>
              </div>
            </div>

            {/* SLA Info Card */}
            <div className="bg-[#252727] rounded-xl p-3 border border-[#333] flex items-start gap-2.5 text-[11px] text-gray-300 leading-relaxed font-mono">
              <span className="material-symbols-outlined text-[#fdc300] text-[18px] shrink-0 mt-0.5">
                schedule
              </span>
              <span>
                Los tiempos SLA (Semáforo) se activarán una vez radicado el documento oficial.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Bottom Bar */}
      <div className="bg-[#1a1c1c] border border-[#2d2f2f] border-dashed rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-gray-400 font-mono font-medium">
          Simulador de Estados:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveState('a')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeState === 'a'
                ? 'bg-[#252727] text-white border border-gray-500'
                : 'bg-[#1a1c1c] text-gray-400 hover:text-gray-200 border border-[#333]'
            }`}
          >
            Sin Antecedentes
          </button>
          <button
            type="button"
            onClick={() => setActiveState('b')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeState === 'b'
                ? 'bg-[#252727] text-white border border-gray-500'
                : 'bg-[#1a1c1c] text-gray-400 hover:text-gray-200 border border-[#333]'
            }`}
          >
            Con 1er Llamado
          </button>
          <button
            type="button"
            onClick={() => setActiveState('c')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeState === 'c'
                ? 'bg-[#252727] text-white border border-gray-500'
                : 'bg-[#1a1c1c] text-gray-400 hover:text-gray-200 border border-[#333]'
            }`}
          >
            Expediente Abierto
          </button>
        </div>
      </div>
    </div>
  );
};
