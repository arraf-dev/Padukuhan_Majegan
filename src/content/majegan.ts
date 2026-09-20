/**
 * Seluruh isi situs untuk sementara ditaruh di sini.
 *
 * ponytail: konten statis, belum ada database. Angka & nama masih placeholder
 * berskala padukuhan sesuai catatan "Asumsi" pada mockup. Pindahkan ke Prisma +
 * Neon (skema Bab 8 PRD) begitu konten asli dari kalurahan turun — bentuk data
 * di bawah sudah mengikuti kolom yang direncanakan supaya migrasinya lurus.
 */

import { SITUS_KANONIK, urlSitusProduksi } from "../lib/env.ts";
import { sejarahResmi } from "./sejarah.ts";

export const desa = {
  nama: "Padukuhan Majegan",
  kalurahan: "Kalurahan Pandowoharjo",
  wilayah: "Kalurahan Pandowoharjo · Kapanewon Sleman · Daerah Istimewa Yogyakarta",
  wilayahSingkat: "Kalurahan Pandowoharjo · Kapanewon Sleman · DIY",
  domain: "www.majegan-pandowoharjo.id",
  alamat: ["Balai Dusun Majegan", "Majegan, Pandowoharjo,", "Kapanewon Sleman, DIY"],
  // Nomor resmi Padukuhan (Pak Dukuh) — per 30 Agustus 2026.
  whatsapp: "+62 851-5651-3401",
  whatsappUrl: "https://wa.me/6285156513401",
  email: "padukuhanmajegan@gmail.com",
  websiteKalurahan: "https://pandowoharjosid.slemankab.go.id/home/",
  // Akun Instagram resmi Padukuhan Majegan.
  instagramUrl: "https://www.instagram.com/majegansleman?stkn=NDdncDdsajQ1bWx4",
  // Isi setelah akun resmi TikTok dikonfirmasi; footer menampilkan ikon nonaktif
  // agar warga tidak diarahkan ke akun yang hanya ditebak dari nama.
  tiktokUrl: "",
  koordinat: [-7.69139, 110.37167] as const,
};

/** Alamat kanonik situs — dipakai metadataBase, sitemap, dan robots. */
export const situsUrl = urlSitusProduksi(process.env, SITUS_KANONIK)!;

export const statistik = [
  { angka: 1284, label: "jiwa penduduk" },
  { angka: 402, label: "kepala keluarga" },
  { angka: 8, label: "rukun tetangga" },
  { angka: 2, label: "rukun warga" },
];

/** Piramida usia — dipakai di teaser Beranda dan halaman Statistik. */
export const kelompokUsia = [
  { rentang: "0–14", persen: 34 },
  { rentang: "15–24", persen: 52 },
  { rentang: "25–44", persen: 100 },
  { rentang: "45–64", persen: 68 },
  { rentang: "65+", persen: 44 },
];

// Modul Transparansi Anggaran (APB-1/2/3, ADM-6) dihapus 28 Jul 2026 atas
// keputusan tim: publikasi APBDes butuh izin kalurahan yang tidak pasti turun
// dalam 6 minggu, sementara PRD menandainya "Penting", bukan "Wajib".
// Statistik penduduk tetap ada. Tabel `anggaran` sengaja ditinggal di skema
// (lihat schema.prisma) supaya modul ini bisa dihidupkan lagi tanpa migrasi.

export const navigasi = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/berita", label: "Berita" },
  { href: "/galeri", label: "Galeri" },
  { href: "/potensi", label: "Potensi" },
  { href: "/layanan", label: "Layanan" },
  { href: "/pengaduan", label: "Pengaduan" },
  { href: "/statistik", label: "Statistik" },
];

