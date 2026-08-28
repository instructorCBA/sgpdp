-- ============================================================================
-- SENA SGPDP - Sistema de Gestión de Procesos Disciplinarios y Rutas del Aprendiz
-- SCRIPT DE DATOS SEMILLA (seed.sql) - Supabase / PostgreSQL (Acuerdo 0009 de 2024 / TRD V2)
-- ============================================================================
-- CONSIDERACIONES TÉCNICAS SUPABASE / POSTGRESQL:
-- 1. Se deshabilitan temporalmente los triggers/RLS mediante 'session_replication_role = replica'
--    para permitir la carga masiva consistente con IDs fijos e integridad referencial garantizada.
-- 2. Zona horaria fija: 'America/Bogota' (UTC-5) para todos los campos TIMESTAMPTZ.
-- 3. Fechas hábiles colombianas 2026: Sin sábados, domingos ni festivos oficiales de Colombia.
-- 4. Horas límite legales (SLA): Fijadas exactamente a las 17:00:00-05.
-- 5. Relación con auth.users: La tabla 'public.users' gestiona el perfil institucional
--    del SENA (documento, rol, centro). En arquitecturas integradas con Supabase Auth,
--    el ID o email se vincula 1:1 con 'auth.users.email' / 'auth.users.id'.
-- ============================================================================

-- A. Extensiones y configuración de sesión
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

SET session_replication_role = 'replica';

-- B. Limpieza de tablas en orden de dependencias
TRUNCATE TABLE audit_logs RESTART IDENTITY CASCADE;
TRUNCATE TABLE predictive_scores RESTART IDENTITY CASCADE;
TRUNCATE TABLE notification_logs RESTART IDENTITY CASCADE;
TRUNCATE TABLE administrative_acts RESTART IDENTITY CASCADE;
TRUNCATE TABLE committee_attendees RESTART IDENTITY CASCADE;
TRUNCATE TABLE committee_sessions RESTART IDENTITY CASCADE;
TRUNCATE TABLE disciplinary_cases RESTART IDENTITY CASCADE;
TRUNCATE TABLE formative_measures RESTART IDENTITY CASCADE;
TRUNCATE TABLE digital_files RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- ============================================================================
-- 1. BLOQUE: USUARIOS INSTITUCIONALES (USERS)
-- Total: 35 usuarios
--   - 10 Instructores (con asignación a equipos ejecutores y fichas)
--   - 21 Aprendices (distribuidos en 6 fichas de formación distintas)
--   - 4 Directivos / Autoridades (Coordinador, Comité, Subdirector, Jurídica)
-- ============================================================================

