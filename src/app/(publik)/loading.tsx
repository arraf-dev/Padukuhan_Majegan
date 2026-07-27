/**
 * Umpan balik saat halaman publik menunggu data.
 *
 * Semua halaman ber-DB memakai `force-dynamic`, jadi tanpa ini layar diam
 * sampai server selesai — terasa lama di koneksi desa yang lambat.
 *
 * ponytail: satu skeleton untuk semua rute publik, bukan satu per halaman.
 * Bentuknya sengaja generik (judul + kartu), cukup untuk menandakan "sedang
 * dimuat" tanpa harus meniru tata letak tiap halaman.
 */
export default function Memuat() {
  return (
    <div className="px-4 pt-6 pb-10 md:px-12 md:pt-9" aria-busy="true" aria-live="polite">
      <span className="sr-only">Memuat halaman…</span>

      <div className="h-8 w-56 animate-pulse rounded-lg bg-garis md:h-10 md:w-72" />
      <div className="mt-3 h-4 w-40 animate-pulse rounded bg-garis/70" />

      <div className="mt-7 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-garis bg-kertas p-2.5">
            <div className="aspect-square animate-pulse rounded-[11px] bg-garis/60" />
            <div className="px-2 pt-3.5 pb-2">
              <div className="h-3 w-24 animate-pulse rounded bg-garis/70" />
              <div className="mt-2.5 h-4 w-full animate-pulse rounded bg-garis" />
              <div className="mt-2 h-3 w-3/4 animate-pulse rounded bg-garis/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
