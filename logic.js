// Reine Funktionen ohne DOM. Alle Zeiten als ISO-Strings in lokaler Zeit.

const DAY = 86400000;
const localMidnight = (d) => { d = new Date(d); d.setHours(0, 0, 0, 0); return d; };
const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const forPlant = (entries, type, plantId) =>
  entries.filter(x => x.type === type && x.plantIds.includes(plantId)).sort((a, b) => a.ts < b.ts ? -1 : 1);

export function dayNumber(startTs, now = new Date()) {
  return Math.round((localMidnight(now) - localMidnight(startTs)) / DAY) + 1;
}

export function milestoneDate(plant, entries, kind) {
  const m = forPlant(entries, 'milestone', plant.id).filter(x => x.data.kind === kind).pop();
  return m ? m.ts : null;
}

export function currentEnv(plant, entries) {
  const env = { ...plant.start };
  for (const x of forPlant(entries, 'env', plant.id)) env[x.data.param] = x.data.to;
  return env;
}

export function plantStatus(plant, entries, now = new Date()) {
  const germ = milestoneDate(plant, entries, 'germ');
  const seed = milestoneDate(plant, entries, 'seed');
  const flower = milestoneDate(plant, entries, 'flower');
  const last = forPlant(entries, 'water', plant.id).pop();
  return {
    stage: germ ? 'germ' : seed ? 'seed' : 'none',
    day: germ || seed ? dayNumber(germ || seed, now) : null,
    flowerDay: flower ? dayNumber(flower, now) : null,
    lastWater: last ? { daysAgo: dayNumber(last.ts, now) - 1, liters: last.data.top + last.data.bottom } : null,
    env: currentEnv(plant, entries),
  };
}

export function weeklyWater(entries, plantId, weeks = 12, now = new Date()) {
  const monday = localMidnight(now);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const out = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(monday); d.setDate(d.getDate() - 7 * i);
    out.push({ weekStart: isoDate(d), top: 0, bottom: 0, _t: d.getTime() });
  }
  for (const x of forPlant(entries, 'water', plantId)) {
    const t = new Date(x.ts).getTime();
    const w = out.find(w => t >= w._t && t < w._t + 7 * DAY);
    if (w) { w.top += x.data.top; w.bottom += x.data.bottom; }
  }
  return out.map(({ _t, ...w }) => w);
}

export function lastWaterAmounts(entries) {
  const last = entries.filter(x => x.type === 'water').sort((a, b) => a.ts < b.ts ? -1 : 1).pop();
  return last ? { top: last.data.top, bottom: last.data.bottom } : null;
}
