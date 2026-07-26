// Impor relatif + ekstensi .ts supaya `node --test` bisa menjalankan berkas ini
// langsung (Node 24 strip types sendiri, dan tidak mengenal alias `@/`).
import { kategoriPengaduan } from "../content/majegan.ts";

export type GalatPengaduan = "isi" | "kategori" | "identitas";

const teks = (fd: FormData, nama: string) => String(fd.get(nama) ?? "").trim();

/**
 * Validasi di sisi server — jangan mengandalkan `required` di HTML saja.
 * Mengembalikan kode galat pertama, atau null bila lolos.
 */
export function periksaPengaduan(fd: FormData): GalatPengaduan | null {
  const kategori = teks(fd, "kategori");
  if (!kategoriPengaduan.some((k) => k === kategori)) return "kategori";

  if (!teks(fd, "isi")) return "isi";

  // Anonim membebaskan identitas; selain itu nama & kontak wajib.
  if (fd.get("anonim") === null && (!teks(fd, "nama") || !teks(fd, "kontak"))) {
    return "identitas";
  }

  return null;
}

/**
 * Nama kolom jebakan bot (honeypot). Manusia tidak pernah melihatnya, jadi
 * kalau terisi pengirimnya hampir pasti robot. Satu sumber nama untuk form &
 * server action supaya tidak bisa beda diam-diam.
 */
export const NAMA_JEBAKAN = "situs_web";

export const JEDA_KIRIM_MS = 60_000;

const kirimTerakhir = new Map<string, number>();

/**
 * Satu IP boleh mengirim satu laporan tiap `JEDA_KIRIM_MS`. Menahan klik ganda
 * sekaligus spam iseng.
 *
 * ponytail: hitungannya di memori proses — reset tiap cold start dan tidak
 * dibagi antar instance serverless, jadi jendelanya bisa ditembus dengan sabar.
 * Cukup untuk padukuhan; pindah ke Upstash/tabel DB kalau spam sungguhan muncul.
 */
export function bolehKirim(ip: string, kini = Date.now()): boolean {
  const lalu = kirimTerakhir.get(ip);
  if (lalu !== undefined && kini - lalu < JEDA_KIRIM_MS) return false;

  // Buang catatan kedaluwarsa dulu supaya Map tidak tumbuh tanpa batas.
  for (const [k, t] of kirimTerakhir) if (kini - t >= JEDA_KIRIM_MS) kirimTerakhir.delete(k);
  kirimTerakhir.set(ip, kini);
  return true;
}

/** Kode tiket seperti pada mockup: MJG-2607-4X9K (MJG-YYMM-acak). */
export function buatKodeTiket(kini = new Date()): string {
  const yy = String(kini.getFullYear()).slice(-2);
  const mm = String(kini.getMonth() + 1).padStart(2, "0");

  // Tanpa huruf/angka yang mudah tertukar saat dibacakan lewat telepon.
  const abjad = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const acak = Array.from(
    crypto.getRandomValues(new Uint8Array(4)),
    (b) => abjad[b % abjad.length],
  ).join("");

  return `MJG-${yy}${mm}-${acak}`;
}
