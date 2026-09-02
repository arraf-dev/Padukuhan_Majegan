import type { MetadataRoute } from "next";
import { navigasi, situsUrl } from "@/content/majegan";
import { beritaTerbit } from "@/lib/berita";
import { getAllPublishedAlbums } from "@/lib/galeri";
import { semuaLayanan } from "@/lib/layanan";

// Daftar slug berita berubah tiap admin menayangkan atau menghapus, jadi sitemap
// statis akan menyebut halaman yang sudah mati.
export const revalidate = 3600;

/**
 * Halaman publik + semua slug berita, layanan, dan galeri. Panel /admin dan
 * logika /api sengaja tidak masuk. `lastModified` memakai tanggal data asli
 * untuk berita dan album; halaman statis memakai tanggal build.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [berita, layanan, galeri] = await Promise.all([
    beritaTerbit(),
    semuaLayanan(),
    getAllPublishedAlbums(),
  ]);

  const statis: MetadataRoute.Sitemap = navigasi.map((n) => ({
    url: `${situsUrl}${n.href === "/" ? "" : n.href}`,
    lastModified: new Date(),
  }));

  const ruteLayanan: MetadataRoute.Sitemap = layanan.map((l) => ({
    url: `${situsUrl}/layanan/${l.slug}`,
    lastModified: new Date(),
  }));

  const ruteBerita: MetadataRoute.Sitemap = berita.map((b) => ({
    url: `${situsUrl}/berita/${b.slug}`,
    lastModified: new Date(b.tanggal),
  }));

  const ruteGaleri: MetadataRoute.Sitemap = galeri.map((g) => ({
    url: `${situsUrl}/galeri/${g.slug}`,
    lastModified: new Date(g.tanggalKegiatan),
  }));

  return [...statis, ...ruteLayanan, ...ruteBerita, ...ruteGaleri];
}
