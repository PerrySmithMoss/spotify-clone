import assert from "node:assert/strict";
import { test } from "node:test";
import { debounce } from "../utils/debounce";
import { trimString } from "../utils/trimString";

test("debounced controls send only the latest value and cancel pending work on unmount", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const values: number[] = [];
  const adjust = debounce((value: number) => values.push(value), 300);
  adjust(30);
  adjust(80);
  t.mock.timers.tick(300);
  assert.deepEqual(values, [80]);
  adjust(20);
  adjust.cancel();
  t.mock.timers.tick(300);
  assert.deepEqual(values, [80]);
});

test("missing descriptions and long single words render safely while data is loading", () => {
  assert.equal(trimString(undefined, 20), "");
  assert.equal(trimString(null, 20), "");
  assert.equal(trimString("short", 20), "short");
  assert.equal(trimString("a long description here", 10), "a long...");
  assert.equal(trimString("longword", 4), "long...");
});
