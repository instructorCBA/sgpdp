import React, { useState, useEffect } from 'react';
import { SupabaseDataService } from '../../services/supabase';

interface SupabaseDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseDiagnosticModal: React.FC<SupabaseDiagnosticModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);

  const runDiagnostic = async () => {
    setLoading(true);
    try {
      const res = await SupabaseDataService.testConnection();
      setDiagnosticResult(res);
    } catch (err: any) {
      setDiagnosticResult({
        status: 'error',
        url: 'Desconocida',
        isDemoUrl: false,
        hasAnonKey: false,
        latencyMs: 0,
        tables: [],
        errorDetails: err.message || 'Error inesperado al ejecutar el diagnóstico'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runDiagnostic();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1e2020] border border-[#2d3030] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#2d3030] flex items-center justify-between bg-[#171919]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#39a900]/10 border border-[#39a900]/30 flex items-center justify-center text-[#39a900]">
              <span className="material-symbols-outlined text-[24px]">database</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Diagnóstico de Conexión Supabase
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#39a900]/20 text-[#39a900] border border-[#39a900]/30">
                  PostgreSQL
                </span>
              </h2>
              <p className="text-xs text-gray-400">Verificación de conectividad, latencia, tablas y RLS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#252828] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-10 h-10 border-3 border-[#39a900] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-300 font-medium">Ejecutando pruebas de red y consultas SQL...</p>
              <p className="text-xs text-gray-500">Comprobando endpoints REST, tokens de autorización y tablas</p>
            </div>
          ) : diagnosticResult ? (
            <>
              {/* Connection Status Card */}
              <div className={`p-4 rounded-xl border flex items-start gap-4 ${
                diagnosticResult.status === 'connected'
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400'
                  : diagnosticResult.status === 'demo_mock'
                  ? 'bg-blue-950/30 border-blue-500/30 text-blue-300'
                  : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
              }`}>
                <span className="material-symbols-outlined text-[28px] mt-0.5">
                  {diagnosticResult.status === 'connected' ? 'check_circle' : diagnosticResult.status === 'demo_mock' ? 'info' : 'error'}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">
                      {diagnosticResult.status === 'connected' 
                        ? 'Conexión a Supabase Exitosa' 
                        : diagnosticResult.status === 'demo_mock'
                        ? 'Modo Demo / Entorno Local Configurado'
                        : 'Fallo de Conexión con Supabase'}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-black/40 font-mono text-gray-300">
                      Latencia: {diagnosticResult.latencyMs} ms
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    {diagnosticResult.errorDetails || 'El cliente de Supabase se comunica correctamente con el motor PostgreSQL.'}
                  </p>
                </div>
              </div>

              {/* Endpoint & Config Details */}
              <div className="bg-[#171919] p-4 rounded-xl border border-[#2d3030] space-y-3">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Parámetros de Conexión</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#212424] p-2.5 rounded-lg border border-[#2d3030]">
                    <span className="text-gray-500 block mb-1">Project URL</span>
                    <span className="font-mono text-gray-200 truncate block text-[11px]" title={diagnosticResult.url}>
                      {diagnosticResult.url}
                    </span>
                  </div>
                  <div className="bg-[#212424] p-2.5 rounded-lg border border-[#2d3030]">
                    <span className="text-gray-500 block mb-1">Publishable / Anon JWT Key</span>
                    <span className="font-mono text-emerald-400 text-[11px] truncate block" title={diagnosticResult.hasAnonKey ? 'Token JWT válido' : 'Clave anon'}>
                      {diagnosticResult.hasAnonKey ? 'eyJhbGciOiJIUzI1NiIsInR5cCI... (Validado)' : 'No configurado'}
                    </span>
                  </div>
                </div>
                <div className="bg-[#212424] p-2.5 rounded-lg border border-[#2d3030]">
                  <span className="text-gray-500 block mb-1">Direct Connection String (PostgreSQL 5432)</span>
                  <span className="font-mono text-gray-300 text-[11px] break-all block">
                    postgresql://postgres:***@db.rhbgftvzqifdpwumknpn.supabase.co:5432/postgres
                  </span>
                </div>
              </div>

              {/* Verified Tables Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Tablas y Esquema Relacional ({diagnosticResult.tables.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {diagnosticResult.tables.map((table: any) => (
                    <div
                      key={table.name}
                      className="bg-[#171919] p-3 rounded-lg border border-[#2d3030] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-[#39a900]">
                          table_chart
                        </span>
                        <span className="font-mono text-xs text-white font-medium">{table.name}</span>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[#252828] text-gray-300 font-mono">
                        {table.count !== undefined ? `${table.count} registros` : 'OK'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions box */}
              <div className="bg-[#212424]/60 p-4 rounded-xl border border-[#39a900]/20 text-xs text-gray-300 space-y-2">
                <div className="flex items-center gap-2 text-[#39a900] font-semibold">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Cómo conectar tu proyecto propio de Supabase en producción:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-gray-400 pl-1">
                  <li>Crea un proyecto en <strong className="text-white">supabase.com</strong>.</li>
                  <li>Ejecuta el script <strong className="text-white">/supabase/schema.sql</strong> en el SQL Editor.</li>
                  <li>Inserta los datos iniciales con <strong className="text-white">/supabase/seed.sql</strong>.</li>
                  <li>Configura las variables <code className="text-[#39a900] bg-black/40 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> y <code className="text-[#39a900] bg-black/40 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code>.</li>
                </ol>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2d3030] bg-[#171919] flex justify-between items-center">
          <button
            onClick={runDiagnostic}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#252828] hover:bg-[#2d3030] text-gray-200 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Reejecutar Diagnóstico
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#39a900] hover:bg-[#329600] text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
