import type { FotoDokumentasiBerita, KategoriBerita } from "./majegan.ts";

export const SLUG_BERITA_POSYANDU_LANSIA = "posyandu-lansia-padukuhan-majegan";

export const BERITA_POSYANDU_LANSIA = {
  judul: "Posyandu Lansia Padukuhan Majegan",
  slug: SLUG_BERITA_POSYANDU_LANSIA,
  kategori: "Kegiatan" satisfies KategoriBerita,
  lokasi: "Padukuhan Majegan",
  ringkasan:
    "Kader Posyandu Lansia Padukuhan Majegan mendampingi pemeriksaan kesehatan dasar bagi warga lanjut usia agar kondisi kesehatan mereka dapat dipantau secara berkala.",
  konten:
    "Posyandu Lansia Padukuhan Majegan menjadi ruang pendampingan kesehatan bagi warga lanjut usia. Kader mendampingi peserta selama pemeriksaan kesehatan dasar dan mencatat hasilnya untuk pemantauan berkala.\n\nMelalui kegiatan ini, warga lansia mendapat perhatian kesehatan lebih dekat di lingkungan tempat tinggalnya. Keluarga diharapkan tetap mendampingi lansia dan menghubungi kader apabila membutuhkan informasi kegiatan berikutnya.",
  gambarSampul: "/gambar/berita/posyandu-lansia-pemeriksaan.png",
  fotoDokumentasi: [
    {
      url: "/gambar/berita/posyandu-lansia-pemeriksaan.png",
      alt: "Kader Posyandu Lansia mendampingi pemeriksaan kesehatan warga lanjut usia di Padukuhan Majegan.",
      caption: "Pemeriksaan kesehatan dasar untuk warga lanjut usia.",
    },
    {
      url: "/gambar/berita/posyandu-lansia-pendampingan.png",
      alt: "Pendampingan pemeriksaan kesehatan dasar bagi warga lanjut usia dalam Posyandu Lansia Padukuhan Majegan.",
      caption: "Pendampingan kader selama kegiatan Posyandu Lansia.",
    },
  ] satisfies FotoDokumentasiBerita[],
} as const;
