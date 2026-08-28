import React, { useState } from 'react';
import { useCaseContext } from '../../context/CaseContext';

export const PlanEvaluationView: React.FC = () => {
  const { selectedCase, navigateTo, updateCase, showToast } = useCaseContext();
  const [selectedJuicio, setSelectedJuicio] = useState<'cumple' | 'no-cumple' | null>(null);
  const [observations, setObservations] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFile(file.name);
      showToast(`Lista de chequeo "${file.name}" cargada correctamente`);
    }
  };

  const handleRegisterEvaluation = () => {
    if (!selectedJuicio) {
      showToast('Por favor seleccione un juicio evaluativo (CUMPLE o NO CUMPLE)');
      return;
    }

    const caseId = selectedCase?.id || 'EXP-2024-001';
    if (selectedJuicio === 'cumple') {
      updateCase(caseId, {
        currentPhase: 'Caso Cerrado Formalmente (Cumplido)',
        slaStatus: 'closed',
        slaDaysRemaining: 0,
      });
      showToast('Evaluación registrada: Plan CUMPLIDO satisfactoriamente');
      navigateTo('case-detail', caseId);
    } else {
      updateCase(caseId, {
        currentPhase: 'Escalamiento a Comité de Evaluación y Seguimiento',
        slaStatus: 'critical',
        slaDaysRemaining: 3,
      });
      showToast('Evaluación registrada: NO CUMPLE. Redirigiendo a Solicitud de Citación a Comité...');
      navigateTo('committee-request', caseId);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header Card */}
      <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono font-bold bg-[#39a900]/15 text-[#39a900] border border-[#39a900]/30 px-2.5 py-0.5 rounded uppercase">
              FASE DE SEGUIMIENTO
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#39a900] animate-pulse"></span>
            <span className="text-xs font-mono text-gray-300">SLA: 2 días restantes</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {selectedCase?.id || 'EXP-2024-001'}
          </h2>
          <span className="material-symbols-outlined text-[#39a900] text-[22px]">
            verified
          </span>
        </div>

        <div className="bg-[#121212] rounded-xl border border-[#2d2f2f] p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <span className="text-gray-400 block mb-1">Aprendiz</span>
            <strong className="text-white text-sm">
              {selectedCase?.apprentice.name || 'Carlos Mendoza Ruiz'}
            </strong>
          </div>
          <div>
            <span className="text-gray-400 block mb-1">Programa</span>
            <strong className="text-gray-200">
              {selectedCase?.apprentice.program || 'Tecnólogo en Análisis y Desarrollo de Software'}
            </strong>
          </div>
        </div>
      </div>

      {/* Main Grid: 8 cols left form, 4 cols right timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Evaluación de Compromisos */}
        <div className="lg:col-span-8 bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-white border-b border-[#2d2f2f] pb-3">
            Evaluación de Compromisos
          </h3>

          {/* Upload Dropzone */}
          <label className="border-2 border-dashed border-[#333] hover:border-[#39a900] bg-[#252727]/40 hover:bg-[#39a900]/5 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx,.doc"
              onChange={handleFileUpload}
            />
            <div className="w-12 h-12 rounded-xl bg-[#1a1c1c] border border-[#333] flex items-center justify-center text-gray-300 group-hover:text-[#39a900] group-hover:border-[#39a900]/40 transition-colors mb-3">
              <span className="material-symbols-outlined text-[26px]">
                {uploadedFile ? 'task_alt' : 'upload'}
              </span>
            </div>
            <p className="text-xs font-medium text-white mb-1">
              {uploadedFile || 'Arrastra la Lista de Chequeo Final (PDF) o haz clic para subir'}
            </p>
            <p className="text-[11px] text-gray-400 font-mono">
              Tamaño máximo: 5MB
            </p>
          </label>

          {/* Observaciones Finales del Instructor */}
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-2">
              Observaciones Finales del Instructor
            </label>
            <textarea
              rows={4}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Detalle el desempeño del aprendiz durante el plan de mejoramiento..."
              className="w-full bg-[#252727] border border-[#333] text-gray-200 rounded-lg p-3.5 text-xs font-mono placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#39a900] leading-relaxed"
            />
          </div>

          {/* Juicio Evaluativo */}
          <div>
            <h4 className="text-xs font-mono text-gray-300 mb-3 border-b border-[#2d2f2f] pb-2">
              Juicio Evaluativo
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CUMPLE */}
              <button
                type="button"
                onClick={() => setSelectedJuicio('cumple')}
                className={`py-8 px-4 rounded-xl border-2 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                  selectedJuicio === 'cumple'
                    ? 'border-[#39a900] bg-[#39a900]/15 text-[#39a900] shadow-[0_0_15px_rgba(57,169,0,0.2)]'
                    : 'border-[#2d2f2f] bg-[#252727]/60 hover:bg-[#252727] text-gray-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedJuicio === 'cumple' ? 'bg-[#39a900] text-white' : 'border-2 border-gray-400 text-gray-300'}`}>
                  <span className="material-symbols-outlined text-[28px] font-bold">check</span>
                </div>
                <span className="text-sm font-bold tracking-wider font-mono">CUMPLE</span>
              </button>

              {/* NO CUMPLE */}
              <button
                type="button"
                onClick={() => setSelectedJuicio('no-cumple')}
                className={`py-8 px-4 rounded-xl border-2 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                  selectedJuicio === 'no-cumple'
                    ? 'border-red-600 bg-red-950/30 text-red-400 shadow-[0_0_15px_rgba(220,38,38,0.2)]'
                    : 'border-[#2d2f2f] bg-[#252727]/60 hover:bg-[#252727] text-gray-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedJuicio === 'no-cumple' ? 'bg-red-600 text-white' : 'border-2 border-gray-400 text-gray-300'}`}>
                  <span className="material-symbols-outlined text-[28px] font-bold">close</span>
                </div>
                <span className="text-sm font-bold tracking-wider font-mono">NO CUMPLE</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Línea de Tiempo Procesal */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-5 shadow-sm space-y-5">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-[#2d2f2f] pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#39a900]">timeline</span>
              <span>Línea de Tiempo Procesal</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:inset-y-2 before:left-2.5 before:w-[2px] before:bg-[#2d2f2f]">
              {/* Step 1: Citación a Descargos */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-5 h-5 rounded-full bg-[#39a900] flex items-center justify-center text-white ring-4 ring-[#1a1c1c]">
                  <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                </div>
                <h4 className="text-xs font-bold text-white font-mono leading-tight">
                  Citación a Descargos
                </h4>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                  12 Oct 2024
                </p>
              </div>

              {/* Step 2: Firma Plan de Mejoramiento */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-5 h-5 rounded-full bg-[#39a900] flex items-center justify-center text-white ring-4 ring-[#1a1c1c]">
                  <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                </div>
                <h4 className="text-xs font-bold text-white font-mono leading-tight">
                  Firma Plan de Mejoramiento
                </h4>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                  15 Oct 2024
                </p>
                <span className="text-[10px] text-gray-500 font-mono block mt-0.5">
                  SHA256: 8f4e2...a1b9
                </span>
              </div>

              {/* Step 3: Evaluación de Plan (En Progreso) */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0 w-5 h-5 rounded-full border-2 border-[#39a900] bg-[#1a1c1c] flex items-center justify-center ring-4 ring-[#1a1c1c]">
                  <div className="w-2 h-2 rounded-full bg-[#39a900]"></div>
                </div>
                <h4 className="text-xs font-bold text-[#39a900] font-mono leading-tight">
                  Evaluación de Plan
                </h4>
                <p className="text-[11px] text-gray-300 font-mono mt-0.5">
                  En progreso - Vence hoy
                </p>
              </div>

              {/* Step 4: Resolución Final */}
              <div className="relative opacity-40">
                <div className="absolute -left-[27px] top-0 w-5 h-5 rounded-full border-2 border-gray-600 bg-[#1a1c1c] flex items-center justify-center ring-4 ring-[#1a1c1c]"></div>
                <h4 className="text-xs font-bold text-gray-400 font-mono leading-tight">
                  Resolución Final
                </h4>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                  Pendiente
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
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
          onClick={handleRegisterEvaluation}
          className="px-6 py-2.5 rounded-xl bg-[#39a900] hover:bg-[#329600] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span>Registrar Evaluación</span>
        </button>
      </div>
    </div>
  );
};
