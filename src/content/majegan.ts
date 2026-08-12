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

/** Alamat kanonik situs — dipakai metadataBase, sitemap, dan robots. */
const situsDariEnv = process.env.NEXT_PUBLIC_URL?.trim();
if (!situsDariEnv && process.env.NODE_ENV === "production") {
  throw new Error("NEXT_PUBLIC_URL belum diset di environment production");
}
export const situsUrl = situsDariEnv ?? `https://${desa.domain}`;

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
  /** Belum tayang untuk warga. Dipakai seed agar panel admin punya contoh draf. */
  draft?: boolean;
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
    foto: "/gambar/merti-dusun.svg",
    fotoKeterangan: "Kirab budaya Merti Dusun Majegan",
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
    foto: "/gambar/kerja-bakti.svg",
    fotoKeterangan: "Warga bergotong royong membersihkan Kali Majegan",
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
    foto: "/gambar/posyandu.svg",
    fotoKeterangan: "Kegiatan posyandu balita di Balai Dusun Majegan",
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
    foto: "/gambar/cor-jalan.svg",
    fotoKeterangan: "Pengecoran jalan lingkungan RT 03",
    suka: 64,
    tanggapan: 5,
  },
  {
    slug: "panen-raya-kwt-majegan",
    judul: "Panen Raya Kelompok Wanita Tani",
    kategori: "Kegiatan",
    tanggal: "2026-07-06",
    lokasi: "Lahan KWT, blok timur",
    ringkasan:
      "Panen perdana cabai dan terong dari lahan pekarangan bersama KWT Majegan — hasilnya dibagi rata ke 34 anggota.",
    isi: [
      "Kelompok Wanita Tani Majegan memanen hasil pertama dari lahan pekarangan bersama seluas seperempat hektare di blok timur. Tanaman yang dipanen berupa cabai rawit, terong ungu, dan kacang panjang, ditanam sejak awal April.",
      "Sebagian hasil panen dibagi rata kepada tiga puluh empat anggota, sisanya dijual ke pasar dusun dan hasilnya masuk kas kelompok untuk membeli bibit musim berikutnya.",
      "Ketua KWT menyampaikan bahwa lahan tahap kedua sedang disiapkan di sebelah selatan, dan warga yang berminat bergabung dapat mendaftar melalui ketua RT masing-masing.",
    ],
    foto: "/gambar/panen.svg",
    fotoKeterangan: "Panen cabai dan terong bersama Kelompok Wanita Tani Majegan",
    suka: 96,
    tanggapan: 11,
  },
  {
    slug: "jadwal-ronda-agustus-2026",
    judul: "Jadwal Ronda Malam Bulan Agustus",
    kategori: "Pengumuman",
    tanggal: "2026-07-04",
    lokasi: "Pos Kamling Majegan",
    ringkasan:
      "Jadwal ronda Agustus sudah ditempel di pos kamling dan dibagikan ke grup WhatsApp tiap RT.",
    isi: [
      "Jadwal ronda malam untuk bulan Agustus telah disusun dan ditempel di pos kamling. Pembagian regu mengikuti pola yang sama seperti bulan sebelumnya, dengan penyesuaian pada minggu perayaan kemerdekaan.",
      "Warga yang berhalangan pada jadwalnya diminta mencari pengganti sendiri dan mengabari koordinator RT paling lambat sehari sebelumnya, agar pos tidak kosong.",
    ],
    foto: "/gambar/pengumuman.svg",
    fotoKeterangan: "Papan pengumuman jadwal ronda di pos kamling",
    suka: 23,
    tanggapan: 2,
  },
  {
    slug: "perbaikan-saluran-irigasi-blok-timur",
    judul: "Perbaikan Saluran Irigasi Blok Timur Rampung",
    kategori: "Pembangunan",
    tanggal: "2026-06-28",
    lokasi: "Saluran irigasi blok timur",
    ringkasan:
      "Saluran sepanjang 180 meter selesai diperbaiki bersama kelompok tani — aliran ke sawah bagian hilir kembali lancar.",
    isi: [
      "Perbaikan saluran irigasi blok timur sepanjang seratus delapan puluh meter selesai dikerjakan. Pekerjaan mencakup pengerukan endapan lumpur dan penambalan dinding saluran yang bocor di tiga titik.",
      "Pengerjaan dilakukan bergotong royong bersama kelompok tani selama empat hari, dengan material dari dana pembangunan padukuhan tahun berjalan.",
      "Petani di bagian hilir melaporkan aliran air sudah kembali normal. Pemeliharaan rutin akan dijadwalkan tiap awal musim tanam.",
    ],
    foto: "/gambar/sawah.svg",
    fotoKeterangan: "Saluran irigasi blok timur setelah diperbaiki",
    suka: 71,
    tanggapan: 6,
  },
  {
    slug: "pendataan-blt-dd-tahap-tiga",
    judul: "Pendataan Ulang Penerima BLT-DD Tahap III",
    kategori: "Pengumuman",
    tanggal: "2026-06-20",
    lokasi: "Balai Dusun Majegan",
    ringkasan:
      "Warga penerima BLT-DD diminta melapor ke Ketua RT untuk verifikasi data sebelum akhir bulan.",
    isi: [
      "Pendataan ulang penerima Bantuan Langsung Tunai Dana Desa tahap ketiga sedang berlangsung. Verifikasi bertujuan memastikan data penerima masih sesuai keadaan terkini, termasuk perubahan alamat maupun keadaan keluarga.",
      "Warga yang terdaftar dimohon melapor ke ketua RT dengan membawa kartu keluarga dan KTP. Bagi yang tidak dapat hadir karena sakit atau berada di luar kota, dapat diwakilkan anggota keluarga serumah.",
      "Data yang tidak terverifikasi sampai akhir bulan akan ditinjau kembali bersama perangkat kalurahan.",
    ],
    foto: "/gambar/pengumuman.svg",
    fotoKeterangan: "Pengumuman pendataan BLT-DD di balai dusun",
    suka: 41,
    tanggapan: 9,
  },
  {
    slug: "pelatihan-olahan-pangan-umkm",
    judul: "Pelatihan Olahan Pangan untuk Pelaku UMKM",
    kategori: "Kegiatan",
    tanggal: "2026-06-14",
    lokasi: "Balai Dusun Majegan",
    ringkasan:
      "Dua puluh pelaku usaha rumahan belajar pengemasan dan perizinan produk pangan bersama pendamping dari kapanewon.",
    isi: [
      "Sebanyak dua puluh pelaku usaha rumahan mengikuti pelatihan pengolahan dan pengemasan produk pangan di Balai Dusun Majegan. Materi disampaikan pendamping UMKM dari kapanewon.",
      "Selain teknik pengemasan, peserta juga dibimbing mengurus perizinan produk rumah tangga agar produknya dapat dipasarkan lebih luas, termasuk ke toko oleh-oleh di kota.",
      "Pelatihan lanjutan mengenai pemasaran melalui media sosial direncanakan digelar bulan depan.",
    ],
    foto: "/gambar/balai-dusun.svg",
    fotoKeterangan: "Pelatihan pengemasan produk UMKM di Balai Dusun Majegan",
    suka: 58,
    tanggapan: 7,
  },
  {
    slug: "penambahan-lampu-jalan-rt-05",
    judul: "Penambahan Lampu Jalan di RT 05 dan RT 06",
    kategori: "Pembangunan",
    tanggal: "2026-06-02",
    lokasi: "RT 05 & RT 06",
    ringkasan:
      "Dua belas titik lampu jalan baru dipasang di ruas yang selama ini gelap, menindaklanjuti aduan warga.",
    isi: [
      "Dua belas titik lampu penerangan jalan dipasang di ruas RT 05 dan RT 06 yang selama ini gelap. Pemasangan menindaklanjuti aduan warga yang masuk melalui kanal pengaduan padukuhan.",
      "Titik pemasangan ditentukan bersama ketua RT dengan mengutamakan persimpangan dan jalur yang sering dilewati anak sekolah pada pagi buta.",
      "Warga diimbau melapor bila ada lampu yang mati agar dapat segera diganti.",
    ],
    foto: "/gambar/cor-jalan.svg",
    fotoKeterangan: "Pemasangan lampu penerangan jalan di RT 05",
    suka: 82,
    tanggapan: 14,
  },
  {
    slug: "persiapan-lomba-agustusan-2026",
    judul: "Persiapan Lomba Agustusan Padukuhan",
    kategori: "Kegiatan",
    tanggal: "2026-07-24",
    lokasi: "Balai Dusun Majegan",
    ringkasan:
      "Rapat panitia menetapkan sepuluh cabang lomba. Pendaftaran peserta dibuka mulai pekan depan di tiap RT.",
    isi: [
      "Panitia peringatan HUT Kemerdekaan tingkat padukuhan menggelar rapat perdana di Balai Dusun. Sepuluh cabang lomba ditetapkan, mencakup lomba anak, ibu-ibu, dan bapak-bapak.",
      "Pendaftaran peserta dibuka mulai pekan depan melalui ketua RT masing-masing. Panitia juga membuka kesempatan bagi warga yang ingin menyumbang hadiah maupun konsumsi.",
    ],
    foto: "/gambar/merti-dusun.svg",
    fotoKeterangan: "Rapat panitia lomba Agustusan di Balai Dusun Majegan",
    suka: 0,
    tanggapan: 0,
    draft: true,
  },
  {
    slug: "rencana-pembangunan-pos-kamling-baru",
    judul: "Rencana Pembangunan Pos Kamling RT 07",
    kategori: "Pembangunan",
    tanggal: "2026-07-25",
    lokasi: "RT 07",
    ringkasan:
      "Rancangan anggaran dan lokasi masih dibahas bersama warga RT 07 — belum final.",
    isi: [
      "Usulan pembangunan pos kamling baru di RT 07 sedang dibahas. Lokasi yang diusulkan berada di pertigaan dekat mushola, menggantikan pos lama yang kondisinya sudah lapuk.",
      "Rancangan anggaran masih disusun dan akan dimusyawarahkan bersama warga RT 07 sebelum diajukan ke kalurahan.",
    ],
    foto: "/gambar/cor-jalan.svg",
    fotoKeterangan: "Lokasi rencana pos kamling baru RT 07",
    suka: 0,
    tanggapan: 0,
    draft: true,
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
    { nama: "Bejo Suwarno", jabatan: "Ketua RT 01" },
    { nama: "Tukiman", jabatan: "Ketua RT 02" },
    { nama: "Slamet Widodo", jabatan: "Ketua RT 03" },
    { nama: "Suparjo", jabatan: "Ketua RT 04" },
    { nama: "Marsudi", jabatan: "Ketua RT 05" },
    { nama: "Wagiman", jabatan: "Ketua RT 06" },
    { nama: "Heru Prasetyo", jabatan: "Ketua RT 07" },
    { nama: "Darmadi", jabatan: "Ketua RT 08" },
  ],
  catatanStruktur: "Daftar lengkap dikelola dari panel admin oleh perangkat dusun",
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
    berkas: { nama: "Templat-Formulir-Domisili.pdf" },
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
  {
    slug: "surat-pengantar-nikah",
    nama: "Surat Pengantar Nikah (N1–N4)",
    namaSingkat: "Surat Pengantar Nikah",
    durasi: "± 2 hari kerja",
    biaya: "GRATIS",
    deskripsi:
      "Pengantar dari padukuhan untuk pengurusan berkas nikah (N1–N4) di kalurahan, sebelum dilanjutkan ke KUA.",
    syarat: [
      "Fotokopi **KTP** dan **Kartu Keluarga** kedua calon",
      "Fotokopi **akta kelahiran**",
      "Pas foto **4×6** latar biru, 4 lembar",
      "Surat keterangan **belum menikah** dari RT/RW",
    ],
    alur: alurStandar,
  },
  {
    slug: "surat-keterangan-ahli-waris",
    nama: "Surat Keterangan Ahli Waris",
    namaSingkat: "Surat Ket. Ahli Waris",
    durasi: "± 3 hari kerja",
    biaya: "GRATIS",
    deskripsi:
      "Keterangan ahli waris untuk keperluan pengurusan harta peninggalan, dilengkapi tanda tangan saksi dan perangkat dusun.",
    syarat: [
      "Fotokopi **KTP** seluruh ahli waris",
      "Fotokopi **Kartu Keluarga**",
      "**Surat kematian** pewaris",
      "Dihadiri **dua orang saksi** dari warga setempat",
    ],
    alur: [
      { judul: "Siapkan berkas persyaratan", detail: "Lengkapi berkas di samping." },
      { judul: "Datang bersama saksi", detail: "Dua saksi warga ikut hadir ke Balai Dusun." },
      { judul: "Verifikasi & tanda tangan", detail: "Diperiksa perangkat, ditandatangani para pihak." },
      { judul: "Lanjut ke kalurahan", detail: "Berkas dibawa ke kalurahan untuk pengesahan." },
    ],
  },
  {
    slug: "surat-izin-keramaian",
    nama: "Surat Pengantar Izin Keramaian",
    namaSingkat: "Surat Izin Keramaian",
    durasi: "± 2 hari kerja",
    biaya: "GRATIS",
    deskripsi:
      "Pengantar untuk hajatan, pentas, atau kegiatan yang mengundang keramaian dan menggunakan pengeras suara.",
    syarat: [
      "Fotokopi **KTP** penyelenggara",
      "**Rincian kegiatan**: tanggal, jam mulai & selesai, perkiraan jumlah tamu",
      "**Persetujuan tetangga** sekitar lokasi, diketahui Ketua RT",
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
  {
    kode: "MJG-2607-2H8L",
    isi: "Jalan setapak menuju makam licin dan berlumut, sudah ada warga yang terpeleset saat hujan.",
    status: "DIPROSES",
    tanggal: "2026-07-23",
    tanggapan: "Sudah ditinjau bersama Ketua RT 04. Pembersihan lumut dijadwalkan pekan depan.",
  },
  {
    kode: "MJG-2607-5N3P",
    isi: "Mohon penambahan tempat sampah di sekitar balai dusun, terutama saat ada kegiatan.",
    status: "TERKIRIM",
    tanggal: "2026-07-21",
  },
  {
    kode: "MJG-2607-8R4T",
    isi: "Air PAM sering mati pada jam sibuk pagi di wilayah RT 06 dan RT 07.",
    status: "DIPROSES",
    tanggal: "2026-07-20",
  },
  {
    kode: "MJG-2607-1K6V",
    isi: "Usul agar jadwal posyandu diumumkan lebih awal supaya ibu bekerja bisa mengatur cuti.",
    status: "SELESAI",
    tanggal: "2026-07-14",
    tanggapan: "Diterima. Mulai Agustus jadwal posyandu diumumkan dua pekan sebelumnya lewat grup RT dan website.",
  },
  {
    kode: "MJG-2607-3W7Y",
    isi: "Pohon di tepi jalan RT 02 miring dan rantingnya menjulur ke kabel listrik.",
    status: "SELESAI",
    tanggal: "2026-07-09",
    tanggapan: "Pemangkasan sudah dilakukan bersama petugas dari kalurahan pada 12 Juli 2026.",
  },
  {
    kode: "MJG-2606-6Q2Z",
    isi: "Suara musik dari hajatan sampai lewat tengah malam, mengganggu warga yang bekerja pagi.",
    status: "SELESAI",
    tanggal: "2026-06-30",
    tanggapan: "Sudah disampaikan ke penyelenggara. Kesepakatan warga: pengeras suara dimatikan maksimal pukul 23.00.",
  },
  {
    kode: "MJG-2606-9D5F",
    isi: "Papan nama gang di RT 08 sudah pudar dan sulit dibaca oleh tamu.",
    status: "TERKIRIM",
    tanggal: "2026-06-25",
  },
];

/**
 * Menu panel admin.
 * `superadmin: true` = terkunci untuk peran Admin (matriks peran).
 */
export const menuAdmin = [
  { href: "/admin", label: "Dashboard", ikon: "kisi" as const },
  { href: "/admin/berita", label: "Berita", ikon: "berita" as const },
  { href: "/admin/pengaduan", label: "Pengaduan", ikon: "obrolan" as const },
  { href: "/admin/akun", label: "Akun & Pengguna", ikon: "warga" as const },
  { href: "/admin/profil", label: "Profil & Struktur", ikon: "warga" as const, superadmin: true },
  { href: "/admin/layanan", label: "Layanan", ikon: "surat" as const, superadmin: true },
  { href: "/admin/statistik", label: "Statistik", ikon: "batang" as const, superadmin: true },
];
