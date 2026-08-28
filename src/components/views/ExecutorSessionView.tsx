import React, { useState } from 'react';
import { useCaseContext } from '../../context/CaseContext';

export const ExecutorSessionView: React.FC = () => {
  const { selectedCase, navigateTo, updateCase, showToast } = useCaseContext();

  const caseData = selectedCase || {
    id: 'EXP-2024-001',
    sha256: 'e3b0c442...',
    apprentice: {
      name: 'Carlos Mendoza Ruiz',
      documentNumber: '1.020.334.556',
      ficha: '2541982',
      program: 'Análisis y Desarrollo de Software',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    }
  };

  const [previousCommitments, setPreviousCommitments] = useState(
    'El aprendiz se comprometió a entregar los diagramas de casos de uso y el modelo entidad relación pendientes del módulo 3.'
  );
  const [sessionObservations, setSessionObservations] = useState(
    'Se realizó revisión conjunta con el instructor técnico. El aprendiz expuso dificultades de conectividad y demostró avances en el 60% de las actividades.'
  );
  const [improvementActivities, setImprovementActivities] = useState(
    '1. Desarrollar y sustentar el prototipo funcional en React.\n2. Completar las pruebas unitarias con cobertura mínima del 80%.\n3. Entregar la documentación técnica del sprint en Territorium.'
  );
  const [dueDate, setDueDate] = useState('2024-11-12');
  const [requiredEvidence, setRequiredEvidence] = useState('Listado de Chequeo de Producto');
  const [planUploaded, setPlanUploaded] = useState(false);
  const [checklistUploaded, setChecklistUploaded] = useState(false);

  const handleSubmitActa = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCase) {
      updateCase(selectedCase.id, {
        currentPhase: 'Plan de Mejoramiento en Curso',
        improvementPlan: {
          activities: improvementActivities,
          dueDate,
          requiredEvidence,
          signedPlanUrl: 'plan_mejoramiento_firmado.pdf',
          checklistUrl: 'lista_chequeo_producto.pdf',
        },
      });
    }
    showToast('Acta de Sesión y Plan de Mejoramiento registrados con éxito');
    navigateTo('plan-evaluation', selectedCase?.id || 'EXP-2024-001');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with Badges */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold bg-[#39a900]/15 text-[#39a900] border border-[#39a900]/30 px-2 py-0.5 rounded">
              EXP-2024-001
            </span>
            <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>SHA-256: e3b0c442...</span>
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
            Acta de Sesión y Plan de Mejoramiento
          </h2>
        </div>

        <div className="flex items-center gap-2 bg-[#252727] border border-[#2d2f2f] px-3.5 py-1.5 rounded-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-[#fdc300] animate-pulse"></div>
          <span className="text-xs font-mono font-bold text-white">SLA: 2 Días Hábiles</span>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Apprentice Card */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-4">
              INFORMACIÓN DEL APRENDIZ
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#2d2f2f] bg-[#121212] shrink-0">
                <img
                  src={caseData.apprentice.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'}
                  alt={caseData.apprentice.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 w-full">
                <h4 className="text-xl font-bold text-white tracking-tight">
                  {caseData.apprentice.name}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-3 bg-[#252727] p-3.5 rounded-xl border border-[#333] text-xs">
                  <div>
                    <span className="text-gray-400 block font-mono">Documento</span>
                    <strong className="text-white font-mono">{caseData.apprentice.documentNumber}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-mono">Ficha</span>
                    <strong className="text-white font-mono">{caseData.apprentice.ficha}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-400 block font-mono">Programa</span>
                    <strong className="text-white font-mono">{caseData.apprentice.program}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Historial Disciplinario Previo */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#2d2f2f] pb-3">
              <span className="material-symbols-outlined text-[#39a900] text-[20px]">
                history_edu
              </span>
              <span>Historial Disciplinario Previo</span>
            </h3>

            <div className="space-y-3">
              <div className="bg-[#252727] border border-[#2d2f2f] rounded-xl p-3.5 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white">Primer Llamado de Atención</h4>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">Fecha: 15 Sep 2024 | Instructor: Jorge Silva</p>
                </div>
                <span className="bg-[#171818] text-gray-300 text-[11px] font-mono px-3 py-1 rounded-full border border-[#333]">
                  Cerrado
                </span>
              </div>

              <div className="bg-[#252727] border border-[#2d2f2f] rounded-xl p-3.5 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white">Segundo Llamado de Atención</h4>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">Fecha: 05 Oct 2024 | Instructor: María G.</p>
                </div>
                <span className="bg-[#171818] text-gray-300 text-[11px] font-mono px-3 py-1 rounded-full border border-[#333]">
                  Cerrado
                </span>
              </div>
            </div>
          </div>

          {/* Detalles de la Sesión */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#2d2f2f] pb-3">
              <span className="material-symbols-outlined text-[#39a900] text-[20px]">
                meeting_room
              </span>
              <span>Detalles de la Sesión</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">
                  Resumen de Compromisos Previos
                </label>
                <textarea
                  rows={3}
                  value={previousCommitments}
                  onChange={(e) => setPreviousCommitments(e.target.value)}
                  placeholder="Ingrese el resumen de los compromisos adquiridos en sesiones anteriores..."
                  className="w-full bg-[#252727] border border-[#333] text-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#39a900] font-mono leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">
                  Observaciones del Equipo Ejecutor
                </label>
                <textarea
                  rows={4}
                  value={sessionObservations}
                  onChange={(e) => setSessionObservations(e.target.value)}
                  placeholder="Detalle las observaciones realizadas por instructores y coordinadores..."
                  className="w-full bg-[#252727] border border-[#333] text-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#39a900] font-mono leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Plan de Mejoramiento */}
          <form onSubmit={handleSubmitActa} className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#2d2f2f] pb-3">
              <span className="material-symbols-outlined text-[#39a900] text-[20px]">
                assignment
              </span>
              <span>Plan de Mejoramiento</span>
            </h3>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1.5">
                Descripción de Actividades
              </label>
              <textarea
                rows={4}
                value={improvementActivities}
                onChange={(e) => setImprovementActivities(e.target.value)}
                placeholder="Describa las actividades específicas que el aprendiz debe realizar..."
                className="w-full bg-[#252727] border border-[#333] text-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#39a900] font-mono leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">
                  Fecha Límite (Días Hábiles)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="w-full bg-[#252727] border border-[#333] text-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#39a900] font-mono [color-scheme:dark]"
                />
                <p className="text-[10px] text-gray-500 font-mono mt-1">
                  * Se excluyen sábados, domingos y festivos.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">
                  Evidencias Requeridas
                </label>
                <select
                  value={requiredEvidence}
                  onChange={(e) => setRequiredEvidence(e.target.value)}
                  className="w-full bg-[#252727] border border-[#333] text-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#39a900] font-mono"
                >
                  <option>Listado de Chequeo de Producto</option>
                  <option>Evaluación de Conocimiento</option>
                  <option>Entregable en Territorium</option>
                  <option>Sustentación Oral</option>
                </select>
              </div>
            </div>

            {/* 2 Upload Zones matching screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Zone 1: Plan firmado */}
              <div
                onClick={() => {
                  setPlanUploaded(true);
                  showToast('Documento de Plan de Mejoramiento cargado');
                }}
                className={`border-2 border-dashed ${planUploaded ? 'border-[#39a900] bg-[#39a900]/10' : 'border-[#333] hover:border-[#39a900] bg-[#252727]/50'} rounded-xl p-5 text-center flex flex-col items-center justify-center cursor-pointer transition-all group`}
              >
                <div className="w-10 h-10 rounded-lg bg-[#39a900]/15 text-[#39a900] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">
                    {planUploaded ? 'check_circle' : 'upload_file'}
                  </span>
                </div>
                <p className="text-xs font-bold text-white mb-0.5">
                  {planUploaded ? 'Plan Cargado: plan_firmado.pdf' : 'Plan de Mejoramiento firmado'}
                </p>
                <p className="text-[11px] text-gray-400">
                  Arrastre o seleccione PDF (máx. 5MB)
                </p>
              </div>

              {/* Zone 2: Lista de chequeo */}
              <div
                onClick={() => {
                  setChecklistUploaded(true);
                  showToast('Lista de chequeo de productos cargada');
                }}
                className={`border-2 border-dashed ${checklistUploaded ? 'border-[#39a900] bg-[#39a900]/10' : 'border-[#333] hover:border-[#39a900] bg-[#252727]/50'} rounded-xl p-5 text-center flex flex-col items-center justify-center cursor-pointer transition-all group`}
              >
                <div className="w-10 h-10 rounded-lg bg-[#39a900]/15 text-[#39a900] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">
                    {checklistUploaded ? 'check_circle' : 'fact_check'}
                  </span>
                </div>
                <p className="text-xs font-bold text-white mb-0.5">
                  {checklistUploaded ? 'Lista Cargada: lista_chequeo.pdf' : 'Lista de Chequeo de productos'}
                </p>
                <p className="text-[11px] text-gray-400">
                  Arrastre o seleccione PDF (máx. 5MB)
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#2d2f2f]">
              <button
                type="button"
                onClick={() => showToast('Borrador del acta guardado')}
                className="px-5 py-2.5 rounded-lg border border-[#333] text-gray-300 hover:bg-[#252727] text-xs font-semibold transition-colors cursor-pointer"
              >
                Guardar Borrador
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-[#39a900] hover:bg-[#329600] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">gavel</span>
                <span>Registrar Acta</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Timeline (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm sticky top-20">
            <h3 className="text-sm font-bold text-white mb-6 border-b border-[#2d2f2f] pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#39a900] text-[20px]">
                history
              </span>
              <span>Línea de Tiempo Procesal</span>
            </h3>

            <div className="relative pl-6 space-y-7 before:absolute before:inset-y-0 before:left-2 before:w-[2px] before:bg-[#2d2f2f]">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-[27px] w-5 h-5 rounded-full bg-[#39a900] flex items-center justify-center text-white ring-4 ring-[#1a1c1c]">
                  <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                </div>
                <p className="text-[11px] text-gray-400 font-mono mb-0.5">12 Oct 2024 - 08:30 AM</p>
                <h4 className="text-xs font-bold text-white leading-tight">
                  Apertura de Expediente
                </h4>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5">Instructor: María G.</p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-[27px] w-5 h-5 rounded-full bg-[#39a900] flex items-center justify-center text-white ring-4 ring-[#1a1c1c]">
                  <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                </div>
                <p className="text-[11px] text-gray-400 font-mono mb-0.5">15 Sep 2024</p>
                <h4 className="text-xs font-bold text-white leading-tight">
                  1er Llamado de Atención
                </h4>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5">Instructor: Jorge Silva</p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -left-[27px] w-5 h-5 rounded-full bg-[#39a900] flex items-center justify-center text-white ring-4 ring-[#1a1c1c]">
                  <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                </div>
                <p className="text-[11px] text-gray-400 font-mono mb-0.5">05 Oct 2024</p>
                <h4 className="text-xs font-bold text-white leading-tight">
                  2do Llamado de Atención
                </h4>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5">Instructor: María G.</p>
              </div>

              {/* Step 4: Active */}
              <div className="relative">
                <div className="absolute -left-[27px] w-5 h-5 rounded-full bg-[#fdc300] flex items-center justify-center text-[#121212] ring-4 ring-[#1a1c1c] shadow-[0_0_8px_rgba(253,195,0,0.5)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#121212]"></div>
                </div>
                <p className="text-[11px] text-[#fdc300] font-mono font-bold mb-0.5">
                  En Progreso (SLA Activo)
                </p>
                <h4 className="text-xs font-bold text-white leading-tight">
                  Sesión Equipo Ejecutor
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                  Registro de Plan de Mejoramiento.
                </p>
              </div>

              {/* Step 5: Future */}
              <div className="relative opacity-40">
                <div className="absolute -left-[27px] w-5 h-5 rounded-full bg-[#252727] border border-[#333] flex items-center justify-center ring-4 ring-[#1a1c1c]"></div>
                <p className="text-[11px] text-gray-500 font-mono mb-0.5">Pendiente</p>
                <h4 className="text-xs font-semibold text-gray-300">
                  Evaluación de Plan
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Cierre o escalamiento a Comité.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
