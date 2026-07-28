import { profil as contoh } from "@/content/majegan";
import { db } from "@/lib/db";
import { paragraf, pisahVisiMisi } from "@/lib/teks";

/**
 * Sumber tunggal query profil desa untuk halaman publik (ADM-2 / task 18).
 *
 * Bentuk hasilnya sengaja sama persis dengan objek `profil` di `majegan.ts`,
 * jadi `(publik)/profil/page.tsx` cukup mengganti satu baris impor dan tidak
 * ada komponen tampilan yang perlu disentuh — pola yang sama dengan
 * `lib/berita.ts`.
 */

export type Perangkat = { id: string; nama: string; jabatan: string; foto: string };

export type ProfilDesa = {
  sejarah: string[];
  visi: string;
  misi: string[];
  visiMisiDraft: boolean;
  dukuh: Perangkat;
  perangkat: Perangkat[];
  catatanStruktur: string;
  catatanPeta: string;
};

/** Dipakai saat perangkat belum punya foto — kolom `foto_url` boleh kosong. */
const AVATAR_DUKUH = "/gambar/avatar-dukuh.svg";
const AVATAR_PERANGKAT = "/gambar/avatar-perangkat.svg";

export async function profilDesa(): Promise<ProfilDesa> {
  const [halaman, orang] = await Promise.all([
    db.halamanProfil.findMany({ select: { slug: true, konten: true, draft: true } }),
    db.perangkatDesa.findMany({
      orderBy: { urutan: "asc" },
      select: { id: true, nama: true, jabatan: true, fotoUrl: true },
    }),
  ]);

  const naskah = (slug: string) => halaman.find((h) => h.slug === slug);
  const visiMisi = naskah("visi-misi");
  const { visi, misi } = pisahVisiMisi(visiMisi?.konten ?? "");

  // Urutan terkecil = Dukuh, tampil di kartu kepala struktur organisasi.
  // `seed.ts` sudah menaruhnya di urutan 0; panel admin memakai konvensi sama.
  const [kepala, ...sisa] = orang;

  return {
    // Baris naskah bisa dihapus dari panel. Halaman publik tidak boleh 500
    // karenanya — bagian yang kosong cukup tampil kosong.
    sejarah: paragraf(naskah("sejarah")?.konten ?? ""),
    visi,
    misi,
    // Naskah yang belum ada diperlakukan sebagai draf: menandai DRAFT lebih
    // jujur daripada menayangkan bagian kosong seolah sudah disepakati.
    visiMisiDraft: visiMisi?.draft ?? true,
    dukuh: kepala
      ? { id: kepala.id, nama: kepala.nama, jabatan: kepala.jabatan, foto: kepala.fotoUrl ?? AVATAR_DUKUH }
      : { id: "", nama: contoh.dukuh.nama, jabatan: contoh.dukuh.jabatan, foto: AVATAR_DUKUH },
    perangkat: sisa.map((p) => ({
      id: p.id,
      nama: p.nama,
      jabatan: p.jabatan,
      foto: p.fotoUrl ?? AVATAR_PERANGKAT,
    })),
    // ponytail: dua catatan ini teks antarmuka, bukan data yang disunting
    // admin — tidak diberi kolom. Isian yang tak pernah diubah cuma menambah
    // form yang harus diisi tanpa alasan.
    catatanStruktur: contoh.catatanStruktur,
    catatanPeta: contoh.catatanPeta,
  };
}

/** Naskah mentah untuk form panel admin — tanpa pemetaan ke bentuk tampilan. */
export function naskahProfil() {
  return db.halamanProfil.findMany({
    orderBy: { slug: "asc" },
    select: { id: true, slug: true, judul: true, konten: true, draft: true, diperbaruiPada: true },
  });
}

export function daftarPerangkat() {
  return db.perangkatDesa.findMany({
    orderBy: { urutan: "asc" },
    select: { id: true, nama: true, jabatan: true, fotoUrl: true, urutan: true },
  });
}
