/** Helper teks tanpa dependensi — dipakai app maupun `prisma/seed.ts`. */

/** "Merti Dusun 2026!" → "merti-dusun-2026" */
export const slugkan = (teks: string) =>
  teks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const BATAS_RINGKASAN = 180;

/**
 * Ringkasan otomatis dari badan tulisan: paragraf pertama, dipotong di batas
 * kata bila kepanjangan.
 *
 * ponytail: admin tidak diminta menulis ringkasan terpisah — satu kolom isian
 * lebih mungkin diisi benar oleh perangkat dusun daripada dua. Tambahkan isian
 * manual kalau nanti ada yang mengeluh hasil potongannya.
 */
export function ringkasDari(konten: string): string {
  const paragraf = konten.trim().split(/\n{2,}/)[0]?.replace(/\s+/g, " ").trim() ?? "";
  if (paragraf.length <= BATAS_RINGKASAN) return paragraf;

  const potong = paragraf.slice(0, BATAS_RINGKASAN);
  const spasi = potong.lastIndexOf(" ");
  return `${(spasi > 0 ? potong.slice(0, spasi) : potong).replace(/[.,;:]$/, "")}…`;
}
