// ============================================================================
//  Data layer. Talks to Supabase when it is configured; falls back to an
//  in-memory demo dataset while js/config.js still has the placeholder URL,
//  so the site is clickable before you have a backend.
// ============================================================================
import { SUPABASE_URL, SUPABASE_ANON_KEY, CURRENT_YEAR } from "./config.js";

export const YEAR = CURRENT_YEAR;

// Demo mode: no backend, no sign-in, the demo dataset in js/demo.js. It turns
// itself on while config.js is still unfilled, and ?demo on the URL forces it
// on afterwards — for working on the site without going through the door, and
// for showing it to someone who isn't on the crew list.
export const DEMO = SUPABASE_URL.includes("YOUR-PROJECT-REF") ||
                    SUPABASE_ANON_KEY.includes("YOUR-ANON") ||
                    new URLSearchParams(location.search).has("demo");

export let sb = null;
if (!DEMO) {
  const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.45.4");
  sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
}

// ---------------------------------------------------------------- the cache
export const state = {
  session: null,
  me: null,
  members: [], settings: null, items: [], expenses: [], bushels: [], jars: [],
  runsheet: [], menu: [], grappa: [], history: [], photos: [],
  online: false, error: null, ui: {}
};

const listeners = new Set();
export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function emit() { listeners.forEach(fn => fn()); }

const KEY = {
  members: "members", app_settings: "settings", items: "items", expenses: "expenses",
  bushels: "bushels", jar_inventory: "jars", runsheet: "runsheet", menu: "menu",
  grappa: "grappa", history: "history", photos: "photos"
};
const TABLES = [
  ["members",       q => q.order("sort_index")],
  ["app_settings",  q => q.eq("year", YEAR)],
  ["items",         q => q.eq("year", YEAR).order("sort_index")],
  ["expenses",      q => q.eq("year", YEAR).order("created_at", { ascending: false })],
  ["bushels",       q => q.eq("year", YEAR)],
  ["jar_inventory", q => q.eq("year", YEAR)],
  ["runsheet",      q => q.eq("year", YEAR).order("sort_index")],
  ["menu",          q => q.eq("year", YEAR).order("sort_index")],
  ["grappa",        q => q.order("year")],
  ["history",       q => q.order("year")],
  // the photobook spans every year, so no year filter here
  ["photos",        q => q.order("year", { ascending: false }).order("sort_index")]
];

// ---------------------------------------------------------------- demo store
const demo = DEMO
  ? JSON.parse(JSON.stringify((await import("./demo.js")).DEMO_DATA))
  : null;
let demoSeq = 9000;
const demoId = () => "demo-" + (++demoSeq);

function pushDemo() {
  state.members = demo.members;
  state.settings = demo.app_settings[0];
  state.items = [...demo.items].sort((a, b) => a.sort_index - b.sort_index);
  state.expenses = [...demo.expenses].sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
  state.bushels = demo.bushels;
  state.jars = demo.jar_inventory;
  state.runsheet = [...demo.runsheet].sort((a, b) => a.sort_index - b.sort_index);
  state.menu = [...demo.menu].sort((a, b) => a.sort_index - b.sort_index);
  state.grappa = [...demo.grappa].sort((a, b) => a.year - b.year);
  state.history = [...demo.history].sort((a, b) => a.year - b.year);
  state.photos = [...(demo.photos || [])]
    .sort((a, b) => (b.year - a.year) || (a.sort_index - b.sort_index));
  state.online = true;
  emit();
}

// ---------------------------------------------------------------- auth
export async function sendCode(email) {
  if (DEMO) return;
  const { error } = await sb.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: { shouldCreateUser: true, emailRedirectTo: window.location.href }
  });
  if (error) throw error;
}

// The way in that needs no email at all: the account is created in the Supabase
// dashboard with a password, and this hands back a real session carrying the
// address, so is_member() in schema.sql is satisfied exactly as it is by a code.
export async function signInWithPassword(email, password) {
  if (DEMO) return null;
  const { data, error } = await sb.auth.signInWithPassword({
    email: email.trim().toLowerCase(), password
  });
  if (error) throw error;
  return data.session;
}

