export type KodePotensi = "pariwisata" | "umkm" | "budaya";

type InfografisDemo = {
  label: string;
  nilai: number;
  satuan: string;
  urutan: number;
};

type ItemPotensiDemo = {
  judul: string;
  ringkasan: string;
  deskripsi: string;
  gambarUrl: string;
  subkategori?: string;
  produk?: string;
  lokasi?: string;
  kontak?: string;
  urutan: number;
  albumSlug?: string;
};

export type KategoriPotensiDemo = {
  kode: KodePotensi;
  label: string;
  judul: string;
  pengantar: string;
  deskripsi: string;
  gambarUrl: string;
  urutan: number;
  infografis: InfografisDemo[];
  items: ItemPotensiDemo[];
};

/**
 * Fixture seed untuk mode demo. Semua angka dan item di bawah ini adalah
 * placeholder yang harus diganti melalui panel admin setelah data resmi turun.
 */
export const kategoriPotensiDemo: KategoriPotensiDemo[] = [
  {
    kode: "pariwisata",
    label: "PARIWISATA",
    judul: "Menemukan sisi lain Majegan.",
    pengantar: "Kenali berbagai potensi pariwisata dan pengalaman lokal yang dimiliki Majegan.",
    deskripsi: "Ruang, suasana, dan pengalaman lokal yang dapat menjadi pintu masuk untuk mengenal Majegan lebih dekat.",
    gambarUrl: "/gambar/gapura-majegan.svg",
    urutan: 0,
    infografis: [
      { label: "Potensi Wisata", nilai: 3, satuan: "potensi", urutan: 0 },
      { label: "Aktivitas Lokal", nilai: 5, satuan: "aktivitas", urutan: 1 },
      { label: "Spot Menarik", nilai: 8, satuan: "spot", urutan: 2 },
    ],
    items: [
      {
        judul: "Contoh Potensi Wisata",
        ringkasan: "Konten contoh untuk memperlihatkan format cerita wisata Majegan.",
        deskripsi: "Ganti cerita ini dengan informasi resmi mengenai tempat, pengalaman, atau rute lokal yang telah diverifikasi bersama perangkat padukuhan.",
        gambarUrl: "/gambar/gapura-majegan.svg",
        lokasi: "Lokasi contoh, Majegan",
        urutan: 0,
      },
    ],
  },
  {
    kode: "umkm",
    label: "UMKM",
    judul: "Produk lokal, cerita dari masyarakat.",
    pengantar: "Temukan usaha dan produk lokal yang menjadi bagian dari kehidupan ekonomi masyarakat Majegan.",
    deskripsi: "Ragam usaha warga yang tumbuh dari keterampilan, resep, dan kerja bersama di lingkungan padukuhan.",
    gambarUrl: "/gambar/panen.svg",
    urutan: 1,
    infografis: [
      { label: "Unit UMKM", nilai: 42, satuan: "unit", urutan: 0 },
      { label: "Kategori Usaha", nilai: 4, satuan: "kategori", urutan: 1 },
      { label: "Produk Lokal", nilai: 17, satuan: "produk", urutan: 2 },
    ],
    items: [
      {
        judul: "Contoh UMKM Majegan",
        ringkasan: "Contoh kartu usaha lokal yang siap diganti dengan data pelaku usaha resmi.",
        deskripsi: "Tambahkan cerita usaha, produk unggulan, lokasi, dan kontak yang telah mendapat persetujuan pemilik usaha.",
        gambarUrl: "/gambar/panen.svg",
        subkategori: "Produk Lokal",
        produk: "Produk contoh demo",
        lokasi: "Majegan",
        kontak: "Kontak contoh",
        urutan: 0,
      },
    ],
  },
  {
    kode: "budaya",
    label: "BUDAYA",
    judul: "Menjaga cerita yang terus hidup.",
    pengantar: "Tradisi, kesenian, dan kegiatan masyarakat menjadi bagian dari identitas Majegan.",
    deskripsi: "Cerita budaya dirawat melalui kegiatan warga, dokumentasi, dan ruang bertemu lintas generasi.",
    gambarUrl: "/gambar/merti-dusun.svg",
    urutan: 2,
    infografis: [
      { label: "Kegiatan Budaya", nilai: 5, satuan: "kegiatan", urutan: 0 },
      { label: "Kesenian / Tradisi", nilai: 4, satuan: "tradisi", urutan: 1 },
      { label: "Dokumentasi", nilai: 12, satuan: "dokumentasi", urutan: 2 },
    ],
    items: [
      {
        judul: "Contoh Tradisi Majegan",
        ringkasan: "Contoh cerita budaya yang dapat dilengkapi dengan narasi dan dokumentasi resmi.",
        deskripsi: "Ganti bagian ini dengan sejarah singkat, pelaku, waktu pelaksanaan, dan makna tradisi atau kesenian yang telah dikonfirmasi.",
        gambarUrl: "/gambar/merti-dusun.svg",
        subkategori: "Tradisi",
        albumSlug: "merti-dusun-majegan-2026",
        urutan: 0,
      },
    ],
  },
];
