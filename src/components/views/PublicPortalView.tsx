import React, { useState } from 'react';
import { useCaseContext } from '../../context/CaseContext';

export const PublicPortalView: React.FC = () => {
  const { openAuthModal, openLegalModal } = useCaseContext();
  const [searchTerm, setSearchTerm] = useState('');

  const normativeArticles = [
    {
      num: 'Capítulo IV - Art. 9',
      title: 'Faltas Académicas Leves',
      desc: 'Inasistencias injustificadas superiores al 15% de la competencia o incumplimiento en evidencias de aprendizaje formativas.',
      tag: 'Académica'
    },
    {
      num: 'Capítulo V - Art. 24',
      title: 'Faltas Gravísimas y Fraude',
      desc: 'Suplantación de identidad en evaluaciones, plagio intelectual y alteración de plataformas institucionales.',
      tag: 'Gravísima'
    },
    {
      num: 'Capítulo VII - Art. 46',
      title: 'Procedimiento del Equipo Ejecutor',
      desc: 'Citación formal a descargos, formulación y seguimiento al Plan de Mejoramiento con plazos en días hábiles.',
      tag: 'Procedimiento'
    },
    {
      num: 'Capítulo VIII - Art. 51',
      title: 'Escalamiento Acelerado a Comité',
      desc: 'Omisión de etapas conciliatorias para faltas graves o gravísimas con impacto en la seguridad institucional.',
      tag: 'Ruta Directa'
    }
  ];

  const filtered = normativeArticles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.num.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 flex flex-col antialiased relative">
      {/* Top Navbar */}
      <header className="border-b border-[#2d2f2f] bg-[#1a1c1c]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#39a900] flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(57,169,0,0.4)]">
              S
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight">
                <span className="text-[#39a900]">SGPDP</span> SENA
              </span>
              <p className="text-[10px] text-gray-400 font-mono">Acuerdo 0009 de 2024</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => openLegalModal('faq')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs text-gray-300 hover:text-white hover:bg-[#252727] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">help</span>
              <span>Preguntas Frecuentes</span>
            </button>

            <button
              type="button"
              onClick={openAuthModal}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#39a900] hover:bg-[#329600] active:scale-95 transition-all shadow-[0_0_15px_rgba(57,169,0,0.4)] flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>ACCESO INSTITUCIONAL</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 space-y-12">
        <div className="bg-[#1a1c1c] border border-[#2d2f2f] rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#39a900]/15 border border-[#39a900]/30 text-[#39a900] text-xs font-semibold mb-6 font-mono">
            <span>⚖</span>
            <span>Reglamento del Aprendiz SENA • Acuerdo 0009 de 2024</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-5">
            Debido Proceso y <br />
            <span className="text-[#39a900] drop-shadow-[0_0_25px_rgba(57,169,0,0.3)]">
              Rutas del Aprendiz
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Plataforma oficial del SENA para la gestión y seguimiento del régimen disciplinario y formativo. Garantizamos la transparencia, el derecho a la defensa y el control de términos en días hábiles.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto relative mb-6">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar artículos, faltas o procedimientos..."
              className="w-full bg-[#121212] border border-[#2d2f2f] focus:border-[#39a900] rounded-full py-3.5 pl-12 pr-28 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#39a900]/40 transition-all shadow-inner font-mono"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick CTA to Login */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={openAuthModal}
              className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#39a900] hover:bg-[#329600] transition-all shadow-lg cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>Ingresar como Instructor / Coordinador</span>
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={openAuthModal}
            className="bg-[#1a1c1c] border border-[#2d2f2f] p-6 rounded-2xl hover:border-[#39a900]/40 transition-all group cursor-pointer shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-[#39a900]/15 flex items-center justify-center mb-4 text-[#39a900] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[24px]">menu_book</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#39a900] transition-colors">Consulta Normativa</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Acceso directo y estructurado a todos los capítulos y artículos del Acuerdo 0009 de 2024.
            </p>
          </div>

          <div 
            onClick={openAuthModal}
            className="bg-[#1a1c1c] border border-[#2d2f2f] p-6 rounded-2xl hover:border-[#39a900]/40 transition-all group cursor-pointer shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-[#39a900]/15 flex items-center justify-center mb-4 text-[#39a900] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#39a900] transition-colors">Garantías Constitucionales</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Principios rectores que aseguran el derecho a la defensa, contradicción y presunción de inocencia.
            </p>
          </div>

          <div 
            onClick={openAuthModal}
            className="bg-[#1a1c1c] border border-[#2d2f2f] p-6 rounded-2xl hover:border-[#39a900]/40 transition-all group cursor-pointer shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-[#39a900]/15 flex items-center justify-center mb-4 text-[#39a900] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[24px]">timer</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#39a900] transition-colors">Seguimiento de Tiempos SLA</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Control estricto de términos procesales mediante semaforización automatizada en días hábiles.
            </p>
          </div>
        </div>

        {/* Dynamic Normative Articles Search Results */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white tracking-tight">Artículos del Reglamento</h2>
            <span className="text-xs font-mono text-[#39a900]">{filtered.length} artículos encontrados</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((art, idx) => (
              <div key={idx} className="bg-[#1a1c1c] border border-[#2d2f2f] p-5 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-[#39a900] font-bold">{art.num}</span>
                  <span className="bg-[#252727] text-gray-300 px-2 py-0.5 rounded font-mono text-[10px] border border-[#333]">
                    {art.tag}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{art.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{art.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