INSERT INTO users (id, document_type, document_number, full_name, email, phone_number, role, center_name, auth_notification, created_at, updated_at, deleted_at)
VALUES
-- DIRECTIVOS Y AUTORIDADES INSTITUCIONALES (IDs 1-4)
(1, 'CC', '79876543', 'Ing. Andrés Felipe Cárdenas Rojas', 'andres.cardenas@sena.edu.co', '+573185550501', 'COORDINADOR_ACADEMICO', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-01-15 08:00:00-05', '2026-01-15 08:00:00-05', NULL),
(2, 'CC', '51987654', 'Dra. Mónica Lucía Arango Salazar', 'monica.arango@sena.edu.co', '+573115550602', 'COMITE_EVALUACION', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-01-15 08:00:00-05', '2026-01-15 08:00:00-05', NULL),
(3, 'CC', '19456789', 'Dr. Hernán Darío Velásquez Restrepo', 'hernan.velasquez@sena.edu.co', '+573145550703', 'SUBDIRECTOR_CENTRO', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-01-15 08:00:00-05', '2026-01-15 08:00:00-05', NULL),
(4, 'CC', '71234567', 'Abg. Mauricio Tobón Quintero', 'mauricio.tobon@sena.edu.co', '+573175550904', 'ABOGADO_JURIDICO', 'Oficina Jurídica - Dirección General SENA', true, '2026-01-15 08:00:00-05', '2026-01-15 08:00:00-05', NULL),

-- 10 INSTRUCTORES (IDs 5-14)
-- Asociados de forma cruzada a las 6 Fichas: 2712489, 2834512, 2901423, 2956104, 3012845, 3089712
(5, 'CC', '80123456', 'Carlos Alberto Ruiz Morales', 'cruiz@sena.edu.co', '+573105550105', 'INSTRUCTOR_LIDER', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-01-15 08:00:00-05', '2026-01-15 08:00:00-05', NULL),
(6, 'CC', '52345678', 'Patricia Gómez Restrepo', 'patricia.gomez@sena.edu.co', '+573125550406', 'INSTRUCTOR', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-01-15 08:00:00-05', '2026-01-15 08:00:00-05', NULL),
(7, 'CC', '80876543', 'Julián David Pineda Castaño', 'julian.pineda@sena.edu.co', '+573135550707', 'INSTRUCTOR', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-01-15 08:00:00-05', '2026-01-15 08:00:00-05', NULL),
(8, 'CC', '53123456', 'Claudia Marcela Ortiz Riaño', 'claudia.ortiz@sena.edu.co', '+573155550808', 'INSTRUCTOR_LIDER', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-01-15 08:00:00-05', '2026-01-15 08:00:00-05', NULL),
(9, 'CC', '79654321', 'Jorge Eliécer Medina Duarte', 'jorge.medina@sena.edu.co', '+573165550909', 'INSTRUCTOR', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-01-15 08:00:00-05', '2026-01-15 08:00:00-05', NULL),
(10, 'CC', '52987654', 'María Fernanda Londoño Vallejo', 'maria.londono@sena.edu.co', '+573195551010', 'INSTRUCTOR', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-01-15 08:00:00-05', '2026-01-15 08:00:00-05', NULL),
(11, 'CC', '80345678', 'Diego Armando Castro Silva', 'diego.castro@sena.edu.co', '+573205551111', 'INSTRUCTOR_LIDER', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-01-15 08:00:00-05', '2026-01-15 08:00:00-05', NULL),
(12, 'CC', '51876543', 'Sonia Esperanza Benítez Gil', 'sonia.benitez@sena.edu.co', '+573215551212', 'INSTRUCTOR', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-01-15 08:00:00-05', '2026-01-15 08:00:00-05', NULL),
(13, 'CC', '79234567', 'Germán Alfonso Rincón Vega', 'german.rincon@sena.edu.co', '+573225551313', 'INSTRUCTOR', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-01-15 08:00:00-05', '2026-01-15 08:00:00-05', NULL),
(14, 'CC', '1029876543', 'Equipo de Instructores CBA Mosquera', 'instructor.sena.cba@gmail.com', '+573235551414', 'INSTRUCTOR', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-01-15 08:00:00-05', '2026-01-15 08:00:00-05', NULL),

-- 21 APRENDICES DISTRIBUIDOS EN 6 FICHAS (IDs 15-35)
-- Ficha 1: 2712489 (ADSO) - Aprendices 15, 16, 17, 18
(15, 'CC', '1023456789', 'Valentina Morales Peña', 'vmorales@soy.sena.edu.co', '+573005550215', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),
(16, 'CC', '1014567890', 'Juan David Ospina Castro', 'juan.ospina@soy.sena.edu.co', '+573155550316', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),
(17, 'CC', '1032547891', 'Santiago Rengifo Gutiérrez', 'santiago.rengifo@soy.sena.edu.co', '+573165550417', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),
(18, 'TI', '1098765432', 'Camila Andrea Vargas Ruiz', 'camila.vargas@soy.sena.edu.co', '+573175550518', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),

-- Ficha 2: 2834512 (Gestión de Redes de Datos) - Aprendices 19, 20, 21, 22
(19, 'CC', '1024567891', 'Mateo Alexander Caicedo Pinto', 'mateo.caicedo@soy.sena.edu.co', '+573185550619', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),
(20, 'CC', '1015678902', 'Laura Juliana Montenegro Paz', 'laura.montenegro@soy.sena.edu.co', '+573195550720', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),
(21, 'CC', '1033658902', 'Daniel Esteban Quintero Marín', 'daniel.quintero@soy.sena.edu.co', '+573205550821', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),
(22, 'TI', '1099876543', 'Gabriela Sofía Hincapié Mora', 'gabriela.hincapie@soy.sena.edu.co', '+573215550922', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),

-- Ficha 3: 2901423 (Biotecnología Vegetal) - Aprendices 23, 24, 25, 26
(23, 'CC', '1025678903', 'Sebastián Camilo Beltrán Tovar', 'sebastian.beltran@soy.sena.edu.co', '+573225551023', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),
(24, 'CC', '1016789013', 'Daniela Paola Cifuentes Lara', 'daniela.cifuentes@soy.sena.edu.co', '+573235551124', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),
(25, 'CC', '1034769013', 'Felipe Andrés Salamanca Reyes', 'felipe.salamanca@soy.sena.edu.co', '+573245551225', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),
(26, 'CC', '1097654321', 'Manuela Alejandra Parra León', 'manuela.parra@soy.sena.edu.co', '+573255551326', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),

-- Ficha 4: 2956104 (Gestión de Empresas Agropecuarias) - Aprendices 27, 28, 29
(27, 'CC', '1026789014', 'Nicolás Eduardo Guzmán Prieto', 'nicolas.guzman@soy.sena.edu.co', '+573265551427', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),
(28, 'CC', '1017890124', 'Mariana Isabel Cuervo Nieto', 'mariana.cuervo@soy.sena.edu.co', '+573275551528', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),
(29, 'CC', '1035870124', 'Alejandro José Forero Melo', 'alejandro.forero@soy.sena.edu.co', '+573285551629', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),

-- Ficha 5: 3012845 (Mantenimiento Mecatrónico Industrial) - Aprendices 30, 31, 32
(30, 'CC', '1027890125', 'Cristian Camilo Barreto Roa', 'cristian.barreto@soy.sena.edu.co', '+573295551730', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),
(31, 'CC', '1018901235', 'Paula Andrea Veloza Bernal', 'paula.veloza@soy.sena.edu.co', '+573305551831', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),
(32, 'CC', '1036981235', 'Brayan David Solano Peña', 'brayan.solano@soy.sena.edu.co', '+573315551932', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),

-- Ficha 6: 3089712 (Procesamiento de Alimentos Agroindustriales) - Aprendices 33, 34, 35
(33, 'CC', '1028901236', 'Karen Dayana Bohórquez Niño', 'karen.bohorquez@soy.sena.edu.co', '+573325552033', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),
(34, 'CC', '1019012346', 'Jhonatan Sneider Garzón Rincón', 'jhonatan.garzon@soy.sena.edu.co', '+573335552134', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL),
(35, 'CC', '1037092346', 'Angie Tatiana Valderrama Cruz', 'angie.valderrama@soy.sena.edu.co', '+573345552235', 'APRENDIZ', 'Centro de Biotecnología Agropecuaria - Mosquera', true, '2026-02-02 08:00:00-05', '2026-02-02 08:00:00-05', NULL);

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- ============================================================================
-- 2. BLOQUE: EXPEDIENTES DIGITALES ÚNICOS (DIGITAL_FILES)
-- Total: 16 Expedientes Digitales creados para aprendices en distintas fases
-- ============================================================================

INSERT INTO digital_files (id, user_id, ficha_number, program_name, regional_name, current_phase, active_status, created_at, updated_at, deleted_at)
VALUES
(1, 15, '2712489', 'Tecnología en Análisis y Desarrollo de Software (ADSO)', 'Regional Cundinamarca', 'EJECUCION', true, '2026-02-05 08:30:00-05', '2026-08-25 14:20:00-05', NULL),
(2, 16, '2712489', 'Tecnología en Análisis y Desarrollo de Software (ADSO)', 'Regional Cundinamarca', 'EJECUCION', true, '2026-02-05 08:30:00-05', '2026-08-20 10:15:00-05', NULL),
(3, 17, '2712489', 'Tecnología en Análisis y Desarrollo de Software (ADSO)', 'Regional Cundinamarca', 'EJECUCION', true, '2026-02-05 08:30:00-05', '2026-07-15 09:00:00-05', NULL),
(4, 18, '2712489', 'Tecnología en Análisis y Desarrollo de Software (ADSO)', 'Regional Cundinamarca', 'EJECUCION', true, '2026-02-05 08:30:00-05', '2026-08-24 16:45:00-05', NULL),
(5, 19, '2834512', 'Tecnología en Gestión de Redes de Datos', 'Regional Cundinamarca', 'PLANEACION', true, '2026-02-10 09:00:00-05', '2026-08-18 11:30:00-05', NULL),
(6, 20, '2834512', 'Tecnología en Gestión de Redes de Datos', 'Regional Cundinamarca', 'PLANEACION', true, '2026-02-10 09:00:00-05', '2026-08-22 15:10:00-05', NULL),
(7, 21, '2834512', 'Tecnología en Gestión de Redes de Datos', 'Regional Cundinamarca', 'PLANEACION', true, '2026-02-10 09:00:00-05', '2026-08-10 08:45:00-05', NULL),
(8, 23, '2901423', 'Tecnología en Biotecnología Vegetal', 'Regional Cundinamarca', 'ANALISIS', true, '2026-02-15 10:00:00-05', '2026-08-12 14:00:00-05', NULL),
(9, 24, '2901423', 'Tecnología en Biotecnología Vegetal', 'Regional Cundinamarca', 'ANALISIS', true, '2026-02-15 10:00:00-05', '2026-08-26 09:30:00-05', NULL),
(10, 27, '2956104', 'Tecnología en Gestión de Empresas Agropecuarias', 'Regional Cundinamarca', 'EJECUCION', true, '2026-02-20 11:00:00-05', '2026-08-25 17:00:00-05', NULL),
(11, 28, '2956104', 'Tecnología en Gestión de Empresas Agropecuarias', 'Regional Cundinamarca', 'EJECUCION', true, '2026-02-20 11:00:00-05', '2026-08-14 11:00:00-05', NULL),
(12, 30, '3012845', 'Tecnología en Mantenimiento Mecatrónico Industrial', 'Regional Cundinamarca', 'EVALUACION', true, '2026-03-02 08:00:00-05', '2026-08-21 16:20:00-05', NULL),
(13, 31, '3012845', 'Tecnología en Mantenimiento Mecatrónico Industrial', 'Regional Cundinamarca', 'EVALUACION', true, '2026-03-02 08:00:00-05', '2026-08-19 10:00:00-05', NULL),
(14, 33, '3089712', 'Tecnología en Procesamiento de Alimentos Agroindustriales', 'Regional Cundinamarca', 'PLANEACION', true, '2026-03-10 09:30:00-05', '2026-08-24 13:15:00-05', NULL),
(15, 34, '3089712', 'Tecnología en Procesamiento de Alimentos Agroindustriales', 'Regional Cundinamarca', 'PLANEACION', true, '2026-03-10 09:30:00-05', '2026-08-26 15:40:00-05', NULL),
(16, 25, '2901423', 'Tecnología en Biotecnología Vegetal', 'Regional Cundinamarca', 'ANALISIS', true, '2026-02-15 10:00:00-05', '2026-08-27 10:00:00-05', NULL);

SELECT setval('digital_files_id_seq', (SELECT MAX(id) FROM digital_files));

-- ============================================================================
-- 3. BLOQUE: MEDIDAS FORMATIVAS (FORMATIVE_MEASURES) - Art. 45 y 46 Acuerdo 0009
-- Total: 20 Medidas (Llamados de Atención Escritos y Planes de Mejoramiento)
-- Aplicadas a 14 aprendices distintos, con mezcla de abiertas y cumplidas.
-- ============================================================================

INSERT INTO formative_measures (id, digital_file_id, issuer_id, measure_type, project_phase, article_violated, description_encrypted, evidence_url, due_date, is_fulfilled, created_at, updated_at, deleted_at)
VALUES
-- Aprendiz 15 (Expediente 1 - ADSO)
(1, 1, 5, 'FIRST_WRITTEN_WARNING', 'EJECUCION', 'Art. 9 Parágrafo 2 (Inasistencias injustificadas acumuladas)', 'Inasistencia injustificada a tres (3) sesiones técnicas consecutivas de la competencia Construcción de Software con Node.js y React.', 'https://repositorio.sena.edu.co/evidencias/2712489/acta_inasistencia_01.pdf', '2026-06-12', true, '2026-06-01 08:30:00-05', '2026-06-15 10:00:00-05', NULL),
(2, 1, 6, 'SECOND_WRITTEN_WARNING', 'EJECUCION', 'Art. 46 Numeral 1 (Reincidencia en deberes formativos)', 'No entrega de los artefactos de arquitectura de microservicios correspondientes al Sprint 4 del proyecto formativo institucional.', 'https://repositorio.sena.edu.co/evidencias/2712489/reporte_sprint4_incumplimiento.pdf', '2026-07-24', false, '2026-07-10 11:00:00-05', '2026-07-25 09:00:00-05', NULL),
(3, 1, 5, 'ACADEMIC_PLAN', 'EJECUCION', 'Art. 45 Numeral 2 (Plan de Mejoramiento Académico)', 'Plan de mejoramiento académico con entrega y sustentación presencial de modelo relacional DDL/DML y endpoints REST documentados en Swagger.', 'https://repositorio.sena.edu.co/evidencias/2712489/plan_mejoramiento_academico_adso.pdf', '2026-08-28', false, '2026-08-03 09:00:00-05', '2026-08-03 09:00:00-05', NULL),

-- Aprendiz 16 (Expediente 2 - ADSO)
(4, 2, 7, 'FIRST_WRITTEN_WARNING', 'EJECUCION', 'Art. 24 Literal A (Incumplimiento de actividades)', 'Incumplimiento injustificado en las actividades sincrónicas de aseguramiento de calidad y pruebas unitarias.', 'https://repositorio.sena.edu.co/evidencias/2712489/informe_calidad_16.pdf', '2026-06-25', true, '2026-06-11 14:00:00-05', '2026-06-26 09:30:00-05', NULL),
(5, 2, 7, 'ACADEMIC_PLAN', 'EJECUCION', 'Art. 45 Numeral 2 (Plan Académico Concertado)', 'Desarrollo de suite de pruebas automatizadas con Jest y Cypress sobre el módulo de autenticación del proyecto.', 'https://repositorio.sena.edu.co/evidencias/2712489/plan_pruebas_16.pdf', '2026-07-30', true, '2026-07-02 10:00:00-05', '2026-07-31 16:00:00-05', NULL),

-- Aprendiz 17 (Expediente 3 - ADSO)
(6, 3, 5, 'FIRST_WRITTEN_WARNING', 'EJECUCION', 'Art. 10 Numeral 4 (Uso indebido de recursos tecnológicos)', 'Uso inapropiado de la red institucional para descarga de contenido no académico durante la jornada formativa.', 'https://repositorio.sena.edu.co/evidencias/2712489/log_seguridad_red_17.pdf', '2026-05-15', true, '2026-05-04 15:20:00-05', '2026-05-18 08:00:00-05', NULL),
(7, 3, 6, 'DISCIPLINARY_PLAN', 'EJECUCION', 'Art. 46 Numeral 3 (Plan de Mejoramiento Disciplinario)', 'Realización de taller de sensibilización y liderazgo sobre políticas de ciberseguridad y convivencia digital SENA.', 'https://repositorio.sena.edu.co/evidencias/2712489/compromiso_convivencia_17.pdf', '2026-06-10', true, '2026-05-20 09:00:00-05', '2026-06-11 11:30:00-05', NULL),

-- Aprendiz 18 (Expediente 4 - ADSO)
(8, 4, 6, 'FIRST_WRITTEN_WARNING', 'EJECUCION', 'Art. 9 Parágrafo 2 (Inasistencia injustificada)', 'Registro de 18 horas acumuladas de inasistencia sin soporte en el trimestre formativo.', 'https://repositorio.sena.edu.co/evidencias/2712489/inasistencia_trimestral_18.pdf', '2026-08-14', false, '2026-08-04 08:00:00-05', '2026-08-04 08:00:00-05', NULL),

-- Aprendiz 19 (Expediente 5 - Redes)
(9, 5, 8, 'FIRST_WRITTEN_WARNING', 'PLANEACION', 'Art. 24 Literal D (Incumplimiento de cronograma técnico)', 'No entrega de topología de red enrutada OSPF y direccionamiento IPv6 según especificación del cliente.', 'https://repositorio.sena.edu.co/evidencias/2834512/topologia_red_19.pdf', '2026-07-17', true, '2026-07-06 10:30:00-05', '2026-07-20 14:00:00-05', NULL),
(10, 5, 8, 'SECOND_WRITTEN_WARNING', 'PLANEACION', 'Art. 46 Numeral 1 (Reiteración técnica)', 'Persistencia en la omisión de configuración de VLANs seguras en switches Cisco durante la práctica de laboratorio.', 'https://repositorio.sena.edu.co/evidencias/2834512/informe_laboratorio_19.pdf', '2026-08-21', false, '2026-08-10 14:30:00-05', '2026-08-10 14:30:00-05', NULL),

-- Aprendiz 20 (Expediente 6 - Redes)
(11, 6, 9, 'ACADEMIC_PLAN', 'PLANEACION', 'Art. 45 Numeral 2 (Refuerzo Pedagógico en Redes WAN)', 'Plan de mejoramiento con sustentación de simulación Packet Tracer de enlaces WAN con encapsulamiento HDLC/PPP.', 'https://repositorio.sena.edu.co/evidencias/2834512/plan_wan_20.pdf', '2026-09-04', false, '2026-08-18 09:00:00-05', '2026-08-18 09:00:00-05', NULL),

-- Aprendiz 21 (Expediente 7 - Redes)
(12, 7, 10, 'FIRST_WRITTEN_WARNING', 'PLANEACION', 'Art. 12 Numeral 2 (Faltas contra el respeto institucional)', 'Desatención reiterada a las instrucciones del instructor durante las sesiones prácticas de laboratorio.', 'https://repositorio.sena.edu.co/evidencias/2834512/acta_observacion_21.pdf', '2026-07-28', true, '2026-07-14 16:00:00-05', '2026-07-29 08:30:00-05', NULL),

-- Aprendiz 23 (Expediente 8 - Biotecnología)
(13, 8, 11, 'FIRST_WRITTEN_WARNING', 'ANALISIS', 'Art. 9 Parágrafo 2 (Inasistencias a laboratorio)', 'Inasistencia no justificada a práctica obligatoria de preparación de medios de cultivo estériles.', 'https://repositorio.sena.edu.co/evidencias/2901423/acta_bioseguridad_23.pdf', '2026-06-30', true, '2026-06-16 08:00:00-05', '2026-07-01 10:00:00-05', NULL),
(14, 8, 11, 'ACADEMIC_PLAN', 'ANALISIS', 'Art. 45 Numeral 2 (Plan de Laboratorio)', 'Recuperación de protocolo de micropropagación in vitro y prueba escrita de asepsia y biocontención.', 'https://repositorio.sena.edu.co/evidencias/2901423/plan_cultivos_23.pdf', '2026-07-31', true, '2026-07-07 11:00:00-05', '2026-08-03 14:00:00-05', NULL),

-- Aprendiz 24 (Expediente 9 - Biotecnología)
(15, 9, 12, 'FIRST_WRITTEN_WARNING', 'ANALISIS', 'Art. 14 Numeral 1 (Incumplimiento de normas de bioseguridad)', 'Ingreso al laboratorio sin los elementos de protección personal (EPP) reglamentarios.', 'https://repositorio.sena.edu.co/evidencias/2901423/reporte_epp_24.pdf', '2026-08-25', false, '2026-08-11 09:30:00-05', '2026-08-11 09:30:00-05', NULL),

-- Aprendiz 27 (Expediente 10 - Gestión Agropecuaria)
(16, 10, 13, 'FIRST_WRITTEN_WARNING', 'EJECUCION', 'Art. 24 Literal C (Incumplimiento de registros de campo)', 'Falta de diligenciamiento oportuno de los libros contables y bitácoras de la unidad productiva pecuaria.', 'https://repositorio.sena.edu.co/evidencias/2956104/bitacora_campo_27.pdf', '2026-06-19', true, '2026-06-05 10:00:00-05', '2026-06-22 08:00:00-05', NULL),
(17, 10, 13, 'SECOND_WRITTEN_WARNING', 'EJECUCION', 'Art. 46 Numeral 1 (Reincidencia administrativa)', 'Incumplimiento sistemático del plan de costos de producción en la fase de comercialización agrícola.', 'https://repositorio.sena.edu.co/evidencias/2956104/informe_costos_27.pdf', '2026-08-14', false, '2026-08-03 15:00:00-05', '2026-08-03 15:00:00-05', NULL),

-- Aprendiz 30 (Expediente 12 - Mecatrónica)
(18, 12, 14, 'FIRST_WRITTEN_WARNING', 'EVALUACION', 'Art. 9 Parágrafo 2 (Inasistencia a montaje)', 'Inasistencia sin causa justa a la sesión de comisionamiento de celda robótica industrial.', 'https://repositorio.sena.edu.co/evidencias/3012845/acta_montaje_30.pdf', '2026-07-21', true, '2026-07-07 08:00:00-05', '2026-07-22 09:00:00-05', NULL),
(19, 12, 14, 'ACADEMIC_PLAN', 'EVALUACION', 'Art. 45 Numeral 2 (Plan PLC y Automatización)', 'Programación y verificación de lógica de seguridad en PLC Siemens S7-1200 con diagrama de tiempos.', 'https://repositorio.sena.edu.co/evidencias/3012845/plan_plc_30.pdf', '2026-08-28', false, '2026-08-06 14:00:00-05', '2026-08-06 14:00:00-05', NULL),

-- Aprendiz 33 (Expediente 14 - Agroindustria)
(20, 14, 10, 'FIRST_WRITTEN_WARNING', 'PLANEACION', 'Art. 15 Numeral 3 (Inocuidad alimentaria BPM)', 'Incumplimiento del protocolo de desinfección en la planta piloto de lácteos y derivados.', 'https://repositorio.sena.edu.co/evidencias/3089712/reporte_bpm_33.pdf', '2026-08-27', false, '2026-08-13 11:00:00-05', '2026-08-13 11:00:00-05', NULL);

SELECT setval('formative_measures_id_seq', (SELECT MAX(id) FROM formative_measures));

-- ============================================================================
-- 4. BLOQUE: CASOS DISCIPLINARIOS (DISCIPLINARY_CASES) - Art. 48 a 51
-- Total: 6 Casos Activos con estricta trazabilidad de SLA
-- ============================================================================

INSERT INTO disciplinary_cases (id, digital_file_id, radicado_number, current_status, motivation_summary, citation_due_at, committee_session_due_at, created_at, updated_at, deleted_at)
VALUES
-- Caso 1: Aprendiz 15 (ADSO) - Agotamiento de medidas en Ejecución
(1, 1, 'RAD-2026-CBA-00142', 'EN_SESION_COMITE', 'Agotamiento formal del ciclo de medidas formativas (1er y 2do llamado de atención con plan de mejoramiento no superado) en la fase de Ejecución. Remisión a Comité según Art. 46.2 y 48 del Acuerdo 0009 de 2024.', '2026-08-21 17:00:00-05', '2026-09-02 17:00:00-05', '2026-08-14 09:00:00-05', '2026-08-25 14:20:00-05', NULL),

-- Caso 2: Aprendiz 19 (Redes) - Reincidencia en faltas técnicas
(2, 5, 'RAD-2026-CBA-00143', 'CITACION_NOTIFICADA', 'Reiteración injustificada de incumplimientos graves en la entrega de topologías de red y configuración de seguridad perimetral.', '2026-08-26 17:00:00-05', '2026-09-04 17:00:00-05', '2026-08-18 10:30:00-05', '2026-08-22 11:00:00-05', NULL),

-- Caso 3: Aprendiz 27 (Gestión Agropecuaria) - Falta disciplinaria
(3, 10, 'RAD-2026-CBA-00144', 'SOLICITUD_RADICADA', 'Incumplimiento continuado de directrices sanitarias y desatención a compromisos pactados en fase de ejecución productiva.', '2026-08-28 17:00:00-05', '2026-09-08 17:00:00-05', '2026-08-21 11:00:00-05', '2026-08-21 11:00:00-05', NULL),

-- Caso 4: Aprendiz 18 (ADSO) - Deserción presunta por inasistencias
(4, 4, 'RAD-2026-CBA-00145', 'CITACION_NOTIFICADA', 'Acumulación de inasistencias injustificadas superiores al límite reglamentario sin reporte de justificación legal.', '2026-08-27 17:00:00-05', '2026-09-07 17:00:00-05', '2026-08-19 14:00:00-05', '2026-08-24 16:45:00-05', NULL),

-- Caso 5: Aprendiz 30 (Mecatrónica) - Daño culposo a equipo especializado
(5, 12, 'RAD-2026-CBA-00146', 'ACTA_PENDIENTE_FIRMAS', 'Operación negligente de brazo robótico industrial sin activación de protocolos de parada de emergencia.', '2026-08-20 17:00:00-05', '2026-08-28 17:00:00-05', '2026-08-12 08:30:00-05', '2026-08-26 18:00:00-05', NULL),

-- Caso 6: Aprendiz 34 (Agroindustria) - Falsificación de firmas en bitácora
(6, 15, 'RAD-2026-CBA-00147', 'RESOLUCION_EMITIDA', 'Falta gravísima tipificada en el Art. 10 Numeral 9 por presunta adulteración de firmas en el registro de control de pasteurización.', '2026-08-13 17:00:00-05', '2026-08-21 17:00:00-05', '2026-08-04 09:00:00-05', '2026-08-26 15:40:00-05', NULL);

SELECT setval('disciplinary_cases_id_seq', (SELECT MAX(id) FROM disciplinary_cases));

-- ============================================================================
-- 5. BLOQUE: SESIONES DE COMITÉ (COMMITTEE_SESSIONS)
-- Total: 6 Sesiones asociadas a los casos disciplinarios
-- Programadas en días hábiles (evitando festivos como el 7 y 17 de Agosto)
-- ============================================================================

INSERT INTO committee_sessions (id, disciplinary_case_id, session_number, scheduled_at, location_or_link, act_summary, act_signature_due_at, status, created_at, updated_at, deleted_at)
VALUES
(1, 1, 'COMITE-CBA-2026-014', '2026-09-02 09:00:00-05', 'https://teams.microsoft.com/l/meetup-join/sena-cba-comite-014', 'Sesión ordinaria del Comité de Evaluación y Seguimiento. Escucha de versión libre de la aprendiz Valentina Morales Peña y análisis de evidencias del equipo ejecutor.', '2026-09-07 17:00:00-05', 'PROGRAMADA', '2026-08-20 10:00:00-05', '2026-08-25 14:20:00-05', NULL),

(2, 2, 'COMITE-CBA-2026-015', '2026-09-04 10:30:00-05', 'https://teams.microsoft.com/l/meetup-join/sena-cba-comite-015', 'Sesión para evaluar reincidencia en faltas técnicas del aprendiz Mateo Alexander Caicedo Pinto.', '2026-09-09 17:00:00-05', 'NOTIFICADA', '2026-08-22 11:30:00-05', '2026-08-22 11:30:00-05', NULL),

(3, 3, 'COMITE-CBA-2026-016', '2026-09-08 14:00:00-05', 'Sala de Juntas 2 - Edificio Administrativo CBA Mosquera', 'Audiencia presencial para valoración de informe de la unidad pecuaria y descargos del aprendiz Nicolás Guzmán.', '2026-09-11 17:00:00-05', 'PROGRAMADA', '2026-08-24 08:30:00-05', '2026-08-24 08:30:00-05', NULL),

(4, 4, 'COMITE-CBA-2026-017', '2026-09-07 09:30:00-05', 'https://teams.microsoft.com/l/meetup-join/sena-cba-comite-017', 'Comité extraordinario por deserción presunta de la aprendiz Camila Andrea Vargas Ruiz.', '2026-09-10 17:00:00-05', 'NOTIFICADA', '2026-08-24 16:50:00-05', '2026-08-24 16:50:00-05', NULL),

(5, 5, 'COMITE-CBA-2026-013', '2026-08-26 14:00:00-05', 'Sala de Conferencias Mecatrónica - CBA Mosquera', 'Sesión concluida. Se valoraron los testimonios de los instructores y del aprendiz Cristian Barreto. Acta redactada y en proceso de suscripción electrónica.', '2026-08-31 17:00:00-05', 'CONCLUIDA', '2026-08-18 09:00:00-05', '2026-08-26 18:00:00-05', NULL),

(6, 6, 'COMITE-CBA-2026-012', '2026-08-20 09:00:00-05', 'Auditorio Principal - CBA Mosquera', 'Comité finalizado con recomendación unánime de Condicionamiento de Matrícula por falta gravísima.', '2026-08-25 17:00:00-05', 'CONCLUIDA', '2026-08-10 08:00:00-05', '2026-08-20 12:00:00-05', NULL);

SELECT setval('committee_sessions_id_seq', (SELECT MAX(id) FROM committee_sessions));

-- ============================================================================
-- 6. BLOQUE: ASISTENTES AL COMITÉ Y FIRMAS ELECTRÓNICAS (COMMITTEE_ATTENDEES)
-- Total: 18 Asistentes (Coordinador, Vocero, Instructores, Aprendices)
-- Con hash OTP SHA-256 en las sesiones concluidas/firmadas
-- ============================================================================

INSERT INTO committee_attendees (id, committee_session_id, user_id, attendee_role, signature_status, otp_token_hash, signed_at, observations, created_at)
VALUES
-- Sesión 1 (Caso 1 - ADSO)
(1, 1, 1, 'Presidente del Comité / Coordinador Académico', 'FIRMADO_OTP', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '2026-08-25 10:15:00-05', 'Convocatoria verificada con quórum reglamentario.', '2026-08-20 10:00:00-05'),
(2, 1, 5, 'Instructor Líder de Ficha', 'PENDIENTE', NULL, NULL, NULL, '2026-08-20 10:00:00-05'),
(3, 1, 15, 'Aprendiz Citada', 'PENDIENTE', NULL, NULL, NULL, '2026-08-20 10:00:00-05'),

-- Sesión 2 (Caso 2 - Redes)
(4, 2, 1, 'Presidente del Comité / Coordinador Académico', 'FIRMADO_OTP', 'a456c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852ba71', '2026-08-22 14:00:00-05', 'Citación remitida por canales oficiales.', '2026-08-22 11:30:00-05'),
(5, 2, 8, 'Instructor del Área Técnica', 'PENDIENTE', NULL, NULL, NULL, '2026-08-22 11:30:00-05'),
(6, 2, 19, 'Aprendiz Citado', 'PENDIENTE', NULL, NULL, NULL, '2026-08-22 11:30:00-05'),

-- Sesión 3 (Caso 3 - Agropecuaria)
(7, 3, 2, 'Representante Comité de Evaluación', 'PENDIENTE', NULL, NULL, NULL, '2026-08-24 08:30:00-05'),
(8, 3, 13, 'Instructor de Producción Pecuaria', 'PENDIENTE', NULL, NULL, NULL, '2026-08-24 08:30:00-05'),
(9, 3, 27, 'Aprendiz Citado', 'PENDIENTE', NULL, NULL, NULL, '2026-08-24 08:30:00-05'),

-- Sesión 4 (Caso 4 - Deserción ADSO)
(10, 4, 1, 'Presidente del Comité / Coordinador Académico', 'PENDIENTE', NULL, NULL, NULL, '2026-08-24 16:50:00-05'),
(11, 4, 6, 'Instructora de Seguimiento', 'PENDIENTE', NULL, NULL, NULL, '2026-08-24 16:50:00-05'),
(12, 4, 18, 'Aprendiz Citada', 'PENDIENTE', NULL, NULL, NULL, '2026-08-24 16:50:00-05'),

-- Sesión 5 (Caso 5 - Mecatrónica - Concluida)
(13, 5, 1, 'Presidente del Comité / Coordinador Académico', 'FIRMADO_OTP', 'c81e728d9d4c2f636f067f89cc14862c1e51a60783139b690211b4d061e262c8', '2026-08-26 16:30:00-05', 'Acta aprobada y firmada electrónicamente.', '2026-08-18 09:00:00-05'),
(14, 5, 14, 'Instructor de Mecatrónica Industrial', 'FIRMADO_OTP', 'eccbc87e4b5ce2fe28308fd9f2a7baf3ff09f5b0a1f0a1c1d2e3f4a5b6c7d8e9', '2026-08-26 16:45:00-05', 'Conforme con los compromisos acordados en el acta.', '2026-08-18 09:00:00-05'),
(15, 5, 30, 'Aprendiz Citado', 'PENDIENTE', NULL, NULL, 'Pendiente de radicación de firma digital.', '2026-08-18 09:00:00-05'),

-- Sesión 6 (Caso 6 - Agroindustria - Firmas completas)
(16, 6, 1, 'Presidente del Comité / Coordinador Académico', 'FIRMADO_OTP', '1679091c5a880faf6fb5e6087eb1b2dc00e234567890abcdef1234567890abcd', '2026-08-20 11:30:00-05', 'Recomendación sancionatoria remitida a Subdirección.', '2026-08-10 08:00:00-05'),
(17, 6, 10, 'Instructora de Inocuidad y Calidad', 'FIRMADO_OTP', '8f14e45fceea167a5a36dedd4bea2543123456789abcdef123456789abcdef12', '2026-08-20 11:45:00-05', 'Dictamen técnico sustentado en debida forma.', '2026-08-10 08:00:00-05'),
(18, 6, 34, 'Aprendiz Imputado', 'FIRMADO_OTP', 'c4ca4238a0b923820dcc509a6f75849b3456789abcdef0123456789abcdef012', '2026-08-20 12:10:00-05', 'Notificado en estrados del resultado del comité.', '2026-08-10 08:00:00-05');

SELECT setval('committee_attendees_id_seq', (SELECT MAX(id) FROM committee_attendees));

-- ============================================================================
-- 7. BLOQUE: ACTOS ADMINISTRATIVOS SANCIONATORIOS (ADMINISTRATIVE_ACTS)
-- ============================================================================

INSERT INTO administrative_acts (id, disciplinary_case_id, act_number, sanction_type, considerations, resolution_due_at, firmness_registered_at, signed_by_user_id, otp_signature_hash, created_at, updated_at, deleted_at)
VALUES
(1, 6, 'RES-2026-089-CBA', 'CONDICIONAMIENTO_MATRICULA', 'Visto el informe unánime del Comité de Evaluación del 20 de Agosto de 2026, y comprobada la adulteración de registros de pasteurización, se impone la sanción de Condicionamiento de Matrícula por seis (6) meses con Plan Formativo Especial de Ética Profesional.', '2026-09-10 17:00:00-05', '2026-08-26 15:40:00-05', 3, '849204a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5', '2026-08-22 09:00:00-05', '2026-08-26 15:40:00-05', NULL);

SELECT setval('administrative_acts_id_seq', (SELECT MAX(id) FROM administrative_acts));

-- ============================================================================
-- 8. BLOQUE: TRAZABILIDAD DE NOTIFICACIONES MULTI-CANAL (NOTIFICATION_LOGS)
-- ============================================================================

INSERT INTO notification_logs (user_id, channel_used, provider_used, external_message_id, delivery_status, payload_sent_encrypted, error_message, created_at)
VALUES
(15, 'EMAIL', 'NODEMAILER', 'msg-smtp-2026-89410', 'DELIVERED', 'Notificación electrónica de citación formal a Comité de Evaluación y Seguimiento RAD-2026-CBA-00142 para el 02/09/2026.', NULL, '2026-08-21 08:30:00-05'),
(15, 'WHATSAPP', 'WABA_OFFICIAL', 'wamid.HBgLNTczMDA1NTUwMjE1FQIAERgSMzQ5', 'READ', 'Recordatorio automático SENA: Su citación a Comité de Evaluación y Seguimiento está agendada para el 02 de Septiembre a las 09:00 AM.', NULL, '2026-08-21 08:35:00-05'),
(15, 'SMS', 'TWILIO_SMS', 'SM4892019482014820481048215', 'DELIVERED', 'SENA CBA: Citación oficial RAD-2026-CBA-00142 disponible en su buzón de correo institucional.', NULL, '2026-08-21 08:31:00-05'),
(19, 'EMAIL', 'NODEMAILER', 'msg-smtp-2026-89411', 'DELIVERED', 'Citación electrónica a Comité de Evaluación Ficha 2834512.', NULL, '2026-08-22 11:35:00-05'),
(19, 'WHATSAPP', 'WABA_OFFICIAL', 'wamid.HBgLNTczMTg1NTUwNjE5FQIAERgSMzUw', 'DELIVERED', 'Notificación formal de debido proceso SENA.', NULL, '2026-08-22 11:36:00-05'),
(30, 'EMAIL', 'NODEMAILER', 'msg-smtp-2026-89412', 'DELIVERED', 'Envío de Acta de Comité COMITE-CBA-2026-013 para firma electrónica OTP.', NULL, '2026-08-26 16:00:00-05'),
(34, 'EMAIL', 'NODEMAILER', 'msg-smtp-2026-89413', 'DELIVERED', 'Notificación formal de Resolución de Condicionamiento de Matrícula RES-2026-089-CBA.', NULL, '2026-08-26 15:45:00-05');

-- ============================================================================
-- 9. BLOQUE: PUNTUACIONES PREDICTIVAS DE DESERCIÓN (PREDICTIVE_SCORES)
-- Total: 16 Evaluaciones IA (XGBoost Classifier Fase 3)
-- Coherencia estricta: risk_score < 0.35 (LOW), 0.35-0.59 (MEDIUM), 0.60-0.74 (HIGH), >=0.75 (CRITICAL)
-- ============================================================================

INSERT INTO predictive_scores (digital_file_id, risk_score, risk_level, contributing_factors, suggested_intervention, evaluated_at)
VALUES
-- Expediente 1 (Valentina Morales - ADSO): CRÍTICO (2 llamados de atención, 1 plan no superado, 24.5% inasistencias)
(1, 0.8840, 'CRITICAL', '{"writtenWarningsCount": 2, "failedImprovementPlans": 1, "percentageUnjustifiedAbsences": 24.5, "daysSinceLastActivity": 3, "historicalSanctionsCount": 0}', 'Activar plan de contingencia pedagógica inmediata con Bienestar al Aprendiz y equipo ejecutor.', '2026-08-27 06:00:00-05'),

-- Expediente 2 (Juan Ospina - ADSO): BAJO (Plan académico cumplido satisfactoriamente)
(2, 0.2210, 'LOW', '{"writtenWarningsCount": 1, "failedImprovementPlans": 0, "percentageUnjustifiedAbsences": 5.0, "daysSinceLastActivity": 1, "historicalSanctionsCount": 0}', 'Ruta académica normalizada tras cumplimiento del plan de pruebas unitarias.', '2026-08-27 06:00:00-05'),

-- Expediente 3 (Santiago Rengifo - ADSO): BAJO (Plan disciplinario cumplido)
(3, 0.1850, 'LOW', '{"writtenWarningsCount": 1, "failedImprovementPlans": 0, "percentageUnjustifiedAbsences": 3.2, "daysSinceLastActivity": 2, "historicalSanctionsCount": 0}', 'Buen desempeño actual. Sin alertas activas de convivencia.', '2026-08-27 06:00:00-05'),

-- Expediente 4 (Camila Vargas - ADSO): ALTO (1 llamado de atención vigente, 18 horas inasistencia)
(4, 0.6920, 'HIGH', '{"writtenWarningsCount": 1, "failedImprovementPlans": 0, "percentageUnjustifiedAbsences": 18.2, "daysSinceLastActivity": 4, "historicalSanctionsCount": 0}', 'Seguimiento por coordinación para verificar justificaciones médicas y evitar declaratoria de deserción.', '2026-08-27 06:00:00-05'),

-- Expediente 5 (Mateo Caicedo - Redes): CRÍTICO (2 llamados vigentes, inasistencia técnica)
(5, 0.8150, 'CRITICAL', '{"writtenWarningsCount": 2, "failedImprovementPlans": 0, "percentageUnjustifiedAbsences": 21.0, "daysSinceLastActivity": 5, "historicalSanctionsCount": 0}', 'Acompañamiento prioritario en laboratorio de redes y sesión preparatoria de comité.', '2026-08-27 06:00:00-05'),

-- Expediente 6 (Laura Montenegro - Redes): MEDIO (1 plan académico abierto)
(6, 0.4650, 'MEDIUM', '{"writtenWarningsCount": 0, "failedImprovementPlans": 0, "percentageUnjustifiedAbsences": 9.5, "daysSinceLastActivity": 2, "historicalSanctionsCount": 0}', 'Monitorear entrega oportuna de la simulación Packet Tracer antes del 04/09/2026.', '2026-08-27 06:00:00-05'),

-- Expediente 7 (Daniel Quintero - Redes): BAJO (Llamado superado)
(7, 0.2400, 'LOW', '{"writtenWarningsCount": 1, "failedImprovementPlans": 0, "percentageUnjustifiedAbsences": 4.1, "daysSinceLastActivity": 1, "historicalSanctionsCount": 0}', 'Seguimiento habitual en aula.', '2026-08-27 06:00:00-05'),

-- Expediente 8 (Sebastián Beltrán - Biotecnología): BAJO (Plan de laboratorio aprobado)
(8, 0.1980, 'LOW', '{"writtenWarningsCount": 1, "failedImprovementPlans": 0, "percentageUnjustifiedAbsences": 3.8, "daysSinceLastActivity": 1, "historicalSanctionsCount": 0}', 'Continuar con el cronograma de micropropagación vegetal.', '2026-08-27 06:00:00-05'),

-- Expediente 9 (Daniela Cifuentes - Biotecnología): MEDIO (1 llamado abierto por EPP)
(9, 0.3850, 'MEDIUM', '{"writtenWarningsCount": 1, "failedImprovementPlans": 0, "percentageUnjustifiedAbsences": 7.2, "daysSinceLastActivity": 2, "historicalSanctionsCount": 0}', 'Verificación de inducción a normas de bioseguridad en laboratorio.', '2026-08-27 06:00:00-05'),

-- Expediente 10 (Nicolás Guzmán - Gestión Agropecuaria): CRÍTICO (2 llamados vigentes, registros incompletos)
(10, 0.7950, 'CRITICAL', '{"writtenWarningsCount": 2, "failedImprovementPlans": 0, "percentageUnjustifiedAbsences": 19.5, "daysSinceLastActivity": 6, "historicalSanctionsCount": 0}', 'Intervención técnica en campo con instructor de producción pecuaria.', '2026-08-27 06:00:00-05'),

-- Expediente 11 (Mariana Cuervo - Gestión Agropecuaria): BAJO (Sin medidas)
(11, 0.1200, 'LOW', '{"writtenWarningsCount": 0, "failedImprovementPlans": 0, "percentageUnjustifiedAbsences": 2.0, "daysSinceLastActivity": 1, "historicalSanctionsCount": 0}', 'Excelente desempeño en el proyecto productivo.', '2026-08-27 06:00:00-05'),

-- Expediente 12 (Cristian Barreto - Mecatrónica): ALTO (Comité concluido, daño en equipo)
(12, 0.7100, 'HIGH', '{"writtenWarningsCount": 1, "failedImprovementPlans": 0, "percentageUnjustifiedAbsences": 14.8, "daysSinceLastActivity": 2, "historicalSanctionsCount": 0}', 'Seguimiento estricto al cumplimiento de horas de mantenimiento y seguridad industrial.', '2026-08-27 06:00:00-05'),

-- Expediente 13 (Paula Veloza - Mecatrónica): BAJO (Sin alertas)
(13, 0.1450, 'LOW', '{"writtenWarningsCount": 0, "failedImprovementPlans": 0, "percentageUnjustifiedAbsences": 1.5, "daysSinceLastActivity": 1, "historicalSanctionsCount": 0}', 'Avance formativo conforme a la planeación curricular.', '2026-08-27 06:00:00-05'),

-- Expediente 14 (Karen Bohórquez - Agroindustria): MEDIO (1 llamado abierto por BPM)
(14, 0.4100, 'MEDIUM', '{"writtenWarningsCount": 1, "failedImprovementPlans": 0, "percentageUnjustifiedAbsences": 8.0, "daysSinceLastActivity": 3, "historicalSanctionsCount": 0}', 'Refuerzo de buenas prácticas de manufactura en planta de lácteos.', '2026-08-27 06:00:00-05'),

-- Expediente 15 (Jhonatan Garzón - Agroindustria): CRÍTICO (Resolución sancionatoria emitida)
(15, 0.9250, 'CRITICAL', '{"writtenWarningsCount": 0, "failedImprovementPlans": 0, "percentageUnjustifiedAbsences": 28.0, "daysSinceLastActivity": 1, "historicalSanctionsCount": 1}', 'Ejecución del plan formativo especial derivado de la sanción de condicionamiento.', '2026-08-27 06:00:00-05'),

-- Expediente 16 (Felipe Salamanca - Biotecnología): BAJO
(16, 0.1600, 'LOW', '{"writtenWarningsCount": 0, "failedImprovementPlans": 0, "percentageUnjustifiedAbsences": 3.0, "daysSinceLastActivity": 1, "historicalSanctionsCount": 0}', 'Progreso regular en fase de análisis.', '2026-08-27 06:00:00-05');

-- ============================================================================
-- 10. BLOQUE: BITÁCORA DE AUDITORÍA FORENSE INMUTABLE (AUDIT_LOGS)
-- Registro de eventos críticos iniciales con hash criptográfico SHA-256
-- ============================================================================

INSERT INTO audit_logs (table_name, action, record_id, old_values, new_values, sha256_hash, executed_by, created_at)
VALUES
('formative_measures', 'INSERT', 1, NULL, '{"id": 1, "measure_type": "FIRST_WRITTEN_WARNING", "digital_file_id": 1, "issuer_id": 5}', '3b8a1c9e8f4d2a1b7c6e5f0d9a8b7c6e5f4d3a2b1c0e9f8a7b6c5d4e3f2a1b0c', 'cruiz@sena.edu.co', '2026-06-01 08:30:00-05'),
('formative_measures', 'INSERT', 2, NULL, '{"id": 2, "measure_type": "SECOND_WRITTEN_WARNING", "digital_file_id": 1, "issuer_id": 6}', '4c9b2d0f9a5e3b2c8d7f6a1e0b9c8d7f6a5e4b3c2d1f0a9b8c7d6e5f4a3b2c1d', 'patricia.gomez@sena.edu.co', '2026-07-10 11:00:00-05'),
('disciplinary_cases', 'INSERT', 1, NULL, '{"id": 1, "radicado_number": "RAD-2026-CBA-00142", "current_status": "SOLICITUD_RADICADA"}', '5d0c3e1a0b6f4c3d9e8a7b2f1c0d9e8a7b6f5c4d3e2a1b0c9d8e7f6a5b4c3d2e', 'andres.cardenas@sena.edu.co', '2026-08-14 09:00:00-05'),
('committee_sessions', 'INSERT', 1, NULL, '{"id": 1, "session_number": "COMITE-CBA-2026-014", "scheduled_at": "2026-09-02 09:00:00-05"}', '6e1d4f2b1c7a5d4e0f9b8c3a2d1e0f9b8c7a6d5e4f3b2c1d0e9f8a7b6c5d4e3f', 'andres.cardenas@sena.edu.co', '2026-08-20 10:00:00-05'),
('committee_attendees', 'UPDATE', 1, '{"signature_status": "PENDIENTE"}', '{"signature_status": "FIRMADO_OTP", "signed_at": "2026-08-25 10:15:00-05"}', '7f2e5a3c2d8b6e5f1a0c9d4b3e2f1a0c9d8b7e6f5a4c3d2e1f0a9b8c7d6e5f4a', 'andres.cardenas@sena.edu.co', '2026-08-25 10:15:00-05'),
('administrative_acts', 'INSERT', 1, NULL, '{"id": 1, "act_number": "RES-2026-089-CBA", "sanction_type": "CONDICIONAMIENTO_MATRICULA"}', '8a3f6b4d3e9c7f6a2b1d0e5c4f3a2b1d0e9c8f7a6b5d4e3f2a1b0c9d8e7f6a5b', 'hernan.velasquez@sena.edu.co', '2026-08-22 09:00:00-05');

-- C. Reestablecer rol de replicación a origen para operación normal de RLS y triggers
SET session_replication_role = 'origin';

-- ============================================================================
-- FIN DEL SCRIPT SEED.SQL
-- ============================================================================
