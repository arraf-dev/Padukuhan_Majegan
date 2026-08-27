/**
 * Penjaga percobaan login — menahan brute force email+sandi di panel admin.
 *
 * Hitungan disimpan di memori proses (sama seperti rate-limit pengaduan):
 * cukup untuk padukuhan, pindah ke upstash/KV bila ancamannya nyata.
 */

export const COBA_MAKS = 10;
export const JENDELA_COBA_MS = 15 * 60_000;

const gagal = new Map<string, number[]>();

function catatanAktif(kunci: string, kini: number): number[] {
  const aktif = (gagal.get(kunci) ?? []).filter((waktu) => kini - waktu < JENDELA_COBA_MS);
  // Buang yang kedaluwarsa supaya Map tidak tumbuh tanpa batas.
  if (aktif.length === 0) gagal.delete(kunci);
  else gagal.set(kunci, aktif);
  return aktif;
}

/** Blokir dulu bila sudah melewati batas percobaan dalam jendela. */
export function cobaMasukDiblokir(kunci: string, kini = Date.now()): boolean {
  return catatanAktif(kunci, kini).length >= COBA_MAKS;
}

/** Catat satu percobaan gagal (dipanggil setelah verifikasi sandi menolak). */
export function catatGagalMasuk(kunci: string, kini = Date.now()): void {
  const aktif = catatanAktif(kunci, kini);
  aktif.push(kini);
  gagal.set(kunci, aktif);
}

/** Bersihkan riwayat gagal saat login benar — jangan menghukum pengguna sah. */
export function bersihkanGagalMasuk(kunci: string): void {
  gagal.delete(kunci);
}
