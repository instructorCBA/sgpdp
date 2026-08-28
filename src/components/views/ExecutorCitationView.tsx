import React, { useState } from 'react';
import { useCaseContext } from '../../context/CaseContext';

export const ExecutorCitationView: React.FC = () => {
  const { selectedCase, navigateTo, updateCase, showToast } = useCaseContext();

  const caseData = selectedCase || {
    id: 'EXP-2024-001',
    apprentice: {
      name: 'Carlos Mendoza Ruiz',
      documentNumber: '1.020.334.556',
      ficha: '2567890',
      program: 'Tecnólogo en Análisis y Desarrollo de Software',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    },
    priorSanctions: [
      {
        id: 'ps-1',
        title: 'Primer Llamado',
        date: '15 Oct 2024',
        description: 'Ausencia injustificada y falta de entrega de evidencias de aprendizaje en la competencia técnica.',
        sha256: 'a1b2c3d4e5f6g7h8i9j0',
      },
      {
        id: 'ps-2',
        title: 'Segundo Llamado',
        date: '28 Oct 2024',
        description: 'Reiteración de ausencia y disrupción en el ambiente de formación (laboratorio de redes).',
        sha256: 'z0y9x8w7v6u5t4s3r2q1',
      }
    ]
  };

  const [sessionDate, setSessionDate] = useState('2024-10-30');
  const [sessionTime, setSessionTime] = useState('09:30');
  const [sessionPlace, setSessionPlace] = useState('Sala de Coordinación Académica 204');
  const [participants, setParticipants] = useState<string[]>([
    'Instructor Técnico (Reportante)',
    'Coordinación Académica'
  ]);
  const [newParticipant, setNewParticipant] = useState('');
  const [agenda, setAgenda] = useState('1. Revisión de antecedentes académicos y ausentismo reiterado.\n2. Exposición de descargos por parte del aprendiz.\n3. Concertación del Plan de Mejoramiento conforme al Acuerdo 0009 de 2024.');

  const handleAddParticipant = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newParticipant.trim()) {
      e.preventDefault();
      if (!participants.includes(newParticipant.trim())) {
        setParticipants([...participants, newParticipant.trim()]);
      }
      setNewParticipant('');
    }
  };

  const removeParticipant = (name: string) => {
    setParticipants(participants.filter(p => p !== name));
  };

  const handleSubmitCitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCase) {
      updateCase(selectedCase.id, {
        sessionDate,
        sessionTime,
        sessionPlace,
        sessionParticipants: participants,
        currentPhase: 'Citación Programada - Sesión Equipo Ejecutor'
      });
    }
    showToast('Citación formal generada y notificada por correo institucional');
    navigateTo('executor-session', selectedCase?.id || 'EXP-2024-001');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Warning Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
          Citación a Reunión de Equipo Ejecutor
        </h2>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-300">
          <span className="material-symbols-outlined text-[#fdc300] text-[18px]">
            warning
          </span>
          <span>
            Citación automática generada por acumulación de (2) Llamados de Atención consecutivos.
          </span>
        </div>
      </div>

      {/* Main Grid: Form (8 cols) & Timeline (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Apprentice Card */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-sm">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#2d2f2f] bg-[#121212] shrink-0">
              <img
                src={caseData.apprentice.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'}
                alt={caseData.apprentice.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {caseData.apprentice.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-2 text-xs">
                <p className="text-gray-400">
                  Documento ID:{' '}
                  <strong className="text-gray-200 font-mono">
                    {caseData.apprentice.documentNumber}
                  </strong>
                </p>
                <p className="text-gray-400">
                  Ficha de Caracterización:{' '}
                  <strong className="text-gray-200 font-mono">
                    {caseData.apprentice.ficha}
                  </strong>
                </p>
                <p className="text-gray-400 sm:col-span-2 mt-1">
                  Programa de Formación:{' '}
                  <strong className="text-gray-200 font-mono">
                    {caseData.apprentice.program}
                  </strong>
                </p>
              </div>
            </div>
          </div>

          {/* Antecedentes (Llamados de Atención) */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#2d2f2f] pb-3">
              <span className="material-symbols-outlined text-[#39a900] text-[20px]">
                history
              </span>
              <span>Antecedentes (Llamados de Atención)</span>
            </h3>

            <div className="space-y-3">
              {/* Primer Llamado */}
              <div className="bg-[#252727] rounded-xl p-4 border-l-4 border-l-[#fdc300] border-y border-r border-[#2d2f2f]">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="bg-[#171818] text-gray-200 font-bold px-2.5 py-0.5 rounded font-mono">
                    Primer Llamado
                  </span>
                  <span className="text-gray-400 font-mono">15 Oct 2024</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-2">
                  Ausencia injustificada y falta de entrega de evidencias de aprendizaje en la competencia técnica.
                </p>
                <p className="text-[11px] font-mono text-gray-500">
                  HASH: a1b2c3d4e5f6g7h8i9j0
                </p>
              </div>

              {/* Segundo Llamado */}
              <div className="bg-[#252727] rounded-xl p-4 border-l-4 border-l-[#d32f2f] border-y border-r border-[#2d2f2f]">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="bg-[#171818] text-gray-200 font-bold px-2.5 py-0.5 rounded font-mono">
                    Segundo Llamado
                  </span>
                  <span className="text-gray-400 font-mono">28 Oct 2024</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-2">
                  Reiteración de ausencia y disrupción en el ambiente de formación (laboratorio de redes).
                </p>
                <p className="text-[11px] font-mono text-gray-500">
                  HASH: z0y9x8w7v6u5t4s3r2q1
                </p>
              </div>
            </div>
          </div>

          {/* Detalles de la Citación (Form) */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-[#39a900] text-[20px]">
                edit_document
              </span>
              <span>Detalles de la Citación</span>
            </h3>

            <form onSubmit={handleSubmitCitation} className="space-y-4">
              {/* Fecha y Hora */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5">
                    Fecha de Sesión
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      required
                      className="w-full bg-[#252727] border border-[#333] text-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#39a900] font-mono [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5">
                    Hora
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={sessionTime}
                      onChange={(e) => setSessionTime(e.target.value)}
                      required
                      className="w-full bg-[#252727] border border-[#333] text-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#39a900] font-mono [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              {/* Lugar o Enlace Virtual */}
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">
                  Lugar o Enlace Virtual (Teams/Meet)
                </label>
                <input
                  type="text"
                  value={sessionPlace}
                  onChange={(e) => setSessionPlace(e.target.value)}
                  placeholder="Ej. Sala de Coordinación Académica 204 o URL Teams"
                  className="w-full bg-[#252727] border border-[#333] text-gray-200 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#39a900] font-mono"
                />
              </div>

              {/* Participantes Requeridos */}
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">
                  Participantes Requeridos (Equipo Ejecutor)
                </label>
                <div className="bg-[#252727] border border-[#333] rounded-lg p-3 min-h-[85px] flex flex-wrap gap-2 items-start">
                  {participants.map((p, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 bg-[#39a900]/15 text-[#39a900] border border-[#39a900]/30 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      <span>{p}</span>
                      <button
                        type="button"
                        onClick={() => removeParticipant(p)}
                        className="hover:text-white cursor-pointer text-xs"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                    onKeyDown={handleAddParticipant}
                    placeholder="Añadir participante (Presiona Enter)..."
                    className="bg-transparent border-none text-xs text-white placeholder-gray-500 focus:outline-none flex-1 min-w-[200px] py-1"
                  />
                </div>
              </div>

              {/* Orden del Día */}
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">
                  Orden del Día / Temas a tratar
                </label>
                <textarea
                  rows={4}
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  placeholder="1. Revisión de antecedentes académicos..."
                  className="w-full bg-[#252727] border border-[#333] text-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#39a900] font-mono leading-relaxed"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#2d2f2f]">
                <button
                  type="button"
                  onClick={() => navigateTo('dashboard')}
                  className="px-5 py-2.5 rounded-lg border border-[#333] text-gray-300 hover:bg-[#252727] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#39a900] hover:bg-[#329600] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Enviar Citación</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (4 cols): Timeline */}
        <div className="lg:col-span-4">
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm sticky top-20">
            <h3 className="text-sm font-bold text-white mb-6 border-b border-[#2d2f2f] pb-3">
              Línea de Tiempo Procesal
            </h3>

            <div className="relative pl-6 space-y-7 before:absolute before:inset-y-0 before:left-2 before:w-[2px] before:bg-[#2d2f2f]">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-[27px] w-5 h-5 rounded-full bg-[#39a900] flex items-center justify-center text-white ring-4 ring-[#1a1c1c]">
                  <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-tight">
                  Llamado de Atención 1
                </h4>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">15/10/2024</p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-[27px] w-5 h-5 rounded-full bg-[#39a900] flex items-center justify-center text-white ring-4 ring-[#1a1c1c]">
                  <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-tight">
                  Llamado de Atención 2
                </h4>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">28/10/2024</p>
              </div>

              {/* Step 3: PASO ACTUAL */}
              <div className="relative">
                <div className="absolute -left-[27px] w-5 h-5 rounded-full bg-[#fdc300] flex items-center justify-center text-[#121212] ring-4 ring-[#1a1c1c] animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#121212]"></div>
                </div>
                <div className="bg-[#252727] rounded-lg p-3.5 border border-[#39a900]/30 shadow-sm space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#39a900] block">
                    PASO ACTUAL
                  </span>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    Citación Equipo Ejecutor
                  </h4>
                  <p className="text-[11px] text-gray-300 mt-1 leading-snug">
                    Formulación de cargos y citación a descargos.
                  </p>
                </div>
              </div>

              {/* Step 4: Comité de Evaluación */}
              <div className="relative opacity-40">
                <div className="absolute -left-[27px] w-5 h-5 rounded-full bg-[#252727] border border-[#333] flex items-center justify-center ring-4 ring-[#1a1c1c]"></div>
                <h4 className="text-xs font-semibold text-gray-300">
                  Comité de Evaluación
                </h4>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5">Pendiente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
