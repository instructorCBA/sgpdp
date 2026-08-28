import React, { useState } from 'react';
import { useCaseContext } from '../../context/CaseContext';

export const CommitteeScheduleView: React.FC = () => {
  const { navigateTo, showToast } = useCaseContext();
  const [comiteDate, setComiteDate] = useState('2024-11-15');
  const [comiteTime, setComiteTime] = useState('08:00');
  const [comitePlace, setComitePlace] = useState('Sala de Juntas, Edificio B');

  const slots = [
    {
      time: '08:00',
      duration: '30 min',
      apprentice: 'Luis Hernández',
      apprenticePhone: '312 456 7890',
      apprenticeEmail: 'lhernandez@soy.sena.edu.co',
      instructor: 'Juan Pérez',
      instructorPhone: '300 123 4567',
      instructorEmail: 'jperez@sena.edu.co',
    },
    {
      time: '08:30',
      duration: '30 min',
      apprentice: 'Andrea Salazar',
      apprenticePhone: '315 987 6543',
      apprenticeEmail: 'asalazar@soy.sena.edu.co',
      instructor: 'María Gómez',
      instructorPhone: '310 555 1234',
      instructorEmail: 'mgomez@sena.edu.co',
    },
    {
      time: '09:00',
      duration: '30 min',
      apprentice: 'Carlos Daza',
      apprenticePhone: '320 111 2233',
      apprenticeEmail: 'cdaza@soy.sena.edu.co',
      instructor: 'Carlos Ruiz',
      instructorPhone: '318 444 5566',
      instructorEmail: 'cruiz@sena.edu.co',
    }
  ];

  const handleGenerateCitations = () => {
    showToast('Se generaron 3 oficios formales PDF y se enviaron notificaciones');
    navigateTo('dashboard');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
          Programar Comité de Evaluación
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Seleccione las solicitudes pendientes y defina los detalles de la sesión para generar las citaciones formales.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Solicitudes Pendientes */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-[#2d2f2f] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#39a900]">checklist</span>
                <span>1. Solicitudes Pendientes</span>
              </h3>
              <span className="text-[11px] font-mono bg-[#252727] text-gray-300 px-3 py-1 rounded-full border border-[#333]">
                3 Seleccionadas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="bg-[#252727] border border-[#39a900] rounded-xl p-4 cursor-pointer shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#fdc300] bg-yellow-950/30 border border-yellow-800/40 px-2 py-0.5 rounded">
                    SLA: 2 Días
                  </span>
                  <span className="material-symbols-outlined text-[#39a900] text-[18px]">check_circle</span>
                </div>
                <h4 className="text-sm font-bold text-white">EXP-2024-0012</h4>
                <p className="text-xs text-gray-400 mt-0.5">Falta gravísima - Plagio</p>
                <div className="mt-3 pt-3 border-t border-[#333] flex justify-between text-[11px] font-mono text-gray-400">
                  <span>Instr: Juan Pérez</span>
                  <span className="text-gray-300 font-bold">SHA: a1b2...</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#252727] border border-[#39a900] rounded-xl p-4 cursor-pointer shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#39a900] bg-[#39a900]/15 border border-[#39a900]/30 px-2 py-0.5 rounded">
                    SLA: 5 Días
                  </span>
                  <span className="material-symbols-outlined text-[#39a900] text-[18px]">check_circle</span>
                </div>
                <h4 className="text-sm font-bold text-white">EXP-2024-0015</h4>
                <p className="text-xs text-gray-400 mt-0.5">Ausentismo reiterado</p>
                <div className="mt-3 pt-3 border-t border-[#333] flex justify-between text-[11px] font-mono text-gray-400">
                  <span>Instr: María Gómez</span>
                  <span className="text-gray-300 font-bold">SHA: f8c9...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Detalles de la Sesión */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#2d2f2f] pb-3">
              <span className="material-symbols-outlined text-[#39a900]">event</span>
              <span>2. Detalles de la Sesión</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">Fecha del Comité</label>
                <input
                  type="date"
                  value={comiteDate}
                  onChange={(e) => setComiteDate(e.target.value)}
                  className="w-full bg-[#252727] border border-[#333] text-gray-200 rounded-lg px-3 py-2 text-xs font-mono [color-scheme:dark]"
                />
                <p className="text-[10px] text-gray-500 font-mono mt-1">Evite Días No Hábiles</p>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">Hora de Inicio</label>
                <input
                  type="time"
                  value={comiteTime}
                  onChange={(e) => setComiteTime(e.target.value)}
                  className="w-full bg-[#252727] border border-[#333] text-gray-200 rounded-lg px-3 py-2 text-xs font-mono [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">Lugar / Enlace</label>
                <input
                  type="text"
                  value={comitePlace}
                  onChange={(e) => setComitePlace(e.target.value)}
                  className="w-full bg-[#252727] border border-[#333] text-gray-200 rounded-lg px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Asignación de Turnos & Citados */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-[#2d2f2f] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#39a900]">view_timeline</span>
                <span>3. Asignación de Turnos &amp; Citados</span>
              </h3>
              <button 
                onClick={() => showToast('Turnos sincronizados con la agenda')}
                className="text-xs font-mono text-[#39a900] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">sync</span>
                <span>Recalcular</span>
              </button>
            </div>

            <div className="space-y-3">
              {slots.map((slot, idx) => (
                <div
                  key={idx}
                  className="bg-[#252727] rounded-xl border-l-4 border-l-[#39a900] border-y border-r border-[#2d2f2f] p-4 flex flex-col md:flex-row gap-4"
                >
                  <div className="md:w-28 shrink-0 flex flex-col justify-center items-center bg-[#171818] p-3 rounded-lg border border-[#333]">
                    <span className="text-lg font-bold font-mono text-white">{slot.time}</span>
                    <span className="text-[11px] font-mono text-gray-400">{slot.duration}</span>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-[10px] font-mono text-[#39a900] uppercase tracking-wider mb-1">
                        Aprendiz Citado
                      </p>
                      <p className="text-sm font-bold text-white">{slot.apprentice}</p>
                      <p className="text-gray-400 font-mono mt-0.5">{slot.apprenticePhone}</p>
                      <p className="text-gray-400 font-mono">{slot.apprenticeEmail}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                        Instructor Remitente
                      </p>
                      <p className="text-sm font-bold text-white">{slot.instructor}</p>
                      <p className="text-gray-400 font-mono mt-0.5">{slot.instructorPhone}</p>
                      <p className="text-gray-400 font-mono">{slot.instructorEmail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Preview & Action (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Document Preview Card */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-md text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#39a900]/15 text-[#39a900] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[32px]">description</span>
            </div>
            <h4 className="text-base font-bold text-white">Vista Previa del Documento</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Se generarán 3 oficios formales PDF con firma electrónica y radicado consecutivo.
            </p>

            <div className="bg-[#252727] p-3.5 rounded-xl text-left text-xs font-mono text-gray-300 space-y-1 border border-[#333]">
              <div><strong>Plantilla:</strong> CIT-COMITE-V2.1</div>
              <div><strong>Destinatarios:</strong> 6 (3 Aprendices, 3 Instructores)</div>
              <div><strong>Medio:</strong> Correo Institucional + SMS</div>
            </div>

            <button
              onClick={handleGenerateCitations}
              className="w-full bg-[#39a900] hover:bg-[#329600] text-white py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Generar y Notificar Citaciones</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
