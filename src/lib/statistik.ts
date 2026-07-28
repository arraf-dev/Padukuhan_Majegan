import { db } from "@/lib/db";

/**
 * Sumber tunggal query statistik penduduk untuk halaman publik (ADM-7 / task 21).
 *
 * Bentuk hasilnya sama dengan `statistik` & `kelompokUsia` di `majegan.ts`,
 * jadi beranda dan `/statistik` cukup mengganti baris impornya.
 */

/** Tahun data yang ditampilkan. Sama dengan yang ditulis `prisma/seed.ts`. */
export const TAHUN_DATA = 2026;

export type Ringkasan = { angka: number; label: string };
export type KelompokUsia = { rentang: string; persen: number };

export async function statistikPenduduk(tahun = TAHUN_DATA): Promise<{
  ringkasan: Ringkasan[];
  usia: KelompokUsia[];
}> {
  const baris = await db.statistikPenduduk.findMany({
    where: { tahun, kategori: { in: ["ringkasan", "usia"] } },
    orderBy: { urutan: "asc" },
    select: { kategori: true, label: true, nilai: true },
  });

  return {
    ringkasan: baris
      .filter((b) => b.kategori === "ringkasan")
      .map((b) => ({ angka: b.nilai, label: b.label })),
    // `nilai` untuk kategori usia adalah persentase 0–100, bukan jumlah jiwa —
    // dipakai langsung sebagai tinggi batang grafik.
    usia: baris.filter((b) => b.kategori === "usia").map((b) => ({ rentang: b.label, persen: b.nilai })),
  };
}

/** Daftar mentah untuk form panel admin. */
export function daftarStatistik(tahun: number) {
  return db.statistikPenduduk.findMany({
    where: { tahun },
    orderBy: [{ kategori: "asc" }, { urutan: "asc" }],
    select: { id: true, kategori: true, label: true, nilai: true, urutan: true },
  });
}

/** Tahun yang sudah punya data — mengisi pemilih tahun di panel. */
export async function tahunTersedia(): Promise<number[]> {
  const baris = await db.statistikPenduduk.findMany({
    distinct: ["tahun"],
    orderBy: { tahun: "desc" },
    select: { tahun: true },
  });

  const tahun = baris.map((b) => b.tahun);
  return tahun.includes(TAHUN_DATA) ? tahun : [TAHUN_DATA, ...tahun];
}
