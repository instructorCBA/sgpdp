import React, { useState } from 'react';
import { useCaseContext } from '../../context/CaseContext';

export const LiveSupportWidget: React.FC = () => {
  const { showToast } = useCaseContext();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'assistant' | 'pqrsd'>('assistant');
  
  // PQRSD Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ficha, setFicha] = useState('');
  const [subject, setSubject] = useState('Consulta Debido Proceso');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-spam honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Assistant Query
  const [assistantInput, setAssistantInput] = useState('');
  const [chatLog, setChatLog] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: '¡Hola! Soy el Orientador Virtual de Debido Proceso del SENA. Puedes consultarme sobre artículos del Acuerdo 0009 de 2024, plazos en días hábiles o radicar una solicitud formal.'
    }
  ]);

  const handleAssistantSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantInput.trim()) return;

    const query = assistantInput.trim();
    const userMsg = { sender: 'user' as const, text: query };
    setChatLog(prev => [...prev, userMsg]);
    setAssistantInput('');

    // Determine legal answer based on query
    setTimeout(() => {
      let botResponse = 'De acuerdo con el Reglamento del Aprendiz (Acuerdo 0009 de 2024), todo procedimiento debe respetar el principio de contradicción y notificación formal en días hábiles.';
      
      const qLower = query.toLowerCase();
      if (qLower.includes('sla') || qLower.includes('días') || qLower.includes('plazo') || qLower.includes('tiempo')) {
        botResponse = 'Los plazos procesales (Art. 51) se computan exclusivamente en DÍAS HÁBILES (excluyendo sábados, domingos y festivos nacionales). El llamado de atención otorga 3 días hábiles para descargos y el plan de mejoramiento hasta 10 días hábiles.';
      } else if (qLower.includes('falta') || qLower.includes('grave') || qLower.includes('leve') || qLower.includes('gravísima')) {
        botResponse = 'Las faltas se clasifican en Leves (1er y 2do llamado formativo), Graves (equipo ejecutor y plan de mejoramiento) y Gravísimas (escalamiento acelerado inmediato a Comité de Evaluación y Seguimiento).';
      } else if (qLower.includes('comité') || qLower.includes('citación')) {
        botResponse = 'La citación a Comité de Evaluación debe realizarse con antelación mínima de 2 días hábiles, notificando formalmente los cargos y las pruebas en custodia digital.';
      } else if (qLower.includes('cancelación') || qLower.includes('matrícula') || qLower.includes('sanción')) {
        botResponse = 'La cancelación de matrícula es la máxima medida sancionatoria y sólo puede ser adoptada por resolución motivada suscrita por el Subdirector de Centro tras dictamen del Comité de Evaluación.';
      }

      setChatLog(prev => [...prev, { sender: 'bot' as const, text: botResponse }]);
    }, 600);
  };

  const handlePqrsdSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check: If bot filled this invisible field, silent rejection
    if (honeypot.trim() !== '') {
      console.warn('Bot submission blocked via honeypot');
      return;
    }

    if (!name || !email || !message) {
      showToast('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const radNumber = `PQRSD-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      setIsSubmitting(false);
      setName('');
      setEmail('');
      setFicha('');
      setMessage('');
      showToast(`Solicitud radicada con éxito: Radicado No. ${radNumber}. Tiempo estimado de respuesta: 2 días hábiles.`);
      setIsOpen(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Canal de Orientación y Soporte Jurídico PQRSD"
        title="Canal de Orientación y Soporte Jurídico"
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-[#39a900] hover:bg-[#329600] text-white rounded-full shadow-[0_8px_25px_rgba(57,169,0,0.45)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center border-2 border-white/20"
      >
        <span className="material-symbols-outlined text-[24px]">
          {isOpen ? 'close' : 'support_agent'}
        </span>
      </button>

      {/* Floating Widget Panel */}
      {isOpen && (
        <div className="fixed bottom-22 right-6 z-40 w-[92vw] max-w-sm sm:max-w-md bg-[#161818] border border-gray-700/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-white animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-[#1a1c1c] border-b border-[#2d2f2f] flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#39a900] text-white flex items-center justify-center text-sm font-bold shadow-md">
                <span className="material-symbols-outlined text-[18px]">gavel</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">
                  Orientación Jurídica & PQRSD
                </h4>
                <p className="text-[10px] text-gray-400 font-mono">
                  SENA • Acuerdo 0009 de 2024
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('assistant')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  activeTab === 'assistant'
                    ? 'bg-[#39a900] text-white'
                    : 'text-gray-400 hover:text-white bg-[#252727]'
                }`}
              >
                Orientador
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pqrsd')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  activeTab === 'pqrsd'
                    ? 'bg-[#39a900] text-white'
                    : 'text-gray-400 hover:text-white bg-[#252727]'
                }`}
              >
                Radicar PQRSD
              </button>
            </div>
          </div>

          {/* Response SLA Commitment */}
          <div className="bg-[#39a900]/10 border-b border-[#39a900]/20 px-3 py-1.5 flex items-center justify-between text-[10px] font-mono text-gray-300">
            <span className="flex items-center gap-1 text-[#39a900]">
              <span className="w-2 h-2 rounded-full bg-[#39a900] animate-pulse"></span>
              <span>SLA Activo: Días Hábiles</span>
            </span>
            <span className="text-gray-400">Atención: &lt; 2 días hábiles</span>
          </div>

          {/* Tab 1: Virtual Assistant */}
          {activeTab === 'assistant' && (
            <div className="flex flex-col h-80">
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
                {chatLog.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-2.5 rounded-xl ${
                        msg.sender === 'user'
                          ? 'bg-[#39a900] text-white rounded-br-none'
                          : 'bg-[#252727] text-gray-200 rounded-bl-none border border-gray-700/60'
                      }`}
                    >
                      <p className="leading-relaxed text-[11px]">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleAssistantSend} className="p-2.5 border-t border-[#2d2f2f] bg-[#1a1c1c] flex gap-2">
                <input
                  type="text"
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  placeholder="Pregunta sobre plazos, faltas o comités..."
                  className="flex-1 bg-[#121414] border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:ring-1 focus:ring-[#39a900]"
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-xl bg-[#39a900] hover:bg-[#329600] text-white flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: PQRSD Form */}
          {activeTab === 'pqrsd' && (
            <form onSubmit={handlePqrsdSubmit} className="p-4 space-y-3 h-80 overflow-y-auto text-xs">
              {/* Invisible Honeypot Anti-Spam Field */}
              <input
                type="text"
                name="b_honeypot"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div>
                <label className="block text-[11px] font-mono text-gray-300 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-[#121414] border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:ring-1 focus:ring-[#39a900]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-mono text-gray-300 mb-1">Correo Institucional *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@sena.edu.co"
                    className="w-full bg-[#121414] border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:ring-1 focus:ring-[#39a900]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-gray-300 mb-1">Ficha de Formación</label>
                  <input
                    type="text"
                    value={ficha}
                    onChange={(e) => setFicha(e.target.value)}
                    placeholder="Ej. 2567890"
                    className="w-full bg-[#121414] border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:ring-1 focus:ring-[#39a900]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-300 mb-1">Tipo de Solicitud</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#121414] border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white focus:ring-1 focus:ring-[#39a900]"
                >
                  <option value="Consulta Debido Proceso">Consulta de Debido Proceso</option>
                  <option value="Aclaración de Citación">Aclaración de Citación a Descargos</option>
                  <option value="Solicitud Copia de Expediente">Solicitud de Copia del Expediente</option>
                  <option value="Petición / Queja">Petición, Queja o Reclamo (PQR)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-300 mb-1">Descripción del Caso *</label>
                <textarea
                  rows={2}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detalla tu requerimiento formal..."
                  className="w-full bg-[#121414] border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:ring-1 focus:ring-[#39a900]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-[#39a900] hover:bg-[#329600] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Radicando...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">outgoing_mail</span>
                    <span>Radicar PQRSD Oficial</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Verified NAP */}
          <div className="p-2.5 bg-[#121414] border-t border-[#2d2f2f] text-[10px] font-mono text-gray-400 flex items-center justify-between">
            <span>Sede Principal: Calle 57 #8-69, Bogotá</span>
            <a href="tel:+576013430111" className="text-[#39a900] hover:underline">
              (601) 343 0111
            </a>
          </div>
        </div>
      )}
    </>
  );
};
