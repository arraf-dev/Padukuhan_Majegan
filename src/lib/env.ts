/** Konfigurasi runtime yang memengaruhi keamanan dan kesiapan production. */
type Lingkungan = Record<string, string | undefined>;

export type ModeData = "demo" | "official";

/**
 * Satu-satunya hostname production yang sah. Vercel me-redirect host tanpa
 * `www` ke host ber-`www` (302 otomatis), jadi kedua bentuk dianggap sama dan
 * dinormalisasi ke bentuk kanonik agar sitemap, canonical, dan og:image tidak
 * pernah menunjuk ke host yang salah.
 */
export const SITUS_KANONIK = "https://www.majegan-pandowoharjo.id";

const HOST_KANONIK = new URL(SITUS_KANONIK).hostname;
const HOST_TANPA_WWW = HOST_KANONIK.replace(/^www\./, "");

const WAJIB_PRODUKSI = ["DATABASE_URL", "RAHASIA_SESI"] as const;

const terisi = (nilai: string | undefined) => Boolean(nilai?.trim());

const urlHttps = (nilai: string | undefined): string | null => {
  const mentah = nilai?.trim();
  if (!mentah) return null;

  try {
    const url = new URL(mentah.includes("://") ? mentah : `https://${mentah}`);
    return url.protocol === "https:" ? url.origin : null;
  } catch {
    return null;
  }
};

/**
 * Vercel menyediakan URL production secara otomatis. Nilai ini menjadi
 * fallback aman bila NEXT_PUBLIC_URL belum diubah dari localhost.
 *
 * Host tanpa `www` (majegan-pandowoharjo.id) dinormalisasi ke bentuk kanonik
 * ber-`www` — Vercel sudah me-redirect bentuk tanpa `www` ke ber-`www`.
 */
export function urlSitusProduksi(
  lingkungan: Lingkungan = process.env,
  fallback?: string,
): string | null {
  const hasil =
    urlHttps(lingkungan.NEXT_PUBLIC_URL) ??
    urlHttps(lingkungan.VERCEL_PROJECT_PRODUCTION_URL) ??
    urlHttps(lingkungan.VERCEL_URL) ??
    urlHttps(fallback);

  if (!hasil) return null;

  try {
    return new URL(hasil).hostname === HOST_TANPA_WWW ? SITUS_KANONIK : new URL(hasil).origin;
  } catch {
    return null;
  }
}

/**
 * Data contoh adalah pilihan paling aman bila variabel belum diisi. Dengan
 * begitu, situs tidak pernah diam-diam menayangkan konten demo sebagai resmi.
 */
export function modeData(lingkungan: Lingkungan = process.env): ModeData {
  const nilai = lingkungan.DATA_MODE?.trim().toLowerCase();
  if (!nilai || nilai === "demo") return "demo";
  if (nilai === "official") return "official";
  throw new Error('DATA_MODE harus bernilai "demo" atau "official".');
}

/** Mengembalikan masalah konfigurasi tanpa pernah memasukkan nilai secret. */
export function masalahEnvironmentProduksi(lingkungan: Lingkungan = process.env): string[] {
  const masalah = WAJIB_PRODUKSI.filter((nama) => !terisi(lingkungan[nama])).map(
    (nama) => `${nama} belum diisi`,
  );

  if (!urlSitusProduksi(lingkungan)) {
    masalah.push(
      terisi(lingkungan.NEXT_PUBLIC_URL)
        ? "NEXT_PUBLIC_URL harus menggunakan HTTPS di production"
        : "URL HTTPS production belum tersedia",
    );
  }

  // Fail-fast di production Vercel: sitemap, canonical, dan og:image harus
  // menunjuk ke domain kanonik. Preview/development sengaja dibebaskan.
  if (
    lingkungan.VERCEL_ENV === "production" &&
    urlSitusProduksi(lingkungan) !== SITUS_KANONIK
  ) {
    masalah.push(
      `URL situs production harus ${SITUS_KANONIK} (saat ini: ${
        urlSitusProduksi(lingkungan) ?? "(kosong)"
      }) — periksa NEXT_PUBLIC_URL di Vercel`,
    );
  }

  try {
    modeData(lingkungan);
  } catch (galat) {
    masalah.push(galat instanceof Error ? galat.message : "DATA_MODE tidak sah");
  }

  return masalah;
}

/** Dipanggil oleh layout root agar deployment production gagal secara jelas. */
export function validasiEnvironmentProduksi(lingkungan: Lingkungan = process.env): void {
  if (lingkungan.NODE_ENV !== "production") return;

  const masalah = masalahEnvironmentProduksi(lingkungan);
  if (masalah.length) throw new Error(`Konfigurasi production belum siap: ${masalah.join("; ")}`);
}
