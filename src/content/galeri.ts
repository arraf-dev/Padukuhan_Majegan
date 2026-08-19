export const kategoriGaleri = [
  "Kegiatan Warga",
  "Pemerintahan",
  "Sosial",
  "Budaya",
  "Keagamaan",
  "Olahraga",
  "Lainnya",
] as const;

export type KategoriGaleri = (typeof kategoriGaleri)[number];
export type StatusGaleri = "draft" | "terbit";

export type FotoGaleri = {
  id: string;
  url: string;
  alt: string;
  caption: string;
  urutan: number;
  width: number | null;
  height: number | null;
  size: number | null;
};

export type AlbumGaleri = {
  id: string;
  judul: string;
  slug: string;
  deskripsi: string;
  kategori: KategoriGaleri;
  coverUrl: string | null;
  tanggalKegiatan: string;
  status: StatusGaleri;
  dibuatPada: string;
  diperbaruiPada: string;
  foto: FotoGaleri[];
};

const foto = (
  id: string,
  url: string,
  alt: string,
  caption: string,
  urutan: number,
): FotoGaleri => ({
  id,
  url,
  alt,
  caption,
  urutan,
  width: null,
  height: null,
  size: null,
});

const album = (data: AlbumGaleri): AlbumGaleri => data;

/**
 * Fixture visual untuk fase frontend. Kontraknya sengaja sama dengan bentuk
 * data yang akan dikembalikan query Prisma pada fase backend.
 */
