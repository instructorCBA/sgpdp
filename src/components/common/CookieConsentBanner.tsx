import React, { useState, useEffect } from 'react';
import { useCaseContext } from '../../context/CaseContext';

export const CookieConsentBanner: React.FC = () => {
  const { openLegalModal } = useCaseContext();
  const [showBanner, setShowBanner] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [preferencesEnabled, setPreferencesEnabled] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('sgpdp_cookie_consent');
    if (!consent) {
      // Delay slightly for smooth entrance
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      'sgpdp_cookie_consent',
      JSON.stringify({ technical: true, analytics: true, preferences: true, date: new Date().toISOString() })
    );
    setShowBanner(false);
    setShowConfigModal(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem(
      'sgpdp_cookie_consent',
      JSON.stringify({ technical: true, analytics: false, preferences: false, date: new Date().toISOString() })
    );
    setShowBanner(false);
    setShowConfigModal(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem(
      'sgpdp_cookie_consent',
      JSON.stringify({ technical: true, analytics: analyticsEnabled, preferences: preferencesEnabled, date: new Date().toISOString() })
    );
    setShowBanner(false);
    setShowConfigModal(false);
  };

  if (!showBanner && !showConfigModal) return null;

  return (
    <>
      {/* Main Banner */}
      {showBanner && !showConfigModal && (
        <div 
          role="region" 
          aria-label="Consentimiento de Cookies y Privacidad"
          className="fixed bottom-4 right-4 left-4 md:left-auto md:max-w-xl z-50 bg-[#161818]/95 border border-[#39a900]/40 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md text-white animate-fadeIn"
        >
          <div className="flex items-start gap-3.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#39a900]/20 text-[#39a900] flex items-center justify-center shrink-0 border border-[#39a900]/30">
              <span className="material-symbols-outlined text-[20px]">cookie</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                Gestión de Cookies y Protección de Datos
              </h4>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                El SENA utiliza cookies técnicas esenciales y analíticas para garantizar la seguridad de las sesiones, medir tiempos de respuesta SLA y cumplir con la Ley 1581 de 2012 y el RGPD.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#2d2f2f]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => openLegalModal('privacy')}
                className="text-[11px] font-mono text-[#39a900] hover:underline cursor-pointer"
              >
                Política de Privacidad
              </button>
              <span className="text-gray-600">•</span>
              <button
                type="button"
                onClick={() => setShowConfigModal(true)}
                className="text-[11px] font-mono text-gray-400 hover:text-gray-200 underline cursor-pointer"
              >
                Configurar
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 bg-[#252727] hover:bg-[#303232] transition-colors cursor-pointer"
              >
                Solo Necesarias
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#39a900] hover:bg-[#329600] transition-colors shadow-md cursor-pointer"
              >
                Aceptar Todas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Granular Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative z-10 w-full max-w-md bg-[#161818] border border-gray-700 rounded-2xl p-6 shadow-2xl text-white">
            <div className="flex justify-between items-center pb-3 border-b border-gray-700 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#39a900]">tune</span>
                <span>Preferencias de Privacidad y Cookies</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6 text-xs">
              {/* Technical Cookies */}
              <div className="p-3 bg-[#121414] rounded-xl border border-gray-800 flex justify-between items-center">
                <div className="pr-3">
                  <p className="font-bold text-white">Cookies Técnicas (Obligatorias)</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    Requeridas para la autenticación, tokens de sesión y seguridad del debido proceso.
                  </p>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-1 bg-[#39a900]/20 text-[#39a900] rounded font-bold">
                  Siempre Activo
                </span>
              </div>

              {/* Analytics Cookies */}
              <div className="p-3 bg-[#121414] rounded-xl border border-gray-800 flex justify-between items-center">
                <div className="pr-3">
                  <p className="font-bold text-white">Cookies de Analítica y Rendimiento</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    Permiten medir los tiempos de respuesta procesal SLA y Core Web Vitals.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#39a900] focus:ring-[#39a900] rounded cursor-pointer"
                />
              </div>

              {/* Preferences Cookies */}
              <div className="p-3 bg-[#121414] rounded-xl border border-gray-800 flex justify-between items-center">
                <div className="pr-3">
                  <p className="font-bold text-white">Cookies de Personalización</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    Recuerdan tu modo visual (oscuro/claro) y filtros de búsqueda de expedientes.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferencesEnabled}
                  onChange={(e) => setPreferencesEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#39a900] focus:ring-[#39a900] rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-700">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white bg-[#252727]"
              >
                Rechazar Opcionales
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#39a900] hover:bg-[#329600]"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
