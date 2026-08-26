-- Hapus hanya kartu demo yang dibuat oleh migration Potensi awal.
-- Data Pariwisata lain yang mungkin dibuat admin tidak disentuh.
DELETE FROM "potensi"
WHERE "id" = 'potensi-item-pariwisata-demo';
