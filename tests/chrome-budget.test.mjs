import test from 'node:test';
import assert from 'node:assert/strict';
import { chromeBudget } from '../.qa/chrome-budget.mjs';

const rect = (top, bottom, left = 0, right = 1440) => ({ top, bottom, left, right });
const measure = (bands, headers = [rect(0, 58)]) => chromeBudget({ width: 1440, height: 900, bands, headers });

test('off-screen sticky research rails do not become bottom chrome', () => {
  assert.equal(measure([rect(20000, 20424, 120, 440)]).chromeH, 58);
  assert.equal(measure([rect(20000, 20424)]).chromeH, 58);
  assert.equal(measure([rect(-200, -100)]).chromeH, 58);
});
test('visible nested edge bands count once; side instruments are not full-width chrome', () => {
  assert.equal(measure([rect(0, 58), rect(0, 58), rect(800, 900)]).chromeH, 158);
  assert.equal(measure([rect(58, 482, 120, 440)]).chromeH, 58);
});
test('a genuinely oversized fixed toolbar still falsifies the one-third budget', () => {
  assert.ok(measure([rect(0, 400)]).chromePct > 33);
  assert.ok(measure([rect(500, 900)]).chromePct > 33);
  assert.equal(measure([rect(850, 950)]).chromeH, 108);
});
test('edge-connected stacked toolbar counts fully while hidden panels cannot inflate chrome', () => {
  assert.equal(measure([rect(58, 458)]).chromeH, 458);
  assert.ok(measure([rect(58, 458)]).chromePct > 33);
  assert.equal(measure([{ ...rect(0, 400), visible: false }]).chromeH, 58);
  assert.equal(measure([], [{ ...rect(0, 400), visible: false }]).chromeH, 0);
});
