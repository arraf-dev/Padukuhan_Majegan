import assert from "node:assert/strict";
import { test } from "node:test";
import { ambilTeks, sahPanjang } from "./form.ts";

test("ambilTeks memangkas spasi dan mengembalikan string untuk semua isi", () => {
  const fd = new FormData();
  fd.set("judul", "  Judul  ");
  fd.set("kosong", "");

  assert.equal(ambilTeks(fd, "judul"), "Judul");
  assert.equal(ambilTeks(fd, "kosong"), "");
  assert.equal(ambilTeks(fd, "tak-ada"), "");
});

test("sahPanjang menegakkan batas dan wajib", () => {
  assert.equal(sahPanjang("akai", 3), false);
  assert.equal(sahPanjang("akai", 4), true);
  assert.equal(sahPanjang("", undefined, true), false);
  assert.equal(sahPanjang("ada", undefined, true), true);
  assert.equal(sahPanjang("bebas", undefined), true);
  assert.equal(sahPanjang("", 1), true);
});
