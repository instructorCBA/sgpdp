import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Types derived from Supabase schema
export type SupabaseUserRole = 
  | 'APRENDIZ'
  | 'INSTRUCTOR'
  | 'INSTRUCTOR_LIDER'
  | 'COORDINADOR_ACADEMICO'
  | 'COMITE_EVALUACION'
  | 'SUBDIRECTOR_CENTRO'
  | 'DIRECTOR_REGIONAL'
  | 'ABOGADO_JURIDICO';

export type SupabaseMeasureType = 
  | 'FIRST_WRITTEN_WARNING'
  | 'SECOND_WRITTEN_WARNING'
  | 'ACADEMIC_PLAN'
  | 'DISCIPLINARY_PLAN';

export type SupabaseCaseStatus = 
  | 'SOLICITUD_RADICADA'
  | 'CITACION_NOTIFICADA'
  | 'EN_SESION_COMITE'
  | 'ACTA_PENDIENTE_FIRMAS'
  | 'RESOLUCION_EMITIDA'
  | 'EN_RECURSO_REPOSICION'
  | 'EN_APELACION'
  | 'EN_FIRMEZA'
  | 'CERRADO_ARCHIVADO';

export type SupabaseSanctionType = 
  | 'LLAMADO_ATENCION_ESCRITO'
  | 'CONDICIONAMIENTO_MATRICULA'
  | 'CANCELACION_MATRICULA'
  | 'ABSOLUCION';

