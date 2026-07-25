import type { MetadataRoute } from "next";
import { berita, layanan, navigasi, situsUrl } from "@/content/majegan";

/** Halaman publik + semua slug berita & layanan. Panel /admin sengaja tidak masuk. */
export default function sitemap(): MetadataRoute.Sitemap {
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
