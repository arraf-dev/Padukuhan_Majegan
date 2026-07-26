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

/**
 * Alamat kanonik situs — dipakai metadataBase, sitemap, dan robots.
 * ponytail: domain `.desa.id` belum aktif; saat deploy ke Vercel cukup set
 * NEXT_PUBLIC_URL di environment, tanpa mengubah kode.
 */
export const situsUrl = process.env.NEXT_PUBLIC_URL ?? `https://${desa.domain}`;

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

/**
 * Ringkasan anggaran padukuhan (APB-1/2/3).
 *
 * ponytail: angka contoh berskala padukuhan — izin publikasi APBDes belum turun
 * dari kalurahan (blocker Minggu 1 di TASKS.md). Halaman menandai dirinya sendiri
 * sebagai contoh selama `resmi: false`, jadi tidak ada risiko angka palsu
 * terbaca warga sebagai data resmi.
 */
export const anggaran = {
  tahun: 2026,
  resmi: false,
  diperbarui: "2026-07-20",
  pendapatan: 486_000_000,
  belanja: 412_500_000,
  sumber: [
    { nama: "Dana Desa (DD)", nominal: 268_000_000 },
    { nama: "Alokasi Dana Desa (ADD)", nominal: 142_000_000 },
    { nama: "Swadaya & partisipasi warga", nominal: 51_000_000 },
    { nama: "Pendapatan lain-lain", nominal: 25_000_000 },
  ],
  bidang: [
    { nama: "Pembangunan & infrastruktur", nominal: 196_000_000, catatan: "Cor jalan RT 03, talud kali" },
    { nama: "Pembinaan kemasyarakatan", nominal: 87_500_000, catatan: "PKK, karang taruna, merti dusun" },
    { nama: "Penyelenggaraan pemerintahan", nominal: 64_000_000, catatan: "Operasional balai dusun" },
    { nama: "Pemberdayaan masyarakat", nominal: 45_000_000, catatan: "KWT, pelatihan UMKM" },
    { nama: "Penanggulangan bencana & darurat", nominal: 20_000_000, catatan: "Cadangan tak terduga" },
  ],
};

export const navigasi = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/berita", label: "Berita" },
  { href: "/layanan", label: "Layanan" },
  { href: "/pengaduan", label: "Pengaduan" },
  { href: "/anggaran", label: "Anggaran" },
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
  isi: string[]; // paragraf badan berita
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
    isi: [
      "Merti Dusun Majegan tahun ini digelar pada akhir Juli, dibuka dengan kirab budaya keliling padukuhan yang berangkat dari Balai Dusun selepas ashar. Rombongan membawa gunungan hasil bumi sumbangan warga delapan RT.",
      "Selepas kirab, acara dilanjutkan kenduri bersama di halaman balai dusun. Panitia mengimbau warga membawa wadah sendiri untuk mengurangi sampah plastik.",
      "Malam harinya, anak-anak sanggar karawitan Majegan tampil membawakan gending-gending klasik. Warga dari padukuhan tetangga dipersilakan hadir — tempat duduk tersedia terbatas, datang lebih awal lebih baik.",
    ],
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
    isi: [
      "Sekitar tujuh puluh warga dari RT 01 sampai RT 04 turun ke Kali Majegan sejak pukul enam pagi. Sasaran utama adalah endapan sampah di sekitar jembatan yang tahun lalu sempat menyumbat aliran saat hujan deras.",
      "Karang Taruna menyiapkan alat berupa cangkul, arit, dan karung, sementara ibu-ibu PKK mengurus konsumsi. Total sampah yang terangkut mengisi penuh satu bak kendaraan pengangkut.",
      "Kerja bakti lanjutan untuk RT 05–08 dijadwalkan dua pekan berikutnya. Warga yang berhalangan hadir dipersilakan menyampaikan kabar ke ketua RT masing-masing.",
    ],
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
    isi: [
      "Posyandu balita berlangsung setiap Selasa minggu kedua, pukul 08.00–11.00 di Balai Dusun Majegan. Layanan mencakup penimbangan, pengukuran tinggi badan, imunisasi sesuai jadwal, serta pemberian makanan tambahan.",
      "Posyandu lansia menyusul pada Kamis minggu ketiga dengan jam yang sama. Tersedia pemeriksaan tekanan darah dan gula darah bekerja sama dengan Puskesmas Sleman.",
      "Orang tua diminta membawa buku KIA, dan peserta lansia membawa kartu berobat. Informasi lebih lanjut dapat ditanyakan ke kader posyandu di masing-masing RT.",
    ],
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
    isi: [
      "Pengecoran jalan tahap II menyasar ruas sepanjang kurang lebih 180 meter di wilayah RT 03, melanjutkan tahap I yang selesai tahun lalu. Pekerjaan didanai dari Dana Desa tahun anggaran berjalan.",
      "Selama pengerjaan, kendaraan roda empat dialihkan lewat jalan kampung sisi barat. Pengendara roda dua masih dapat melintas pada jam tertentu sesuai arahan petugas di lapangan.",
      "Perkiraan waktu pengerjaan sepuluh hari kerja, bergantung pada cuaca. Warga yang membutuhkan akses khusus — misalnya untuk keperluan darurat — dapat menghubungi ketua RT setempat.",
    ],
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

export type Pengaduan = {
  kode: string;
  isi: string;
  status: StatusPengaduan;
  tanggal: string;
  tanggapan?: string;
};

export const pengaduanTerbaru: Pengaduan[] = [
  {
    kode: "MJG-2607-4X9K",
    isi: "Lampu jalan RT 03 mati sejak tiga hari lalu…",
    status: "TERKIRIM",
    tanggal: "2026-07-22",
  },
  {
    kode: "MJG-2607-7B2M",
    isi: "Sampah menumpuk di tepi kali dekat jembatan…",
    status: "DIPROSES",
    tanggal: "2026-07-19",
    tanggapan: "Sudah dikoordinasikan dengan Karang Taruna, pengangkutan dijadwalkan akhir pekan ini.",
  },
  {
    kode: "MJG-2606-9C1D",
    isi: "Usulan perbaikan saluran irigasi sawah blok timur…",
    status: "SELESAI",
    tanggal: "2026-06-28",
    tanggapan: "Perbaikan selesai dikerjakan bersama kelompok tani pada 8 Juli 2026. Terima kasih atas usulannya.",
  },
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
  { href: "/admin/berita", label: "Berita", ikon: "berita" as const },
  { href: "/admin/pengaduan", label: "Pengaduan", ikon: "obrolan" as const },
  { href: "/admin/profil", label: "Profil & Struktur", ikon: "warga" as const, superadmin: true, belum: true },
  { href: "/admin/layanan", label: "Layanan", ikon: "surat" as const, superadmin: true, belum: true },
  { href: "/admin/statistik", label: "Statistik", ikon: "batang" as const, superadmin: true, belum: true },
  { href: "/admin/akun", label: "Akun & Pengguna", ikon: "warga" as const, superadmin: true, belum: true },
];
