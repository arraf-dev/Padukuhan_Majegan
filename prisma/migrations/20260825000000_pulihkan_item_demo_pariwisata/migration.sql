-- Pulihkan kartu demo Pariwisata agar struktur halaman tetap terlihat lengkap.
-- Konten ini tetap harus diganti dengan data resmi setelah diverifikasi.
INSERT INTO "potensi" ("id", "kategori_id", "judul", "slug", "ringkasan", "deskripsi", "gambar_url", "subkategori", "produk", "lokasi", "kontak", "status", "urutan", "created_at", "updated_at")
VALUES (
  'potensi-item-pariwisata-demo',
  'potensi-kategori-pariwisata',
  'Contoh Potensi Wisata',
  'contoh-potensi-wisata',
  'Konten contoh untuk memperlihatkan format cerita wisata Majegan.',
  'Ganti cerita ini dengan informasi resmi mengenai tempat, pengalaman, atau rute lokal yang telah diverifikasi bersama perangkat padukuhan.',
  '/gambar/gapura-majegan.svg',
  NULL,
  NULL,
  'Lokasi contoh, Majegan',
  NULL,
  'terbit',
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;
