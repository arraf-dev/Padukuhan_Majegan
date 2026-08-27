import assert from "node:assert/strict";
import { test } from "node:test";
import {
  bersihkanGagalMasuk,
  catatGagalMasuk,
  COBA_MAKS,
  cobaMasukDiblokir,
  JENDELA_COBA_MS,
} from "./limiter.ts";

const KINI = 1_000_000;

test("masih boleh mencoba sebelum batas, diblokir setelahnya", () => {
  const kunci = "ip:192.168.1.1";
  bersihkanGagalMasuk(kunci);

  for (let i = 0; i < COBA_MAKS; i++) {
    assert.equal(cobaMasukDiblokir(kunci, KINI + i), false, "belum sampai batas");
    catatGagalMasuk(kunci, KINI + i);
  }
  assert.equal(cobaMasukDiblokir(kunci, KINI + COBA_MAKS), true, "tercapai batas");
  assert.equal(cobaMasukDiblokir(kunci, KINI + COBA_MAKS + 1), true);
});

test("percobaan sah tidak dihitung sebagai gagal", () => {
  const kunci = "alamat:dukuh@pandowoharjo.desa.id";
  bersihkanGagalMasuk(kunci);
  catatGagalMasuk(kunci, KINI);
  bersihkanGagalMasuk(kunci);
  assert.equal(cobaMasukDiblokir(kunci, KINI + 1), false);
});

test("blokiran berakhir setelah jendela 15 menit", () => {
  const kunci = "ip:10.0.0.9";
  bersihkanGagalMasuk(kunci);
  for (let i = 0; i < COBA_MAKS; i++) catatGagalMasuk(kunci, KINI + i);
  assert.equal(cobaMasukDiblokir(kunci, KINI + COBA_MAKS), true);
  assert.equal(cobaMasukDiblokir(kunci, KINI + JENDELA_COBA_MS + 1), false);
});
