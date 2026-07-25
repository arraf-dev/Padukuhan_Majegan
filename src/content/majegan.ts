/**
 * Seluruh isi situs untuk sementara ditaruh di sini.
 *
 * ponytail: konten statis, belum ada database. Angka & nama masih placeholder
 * berskala padukuhan sesuai catatan "Asumsi" pada mockup. Pindahkan ke Prisma +
 * Neon (skema Bab 8 PRD) begitu konten asli dari kalurahan turun — bentuk data
 * di bawah sudah mengikuti kolom yang direncanakan supaya migrasinya lurus.
 */

export const desa = {
  nama: "Padukuhan Majegan",
  kalurahan: "Kalurahan Pandowoharjo",
  wilayah: "Kalurahan Pandowoharjo · Kapanewon Sleman · Daerah Istimewa Yogyakarta",
  wilayahSingkat: "Kalurahan Pandowoharjo · Kapanewon Sleman · DIY",
  domain: "majegan.pandowoharjo.desa.id",
  alamat: ["Balai Dusun Majegan", "Majegan RT 02/RW 01, Pandowoharjo,", "Kapanewon Sleman, DIY 55512"],
  whatsapp: "0812-2700-xxxx",
  // ponytail: nomor masih placeholder — ganti ke nomor asli, wa.me butuh format 62xxx.
  whatsappUrl: "https://wa.me/6281227000000",
  email: "majegan@pandowoharjo.desa.id",
  koordinat: [-7.69139, 110.37167] as const,
};

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

export const navigasi = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/berita", label: "Berita" },
  { href: "/layanan", label: "Layanan" },
  { href: "/pengaduan", label: "Pengaduan" },
  { href: "/statistik", label: "Statistik" },
];

export const aksesCepat = [
  { href: "/layanan", label: "Layanan Surat", ringkas: "persyaratan & alur", ikon: "surat" },
  { href: "/pengaduan", label: "Kirim Pengaduan", ringkas: "form + lampiran", ikon: "obrolan" },
  { href: "/berita", label: "Berita Warga", ringkas: "kabar terbaru dusun", ikon: "berita" },
  { href: "/profil", label: "Profil Padukuhan", ringkas: "sejarah & struktur", ikon: "warga" },
] as const;

export const kategoriBerita = ["Pengumuman", "Kegiatan", "Pembangunan"] as const;
export type KategoriBerita = (typeof kategoriBerita)[number];

export type Berita = {
  slug: string;
  judul: string;
  kategori: KategoriBerita;
  tanggal: string; // ISO — diformat saat render
  lokasi: string;
  ringkasan: string;
  foto: string; // keterangan placeholder sampai foto asli masuk
  suka: number;
  tanggapan: number;
};

export const berita: Berita[] = [
  {
    slug: "merti-dusun-majegan-2026",
    judul: "Merti Dusun Majegan 2026",
    kategori: "Kegiatan",
    tanggal: "2026-07-17",
    lokasi: "Balai Dusun Majegan",
    ringkasan:
      "Kirab budaya keliling padukuhan, kenduri bersama, dan pentas karawitan anak — sampai jumpa akhir Juli!",
    foto: "Foto merti dusun",
    suka: 132,
    tanggapan: 12,
  },
  {
    slug: "kerja-bakti-bersih-kali",
    judul: "Kerja Bakti Bersih Kali",
    kategori: "Kegiatan",
    tanggal: "2026-07-15",
    lokasi: "Kali Majegan",
    ringkasan:
      "Warga RT 01–04 bergotong royong membersihkan kali jelang musim hujan. Matur nuwun bapak-ibu yang sudah hadir!",
    foto: "Foto kerja bakti",
    suka: 87,
    tanggapan: 8,
  },
  {
    slug: "jadwal-posyandu-agustus",
    judul: "Jadwal Posyandu Agustus",
    kategori: "Pengumuman",
    tanggal: "2026-07-14",
    lokasi: "Balai Dusun Majegan",
    ringkasan:
      "Posyandu balita & lansia bulan Agustus sudah terjadwal — cek papan pengumuman atau hubungi kader terdekat.",
    foto: "Foto posyandu",
    suka: 45,
    tanggapan: 3,
  },
  {
    slug: "pengecoran-jalan-tahap-ii",
    judul: "Pengecoran Jalan Tahap II",
    kategori: "Pembangunan",
    tanggal: "2026-07-13",
    lokasi: "Jalan RT 03",
    ringkasan:
      "Pengerjaan dimulai pekan ini; akses sementara dialihkan lewat jalan kampung sisi barat. Mohon maaf atas ketidaknyamanannya.",
    foto: "Foto pengecoran jalan",
    suka: 64,
    tanggapan: 5,
  },
];

