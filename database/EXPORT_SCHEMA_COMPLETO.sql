-- ============================================
-- EXPORT SCHEMA COMPLETO DATABASE PRODUZIONE
-- ============================================
--
-- ESEGUI QUESTO SCRIPT NEL SQL EDITOR DI SUPABASE PRODUZIONE
-- https://supabase.com/dashboard/project/wuvuapmjclahbmngntku/sql
--
-- Copia il risultato e salvalo come "schema_completo.sql"
-- ============================================

-- Ottieni DDL di tutte le tabelle
SELECT
    'CREATE TABLE IF NOT EXISTS ' || schemaname || '.' || tablename || ' (' ||
    string_agg(
        column_name || ' ' || data_type ||
        CASE WHEN character_maximum_length IS NOT NULL
             THEN '(' || character_maximum_length || ')'
             ELSE '' END ||
        CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END ||
        CASE WHEN column_default IS NOT NULL THEN ' DEFAULT ' || column_default ELSE '' END,
        ', '
    ) || ');' as create_table_statement
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name NOT LIKE 'pg_%'
    AND table_name NOT LIKE 'sql_%'
GROUP BY schemaname, tablename
ORDER BY tablename;
