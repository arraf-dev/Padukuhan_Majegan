-- Kategori awal adalah struktur editorial, bukan data resmi warga.
-- Nilai infografis di bawah ini merupakan placeholder mode demo.
INSERT INTO "potensi_kategori" ("id", "kode", "label", "judul", "pengantar", "deskripsi", "gambar_url", "urutan")
VALUES
  ('potensi-kategori-pariwisata', 'pariwisata', 'PARIWISATA', 'Menemukan sisi lain Majegan.', 'Kenali berbagai potensi pariwisata dan pengalaman lokal yang dimiliki Majegan.', 'Ruang, suasana, dan pengalaman lokal yang dapat menjadi pintu masuk untuk mengenal Majegan lebih dekat.', '/gambar/gapura-majegan.svg', 0),
  ('potensi-kategori-umkm', 'umkm', 'UMKM', 'Produk lokal, cerita dari masyarakat.', 'Temukan usaha dan produk lokal yang menjadi bagian dari kehidupan ekonomi masyarakat Majegan.', 'Ragam usaha warga yang tumbuh dari keterampilan, resep, dan kerja bersama di lingkungan padukuhan.', '/gambar/panen.svg', 1),
  ('potensi-kategori-budaya', 'budaya', 'BUDAYA', 'Menjaga cerita yang terus hidup.', 'Tradisi, kesenian, dan kegiatan masyarakat menjadi bagian dari identitas Majegan.', 'Cerita budaya dirawat melalui kegiatan warga, dokumentasi, dan ruang bertemu lintas generasi.', '/gambar/merti-dusun.svg', 2)
ON CONFLICT ("kode") DO NOTHING;

INSERT INTO "potensi_infografis" ("id", "kategori_id", "label", "nilai", "satuan", "urutan")
VALUES
  ('potensi-stat-pariwisata-1', 'potensi-kategori-pariwisata', 'Potensi Wisata', 3, 'potensi', 0),
  ('potensi-stat-pariwisata-2', 'potensi-kategori-pariwisata', 'Aktivitas Lokal', 5, 'aktivitas', 1),
  ('potensi-stat-pariwisata-3', 'potensi-kategori-pariwisata', 'Spot Menarik', 8, 'spot', 2),
  ('potensi-stat-umkm-1', 'potensi-kategori-umkm', 'Unit UMKM', 42, 'unit', 0),
  ('potensi-stat-umkm-2', 'potensi-kategori-umkm', 'Kategori Usaha', 4, 'kategori', 1),
  ('potensi-stat-umkm-3', 'potensi-kategori-umkm', 'Produk Lokal', 17, 'produk', 2),
  ('potensi-stat-budaya-1', 'potensi-kategori-budaya', 'Kegiatan Budaya', 5, 'kegiatan', 0),
  ('potensi-stat-budaya-2', 'potensi-kategori-budaya', 'Kesenian / Tradisi', 4, 'tradisi', 1),
  ('potensi-stat-budaya-3', 'potensi-kategori-budaya', 'Dokumentasi', 12, 'dokumentasi', 2)
ON CONFLICT ("kategori_id", "label") DO NOTHING;
