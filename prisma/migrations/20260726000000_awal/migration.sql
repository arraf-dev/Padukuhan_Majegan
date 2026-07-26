-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Peran" AS ENUM ('superadmin', 'admin');

-- CreateEnum
CREATE TYPE "StatusBerita" AS ENUM ('draft', 'terbit');

-- CreateEnum
CREATE TYPE "StatusPengaduan" AS ENUM ('TERKIRIM', 'DIPROSES', 'SELESAI');

-- CreateEnum
CREATE TYPE "JenisAnggaran" AS ENUM ('pendapatan', 'belanja', 'pembiayaan');

-- CreateEnum
CREATE TYPE "KategoriStatistik" AS ENUM ('ringkasan', 'jenis_kelamin', 'usia', 'pekerjaan', 'pendidikan');

-- CreateTable
CREATE TABLE "pengguna" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "peran" "Peran" NOT NULL DEFAULT 'admin',
    "jabatan" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "halaman_profil" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "halaman_profil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perangkat_desa" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "foto_url" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "perangkat_desa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategori_berita" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "kategori_berita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "berita" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ringkasan" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "gambar_sampul" TEXT,
    "lokasi" TEXT,
    "status" "StatusBerita" NOT NULL DEFAULT 'draft',
    "suka" INTEGER NOT NULL DEFAULT 0,
    "tanggapan" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kategori_id" TEXT NOT NULL,
    "penulis_id" TEXT,

    CONSTRAINT "berita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "layanan" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nama_layanan" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "persyaratan" TEXT[],
    "alur" JSONB NOT NULL,
    "estimasi_waktu" TEXT NOT NULL,
    "biaya" TEXT NOT NULL DEFAULT 'GRATIS',
    "file_templat" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "layanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengaduan" (
    "id" TEXT NOT NULL,
    "kode_tiket" TEXT NOT NULL,
    "nama_pelapor" TEXT,
    "kontak" TEXT,
    "is_anonim" BOOLEAN NOT NULL DEFAULT false,
    "kategori" TEXT NOT NULL,
    "lokasi" TEXT,
    "isi" TEXT NOT NULL,
    "lampiran_url" TEXT,
    "status" "StatusPengaduan" NOT NULL DEFAULT 'TERKIRIM',
    "tanggapan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pengaduan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anggaran" (
    "id" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "jenis" "JenisAnggaran" NOT NULL,
    "uraian" TEXT NOT NULL,
    "jumlah" BIGINT NOT NULL,
    "catatan" TEXT,
    "resmi" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "anggaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statistik_penduduk" (
    "id" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "kategori" "KategoriStatistik" NOT NULL,
    "label" TEXT NOT NULL,
    "nilai" INTEGER NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "statistik_penduduk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_email_key" ON "pengguna"("email");

-- CreateIndex
CREATE UNIQUE INDEX "halaman_profil_slug_key" ON "halaman_profil"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "kategori_berita_slug_key" ON "kategori_berita"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "berita_slug_key" ON "berita"("slug");

-- CreateIndex
CREATE INDEX "berita_status_published_at_idx" ON "berita"("status", "published_at");

-- CreateIndex
CREATE UNIQUE INDEX "layanan_slug_key" ON "layanan"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "pengaduan_kode_tiket_key" ON "pengaduan"("kode_tiket");

-- CreateIndex
CREATE INDEX "anggaran_tahun_jenis_idx" ON "anggaran"("tahun", "jenis");

-- CreateIndex
CREATE UNIQUE INDEX "statistik_penduduk_tahun_kategori_label_key" ON "statistik_penduduk"("tahun", "kategori", "label");

-- AddForeignKey
ALTER TABLE "berita" ADD CONSTRAINT "berita_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "kategori_berita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "berita" ADD CONSTRAINT "berita_penulis_id_fkey" FOREIGN KEY ("penulis_id") REFERENCES "pengguna"("id") ON DELETE SET NULL ON UPDATE CASCADE;
