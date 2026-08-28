import React, { useState, useRef, useEffect } from 'react';
import { useCaseContext } from '../../context/CaseContext';
import { SupabaseDiagnosticModal } from '../modals/SupabaseDiagnosticModal';

interface TopNavBarProps {
  searchPlaceholder?: string;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ 
  searchPlaceholder = "Buscar casos, aprendices, fichas o artículos..." 
}) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    navigateTo, 
    showToast, 
    currentUser, 
    setCurrentUser, 
    users,
    logout,
    cases,
    theme,
    toggleTheme,
    toggleMobileDrawer,
    openLegalModal
  } = useCaseContext();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim() === '' ? [] : cases.filter(c => 
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.apprentice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.apprentice.ficha.includes(searchQuery) ||
    c.faultCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="bg-[#1a1c1c] border-b border-[#2d2f2f] flex justify-between items-center w-full px-4 sm:px-8 h-16 sticky top-0 z-30 flex-shrink-0 backdrop-blur-md">
      {/* Left: Mobile Hamburger & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={toggleMobileDrawer}
          className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-[#252727] transition-colors cursor-pointer"
          aria-label="Abrir menú de navegación"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Search Bar with Autocomplete */}
        <div className="flex-1 relative" ref={searchRef}>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-gray-400 text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder={searchPlaceholder}
              className="w-full bg-[#121212] border border-[#2d2f2f] focus:border-[#39a900] text-gray-200 placeholder-gray-500 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#39a900] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-3 text-gray-400 hover:text-gray-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Autocomplete Dropdown */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-[#1e2020] border border-[#2d2f2f] rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
              <div className="p-2 border-b border-[#2d2f2f] text-[10px] font-mono text-gray-400 uppercase">
                Resultados de Búsqueda ({searchResults.length})
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-[#2d2f2f]">
                {searchResults.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      navigateTo('case-detail', c.id);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-3 hover:bg-[#252727] cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <span className="font-mono text-[#39a900] font-bold">{c.id}</span>
                      <p className="text-white font-medium">{c.apprentice.name}</p>
                      <p className="text-gray-400 text-[11px] font-mono">Ficha: {c.apprentice.ficha} • {c.faultCategory}</p>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 text-[18px]">
                      arrow_forward
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Route Nav Pills */}
        <div className="hidden xl:flex items-center gap-1 bg-[#121212] p-1 rounded-full border border-[#2d2f2f] text-xs">
          <span className="text-gray-400 px-2 font-medium">Ruta:</span>
          <button 
            onClick={() => navigateTo('smart-triage')}
            className="px-2 py-1 rounded-full text-gray-300 hover:text-white hover:bg-[#252727] transition-all cursor-pointer"
            title="Triaje y Escalamiento"
          >
            Triaje
          </button>
          <button 
            onClick={() => navigateTo('warning-1')}
            className="px-2 py-1 rounded-full text-gray-300 hover:text-white hover:bg-[#252727] transition-all cursor-pointer"
            title="1er Llamado"
          >
            1er Llamado
          </button>
          <button 
            onClick={() => navigateTo('warning-2')}
            className="px-2 py-1 rounded-full text-gray-300 hover:text-white hover:bg-[#252727] transition-all cursor-pointer"
            title="2do Llamado"
          >
            2do Llamado
          </button>
          <button 
            onClick={() => navigateTo('executor-citation', 'EXP-2024-001')}
            className="px-2 py-1 rounded-full text-gray-300 hover:text-white hover:bg-[#252727] transition-all cursor-pointer"
            title="Citación"
          >
            Citación
          </button>
          <button 
            onClick={() => navigateTo('plan-evaluation', 'EXP-2024-001')}
            className="px-2 py-1 rounded-full text-gray-300 hover:text-white hover:bg-[#252727] transition-all cursor-pointer"
            title="Eval. Plan"
          >
            Eval. Plan
          </button>
          <button 
            onClick={() => navigateTo('committee-schedule', 'EXP-2024-0842')}
            className="px-2 py-1 rounded-full text-gray-300 hover:text-white hover:bg-[#252727] transition-all cursor-pointer"
            title="Comité"
          >
            Comité
          </button>
        </div>

        {/* Portal Normativo Button */}
        <button 
          type="button"
          onClick={() => navigateTo('public-portal')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-300 bg-[#121212] border border-[#2d2f2f] hover:border-[#39a900] hover:text-[#39a900] transition-colors cursor-pointer"
          title="Ver Portal Normativo Público"
        >
          <span className="material-symbols-outlined text-[16px]">menu_book</span>
          <span>Portal Normativo</span>
        </button>

        {/* Supabase DB Connection Diagnostics */}
        <button
          type="button"
          onClick={() => setIsDiagnosticOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50 hover:border-emerald-400 transition-colors cursor-pointer"
          title="Verificar Estado y Diagnóstico de Supabase (PostgreSQL)"
          aria-label="Diagnóstico de Supabase"
        >
          <span className="w-2 h-2 rounded-full bg-[#39a900] animate-pulse"></span>
          <span className="hidden sm:inline font-mono text-[11px]">DB Supabase</span>
        </button>

        {/* Theme Toggle (Dark / Light) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#252727] transition-colors cursor-pointer"
          title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
          aria-label="Cambiar tema de color"
        >
          <span className="material-symbols-outlined text-[20px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications */}
        <button 
          type="button"
          onClick={() => showToast('Tienes 3 notificaciones procesales vigentes en término')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-[#252727] transition-colors relative cursor-pointer"
          title="Notificaciones"
          aria-label="Notificaciones del sistema"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#d32f2f] rounded-full animate-pulse"></span>
        </button>

        {/* FAQ / Legal Helper */}
        <button 
          type="button"
          onClick={() => openLegalModal('faq')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-[#252727] transition-colors cursor-pointer"
          title="Preguntas Frecuentes / Guía Legal"
          aria-label="Preguntas Frecuentes"
        >
          <span className="material-symbols-outlined text-[20px]">help_outline</span>
        </button>

        {/* User Profile Avatar with Dropdown */}
        <div className="relative" ref={menuRef}>
          <div 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2.5 pl-2 border-l border-[#2d2f2f] cursor-pointer group select-none"
            title="Menú de Usuario Institucional"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#39a900]/70 group-hover:border-[#39a900] transition-colors shadow-sm">
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name}
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-gray-200 leading-none group-hover:text-[#39a900] transition-colors flex items-center gap-1">
                <span>{currentUser.name}</span>
                <span className="material-symbols-outlined text-[14px] text-gray-400">expand_more</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-none">
                {currentUser.roleTitle}
              </p>
            </div>
          </div>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 top-12 w-64 bg-[#1a1c1c] border border-[#2d2f2f] rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn text-gray-200">
              <div className="px-4 py-3 border-b border-[#2d2f2f]">
                <p className="text-xs font-bold text-white">{currentUser.name}</p>
                <p className="text-[11px] text-gray-400 font-mono">{currentUser.email}</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#39a900]/20 text-[#39a900] border border-[#39a900]/40">
                  Rol: {currentUser.role}
                </span>
              </div>

              {/* Role Switcher */}
              <div className="px-3 py-2 border-b border-[#2d2f2f]">
                <p className="text-[10px] font-mono text-gray-400 uppercase font-semibold mb-1.5 px-1">
                  Usuarios desde Supabase DB:
                </p>
                <div className="space-y-1">
                  {(users.length > 0 ? users : [currentUser]).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setCurrentUser(u);
                        showToast(`Usuario activo: ${u.name} (${u.role})`);
                        setIsProfileMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        currentUser.id === u.id
                          ? 'bg-[#39a900]/20 text-[#39a900] font-semibold'
                          : 'text-gray-300 hover:bg-[#252727]'
                      }`}
                    >
                      <span className="truncate">{u.name}</span>
                      <span className="text-[10px] font-mono text-gray-400">{u.role}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Links & Actions */}
              <div className="p-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    openLegalModal('about');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-gray-300 hover:bg-[#252727] flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">info</span>
                  <span>Acerca del SGPDP</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    openLegalModal('privacy');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-gray-300 hover:bg-[#252727] flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">shield</span>
                  <span>Privacidad y Datos</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Supabase Connection Diagnostic Modal */}
      <SupabaseDiagnosticModal 
        isOpen={isDiagnosticOpen} 
        onClose={() => setIsDiagnosticOpen(false)} 
      />
    </header>
  );
};
