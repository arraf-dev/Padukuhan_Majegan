-- Hapus kolom estimasi_waktu pada tabel layanan — revisi resmi: tidak
-- menampilkan perkiraan lama pengerjaan pada layanan.
ALTER TABLE "layanan" DROP COLUMN "estimasi_waktu";
