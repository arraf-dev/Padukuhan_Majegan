/**
 * Helfer untuk membaca & membatasi teks dari FormData server action.
 *
 * Semua aksi admin memakai `teks` lokal yang sama; dipusatkan di sini supaya
 * aturan (trim + batas panjang) tidak bisa melenceng antar modul.
 */

export const PANJANG = {
  judul: 200,
  konten: 2200,
  deskripsi: 2000,
  nama: 100,
  jabatan: 100,
  naskah: 10000,
  lokasi: 200,
  label: 120,
  pengantar: 500,
  subkategori: 100,
  produk: 100,
  kontak: 100,
  satuan: 50,
  pengaduanIsi: 5000,
  pengaduanNama: 100,
  pengaduanKontak: 25,
} as const;

/** Membaca nilai teks dari FormData, dipangkas. `nama` tidak pernah undefined. */
export function ambilTeks(fd: FormData, nama: string): string {
  return String(fd.get(nama) ?? "").trim();
}

/** Izin-pakai: true bila nilai memenuhi aturan (non-kosong bila `wajib`). */
export function sahPanjang(nilai: string, maks?: number, wajib = false): boolean {
  if (wajib && nilai.length === 0) return false;
  return maks === undefined || nilai.length <= maks;
}
