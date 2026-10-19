import { plantStatus, currentEnv, weeklyWater, lastWaterAmounts, milestoneDate, dayNumber } from './logic.js';

// ---------- Icons (Lucide, MIT) ----------
const ICON = {
  droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  flask: '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
  sprout: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
  chart: '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  ruler: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>',
  share: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="m16 6-4-4-4 4"/><path d="M12 2v13"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
  archive: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
};
const icon = (n) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;

// ---------- Fachliche Konstanten ----------
const TYPES = {
  water: { label: 'Gießen', icon: 'droplet' },
  feed: { label: 'Düngen', icon: 'flask' },
  env: { label: 'Umgebung', icon: 'sun' },
  milestone: { label: 'Meilenstein', icon: 'flag' },
  photo: { label: 'Foto', icon: 'camera' },
  note: { label: 'Notiz', icon: 'pencil' },
};
const PARAMS = { light: { label: 'Beleuchtung', unit: '%', icon: 'sun' }, pot: { label: 'Topfgröße', unit: 'l', icon: 'box' }, lamp: { label: 'Lampenabstand', unit: 'cm', icon: 'ruler' } };
const KINDS = { seed: 'Samen gesetzt', germ: 'Gekeimt', veg: 'Vegetation begonnen', flower: 'Blüte begonnen', harvest: 'Geerntet' };
const PLANT_COLORS = ['var(--p1)', 'var(--p2)'];

