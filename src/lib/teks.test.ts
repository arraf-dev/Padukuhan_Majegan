import assert from "node:assert/strict";
import { test } from "node:test";
import { pisahVisiMisi, rangkaiAlur, ringkasDari, slugkan, uraikanAlur } from "./teks.ts";

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

test("visi diambil dari blok pertama, sisanya jadi butir misi", () => {
  const { visi, misi } = pisahVisiMisi("Visi kami.\n\nMisi satu.\n\nMisi dua.");
  assert.equal(visi, "Visi kami.");
  assert.deepEqual(misi, ["Misi satu.", "Misi dua."]);
});

test("naskah visi-misi satu blok berarti misi kosong, bukan visi kosong", () => {
  // Kalau terbalik, butir misi pertama diam-diam tampil sebagai visi resmi.
  const { visi, misi } = pisahVisiMisi("Baru visi yang disepakati.");
  assert.equal(visi, "Baru visi yang disepakati.");
  assert.deepEqual(misi, []);
});

test("naskah kosong tidak melempar", () => {
  assert.deepEqual(pisahVisiMisi(""), { visi: "", misi: [] });
  assert.deepEqual(pisahVisiMisi("\n\n  \n\n"), { visi: "", misi: [] });
});

test("alur: judul dan detail dipisah tanda |", () => {
  const alur = uraikanAlur("Siapkan berkas | Lengkapi di rumah\nDatang ke balai");
  assert.deepEqual(alur, [
    { judul: "Siapkan berkas", detail: "Lengkapi di rumah" },
    { judul: "Datang ke balai", detail: "" },
  ]);
});

test("alur bolak-balik lewat rangkaiAlur tidak berubah", () => {
  const teks = "Siapkan berkas | Lengkapi di rumah\nDatang ke balai";
  assert.equal(rangkaiAlur(uraikanAlur(teks)), teks);
});

test("detail yang memuat | tidak terpotong", () => {
  const [langkah] = uraikanAlur("Bayar | tunai | atau transfer");
  assert.equal(langkah.detail, "tunai | atau transfer");
});
