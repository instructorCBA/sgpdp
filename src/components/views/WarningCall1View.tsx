import React, { useState } from 'react';
import { useCaseContext } from '../../context/CaseContext';

interface FaultOption {
  id: string;
  article: string;
  numeral: string;
  description: string;
  selected: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  ready: boolean;
}

export const WarningCall1View: React.FC = () => {
  const { navigateTo, showToast, addCase } = useCaseContext();

  const [documentInput, setDocumentInput] = useState('1029384756');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Apprentice info
  const [apprentice] = useState({
    name: 'Carlos Rodriguez',
    document: 'CC 1029384756',
    ficha: '2541982',
    program: 'ADSO (Análisis y Desarrollo de Software)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  });

  // Faults list
  const [faults, setFaults] = useState<FaultOption[]>([
    {
      id: 'f-1',
      article: 'Art. 9',
      numeral: 'Numeral 1',
      description: 'Inasistencias injustificadas que superen el 20% de las horas totales de la competencia.',
      selected: true
    },
    {
      id: 'f-2',
      article: 'Art. 9',
      numeral: 'Numeral 2',
      description: 'Incumplimiento injustificado en la entrega de evidencias de aprendizaje en las fechas concertadas.',
      selected: false
    },
    {
      id: 'f-3',
      article: 'Art. 10',
      numeral: 'Numeral 4',
      description: 'Comportamiento irrespetuoso hacia instructores, compañeros o personal administrativo en ambientes de formación.',
      selected: false
    },
    {
      id: 'f-4',
      article: 'Art. 10',
      numeral: 'Numeral 8',
      description: 'Uso inadecuado de herramientas tecnológicas, software institucional o equipos asignados en los talleres.',
      selected: false
    }
  ]);

  // Uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: 'up-1',
      name: 'Informe_Inasistencias_CarlosR.pdf',
      size: '1.2 MB',
      ready: true
    }
  ]);

  const toggleFault = (id: string) => {
    setFaults(prev => prev.map(f => f.id === id ? { ...f, selected: !f.selected } : f));
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newFile: UploadedFile = {
        id: `up-${Date.now()}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        ready: true
      };
      setUploadedFiles(prev => [...prev, newFile]);
      showToast(`Archivo "${file.name}" adjuntado exitosamente`);
    }
  };

  const handleGenerateWarning = () => {
    const selectedCount = faults.filter(f => f.selected).length;
    if (selectedCount === 0) {
      showToast('Por favor seleccione al menos una falta del reglamento');
      return;
    }

    const newCaseId = `EXP-2024-LLAMADO-${Math.floor(1000 + Math.random() * 9000)}`;
    addCase({
      id: newCaseId,
      apprentice: {
        id: 'app-carlos',
        name: apprentice.name,
        documentType: 'CC',
        documentNumber: apprentice.document.replace('CC ', ''),
        ficha: apprentice.ficha,
        program: apprentice.program,
        regional: 'Distrito Capital',
        center: 'Centro de Servicios Financieros',
        avatarUrl: apprentice.avatar,
        email: 'crodriguez@soy.sena.edu.co',
        phone: '315 890 1234'
      },
      faultCategory: 'Académica (Leve)',
      severity: 'Leve',
      normativeArticle: faults.find(f => f.selected)?.article || 'Art. 9 Num. 1',
      faultDescription: faults.filter(f => f.selected).map(f => f.description).join('. '),
      currentPhase: '1er Llamado de Atención Notificado',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      slaDaysRemaining: 5,
      slaDueDate: '29 Oct 2024',
      slaStatus: 'stable',
      isAccelerated: false,
      priorSanctions: [
        {
          id: `ps-${Date.now()}`,
          title: '1er Llamado de Atención',
          date: '24 Oct 2024',
          instructor: 'Diana Marcela Pineda',
          description: faults.filter(f => f.selected).map(f => f.description).join('. '),
          sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          status: 'Activo'
        }
      ],
      evidences: uploadedFiles.map(f => ({
        id: f.id,
        name: f.name,
        type: 'pdf',
        size: f.size,
        date: '24 Oct 2024',
        sha256: 'd5a8e9f1234bcde567890123456789abcdef0123456789abcdef0123456789ab',
        verified: true
      })),
      timeline: [
        {
          id: 'step-1',
          title: 'Inicio de Proceso',
          date: '24 Oct 2024',
          responsible: 'Instructor Reportante',
          status: 'completed',
          notes: 'Registro inicial de la falta y reporte de inasistencias.'
        },
        {
          id: 'step-2',
          title: '1er Llamado de Atención',
          date: '24 Oct 2024',
          responsible: 'Diana Marcela Pineda',
          status: 'current',
          actionText: 'Ver Oficio Firmado',
          notes: 'Medida formativa en trámite (SLA: 5 días hábiles para descargo o aceptación).'
        },
        {
          id: 'step-3',
          title: '2do Llamado de Atención',
          status: 'pending',
          notes: 'Condicionado a reiteración de la falta o desacato.'
        },
        {
          id: 'step-4',
          title: 'Citación Equipo Ejecutor',
          status: 'pending'
        },
        {
          id: 'step-5',
          title: 'Sesión Equipo Ejecutor',
          status: 'pending'
        }
      ]
    });

    showToast('1er Llamado de Atención generado y notificado electrónicamente');
    navigateTo('case-detail', newCaseId);
  };

  const filteredFaults = faults.filter(f =>
    f.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.article.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.numeral.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-[#39a900] tracking-tight leading-tight flex items-center gap-2">
          <span>Registro de Medida Formativa - 1er Llamado de Atención</span>
        </h2>
      </div>

      {/* Info Banner: Redirección Inteligente Activa */}
      <div className="bg-[#1a2e1d] border border-[#39a900]/40 rounded-xl p-4 flex items-start gap-3 text-xs leading-relaxed text-gray-300 shadow-sm">
        <div className="w-5 h-5 rounded-full bg-[#39a900]/20 flex items-center justify-center text-[#39a900] shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-[16px]">info</span>
        </div>
        <div className="flex-1">
          <strong className="text-white font-semibold block mb-0.5">
            Redirección Inteligente Activa
          </strong>
          <span>
            Si el aprendiz consultado ya posee un Expediente Digital abierto o un Llamado de Atención previo en los últimos 30 días, el sistema lo redirigirá automáticamente a dicho expediente para anexar la nueva evidencia, garantizando la unicidad del proceso.
          </span>
        </div>
      </div>

      {/* Main Content Grid: 8 cols left form, 4 cols right metadata & timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Búsqueda de Aprendiz */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#39a900] text-black font-bold text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Búsqueda de Aprendiz
              </h3>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Documento del Aprendiz
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                    badge
                  </span>
                  <input
                    type="text"
                    value={documentInput}
                    onChange={(e) => setDocumentInput(e.target.value)}
                    placeholder="Número de documento"
                    className="w-full bg-[#252727] border border-[#333] text-white rounded-lg py-2.5 pl-10 pr-4 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#39a900]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Aprendiz verificado en base de datos')}
                  className="bg-[#252727] hover:bg-[#333] text-gray-200 border border-[#333] px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  <span>Buscar</span>
                </button>
              </div>
            </div>

            {/* Apprentice Data Card */}
            <div className="bg-[#252727] border border-[#2d2f2f] rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
              <img
                src={apprentice.avatar}
                alt={apprentice.name}
                className="w-14 h-14 rounded-xl object-cover border border-[#333] shrink-0"
              />
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-mono text-gray-400 block">
                    NOMBRE COMPLETO
                  </span>
                  <strong className="text-white text-sm">{apprentice.name}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-gray-400 block">
                    DOCUMENTO
                  </span>
                  <span className="text-gray-200 font-mono">{apprentice.document}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] uppercase font-mono text-gray-400 block">
                    FICHA
                  </span>
                  <span className="inline-block bg-[#1a1c1c] text-[#39a900] border border-[#39a900]/30 px-2 py-0.5 rounded text-[11px] font-mono font-bold mt-0.5">
                    {apprentice.ficha}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] uppercase font-mono text-gray-400 block">
                    PROGRAMA
                  </span>
                  <span className="text-gray-300 truncate block">{apprentice.program}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Faltas al Reglamento */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#39a900] text-black font-bold text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Faltas al Reglamento
              </h3>
            </div>

            {/* Search Input for Faults */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por Artículo, Numeral o Descripción de la falta..."
                className="w-full bg-[#252727] border border-[#333] text-white rounded-lg py-2.5 pl-10 pr-4 text-xs placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#39a900]"
              />
            </div>

            {/* Checkbox Fault Cards */}
            <div className="space-y-2.5">
              {filteredFaults.map((f) => (
                <div
                  key={f.id}
                  onClick={() => toggleFault(f.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    f.selected
                      ? 'bg-[#39a900]/10 border-[#39a900]'
                      : 'bg-[#252727] border-[#2d2f2f] hover:border-[#444]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                      f.selected
                        ? 'bg-[#39a900] text-white'
                        : 'border border-gray-500 bg-transparent'
                    }`}
                  >
                    {f.selected && (
                      <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                    )}
                  </div>
                  <div className="flex-1 text-xs">
                    <span className="font-bold text-white font-mono mr-1.5">
                      {f.article} {f.numeral}:
                    </span>
                    <span className="text-gray-300 leading-relaxed">{f.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Evidencia Probatoria */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#39a900] text-black font-bold text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Evidencia Probatoria
              </h3>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Adjunte el "Informe del Instructor", registros de asistencia, correos electrónicos o cualquier documento que soporte el llamado de atención. (Formatos permitidos: PDF, DOCX. Max 5MB).
            </p>

            {/* Drop Zone */}
            <label className="border-2 border-dashed border-[#333] hover:border-[#39a900] bg-[#252727]/50 hover:bg-[#39a900]/5 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.doc"
                onChange={handleFileUpload}
              />
              <span className="material-symbols-outlined text-[36px] text-gray-400 group-hover:text-[#39a900] mb-2 transition-colors">
                cloud_upload
              </span>
              <p className="text-xs text-gray-300 font-medium">
                Arrastre los archivos aquí o haga clic para explorar su equipo
              </p>
              <span className="mt-3 inline-block bg-[#252727] border border-[#444] text-xs font-semibold text-gray-200 px-4 py-1.5 rounded-lg group-hover:bg-[#39a900] group-hover:text-white group-hover:border-[#39a900] transition-colors">
                Añadir Archivos
              </span>
            </label>

            {/* File List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-[#252727] border border-[#2d2f2f] rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-red-400 text-[22px]">
                        picture_as_pdf
                      </span>
                      <div>
                        <p className="font-mono text-white font-medium">{file.name}</p>
                        <p className="text-[11px] text-gray-400">
                          {file.size} • <span className="text-[#39a900] font-medium">Listo</span>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-[#1a1c1c] rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Metadata, Timeline, Action buttons */}
        <div className="lg:col-span-4 space-y-6">
          {/* Metadata Card */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-[#2d2f2f] pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#39a900]">info</span>
              <span>METADATOS DEL TRÁMITE</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  Fecha de Generación:
                </span>
                <strong className="text-gray-200 font-mono">24 Oct 2024, 14:30</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">person</span>
                  Instructor Reportante:
                </span>
                <strong className="text-gray-200">Diana Marcela Pineda (Usted)</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">timer</span>
                  SLA de Respuesta Aprendiz:
                </span>
                <span className="bg-[#fdc300]/15 text-[#fdc300] border border-[#fdc300]/30 px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fdc300]"></span>
                  5 Días Hábiles
                </span>
              </div>

              <div>
                <span className="text-gray-400 block mb-1">Firma Digital (Hash Previsto):</span>
                <div className="bg-[#252727] p-2 rounded border border-[#333] font-mono text-[10px] text-gray-400 break-all leading-tight">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-[#2d2f2f] pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#39a900]">trending_up</span>
              <span>Línea de Tiempo del Debido Proceso</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-2 before:w-[2px] before:bg-[#2d2f2f]">
              {/* Step 1: Inicio de Proceso */}
              <div className="relative">
                <div className="absolute -left-[27px] w-5 h-5 rounded-full bg-[#39a900] flex items-center justify-center text-white ring-4 ring-[#1a1c1c]">
                  <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-tight">Inicio de Proceso</h4>
                <p className="text-[11px] text-[#39a900] font-mono mt-0.5">Completado - 24 Oct 2024</p>
              </div>

              {/* Step 2: 1er Llamado de Atención */}
              <div className="relative">
                <div className="absolute -left-[27px] w-5 h-5 rounded-full bg-[#39a900] flex items-center justify-center text-white ring-4 ring-[#1a1c1c]">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <h4 className="text-xs font-bold text-white leading-tight">1er Llamado de Atención</h4>
                <p className="text-[11px] text-[#39a900] font-medium mt-0.5">En Progreso (Actual)</p>
              </div>

              {/* Step 3: 2do Llamado de Atención */}
              <div className="relative opacity-40">
                <div className="absolute -left-[27px] w-5 h-5 rounded-full bg-[#252727] border border-[#333] flex items-center justify-center ring-4 ring-[#1a1c1c]"></div>
                <h4 className="text-xs font-semibold text-gray-300 leading-tight">2do Llamado de Atención</h4>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5">Pendiente</p>
              </div>

              {/* Step 4: Citación Equipo Ejecutor */}
              <div className="relative opacity-40">
                <div className="absolute -left-[27px] w-5 h-5 rounded-full bg-[#252727] border border-[#333] flex items-center justify-center ring-4 ring-[#1a1c1c]"></div>
                <h4 className="text-xs font-semibold text-gray-300 leading-tight">Citación Equipo Ejecutor</h4>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5">Pendiente</p>
              </div>

              {/* Step 5: Sesión Equipo Ejecutor */}
              <div className="relative opacity-40">
                <div className="absolute -left-[27px] w-5 h-5 rounded-full bg-[#252727] border border-[#333] flex items-center justify-center ring-4 ring-[#1a1c1c]"></div>
                <h4 className="text-xs font-semibold text-gray-300 leading-tight">Sesión Equipo Ejecutor</h4>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5">Pendiente</p>
              </div>
            </div>
          </div>

          {/* Action Buttons & Certify Note */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGenerateWarning}
              className="w-full bg-[#39a900] hover:bg-[#329600] active:scale-[0.98] text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_rgba(57,169,0,0.3)] hover:shadow-[0_6px_20px_rgba(57,169,0,0.4)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Generar Llamado de Atención</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('dashboard')}
              className="w-full bg-[#1a1c1c] hover:bg-[#252727] text-gray-300 border border-[#2d2f2f] py-2.5 px-4 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <p className="text-[11px] text-gray-500 leading-tight text-center px-2">
              Al hacer clic en "Generar", certifico que la información reportada es veraz y se adjuntan los soportes necesarios conforme al Reglamento del Aprendiz SENA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
