CREATE TABLE "berita_foto" (
    "id" TEXT NOT NULL,
    "berita_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "caption" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "berita_foto_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "berita_foto_berita_id_urutan_key" ON "berita_foto"("berita_id", "urutan");
CREATE INDEX "berita_foto_berita_id_urutan_idx" ON "berita_foto"("berita_id", "urutan");

ALTER TABLE "berita_foto"
  ADD CONSTRAINT "berita_foto_berita_id_fkey"
  FOREIGN KEY ("berita_id") REFERENCES "berita"("id") ON DELETE CASCADE ON UPDATE CASCADE;
