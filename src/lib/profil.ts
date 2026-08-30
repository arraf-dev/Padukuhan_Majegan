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

/**
 * Struktur terkelompok sesuai bagan resmi padukuhan: satu kepala, lembaga
 * di tingkat padukuhan (LPMKal), kelompok swadaya masyarakat (KSM), RW, RT,
 * dan sisa jabatan di luar bagan — tetap ditampilkan di baris terakhir.
 */
export type StrukturTerkelompok = {
  lpmkal?: Perangkat;
  ksm: Perangkat[];
  rw: Perangkat[];
  rt: Perangkat[];
  lain: Perangkat[];
};

export type ProfilDesa = {
  sejarah: string[];
  visi: string;
  misi: string[];
  visiMisiDraft: boolean;
  dukuh: Perangkat;
  struktur: StrukturTerkelompok;
  catatanStruktur: string;
  catatanPeta: string;
};

/** Dipakai saat perangkat belum punya foto — kolom `foto_url` boleh kosong. */
const AVATAR_DUKUH = "/gambar/avatar-dukuh.svg";
const AVATAR_PERANGKAT = "/gambar/avatar-perangkat.svg";

/** Kelompokkan jabatan sesuai kedudukannya pada bagan struktur resmi. */
function kelompokJabatan(jabatan: string): "lpmkal" | "ksm" | "rw" | "rt" | "lain" {
  if (/lpmkal/i.test(jabatan)) return "lpmkal";
  if (/pkk|karang taruna|kelompok kandang|kelompok tani|organisasi kemasyarakatan/i.test(jabatan))
    return "ksm";
  if (/rw\s*\d+/i.test(jabatan)) return "rw";
  if (/rt\s*\d+/i.test(jabatan)) return "rt";
  return "lain";
}

/** Nomor pertama pada jabatan — dipakai mengurutkan RW & RT. */
const nomor = (jabatan: string) => Number.parseInt(jabatan.match(/\d+/)?.[0] ?? "0", 10);

function kelompokkan(orang: Perangkat[]): StrukturTerkelompok {
  const hasil: StrukturTerkelompok = { ksm: [], rw: [], rt: [], lain: [] };
  for (const p of orang) {
    const golongan = kelompokJabatan(p.jabatan);
    if (golongan === "lpmkal" && !hasil.lpmkal) hasil.lpmkal = p;
    else if (golongan === "ksm") hasil.ksm.push(p);
    else if (golongan === "rw") hasil.rw.push(p);
    else if (golongan === "rt") hasil.rt.push(p);
    else hasil.lain.push(p);
  }
  const urutAngka = (a: Perangkat, b: Perangkat) => nomor(a.jabatan) - nomor(b.jabatan);
  hasil.rw.sort(urutAngka);
  hasil.rt.sort(urutAngka);
  return hasil;
}

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
  // Urutan terkecil = Dukuh, tampil di kartu kepala struktur organisasi.
  // `seed.ts` sudah menaruhnya di urutan 0; panel admin memakai konvensi sama.
  const [kepala, ...sisa] = orang;
  const dukuh: Perangkat = kepala
    ? { id: kepala.id, nama: kepala.nama, jabatan: kepala.jabatan, foto: kepala.fotoUrl ?? AVATAR_DUKUH }
    : { id: "", nama: contoh.dukuh.nama, jabatan: contoh.dukuh.jabatan, foto: AVATAR_DUKUH };

  return {
    // Baris naskah bisa dihapus dari panel. Halaman publik tidak boleh 500
    // karenanya — bagian yang kosong cukup tampil kosong.
    sejarah: paragraf(naskah("sejarah")?.konten ?? ""),
    visi,
    misi,
    // Naskah yang belum ada diperlakukan sebagai draf: menandai DRAFT lebih
    // jujur daripada menayangkan bagian kosong seolah sudah disepakati.
    visiMisiDraft: visiMisi?.draft ?? true,
    dukuh,
    struktur: kelompokkan(
      sisa.map((p) => ({
        id: p.id,
        nama: p.nama,
        jabatan: p.jabatan,
        foto: p.fotoUrl ?? AVATAR_PERANGKAT,
      })),
    ),
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