export const aksesCepat = [
  { href: "/layanan", label: "Layanan Surat", ringkas: "persyaratan & alur", ikon: "surat" },
  { href: "/pengaduan", label: "Kirim Pengaduan", ringkas: "form + tautan lampiran", ikon: "obrolan" },
  { href: "/berita", label: "Berita Warga", ringkas: "kabar terbaru dusun", ikon: "berita" },
  { href: "/profil", label: "Profil Padukuhan", ringkas: "sejarah & struktur", ikon: "warga" },
] as const;

export const kategoriBerita = ["Pengumuman", "Kegiatan", "Pembangunan"] as const;
export type KategoriBerita = (typeof kategoriBerita)[number];
export type FotoDokumentasiBerita = { url: string; alt: string; caption: string };

export type Berita = {
  slug: string;
  judul: string;
  kategori: KategoriBerita;
  tanggal: string; // ISO — diformat saat render
  lokasi: string;
  ringkasan: string;
  isi: string[]; // paragraf badan berita
  foto: string; // URL/path gambar sampul; "" = pakai placeholder
  fotoKeterangan: string; // teks alt saat gambar tampil, tulisan pil saat belum ada
  /** Foto tambahan di halaman detail berita. */
  fotoDokumentasi: FotoDokumentasiBerita[];
  /** Belum tayang untuk warga. Dipakai seed agar panel admin punya contoh draf. */
  draft?: boolean;
  suka: number;
  tanggapan: number;
};

export const profil = {
  sejarah: [...sejarahResmi.paragraf],
  // Ditandai DRAFT di mockup: rumusan resmi belum disepakati musyawarah dusun.
  visi:
    "Majegan yang majeg — teguh dalam gotong royong, kukuh menjaga tanah dan air — sebagai padukuhan agraris yang menyejahterakan warganya, merawat budayanya, dan bertumbuh bersama zaman tanpa kehilangan ruhnya.",
  misi: [
    "Menjaga ruh Majegan — gotong royong, merti dusun, dan kerukunan warga lintas RT dan RW yang berdampingan.",
    "Menguatkan pangan dan ekonomi padukuhan: mendampingi kelompok tani, kelompok kandang, Kelompok Wanita Tani, dan UMKM olahan pangan — dari hulu sawah hingga pasar.",
    "Melayani warga dengan cepat, adil, dan ramah: layanan surat yang ringkas melalui Balai Dusun dan saluran aspirasi yang menjangkau gang serta sudut kampung.",
    "Merawat kampung: sungai yang bersih, jalan yang mulus, pekarangan yang hijau, dan malam yang aman berkat ronda bersama.",
    "Menumbuhkan generasi: pendidikan anak, ruang kreatif remaja (sanggar karawitan, karang taruna), serta kesehatan ibu, balita, dan lansia lewat posyandu yang rutin.",
  ],
  visiMisiDraft: false,
  // Nama disetel "-" sampai konfirmasi nama resmi dari Pak Dukuh; kartu
  // menampilkan jabatan saja. Admin bisa mengisinya kapan pun via panel.
  dukuh: { nama: "-", jabatan: "Dukuh Majegan" },
  perangkat: [
    // Struktur resmi per poster Padukuhan (bagan struktur organisasi).
    { nama: "-", jabatan: "LPMKal Sub Unit Majegan" },
    { nama: "-", jabatan: "Ketua PKK" },
    { nama: "-", jabatan: "Ketua Karang Taruna" },
    { nama: "-", jabatan: "Ketua Kelompok Kandang" },
    { nama: "-", jabatan: "Ketua Kelompok Tani" },
    { nama: "-", jabatan: "Ketua Organisasi Kemasyarakatan Lain" },
    { nama: "-", jabatan: "Ketua RW 32" },
    { nama: "-", jabatan: "Ketua RW 33" },
    { nama: "-", jabatan: "Ketua RT 1" },
    { nama: "-", jabatan: "Ketua RT 2" },
    { nama: "-", jabatan: "Ketua RT 3" },
    { nama: "-", jabatan: "Ketua RT 4" },
    { nama: "-", jabatan: "Ketua RT 5" },
  ],
  catatanStruktur: "Bagan resmi dapat diunduh pada gambar struktur — nama dan foto perangkat menyusul konfirmasi Pak Dukuh.",
  catatanPeta: "Batas resmi padukuhan belum tersedia di data publik — area ditandai sebagai perkiraan.",
};

