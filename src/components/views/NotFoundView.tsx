import React, { useState } from 'react';
import { useCaseContext } from '../../context/CaseContext';

export const NotFoundView: React.FC = () => {
  const { navigateTo, cases } = useCaseContext();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const found = cases.find(
      c => c.id.toLowerCase().includes(query.toLowerCase()) || 
           c.apprentice.name.toLowerCase().includes(query.toLowerCase()) ||
           c.apprentice.ficha.includes(query)
    );
    if (found) {
      navigateTo('case-detail', found.id);
    } else {
      navigateTo('dashboard');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center antialiased">
      <div className="max-w-md w-full bg-[#161818] border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Accent light */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#39a900]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="font-mono text-5xl font-black text-[#39a900] tracking-widest mb-2">
          404
        </div>

        <h2 className="text-xl font-bold text-white tracking-tight mb-2">
          Página o Expediente No Encontrado
        </h2>

        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          El recurso solicitado no existe en el sistema o fue reasignado conforme a la cadena de custodia del Acuerdo 0009 de 2024.
        </p>

        {/* Rescue Search */}
        <form onSubmit={handleSearch} className="mb-6 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por ficha, nombre o radicado..."
            className="w-full bg-[#121414] border border-gray-700 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:ring-1 focus:ring-[#39a900] focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#39a900] rounded-lg text-white flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">search</span>
          </button>
        </form>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => navigateTo('dashboard')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#39a900] hover:bg-[#329600] text-xs font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span>Regresar al Dashboard SLA</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('public-portal')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#252727] hover:bg-[#303232] text-xs font-semibold text-gray-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            <span>Ver Portal Normativo Público</span>
          </button>
        </div>
      </div>
    </div>
  );
};
