import assert from "node:assert/strict";
import test from "node:test";
import {
  naskahSejarahPublik,
  naskahSejarahResmi,
  sejarahResmi,
} from "../content/sejarah.ts";

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

test("naskah contoh lama diganti dengan sejarah resmi", () => {
  const contohLama =
    'Majegan adalah salah satu padukuhan tertua di Kalurahan Pandowoharjo. Namanya dipercaya berasal dari kata "majeg" — tetap dan kukuh — merujuk pada warga yang teguh menetap dan menggarap lahan di kawasan ini sejak masa Kasultanan.\n\n' +
    "Kini Majegan berkembang menjadi permukiman agraris dengan 8 RT dalam 2 RW, ditopang pertanian padi, kelompok wanita tani, serta UMKM olahan pangan. Balai Dusun Majegan menjadi pusat kegiatan warga — dari posyandu, rapat RT, hingga merti dusun tahunan.";

  assert.equal(naskahSejarahPublik(contohLama), naskahSejarahResmi());
});

test("naskah hasil suntingan admin tetap dipertahankan", () => {
  const suntinganAdmin = "Naskah sejarah yang telah diperbarui oleh admin padukuhan.";

  assert.equal(naskahSejarahPublik(suntinganAdmin), suntinganAdmin);
});
