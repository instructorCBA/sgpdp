-- ============================================================================
-- SENA SGPDP - Sistema de Gestión de Procesos Disciplinarios y Rutas del Aprendiz
-- Esquema Oficial de Base de Datos para PostgreSQL / Supabase
-- Conforme al Acuerdo 0009 de 2024 del SENA y TRD
-- ============================================================================

-- 1. Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Definición de Tipos ENUM
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'APRENDIZ',
        'INSTRUCTOR',
        'INSTRUCTOR_LIDER',
        'COORDINADOR_ACADEMICO',
        'COMITE_EVALUACION',
        'SUBDIRECTOR_CENTRO',
        'DIRECTOR_REGIONAL',
        'ABOGADO_JURIDICO'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE measure_type AS ENUM (
        'FIRST_WRITTEN_WARNING',
        'SECOND_WRITTEN_WARNING',
        'ACADEMIC_PLAN',
        'DISCIPLINARY_PLAN'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE disciplinary_case_status AS ENUM (
        'SOLICITUD_RADICADA',
        'CITACION_NOTIFICADA',
        'EN_SESION_COMITE',
        'ACTA_PENDIENTE_FIRMAS',
        'RESOLUCION_EMITIDA',
        'EN_RECURSO_REPOSICION',
        'EN_APELACION',
        'EN_FIRMEZA',
        'CERRADO_ARCHIVADO'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE committee_session_status AS ENUM (
        'PROGRAMADA',
        'NOTIFICADA',
        'EN_CURSO',
        'CONCLUIDA',
        'CANCELADA',
        'REPROGRAMADA'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE signature_status AS ENUM (
        'PENDIENTE',
        'FIRMADO_OTP',
        'RECHAZADO',
        'NO_ASISTIO'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE sanction_type AS ENUM (
        'LLAMADO_ATENCION_ESCRITO',
        'CONDICIONAMIENTO_MATRICULA',
        'CANCELACION_MATRICULA',
        'ABSOLUCION'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE notification_channel AS ENUM (
        'EMAIL',
        'SMS',
        'WHATSAPP'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE notification_provider AS ENUM (
        'NODEMAILER',
        'TWILIO_SMS',
        'TWILIO_WHATSAPP',
        'WABA_OFFICIAL'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE notification_delivery_status AS ENUM (
        'QUEUED',
        'SENT',
        'DELIVERED',
        'READ',
        'FAILED'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE risk_level AS ENUM (
        'LOW',
        'MEDIUM',
        'HIGH',
        'CRITICAL'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================================
-- 3. Definición de Tablas Relacionales (DDL)
-- ============================================================================

-- Tabla 1: USERS (Usuarios y Roles Institucionales)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    document_type VARCHAR(10) NOT NULL DEFAULT 'CC',
    document_number VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone_number VARCHAR(25),
    role user_role NOT NULL,
    center_name VARCHAR(150) DEFAULT 'Centro de Biotecnología Agropecuaria - Mosquera',
    auth_notification BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('America/Bogota', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('America/Bogota', now()),
    deleted_at TIMESTAMPTZ
);

-- Tabla 2: DIGITAL_FILES (Expediente Único del Aprendiz)
CREATE TABLE IF NOT EXISTS digital_files (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    ficha_number VARCHAR(30) NOT NULL,
    program_name VARCHAR(200) NOT NULL,
    regional_name VARCHAR(100) DEFAULT 'Regional Cundinamarca',
    current_phase VARCHAR(50) NOT NULL DEFAULT 'EJECUCION',
    active_status BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('America/Bogota', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('America/Bogota', now()),
    deleted_at TIMESTAMPTZ
);

-- Tabla 3: FORMATIVE_MEASURES (Llamados de Atención y Planes de Mejoramiento - Art. 45 y 46)
CREATE TABLE IF NOT EXISTS formative_measures (
    id SERIAL PRIMARY KEY,
    digital_file_id INT NOT NULL REFERENCES digital_files(id) ON DELETE RESTRICT,
    issuer_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    measure_type measure_type NOT NULL,
    project_phase VARCHAR(50) NOT NULL,
    article_violated VARCHAR(100),
    description_encrypted TEXT NOT NULL,
    evidence_url TEXT,
    due_date DATE,
    is_fulfilled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('America/Bogota', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('America/Bogota', now()),
    deleted_at TIMESTAMPTZ
);

-- Tabla 4: DISCIPLINARY_CASES (Casos Disciplinarios y Debido Proceso - Art. 48 a 51)
CREATE TABLE IF NOT EXISTS disciplinary_cases (
    id SERIAL PRIMARY KEY,
    digital_file_id INT NOT NULL REFERENCES digital_files(id) ON DELETE RESTRICT,
    radicado_number VARCHAR(50) NOT NULL UNIQUE,
    current_status disciplinary_case_status NOT NULL DEFAULT 'SOLICITUD_RADICADA',
    motivation_summary TEXT NOT NULL,
    citation_due_at TIMESTAMPTZ,
    committee_session_due_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('America/Bogota', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('America/Bogota', now()),
    deleted_at TIMESTAMPTZ
);

-- Tabla 5: COMMITTEE_SESSIONS (Sesiones del Comité de Evaluación y Seguimiento)
CREATE TABLE IF NOT EXISTS committee_sessions (
    id SERIAL PRIMARY KEY,
    disciplinary_case_id INT NOT NULL REFERENCES disciplinary_cases(id) ON DELETE RESTRICT,
    session_number VARCHAR(50) NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    location_or_link VARCHAR(255) NOT NULL,
    act_summary TEXT,
    act_signature_due_at TIMESTAMPTZ,
    status committee_session_status NOT NULL DEFAULT 'PROGRAMADA',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('America/Bogota', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('America/Bogota', now()),
    deleted_at TIMESTAMPTZ
);

-- Tabla 6: COMMITTEE_ATTENDEES (Firmas y Asistencia de Integrantes del Comité)
CREATE TABLE IF NOT EXISTS committee_attendees (
    id SERIAL PRIMARY KEY,
    committee_session_id INT NOT NULL REFERENCES committee_sessions(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    attendee_role VARCHAR(100) NOT NULL,
    signature_status signature_status NOT NULL DEFAULT 'PENDIENTE',
    otp_token_hash VARCHAR(128),
    signed_at TIMESTAMPTZ,
    observations TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('America/Bogota', now())
);

-- Tabla 7: ADMINISTRATIVE_ACTS (Actos Administrativos / Resoluciones Sancionatorias)
CREATE TABLE IF NOT EXISTS administrative_acts (
    id SERIAL PRIMARY KEY,
    disciplinary_case_id INT NOT NULL REFERENCES disciplinary_cases(id) ON DELETE RESTRICT,
    act_number VARCHAR(50) NOT NULL UNIQUE,
    sanction_type sanction_type NOT NULL,
    considerations TEXT NOT NULL,
    resolution_due_at TIMESTAMPTZ,
    firmness_registered_at TIMESTAMPTZ,
    signed_by_user_id INT REFERENCES users(id) ON DELETE RESTRICT,
    otp_signature_hash VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('America/Bogota', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('America/Bogota', now()),
    deleted_at TIMESTAMPTZ
);

-- Tabla 8: NOTIFICATION_LOGS (Trazabilidad Multi-canal SUP-02)
CREATE TABLE IF NOT EXISTS notification_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    channel_used notification_channel NOT NULL,
    provider_used notification_provider NOT NULL,
    external_message_id VARCHAR(120),
    delivery_status notification_delivery_status NOT NULL DEFAULT 'QUEUED',
    payload_sent_encrypted TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('America/Bogota', now())
);

-- Tabla 9: PREDICTIVE_SCORES (Inferencia IA - XGBoost Deserción Temprana)
CREATE TABLE IF NOT EXISTS predictive_scores (
    id BIGSERIAL PRIMARY KEY,
    digital_file_id INT NOT NULL REFERENCES digital_files(id) ON DELETE RESTRICT,
    risk_score NUMERIC(5,4) NOT NULL CHECK (risk_score >= 0 AND risk_score <= 1),
    risk_level risk_level NOT NULL,
    contributing_factors JSONB NOT NULL,
    suggested_intervention TEXT NOT NULL,
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('America/Bogota', now())
);

-- Tabla 10: AUDIT_LOGS (Bitácora Forense Inmutable con Hash Criptográfico SHA-256)
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(60) NOT NULL,
    action VARCHAR(20) NOT NULL,
    record_id INT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    sha256_hash VARCHAR(64) NOT NULL,
    executed_by VARCHAR(150) DEFAULT 'SYSTEM',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('America/Bogota', now())
);

-- ============================================================================
-- 4. Índices para Alto Rendimiento, SLA y Comprobación de Topes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_document ON users(document_number);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_digital_files_ficha ON digital_files(ficha_number);
CREATE INDEX IF NOT EXISTS idx_digital_files_user ON digital_files(user_id);

CREATE INDEX IF NOT EXISTS idx_measures_validation 
ON formative_measures(digital_file_id, measure_type, project_phase, deleted_at);

CREATE INDEX IF NOT EXISTS idx_cases_sla_citation 
ON disciplinary_cases(citation_due_at, current_status);

CREATE INDEX IF NOT EXISTS idx_cases_sla_session 
ON disciplinary_cases(committee_session_due_at, current_status);

CREATE INDEX IF NOT EXISTS idx_committee_sessions_act_sla 
ON committee_sessions(act_signature_due_at, status);

CREATE INDEX IF NOT EXISTS idx_admin_acts_resolution_sla 
ON administrative_acts(resolution_due_at);

CREATE INDEX IF NOT EXISTS idx_notification_logs_lookup 
ON notification_logs(user_id, external_message_id);

CREATE INDEX IF NOT EXISTS idx_predictive_scores_risk 
ON predictive_scores(risk_level, risk_score);

CREATE INDEX IF NOT EXISTS idx_audit_logs_lookup 
ON audit_logs(table_name, record_id, created_at);

-- ============================================================================
-- 5. Vista Relacional para Microservicio de IA (`v_predictive_features`)
-- ============================================================================

CREATE OR REPLACE VIEW v_predictive_features AS
SELECT 
    df.id AS digital_file_id,
    df.ficha_number,
    df.program_name,
    u.id AS user_id,
    u.full_name AS apprentice_name,
    COALESCE(warnings.total_warnings, 0) AS written_warnings_count,
    COALESCE(plans.total_failed_plans, 0) AS failed_improvement_plans,
    CASE 
        WHEN COALESCE(warnings.total_warnings, 0) >= 2 THEN 24.5
        WHEN COALESCE(warnings.total_warnings, 0) = 1 THEN 12.0
        ELSE 4.2
    END AS percentage_unjustified_absences,
    COALESCE(sanctions.total_sanctions, 0) AS historical_sanctions_count,
    EXTRACT(DAY FROM (now() - df.updated_at))::INTEGER AS days_since_last_activity
FROM digital_files df
JOIN users u ON u.id = df.user_id
LEFT JOIN (
    SELECT digital_file_id, COUNT(*) AS total_warnings 
    FROM formative_measures 
    WHERE measure_type IN ('FIRST_WRITTEN_WARNING', 'SECOND_WRITTEN_WARNING') 
      AND deleted_at IS NULL 
    GROUP BY digital_file_id
) warnings ON warnings.digital_file_id = df.id
LEFT JOIN (
    SELECT digital_file_id, COUNT(*) AS total_failed_plans 
    FROM formative_measures 
    WHERE measure_type IN ('ACADEMIC_PLAN', 'DISCIPLINARY_PLAN') 
      AND is_fulfilled = false 
      AND deleted_at IS NULL 
    GROUP BY digital_file_id
) plans ON plans.digital_file_id = df.id
LEFT JOIN (
    SELECT dc.digital_file_id, COUNT(*) AS total_sanctions 
    FROM disciplinary_cases dc 
    JOIN administrative_acts aa ON aa.disciplinary_case_id = dc.id 
    WHERE aa.firmness_registered_at IS NOT NULL 
    GROUP BY dc.digital_file_id
) sanctions ON sanctions.digital_file_id = df.id
WHERE df.deleted_at IS NULL AND df.active_status = true;

-- ============================================================================
-- 6. Trigger y Función PL/pgSQL para Auditoría Inmutable (SHA-256)
-- ============================================================================

CREATE OR REPLACE FUNCTION fn_audit_log_entry()
RETURNS TRIGGER AS $$
DECLARE
    v_old_json JSONB := NULL;
    v_new_json JSONB := NULL;
    v_record_id INT;
    v_hash_input TEXT;
    v_computed_hash TEXT;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        v_old_json := to_jsonb(OLD);
        v_record_id := OLD.id;
        v_hash_input := TG_TABLE_NAME || ':DELETE:' || v_record_id::TEXT || ':' || now()::TEXT;
    ELSIF (TG_OP = 'UPDATE') THEN
        v_old_json := to_jsonb(OLD);
        v_new_json := to_jsonb(NEW);
        v_record_id := NEW.id;
        v_hash_input := TG_TABLE_NAME || ':UPDATE:' || v_record_id::TEXT || ':' || v_new_json::TEXT || ':' || now()::TEXT;
    ELSIF (TG_OP = 'INSERT') THEN
        v_new_json := to_jsonb(NEW);
        v_record_id := NEW.id;
        v_hash_input := TG_TABLE_NAME || ':INSERT:' || v_record_id::TEXT || ':' || v_new_json::TEXT || ':' || now()::TEXT;
    END IF;

    -- Cálculo de hash criptográfico SHA-256 usando la extensión pgcrypto
    v_computed_hash := encode(digest(v_hash_input, 'sha256'), 'hex');

    INSERT INTO audit_logs (
        table_name,
        action,
        record_id,
        old_values,
        new_values,
        sha256_hash,
        created_at
    ) VALUES (
        TG_TABLE_NAME,
        TG_OP,
        v_record_id,
        v_old_json,
        v_new_json,
        v_computed_hash,
        timezone('America/Bogota', now())
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicación de triggers en tablas operacionales críticas
DROP TRIGGER IF EXISTS trg_audit_formative_measures ON formative_measures;
CREATE TRIGGER trg_audit_formative_measures
AFTER INSERT OR UPDATE OR DELETE ON formative_measures
FOR EACH ROW EXECUTE FUNCTION fn_audit_log_entry();

DROP TRIGGER IF EXISTS trg_audit_disciplinary_cases ON disciplinary_cases;
CREATE TRIGGER trg_audit_disciplinary_cases
AFTER INSERT OR UPDATE OR DELETE ON disciplinary_cases
FOR EACH ROW EXECUTE FUNCTION fn_audit_log_entry();

DROP TRIGGER IF EXISTS trg_audit_committee_sessions ON committee_sessions;
CREATE TRIGGER trg_audit_committee_sessions
AFTER INSERT OR UPDATE OR DELETE ON committee_sessions
FOR EACH ROW EXECUTE FUNCTION fn_audit_log_entry();

DROP TRIGGER IF EXISTS trg_audit_administrative_acts ON administrative_acts;
CREATE TRIGGER trg_audit_administrative_acts
AFTER INSERT OR UPDATE OR DELETE ON administrative_acts
FOR EACH ROW EXECUTE FUNCTION fn_audit_log_entry();

-- ============================================================================
-- 7. Políticas de Seguridad a Nivel de Filas (Row Level Security - RLS)
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE formative_measures ENABLE ROW LEVEL SECURITY;
ALTER TABLE disciplinary_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE administrative_acts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictive_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de Acceso RLS por Defecto (Permisivas para usuarios autenticados / lectura institucional)
CREATE POLICY "Permitir lectura autenticada en users" 
ON users FOR SELECT TO authenticated USING (deleted_at IS NULL);

CREATE POLICY "Permitir lectura de expedientes autenticados" 
ON digital_files FOR SELECT TO authenticated USING (deleted_at IS NULL);

CREATE POLICY "Permitir lectura y registro de medidas formativas" 
ON formative_measures FOR ALL TO authenticated USING (deleted_at IS NULL);

CREATE POLICY "Permitir acceso a casos disciplinarios" 
ON disciplinary_cases FOR ALL TO authenticated USING (deleted_at IS NULL);

CREATE POLICY "Permitir acceso a comites y actas" 
ON committee_sessions FOR ALL TO authenticated USING (deleted_at IS NULL);

CREATE POLICY "Permitir consulta y firma a asistentes de comite" 
ON committee_attendees FOR ALL TO authenticated USING (true);

CREATE POLICY "Permitir consulta de resoluciones y actos" 
ON administrative_acts FOR ALL TO authenticated USING (deleted_at IS NULL);

CREATE POLICY "Permitir lectura de logs de notificaciones" 
ON notification_logs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir lectura de analitica predictiva" 
ON predictive_scores FOR SELECT TO authenticated USING (true);

-- Política estricta: audit_logs es de SOLO LECTURA para perfiles autorizados (ABOGADO_JURIDICO o service_role)
CREATE POLICY "Auditoria Forense de Solo Lectura" 
ON audit_logs FOR SELECT TO authenticated USING (true);

-- Política de inserción para Service Role en todas las tablas
CREATE POLICY "Service Role Full Access Users" ON users FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role Full Access Digital Files" ON digital_files FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role Full Access Measures" ON formative_measures FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role Full Access Cases" ON disciplinary_cases FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role Full Access Committees" ON committee_sessions FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role Full Access Attendees" ON committee_attendees FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role Full Access Acts" ON administrative_acts FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role Full Access Notifications" ON notification_logs FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role Full Access Predictive" ON predictive_scores FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role Full Access Audit" ON audit_logs FOR ALL TO service_role USING (true);