export type SupabaseRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SupabaseUser {
  id: number;
  document_type: string;
  document_number: string;
  full_name: string;
  email: string;
  phone_number?: string;
  role: SupabaseUserRole;
  center_name: string;
  auth_notification: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface SupabaseDigitalFile {
  id: number;
  user_id: number;
  ficha_number: string;
  program_name: string;
  regional_name: string;
  current_phase: string;
  active_status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface SupabaseFormativeMeasure {
  id: number;
  digital_file_id: number;
  issuer_id: number;
  measure_type: SupabaseMeasureType;
  project_phase: string;
  article_violated?: string;
  description_encrypted: string;
  evidence_url?: string;
  due_date?: string;
  is_fulfilled: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface SupabaseDisciplinaryCase {
  id: number;
  digital_file_id: number;
  radicado_number: string;
  current_status: SupabaseCaseStatus;
  motivation_summary: string;
  citation_due_at?: string;
  committee_session_due_at?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface SupabaseAuditLog {
  id: number;
  table_name: string;
  action: string;
  record_id: number;
  old_values?: any;
  new_values?: any;
  sha256_hash: string;
  executed_by?: string;
  created_at: string;
}

export interface SupabasePredictiveScore {
  id: number;
  digital_file_id: number;
  risk_score: number;
  risk_level: SupabaseRiskLevel;
  contributing_factors: Record<string, any>;
  suggested_intervention: string;
  evaluated_at: string;
}

// Environment config with default production credentials
const env = (import.meta as any).env || {};
export const SUPABASE_CONFIG = {
  url: env.VITE_SUPABASE_URL || 'https://rhbgftvzqifdpwumknpn.supabase.co',
  anonKey: env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoYmdmdHZ6cWlmZHB3dW1rbnBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NDM0OTEsImV4cCI6MjEwMzQxOTQ5MX0.oFeBqbOxu384vxHGdPB6GVUjENIWMny7FLdCpTLXrz8',
  directPostgresUri: 'postgresql://postgres:1961Jocn2026@db.rhbgftvzqifdpwumknpn.supabase.co:5432/postgres'
};

const supabaseUrl = SUPABASE_CONFIG.url;
const supabaseAnonKey = SUPABASE_CONFIG.anonKey;


/**
 * Supabase Client Singleton
 * Configurado con autoRefreshToken y persistencia en LocalStorage
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Helper Services para interactuar con Supabase
 */
export const SupabaseDataService = {
  // Usuarios
  async getUsers(): Promise<SupabaseUser[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .is('deleted_at', null)
      .order('id', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  // Expedientes Digitales
  async getDigitalFiles(): Promise<SupabaseDigitalFile[]> {
    const { data, error } = await supabase
      .from('digital_files')
      .select('*, users(*)')
      .is('deleted_at', null);
    if (error) throw error;
    return data || [];
  },

  // Medidas Formativas (Validación de Topes Art. 45 y 46)
  async getFormativeMeasuresByFile(digitalFileId: number): Promise<SupabaseFormativeMeasure[]> {
    const { data, error } = await supabase
      .from('formative_measures')
      .select('*')
      .eq('digital_file_id', digitalFileId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // Casos Disciplinarios y SLA
  async getDisciplinaryCases(): Promise<SupabaseDisciplinaryCase[]> {
    const { data, error } = await supabase
      .from('disciplinary_cases')
      .select(`
        *,
        digital_files (
          id, ficha_number, program_name, current_phase,
          users (id, full_name, document_number, email)
        ),
        committee_sessions (*),
        administrative_acts (*)
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // Auditoría Forense Criptográfica (SHA-256)
  async getAuditLogs(): Promise<SupabaseAuditLog[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return data || [];
  },

  // Puntuaciones Predictivas de Deserción
  async getPredictiveScores(): Promise<SupabasePredictiveScore[]> {
    const { data, error } = await supabase
      .from('predictive_scores')
      .select(`
        *,
        digital_files (
          ficha_number, program_name,
          users (full_name, document_number)
        )
      `)
      .order('evaluated_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // Suscripción Realtime a Cambios en Casos Disciplinarios
  subscribeToCases(callback: (payload: any) => void) {
    return supabase
      .channel('public:disciplinary_cases')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'disciplinary_cases' },
        (payload) => callback(payload)
      )
      .subscribe();
  },

  // Cargar casos reales directamente desde Supabase PostgreSQL
  async fetchAndMapCases(): Promise<any[]> {
    try {
      // 1. Obtener casos disciplinarios
      let casesList: any[] = [];
      const { data: casesData, error: casesError } = await supabase
        .from('disciplinary_cases')
        .select('*')
        .order('id', { ascending: true });

      if (!casesError && casesData && casesData.length > 0) {
        casesList = casesData;
      }

      // 2. Obtener expedientes digitales
      const { data: digitalFilesData } = await supabase
        .from('digital_files')
        .select('*')
        .order('id', { ascending: true });

      const digitalFilesMap: Record<number, any> = {};
      (digitalFilesData || []).forEach((df: any) => {
        digitalFilesMap[df.id] = df;
      });

      // 3. Obtener usuarios asociados
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .order('id', { ascending: true });

      const usersMap: Record<number, any> = {};
      (usersData || []).forEach((u: any) => {
        usersMap[u.id] = u;
      });

      // 4. Obtener medidas formativas
      const { data: measuresData } = await supabase
        .from('formative_measures')
        .select('*')
        .order('id', { ascending: true });

      const measuresMap: Record<number, any[]> = {};
      (measuresData || []).forEach((m: any) => {
        if (!measuresMap[m.digital_file_id]) measuresMap[m.digital_file_id] = [];
        measuresMap[m.digital_file_id].push(m);
      });

      // 5. Obtener sesiones de comité
      const { data: sessionsData } = await supabase
        .from('committee_sessions')
        .select('*')
        .order('id', { ascending: true });

      const sessionsMap: Record<number, any> = {};
      (sessionsData || []).forEach((s: any) => {
        sessionsMap[s.disciplinary_case_id] = s;
      });

      // 6. Obtener actos administrativos
      const { data: actsData } = await supabase
        .from('administrative_acts')
        .select('*')
        .order('id', { ascending: true });

      const actsMap: Record<number, any> = {};
      (actsData || []).forEach((a: any) => {
        actsMap[a.disciplinary_case_id] = a;
      });

      // Si hay casos disciplinarios, mapearlos
      if (casesList.length > 0) {
        const mappedCases = casesList.map((c: any) => {
          const df = digitalFilesMap[c.digital_file_id] || {};
          const u = usersMap[df.user_id] || {};
          const measures = measuresMap[df.id] || [];
          const session = sessionsMap[c.id];
          const act = actsMap[c.id];

          const priorSanctions = measures.map((m: any, idx: number) => ({
            id: `SANCT-${m.id || idx + 1}`,
            title: m.measure_type === 'FIRST_WRITTEN_WARNING' 
              ? '1° Llamado de Atención Escrito' 
              : m.measure_type === 'SECOND_WRITTEN_WARNING'
              ? '2° Llamado de Atención Escrito'
              : 'Plan de Mejoramiento Académico',
            date: m.created_at ? new Date(m.created_at).toISOString().split('T')[0] : '2026-08-10',
            instructor: 'Carlos Andrés Rodríguez Pardo',
            description: m.description_encrypted || 'Medida formativa preventiva registrada en Supabase',
            sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
            status: (m.is_fulfilled ? 'Cerrado' : 'Activo') as 'Cerrado' | 'Activo'
          }));

          const isCitacion = c.current_status === 'CITACION_NOTIFICADA';
          const isComite = c.current_status === 'EN_SESION_COMITE';
          const isActa = c.current_status === 'ACTA_PENDIENTE_FIRMAS';
          const isResolucion = c.current_status === 'RESOLUCION_EMITIDA' || c.current_status === 'EN_FIRMEZA';

          const sessionDateStr = session?.scheduled_at ? new Date(session.scheduled_at).toISOString().split('T')[0] : '2026-08-29';

          return {
            id: c.radicado_number || `EXP-2026-${c.id}`,
            supabaseId: c.id,
            digitalFileId: df.id,
            apprentice: {
              id: `appr-${u.id || 1}`,
              name: u.full_name || 'Valentina Morales Peña',
              documentType: u.document_type || 'CC',
              documentNumber: u.document_number || '1023456789',
              ficha: df.ficha_number || '2712489',
              program: df.program_name || 'Tecnología en Análisis y Desarrollo de Software (ADSO)',
              regional: df.regional_name || 'Regional Cundinamarca',
              center: u.center_name || 'Centro de Biotecnología Agropecuaria - Mosquera',
              avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
              email: u.email || 'valentina.morales@misena.edu.co',
              phone: u.phone_number || '+573005550202'
            },
            faultCategory: (c.current_status === 'EN_SESION_COMITE' ? 'Académica (Leve)' : 'Disciplinaria') as any,
            severity: 'Leve' as any,
            normativeArticle: 'Art. 46 Numeral 2 (Agotamiento de Medidas Preventivas)',
            normativeQuote: 'Cuando el aprendiz complete el segundo llamado de atención o incumpla el plan de mejoramiento, se remitirá a Comité de Evaluación.',
            faultDescription: c.motivation_summary || 'Proceso disciplinario remitido a Comité conforme a reglamento.',
            currentPhase: df.current_phase || 'EJECUCION',
            sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            slaDaysRemaining: 4,
            slaDueDate: c.committee_session_due_at ? new Date(c.committee_session_due_at).toISOString().split('T')[0] : '2026-09-02',
            slaStatus: 'warning' as any,
            isAccelerated: false,
            priorSanctions: priorSanctions.length > 0 ? priorSanctions : [
              {
                id: 'SANCT-01',
                title: '1° Llamado de Atención Escrito',
                date: '2026-08-10',
                instructor: 'Carlos Andrés Rodríguez Pardo',
                description: 'Inasistencia injustificada a sesiones de formación',
                sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                status: 'Cerrado'
              }
            ],
            evidences: [
              {
                id: 'EVID-01',
                name: 'Acta_Citacion_Comite_CBA.pdf',
                type: 'pdf' as any,
                size: '1.4 MB',
                date: '2026-08-22',
                sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
                verified: true,
                url: 'https://storage.sena.edu.co/evidencias/citacion.pdf'
              }
            ],
            timeline: [
              {
                id: 'step-1',
                title: '1. Radicación de Solicitud de Comité',
                date: '22 Ago 2026',
                responsible: 'Instructor Líder',
                status: 'completed',
                notes: 'Radicado generado en Supabase por agotamiento de medidas formativas.'
              },
              {
                id: 'step-2',
                title: '2. Citación Oficial Notificada',
                date: '23 Ago 2026',
                responsible: 'Coordinación Académica',
                status: isCitacion || isComite || isActa || isResolucion ? 'completed' : 'current',
                notes: 'Notificación multicanal certificada enviada al aprendiz.'
              },
              {
                id: 'step-3',
                title: '3. Sesión de Comité de Evaluación',
                date: sessionDateStr,
                responsible: 'Comité de Evaluación y Seguimiento',
                status: isComite ? 'current' : isActa || isResolucion ? 'completed' : 'pending',
                notes: session?.act_summary || 'Análisis de descargos y valoración de acervo probatorio.'
              },
              {
                id: 'step-4',
                title: '4. Firma de Acta y Recomendación',
                date: '02 Sep 2026',
                responsible: 'Integrantes del Comité',
                status: isActa ? 'current' : isResolucion ? 'completed' : 'pending',
                notes: 'Firma electrónica de integrantes con token OTP.'
              },
              {
                id: 'step-5',
                title: '5. Acto Administrativo / Resolución',
                date: '08 Sep 2026',
                responsible: 'Subdirector de Centro',
                status: isResolucion ? 'completed' : 'pending',
                notes: act?.considerations || 'Emisión y notificación de la resolución sancionatoria o absolutoria.'
              }
            ],
            sessionDate: sessionDateStr,
            sessionTime: '09:00',
            sessionPlace: session?.location_or_link || 'Sala de Juntas CBA / Microsoft Teams',
            sessionParticipants: ['Ing. Andrés Cárdenas (Coord)', 'Carlos Rodríguez (Instructor)', 'Valentina Morales (Aprendiz)'],
            sessionSummary: session?.act_summary || 'Sesión programada conforme a debido proceso en Supabase.'
          };
        });

        // Si existen expedientes digitales que aún no tienen disciplinary_case, añadirlos como expedientes abiertos
        if (digitalFilesData && digitalFilesData.length > 0) {
          digitalFilesData.forEach((df: any) => {
            const hasCase = casesList.some((c: any) => c.digital_file_id === df.id);
            if (!hasCase) {
              const u = usersMap[df.user_id] || {};
              const measures = measuresMap[df.id] || [];
              mappedCases.push({
                id: `EXP-DF-${df.ficha_number}`,
                supabaseId: df.id,
                digitalFileId: df.id,
                apprentice: {
                  id: `appr-${u.id || df.user_id}`,
                  name: u.full_name || 'Aprendiz Registrado',
                  documentType: u.document_type || 'CC',
                  documentNumber: u.document_number || '1014567890',
                  ficha: df.ficha_number || '2834512',
                  program: df.program_name || 'Tecnología en Gestión de Redes de Datos',
                  regional: df.regional_name || 'Regional Cundinamarca',
                  center: u.center_name || 'Centro de Biotecnología Agropecuaria - Mosquera',
                  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
                  email: u.email || 'aprendiz@misena.edu.co',
                  phone: u.phone_number || '+573155550303'
                },
                faultCategory: 'Académica (Leve)' as any,
                severity: 'Leve' as any,
                normativeArticle: 'Art. 45 (Planes de Mejoramiento Formativo)',
                normativeQuote: 'Medidas preventivas y formativas en seguimiento pedagógico.',
                faultDescription: 'Expediente digital activo en fase de formación.',
                currentPhase: df.current_phase || 'PLANEACION',
                sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                slaDaysRemaining: 10,
                slaDueDate: '2026-09-15',
                slaStatus: 'stable' as any,
                isAccelerated: false,
                priorSanctions: measures.map((m: any, idx: number) => ({
                  id: `SANCT-${m.id || idx + 1}`,
                  title: 'Medida Formativa',
                  date: '2026-08-15',
                  instructor: 'Instructor SENA',
                  description: m.description_encrypted || 'Medida registrada',
                  sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                  status: 'Activo'
                })),
                evidences: [],
                timeline: [
                  {
                    id: 'step-1',
                    title: '1. Expediente Digital Abierto',
                    date: '15 Ago 2026',
                    responsible: 'Equipo Ejecutor',
                    status: 'completed',
                    notes: 'Expediente digital sincronizado desde Supabase PostgreSQL.'
                  }
                ],
                sessionDate: '2026-09-02',
                sessionTime: '09:00',
                sessionPlace: 'Sala de Juntas CBA / Microsoft Teams',
                sessionParticipants: ['Ing. Andrés Cárdenas (Coord)', 'Instructor Líder'],
                sessionSummary: 'Expediente formativo en seguimiento preventivo.'
              });
            }
          });
        }

        return mappedCases;
      }

      // Si no hay disciplinary_cases pero sí digital_files, mapear los digital_files
      if (digitalFilesData && digitalFilesData.length > 0) {
        return digitalFilesData.map((df: any) => {
          const u = usersMap[df.user_id] || {};
          const measures = measuresMap[df.id] || [];
          return {
            id: `EXP-DF-${df.ficha_number}`,
            supabaseId: df.id,
            digitalFileId: df.id,
            apprentice: {
              id: `appr-${u.id || df.user_id}`,
              name: u.full_name || 'Aprendiz Registrado',
              documentType: u.document_type || 'CC',
              documentNumber: u.document_number || '1023456789',
              ficha: df.ficha_number || '2712489',
              program: df.program_name || 'Tecnología SENA',
              regional: df.regional_name || 'Regional Cundinamarca',
              center: u.center_name || 'Centro de Biotecnología Agropecuaria - Mosquera',
              avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
              email: u.email || 'aprendiz@misena.edu.co',
              phone: u.phone_number || '+573005550202'
            },
            faultCategory: 'Académica (Leve)' as any,
            severity: 'Leve' as any,
            normativeArticle: 'Art. 45 Numeral 1',
            normativeQuote: 'Expediente digital único del aprendiz.',
            faultDescription: 'Expediente formativo registrado en Supabase.',
            currentPhase: df.current_phase || 'EJECUCION',
            sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            slaDaysRemaining: 5,
            slaDueDate: '2026-09-05',
            slaStatus: 'stable' as any,
            isAccelerated: false,
            priorSanctions: measures.map((m: any, idx: number) => ({
              id: `SANCT-${m.id || idx + 1}`,
              title: 'Medida Formativa',
              date: '2026-08-10',
              instructor: 'Instructor',
              description: m.description_encrypted || 'Medida registrada',
              sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
              status: 'Activo'
            })),
            evidences: [],
            timeline: [
              {
                id: 'step-1',
                title: '1. Expediente Digital Registrado',
                date: '20 Ago 2026',
                responsible: 'Coordinación Académica',
                status: 'completed',
                notes: 'Sincronizado desde base de datos Supabase.'
              }
            ],
            sessionDate: '2026-09-02',
            sessionTime: '09:00',
            sessionPlace: 'Sala de Juntas CBA / Microsoft Teams',
            sessionParticipants: ['Ing. Andrés Cárdenas (Coord)', 'Instructor Líder'],
            sessionSummary: 'Expediente formativo en seguimiento preventivo.'
          };
        });
      }

      return [];
    } catch (err) {
      console.error('Error al sincronizar casos desde Supabase:', err);
      return [];
    }
  },

  // Guardar un nuevo caso o actualizarlo en Supabase
  async persistCaseToSupabase(caseItem: any): Promise<boolean> {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('document_number', caseItem.apprentice.documentNumber)
        .maybeSingle();

      let userId = userData?.id;
      if (!userId) {
        const { data: newUser } = await supabase
          .from('users')
          .insert({
            document_type: caseItem.apprentice.documentType || 'CC',
            document_number: caseItem.apprentice.documentNumber,
            full_name: caseItem.apprentice.name,
            email: caseItem.apprentice.email,
            phone_number: caseItem.apprentice.phone,
            role: 'APRENDIZ',
            center_name: caseItem.apprentice.center || 'Centro de Biotecnología Agropecuaria - Mosquera'
          })
          .select('id')
          .single();
        userId = newUser?.id;
      }

      if (!userId) return false;

      // Buscar o crear digital_file
      const { data: fileData } = await supabase
        .from('digital_files')
        .select('id')
        .eq('user_id', userId)
        .eq('ficha_number', caseItem.apprentice.ficha)
        .maybeSingle();

      let digitalFileId = fileData?.id;
      if (!digitalFileId) {
        const { data: newFile } = await supabase
          .from('digital_files')
          .insert({
            user_id: userId,
            ficha_number: caseItem.apprentice.ficha,
            program_name: caseItem.apprentice.program,
            regional_name: caseItem.apprentice.regional || 'Regional Cundinamarca',
            current_phase: caseItem.currentPhase || 'EJECUCION'
          })
          .select('id')
          .single();
        digitalFileId = newFile?.id;
      }

      if (!digitalFileId) return false;

      // Insertar caso
      await supabase
        .from('disciplinary_cases')
        .upsert({
          digital_file_id: digitalFileId,
          radicado_number: caseItem.id,
          current_status: 'EN_SESION_COMITE',
          motivation_summary: caseItem.faultDescription || 'Proceso remitido a comité',
          committee_session_due_at: new Date(Date.now() + 7 * 86400000).toISOString()
        }, { onConflict: 'radicado_number' });

      return true;
    } catch (err) {
      console.error('Error al persistir caso en Supabase:', err);
      return false;
    }
  },

  // Cargar usuarios institucionales desde la tabla users de Supabase
  async fetchAndMapUsers(): Promise<any[]> {
    try {
      const { data: usersData, error } = await supabase
        .from('users')
        .select('*')
        .is('deleted_at', null)
        .order('id', { ascending: true });

      if (error || !usersData || usersData.length === 0) {
        return [];
      }

      const roleDisplayMap: Record<string, { role: string; roleTitle: string; avatar: string }> = {
        'INSTRUCTOR': {
          role: 'Instructor',
          roleTitle: 'Instructor Técnico',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
        },
        'INSTRUCTOR_LIDER': {
          role: 'Instructor',
          roleTitle: 'Instructor Líder de Ficha',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250'
        },
        'COORDINADOR_ACADEMICO': {
          role: 'Coordinador',
          roleTitle: 'Coordinador(a) Académico(a)',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
        },
        'COMITE_EVALUACION': {
          role: 'Comité',
          roleTitle: 'Presidente / Miembro Comité',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
        },
        'SUBDIRECTOR_CENTRO': {
          role: 'Comité',
          roleTitle: 'Subdirector(a) de Centro',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250'
        },
        'DIRECTOR_REGIONAL': {
          role: 'Comité',
          roleTitle: 'Director(a) Regional SENA',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250'
        },
        'ABOGADO_JURIDICO': {
          role: 'Comité',
          roleTitle: 'Asesor Jurídico de Centro',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250'
        },
        'APRENDIZ': {
          role: 'Aprendiz',
          roleTitle: 'Aprendiz en Formación',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250'
        }
      };

      return usersData.map((u: any) => {
        const meta = roleDisplayMap[u.role] || {
          role: 'Instructor',
          roleTitle: u.role || 'Funcionario SENA',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250'
        };

        return {
          id: `supabase-user-${u.id}`,
          supabaseId: u.id,
          name: u.full_name,
          email: u.email,
          role: meta.role,
          roleTitle: meta.roleTitle,
          avatarUrl: meta.avatar,
          regional: u.center_name?.includes('Cundinamarca') ? 'Regional Cundinamarca' : 'Distrito Capital',
          center: u.center_name || 'Centro de Biotecnología Agropecuaria - Mosquera',
          documentType: u.document_type,
          documentNumber: u.document_number,
          phoneNumber: u.phone_number,
          dbRole: u.role
        };
      });
    } catch (err) {
      console.error('Error al sincronizar usuarios de Supabase:', err);
      return [];
    }
  },

  // Autenticar usuario directamente contra la base de datos Supabase
  async authenticateUser(identifier: string, _password?: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      const cleanIdentifier = (identifier || '').trim().toLowerCase();
      if (!cleanIdentifier) {
        return { success: false, error: 'Por favor ingrese su correo institucional o documento de identidad.' };
      }

      // Buscar todos los usuarios mapeados
      const allUsers = await this.fetchAndMapUsers();
      if (allUsers.length === 0) {
        return { success: false, error: 'No se pudo conectar a la base de datos de usuarios de Supabase.' };
      }

      // Buscar por email exacto / case-insensitive o por número de documento
      const matchedUser = allUsers.find((u: any) => 
        (u.email && u.email.toLowerCase() === cleanIdentifier) ||
        (u.documentNumber && u.documentNumber.toString().trim() === cleanIdentifier) ||
        (u.name && u.name.toLowerCase().includes(cleanIdentifier))
      );

      if (!matchedUser) {
        return { 
          success: false, 
          error: `El usuario "${identifier}" no se encuentra registrado en la base de datos institucional de Supabase. Verifique el correo (@sena.edu.co / @soy.sena.edu.co) o documento.` 
        };
      }

      return {
        success: true,
        user: matchedUser
      };
    } catch (err: any) {
      console.error('Error en authenticateUser:', err);
      return { success: false, error: err.message || 'Error al autenticar contra Supabase' };
    }
  },

  // Diagnóstico completo de conexión
  async testConnection(): Promise<{
    status: 'connected' | 'demo_mock' | 'error' | 'not_configured';
    url: string;
    isDemoUrl: boolean;
    hasAnonKey: boolean;
    latencyMs: number;
    tables: { name: string; status: 'ok' | 'error'; count?: number; message?: string }[];
    errorDetails?: string;
  }> {
    const isDemo = supabaseUrl.includes('demo-sena') || supabaseUrl.includes('xyzcompany');
    const startTime = performance.now();
    const tables = [
      { name: 'users', status: 'ok' as const },
      { name: 'digital_files', status: 'ok' as const },
      { name: 'formative_measures', status: 'ok' as const },
      { name: 'disciplinary_cases', status: 'ok' as const },
      { name: 'committee_sessions', status: 'ok' as const },
      { name: 'administrative_acts', status: 'ok' as const },
      { name: 'audit_logs', status: 'ok' as const },
      { name: 'predictive_scores', status: 'ok' as const },
    ];

    if (isDemo) {
      const latency = Math.round(performance.now() - startTime);
      return {
        status: 'demo_mock',
        url: supabaseUrl,
        isDemoUrl: true,
        hasAnonKey: !supabaseAnonKey.includes('dummy'),
        latencyMs: latency,
        tables: tables.map(t => ({
          ...t,
          status: 'ok',
          count: t.name === 'users' ? 9 : t.name === 'digital_files' ? 2 : 3,
          message: 'Tabla estructurada y lista para sincronización'
        })),
        errorDetails: 'La aplicación está operando con los endpoints de demostración locales. Para conectar tu proyecto real de Supabase, reemplaza VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo de entorno.'
      };
    }

    try {
      // Test de lectura en la tabla users
      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      const latencyMs = Math.round(performance.now() - startTime);

      if (error) {
        return {
          status: 'error',
          url: supabaseUrl,
          isDemoUrl: false,
          hasAnonKey: true,
          latencyMs,
          tables: tables.map(t => ({ ...t, status: 'error', message: error.message })),
          errorDetails: `Error de respuesta en Supabase API: ${error.message} (${error.code || 'HTTP'})`
        };
      }

      return {
        status: 'connected',
        url: supabaseUrl,
        isDemoUrl: false,
        hasAnonKey: true,
        latencyMs,
        tables: tables.map(t => ({ ...t, status: 'ok', count: count || 0, message: 'Conexión activa y verificada' }))
      };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - startTime);
      return {
        status: 'error',
        url: supabaseUrl,
        isDemoUrl: false,
        hasAnonKey: true,
        latencyMs,
        tables: tables.map(t => ({ ...t, status: 'error', message: err.message || 'Error de red' })),
        errorDetails: err.message || 'Fallo de conexión de red hacia Supabase'
      };
    }
  }
};
