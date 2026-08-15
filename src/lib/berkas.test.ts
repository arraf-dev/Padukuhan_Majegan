import assert from "node:assert/strict";
import test from "node:test";
import { periksaBerkas, UKURAN_BERKAS_MAKS } from "./berkas.ts";

const file = (type: string, size = 1) => new File([new Uint8Array(size)], "berkas", { type });

test("menerima gambar yang didukung", () => {
  assert.equal(periksaBerkas(file("image/jpeg"), "gambar"), null);
  assert.equal(periksaBerkas(file("image/png"), "gambar"), null);
  assert.equal(periksaBerkas(file("image/webp"), "gambar"), null);
});

test("PDF hanya diterima sebagai dokumen", () => {
  assert.match(periksaBerkas(file("application/pdf"), "gambar") ?? "", /JPG/);
  assert.equal(periksaBerkas(file("application/pdf"), "dokumen"), null);
});

test("menolak berkas kosong dan yang terlalu besar", () => {
  assert.match(periksaBerkas(file("image/jpeg", 0), "gambar") ?? "", /kosong/);
  assert.match(periksaBerkas(file("image/jpeg", UKURAN_BERKAS_MAKS + 1), "gambar") ?? "", /4 MB/);
});
