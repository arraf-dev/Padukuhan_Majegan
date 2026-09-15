import assert from "node:assert/strict";
import test from "node:test";
import { naskahSejarahResmi, sejarahResmi } from "../content/sejarah.ts";

test("sejarah resmi memuat empat paragraf dari dokumen", () => {
  assert.equal(sejarahResmi.paragraf.length, 4);
  assert.match(sejarahResmi.paragraf[0], /Keraton Yogyakarta/);
  assert.match(sejarahResmi.paragraf[2], /1890-an/);
});

test("figur sejarah memiliki aset lokal, alt, caption, dan tahun peta yang benar", () => {
  assert.deepEqual(
    sejarahResmi.gambar.map((gambar) => gambar.src),
    [
      "/gambar/sejarah-peta-majegan-1933.jpg",
      "/gambar/joglo-kademangan-majegan.jpg",
    ],
  );
  assert.ok(sejarahResmi.gambar.every((gambar) => gambar.alt && gambar.caption));
  assert.match(sejarahResmi.gambar[0].caption, /1933/);
});

test("daftar sumber mempertahankan tiga rujukan dokumen", () => {
  assert.equal(sejarahResmi.sumber.length, 3);
  assert.match(sejarahResmi.sumber[0].teks, /Topografische Dienst/);
  assert.match(sejarahResmi.sumber[2].teks, /Wawancara pribadi, 30 Mei 2026/);
});

test("paragraf sejarah siap disimpan sebagai naskah admin", () => {
  const konten = naskahSejarahResmi();

  assert.equal(konten.split("\n\n").length, 4);
  assert.doesNotMatch(konten, /\n{3,}/);
});
