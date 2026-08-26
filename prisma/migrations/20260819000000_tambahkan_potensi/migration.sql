-- CreateEnum
CREATE TYPE "KategoriPotensi" AS ENUM ('pariwisata', 'umkm', 'budaya');

-- CreateEnum
CREATE TYPE "StatusPotensi" AS ENUM ('draft', 'terbit');

-- CreateTable
CREATE TABLE "potensi_kategori" (
    "id" TEXT NOT NULL,
    "kode" "KategoriPotensi" NOT NULL,
    "label" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "pengantar" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "gambar_url" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "potensi_kategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "potensi" (
    "id" TEXT NOT NULL,
    "kategori_id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ringkasan" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "gambar_url" TEXT,
    "subkategori" TEXT,
    "produk" TEXT,
    "lokasi" TEXT,
    "kontak" TEXT,
    "status" "StatusPotensi" NOT NULL DEFAULT 'draft',
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "potensi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "potensi_infografis" (
    "id" TEXT NOT NULL,
    "kategori_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "nilai" INTEGER NOT NULL,
    "satuan" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "potensi_infografis_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "galeri_album" ADD COLUMN "potensi_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "potensi_kategori_kode_key" ON "potensi_kategori"("kode");
CREATE UNIQUE INDEX "potensi_slug_key" ON "potensi"("slug");
CREATE INDEX "potensi_kategori_id_status_urutan_idx" ON "potensi"("kategori_id", "status", "urutan");
CREATE UNIQUE INDEX "potensi_infografis_kategori_id_label_key" ON "potensi_infografis"("kategori_id", "label");
CREATE INDEX "potensi_infografis_kategori_id_urutan_idx" ON "potensi_infografis"("kategori_id", "urutan");
CREATE UNIQUE INDEX "galeri_album_potensi_id_key" ON "galeri_album"("potensi_id");

-- AddForeignKey
ALTER TABLE "potensi" ADD CONSTRAINT "potensi_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "potensi_kategori"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "potensi_infografis" ADD CONSTRAINT "potensi_infografis_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "potensi_kategori"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "galeri_album" ADD CONSTRAINT "galeri_album_potensi_id_fkey" FOREIGN KEY ("potensi_id") REFERENCES "potensi"("id") ON DELETE SET NULL ON UPDATE CASCADE;
