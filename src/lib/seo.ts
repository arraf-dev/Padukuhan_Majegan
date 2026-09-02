import { desa, situsUrl, type Berita } from "@/content/majegan";

/** Nama organisasi yang menerbitkan situs — dipakai di JSON-LD. */
export const NAMA_ORG = "Pemerintah Padukuhan Majegan";
const ORG_ID = `${situsUrl}/#organisasi`;

/** URL absolut untuk gambar: path lokal diubah, URL eksternal dibiarkan. */
const urlGambar = (gambar: string): string =>
  /^https?:\/\//.test(gambar) ? gambar : `${situsUrl}${gambar}`;

/**
 * GovernmentOrganization Padukuhan Majegan.
 *
 * Tipe ini sah karena padukuhan adalah unit administratif Pemerintah
 * Kalurahan. Relasi hierarki (Padukuhan Majegan → Kalurahan Pandowoharjo →
 * Kapanewon Sleman → Kabupaten Sleman → DIY) dijelaskan lewat alamat dan
 * wilayah, tanpa mengklaim nama pejabat/instansi yang belum terverifikasi.
 */
function organisasi(): Record<string, unknown> {
  const adaInstagram = desa.instagramUrl ? [desa.instagramUrl] : [];
  return {
    "@type": "GovernmentOrganization",
    "@id": ORG_ID,
    name: desa.nama,
    alternateName: NAMA_ORG,
    url: `${situsUrl}/`,
    logo: { "@type": "ImageObject", url: `${situsUrl}/icon.svg` },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Balai Dusun Majegan, Majegan, Pandowoharjo",
      addressLocality: "Pandowoharjo",
      addressRegion: "Kapanewon Sleman, Kabupaten Sleman",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: desa.koordinat[0],
      longitude: desa.koordinat[1],
    },
    email: desa.email,
    telephone: "+62-851-5651-3401",
    sameAs: adaInstagram,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+62-851-5651-3401",
      contactType: "customer service",
      url: desa.whatsappUrl,
      availableLanguage: "Indonesian",
    },
  };
}

/** Graph untuk Beranda: organisasi + WebSite + WebPage yang saling tertaut. */
export function berandaJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organisasi(),
      {
        "@type": "WebSite",
        "@id": `${situsUrl}/#website`,
        name: `Website Resmi ${desa.nama}`,
        url: `${situsUrl}/`,
        inLanguage: "id-ID",
        publisher: { "@id": ORG_ID },
      },
      {
        "@type": "WebPage",
        "@id": `${situsUrl}/#halaman`,
        url: `${situsUrl}/`,
        name: `Website Resmi ${desa.nama}`,
        inLanguage: "id-ID",
        about: { "@id": ORG_ID },
        isPartOf: { "@id": `${situsUrl}/#website` },
      },
    ],
  };
}

/** Rute breadcrumb: [{ nama, path }] → BreadcrumbList. */
export type RuteTrek = { nama: string; path: string };

export function breadcrumbJsonLd(rute: RuteTrek[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: rute.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: r.nama,
      item: `${situsUrl}${r.path}`,
    })),
  };
}

/** Article untuk halaman berita — semua nilai berasal dari data berita asli. */
export function artikelJsonLd(b: Berita): Record<string, unknown> {
  const gambar = b.foto && !b.foto.endsWith(".svg") ? b.foto : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: b.judul,
    description: b.ringkasan,
    image: gambar ? [urlGambar(gambar)] : undefined,
    datePublished: b.tanggal,
    dateModified: b.tanggal,
    inLanguage: "id-ID",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${situsUrl}/berita/${b.slug}`,
    },
    author: { "@type": "Organization", name: NAMA_ORG, url: `${situsUrl}/` },
    publisher: { "@type": "Organization", name: NAMA_ORG, url: `${situsUrl}/` },
  };
}
