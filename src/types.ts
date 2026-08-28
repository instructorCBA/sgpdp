export type FaultSeverity = 'Leve' | 'Grave' | 'Gravísima';

export type FaultCategory = 
  | 'Académica (Leve)' 
  | 'Disciplinaria (Grave)' 
  | 'Falta Gravísima' 
  | 'Deserción'
  | 'Disciplinaria';

export type SLAStatus = 'stable' | 'warning' | 'critical' | 'expired' | 'closed';

export type LegalModalType = 'privacy' | 'terms' | 'faq' | 'about' | 'otp-sign' | 'support' | null;

export interface UserProfile {
  id: string;
  supabaseId?: number;
  name: string;
  email: string;
  role: 'Instructor' | 'Coordinador' | 'Comité' | 'Aprendiz';
  roleTitle: string;
  avatarUrl: string;
  regional: string;
  center: string;
  documentType?: string;
  documentNumber?: string;
  phoneNumber?: string;
  dbRole?: string;
}

export interface Apprentice {
  id: string;
  name: string;
  documentType: string;
  documentNumber: string;
  ficha: string;
  program: string;
  regional: string;
  center: string;
  avatarUrl: string;
  email: string;
  phone: string;
}

export interface EvidenceItem {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc';
  size: string;
  date: string;
  sha256: string;
  verified: boolean;
  url?: string;
}

export interface PriorSanction {
  id: string;
  title: string;
  date: string;
  instructor: string;
  description: string;
  sha256: string;
  status: 'Cerrado' | 'Activo' | 'En Proceso';
}

export interface ProceduralTimelineStep {
  id: string;
  title: string;
  date?: string;
  responsible?: string;
  status: 'completed' | 'current' | 'pending' | 'locked';
  notes?: string;
  actionText?: string;
  actionView?: ViewType;
}

export interface CaseFile {
  id: string;
  apprentice: Apprentice;
  faultCategory: FaultCategory;
  severity: FaultSeverity;
  normativeArticle: string;
  normativeQuote?: string;
  faultDescription: string;
  currentPhase: string;
  sha256: string;
  slaDaysRemaining: number;
  slaDueDate: string;
  slaStatus: SLAStatus;
  isAccelerated: boolean; // Fast track for gravísima
  priorSanctions: PriorSanction[];
  evidences: EvidenceItem[];
  timeline: ProceduralTimelineStep[];
  sessionDate?: string;
  sessionTime?: string;
  sessionPlace?: string;
  sessionParticipants?: string[];
  sessionSummary?: string;
  improvementPlan?: {
    activities: string;
    dueDate: string;
    requiredEvidence: string;
    signedPlanUrl?: string;
    checklistUrl?: string;
    evaluationResult?: 'CUMPLE' | 'NO_CUMPLE';
    evaluationNotes?: string;
    evaluatedAt?: string;
  };
}

export type ViewType = 
  | 'dashboard'
  | 'cases-list'
  | 'case-detail'
  | 'executor-citation'
  | 'executor-session'
  | 'plan-evaluation'
  | 'committee-request'
  | 'committee-schedule'
  | 'smart-triage'
  | 'warning-1'
  | 'warning-2'
  | 'public-portal'
  | 'auth'
  | 'not-found';
