import React, { useState } from 'react';
import { useCaseContext } from '../../context/CaseContext';
import { ProceduralTimeline } from '../common/ProceduralTimeline';

export const MasterCaseFileView: React.FC = () => {
  const { selectedCase, navigateTo, updateCase, showToast, requestOtpSignature } = useCaseContext();
  const [isAddingEvidence, setIsAddingEvidence] = useState(false);
  const [newEvidenceName, setNewEvidenceName] = useState('');

  if (!selectedCase) {
    return (
      <div className="p-12 text-center text-gray-400">
        <p>No se encontró el expediente seleccionado.</p>
        <button
          onClick={() => navigateTo('dashboard')}
          className="mt-4 px-4 py-2 bg-[#39a900] text-white rounded-lg text-sm font-semibold"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  const isGravissima = selectedCase.severity === 'Gravísima' || selectedCase.isAccelerated;

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidenceName.trim()) return;

    const randomHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newEvidence = {
      id: `ev-${Date.now()}`,
      name: newEvidenceName.endsWith('.pdf') ? newEvidenceName : `${newEvidenceName}.pdf`,
      type: 'pdf' as const,
      size: '1.5 MB',
      date: 'Hoy',
      sha256: `sha256:${randomHash.substring(0, 10)}...`,
      verified: true,
    };

    updateCase(selectedCase.id, {
      evidences: [...selectedCase.evidences, newEvidence],
    });

    setNewEvidenceName('');
    setIsAddingEvidence(false);
    showToast(`Evidencia '${newEvidence.name}' anexada y firmada con hash SHA-256`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <button onClick={() => navigateTo('dashboard')} className="hover:text-gray-200 cursor-pointer">
            Expedientes
          </button>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-gray-200 font-bold">{selectedCase.id}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => {
              requestOtpSignature({
                title: `Certificación Criptográfica • ${selectedCase.id}`,
                description: `Firma digital electrónica para sellar la inmutabilidad del expediente disciplinario del aprendiz ${selectedCase.apprentice.name}.`,
                onSign: (hash) => {
                  updateCase(selectedCase.id, {
                    sha256: `sha256:${hash.slice(0, 16)}...`,
                  });
                },
              });
            }}
            className="px-3.5 py-2 rounded-lg border border-[#39a900]/50 hover:border-[#39a900] bg-[#39a900]/10 hover:bg-[#39a900]/20 text-[#39a900] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">fingerprint</span>
            <span>Firma OTP</span>
          </button>

          <button 
            onClick={() => showToast('Generando reporte certificado PDF del expediente...')}
            className="px-4 py-2 rounded-lg border border-[#2d2f2f] hover:border-gray-500 bg-[#1a1c1c] text-gray-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Descargar PDF</span>
          </button>

          <button 
            onClick={() => {
              if (isGravissima) {
                navigateTo('committee-request', selectedCase.id);
              } else {
                navigateTo('executor-session', selectedCase.id);
              }
            }}
            className="px-4 py-2 rounded-lg bg-[#39a900] hover:bg-[#329600] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isGravissima ? 'gavel' : 'edit_document'}
            </span>
            <span>Gestionar Caso</span>
          </button>
        </div>
      </div>

      {/* Apprentice Header Card */}
      <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 relative overflow-hidden shadow-md">
        {/* Subtle Watermark Overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <span className="material-symbols-outlined text-[240px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            shield
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-[#2d2f2f] bg-[#121212] shrink-0 shadow-inner">
              <img
                src={selectedCase.apprentice.avatarUrl}
                alt={selectedCase.apprentice.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {selectedCase.apprentice.name}
                </h3>
                <span className="material-symbols-outlined text-[#39a900] text-[20px]" title="Identidad Verificada">
                  verified
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-1">
                CC: {selectedCase.apprentice.documentNumber} •{' '}
                <span className="text-[#39a900] bg-[#39a900]/10 border border-[#39a900]/20 px-2 py-0.5 rounded font-bold">
                  Ficha: {selectedCase.apprentice.ficha}
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-gray-500">school</span>
                  <span>Programa: <strong className="text-gray-300">{selectedCase.apprentice.program}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-gray-500">business</span>
                  <span>Centro: <strong className="text-gray-300">{selectedCase.apprentice.center}</strong></span>
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            {isGravissima ? (
              <div className="bg-red-950/40 border border-red-800/80 text-red-400 px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">warning</span>
                <span>FALTA GRAVÍSIMA</span>
              </div>
            ) : (
              <div className="bg-yellow-950/40 border border-yellow-800/70 text-[#fdc300] px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                <span>{selectedCase.currentPhase}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bento Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Fault info & Evidences */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Resumen de Falta / Fundamento Jurídico y Hechos */}
          <div className={`bg-[#1a1c1c] border ${isGravissima ? 'border-red-900/50 border-l-4 border-l-[#d32f2f]' : 'border-[#2d2f2f] border-l-4 border-l-[#fdc300]'} rounded-xl p-6 shadow-md`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span className={`material-symbols-outlined ${isGravissima ? 'text-[#d32f2f]' : 'text-[#fdc300]'}`}>
                  gavel
                </span>
                <span>{isGravissima ? 'Fundamento Jurídico y Hechos' : 'Resumen de Falta'}</span>
              </h4>
              <span className="text-xs font-mono font-medium text-gray-400 bg-[#252727] px-2.5 py-1 rounded border border-[#333]">
                {selectedCase.normativeArticle}
              </span>
            </div>

            {/* Normative Quote Block if Gravísima */}
            {selectedCase.normativeQuote && (
              <div className="bg-[#252727] rounded-lg p-4 mb-4 border border-[#333]">
                <p className="text-xs font-semibold text-gray-300 mb-1.5">
                  {selectedCase.normativeArticle}:
                </p>
                <p className="text-xs italic text-gray-400 border-l-2 border-[#39a900] pl-3 leading-relaxed">
                  {selectedCase.normativeQuote}
                </p>
              </div>
            )}

            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              {selectedCase.faultDescription}
            </p>

            {/* Fast Track Notice if Gravísima */}
            {isGravissima && (
              <div className="flex items-start gap-2.5 bg-yellow-950/25 text-[#fdc300] p-3.5 rounded-lg text-xs border border-yellow-800/40 mb-4 leading-relaxed">
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">info</span>
                <span>
                  <strong>Proceso Acelerado:</strong> Esta tipificación omite las etapas conciliatorias y procede directamente a citación de Comité de Evaluación y Seguimiento.
                </span>
              </div>
            )}

            {/* Inmutable Hash Badge Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-mono pt-3 border-t border-[#262828] text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-gray-500">key</span>
                <span>Hash: <strong className="text-gray-300 font-mono text-[11px]">{selectedCase.sha256}</strong></span>
              </span>
              <span className="text-[#39a900] flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>Inmutable</span>
              </span>
            </div>
          </div>

          {/* Card 2: Panel de Evidencias Documentales / Acervo Probatorio */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-5">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#39a900]">
                  inventory_2
                </span>
                <span>{isGravissima ? 'Acervo Probatorio Vinculado' : 'Panel de Evidencias Documentales'}</span>
              </h4>
              <button 
                onClick={() => setIsAddingEvidence(!isAddingEvidence)}
                className="text-xs font-semibold text-[#39a900] hover:text-[#4ade80] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isAddingEvidence ? 'close' : 'add_circle'}
                </span>
                <span>{isAddingEvidence ? 'Cancelar' : 'Añadir'}</span>
              </button>
            </div>

            {/* Quick Add Evidence Form */}
            {isAddingEvidence && (
              <form onSubmit={handleAddEvidence} className="mb-4 p-4 bg-[#252727] rounded-xl border border-[#39a900]/40 space-y-3">
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                  Cargar Nueva Evidencia Probatoria
                </h5>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newEvidenceName}
                    onChange={(e) => setNewEvidenceName(e.target.value)}
                    placeholder="Ej. Acta_Auditoria_Firma.pdf"
                    className="flex-1 bg-[#121212] border border-[#333] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#39a900]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#39a900] hover:bg-[#329600] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            )}

            {/* Evidences List */}
            <div className="space-y-3">
              {selectedCase.evidences.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between p-3.5 bg-[#252727] rounded-xl border border-[#2d2f2f] hover:border-[#39a900]/40 transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      ev.type === 'pdf' 
                        ? 'bg-red-950/40 text-red-400 border border-red-900/40' 
                        : 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/40'
                    }`}>
                      <span className="material-symbols-outlined text-[22px]">
                        {ev.type === 'pdf' ? 'picture_as_pdf' : 'image'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-[#39a900] transition-colors">
                        {ev.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-gray-400">
                        <span>{ev.size} • {ev.date}</span>
                        <span className="text-[#39a900] bg-[#39a900]/10 border border-[#39a900]/20 px-1.5 py-0.2 rounded flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-[10px]">verified</span>
                          <span>SHA-256: {ev.sha256.slice(0, 8)}...</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => showToast(`Descargando ${ev.name}...`)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors cursor-pointer"
                      title="Descargar documento"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                    </button>
                    <button 
                      onClick={() => showToast(`Visualizando ${ev.name}...`)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#39a900] hover:bg-[#333] transition-colors cursor-pointer"
                      title="Previsualizar"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Pending placeholder item matching screenshot */}
              {!isGravissima && (
                <div className="flex items-center gap-3 p-3.5 border border-dashed border-[#2d2f2f] rounded-xl bg-[#252727]/30 text-gray-400 text-xs font-mono">
                  <span className="material-symbols-outlined text-[18px]">attach_file</span>
                  <span>Anexos de pruebas pendientes</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): SLA Box & Procedural Timeline */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: SLA Box */}
          {isGravissima ? (
            <div className="bg-[#1a1c1c] border-t-4 border-t-[#d32f2f] border-x border-b border-[#2d2f2f] rounded-xl p-6 text-center shadow-lg">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">
                VENCIMIENTO SLA
              </h4>
              <div className="text-5xl font-bold font-mono text-[#d32f2f] mb-1">
                3 Días
              </div>
              <p className="text-xs text-gray-300 mb-4 font-medium">
                Hábiles restantes para Citación
              </p>

              {/* 3 Dots Indicator with last dot red active */}
              <div className="flex justify-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2d2f2f]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#2d2f2f]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#d32f2f] animate-ping"></div>
              </div>

              <button 
                onClick={() => showToast('Términos procesales conforme al Acuerdo 0009 de 2024 (Art. 51)')}
                className="w-full bg-[#252727] hover:bg-[#333] border border-[#2d2f2f] text-gray-200 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Ver Detalles de Términos
              </button>
            </div>
          ) : (
            <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 text-center shadow-md flex flex-col items-center justify-center">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 font-mono">
                TIEMPO RESTANTE SLA
              </h4>
              <div className="w-24 h-24 rounded-2xl border-4 border-[#fdc300] bg-yellow-950/20 flex flex-col items-center justify-center mb-3 shadow-inner">
                <span className="text-4xl font-bold font-mono text-[#fdc300] leading-none">
                  {selectedCase.slaDaysRemaining}
                </span>
                <span className="text-[11px] text-gray-400 font-medium mt-1">
                  días háb.
                </span>
              </div>
              <p className="text-xs font-bold text-white">
                {selectedCase.currentPhase}
              </p>
              <p className="text-[11px] text-gray-400 mt-1 font-mono">
                Vence: {selectedCase.slaDueDate}
              </p>
            </div>
          )}

          {/* Card 2: Procedural Timeline */}
          <ProceduralTimeline
            title={isGravissima ? "Ruta Directa" : "Ruta del Proceso"}
            steps={selectedCase.timeline}
            isAccelerated={isGravissima}
            infoNote={
              !isGravissima 
                ? "Nota: Para Faltas Graves o Gravísimas, el proceso avanza directamente a 'Citación Comité de evaluación y seguimiento'." 
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
};
