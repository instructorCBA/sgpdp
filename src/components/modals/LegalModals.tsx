import React, { useState } from 'react';
import { useCaseContext } from '../../context/CaseContext';

export const LegalModals: React.FC = () => {
  const { activeLegalModal, closeLegalModal } = useCaseContext();
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  if (!activeLegalModal) return null;

  const faqs = [
    {
      q: '¿Qué es el Sistema de Gestión de Rutas del Aprendiz y Debido Proceso (SGPDP)?',
      a: 'Es la plataforma institucional del SENA diseñada para aplicar de manera digital, trazable y transparente el régimen disciplinario y formativo establecido en el Acuerdo 0009 de 2024, garantizando el derecho a la defensa y el seguimiento de términos en días hábiles.'
    },
    {
      q: '¿Cuáles son las etapas del debido proceso según el Acuerdo 0009 de 2024?',
      a: 'Comprende el Triaje de Falta (Leve, Grave, Gravísima), 1er Llamado de atención con acta, 2do Llamado con compromiso formativo, Citación a Descargos ante Equipo Ejecutor, Plan de Mejoramiento, y en caso de incumplimiento o falta gravísima, el Comité de Evaluación y Seguimiento.'
    },
    {
      q: '¿Cómo funciona la semaforización de términos procesales SLA (Art. 51)?',
      a: 'El motor SLA calcula automáticamente los días hábiles restantes: Verde (Estable, >3 días), Amarillo (Alerta, 1-2 días), Rojo (Crítico, día de vencimiento) y Negro/Púrpura (Vencido o Archivado).'
    },
    {
      q: '¿Cómo se garantiza la inmutabilidad de los expedientes y evidencias (RNF-02)?',
      a: 'Cada documento, acta o citación adjunta es sellada mediante una función hash criptográfica SHA-256 inalterable y registrada en la cadena de custodia digital del expediente.'
    },
    {
      q: '¿Qué es el mecanismo Human-in-the-Loop y firma OTP?',
      a: 'Ninguna decisión sancionatoria o de condicionamiento de matrícula puede emitirse automáticamente por algoritmos. Requiere obligatoriamente la firma digital OTP de 6 dígitos del Subdirector de Centro o Coordinador.'
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
    f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="fixed inset-0 bg-transparent" 
        onClick={closeLegalModal} 
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-3xl max-h-[85vh] bg-[#161818] border border-gray-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="p-6 border-b border-[#2d2f2f] flex justify-between items-center bg-[#1a1c1c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#39a900]/20 text-[#39a900] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined">
                {activeLegalModal === 'privacy' && 'shield'}
                {activeLegalModal === 'terms' && 'gavel'}
                {activeLegalModal === 'faq' && 'help'}
                {activeLegalModal === 'about' && 'corporate_fare'}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {activeLegalModal === 'privacy' && 'Política de Privacidad y Tratamiento de Datos'}
                {activeLegalModal === 'terms' && 'Términos y Condiciones del Servicio SGPDP'}
                {activeLegalModal === 'faq' && 'Preguntas Frecuentes (FAQ) • Acuerdo 0009 de 2024'}
                {activeLegalModal === 'about' && 'Acerca del Sistema SGPDP • SENA'}
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Servicio Nacional de Aprendizaje SENA • Dirección de Formación Profesional
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeLegalModal}
            className="w-8 h-8 rounded-full bg-[#252727] hover:bg-[#323535] text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-300 leading-relaxed font-sans">
          {/* Privacy Policy */}
          {activeLegalModal === 'privacy' && (
            <div className="space-y-4">
              <section>
                <h3 className="text-sm font-bold text-white mb-2 text-[#39a900]">
                  1. Marco Normativo y Responsable del Tratamiento
                </h3>
                <p>
                  El Servicio Nacional de Aprendizaje (SENA), establecimiento público del orden nacional con personería jurídica, adscrito al Ministerio del Trabajo de Colombia, con domicilio principal en la Calle 57 No. 8-69 de Bogotá D.C., es el responsable del tratamiento de los datos personales recolectados a través de la plataforma SGPDP, en cumplimiento de la <strong>Ley Estatutaria 1581 de 2012</strong>, el <strong>Decreto 1377 de 2013</strong> y el <strong>Reglamento del Aprendiz (Acuerdo 0009 de 2024)</strong>.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white mb-2 text-[#39a900]">
                  2. Finalidades del Tratamiento de Datos
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Gestión y sustanciación de procesos disciplinarios y académicos del aprendiz.</li>
                  <li>Notificación formal de llamados de atención, citaciones y actas de comité.</li>
                  <li>Auditoría e inmutabilidad de la cadena de custodia mediante firmas electrónicas y hashes SHA-256.</li>
                  <li>Generación de alertas tempranas de deserción e intervención preventiva.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white mb-2 text-[#39a900]">
                  3. Derechos del Titular (Derechos ARCO / Habeas Data)
                </h3>
                <p>
                  Los aprendices, instructores y funcionarios podrán ejercer en cualquier momento sus derechos de Acceso, Rectificación, Cancelación y Oposición remitiendo su solicitud a través de la ventanilla única PQRSD o al correo institucional: <code className="text-[#39a900] font-mono">contacto@sena.edu.co</code> / <code className="text-[#39a900] font-mono">habeasdata@sena.edu.co</code>.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white mb-2 text-[#39a900]">
                  4. Seguridad y Retención Documental
                </h3>
                <p>
                  Las evidencias digitales e historiales de procesos disciplinarios se conservan de acuerdo con las Tablas de Retención Documental (TRD) institucionales y están blindadas con cifrado AES-256 en reposo y conexiones TLS 1.3 forzadas.
                </p>
              </section>
            </div>
          )}

          {/* Terms & Conditions */}
          {activeLegalModal === 'terms' && (
            <div className="space-y-4">
              <section>
                <h3 className="text-sm font-bold text-white mb-2 text-[#39a900]">
                  1. Aceptación de Términos Institucionales
                </h3>
                <p>
                  El acceso y uso de la plataforma SGPDP implica la aceptación plena de las disposiciones contenidas en el <strong>Acuerdo 0009 de 2024</strong> por el cual se adopta el Reglamento del Aprendiz SENA.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white mb-2 text-[#39a900]">
                  2. Validez de las Notificaciones Electrónicas
                </h3>
                <p>
                  Conforme a la Ley 527 de 1999 y el Código de Procedimiento Administrativo y de lo Contencioso Administrativo (CPACA), las comunicaciones, citaciones y actas enviadas al correo institucional (@soy.sena.edu.co o personal registrado) gozan de plena validez jurídica y surten efectos procesales directos.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white mb-2 text-[#39a900]">
                  3. Obligaciones del Usuario
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Custodiar sus credenciales de acceso institucional de manera intransferible.</li>
                  <li>Consultar oportunamente las citaciones y cumplir los compromisos formativos suscritos.</li>
                  <li>No alterar ni intentar vulnerar la integridad criptográfica de las actas y expedientes.</li>
                </ul>
              </section>
            </div>
          )}

          {/* FAQs */}
          {activeLegalModal === 'faq' && (
            <div className="space-y-4">
              {/* Search bar */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Buscar en preguntas frecuentes..."
                  className="w-full bg-[#121414] border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:ring-1 focus:ring-[#39a900]"
                />
              </div>

              <div className="space-y-2">
                {filteredFaqs.map((faq, idx) => (
                  <div key={idx} className="border border-gray-700/80 rounded-xl overflow-hidden bg-[#1a1c1c]">
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full p-3.5 text-left font-semibold text-white flex justify-between items-center hover:bg-[#252727] transition-colors"
                    >
                      <span className="pr-3">{faq.q}</span>
                      <span className="material-symbols-outlined text-gray-400 text-[18px] shrink-0">
                        {expandedFaq === idx ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                    {expandedFaq === idx && (
                      <div className="p-3.5 pt-0 text-gray-300 border-t border-gray-800 text-[11px] leading-relaxed bg-[#121414]/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About Us */}
          {activeLegalModal === 'about' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[#121414] rounded-xl border border-gray-800">
                <div className="w-12 h-12 rounded-2xl bg-[#39a900] text-white flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
                  SENA
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Sistema SGPDP - Versión 2.4.0</h3>
                  <p className="text-gray-400 text-[11px]">
                    Diseñado para la Dirección de Formación Profesional Integral • Colombia
                  </p>
                </div>
              </div>

              <p>
                El <strong>SGPDP</strong> es una solución de alto impacto tecnológico que moderniza y estandariza los procedimientos disciplinarios en los 117 centros de formación del SENA a nivel nacional, garantizando que cada aprendiz cuente con plenas garantías procesales, tiempos de respuesta controlados y trazabilidad digital inmutable.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-[#1a1c1c] border border-gray-800 rounded-xl">
                  <p className="font-bold text-[#39a900] text-sm">117 Centros</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">Cobertura nacional 33 Regionales</p>
                </div>
                <div className="p-3 bg-[#1a1c1c] border border-gray-800 rounded-xl">
                  <p className="font-bold text-[#50e5f9] text-sm">100% SLA Real</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">Cálculo estricto en días hábiles</p>
                </div>
                <div className="p-3 bg-[#1a1c1c] border border-gray-800 rounded-xl">
                  <p className="font-bold text-[#fdc300] text-sm">SHA-256 Vault</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">Cadena de custodia inmutable</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#2d2f2f] bg-[#1a1c1c] flex justify-between items-center text-xs">
          <span className="font-mono text-gray-500 text-[10px]">
            Acuerdo 0009 de 2024 • SENA
          </span>
          <button
            type="button"
            onClick={closeLegalModal}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#39a900] hover:bg-[#329600] transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