// ---------- Hilfen ----------
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const pad = (n) => String(n).padStart(2, '0');
const localIso = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
const fmtL = (n) => n.toLocaleString('de-AT', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' l';
const fmtNum = (n) => n == null ? '–' : n.toLocaleString('de-AT', { maximumFractionDigits: 1 });
const fmtDay = (ts) => new Date(ts).toLocaleDateString('de-AT', { weekday: 'short', day: 'numeric', month: 'short' });
const fmtTime = (ts) => new Date(ts).toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' });
const dateKey = (ts) => ts.slice(0, 10);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (sel, root = document) => root.querySelector(sel);
const byTsDesc = (a, b) => a.ts < b.ts ? 1 : -1;

// ---------- Speicher (IndexedDB, zwei Stores) ----------
let db;
function openDb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open('growlog', 1);
    r.onupgradeneeded = () => { r.result.createObjectStore('state'); r.result.createObjectStore('photos'); };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
const tx = (store, mode, fn) => new Promise((res, rej) => {
  const req = fn(db.transaction(store, mode).objectStore(store));
  req.onsuccess = () => res(req.result);
  req.onerror = () => rej(req.error);
});
const dbGet = (store, key) => tx(store, 'readonly', s => s.get(key));
const dbPut = (store, key, val) => tx(store, 'readwrite', s => s.put(val, key));
const dbDel = (store, key) => tx(store, 'readwrite', s => s.delete(key));
const dbClear = (store) => tx(store, 'readwrite', s => s.clear());
const dbKeys = (store) => tx(store, 'readonly', s => s.getAllKeys());

// ---------- Zustand ----------
let S;
const ui = { tab: 'home', sheet: null, runId: null, filterPlant: null, filterType: null, chartWeek: null };
const photoUrls = new Map();

function newRun(names = ['Pflanze 1', 'Pflanze 2'], starts = [{}, {}], twoPlants = true) {
  const run = { id: uid(), startedAt: localIso(), endedAt: null };
  const plants = names.map((name, i) => ({ id: uid(), runId: run.id, name, active: i === 0 || twoPlants, start: { light: null, pot: null, lamp: null, ...starts[i] } }));
  return { run, plants };
}
function initialState() {
  const { run, plants } = newRun();
  return { version: 1, currentRunId: run.id, runs: [run], plants, entries: [] };
}
const save = () => dbPut('state', 'main', S);
const runPlants = (runId = ui.runId) => S.plants.filter(p => p.runId === runId);
const activePlants = (runId = ui.runId) => runPlants(runId).filter(p => p.active);
const runEntries = (runId = ui.runId) => S.entries.filter(e => e.runId === runId);
const plantColor = (p) => PLANT_COLORS[runPlants(p.runId).indexOf(p)] || PLANT_COLORS[0];
const plantName = (id) => S.plants.find(p => p.id === id)?.name ?? '?';
const isCurrent = () => ui.runId === S.currentRunId;

// ---------- Rendering ----------
function render() {
  const view = { home, history, chart, more }[ui.tab]();
  $('#view').innerHTML = view;
  $('#tabs').innerHTML = [['home', 'Heute', 'home'], ['history', 'Verlauf', 'list'], ['chart', 'Grafik', 'chart'], ['more', 'Mehr', 'more']]
    .map(([id, label, ic]) => `<button class="tab ${ui.tab === id ? 'on' : ''}" data-tab="${id}">${icon(ic)}${label}</button>`).join('');
  hydratePhotos();
}

function header(sub) {
  return `<header class="hdr"><h1>Growlog</h1><span>${sub}</span></header>`;
}

function plantCard(p, entries) {
  const s = plantStatus(p, entries);
  const env = [['light', s.env.light], ['pot', s.env.pot], ['lamp', s.env.lamp]].filter(([, v]) => v != null)
    .map(([k, v]) => `<span>${PARAMS[k].label}<b>${fmtNum(v)} ${PARAMS[k].unit}</b></span>`).join('');
  const main = s.stage === 'none'
    ? `<div class="empty">Noch kein Meilenstein. Setze „Samen gesetzt“ oder „Gekeimt“, dann zählt die Karte mit.</div>`
    : `<div class="day">${s.day}<small>${s.stage === 'germ' ? 'Tage seit Keimung' : 'Tage seit Aussaat'}</small></div>
       ${s.flowerDay ? `<div class="flower">Blütetag <b>${s.flowerDay}</b></div>` : ''}`;
  const water = s.lastWater
    ? `<span>Gegossen<b>${s.lastWater.daysAgo === 0 ? 'heute' : s.lastWater.daysAgo === 1 ? 'gestern' : `vor ${s.lastWater.daysAgo} Tagen`}, ${fmtL(s.lastWater.liters)}</b></span>`
    : `<span>Gegossen<b>noch nie</b></span>`;
  return `<article class="plant" style="--pc:${plantColor(p)}"><div class="name">${esc(p.name)}</div>${main}<div class="meta">${water}${env}</div></article>`;
}

function entryTitle(e) {
  const d = e.data;
  switch (e.type) {
    case 'water': return [`${fmtL(d.top + d.bottom)} gegossen`, `${fmtL(d.top)} oben, ${fmtL(d.bottom)} unten${d.feed ? `, mit ${esc(d.feed.product)} ${fmtNum(d.feed.dose)} ml/l` : ''}`];
    case 'feed': return [`Gedüngt mit ${esc(d.product)}`, `${fmtNum(d.dose)} ml/l`];
    case 'env': {
      const from = [...new Set(e.plantIds.map(id => d.from?.[id]).filter(v => v != null))];
      const u = PARAMS[d.param].unit;
      return [`${PARAMS[d.param].label} ${from.length ? from.map(fmtNum).join('/') + ' → ' : ''}${fmtNum(d.to)} ${u}`, ''];
    }
    case 'milestone': return [KINDS[d.kind], ''];
    case 'photo': return ['Foto', ''];
    case 'note': return [esc(e.note), ''];
  }
}
function entryRow(e) {
  const [title, sub] = entryTitle(e);
  const all = activePlants(e.runId).length;
  const who = e.plantIds.length >= all && all > 1 ? 'beide' : e.plantIds.map(plantName).map(esc).join(', ');
  const note = e.type !== 'note' && e.note ? esc(e.note) : '';
  const subline = [sub, who, note].filter(Boolean).join(' · ');
  const ic = e.type === 'photo' ? `<img data-photo="${e.data.photoId}" alt="">` : icon(TYPES[e.type].icon);
  return `<button class="row" data-entry="${e.id}"><span class="ic">${ic}</span><span class="t">${title}<small>${subline}</small></span><time>${fmtTime(e.ts)}</time></button>`;
}

function home() {
  const entries = runEntries();
  const plants = activePlants();
  const last = [...entries].sort(byTsDesc).slice(0, 5);
  return `${header(new Date().toLocaleDateString('de-AT', { weekday: 'long', day: 'numeric', month: 'long' }))}
    <section class="plants">${plants.map(p => plantCard(p, entries)).join('')}</section>
    <section class="acts">${Object.entries(TYPES).map(([t, v], i) => `<button class="act ${i === 0 ? 'primary' : ''}" data-new="${t}">${icon(v.icon)}${v.label}</button>`).join('')}</section>
    <h2>Zuletzt</h2>
    <section class="feed">${last.length ? last.map(e => `<div class="day-h">${fmtDay(e.ts)}</div>${entryRow(e)}`).join('') : '<div class="nothing">Noch keine Einträge. Tippe oben auf eine Aktion.</div>'}</section>`;
}

function history() {
  const runs = [...S.runs].sort((a, b) => a.startedAt < b.startedAt ? 1 : -1);
  const runSel = runs.length > 1 ? `<select data-run="1">${runs.map(r => `<option value="${r.id}" ${r.id === ui.runId ? 'selected' : ''}>${r.endedAt ? `Durchgang ${fmtDay(r.startedAt)} bis ${fmtDay(r.endedAt)}` : 'Aktueller Durchgang'}</option>`).join('')}</select>` : '';
  const plants = runPlants();
  const chips = `<div class="chips">
    ${plants.length > 1 ? plants.map(p => `<button class="chip ${ui.filterPlant === p.id ? 'on' : ''}" data-fplant="${p.id}" style="--pc:${plantColor(p)}"><span class="dot"></span>${esc(p.name)}</button>`).join('') : ''}
    ${Object.entries(TYPES).map(([t, v]) => `<button class="chip ${ui.filterType === t ? 'on' : ''}" data-ftype="${t}">${v.label}</button>`).join('')}</div>`;
  let entries = runEntries().sort(byTsDesc);
  if (ui.filterPlant) entries = entries.filter(e => e.plantIds.includes(ui.filterPlant));
  if (ui.filterType) entries = entries.filter(e => e.type === ui.filterType);
  let lastDay = '', out = '';
  for (const e of entries) {
    const k = dateKey(e.ts);
    if (k !== lastDay) { out += `<div class="day-h">${fmtDay(e.ts)}</div>`; lastDay = k; }
    out += entryRow(e);
  }
  return `${header(`${entries.length} Einträge`)}${runSel ? `<div class="field" style="border:0">${runSel}</div>` : ''}${chips}
    <section class="feed">${out || '<div class="nothing">Keine Einträge für diese Auswahl.</div>'}</section>`;
}

function chart() {
  const plants = activePlants();
  const entries = runEntries();
  const weeks = plants.map(p => weeklyWater(entries, p.id, 12));
  const max = Math.max(1, ...weeks.flat().map(w => w.top + w.bottom));
  const W = 360, H = 190, L = 30, B = 24, T = 10;
  const slot = (W - L) / 12, bw = Math.min(14, (slot - 6) / plants.length);
  const y = (v) => T + (H - B - T) * (1 - v / max);
  const step = max > 8 ? 4 : max > 4 ? 2 : max > 2 ? 1 : 0.5;
  let grid = '';
  for (let v = 0; v <= max; v += step) grid += `<line class="grid" x1="${L}" x2="${W}" y1="${y(v)}" y2="${y(v)}"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end">${fmtNum(v)}</text>`;
  let bars = '';
  weeks.forEach((ws, pi) => ws.forEach((w, wi) => {
    const x = L + wi * slot + (slot - bw * plants.length - 2 * (plants.length - 1)) / 2 + pi * (bw + 2);
    const c = plantColor(plants[pi]);
    const sel = ui.chartWeek === wi ? 'opacity:1' : ui.chartWeek == null ? '' : 'opacity:.4';
    if (w.bottom) bars += `<rect class="bar" data-week="${wi}" x="${x}" y="${y(w.bottom)}" width="${bw}" height="${y(0) - y(w.bottom)}" fill="${c}" opacity=".45" style="${sel}"/>`;
    if (w.top) bars += `<rect class="bar" data-week="${wi}" x="${x}" y="${y(w.top + w.bottom)}" width="${bw}" height="${Math.max(0, y(w.bottom) - y(w.top + w.bottom) - (w.bottom ? 2 : 0))}" rx="3" fill="${c}" style="${sel}"/>`;
    if (pi === 0 && wi % 2 === 1) bars += `<text x="${L + wi * slot + slot / 2}" y="${H - 6}" text-anchor="middle">${w.weekStart.slice(8)}.${w.weekStart.slice(5, 7)}.</text>`;
  }));
  const wi = ui.chartWeek;
  const readout = wi == null ? 'Tippe auf einen Balken für die Zahlen.' :
    `Woche ab ${fmtDay(weeks[0][wi].weekStart)}: ` + plants.map((p, pi) => `${esc(p.name)} ${fmtL(weeks[pi][wi].top + weeks[pi][wi].bottom)} (${fmtL(weeks[pi][wi].top)} oben, ${fmtL(weeks[pi][wi].bottom)} unten)`).join(', ');
  const legend = `<div class="legend">${plants.map(p => `<span style="--pc:${plantColor(p)}"><i></i>${esc(p.name)}</span>`).join('')}<span style="--pc:var(--muted)"><i></i>oben</span><span style="--pc:var(--muted)"><i class="lo"></i>unten</span></div>`;

  // Meilensteine je Pflanze
  const rows = plants.map(p => ({ p, ms: Object.keys(KINDS).map(k => [k, milestoneDate(p, entries, k)]).filter(([, ts]) => ts) })).filter(r => r.ms.length);
  const tl = rows.map(({ p, ms }) => `<div class="card" style="--pc:${plantColor(p)}"><b>${esc(p.name)}</b>${ms.map(([k, ts]) => `<div class="field"><span>${KINDS[k]}</span><span>${fmtDay(ts)} · Tag ${dayNumber(ts)}</span></div>`).join('')}</div>`).join('');

  return `${header('Liter pro Woche')}
    <div class="card"><svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gießmenge pro Woche">${grid}${bars}</svg>${legend}<div class="readout">${readout}</div></div>
    ${tl ? `<h2>Meilensteine</h2>${tl}` : ''}`;
}

function more() {
  const plants = runPlants(S.currentRunId);
  const p2 = plants[1];
  const startFields = (p) => Object.entries(PARAMS).map(([k, v]) =>
    `<div class="field"><label>${v.label}</label><input type="number" inputmode="decimal" step="any" data-start="${k}" data-plant="${p.id}" value="${p.start[k] ?? ''}" placeholder="${v.unit}"></div>`).join('');
  const plantCard = (p) => `<div class="card" style="--pc:${plantColor(p)}">
      <div class="field"><label>Name</label><input data-name="${p.id}" value="${esc(p.name)}" maxlength="24"></div>${startFields(p)}</div>`;
  return `${header('Einstellungen')}
    <h2>Pflanzen</h2>
    ${plantCard(plants[0])}
    <div class="card"><div class="field"><span>Zweite Pflanze</span><label class="switch"><input type="checkbox" data-toggle2 ${p2?.active ? 'checked' : ''}></label></div></div>
    ${p2?.active ? plantCard(p2) : ''}
    <p class="hint">Die Werte oben sind die Startwerte. Spätere Änderungen hältst du mit der Aktion „Umgebung“ fest.</p>
    <h2>Durchgang</h2>
    <div class="card"><button class="btn ghost" data-finish>${icon('archive')} Durchgang abschließen</button>
    <p class="hint">Archiviert alle Einträge und beginnt einen neuen Durchgang mit denselben Pflanzen. Alte Durchgänge bleiben im Verlauf lesbar.</p></div>
    <h2>Sicherung</h2>
    <div class="card">
      <button class="btn ghost" data-export>${icon('share')} Sicherung exportieren</button>
      <label class="btn ghost file" style="padding:14px">${icon('upload')} Sicherung importieren<input type="file" accept=".json,application/json" data-import></label>
      <p class="hint">Der Export enthält alle Durchgänge, Einträge und Fotos als eine Datei. Lege sie in iCloud Drive ab. Ein Import ersetzt alle Daten in der App.</p>
    </div>
    <h2>Installation</h2>
    <p class="hint">In Safari auf <b>Teilen</b> und dann <b>Zum Home-Bildschirm</b> tippen. Die App läuft danach auch offline.</p>`;
}

// Fotos nach dem Rendern nachladen
async function hydratePhotos() {
  for (const img of document.querySelectorAll('img[data-photo]:not([src])')) {
    const id = img.dataset.photo;
    if (!photoUrls.has(id)) {
      const blob = await dbGet('photos', id);
      if (!blob) continue;
      photoUrls.set(id, URL.createObjectURL(blob));
    }
    img.src = photoUrls.get(id);
  }
}

// ---------- Sheets ----------
function openSheet(type, entry = null) {
  ui.sheet = { type, entry };
  const plants = activePlants();
  const sel = entry ? entry.plantIds : plants.map(p => p.id);
  const chips = plants.length > 1 ? `<div class="chips">${plants.map(p => `<label class="chip" style="--pc:${plantColor(p)}"><input type="checkbox" name="plant" value="${p.id}" ${sel.includes(p.id) ? 'checked' : ''}><span class="dot"></span>${esc(p.name)}</label>`).join('')}</div>` : '';
  const d = entry?.data ?? {};
  let body = '';
  if (type === 'water') {
    const last = entry ? d : (lastWaterAmounts(runEntries()) ?? { top: 1, bottom: 0 });
    const stepper = (name, val) => `<div class="stepper"><button type="button" data-step="-0.1" data-for="${name}">−</button><input type="number" name="${name}" value="${(+val).toFixed(1)}" step="0.1" min="0" inputmode="decimal"><button type="button" data-step="0.1" data-for="${name}">+</button></div>`;
    const products = [...new Set(S.entries.flatMap(e => [e.data.feed?.product, e.type === 'feed' ? e.data.product : null]).filter(Boolean))];
    body = `<div class="field"><label>Von oben</label>${stepper('top', last.top)}</div>
      <div class="field"><label>Von unten</label>${stepper('bottom', last.bottom)}</div>
      <div class="field"><span>Gesamt</span><span class="total" id="total">${fmtL(last.top + last.bottom)}</span></div>
      <details ${d.feed ? 'open' : ''}><summary>Mit Dünger</summary>
        <div class="field"><label>Produkt</label><input name="product" list="products" value="${esc(d.feed?.product ?? '')}" placeholder="Name"><datalist id="products">${products.map(p => `<option value="${esc(p)}">`).join('')}</datalist></div>
        <div class="field"><label>Dosis</label><input name="dose" type="number" step="any" inputmode="decimal" value="${d.feed?.dose ?? ''}" placeholder="ml/l"></div>
      </details>`;
  } else if (type === 'feed') {
    const products = [...new Set(S.entries.flatMap(e => [e.data.feed?.product, e.type === 'feed' ? e.data.product : null]).filter(Boolean))];
    body = `<div class="field"><label>Produkt</label><input name="product" list="products" value="${esc(d.product ?? '')}" placeholder="Name" required><datalist id="products">${products.map(p => `<option value="${esc(p)}">`).join('')}</datalist></div>
      <div class="field"><label>Dosis</label><input name="dose" type="number" step="any" inputmode="decimal" value="${d.dose ?? ''}" placeholder="ml/l" required></div>`;
  } else if (type === 'env') {
    body = `<div class="field"><label>Was</label><select name="param">${Object.entries(PARAMS).map(([k, v]) => `<option value="${k}" ${d.param === k ? 'selected' : ''}>${v.label}</option>`).join('')}</select></div>
      <div class="field"><span>Bisher</span><span class="from" id="from"></span></div>
      <div class="field"><label>Neu</label><input name="to" type="number" step="any" inputmode="decimal" value="${d.to ?? ''}" required></div>`;
  } else if (type === 'milestone') {
    body = `<div class="chips">${Object.entries(KINDS).map(([k, v]) => `<label class="chip"><input type="radio" name="kind" value="${k}" ${d.kind === k ? 'checked' : ''} required>${v}</label>`).join('')}</div>`;
  } else if (type === 'photo') {
    body = entry ? `<img data-photo="${d.photoId}" alt="" style="width:100%;border-radius:12px">`
      : `<label class="file" id="filebox">${icon('camera')}<br>Foto aufnehmen oder auswählen<input type="file" name="photo" accept="image/*" required></label>`;
  }
  const noteField = `<div class="field col"><label>${type === 'note' ? 'Notiz' : 'Notiz (optional)'}</label><textarea name="note" rows="${type === 'note' ? 4 : 2}" ${type === 'note' ? 'required' : ''}>${esc(entry?.note ?? '')}</textarea></div>`;
  $('#sheet').innerHTML = `<div class="grip"></div><button class="close" data-close aria-label="Schließen">${icon('x')}</button>
    <h2>${icon(TYPES[type].icon)}${TYPES[type].label}</h2>
    <form id="form">${chips}${body}${noteField}
      <div class="field"><label>Zeitpunkt</label><input type="datetime-local" name="ts" value="${entry?.ts ?? localIso()}" required></div>
      <button class="btn" type="submit">${entry ? 'Änderungen speichern' : 'Speichern'}</button>
      ${entry ? `<button class="btn danger" type="button" data-delete>${icon('trash')} Eintrag löschen</button>` : ''}
    </form>`;
  document.body.classList.add('sheet-open');
  refreshEnvFrom();
  hydratePhotos();
}
function closeSheet() { ui.sheet = null; document.body.classList.remove('sheet-open'); }

function selectedPlantIds(form) {
  const ids = [...form.querySelectorAll('input[name=plant]:checked')].map(i => i.value);
  return ids.length ? ids : activePlants().map(p => p.id);
}
function refreshEnvFrom() {
  const form = $('#form'); const el = $('#from');
  if (!form || !el) return;
  const param = form.param.value;
  const stored = ui.sheet.entry?.data.from;
  const vals = selectedPlantIds(form).map(id => {
    const p = S.plants.find(p => p.id === id);
    const v = stored ? stored[id] : currentEnv(p, runEntries())[param];
    return `${activePlants().length > 1 ? esc(p.name) + ' ' : ''}${fmtNum(v)} ${PARAMS[param].unit}`;
  });
  el.textContent = vals.join(', ');
}

async function resizeImage(file) {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise(res => c.toBlob(res, 'image/jpeg', 0.82));
}

async function submitSheet(form) {
  const { type, entry } = ui.sheet;
  const f = new FormData(form);
  const num = (k) => parseFloat(String(f.get(k)).replace(',', '.'));
  const plantIds = selectedPlantIds(form);
  let data = {};
  if (type === 'water') {
    const product = String(f.get('product') ?? '').trim();
    data = { top: num('top') || 0, bottom: num('bottom') || 0, feed: product ? { product, dose: num('dose') || 0 } : null };
  } else if (type === 'feed') data = { product: String(f.get('product')).trim(), dose: num('dose') };
  else if (type === 'env') {
    const param = f.get('param');
    const from = entry?.data.from ?? Object.fromEntries(plantIds.map(id => [id, currentEnv(S.plants.find(p => p.id === id), runEntries())[param]]));
    data = { param, to: num('to'), from };
  } else if (type === 'milestone') {
    const kind = f.get('kind');
    const dupes = runEntries().filter(e => e.type === 'milestone' && e.data.kind === kind && e.id !== entry?.id && e.plantIds.some(id => plantIds.includes(id)));
    if (dupes.length && !confirm(`„${KINDS[kind]}“ ist schon eingetragen. Datum überschreiben?`)) return;
    for (const dupe of dupes) {
      dupe.plantIds = dupe.plantIds.filter(id => !plantIds.includes(id));
      if (!dupe.plantIds.length) S.entries = S.entries.filter(e => e !== dupe);
    }
    data = { kind };
  } else if (type === 'photo') {
    if (entry) data = entry.data;
    else {
      const file = f.get('photo');
      if (!file?.size) return;
      const blob = await resizeImage(file);
      data = { photoId: uid() };
      await dbPut('photos', data.photoId, blob);
    }
  }
  const note = String(f.get('note') ?? '').trim() || null;
  const ts = String(f.get('ts')).slice(0, 16);
  if (entry) Object.assign(entry, { ts, plantIds, data, note });
  else S.entries.push({ id: uid(), runId: S.currentRunId, ts, plantIds, type, data, note });
  await save();
  closeSheet();
  render();
  toast(entry ? 'Gespeichert' : `${TYPES[type].label} gespeichert`);
}

async function deleteEntry(entry) {
  if (!confirm('Eintrag wirklich löschen?')) return;
  S.entries = S.entries.filter(e => e !== entry);
  if (entry.type === 'photo') await dbDel('photos', entry.data.photoId);
  await save(); closeSheet(); render(); toast('Gelöscht');
}

// ---------- Mehr: Durchgang, Export, Import ----------
async function finishRun() {
  if (!confirm('Durchgang abschließen? Alle Einträge werden archiviert und ein neuer Durchgang beginnt.')) return;
  const old = runPlants(S.currentRunId);
  const entries = runEntries(S.currentRunId);
  S.runs.find(r => r.id === S.currentRunId).endedAt = localIso();
  const { run, plants } = newRun(old.map(p => p.name), old.map(p => currentEnv(p, entries)), old[1]?.active ?? false);
  S.runs.push(run); S.plants.push(...plants); S.currentRunId = run.id; ui.runId = run.id;
  await save(); render(); toast('Neuer Durchgang gestartet');
}

const blobToDataUrl = (blob) => new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(blob); });
async function exportBackup() {
  const photos = {};
  for (const id of await dbKeys('photos')) photos[id] = await blobToDataUrl(await dbGet('photos', id));
  const json = JSON.stringify({ app: 'growlog', version: 1, exportedAt: localIso(), state: S, photos });
  const name = `growlog-${localIso().slice(0, 10)}.json`;
  const file = new File([json], name, { type: 'application/json' });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: 'Growlog-Sicherung' }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(file), download: name });
  a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