export const pengumuman = [
  { tanggal: "2026-07-18", teks: "Pembagian bantuan bibit cabai untuk anggota KWT Majegan" },
  { tanggal: "2026-07-16", teks: "Pendataan ulang penerima BLT-DD tahap III — hubungi Ketua RT" },
  { tanggal: "2026-07-12", teks: "Rapat rutin RT/RW — Sabtu pukul 20.00 di Balai Dusun" },
  { tanggal: "2026-07-08", teks: "Jadwal ronda bulan Agustus telah ditempel di pos kamling" },
];

export const profil = {
  sejarah: [
    'Majegan adalah salah satu padukuhan tertua di Kalurahan Pandowoharjo. Namanya dipercaya berasal dari kata "majeg" — tetap dan kukuh — merujuk pada warga yang teguh menetap dan menggarap lahan di kawasan ini sejak masa Kasultanan.',
    "Kini Majegan berkembang menjadi permukiman agraris dengan 8 RT dalam 2 RW, ditopang pertanian padi, kelompok wanita tani, serta UMKM olahan pangan. Balai Dusun Majegan menjadi pusat kegiatan warga — dari posyandu, rapat RT, hingga merti dusun tahunan.",
  ],
  // Ditandai DRAFT di mockup: rumusan resmi belum disepakati musyawarah dusun.
  visi: "Rumusan visi sedang disusun bersama perangkat dusun dan tokoh masyarakat — ditayangkan setelah disepakati.",
  misi: ["Butir misi menyusul setelah musyawarah dusun…", "Butir misi menyusul…"],
  visiMisiDraft: true,
  dukuh: { nama: "Sarjiman, S.Pd.", jabatan: "Dukuh Majegan" },
  perangkat: [
    { nama: "Sumarno", jabatan: "Ketua RW 01" },
    { nama: "Dwi Hartana", jabatan: "Ketua RW 02" },
    { nama: "Sri Lestari", jabatan: "Ketua PKK" },
    { nama: "Agus Riyanto", jabatan: "Ketua Karang Taruna" },
  ],
  catatanStruktur: "+ 8 Ketua RT (RT 01–08) · daftar lengkap dikelola dari panel admin",
  catatanPeta: "Batas resmi padukuhan belum tersedia di data publik — area ditandai sebagai perkiraan.",
};

export type Layanan = {
  slug: string;
  nama: string;
  namaSingkat: string;
  durasi: string;
  biaya: string;
  deskripsi: string;
  syarat: string[];
  alur: { judul: string; detail: string }[];
  berkas?: { nama: string; ukuran: string };
};

const alurStandar = [
  { judul: "Siapkan berkas persyaratan", detail: "Lengkapi berkas di samping." },
  { judul: "Datang ke Balai Dusun", detail: "Serahkan berkas ke perangkat dusun." },
  { judul: "Verifikasi oleh perangkat", detail: "Berkas diperiksa dan dicatat." },
  { judul: "Surat ditandatangani & diambil", detail: "Lanjut diproses di kalurahan bila perlu." },
];