export type Layanan = {
  slug: string;
  nama: string;
  namaSingkat: string;
  biaya: string;
  deskripsi: string;
  syarat: string[];
  alur: { judul: string; detail: string }[];
  berkas?: { nama: string; url?: string };
};

const alurStandar = [
  { judul: "Siapkan berkas persyaratan", detail: "Lengkapi berkas di samping." },
  { judul: "Datang ke Balai Dusun", detail: "Serahkan berkas ke perangkat dusun." },
  { judul: "Verifikasi oleh perangkat", detail: "Berkas diperiksa dan dicatat." },
  { judul: "Surat ditandatangani & diambil", detail: "Lanjut diproses di kalurahan bila perlu." },
];

export const layanan: Layanan[] = [
  {
    slug: "pembuatan-e-ktp",
    nama: "Pembuatan E-KTP",
    namaSingkat: "Pembuatan E-KTP",
    biaya: "GRATIS",
    deskripsi:
      "Pengurusan pembuatan E-KTP di Kalurahan Pandowoharjo/Dukcapil — pengantar disiapkan lewat padukuhan hingga surat pengantar dari kalurahan.",
    syarat: [
      "Surat pengantar **RT**, **RW**, dan **Dukuh**",
      "Surat pengantar dari **Kalurahan**",
      "Fotokopi **Kartu Keluarga**",
      "Fotokopi **Akta Kelahiran**",
      "Bila kehilangan E-KTP: ditambah surat keterangan kehilangan dari **Kepolisian**",
    ],
    alur: alurStandar,
  },
  {
    slug: "kartu-keluarga",
    nama: "Pembuatan Kartu Keluarga",
    namaSingkat: "Pembuatan Kartu Keluarga",
    biaya: "GRATIS",
    deskripsi:
      "Pengurusan pembuatan/perubahan Kartu Keluarga di kalurahan — pengantar disiapkan lewat padukuhan hingga surat pengantar dari kalurahan.",
    syarat: [
      "Surat pengantar **RT**, **RW**, dan **Dukuh**",
      "Surat pengantar dari **Kalurahan**",
      "Fotokopi **Kartu Keluarga** lama dan **KTP**",
      "Bila kehilangan: ditambah surat keterangan kehilangan dari **Kepolisian**",
    ],
    alur: alurStandar,
  },
  {
    slug: "pembuatan-akta-kelahiran",
    nama: "Pembuatan Akta Kelahiran",
    namaSingkat: "Pembuatan Akta Kelahiran",
    biaya: "GRATIS",
    deskripsi:
      "Pengurusan akta kelahiran untuk pengesahan anak — berkas dari kalurahan setempat dengan fotokopi legalisir orang tua.",
    syarat: [
      "Surat pengantar **RT**, **RW**, dan **Dukuh**",
      "Surat pengantar dari **Kalurahan setempat**",
      "Fotokopi **KTP orang tua** (legalisir)",
      "Fotokopi **Kartu Keluarga** (legalisir)",
      "Fotokopi **buku nikah orang tua** (legalisir)",
      "Surat keterangan kelahiran dari **Rumah Sakit / Puskesmas / Bidan / Klinik**",
    ],
    alur: alurStandar,
  },
  {
    slug: "pembuatan-akta-kematian",
    nama: "Pembuatan Akta Kematian",
    namaSingkat: "Pembuatan Akta Kematian",
    biaya: "GRATIS",
    deskripsi:
      "Pengurusan akta kematian untuk pengesahan warga yang berpulang — dilengkapi data almarhum, ahli waris, dan dua orang saksi.",
    syarat: [
      "Surat pengantar **RT**, **RW**, dan **Dukuh**",
      "Surat pengantar dari **Kalurahan**",
      "Fotokopi **KTP dan KK almarhum**",
      "Fotokopi **KTP dan KK ahli waris**",
      "Fotokopi **KTP dua orang saksi**",
      "Surat keterangan kematian dari **Rumah Sakit** — atau **berita lelaya** bila meninggal di rumah",
    ],
    alur: alurStandar,
  },
  {
    slug: "surat-pindah-penduduk",
    nama: "Surat Masuk atau Keluar Penduduk",
    namaSingkat: "Surat Pindah Penduduk",
    biaya: "GRATIS",
    deskripsi:
      "Pengurusan pindah masuk/keluar penduduk — berkas lengkap dengan surat keterangan pindah atau cabut berkas pindah penduduk.",
    syarat: [
      "Surat pengantar **RT**, **RW**, dan **Dukuh**",
      "Surat pengantar dari **Kalurahan**",
      "Surat keterangan **pindah / cabut berkas pindah penduduk**",
      "Fotokopi **Kartu Keluarga dan KTP lama**",
      "Fotokopi **buku nikah** (bila sudah menikah)",
    ],
    alur: alurStandar,
  },
  {
    slug: "surat-keterangan-usaha",
    nama: "Surat Pengajuan Surat Keterangan Usaha",
    namaSingkat: "Surat Keterangan Usaha",
    biaya: "GRATIS",
    deskripsi:
      "Pengajuan surat keterangan usaha — biasanya dipakai pelaku UMKM saat mengajukan izin, pembiayaan, atau berpartisipasi pada program kemitraan.",
    syarat: [
      "Surat pengantar **RT**, **RW**, dan **Dukuh**",
      "Pengisian **form usaha** melalui tautan dari Kalurahan (tautan disampaikan saat mengajukan)",
      "Fotokopi **KTP**",
    ],
    alur: alurStandar,
  },
  {
    slug: "surat-domisili-perusahaan",
    nama: "Surat Domisili Perusahaan",
    namaSingkat: "Surat Domisili Perusahaan",
    biaya: "GRATIS",
    deskripsi:
      "Keterangan domisili bagi badan usaha/usaha yang menempati wilayah padukuhan — untuk perizinan dan administrasi perusahaan.",
    syarat: [
      "Surat pengantar **RT**, **RW**, dan **Dukuh**",
      "Surat pengantar dari **Kalurahan**",
      "**Akta pendirian** perusahaan",
      "Fotokopi **KTP direktur/pemilik** perusahaan",
    ],
    alur: [
      { judul: "Siapkan berkas persyaratan", detail: "Lengkapi berkas di samping." },
      { judul: "Datang ke Balai Dusun", detail: "Serahkan berkas ke perangkat dusun." },
      { judul: "Verifikasi oleh perangkat", detail: "Berkas diperiksa dan dicatat." },
      { judul: "Surat ditandatangani & diambil", detail: "Lanjut diproses di kalurahan bila perlu." },
    ],
  },
  {
    slug: "surat-keterangan-tidak-mampu",
    nama: "Surat Keterangan Tidak Mampu",
    namaSingkat: "Surat Ket. Tidak Mampu",
    biaya: "GRATIS",
    deskripsi:
      "Keterangan tidak mampu untuk keperluan bantuan pendidikan, kesehatan, jaminan sosial, atau program bantuan lainnya.",
    syarat: [
      "Surat pengantar **RT**, **RW**, dan **Dukuh**",
      "Fotokopi **Kartu Keluarga** dan **E-KTP**",
      "Fotokopi **kartu jaminan sosial** (jika ada)",
    ],
    alur: alurStandar,
  },
];

