import React, { useState, useEffect } from 'react';
import { useCaseContext } from '../../context/CaseContext';
import { UserProfile } from '../../types';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithCredentials, login, users, currentUser } = useCaseContext();
  const [selectedUser, setSelectedUser] = useState<UserProfile>(currentUser || users[0]);
  const [identifier, setIdentifier] = useState(currentUser?.email || users[0]?.email || 'dpineda@sena.edu.co');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sincronizar usuario seleccionado si los usuarios cambian desde Supabase
  useEffect(() => {
    if (users && users.length > 0) {
      const active = users.find(u => u.id === currentUser?.id) || users[0];
      setSelectedUser(active);
      setIdentifier(active.email);
    }
  }, [users, currentUser]);

  if (!isAuthModalOpen) return null;

  const handleSelectRole = (user: UserProfile) => {
    setSelectedUser(user);
    setIdentifier(user.email);
    setErrorMessage(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await loginWithCredentials(identifier, password);
      if (!result.success) {
        setErrorMessage(result.error || 'No se pudo verificar el usuario en Supabase.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error durante la autenticación institucional.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close */}
      <div 
        className="fixed inset-0 bg-transparent" 
        onClick={closeAuthModal} 
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg bg-[#141b2d] border border-gray-700/70 rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden text-white">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#39a900]/15 rounded-bl-full pointer-events-none"></div>

        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-gray-400 hover:text-white bg-[#0f172a] hover:bg-[#1f293d] w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer border border-gray-700"
          title="Cerrar ventana"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#39a900] text-white rounded-2xl mb-3 shadow-[0_0_20px_rgba(57,169,0,0.45)]">
            <span className="material-symbols-outlined text-[28px]">gavel</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Acceso Institucional SGPDP
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Autenticación directa con Base de Datos Supabase PostgreSQL • Acuerdo 0009
          </p>
        </div>

        {/* Quick Role Profiles */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[11px] font-mono uppercase text-gray-400 font-semibold">
              Usuarios Registrados en Supabase:
            </label>
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39a900] animate-pulse"></span>
              {users.length} Cuentas DB
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
            {users.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleSelectRole(user)}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  (selectedUser?.id === user.id || identifier === user.email)
                    ? 'border-[#39a900] bg-[#39a900]/15 text-white ring-1 ring-[#39a900]'
                    : 'border-gray-700/60 bg-[#0f172a]/80 text-gray-400 hover:text-gray-200 hover:bg-[#0f172a]'
                }`}
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-600 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate text-white">{user.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono truncate">{user.roleTitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <span className="material-symbols-outlined text-red-400 text-[18px] shrink-0 mt-0.5">error</span>
            <div className="flex-1">
              <p className="font-semibold text-red-200">Error de Autenticación</p>
              <p className="text-[11px] text-red-300/90 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1" htmlFor="modal-identifier">
              Correo Institucional o Documento de Identidad
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-[18px]">person</span>
              </div>
              <input
                id="modal-identifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="usuario@sena.edu.co o CC 1023..."
                className="block w-full pl-9 pr-3 py-2.5 border border-gray-600 rounded-xl bg-[#0b1222] focus:ring-2 focus:ring-[#39a900] focus:border-[#39a900] text-xs text-white placeholder:text-gray-600 font-mono transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1" htmlFor="modal-password">
              Contraseña Institucional / PIN
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-[18px]">lock</span>
              </div>
              <input
                id="modal-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-9 pr-3 py-2.5 border border-gray-600 rounded-xl bg-[#0b1222] focus:ring-2 focus:ring-[#39a900] focus:border-[#39a900] text-xs text-white placeholder:text-gray-600 font-mono transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[#39a900] focus:ring-[#39a900] border-gray-600 bg-[#0b1222] rounded cursor-pointer"
              />
              <span className="ml-2 text-gray-400 font-mono text-[11px]">Recordar sesión activa</span>
            </label>
            <span className="text-[11px] font-mono text-[#39a900] opacity-80">
              Supabase Auth Conectado
            </span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl bg-[#39a900] hover:bg-[#329600] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold focus:outline-none transition-all shadow-[0_4px_20px_rgba(57,169,0,0.4)] cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Verificando credenciales en Supabase...</span>
              </>
            ) : (
              <>
                <span>Ingresar al Sistema de Debido Proceso</span>
                <span className="material-symbols-outlined text-[18px]">login</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[10px] font-mono text-gray-500 mt-4">
          Servicio Nacional de Aprendizaje SENA • Dirección de Formación Profesional
        </p>
      </div>
    </div>
  );
};
