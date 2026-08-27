/**
 * Hash kata sandi + token sesi bertanda tangan.
 *
 * ponytail: `node:crypto` saja — tanpa bcrypt, jose, atau next-auth. Kebutuhannya
 * cuma dua peran dengan login email+sandi, dan berkas ini lebih pendek daripada
 * konfigurasi next-auth yang setara. Kalau nanti butuh login Google/SSO, barulah
 * next-auth sepadan.
 *
 * Impor relatif + ekstensi .ts supaya `node --test` bisa menjalankannya langsung.
 */
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { Peran } from "../content/majegan.ts";

const PANJANG_KUNCI = 64;

/** Simpan sebagai `garam:hash` — garamnya ikut, jadi tidak perlu kolom kedua. */
export function hashKataSandi(sandi: string): string {
  const garam = randomBytes(16).toString("hex");
  return `${garam}:${scryptSync(sandi, garam, PANJANG_KUNCI).toString("hex")}`;
}

export function periksaKataSandi(sandi: string, tersimpan: string): boolean {
  const [garam, hash] = tersimpan.split(":");
  if (!garam || !hash) return false;

  const disimpan = Buffer.from(hash, "hex");
  // scryptSync melempar bila keylen 0 — hash cacat ditolak sebelum sampai situ.
  if (disimpan.length !== PANJANG_KUNCI) return false;

  return timingSafeEqual(disimpan, scryptSync(sandi, garam, PANJANG_KUNCI));
}

/** Panel admin adalah satu-satunya pintu masuk, jadi sandinya tidak boleh pendek. */
export const PANJANG_SANDI_MIN = 12;

/**
 * Mengembalikan pesan galat, atau null bila sandinya sah.
 *
 * ponytail: cuma aturan panjang — tanpa syarat huruf besar/angka/simbol. Aturan
 * komposisi mendorong perangkat dusun menulis sandi di kertas tempel, dan itu
 * menurunkan keamanan, bukan menaikkannya.
 */
export const PANJANG_SANDI_MAKS = 256;

export function periksaSandiBaru(sandi: string): string | null {
  if (sandi.length < PANJANG_SANDI_MIN) return `Sandi minimal ${PANJANG_SANDI_MIN} karakter.`;
  if (sandi.length > PANJANG_SANDI_MAKS) return `Sandi maksimal ${PANJANG_SANDI_MAKS} karakter.`;
  if (sandi.trim().length === 0) return "Sandi tidak boleh hanya spasi.";
  return null;
}

export const emailSah = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/* ---------- Token sesi ---------- */

export type IsiSesi = { id: string; nama: string; peran: Peran; exp: number };

const b64 = (teks: string) => Buffer.from(teks).toString("base64url");

const tandaTangan = (data: string, rahasia: string) =>
  createHmac("sha256", rahasia).update(data).digest("base64url");

/** Token `payload.tandatangan` — isinya tidak rahasia, tapi tidak bisa dipalsukan. */
export function buatToken(isi: IsiSesi, rahasia: string): string {
  const data = b64(JSON.stringify(isi));
  return `${data}.${tandaTangan(data, rahasia)}`;
}

/** Mengembalikan null bila token cacat, tanda tangannya salah, atau kedaluwarsa. */
export function bacaToken(token: string, rahasia: string, kini = Date.now()): IsiSesi | null {
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;

  const benar = Buffer.from(tandaTangan(data, rahasia));
  const diberi = Buffer.from(sig);
  // Panjang harus sama dulu; timingSafeEqual melempar kalau beda.
  if (benar.length !== diberi.length || !timingSafeEqual(benar, diberi)) return null;

  try {
    const isi = JSON.parse(Buffer.from(data, "base64url").toString()) as IsiSesi;
    return isi.exp > kini ? isi : null;
  } catch {
    return null;
  }
}
