import { Prisma } from "@prisma/client";
import type { Berita, KategoriBerita } from "@/content/majegan";
import { db } from "@/lib/db";

/**
 * Sumber tunggal query berita untuk halaman publik.
 *
 * Hasilnya dipetakan ke tipe `Berita` yang sudah dipakai `KartuAlbum`,
 * `KartuRingkas`, dan halaman detail — jadi pindah dari `majegan.ts` ke DB tidak
 * menyentuh satu pun komponen tampilan.
 */
const pilih = {
  slug: true,
  judul: true,
  status: true,
  ringkasan: true,
  konten: true,
  lokasi: true,
  gambarSampul: true,
  suka: true,
  tanggapan: true,
  terbitPada: true,
  dibuatPada: true,
  kategori: { select: { nama: true } },
} satisfies Prisma.BeritaSelect;

type Baris = Prisma.BeritaGetPayload<{ select: typeof pilih }>;

const keBerita = (b: Baris): Berita => ({
  slug: b.slug,
  judul: b.judul,
  kategori: b.kategori.nama as KategoriBerita,
  tanggal: (b.terbitPada ?? b.dibuatPada).toISOString(),
  lokasi: b.lokasi ?? "",
  ringkasan: b.ringkasan,
  isi: b.konten.split(/\n{2,}/).filter(Boolean),
  // `Foto` menampilkan placeholder saat kosong — tetap begitu sampai unggahan
  // gambar aktif (ADM-5, task 17).
  foto: b.gambarSampul ?? "",
  suka: b.suka,
  tanggapan: b.tanggapan,
});

/**
 * Berita terbit, terbaru dulu.
 *
 * ponytail: saring kategori & paginasi tetap di JS seperti sebelumnya —
 * padukuhan ini punya puluhan berita, bukan puluhan ribu. Pindahkan ke `where`
 * + `skip`/`take` kalau daftarnya benar-benar membengkak.
 */
export async function beritaTerbit(batas?: number): Promise<Berita[]> {
  const baris = await db.berita.findMany({
    where: { status: "terbit" },
    orderBy: [{ terbitPada: "desc" }, { dibuatPada: "desc" }],
    take: batas,
    select: pilih,
  });

  return baris.map(keBerita);
}

export async function beritaSlug(slug: string): Promise<Berita | null> {
  const baris = await db.berita.findUnique({ where: { slug }, select: pilih });

  // Draf tidak boleh bisa dibuka warga hanya karena slug-nya ketebak.
  return baris?.status === "terbit" ? keBerita(baris) : null;
}
