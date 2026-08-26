import { test } from "node:test";
import assert from "node:assert/strict";
import { keKunciPrivat, kunciObjek } from "./r2.ts";

test("kunciObjek membersihkan nama berkas", () => {
  const kunci = kunciObjek("berita", "  Foto Bob & Ibu.jpg  ");
  assert.match(kunci, /^berita\/foto-bob-ibu-[a-z0-9]+/);
  assert.ok(!/[\s&]/.test(kunci));
});

test("kunciObjek memakai fallback saat nama kosong", () => {
  const kunci = kunciObjek("layanan", "   ");
  assert.match(kunci, /^layanan\/berkas-[a-z0-9]+/);
});

test("keKunciPrivat mengembalikan key privat apa adanya", () => {
  assert.equal(keKunciPrivat("pengaduan/abc.jpg"), "pengaduan/abc.jpg");
});

test("keKunciPrivat menurunkan key dari URL publik R2", () => {
  assert.equal(keKunciPrivat("https://majegan-publik.abc.r2.dev/galeri/x.jpg"), "galeri/x.jpg");
  assert.equal(keKunciPrivat("https://bucket.r2.cloudflarestorage.com/berita/y.jpg"), "berita/y.jpg");
});

test("keKunciPrivat menolak host selain R2", () => {
  assert.equal(keKunciPrivat("https://images.unsplash.com/foto.jpg"), null);
  assert.equal(keKunciPrivat(""), null);
});

test("keKunciPrivat tidak melepas objek blob lama", () => {
  assert.equal(keKunciPrivat("https://abc.public.blob.vercel-storage.com/x.jpg"), null);
});
