-- Item demo diberi label "Contoh" agar tidak dianggap sebagai data resmi.
-- Konten ini dapat diganti atau dihapus dari panel admin setelah verifikasi.
INSERT INTO "potensi" ("id", "kategori_id", "judul", "slug", "ringkasan", "deskripsi", "gambar_url", "subkategori", "produk", "lokasi", "kontak", "status", "urutan", "created_at", "updated_at")
VALUES
  ('potensi-item-pariwisata-demo', 'potensi-kategori-pariwisata', 'Contoh Potensi Wisata', 'contoh-potensi-wisata', 'Konten contoh untuk memperlihatkan format cerita wisata Majegan.', 'Ganti cerita ini dengan informasi resmi mengenai tempat, pengalaman, atau rute lokal yang telah diverifikasi bersama perangkat padukuhan.', '/gambar/gapura-majegan.svg', NULL, NULL, 'Lokasi contoh, Majegan', NULL, 'terbit', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('potensi-item-umkm-demo', 'potensi-kategori-umkm', 'Contoh UMKM Majegan', 'contoh-umkm-majegan', 'Contoh kartu usaha lokal yang siap diganti dengan data pelaku usaha resmi.', 'Tambahkan cerita usaha, produk unggulan, lokasi, dan kontak yang telah mendapat persetujuan pemilik usaha.', '/gambar/panen.svg', 'Produk Lokal', 'Produk contoh demo', 'Majegan', 'Kontak contoh', 'terbit', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('potensi-item-budaya-demo', 'potensi-kategori-budaya', 'Contoh Tradisi Majegan', 'contoh-tradisi-majegan', 'Contoh cerita budaya yang dapat dilengkapi dengan narasi dan dokumentasi resmi.', 'Ganti bagian ini dengan sejarah singkat, pelaku, waktu pelaksanaan, dan makna tradisi atau kesenian yang telah dikonfirmasi.', '/gambar/merti-dusun.svg', 'Tradisi', NULL, NULL, NULL, 'terbit', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;

UPDATE "galeri_album"
SET "potensi_id" = 'potensi-item-budaya-demo'
WHERE "slug" = 'merti-dusun-majegan-2026'
  AND "potensi_id" IS NULL;
