/** Umpan balik pemuatan panel admin — lihat catatan di `(publik)/loading.tsx`. */
export default function Memuat() {
  return (
    <div className="px-4 py-6 md:px-8.5 md:pt-7" aria-busy="true" aria-live="polite">
      <span className="sr-only">Memuat panel…</span>

      <div className="h-7 w-52 animate-pulse rounded-lg bg-garis" />
      <div className="mt-2.5 h-3.5 w-36 animate-pulse rounded bg-garis/70" />

      <div className="mt-6 flex flex-col gap-2.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3.5 rounded-xl border border-garis bg-kertas px-4 py-3.5"
          >
            <div className="h-6 w-16 flex-none animate-pulse rounded-full bg-garis/70" />
            <div className="min-w-0 flex-1">
              <div className="h-4 w-3/5 animate-pulse rounded bg-garis" />
              <div className="mt-2 h-3 w-2/5 animate-pulse rounded bg-garis/70" />
            </div>
            <div className="h-9 w-20 flex-none animate-pulse rounded-lg bg-garis/60 max-sm:hidden" />
          </div>
        ))}
      </div>
    </div>
  );
}
