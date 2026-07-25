const fmt = (opsi: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", ...opsi });

const panjang = fmt({ day: "numeric", month: "long", year: "numeric" });
const pendek = fmt({ day: "2-digit", month: "short" });
const pendekTahun = fmt({ day: "2-digit", month: "short", year: "numeric" });
const lengkapHari = fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" });

/** "17 Juli 2026" */
export const tanggalPanjang = (iso: string) => panjang.format(new Date(iso));

/** "17 JULI 2026" — dipakai pada kartu berita gaya album. */
export const tanggalKapital = (iso: string) => tanggalPanjang(iso).toUpperCase();

/** "18 JUL" */
export const tanggalPendek = (iso: string) => pendek.format(new Date(iso)).toUpperCase();

/** "18 JUL 2026" */
export const tanggalPendekTahun = (iso: string) =>
  pendekTahun.format(new Date(iso)).toUpperCase();

/** "Jumat, 24 Juli 2026" */
export const tanggalLengkap = (tgl: Date) => lengkapHari.format(tgl);
