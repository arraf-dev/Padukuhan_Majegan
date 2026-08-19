-- CreateEnum
CREATE TYPE "StatusGaleri" AS ENUM ('draft', 'terbit');

-- CreateTable
CREATE TABLE "galeri_album" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deskripsi" TEXT,
    "kategori" TEXT NOT NULL,
    "cover_url" TEXT,
    "tanggal_kegiatan" TIMESTAMP(3) NOT NULL,
    "status" "StatusGaleri" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "galeri_album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galeri_foto" (
    "id" TEXT NOT NULL,
    "album_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "caption" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER,
    "height" INTEGER,
    "size" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "galeri_foto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "galeri_album_slug_key" ON "galeri_album"("slug");

-- CreateIndex
CREATE INDEX "galeri_album_status_tanggal_kegiatan_idx" ON "galeri_album"("status", "tanggal_kegiatan");

-- CreateIndex
CREATE INDEX "galeri_album_kategori_idx" ON "galeri_album"("kategori");

-- CreateIndex
CREATE INDEX "galeri_foto_album_id_urutan_idx" ON "galeri_foto"("album_id", "urutan");

-- AddForeignKey
ALTER TABLE "galeri_foto" ADD CONSTRAINT "galeri_foto_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "galeri_album"("id") ON DELETE CASCADE ON UPDATE CASCADE;
