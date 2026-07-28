/** Helper teks tanpa dependensi — dipakai app maupun `prisma/seed.ts`. */

/** "Merti Dusun 2026!" → "merti-dusun-2026" */
export const slugkan = (teks: string) =>
  teks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Paragraf dipisah baris kosong — perlakuan sama untuk konten berita & profil. */
export const paragraf = (teks: string): string[] =>
  teks
    .trim()
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

/** Satu baris = satu item. Dipakai isian persyaratan layanan di panel admin. */
export const perBaris = (teks: string): string[] =>
  teks
    .split("\n")
    .map((b) => b.trim())
    .filter(Boolean);

/**
 * Naskah `visi-misi`: blok pertama adalah visi, blok sesudahnya butir misi.
 * Begitu cara `prisma/seed.ts` menuliskannya — satu naskah, bukan dua tabel.
 */
export function pisahVisiMisi(konten: string): { visi: string; misi: string[] } {
  const [visi = "", ...misi] = paragraf(konten);
  return { visi, misi };
}

export type LangkahAlur = { judul: string; detail: string };

/**
 * Alur layanan dari textarea: satu baris satu langkah, `judul | detail`.
 * Baris tanpa `|` tetap sah — jadi langkah tanpa keterangan tambahan.
 */
export const uraikanAlur = (teks: string): LangkahAlur[] =>
  perBaris(teks).map((b) => {
    const [judul = "", ...sisa] = b.split("|");
    // sisa disatukan lagi supaya detail yang memuat "|" tidak terpotong.
    return { judul: judul.trim(), detail: sisa.join("|").trim() };
  });

/** Kebalikan `uraikanAlur` — mengisi ulang textarea saat layanan disunting. */
export const rangkaiAlur = (alur: LangkahAlur[]): string =>
  alur.map((a) => (a.detail ? `${a.judul} | ${a.detail}` : a.judul)).join("\n");

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
