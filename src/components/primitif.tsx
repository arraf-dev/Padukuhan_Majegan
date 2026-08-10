/**
 * Primitif tampilan bersama — satu sumber untuk tombol, kartu, dan isian.
 *
 * Sebagian besar diekspor sebagai *string kelas*, bukan komponen: tombol di
 * situs ini kadang `<button>`, kadang `<Link>`, kadang `<a>`, dan isian kadang
 * `<input>` kadang `<textarea>`. String kelas melayani semuanya tanpa perlu
 * meneruskan props satu per satu.
 *
 * ponytail: hanya `Kontainer` & `KopHalaman` yang jadi komponen sungguhan —
 * keduanya membungkus struktur, bukan sekadar kelas.
 */

/* ————— Tombol ————— */

const tombolDasar =
  "inline-flex items-center justify-center gap-2 rounded-[10px] font-bold transition duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-55";

const ragamTombol = {
  primer:
    "bayang-tombol-emas bg-emas text-hutan hover:-translate-y-[2px] disabled:hover:translate-y-0 disabled:hover:shadow-none",
  sekunder:
    "border-[1.5px] border-garis-tebal bg-kertas text-hutan hover:border-daun hover:bg-emas-lembut",
  hapus: "border-[1.5px] border-bata/40 bg-kertas text-bata hover:border-bata hover:bg-bata/8",
  teks: "font-semibold text-daun hover:text-hutan",
} as const;

const ukuranTombol = {
  sedang: "px-4.5 py-2.5 text-[13.5px]",
  kecil: "px-3.5 py-2 text-[12.5px]",
  // Ukuran `besar` dipakai sebagai ajakan utama halaman — di desktop ia
  // bersaing dengan judul 44px, jadi ikut membesar supaya tetap terbaca.
  besar: "min-h-11 px-6 py-3.5 text-[15px] md:px-7 md:py-4 md:text-base",
} as const;

/** Kelas tombol — dipakai di `<button>`, `<Link>`, maupun `<a>`. */
export function tombol(
  ragam: keyof typeof ragamTombol = "primer",
  ukuran: keyof typeof ukuranTombol = "sedang",
) {
  // Ragam `teks` tanpa kotak: padding penuh justru membuatnya terlihat seperti tombol.
  const kotak = ragam === "teks" ? "" : ukuranTombol[ukuran];
  return `${tombolDasar} ${ragamTombol[ragam]} ${kotak}`;
}

/* ————— Kartu ————— */

/** Kartu statis. Beri `bisaDiklik` hanya bila seluruh kartu jadi target klik. */
export const kartu = (bisaDiklik = false) =>
  `rounded-xl border border-garis bg-kertas lg:rounded-2xl ${
    bisaDiklik
      ? "bayang-kartu hover:-translate-y-[3px] hover:border-daun"
      : "transition-colors duration-200 ease-out"
  }`;

/** Kotak putus-putus — dipakai empty state & tombol "tambah baru". */
export const kartuPutus =
  "rounded-xl border border-dashed border-garis-tebal bg-kertas/60 px-5 py-8 text-center text-[13.5px] text-redup";

/* ————— Isian ————— */

/** Isian di atas latar krem (halaman CRUD admin). */
export const isian =
  "w-full rounded-[10px] border border-garis bg-krem px-3.5 py-2.5 text-[13.5px] text-tinta transition-colors duration-200 ease-out placeholder:text-samar focus:border-daun focus:outline-none";

/** Isian di atas latar kertas (borang publik & halaman masuk) — kontras lebih tegas. */
export const isianTebal =
  "w-full rounded-[10px] border-[1.5px] border-garis-tebal bg-kertas px-3.5 py-3 text-sm text-tinta transition-colors duration-200 ease-out placeholder:text-samar focus:border-daun focus:outline-none";

/** Label kecil-kapital — konvensi halaman CRUD admin. */
export const label = "mb-1.5 block text-[11px] font-bold tracking-[.08em] text-samar";

/** Label borang yang diisi warga — lebih besar, lebih mudah dipindai. */
export const labelBorang = "mb-1.5 block text-[13px] font-bold text-tinta";

/* ————— Struktur halaman ————— */

/** Kop halaman: judul + keterangan singkat, jarak bawah seragam. */
export function KopHalaman({
  judul,
  keterangan,
  aksi,
}: {
  judul: React.ReactNode;
  keterangan?: React.ReactNode;
  aksi?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 lg:mb-7">
      <div>
        <h1 className="font-serif text-xl font-semibold text-hutan md:text-2xl lg:text-[28px]">
          {judul}
        </h1>
        {keterangan && <p className="mt-1 text-[13px] text-redup">{keterangan}</p>}
      </div>
      {aksi}
    </div>
  );
}
