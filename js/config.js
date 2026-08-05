// ============================================================================
//  EDIT THIS FILE, THEN NOTHING ELSE.
//  Supabase → Project Settings → Data API → Project URL and the "anon public" key.
//  The anon key is designed to be public. Security lives in the row-level
//  security policies in supabase/schema.sql, not in hiding this string.
// ============================================================================

// The bare project URL — no /rest/v1/ on the end. supabase-js appends its own
// paths, so a REST endpoint pasted from the Data API page becomes
// .../rest/v1//rest/v1/... and every single request 404s.
export const SUPABASE_URL = "https://feebuqpqeqdimxixvftv.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_QoRzuyeQvQc-33TQvTe_wA_2UrrHBci";

// The year the app opens on. Bump this every August.
export const CURRENT_YEAR = 2026;