export const albumGaleriDemo: AlbumGaleri[] = [
  album({
    id: "demo-kerja-bakti-majegan",
    judul: "Kerja Bakti Bersih Kali",
    slug: "kerja-bakti-bersih-kali",
    deskripsi:
      "Dokumentasi gotong royong warga RT 01-04 membersihkan Kali Majegan menjelang musim hujan.",
    kategori: "Kegiatan Warga",
    coverUrl: "/gambar/kerja-bakti.svg",
    tanggalKegiatan: "2026-08-17T07:00:00+07:00",
    status: "terbit",
    dibuatPada: "2026-08-17T10:00:00+07:00",
    diperbaruiPada: "2026-08-17T10:00:00+07:00",
    foto: [
      foto(
        "demo-kerja-bakti-1",
        "/gambar/kerja-bakti.svg",
        "Warga Padukuhan Majegan bergotong royong membersihkan kali",
        "Warga mulai membersihkan bantaran kali sejak pagi.",
        0,
      ),
      foto(
        "demo-kerja-bakti-2",
        "/gambar/sawah.svg",
        "Warga Majegan mengangkut sampah dari saluran air",
        "Sampah yang terkumpul dipilah sebelum diangkut.",
        1,
      ),
      foto(
        "demo-kerja-bakti-3",
        "/gambar/cor-jalan.svg",
        "Pemuda Majegan membantu kerja bakti di sekitar jembatan",
        "Karang Taruna membantu menyiapkan alat kerja.",
        2,
      ),
      foto(
        "demo-kerja-bakti-4",
        "/gambar/balai-dusun.svg",
        "Warga berkumpul setelah kegiatan kerja bakti selesai",
        "Kegiatan ditutup dengan makan bersama di balai dusun.",
        3,
      ),
    ],
  }),
  album({
    id: "demo-hut-ri-81",
    judul: "HUT RI ke-81 Padukuhan Majegan",
    slug: "hut-ri-81-padukuhan-majegan",
    deskripsi:
      "Momen kebersamaan warga dalam rangkaian peringatan kemerdekaan di Padukuhan Majegan.",
    kategori: "Kegiatan Warga",
    coverUrl: "/gambar/merti-dusun.svg",
    tanggalKegiatan: "2026-08-16T15:30:00+07:00",
    status: "terbit",
    dibuatPada: "2026-08-16T20:00:00+07:00",
    diperbaruiPada: "2026-08-16T20:00:00+07:00",
    foto: [
      foto(
        "demo-hut-ri-1",
        "/gambar/merti-dusun.svg",
        "Warga Majegan mengikuti perayaan HUT RI ke-81",
        "Warga berkumpul di halaman balai dusun.",
        0,
      ),
      foto(
        "demo-hut-ri-2",
        "/gambar/balai-dusun.svg",
        "Anak-anak Majegan mengikuti kegiatan kemerdekaan",
        "Anak-anak ikut meramaikan lomba kemerdekaan.",
        1,
      ),
      foto(
        "demo-hut-ri-3",
        "/gambar/pengumuman.svg",
        "Papan informasi rangkaian HUT RI di Majegan",
        "Jadwal kegiatan dibagikan ke setiap RT.",
        2,
      ),
    ],
  }),
  album({
    id: "demo-merti-dusun-2026",
    judul: "Merti Dusun Majegan 2026",
    slug: "merti-dusun-majegan-2026",
    deskripsi:
      "Kirab budaya, kenduri bersama, dan pentas karawitan anak dalam merti dusun tahun 2026.",
    kategori: "Budaya",
    coverUrl: "/gambar/merti-dusun.svg",
    tanggalKegiatan: "2026-07-27T15:00:00+07:00",
    status: "terbit",
    dibuatPada: "2026-07-28T09:00:00+07:00",
    diperbaruiPada: "2026-07-28T09:00:00+07:00",
    foto: [
      foto(
        "demo-merti-1",
        "/gambar/merti-dusun.svg",
        "Kirab budaya Merti Dusun Majegan",
        "Kirab berangkat dari Balai Dusun selepas ashar.",
        0,
      ),
      foto(
        "demo-merti-2",
        "/gambar/panen.svg",
        "Hasil bumi warga dibawa dalam kirab budaya",
        "Gunungan hasil bumi menjadi bagian dari kirab.",
        1,
      ),
      foto(
        "demo-merti-3",
        "/gambar/balai-dusun.svg",
        "Warga mengikuti kenduri bersama di Majegan",
        "Kenduri bersama digelar di halaman balai dusun.",
        2,
      ),
    ],
  }),
  album({
    id: "demo-posyandu-agustus-2026",
    judul: "Posyandu Balita dan Lansia",
    slug: "posyandu-balita-lansia-agustus-2026",
    deskripsi:
      "Kegiatan rutin kader dan warga untuk memantau kesehatan balita serta lansia Majegan.",
    kategori: "Sosial",
    coverUrl: "/gambar/posyandu.svg",
    tanggalKegiatan: "2026-08-12T08:00:00+07:00",
    status: "terbit",
    dibuatPada: "2026-08-12T13:00:00+07:00",
    diperbaruiPada: "2026-08-12T13:00:00+07:00",
    foto: [
      foto(
        "demo-posyandu-1",
        "/gambar/posyandu.svg",
        "Kader melayani kegiatan posyandu di Balai Dusun Majegan",
        "Kader menyiapkan meja pelayanan sebelum warga datang.",
        0,
      ),
      foto(
        "demo-posyandu-2",
        "/gambar/balai-dusun.svg",
        "Warga mengikuti pemeriksaan kesehatan di posyandu",
        "Pemeriksaan balita dan lansia berlangsung di balai dusun.",
        1,
      ),
      foto(
        "demo-posyandu-3",
        "/gambar/panen.svg",
        "Konsumsi sehat dibagikan dalam kegiatan posyandu",
        "Kader membagikan makanan tambahan kepada peserta.",
        2,
      ),
    ],
  }),
  album({
    id: "demo-pelatihan-umkm-majegan",
    judul: "Pelatihan Olahan Pangan UMKM",
    slug: "pelatihan-olahan-pangan-umkm",
    deskripsi:
      "Pelaku usaha rumahan belajar pengemasan dan perizinan produk pangan bersama pendamping kapanewon.",
    kategori: "Pemerintahan",
    coverUrl: "/gambar/balai-dusun.svg",
    tanggalKegiatan: "2026-07-09T09:00:00+07:00",
    status: "terbit",
    dibuatPada: "2026-07-09T15:00:00+07:00",
    diperbaruiPada: "2026-07-09T15:00:00+07:00",
    foto: [
      foto(
        "demo-umkm-1",
        "/gambar/balai-dusun.svg",
        "Pelaku UMKM mengikuti pelatihan di Balai Dusun Majegan",
        "Pelatihan berlangsung di ruang pertemuan balai dusun.",
        0,
      ),
      foto(
        "demo-umkm-2",
        "/gambar/panen.svg",
        "Peserta menata hasil olahan pangan untuk latihan kemasan",
        "Peserta mempraktikkan cara menata produk sebelum dikemas.",
        1,
      ),
      foto(
        "demo-umkm-3",
        "/gambar/sawah.svg",
        "Pendamping menjelaskan potensi bahan pangan lokal Majegan",
        "Bahan pangan lokal menjadi bagian dari diskusi usaha.",
        2,
      ),
    ],
  }),
  album({
    id: "demo-persiapan-lomba-agustusan",
    judul: "Persiapan Lomba Agustusan",
    slug: "persiapan-lomba-agustusan",
    deskripsi: "Rapat panitia dan persiapan awal lomba kemerdekaan tingkat padukuhan.",
    kategori: "Olahraga",
    coverUrl: "/gambar/pengumuman.svg",
    tanggalKegiatan: "2026-08-20T19:30:00+07:00",
    status: "draft",
    dibuatPada: "2026-08-18T10:00:00+07:00",
    diperbaruiPada: "2026-08-18T10:00:00+07:00",
    foto: [
      foto(
        "demo-lomba-1",
        "/gambar/pengumuman.svg",
        "Rapat persiapan lomba Agustusan Padukuhan Majegan",
        "Panitia menyusun jadwal dan kebutuhan perlombaan.",
        0,
      ),
      foto(
        "demo-lomba-2",
        "/gambar/kerja-bakti.svg",
        "Pemuda Majegan menyiapkan area kegiatan lomba",
        "Area kegiatan mulai disiapkan oleh panitia.",
        1,
      ),
    ],
  }),
];