async function importBackup(file) {
  let data;
  try { data = JSON.parse(await file.text()); } catch { alert('Die Datei ist keine gültige Sicherung.'); return; }
  if (data?.app !== 'growlog' || !Array.isArray(data.state?.entries) || !Array.isArray(data.state?.plants)) { alert('Die Datei ist keine gültige Growlog-Sicherung.'); return; }
  if (!confirm(`Sicherung vom ${fmtDay(data.exportedAt)} importieren? Alle aktuellen Daten werden ersetzt.`)) return;
  await dbClear('photos');
  for (const [id, url] of Object.entries(data.photos ?? {})) await dbPut('photos', id, await (await fetch(url)).blob());
  S = data.state; await save(); location.reload();
}

function toast(msg) {
  document.querySelector('.toast')?.remove();
  const t = Object.assign(document.createElement('div'), { className: 'toast', textContent: msg });
  document.body.append(t); setTimeout(() => t.remove(), 2500);
}

// ---------- Ereignisse (eine Delegation für alles) ----------
document.addEventListener('click', async (ev) => {
  const t = ev.target.closest('[data-tab],[data-new],[data-entry],[data-close],[data-delete],[data-step],[data-fplant],[data-ftype],[data-week],[data-finish],[data-export],.scrim,.lightbox,img[data-photo]');
  if (!t) return;
  const d = t.dataset;
  if (d.tab) { ui.tab = d.tab; ui.chartWeek = null; render(); }
  else if (d.new) { if (!isCurrent()) { ui.runId = S.currentRunId; render(); } openSheet(d.new); }
  else if (d.entry) { if (!isCurrent()) return toast('Archivierte Durchgänge sind nur lesbar'); const e = S.entries.find(e => e.id === d.entry); openSheet(e.type, e); }
  else if (t.matches('[data-close],.scrim')) closeSheet();
  else if (d.delete != null) deleteEntry(ui.sheet.entry);
  else if (d.step) {
    const inp = $('#form')[d.for];
    inp.value = Math.max(0, Math.round((parseFloat(inp.value || 0) + parseFloat(d.step)) * 10) / 10).toFixed(1);
    $('#total').textContent = fmtL((+$('#form').top.value || 0) + (+$('#form').bottom.value || 0));
  }
  else if (d.fplant) { ui.filterPlant = ui.filterPlant === d.fplant ? null : d.fplant; render(); }
  else if (d.ftype) { ui.filterType = ui.filterType === d.ftype ? null : d.ftype; render(); }
  else if (d.week) { ui.chartWeek = ui.chartWeek === +d.week ? null : +d.week; render(); }
  else if (d.finish != null) finishRun();
  else if (d.export != null) exportBackup();
  else if (t.matches('.lightbox')) t.remove();
  else if (t.matches('img[data-photo]') && !t.closest('.row') && !t.closest('.sheet')) { /* nichts */ }
});
document.addEventListener('dblclick', (ev) => {
  const img = ev.target.closest('.sheet img[data-photo]');
  if (img) document.body.insertAdjacentHTML('beforeend', `<div class="lightbox"><img src="${img.src}" alt=""></div>`);
});
document.addEventListener('submit', (ev) => { if (ev.target.id === 'form') { ev.preventDefault(); submitSheet(ev.target); } });
document.addEventListener('input', (ev) => {
  const t = ev.target, form = $('#form');
  if (form && (t.name === 'top' || t.name === 'bottom')) $('#total').textContent = fmtL((+form.top.value || 0) + (+form.bottom.value || 0));
});
document.addEventListener('change', async (ev) => {
  const t = ev.target, d = t.dataset;
  if (t.name === 'param' || t.name === 'plant') refreshEnvFrom();
  else if (t.name === 'photo' && t.files[0]) { const box = $('#filebox'); box.insertAdjacentHTML('afterbegin', `<img src="${URL.createObjectURL(t.files[0])}" alt="">`); box.querySelector('svg')?.remove(); }
  else if (d.run) { ui.runId = t.value; ui.filterPlant = null; render(); }
  else if (d.name) { S.plants.find(p => p.id === d.name).name = t.value.trim() || 'Pflanze'; await save(); }
  else if (d.start) { const p = S.plants.find(p => p.id === d.plant); p.start[d.start] = t.value === '' ? null : parseFloat(t.value); await save(); }
  else if (d.toggle2 != null) { runPlants(S.currentRunId)[1].active = t.checked; await save(); render(); }
  else if (d.import != null && t.files[0]) importBackup(t.files[0]);
});
document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { closeSheet(); document.querySelector('.lightbox')?.remove(); } });
// Foto im Verlauf: Tipp auf das Vorschaubild öffnet Vollbild statt des Bearbeiten-Sheets
document.addEventListener('click', (ev) => {
  const img = ev.target.closest('.row img[data-photo]');
  if (img) { ev.stopImmediatePropagation(); document.body.insertAdjacentHTML('beforeend', `<div class="lightbox"><img src="${img.src}" alt=""></div>`); }
}, true);

// ---------- Start ----------
(async () => {
  db = await openDb();
  S = (await dbGet('state', 'main')) ?? initialState();
  if (!(await dbGet('state', 'main'))) await save();
  ui.runId = S.currentRunId;
  render();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
