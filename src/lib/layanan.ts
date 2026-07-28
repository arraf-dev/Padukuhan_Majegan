import { Prisma } from "@prisma/client";
import type { Layanan } from "@/content/majegan";
import { db } from "@/lib/db";
import { type LangkahAlur, rangkaiAlur } from "@/lib/teks";

/**
 * Sumber tunggal query layanan untuk halaman publik (ADM-3 / task 19).
 *
 * Dipetakan ke tipe `Layanan` yang sudah dipakai `(publik)/layanan` — pola
 * yang sama dengan `lib/berita.ts` dan `lib/profil.ts`.
 */
const pilih = {
  id: true,
  slug: true,
  namaLayanan: true,
  deskripsi: true,
  persyaratan: true,
  alur: true,
  estimasiWaktu: true,
  biaya: true,
  fileTemplat: true,
  urutan: true,
} satisfies Prisma.LayananSelect;

type Baris = Prisma.LayananGetPayload<{ select: typeof pilih }>;

/**
 * `alur` bertipe Json, jadi Prisma mengembalikannya sebagai JsonValue — bukan
 * larik bertipe. Disaring di sini supaya baris rusak tidak menjatuhkan halaman.
 */
function bacaAlur(nilai: Prisma.JsonValue): LangkahAlur[] {
  if (!Array.isArray(nilai)) return [];

  return nilai.flatMap((a) =>
    a && typeof a === "object" && "judul" in a
      ? [{ judul: String(a.judul ?? ""), detail: String("detail" in a ? (a.detail ?? "") : "") }]
      : [],
  );
}

const keLayanan = (l: Baris): Layanan => ({
  slug: l.slug,
  nama: l.namaLayanan,
  // ponytail: `namaSingkat` tidak punya kolom — diturunkan dari nama lengkap.
  // Tambah kolom `nama_singkat` hanya kalau nanti benar-benar ada nama yang
  // kepanjangan di daftar samping.
  namaSingkat: l.namaLayanan,
  durasi: l.estimasiWaktu,
  biaya: l.biaya,
  deskripsi: l.deskripsi,
  syarat: l.persyaratan,
  alur: bacaAlur(l.alur),
  // Ukuran berkas tidak punya kolom dan tidak bisa diperbarui admin, jadi
  // tidak ditampilkan sama sekali — angka yang membeku lebih menyesatkan.
  berkas: l.fileTemplat ? { nama: l.fileTemplat } : undefined,
});

export async function semuaLayanan(): Promise<Layanan[]> {
  const baris = await db.layanan.findMany({ orderBy: { urutan: "asc" }, select: pilih });
  return baris.map(keLayanan);
}

/** Daftar untuk panel admin — id ikut, karena form menyunting per baris. */
export function daftarLayananAdmin() {
  return db.layanan.findMany({ orderBy: { urutan: "asc" }, select: pilih });
}

/** Satu layanan dalam bentuk siap-isi form panel admin. */
export async function layananUntukForm(id: string) {
  const l = await db.layanan.findUnique({ where: { id }, select: pilih });
  if (!l) return null;

  return {
    id: l.id,
    slug: l.slug,
    nama: l.namaLayanan,
    deskripsi: l.deskripsi,
    persyaratan: l.persyaratan.join("\n"),
    alur: rangkaiAlur(bacaAlur(l.alur)),
    estimasiWaktu: l.estimasiWaktu,
    biaya: l.biaya,
    fileTemplat: l.fileTemplat ?? "",
    urutan: l.urutan,
  };
}

export type LayananForm = NonNullable<Awaited<ReturnType<typeof layananUntukForm>>>;