export async function verifyCode(email, token) {
  if (DEMO) return null;
  const { data, error } = await sb.auth.verifyOtp({
    email: email.trim().toLowerCase(), token: token.trim(), type: "email"
  });
  if (error) throw error;
  return data.session;
}

export async function signOut() {
  if (DEMO) { location.reload(); return; }
  await sb.auth.signOut();
  state.session = null; state.me = null;
  emit();
}

export async function currentSession() {
  if (DEMO) {
    state.session = { user: { email: demo.members[0].email } };
    return state.session;
  }
  const { data } = await sb.auth.getSession();
  state.session = data.session;
  return state.session;
}

// ---------------------------------------------------------------- loading
export async function loadAll() {
  if (DEMO) {
    pushDemo();
    state.me = demo.members[0];
    return;
  }
  const results = await Promise.all(TABLES.map(([t, shape]) =>
    shape(sb.from(t).select("*")).then(r => [t, r])));
  for (const [t, r] of results) {
    if (r.error) { state.error = r.error.message; continue; }
    if (t === "app_settings") state.settings = r.data[0] || null;
    else state[KEY[t]] = r.data || [];
  }
  const email = (state.session?.user?.email || "").toLowerCase();
  state.me = state.members.find(m => m.email.toLowerCase() === email) || null;
  state.online = true;
  emit();
}

export async function reloadTable(table) {
  if (DEMO) { pushDemo(); return; }
  const entry = TABLES.find(([t]) => t === table);
  if (!entry) return;
  const r = await entry[1](sb.from(table).select("*"));
  if (r.error) return;
  if (table === "app_settings") state.settings = r.data[0] || null;
  else state[KEY[table]] = r.data || [];
  emit();
}

// ---------------------------------------------------------------- realtime
let channel = null;
export function startRealtime() {
  if (DEMO || channel) return;
  channel = sb.channel("sauce-day");
  Object.keys(KEY).forEach(t =>
    channel.on("postgres_changes", { event: "*", schema: "public", table: t },
      () => reloadTable(t)));
  channel.subscribe();
}

// ---------------------------------------------------------------- writes
const stamp = patch => ({ ...patch, updated_by: state.session?.user?.email || null });

export async function update(table, id, patch, idCol = "id") {
  if (DEMO) {
    const row = demo[table].find(r => String(r[idCol]) === String(id));
    if (row) Object.assign(row, patch);
    pushDemo();
    return true;
  }
  const { error } = await sb.from(table).update(stamp(patch)).eq(idCol, id);
  if (error) { flash(error.message, true); return false; }
  await reloadTable(table);
  return true;
}

export async function insert(table, row) {
  if (DEMO) {
    demo[table].push({ id: demoId(), year: YEAR, created_at: new Date().toISOString(), ...row });
    pushDemo();
    return true;
  }
  const { error } = await sb.from(table).insert({ year: YEAR, ...stamp(row) });
  if (error) { flash(error.message, true); return false; }
  await reloadTable(table);
  return true;
}

export async function remove(table, id, idCol = "id") {
  if (DEMO) {
    demo[table] = demo[table].filter(r => String(r[idCol]) !== String(id));
    pushDemo();
    return true;
  }
  const { error } = await sb.from(table).delete().eq(idCol, id);
  if (error) { flash(error.message, true); return false; }
  await reloadTable(table);
  return true;
}

export async function upsert(table, row, conflict) {
  if (DEMO) {
    const keys = conflict.split(",");
    const hit = demo[table].find(r => keys.every(k => String(r[k]) === String(row[k] ?? YEAR)));
    if (hit) Object.assign(hit, row);
    else demo[table].push({ id: demoId(), year: YEAR, ...row });
    pushDemo();
    return true;
  }
  const { error } = await sb.from(table)
    .upsert({ year: YEAR, ...stamp(row) }, { onConflict: conflict });
  if (error) { flash(error.message, true); return false; }
  await reloadTable(table);
  return true;
}

// ---------------------------------------------------------------- toast
export function flash(msg, bad = false) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.className = "toast show" + (bad ? " bad" : "");
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.className = "toast"; }, bad ? 5200 : 2400);
}
