import assert from "node:assert/strict";
import test from "node:test";
import {
  bacaToken,
  buatToken,
  emailSah,
  hashKataSandi,
  type IsiSesi,
  periksaKataSandi,
  periksaSandiBaru,
} from "./auth.ts";

const RAHASIA = "rahasia-untuk-uji-saja";
const isi = (exp = Date.now() + 60_000): IsiSesi => ({
  id: "abc",
  nama: "Sarjiman, S.Pd.",
  peran: "superadmin",
  exp,
});

test("kata sandi benar lolos, yang salah ditolak", () => {
  const hash = hashKataSandi("sandi-rahasia");
  assert.ok(periksaKataSandi("sandi-rahasia", hash));
  assert.ok(!periksaKataSandi("sandi-salah", hash));
});

test("hash tidak menyimpan sandi apa adanya & selalu bergaram baru", () => {
  const hash = hashKataSandi("sandi-rahasia");
  assert.ok(!hash.includes("sandi-rahasia"));
  assert.notEqual(hash, hashKataSandi("sandi-rahasia"));
});

test("hash cacat ditolak, bukan melempar", () => {
  for (const cacat of ["", "tanpa-titik-dua", "garam:", ":hash", "garam:bukanhex"]) {
    assert.ok(!periksaKataSandi("apa pun", cacat), cacat);
  }
});

test("token sah terbaca kembali utuh", () => {
  const asli = isi();
  assert.deepEqual(bacaToken(buatToken(asli, RAHASIA), RAHASIA), asli);
});

test("token yang diutak-atik ditolak", () => {
  const token = buatToken(isi(), RAHASIA);
  const [data, sig] = token.split(".");

  // Isi diganti jadi superadmin palsu, tanda tangan lama dipakai ulang.
  const palsu = Buffer.from(JSON.stringify({ ...isi(), id: "penyusup" })).toString("base64url");
  assert.equal(bacaToken(`${palsu}.${sig}`, RAHASIA), null);

  assert.equal(bacaToken(`${data}.${sig.slice(0, -1)}x`, RAHASIA), null);
  assert.equal(bacaToken(token, "rahasia-lain"), null);
  assert.equal(bacaToken("tanpa-titik", RAHASIA), null);
});

test("token kedaluwarsa ditolak", () => {
  assert.equal(bacaToken(buatToken(isi(Date.now() - 1), RAHASIA), RAHASIA), null);
});

test("sandi baru wajib minimal 12 karakter", () => {
  assert.ok(periksaSandiBaru("pendek123"));
  assert.ok(periksaSandiBaru("12345678901"), "11 karakter masih ditolak");
  assert.equal(periksaSandiBaru("123456789012"), null, "12 karakter diterima");
  assert.equal(periksaSandiBaru("sandi dusun majegan"), null);
});

test("sandi berisi spasi saja ditolak", () => {
  assert.ok(periksaSandiBaru(" ".repeat(20)));
});

test("format email jelas salah ditolak", () => {
  assert.ok(emailSah("admin@majegan.id"));
  for (const salah of ["", "admin", "admin@", "@majegan.id", "admin @majegan.id"]) {
    assert.ok(!emailSah(salah), salah);
  }
});
