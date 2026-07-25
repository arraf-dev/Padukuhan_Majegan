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
