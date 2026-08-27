import assert from "node:assert/strict";
import { test } from "node:test";
import {
  JEDA_KIRIM_MS,
  bolehKirim,
  cocokFilterBaca,
  periksaPengaduan,
  pilihFilterBaca,
} from "./pengaduan.ts";

const form = (isi: Record<string, string>) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(isi)) fd.set(k, v);
  return fd;
};

const lengkap = { kategori: "Kebersihan", isi: "Sampah menumpuk", nama: "Budi", kontak: "0812-3456-7890" };

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

test("nama dan kontak selalu wajib", () => {
  assert.equal(periksaPengaduan(form({ ...lengkap, nama: "" })), "identitas");
  assert.equal(periksaPengaduan(form({ ...lengkap, kontak: "" })), "identitas");
  assert.equal(periksaPengaduan(form({ ...lengkap, nama: "", kontak: "" })), "identitas");
});

test("isi dan nama tidak boleh melebihi batas panjang", () => {
  assert.equal(periksaPengaduan(form({ ...lengkap, isi: "x".repeat(5001) })), "isi");
  assert.equal(periksaPengaduan(form({ ...lengkap, nama: "x".repeat(101) })), "identitas");
});

test("kontak harus nomor telepon sesuai format", () => {
  assert.equal(periksaPengaduan(form({ ...lengkap, kontak: "0812" })), "identitas");
  assert.equal(periksaPengaduan(form({ ...lengkap, kontak: "abc" })), "identitas");
  assert.equal(periksaPengaduan(form({ ...lengkap, kontak: "x".repeat(26) })), "identitas");
  assert.equal(periksaPengaduan(form({ ...lengkap, kontak: "+62 812-3456-7890" })), null);
});

test("satu IP kena jeda, IP lain tidak terpengaruh", () => {
  const t = Date.now();
  assert.equal(bolehKirim("1.1.1.1", t), true);
  assert.equal(bolehKirim("1.1.1.1", t + 1_000), false, "kiriman kedua harus ditahan");
  assert.equal(bolehKirim("2.2.2.2", t + 1_000), true, "IP lain jangan ikut kena");
  assert.equal(bolehKirim("1.1.1.1", t + JEDA_KIRIM_MS), true, "lewat jeda harus boleh lagi");
});
test("filter panel hanya menerima semua, belum, atau sudah dibaca", () => {
  assert.equal(pilihFilterBaca(), undefined);
  assert.equal(pilihFilterBaca("asing"), undefined);
  assert.equal(pilihFilterBaca("belum"), "belum");
  assert.equal(pilihFilterBaca("sudah"), "sudah");

  assert.equal(cocokFilterBaca(null, "belum"), true);
  assert.equal(cocokFilterBaca(new Date(), "belum"), false);
  assert.equal(cocokFilterBaca(null, "sudah"), false);
  assert.equal(cocokFilterBaca(new Date(), "sudah"), true);
  assert.equal(cocokFilterBaca(null), true);
});
// Filter diuji terpisah dari Prisma agar test tidak membutuhkan database.
