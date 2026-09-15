/** Naskah dan metadata sejarah resmi yang bersumber dari dokumen Padukuhan. */
export type GambarSejarah = {
  src: string;
  alt: string;
  caption: string;
};

export type SumberSejarah = {
  teks: string;
  tautan?: string;
};

export const sejarahResmi = {
  paragraf: [
    "Sebelum Kalurahan Pandowoharjo terbentuk seperti yang dikenal sekarang, Majegan merupakan wilayah yang cukup besar dan memegang peranan penting dalam administrasi, terutama pemungutan pajak untuk Keraton Yogyakarta. Pada masa itu, hasil bumi sebagai pajak masyarakat Jawa dikumpulkan di Majegan sebelum diserahkan kepada Keraton Yogyakarta. Karena fungsi tersebut, nama Majegan dipercaya berkaitan dengan kegiatan pengumpulan pajak. Kedudukan ini menjadikan Majegan salah satu wilayah penting dalam perkembangan pemerintahan setempat.",
    "Dalam perkembangannya, Majegan ikut berperan dalam proses terbentuknya Kalurahan Pandowoharjo bersama wilayah Brayut, Tlacap, Pajangan, Jabung, dan Sawahan. Penyatuan wilayah-wilayah tersebut mengubah struktur pemerintahan setempat. Meskipun demikian, jejak Majegan sebagai wilayah administratif pada masa sebelumnya masih dapat ditelusuri melalui peninggalan sejarah dan ingatan masyarakat. Salah satu peninggalan yang masih bertahan adalah Joglo Kademangan, bukti fisik pemerintahan lama yang pernah berlangsung di Majegan.",
    "Joglo Kademangan diperkirakan dibangun oleh Mbah Demang sekitar tahun 1890-an dan dahulu digunakan sebagai kantor pemerintahan Kalurahan Majegan. Bangunan ini memiliki keunikan karena menggunakan kayu pohon nangka sebagai salah satu bahan utamanya. Penggunaan kayu nangka berkaitan dengan keadaan pada masa kolonial Belanda, ketika kayu jati sulit diperoleh karena banyak pohon jati mengalami penjarahan. Masyarakat kemudian memanfaatkan bahan yang tersedia di lingkungan sekitar untuk membangun Joglo Kademangan.",
    "Hingga kini, Joglo Kademangan masih berdiri dan belum mengalami renovasi menyeluruh. Perawatannya lebih banyak berupa perbaikan pada bagian bangunan yang mulai rusak atau lapuk. Bagi masyarakat Majegan, Joglo Kademangan memiliki nilai sejarah dan budaya yang penting. Bangunan ini bukan hanya peninggalan arsitektur tradisional, tetapi juga pengingat sejarah pemerintahan dan kehidupan masyarakat Majegan.",
  ],
  gambar: [
    {
      src: "/gambar/sejarah-peta-majegan-1933.jpg",
      alt: "Cuplikan peta historis wilayah Majegan dan sekitarnya tahun 1933",
      caption: "Peta wilayah Majegan tahun 1933",
    },
    {
      src: "/gambar/joglo-kademangan-majegan.jpg",
      alt: "Bangunan Joglo Kademangan Majegan dilihat dari halaman depan",
      caption: "Joglo Kademangan, peninggalan pemerintahan lama Majegan",
    },
  ],
  sumber: [
    {
      teks: "Topografische Dienst Batavia. (1933). Sleman: herzien door den Topografischen Dienst in 1933. Leiden University.",
    },
    {
      teks: "Kalurahan Pandowoharjo. (2026). Bangunan Warisan Budaya.",
      tautan: "https://pandowoharjosid.slemankab.go.id",
    },
    {
      teks: "Suharno, Edi. (2026). Sejarah Joglo Kademangan Majegan. Wawancara pribadi, 30 Mei 2026, Sleman.",
    },
  ],
} as const satisfies {
  paragraf: readonly string[];
  gambar: readonly GambarSejarah[];
  sumber: readonly SumberSejarah[];
};
