import React from 'react';
import { useCaseContext } from '../../context/CaseContext';

export const GlobalFooter: React.FC = () => {
  const { openLegalModal, navigateTo, theme, toggleTheme } = useCaseContext();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#161818] border-t border-[#2d2f2f] text-gray-400 text-xs mt-16 select-none">
      <div className="max-w-[1440px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Institutional Identity */}
          <div className="space-y-3">
            <div 
              onClick={() => navigateTo('public-portal')}
              className="flex items-center gap-3 cursor-pointer group"
              title="Ir al Portal Normativo"
            >
              <div className="w-9 h-9 rounded-xl bg-[#39a900] text-white font-bold flex items-center justify-center text-lg shadow-md group-hover:scale-105 transition-transform">
                S
              </div>
              <div>
                <p className="text-white font-bold text-sm tracking-tight leading-tight group-hover:text-[#39a900] transition-colors">
                  SENA SGPDP
                </p>
                <p className="text-[10px] text-gray-500 font-mono">
                  Acuerdo 0009 de 2024
                </p>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Sistema de Gestión de Rutas del Aprendiz y Debido Proceso. Plataforma oficial para la administración de medidas formativas, citaciones y comités disciplinarios.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-[#39a900]">
              <span className="w-2 h-2 rounded-full bg-[#39a900] animate-pulse"></span>
              <span>Motor SLA Operativo (Días Hábiles)</span>
            </div>
          </div>

          {/* Col 2: Legal & Regulations (Sitemap) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono uppercase text-white font-bold tracking-wider mb-1">
              Marco Legal y Normativa
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  type="button"
                  onClick={() => openLegalModal('privacy')}
                  className="hover:text-[#39a900] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[14px]">shield</span>
                  <span>Política de Privacidad y RGPD</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegalModal('terms')}
                  className="hover:text-[#39a900] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[14px]">gavel</span>
                  <span>Términos del Servicio SGPDP</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegalModal('faq')}
                  className="hover:text-[#39a900] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[14px]">help</span>
                  <span>Preguntas Frecuentes (FAQ)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegalModal('about')}
                  className="hover:text-[#39a900] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[14px]">corporate_fare</span>
                  <span>Acerca del Sistema SGPDP</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('public-portal')}
                  className="hover:text-[#39a900] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[14px]">menu_book</span>
                  <span>Portal Normativo y Garantías</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Verified NAP (Name, Address, Phone) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono uppercase text-white font-bold tracking-wider mb-1">
              Atención Institucional (NAP)
            </h4>
            <div className="space-y-1.5 text-[11px] font-mono">
              <p className="flex items-start gap-1.5 text-gray-300">
                <span className="material-symbols-outlined text-[15px] text-[#39a900] shrink-0">location_on</span>
                <span>Calle 57 No. 8-69, Bogotá D.C., Colombia</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#39a900] shrink-0">call</span>
                <a href="tel:+576013430111" className="hover:text-[#39a900] transition-colors">
                  PBX: (601) 343 0111
                </a>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#39a900] shrink-0">support_agent</span>
                <a href="tel:018000910270" className="hover:text-[#39a900] transition-colors">
                  Línea Gratuita: 01 8000 910 270
                </a>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#39a900] shrink-0">mail</span>
                <a href="mailto:contacto@sena.edu.co" className="hover:text-[#39a900] transition-colors">
                  contacto@sena.edu.co
                </a>
              </p>
            </div>
          </div>

          {/* Col 4: Trust Badges & System Assurance */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-white font-bold tracking-wider mb-1">
              Garantías de Seguridad
            </h4>
            <div className="p-3 bg-[#121414] border border-[#2d2f2f] rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-gray-300">
                <span className="material-symbols-outlined text-[#39a900] text-[16px]">lock</span>
                <span>Cifrado TLS 1.3 / AES-256</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-gray-300">
                <span className="material-symbols-outlined text-[#50e5f9] text-[16px]">verified</span>
                <span>Cadena de Custodia SHA-256</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-gray-300">
                <span className="material-symbols-outlined text-[#fdc300] text-[16px]">fingerprint</span>
                <span>Firma Electrónica OTP 6-Dígitos</span>
              </div>
            </div>

            {/* Social Channels with target=_blank and rel=noopener */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://www.sena.edu.co"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-[#252727] hover:bg-[#39a900] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                title="Sitio Oficial SENA"
              >
                <span className="material-symbols-outlined text-[16px]">language</span>
              </a>
              <a
                href="https://twitter.com/SENAComunica"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-[#252727] hover:bg-[#39a900] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                title="Twitter SENA Comunica"
              >
                <span className="text-[12px] font-bold">𝕏</span>
              </a>
              <a
                href="https://www.facebook.com/SENA"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-[#252727] hover:bg-[#39a900] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                title="Facebook SENA"
              >
                <span className="text-[12px] font-bold">f</span>
              </a>
              <a
                href="https://www.youtube.com/user/SENATV"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-[#252727] hover:bg-[#39a900] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                title="YouTube SENA"
              >
                <span className="material-symbols-outlined text-[16px]">smart_display</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Version & Theme Toggle */}
        <div className="pt-6 border-t border-[#2d2f2f] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono">
          <p className="text-gray-500 text-center sm:text-left">
            © {currentYear} Servicio Nacional de Aprendizaje (SENA). Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4">
            <span className="px-2.5 py-0.5 rounded-full bg-[#121414] border border-[#2d2f2f] text-gray-400">
              Versión 2.4.0 (Acuerdo 0009/2024)
            </span>

            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors cursor-pointer bg-[#252727] px-2.5 py-1 rounded-full border border-gray-700"
              title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
              <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