export const kategoriPengaduan = [
  "Infrastruktur",
  "Kebersihan",
  "Keamanan",
  "Pelayanan",
  "Lainnya",
] as const;

export const alurPengaduan = [
  "Kirim laporan — langsung tersimpan aman",
  "Perangkat dusun meninjau & memproses",
  "Anda dihubungi lewat kontak bila diperlukan",
];

/* ---------- Panel admin ---------- */

export type Peran = "superadmin" | "admin";

/** Matriks 3 peran — `bisa: false` ditandai gembok, bukan centang. */
export const peranPengguna = [
  {
    tanda: "TANPA LOGIN",
    nama: "Warga",
    catatan: "",
    sorot: false,
    hak: [
      { teks: "Melihat semua halaman publik", bisa: true },
      { teks: "Mengirim pengaduan dengan identitas", bisa: true },
      { teks: "Tidak bisa masuk panel admin", bisa: false },
    ],
  },
  {
    tanda: "LOGIN",
    nama: "Admin",
    catatan: "perangkat & karang taruna",
    sorot: false,
    hak: [
      { teks: "Menulis, mengedit & menayangkan berita", bisa: true },
      { teks: "Membaca & menanggapi pengaduan warga", bisa: true },
      { teks: "Profil, struktur, layanan & statistik terkunci", bisa: false },
      { teks: "Tidak bisa kelola akun & hapus permanen", bisa: false },
    ],
  },
  {
    tanda: "LOGIN · AKSES PENUH",
    nama: "SuperAdmin",
    catatan: "Dukuh",
    sorot: true,
    hak: [
      { teks: "Semua kemampuan Admin", bisa: true },
      { teks: "Kelola profil, struktur, layanan & statistik", bisa: true },
      { teks: "Tambah / nonaktifkan akun Admin", bisa: true },
      { teks: "Hapus konten & arsip pengaduan", bisa: true },
    ],
  },
];

