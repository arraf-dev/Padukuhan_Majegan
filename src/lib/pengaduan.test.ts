import assert from "node:assert/strict";
import { test } from "node:test";
import { buatKodeTiket, periksaPengaduan } from "./pengaduan.ts";

const form = (isi: Record<string, string>) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(isi)) fd.set(k, v);
  return fd;
};

const lengkap = { kategori: "Kebersihan", isi: "Sampah menumpuk", nama: "Budi", kontak: "0812" };

test("laporan lengkap lolos", () => {
  assert.equal(periksaPengaduan(form(lengkap)), null);
});

test("kategori di luar daftar ditolak", () => {
  assert.equal(periksaPengaduan(form({ ...lengkap, kategori: "Politik" })), "kategori");
  assert.equal(periksaPengaduan(form({ ...lengkap, kategori: "" })), "kategori");
});

test("isi kosong atau hanya spasi ditolak", () => {
  assert.equal(periksaPengaduan(form({ ...lengkap, isi: "   " })), "isi");
});

test("identitas wajib kecuali anonim", () => {
  assert.equal(periksaPengaduan(form({ ...lengkap, nama: "" })), "identitas");
  assert.equal(periksaPengaduan(form({ ...lengkap, kontak: "" })), "identitas");
  assert.equal(periksaPengaduan(form({ ...lengkap, nama: "", kontak: "", anonim: "on" })), null);
});

test("kode tiket memakai tahun-bulan dan tidak berulang", () => {
  const kode = buatKodeTiket(new Date("2026-07-24T10:00:00+07:00"));
  assert.match(kode, /^MJG-2607-[A-Z2-9]{4}$/);
  assert.equal(buatKodeTiket(new Date("2026-01-05T00:00:00+07:00")).slice(0, 8), "MJG-2601");

  const kumpulan = new Set(Array.from({ length: 200 }, () => buatKodeTiket()));
  assert.ok(kumpulan.size > 190, `terlalu banyak tabrakan: ${kumpulan.size}/200`);
});