export const layanan: Layanan[] = [
  {
    slug: "surat-pengantar-domisili",
    nama: "Surat Pengantar Domisili",
    namaSingkat: "Surat Pengantar Domisili",
    durasi: "± 1 hari kerja",
    biaya: "GRATIS",
    deskripsi:
      "Surat pengantar dari padukuhan untuk pengurusan keterangan domisili di Kalurahan Pandowoharjo — dipakai untuk keperluan sekolah, pekerjaan, perbankan, atau administrasi lainnya.",
    syarat: [
      "Fotokopi **KTP** pemohon (1 lembar)",
      "Fotokopi **Kartu Keluarga** (1 lembar)",
      "Surat pengantar **RT/RW** setempat",
    ],
    alur: alurStandar,
    berkas: { nama: "Templat-Formulir-Domisili.pdf", ukuran: "86 KB · bisa diisi di rumah" },
  },
  {
    slug: "surat-pengantar-ktp-kk",
    nama: "Surat Pengantar KTP / KK",
    namaSingkat: "Surat Pengantar KTP / KK",
    durasi: "± 1 hari kerja",
    biaya: "GRATIS",
    deskripsi:
      "Surat pengantar padukuhan untuk pembuatan atau perubahan KTP dan Kartu Keluarga di kalurahan.",
    syarat: [
      "Fotokopi **KTP** lama atau **akta kelahiran**",
      "Fotokopi **Kartu Keluarga** (1 lembar)",
      "Surat pengantar **RT/RW** setempat",
    ],
    alur: alurStandar,
  },
  {
    slug: "surat-keterangan-usaha",
    nama: "Surat Pengantar Keterangan Usaha",
    namaSingkat: "Surat Pengantar Keterangan Usaha",
    durasi: "± 1 hari kerja",
    biaya: "GRATIS",
    deskripsi:
      "Pengantar untuk keterangan usaha — biasanya dipakai pelaku UMKM saat mengajukan izin atau pembiayaan.",
    syarat: [
      "Fotokopi **KTP** pemilik usaha",
      "Fotokopi **Kartu Keluarga** (1 lembar)",
      "Surat pengantar **RT/RW** setempat",
    ],
    alur: alurStandar,
  },
  {
    slug: "surat-keterangan-tidak-mampu",
    nama: "Surat Pengantar Ket. Tidak Mampu",
    namaSingkat: "Surat Pengantar Ket. Tidak Mampu",
    durasi: "± 2 hari kerja",
    biaya: "GRATIS",
    deskripsi:
      "Pengantar keterangan tidak mampu untuk keperluan bantuan pendidikan, kesehatan, atau sosial.",
    syarat: [
      "Fotokopi **KTP** pemohon",
      "Fotokopi **Kartu Keluarga** (1 lembar)",
      "Surat pengantar **RT/RW** setempat",
    ],
    alur: alurStandar,
  },
  {
    slug: "surat-keterangan-kelahiran",
    nama: "Surat Pengantar Ket. Kelahiran",
    namaSingkat: "Surat Pengantar Ket. Kelahiran",
    durasi: "± 1 hari kerja",
    biaya: "GRATIS",
    deskripsi: "Pengantar keterangan kelahiran sebelum pengurusan akta di Dukcapil.",
    syarat: ["Fotokopi **Kartu Keluarga** orang tua", "Surat keterangan lahir dari **bidan/rumah sakit**"],
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
      { teks: "Mengirim pengaduan (boleh anonim)", bisa: true },
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

export type StatusPengaduan = "TERKIRIM" | "DIPROSES" | "SELESAI";

export const pengaduanTerbaru: { kode: string; isi: string; status: StatusPengaduan }[] = [
  { kode: "MJG-2607-4X9K", isi: "Lampu jalan RT 03 mati sejak tiga hari lalu…", status: "TERKIRIM" },
  { kode: "MJG-2607-7B2M", isi: "Sampah menumpuk di tepi kali dekat jembatan…", status: "DIPROSES" },
  { kode: "MJG-2606-9C1D", isi: "Usulan perbaikan saluran irigasi sawah blok timur…", status: "SELESAI" },
];

export const aksiCepatAdmin = [
  "Perbarui profil padukuhan",
  "Kelola daftar layanan",
  "Kelola akun admin",
  "Perbarui statistik penduduk",
];

/**
 * Menu panel admin.
 * `superadmin: true` = terkunci untuk peran Admin (matriks peran).
 * `belum: true` = modulnya memang belum dibangun, jadi tidak ditautkan.
 */
export const menuAdmin = [
  { href: "/admin", label: "Dashboard", ikon: "kisi" as const },
  { href: "/admin/berita/baru", label: "Berita", ikon: "berita" as const },
  { href: "/admin/pengaduan", label: "Pengaduan", ikon: "obrolan" as const, lencana: 3, belum: true },
  { href: "/admin/profil", label: "Profil & Struktur", ikon: "warga" as const, superadmin: true },
  { href: "/admin/layanan", label: "Layanan", ikon: "surat" as const, superadmin: true },
  { href: "/admin/statistik", label: "Statistik", ikon: "batang" as const, superadmin: true },
  { href: "/admin/akun", label: "Akun & Pengguna", ikon: "warga" as const, superadmin: true },
];
