import React, { useState } from 'react';
import { useCaseContext } from '../../context/CaseContext';

export const CommitteeRequestView: React.FC = () => {
  const { selectedCase, navigateTo, showToast } = useCaseContext();
  
  // Is this accelerated gravísima or improvement plan breach?
  const isAcceleratedInitial = selectedCase?.severity === 'Gravísima' || selectedCase?.id === 'EXP-2024-GRAVE-01';
  const [isAccelerated, setIsAccelerated] = useState(isAcceleratedInitial);

  const [clasificacion, setClasificacion] = useState<'leve' | 'grave' | 'gravisima'>(
    isAccelerated ? 'gravisima' : 'grave'
  );
  
  const [hechos, setHechos] = useState(
    isAccelerated
      ? 'Se detectó suplantación y fraude de identidad durante la evaluación final. El aprendiz permitió que un tercero realizara la prueba técnica usando sus credenciales institucionales.'
      : 'El aprendiz no presentó las evidencias acordadas en la fecha límite establecida (30 de Octubre de 2024). Persiste el incumplimiento en los entregables del módulo de Base de Datos y no asistió a las sesiones de asesoría programadas.'
  );

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Solicitud de citación enviada exitosamente a Coordinación Académica');
    navigateTo('committee-schedule', selectedCase?.id || 'EXP-2024-001');
  };

  const currentCaseId = selectedCase?.id || (isAccelerated ? 'EXP-2024-0892' : 'EXP-2024-001');
  const apprenticeName = selectedCase?.apprentice.name || (isAccelerated ? 'Carlos Rodriguez' : 'Carlos Mendoza Ruiz');
  const apprenticeAvatar = selectedCase?.apprentice.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250';
  const apprenticeDoc = selectedCase?.apprentice.documentNumber || 'CC. 1.023.456.789';
  const apprenticeProgram = selectedCase?.apprentice.program || 'Tecnólogo en Análisis y Desarrollo de Software';
  const apprenticeFicha = selectedCase?.apprentice.ficha || '2556789';

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <button
            onClick={() => navigateTo('dashboard')}
            className="hover:text-gray-200 cursor-pointer"
          >
            Expedientes
          </button>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-gray-200 font-bold">{currentCaseId}</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-gray-300">Solicitud de Citación</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher for demo */}
          <div className="flex bg-[#1a1c1c] border border-[#2d2f2f] rounded-lg p-0.5 text-[11px] font-mono">
            <button
              onClick={() => {
                setIsAccelerated(false);
                setClasificacion('grave');
              }}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                !isAccelerated ? 'bg-[#252727] text-white font-bold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Incumplimiento Plan
            </button>
            <button
              onClick={() => {
                setIsAccelerated(true);
                setClasificacion('gravisima');
              }}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                isAccelerated ? 'bg-red-950/60 text-red-300 font-bold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Falta Gravísima
            </button>
          </div>

          <button
            onClick={() => showToast('Generando borrador de impresión en PDF...')}
            className="flex items-center gap-1.5 bg-[#1a1c1c] hover:bg-[#252727] border border-[#2d2f2f] text-gray-300 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Imprimir Borrador</span>
          </button>
        </div>
      </div>

      {/* Header Badge */}
      <div className="flex items-center gap-2">
        <span className="bg-[#fdc300]/15 text-[#fdc300] border border-[#fdc300]/30 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">warning</span>
          Requiere Escalamiento
        </span>
        <span className="bg-[#1a1c1c] border border-[#2d2f2f] text-gray-400 px-2 py-0.5 rounded text-[11px] font-mono">
          ID: {currentCaseId}
        </span>
      </div>

      {/* Title & Subtitle */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
          Solicitud de Citación a Comité
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          {isAccelerated
            ? 'Escalamiento directo por calificación de Falta Grave o Gravísima.'
            : 'Escalamiento formal por incumplimiento reiterado del Plan de Mejoramiento #1.'}
        </p>
      </div>

      {/* Alert Banner for Gravísima (When applicable) */}
      {isAccelerated && (
        <div className="bg-red-950/30 border-l-4 border-red-600 rounded-r-xl p-4 flex items-start gap-3 shadow-sm">
          <span className="material-symbols-outlined text-red-500 text-[24px] shrink-0 mt-0.5">
            warning
          </span>
          <div className="text-xs">
            <strong className="text-white font-bold block mb-0.5">
              PROCESO ACELERADO: Falta Gravísima detectada
            </strong>
            <span className="text-gray-300 leading-relaxed">
              Omisión de etapas conciliatorias según Art. 51. El caso se escala directamente para sesión extraordinaria de comité.
            </span>
          </div>
        </div>
      )}

      {/* Main Grid: 8 cols left, 4 cols right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Información del Aprendiz */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-[#2d2f2f] pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-gray-400">person</span>
              <span>INFORMACIÓN DEL APRENDIZ</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={apprenticeAvatar}
                alt={apprenticeName}
                className="w-16 h-16 rounded-xl object-cover border border-[#333] shrink-0"
              />
              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-gray-400 block text-[11px]">Nombre Completo</span>
                  <strong className="text-white text-sm font-sans">{apprenticeName}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Documento</span>
                  <span className="text-gray-200">{apprenticeDoc}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Programa de Formación</span>
                  <span className="text-gray-300 font-sans">{apprenticeProgram}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Fase Actual / Ficha</span>
                  <span className="text-gray-200">Fase Ejecución / {apprenticeFicha}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Detalles de la Solicitud / Fundamento */}
          <form onSubmit={handleSendRequest} className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-[#2d2f2f] pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#39a900]">description</span>
              <span>{isAccelerated ? 'FUNDAMENTO DE LA SOLICITUD' : 'Detalles de la Solicitud'}</span>
            </h3>

            {/* Motivo de la Citación (When not accelerated) */}
            {!isAccelerated && (
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5">
                  Motivo de la Citación
                </label>
                <div className="bg-[#252727] border border-[#333] rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-200">
                    <span className="material-symbols-outlined text-red-400 text-[18px]">cancel</span>
                    <span>Incumplimiento de Plan de Mejoramiento #1</span>
                  </div>
                  <span className="bg-[#1a1c1c] text-gray-400 border border-[#333] px-2 py-0.5 rounded text-[10px] font-mono">
                    Autocompletado del Sist.
                  </span>
                </div>
              </div>
            )}

            {/* Descripción de los Hechos */}
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5">
                Descripción de los Hechos (Falta) <span className="text-red-400">*</span>
              </label>
              <p className="text-[11px] text-gray-400 mb-2 leading-tight">
                Detalle de manera objetiva los eventos que motivan esta solicitud, especificando fechas y entregables no cumplidos.
              </p>
              <textarea
                rows={4}
                value={hechos}
                onChange={(e) => setHechos(e.target.value)}
                placeholder="Ingrese el relato detallado aquí..."
                className="w-full bg-[#252727] border border-[#333] text-gray-200 rounded-lg p-3 text-xs font-mono placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#39a900] leading-relaxed"
              />
            </div>

            {/* Evidencias Vinculadas (Provenientes del Plan de Mejoramiento) */}
            {!isAccelerated && (
              <div className="space-y-2.5">
                <label className="block text-xs font-mono text-gray-300">
                  Evidencias Vinculadas (Provenientes del Plan de Mejoramiento)
                </label>
                
                {/* Evidence Item 1 */}
                <div className="bg-[#252727] border border-[#2d2f2f] rounded-xl p-3 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-400 shrink-0">
                      <span className="material-symbols-outlined text-[18px]">priority_high</span>
                    </div>
                    <div>
                      <strong className="text-white block text-xs">Lista de Chequeo Final (No Cumple)</strong>
                      <span className="text-[11px] text-gray-400">
                        SHA-256: 8f4e...2a1b • Hace 2 horas
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Visualizando Lista de Chequeo Final...')}
                    className="p-1.5 text-gray-400 hover:text-white rounded transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                  </button>
                </div>

                {/* Evidence Item 2 */}
                <div className="bg-[#252727] border border-[#2d2f2f] rounded-xl p-3 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#39a900]/15 border border-[#39a900]/30 flex items-center justify-center text-[#39a900] shrink-0">
                      <span className="material-symbols-outlined text-[18px]">description</span>
                    </div>
                    <div>
                      <strong className="text-white block text-xs">Acta de Sesión de Equipo Ejecutor</strong>
                      <span className="text-[11px] text-gray-400">
                        SHA-256: 3c9d...7f4e • Ayer, 14:30
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Visualizando Acta de Sesión...')}
                    className="p-1.5 text-gray-400 hover:text-white rounded transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => showToast('Abriendo gestor de evidencias...')}
                  className="text-xs text-[#39a900] hover:text-[#329600] font-mono font-semibold flex items-center gap-1 mt-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  <span>Vincular evidencia adicional</span>
                </button>
              </div>
            )}

            {/* Clasificación Sugerida de la Falta */}
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-2">
                Clasificación Sugerida de la Falta <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Leve */}
                <div
                  onClick={() => setClasificacion('leve')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    clasificacion === 'leve'
                      ? 'border-[#39a900] bg-[#39a900]/10 text-white'
                      : 'border-[#2d2f2f] bg-[#252727]/60 text-gray-400 hover:bg-[#252727]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-xs font-bold font-mono">Leve</strong>
                    {clasificacion === 'leve' && (
                      <span className="material-symbols-outlined text-[#39a900] text-[16px]">check_circle</span>
                    )}
                  </div>
                  <span className="text-[11px] opacity-75 font-mono">Art. 24 Reg.</span>
                </div>

                {/* Grave */}
                <div
                  onClick={() => setClasificacion('grave')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    clasificacion === 'grave'
                      ? 'border-[#fdc300] bg-yellow-950/30 text-white'
                      : 'border-[#2d2f2f] bg-[#252727]/60 text-gray-400 hover:bg-[#252727]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-xs font-bold font-mono text-[#fdc300]">Grave</strong>
                    {clasificacion === 'grave' && (
                      <span className="material-symbols-outlined text-[#fdc300] text-[16px]">check_circle</span>
                    )}
                  </div>
                  <span className="text-[11px] opacity-75 font-mono">Art. 25 Reg.</span>
                </div>

                {/* Gravísima */}
                <div
                  onClick={() => setClasificacion('gravisima')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    clasificacion === 'gravisima'
                      ? 'border-red-600 bg-red-950/40 text-white'
                      : 'border-[#2d2f2f] bg-[#252727]/60 text-gray-400 hover:bg-[#252727]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-xs font-bold font-mono text-red-400">Gravísima</strong>
                    {clasificacion === 'gravisima' && (
                      <span className="material-symbols-outlined text-red-400 text-[16px]">check_circle</span>
                    )}
                  </div>
                  <span className="text-[11px] opacity-75 font-mono">Art. 26 Reg.</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column (4 cols): ESTADO DEL BORRADOR & RUTA DEL EXPEDIENTE */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: ESTADO DEL BORRADOR */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-5 shadow-sm space-y-4">
            <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block border-b border-[#2d2f2f] pb-2">
              ESTADO DEL BORRADOR
            </span>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fdc300]"></span>
              <strong className="text-xs font-mono text-white">Edición en progreso</strong>
            </div>

            <p className="text-[11px] text-gray-300 font-mono leading-relaxed">
              Al enviar esta solicitud, se notificará al Coordinador Académico para programar la sesión del Comité de Evaluación y Seguimiento.
            </p>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleSendRequest}
                className="w-full bg-[#39a900] hover:bg-[#329600] active:scale-[0.98] text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_rgba(57,169,0,0.3)] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>{isAccelerated ? 'Enviar a Coordinación' : 'Enviar Solicitud'}</span>
              </button>

              <button
                type="button"
                onClick={() => showToast('Borrador guardado exitosamente')}
                className="w-full bg-[#252727] hover:bg-[#333] text-gray-200 border border-[#333] py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                <span>Guardar Borrador</span>
              </button>
            </div>
          </div>

          {/* Card: RUTA DEL EXPEDIENTE */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-5 shadow-sm space-y-5">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-[#2d2f2f] pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-gray-400">history</span>
              <span>RUTA DEL EXPEDIENTE</span>
            </h3>

            <div className="relative pl-6 space-y-5 before:absolute before:inset-y-2 before:left-2.5 before:w-[2px] before:bg-[#2d2f2f]">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-5 h-5 rounded-full bg-[#39a900] flex items-center justify-center text-white ring-4 ring-[#1a1c1c]">
                  <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                </div>
                <p className="text-[10px] text-gray-400 font-mono">Oct 15, 2024</p>
                <h4 className="text-xs font-bold text-white font-mono leading-tight">
                  Firma Plan de Mejoramiento
                </h4>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                  Acuerdo inicial establecido.
                </p>
              </div>

              {/* Step 2 (Incumplido) */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white ring-4 ring-[#1a1c1c]">
                  <span className="material-symbols-outlined text-[12px] font-bold">close</span>
                </div>
                <p className="text-[10px] text-gray-400 font-mono">Oct 30, 2024</p>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white font-mono leading-tight">
                    Evaluación de Plan
                  </h4>
                  <span className="bg-red-950/60 text-red-400 border border-red-800/60 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold">
                    INCUMPLIDO
                  </span>
                </div>
              </div>

              {/* Step 3 (Actual) */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-5 h-5 rounded-full border-2 border-[#fdc300] bg-[#1a1c1c] flex items-center justify-center ring-4 ring-[#1a1c1c]">
                  <div className="w-2 h-2 rounded-full bg-[#fdc300]"></div>
                </div>
                <p className="text-[10px] text-[#fdc300] font-mono font-bold">Actual</p>
                <h4 className="text-xs font-bold text-[#fdc300] font-mono leading-tight">
                  Citación a Comité
                </h4>
                <p className="text-[11px] text-gray-300 font-mono mt-0.5">
                  Elaboración de solicitud.
                </p>
              </div>

              {/* Step 4 (Pendiente) */}
              <div className="relative opacity-40">
                <div className="absolute -left-[27px] top-0 w-5 h-5 rounded-full border-2 border-gray-600 bg-[#1a1c1c] flex items-center justify-center ring-4 ring-[#1a1c1c]"></div>
                <p className="text-[10px] text-gray-500 font-mono">Pendiente</p>
                <h4 className="text-xs font-bold text-gray-400 font-mono leading-tight">
                  Revisión Coordinación
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
