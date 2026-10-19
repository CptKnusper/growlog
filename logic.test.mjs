import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dayNumber, currentEnv, plantStatus, weeklyWater, lastWaterAmounts, milestoneDate } from './logic.js';

const now = new Date('2026-10-18T20:00:00');
const luna = { id: 'p1', name: 'Luna', start: { light: 10, pot: 3, lamp: 40 } };
const mira = { id: 'p2', name: 'Mira', start: { light: 10, pot: 3, lamp: 40 } };
const e = (ts, type, plantIds, data) => ({ id: ts + type, ts, type, plantIds, data });

test('dayNumber: start day counts as day 1, calendar days not hours', () => {
  assert.equal(dayNumber('2026-10-18T06:00:00', now), 1);
  assert.equal(dayNumber('2026-10-17T23:59:00', now), 2);
  assert.equal(dayNumber('2026-09-08T12:00:00', now), 41);
});

test('currentEnv: start values, overridden by latest env entry for that plant', () => {
  const entries = [
    e('2026-10-15T10:00:00', 'env', ['p1', 'p2'], { param: 'light', to: 20, from: {} }),
    e('2026-10-13T10:00:00', 'env', ['p1'], { param: 'pot', to: 11, from: {} }),
    e('2026-10-16T10:00:00', 'env', ['p2'], { param: 'light', to: 30, from: {} }),
  ];
  assert.deepEqual(currentEnv(luna, entries), { light: 20, pot: 11, lamp: 40 });
  assert.deepEqual(currentEnv(mira, entries), { light: 30, pot: 3, lamp: 40 });
});

test('milestoneDate: returns ts of the milestone for that plant or null', () => {
  const entries = [e('2026-09-08T12:00:00', 'milestone', ['p1'], { kind: 'germ' })];
  assert.equal(milestoneDate(luna, entries, 'germ'), '2026-09-08T12:00:00');
  assert.equal(milestoneDate(mira, entries, 'germ'), null);
});

test('plantStatus: germ day, flower day, last watering with liters per plant', () => {
  const entries = [
    e('2026-09-05T12:00:00', 'milestone', ['p1', 'p2'], { kind: 'seed' }),
    e('2026-09-08T12:00:00', 'milestone', ['p1', 'p2'], { kind: 'germ' }),
    e('2026-10-10T12:00:00', 'milestone', ['p1'], { kind: 'flower' }),
    e('2026-10-16T09:00:00', 'water', ['p1', 'p2'], { top: 1, bottom: 0.5, feed: null }),
    e('2026-10-17T09:00:00', 'water', ['p2'], { top: 0.5, bottom: 0, feed: null }),
  ];
  const s = plantStatus(luna, entries, now);
  assert.equal(s.stage, 'germ');
  assert.equal(s.day, 41);
  assert.equal(s.flowerDay, 9);
  assert.deepEqual(s.lastWater, { daysAgo: 2, liters: 1.5 });
  const m = plantStatus(mira, entries, now);
  assert.equal(m.flowerDay, null);
  assert.deepEqual(m.lastWater, { daysAgo: 1, liters: 0.5 });
});

test('plantStatus: before germination counts from seed, nothing set gives stage none', () => {
  const entries = [e('2026-10-15T12:00:00', 'milestone', ['p1'], { kind: 'seed' })];
  assert.deepEqual(plantStatus(luna, entries, now), {
    stage: 'seed', day: 4, flowerDay: null, lastWater: null, env: luna.start,
  });
  assert.equal(plantStatus(mira, entries, now).stage, 'none');
});

test('weeklyWater: 12 Monday-based weeks oldest first, "both" entries count fully per plant', () => {
  const entries = [
    e('2026-10-16T09:00:00', 'water', ['p1', 'p2'], { top: 1, bottom: 0.5 }),
    e('2026-10-12T09:00:00', 'water', ['p1'], { top: 0.5, bottom: 0 }),
    e('2026-10-11T09:00:00', 'water', ['p1'], { top: 2, bottom: 0 }),
    e('2026-07-01T09:00:00', 'water', ['p1'], { top: 9, bottom: 9 }),
  ];
  const w = weeklyWater(entries, 'p1', 12, now);
  assert.equal(w.length, 12);
  assert.equal(w[0].weekStart, '2026-07-27');
  assert.deepEqual(w[11], { weekStart: '2026-10-12', top: 1.5, bottom: 0.5 });
  assert.deepEqual(w[10], { weekStart: '2026-10-05', top: 2, bottom: 0 });
  assert.deepEqual(weeklyWater(entries, 'p2', 12, now)[11], { weekStart: '2026-10-12', top: 1, bottom: 0.5 });
});

test('lastWaterAmounts: most recent watering by ts, null when none', () => {
  const entries = [
    e('2026-10-10T09:00:00', 'water', ['p1'], { top: 2, bottom: 0 }),
    e('2026-10-16T09:00:00', 'water', ['p1'], { top: 1, bottom: 0.5 }),
  ];
  assert.deepEqual(lastWaterAmounts(entries), { top: 1, bottom: 0.5 });
  assert.equal(lastWaterAmounts([]), null);
});
