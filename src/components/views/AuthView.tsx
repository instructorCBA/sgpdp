import React, { useState, useEffect } from 'react';
import { useCaseContext } from '../../context/CaseContext';
import { UserProfile } from '../../types';

export const AuthView: React.FC = () => {
  const { navigateTo, loginWithCredentials, login, users, currentUser } = useCaseContext();
  const [selectedUser, setSelectedUser] = useState<UserProfile>(currentUser || users[0]);
  const [identifier, setIdentifier] = useState(currentUser?.email || users[0]?.email || 'dpineda@sena.edu.co');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (users && users.length > 0) {
      const active = users.find(u => u.id === currentUser?.id) || users[0];
      setSelectedUser(active);
      setIdentifier(active.email);
    }
  }, [users, currentUser]);

  const handleSelectRole = (user: UserProfile) => {
    setSelectedUser(user);
    setIdentifier(user.email);
    setErrorMessage(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await loginWithCredentials(identifier, password);
      if (!result.success) {
        setErrorMessage(result.error || 'No se pudo verificar el usuario en la base de datos Supabase.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error de conexión durante el inicio de sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex flex-col justify-center items-center relative overflow-hidden p-6 selection:bg-[#39A900] selection:text-white">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#39A900]/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Back to portal button */}
      <button
        onClick={() => navigateTo('public-portal')}
        className="absolute top-6 left-6 text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1.5 bg-[#121927] border border-gray-700 px-3 py-1.5 rounded-full transition-colors cursor-pointer z-20"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        <span>Volver al Portal Público</span>
      </button>

      <main className="w-full max-w-md z-10 relative">
        <div className="bg-[#1a2235] border border-gray-700/60 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] w-full relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#39A900]/10 rounded-bl-full pointer-events-none"></div>

          {/* Logo Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#39A900] text-white rounded-2xl mb-4 shadow-[0_0_20px_rgba(57,169,0,0.4)]">
              <span className="material-symbols-outlined text-[32px]">gavel</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">SGPDP</h1>
            <p className="text-xs text-gray-400 mt-1">
              Sistema de Gestión de Rutas del Aprendiz y Debido Proceso • SENA
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
                {users.length} Registros DB
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
              {(users.length > 0 ? users : (selectedUser ? [selectedUser] : [])).map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectRole(user)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                    (selectedUser?.id === user.id || identifier === user.email)
                      ? 'border-[#39a900] bg-[#39a900]/15 text-white ring-1 ring-[#39a900]'
                      : 'border-gray-700/60 bg-[#0f172a]/80 text-gray-400 hover:text-gray-200 hover:bg-[#0f172a]'
                  }`}
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-gray-600 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate text-white">{user.name}</p>
                    <p className="text-[9px] text-gray-400 font-mono truncate">{user.roleTitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-950/80 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <span className="material-symbols-outlined text-red-400 text-[18px] shrink-0 mt-0.5">error</span>
              <div className="flex-1">
                <p className="font-semibold text-red-200">Error de Autenticación</p>
                <p className="text-[11px] text-red-300/90 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1" htmlFor="email">
                Correo Institucional o Documento
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-500 text-[18px]">person</span>
                </div>
                <input
                  id="email"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="usuario@sena.edu.co o CC..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-600 rounded-xl bg-[#0f172a] focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-xs text-white placeholder:text-gray-600 font-mono transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1" htmlFor="password">
                Contraseña Institucional / PIN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-500 text-[18px]">lock</span>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-600 rounded-xl bg-[#0f172a] focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-xs text-white placeholder:text-gray-600 font-mono transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#39A900] focus:ring-[#39A900] border-gray-600 bg-[#0f172a] rounded cursor-pointer"
                />
                <span className="ml-2 text-gray-400 font-mono text-[11px]">Recordar sesión activa</span>
              </label>
              <span className="text-xs font-mono text-[#39A900]">
                PostgreSQL Supabase
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl bg-[#39A900] hover:bg-[#329600] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-semibold focus:outline-none transition-all shadow-[0_4px_16px_rgba(57,169,0,0.3)] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Verificando usuario en Supabase...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión e Ir al Dashboard</span>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] font-mono text-gray-500 mt-6">
          © 2024 SENA • Servicio Nacional de Aprendizaje - Todos los derechos reservados.
        </p>
      </main>
    </div>
  );
};