export const akun: Record<Peran, { nama: string; jabatan: string; sapaan: string }> = {
  superadmin: { nama: "Sarjiman, S.Pd.", jabatan: "Dukuh · Super Admin", sapaan: "Pak Dukuh" },
  admin: { nama: "Rina Putri", jabatan: "Karang Taruna · Admin", sapaan: "Mbak Rina" },
};

export const ringkasanAdmin: Record<Peran, { label: string; angka: number; catatan: string; sorot?: boolean; bata?: boolean }[]> = {
  superadmin: [
    { label: "BERITA TERBIT", angka: 24, catatan: "2 draft menunggu" },
    { label: "PENGADUAN BARU", angka: 3, catatan: "minggu ini", sorot: true },
    { label: "BELUM DITANGGAPI", angka: 5, catatan: "tertua: 4 hari", bata: true },
  ],
  admin: [
    { label: "BERITA SAYA", angka: 8, catatan: "1 draf belum tayang" },
    { label: "PENGADUAN BARU", angka: 3, catatan: "minggu ini", sorot: true },
    { label: "BELUM DITANGGAPI", angka: 5, catatan: "tertua: 4 hari", bata: true },
  ],
};

/**
 * Menu panel admin.
 * `superadmin: true` = terkunci untuk peran Admin (matriks peran).
 */
export const menuAdmin = [
  { href: "/admin", label: "Dashboard", ikon: "kisi" as const },
  { href: "/admin/berita", label: "Berita", ikon: "berita" as const },
  { href: "/admin/galeri", label: "Galeri", ikon: "foto" as const },
  { href: "/admin/potensi", label: "Potensi", ikon: "rumah" as const },
  { href: "/admin/pengaduan", label: "Pengaduan", ikon: "obrolan" as const },
  { href: "/admin/akun", label: "Akun & Pengguna", ikon: "warga" as const },
  { href: "/admin/profil", label: "Profil & Struktur", ikon: "warga" as const, superadmin: true },
  { href: "/admin/layanan", label: "Layanan", ikon: "surat" as const, superadmin: true },
  { href: "/admin/statistik", label: "Statistik", ikon: "batang" as const, superadmin: true },
];
