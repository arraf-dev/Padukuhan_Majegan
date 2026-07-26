import assert from "node:assert/strict";
import { test } from "node:test";
import { ringkasDari, slugkan } from "./teks.ts";

test("slug bersih dari tanda baca & spasi", () => {
  assert.equal(slugkan("Merti Dusun Majegan 2026!"), "merti-dusun-majegan-2026");
  assert.equal(slugkan("  Kerja Bakti — Bersih Kali  "), "kerja-bakti-bersih-kali");
});

test("ringkasan memakai paragraf pertama saja", () => {
  assert.equal(ringkasDari("Paragraf satu.\n\nParagraf dua."), "Paragraf satu.");
});

test("ringkasan panjang dipotong di batas kata", () => {
  const ringkas = ringkasDari(`${"kata ".repeat(60)}akhir`);
  assert.ok(ringkas.length <= 181, `terlalu panjang: ${ringkas.length}`);
  assert.ok(ringkas.endsWith("…"));
  assert.ok(!ringkas.endsWith(" …"), "jangan sisakan spasi sebelum elipsis");
});
