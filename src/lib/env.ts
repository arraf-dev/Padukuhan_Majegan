/** Konfigurasi runtime yang memengaruhi keamanan dan kesiapan production. */
type Lingkungan = Record<string, string | undefined>;

export type ModeData = "demo" | "official";

const WAJIB_PRODUKSI = ["DATABASE_URL", "RAHASIA_SESI", "NEXT_PUBLIC_URL", "BLOB_READ_WRITE_TOKEN"] as const;

const terisi = (nilai: string | undefined) => Boolean(nilai?.trim());

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

  const urlSitus = lingkungan.NEXT_PUBLIC_URL?.trim();
  if (urlSitus) {
    try {
      const url = new URL(urlSitus);
      if (url.protocol !== "https:") masalah.push("NEXT_PUBLIC_URL harus menggunakan HTTPS di production");
    } catch {
      masalah.push("NEXT_PUBLIC_URL bukan URL yang sah");
    }
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
