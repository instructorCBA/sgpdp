import React, { useState } from 'react';
import { useCaseContext } from '../../context/CaseContext';

export const WarningCall2View: React.FC = () => {
  const { navigateTo, showToast, addCase } = useCaseContext();

  const [sessionDateTime, setSessionDateTime] = useState('2024-10-24T14:30');
  const [participants, setParticipants] = useState<string[]>([
    'Carlos Ruiz (Instr.)',
    'Ana Gómez (Bienestar)'
  ]);
  const [participantInput, setParticipantInput] = useState('');
  const [summary, setSummary] = useState(
    'Se reunió el equipo ejecutor para analizar la reiteración de inasistencias y el bajo rendimiento académico tras la notificación del 1er llamado. El aprendiz manifestó dificultades de conectividad pero no aportó justificaciones oportunas.'
  );
  const [uploadedFile, setUploadedFile] = useState<string | null>('Acta_Equipo_Ejecutor_Sesion_04.pdf');

  const removeParticipant = (name: string) => {
    setParticipants(prev => prev.filter(p => p !== name));
  };

  const addParticipant = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && participantInput.trim()) {
      e.preventDefault();
      if (!participants.includes(participantInput.trim())) {
        setParticipants(prev => [...prev, participantInput.trim()]);
      }
      setParticipantInput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFile(file.name);
      showToast(`Acta "${file.name}" cargada correctamente`);
    }
  };

  const handleGenerateWarning2 = () => {
    if (participants.length === 0) {
      showToast('Por favor ingrese al menos un participante en el acta');
      return;
    }
    if (!summary.trim()) {
      showToast('Por favor ingrese el resumen de la sesión del equipo ejecutor');
      return;
    }

    const newCaseId = 'EXP-2024-0892';
    addCase({
      id: newCaseId,
      apprentice: {
        id: 'app-juan-perez',
        name: 'Juan Pérez Gómez',
        documentType: 'CC',
        documentNumber: '1.023.456.789',
        ficha: '2673849',
        program: 'ADSO (Análisis y Desarrollo de Software)',
        regional: 'Distrito Capital',
        center: 'Centro de Servicios Financieros',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        email: 'jperezg@soy.sena.edu.co',
        phone: '312 456 7890'
      },
      faultCategory: 'Académica (Leve)',
      severity: 'Leve',
      normativeArticle: 'Art. 46 Acuerdo 0009',
      faultDescription: summary,
      currentPhase: '2do Llamado de Atención Notificado',
      sha256: '8f4e2ab9c1048e9f1234bcde567890123456789abcdef0123456789abcdef012',
      slaDaysRemaining: 5,
      slaDueDate: '29 Oct 2024',
      slaStatus: 'warning',
      isAccelerated: false,
      priorSanctions: [
        {
          id: 'ps-1',
          title: '1er Llamado de Atención Escrito',
          date: '12 Oct 2024',
          instructor: 'Diana Marcela Pineda',
          description: 'Inasistencias injustificadas y entrega tardía de evidencias.',
          sha256: '8f4e2a...b9c1',
          status: 'Activo'
        }
      ],
      evidences: uploadedFile ? [
        {
          id: 'ev-acta',
          name: uploadedFile,
          type: 'pdf',
          size: '1.4 MB',
          date: '24 Oct 2024',
          sha256: '3c9d7f4e8f4e2ab9c1048e9f1234bcde567890123456789abcdef0123456789a',
          verified: true
        }
      ] : [],
      timeline: [
        {
          id: 'step-1',
          title: 'Inicio de Proceso',
          date: '10 Oct 2024',
          status: 'completed'
        },
        {
          id: 'step-2',
          title: '1er Llamado de Atención',
          date: '12 Oct 2024',
          status: 'completed'
        },
        {
          id: 'step-3',
          title: 'Sesión Equipo Ejecutor',
          date: '24 Oct 2024',
          status: 'completed'
        },
        {
          id: 'step-4',
          title: '2do Llamado de Atención',
          date: '24 Oct 2024',
          status: 'current'
        },
        {
          id: 'step-5',
          title: 'Citación Comité de Evaluación',
          status: 'pending'
        }
      ]
    });

    showToast('2do Llamado de Atención generado y notificado con éxito');
    navigateTo('case-detail', newCaseId);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
          Registro de 2do Llamado de Atención
        </h2>
        <p className="text-xs text-[#39a900] flex items-center gap-1.5 mt-1 font-mono">
          <span className="material-symbols-outlined text-[16px]">verified_user</span>
          <span>Contexto Regulatorio: Art. 46 Acuerdo 0009 - Procedimiento disciplinario</span>
        </p>
      </div>

      {/* Main Grid: 8 cols left form, 4 cols right metadata & timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Contexto del Aprendiz */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#2d2f2f] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#39a900] text-[20px]">
                  person
                </span>
                <span>Contexto del Aprendiz</span>
              </h3>
              <span className="text-xs font-mono text-gray-400 bg-[#252727] px-2.5 py-0.5 rounded border border-[#333]">
                ID: EXP-2024-0892
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
                alt="Juan Pérez Gómez"
                className="w-16 h-16 rounded-xl object-cover border border-[#333] shrink-0"
              />
              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-xs font-mono">
                  <strong className="text-white text-base block font-sans">
                    Juan Pérez Gómez
                  </strong>
                  <p className="text-gray-400">CC: 1.023.456.789</p>
                  <p className="text-gray-400">Programa: ADSO (2673849)</p>
                </div>

                {/* Historial de Faltas */}
                <div className="bg-[#252727] border border-[#333] rounded-xl p-3.5 space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-gray-400 block tracking-wider">
                    HISTORIAL DE FALTAS
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#fdc300]">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    <strong>1er Llamado de Atención Escrito</strong>
                  </div>
                  <div className="text-[10px] font-mono text-gray-400">
                    HASH: <span className="text-gray-300">8f4e2a...b9c1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Registro de Acta de Equipo Ejecutor */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#2d2f2f] pb-3">
              <span className="material-symbols-outlined text-[#39a900] text-[20px]">
                groups
              </span>
              <span>Registro de Acta de Equipo Ejecutor</span>
            </h3>

            {/* Fecha/Hora & Participantes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">
                  Fecha y Hora de la Sesión
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                    calendar_today
                  </span>
                  <input
                    type="datetime-local"
                    value={sessionDateTime}
                    onChange={(e) => setSessionDateTime(e.target.value)}
                    className="w-full bg-[#252727] border border-[#333] text-gray-200 rounded-lg py-2.5 pl-9 pr-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#39a900]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">
                  Participantes
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                      person_add
                    </span>
                    <input
                      type="text"
                      value={participantInput}
                      onChange={(e) => setParticipantInput(e.target.value)}
                      onKeyDown={addParticipant}
                      placeholder="Buscar instructor/directivo..."
                      className="w-full bg-[#252727] border border-[#333] text-gray-200 rounded-lg py-2.5 pl-9 pr-3 text-xs placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#39a900]"
                    />
                  </div>

                  {/* Participant Tags */}
                  <div className="flex flex-wrap gap-2">
                    {participants.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1.5 bg-[#39a900]/15 text-[#39a900] border border-[#39a900]/30 px-2.5 py-1 rounded-full text-xs font-mono"
                      >
                        <span>{p}</span>
                        <button
                          type="button"
                          onClick={() => removeParticipant(p)}
                          className="hover:text-white transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen de la sesión */}
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1.5">
                Resumen de la sesión
              </label>
              <textarea
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Describa brevemente los puntos tratados en la reunión respecto al caso..."
                className="w-full bg-[#252727] border border-[#333] text-gray-200 rounded-lg p-3 text-xs font-mono placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#39a900] leading-relaxed"
              />
            </div>

            {/* Acta de Reunión (Firmada) */}
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1.5">
                Acta de Reunión (Firmada)
              </label>
              <label className="border-2 border-dashed border-[#333] hover:border-[#39a900] bg-[#252727]/40 hover:bg-[#39a900]/5 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileUpload}
                />
                <div className="w-10 h-10 rounded-lg bg-[#1a1c1c] border border-[#333] flex items-center justify-center text-gray-300 group-hover:text-[#39a900] mb-2 transition-colors">
                  <span className="material-symbols-outlined text-[22px]">
                    {uploadedFile ? 'task_alt' : 'upload'}
                  </span>
                </div>
                <p className="text-xs font-medium text-white mb-0.5">
                  {uploadedFile || 'Arrastre el documento aquí o haga clic para examinar'}
                </p>
                <p className="text-[11px] text-gray-400 font-mono">
                  Formatos soportados: PDF (Máx 5MB)
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Metadatos & Ruta Procesal */}
        <div className="lg:col-span-4 space-y-6">
          {/* Metadatos del Trámite */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-[#2d2f2f] pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#39a900]">info</span>
              <span>Metadatos del Trámite</span>
            </h3>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Sede:</span>
                <strong className="text-gray-200">Centro de Servicios (Bogotá)</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Fecha Actual:</span>
                <strong className="text-gray-200">24/10/2024</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">ID Sesión:</span>
                <strong className="text-gray-200">SES-992-AB</strong>
              </div>
            </div>
          </div>

          {/* Ruta Procesal */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-5 shadow-sm space-y-5">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-[#2d2f2f] pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#39a900]">alt_route</span>
              <span>Ruta Procesal</span>
            </h3>

            <div className="relative pl-6 space-y-5 before:absolute before:inset-y-2 before:left-2.5 before:w-[2px] before:bg-[#2d2f2f]">
              {/* Step 1: Completado */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-5 h-5 rounded-full bg-[#39a900] flex items-center justify-center text-white ring-4 ring-[#1a1c1c]">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <span className="text-[10px] text-[#39a900] font-mono font-bold uppercase block">
                  COMPLETADO
                </span>
                <h4 className="text-xs font-bold text-white font-mono leading-tight">
                  Inicio de Proceso
                </h4>
              </div>

              {/* Step 2: Completado */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-5 h-5 rounded-full bg-[#39a900] flex items-center justify-center text-white ring-4 ring-[#1a1c1c]">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <span className="text-[10px] text-[#39a900] font-mono font-bold uppercase block">
                  COMPLETADO
                </span>
                <h4 className="text-xs font-bold text-white font-mono leading-tight">
                  1er Llamado de Atención
                </h4>
              </div>

              {/* Step 3: En Curso */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-5 h-5 rounded-full bg-[#fdc300] flex items-center justify-center text-black ring-4 ring-[#1a1c1c]">
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                </div>
                <span className="text-[10px] text-[#fdc300] font-mono font-bold uppercase block">
                  EN CURSO
                </span>
                <h4 className="text-xs font-bold text-white font-mono leading-tight">
                  Sesión Equipo Ejecutor
                </h4>
              </div>

              {/* Step 4: Paso Actual */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-black ring-4 ring-[#1a1c1c]">
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                </div>
                <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase block">
                  PASO ACTUAL
                </span>
                <h4 className="text-xs font-bold text-white font-mono leading-tight">
                  2do Llamado de Atención
                </h4>
              </div>

              {/* Step 5: Bloqueado */}
              <div className="relative opacity-40">
                <div className="absolute -left-[27px] top-0 w-5 h-5 rounded-full border-2 border-gray-600 bg-[#1a1c1c] flex items-center justify-center ring-4 ring-[#1a1c1c]"></div>
                <span className="text-[10px] text-gray-500 font-mono font-bold uppercase block">
                  BLOQUEADO
                </span>
                <h4 className="text-xs font-bold text-gray-400 font-mono leading-tight">
                  Citación Comité de Evaluación
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-[#2d2f2f]">
        <button
          type="button"
          onClick={() => navigateTo('dashboard')}
          className="px-6 py-2.5 rounded-xl border border-[#333] text-gray-300 hover:bg-[#252727] text-xs font-semibold transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleGenerateWarning2}
          className="px-6 py-2.5 rounded-xl bg-[#39a900] hover:bg-[#329600] active:scale-[0.98] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-[0_4px_16px_rgba(57,169,0,0.3)] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          <span>Generar 2do Llamado</span>
        </button>
      </div>
    </div>
  );
};
