import assert from "node:assert/strict";
import test from "node:test";
import { BERITA_POSYANDU_LANSIA, SLUG_BERITA_POSYANDU_LANSIA } from "./berita-posyandu-lansia.ts";

test("konten Posyandu Lansia memakai dua foto dan keterangan yang relevan", () => {
  assert.equal(SLUG_BERITA_POSYANDU_LANSIA, "posyandu-lansia-padukuhan-majegan");
  assert.equal(BERITA_POSYANDU_LANSIA.kategori, "Kegiatan");
  assert.equal(BERITA_POSYANDU_LANSIA.fotoDokumentasi.length, 2);
  assert.match(BERITA_POSYANDU_LANSIA.ringkasan, /lanjut usia/i);
  assert.doesNotMatch(BERITA_POSYANDU_LANSIA.konten, /pukul|tanggal|obat|diagnosis/i);
});
