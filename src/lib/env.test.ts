import assert from "node:assert/strict";
import test from "node:test";
import { masalahEnvironmentProduksi, modeData, validasiEnvironmentProduksi } from "./env.ts";

const siap = {
  NODE_ENV: "production",
  DATABASE_URL: "postgresql://pengguna:sandi@db.example/neondb?sslmode=require",
  RAHASIA_SESI: "rahasia-panjang",
  NEXT_PUBLIC_URL: "https://majegan.example.id",
  BLOB_READ_WRITE_TOKEN: "vercel_blob_rw_token",
  DATA_MODE: "official",
};

test("mode data bawaan adalah demo", () => {
  assert.equal(modeData({}), "demo");
  assert.equal(modeData({ DATA_MODE: "demo" }), "demo");
});

test("mode data official diterima dan nilai lain ditolak", () => {
  assert.equal(modeData({ DATA_MODE: "official" }), "official");
  assert.throws(() => modeData({ DATA_MODE: "uji" }), /DATA_MODE/);
});

test("konfigurasi production lengkap lolos validasi", () => {
  assert.deepEqual(masalahEnvironmentProduksi(siap), []);
  assert.doesNotThrow(() => validasiEnvironmentProduksi(siap));
});

test("konfigurasi production menolak variabel wajib yang kosong dan URL non-HTTPS", () => {
  const lingkungan = { ...siap, DATABASE_URL: "", NEXT_PUBLIC_URL: "http://localhost:3000" };
  const masalah = masalahEnvironmentProduksi(lingkungan);

  assert.ok(masalah.includes("DATABASE_URL belum diisi"));
  assert.ok(masalah.includes("NEXT_PUBLIC_URL harus menggunakan HTTPS di production"));
  assert.throws(() => validasiEnvironmentProduksi(lingkungan), /Konfigurasi production belum siap/);
});
