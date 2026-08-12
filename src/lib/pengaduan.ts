// Impor relatif + ekstensi .ts supaya `node --test` bisa menjalankan berkas ini
// langsung (Node 24 strip types sendiri, dan tidak mengenal alias `@/`).
import { kategoriPengaduan } from "../content/majegan.ts";

export type GalatPengaduan = "isi" | "kategori" | "identitas";
export type FilterBaca = "belum" | "sudah";

const teks = (fd: FormData, nama: string) => String(fd.get(nama) ?? "").trim();

/**
 * Validasi di sisi server — jangan mengandalkan `required` di HTML saja.
 * Mengembalikan kode galat pertama, atau null bila lolos.
 */
export function periksaPengaduan(fd: FormData): GalatPengaduan | null {
  const kategori = teks(fd, "kategori");
  if (!kategoriPengaduan.some((k) => k === kategori)) return "kategori";

  if (!teks(fd, "isi")) return "isi";

  if (!teks(fd, "nama") || !teks(fd, "kontak")) return "identitas";

  return null;
}

/** Hanya menerima dua nilai filter resmi; nilai URL lain kembali ke Semua. */
export function pilihFilterBaca(nilai?: string): FilterBaca | undefined {
  return nilai === "belum" || nilai === "sudah" ? nilai : undefined;
}

/** Logika filter murni untuk memastikan arti Dibaca/Belum Dibaca tidak terbalik. */
export function cocokFilterBaca(dibacaPada: Date | null, filter?: FilterBaca): boolean {
  if (filter === "belum") return dibacaPada === null;
  if (filter === "sudah") return dibacaPada !== null;
  return true;
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
