import assert from "node:assert/strict";
import test from "node:test";
import { periksaBerkas, periksaIsiGambar, UKURAN_BERKAS_MAKS } from "./berkas.ts";

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

test("memeriksa signature binary gambar, bukan MIME saja", async () => {
  const png = new File(
    [new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
    "gambar.png",
    { type: "image/png" },
  );
  const palsu = new File([new Uint8Array([1, 2, 3, 4])], "gambar.png", { type: "image/png" });

  assert.equal(await periksaIsiGambar(png), null);
  assert.match((await periksaIsiGambar(palsu)) ?? "", /tidak valid/);
});
