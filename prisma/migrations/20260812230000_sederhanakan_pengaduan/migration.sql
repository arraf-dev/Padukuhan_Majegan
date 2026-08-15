-- Seluruh pengaduan saat ini masih data demo. Kosongkan tabel agar kolom
-- identitas dapat diwajibkan tanpa menyisakan baris anonim dari seed lama.
DELETE FROM "pengaduan";

-- DropIndex
DROP INDEX "pengaduan_kode_tiket_key";

-- AlterTable
ALTER TABLE "pengaduan"
  DROP COLUMN "kode_tiket",
  DROP COLUMN "is_anonim",
  DROP COLUMN "status",
  DROP COLUMN "tanggapan",
  ALTER COLUMN "nama_pelapor" SET NOT NULL,
  ALTER COLUMN "kontak" SET NOT NULL,
  ADD COLUMN "dibaca_pada" TIMESTAMP(3);

-- DropEnum
DROP TYPE "StatusPengaduan";

-- CreateIndex
CREATE INDEX "pengaduan_dibaca_pada_idx" ON "pengaduan"("dibaca_pada");
