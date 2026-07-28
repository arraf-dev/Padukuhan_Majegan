import type { MetadataRoute } from "next";
import { navigasi, situsUrl } from "@/content/majegan";
import { beritaTerbit } from "@/lib/berita";
import { semuaLayanan } from "@/lib/layanan";

// Daftar slug berita berubah tiap admin menayangkan atau menghapus, jadi sitemap
// statis akan menyebut halaman yang sudah mati.
export const dynamic = "force-dynamic";

/** Halaman publik + semua slug berita & layanan. Panel /admin sengaja tidak masuk. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [berita, layanan] = await Promise.all([beritaTerbit(), semuaLayanan()]);

  const rute = [
    ...navigasi.map((n) => n.href),
    "/pengaduan/lacak",
    ...layanan.map((l) => `/layanan/${l.slug}`),
    ...berita.map((b) => `/berita/${b.slug}`),
  ];

  return rute.map((href) => ({
    url: `${situsUrl}${href === "/" ? "" : href}`,
    lastModified: new Date(),
  }));
}
