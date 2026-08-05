// ============================================================================
//  Tiny DOM helpers and the bound-field editors every screen uses.
// ============================================================================
import { update, insert, remove, state, flash } from "./db.js";
import { crewNames } from "./calc.js";

export function h(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === "class") e.className = v;
    else if (k === "html") e.innerHTML = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === "value") e.value = v;
    else if (k === "checked") e.checked = !!v;
    else e.setAttribute(k, v);
  }
  kids.flat().forEach(k => {
    if (k === null || k === undefined || k === false) return;
    e.appendChild(typeof k === "object" ? k : document.createTextNode(String(k)));
  });
  return e;
}

export const frag = (...kids) => { const f = document.createDocumentFragment(); kids.flat().forEach(k => k && f.appendChild(k)); return f; };

/** Text/number input bound to one column of one row. Saves on change. */
export function field(table, row, col, opts = {}) {
  const inp = h("input", {
    class: "f " + (opts.class || ""),
    type: opts.type || "text",
    value: row[col] ?? "",
    placeholder: opts.placeholder || "",
    inputmode: opts.type === "number" ? "decimal" : null,
    step: opts.step || (opts.type === "number" ? "0.01" : null),
    "aria-label": opts.label || col
  });
  inp.addEventListener("change", async () => {
    let v = inp.value;
    if (opts.type === "number") v = v === "" ? null : Number(v);
    if (v === "") v = null;
    await update(table, row[opts.idCol || "id"], { [col]: v }, opts.idCol || "id");
  });
  return inp;
}

/** Dropdown bound to one column. */
export function select(table, row, col, options, opts = {}) {
  const s = h("select", { class: "f " + (opts.class || ""), "aria-label": opts.label || col },
    h("option", { value: "" }, opts.blank || "—"),
    ...options.map(o => h("option", { value: o, selected: (row[col] || "") === o }, o)));
  s.value = row[col] ?? "";
  s.addEventListener("change", () =>
    update(table, row[opts.idCol || "id"], { [col]: s.value || null }, opts.idCol || "id"));
  return s;
}

/** Big tappable checkbox bound to a boolean column. */
export function check(table, row, col, label) {
  const id = "c" + Math.random().toString(36).slice(2);
  const box = h("input", { type: "checkbox", id, checked: !!row[col] });
  box.addEventListener("change", () => update(table, row.id, { [col]: box.checked }));
  return h("label", { class: "chk" }, box, h("span", {}, label || ""));
}

export function personSelect(table, row, col) {
  return select(table, row, col, crewNames(), { blank: "unassigned" });
}

export function delButton(table, row, what) {
  return h("button", { class: "icon danger", title: "Delete", onClick: async () => {
    if (!confirm(`Delete "${what}"? This is for everyone, not just you.`)) return;
    await remove(table, row.id);
    flash("Deleted");
  } }, "×");
}

export function card(title, sub, ...body) {
  return h("section", { class: "card" },
    title ? h("h2", {}, title) : null,
    sub ? h("p", { class: "sub" }, sub) : null,
    ...body);
}

export function stat(label, value, sub, tone) {
  return h("div", { class: "tile" + (tone ? " " + tone : "") },
    h("div", { class: "k" }, label),
    h("div", { class: "v" }, value),
    sub ? h("div", { class: "s" }, sub) : null);
}

export function sectionBar(text) {
  return h("div", { class: "secbar" }, text);
}

export function empty(msg) {
  return h("p", { class: "empty" }, msg);
}

/** Adds a row to a table with sensible defaults, then focuses it. */
export async function addRow(table, row, msg) {
  const ok = await insert(table, row);
  if (ok) flash(msg || "Added");
}

export function nextSort(list) {
  return (list.reduce((a, r) => Math.max(a, r.sort_index || 0), 0) || 0) + 1;
}

export const me = () => state.me?.display_name || null;
