/** Penanda eksplisit agar konten seed tidak disalahartikan sebagai data resmi. */
export function StatusDataDemo({ ringkas = false }: { ringkas?: boolean }) {
  return (
    <aside
      role="status"
      className={
        ringkas
          ? "border-b border-emas/30 bg-hutan-pekat/88 px-4 py-1.5 text-center text-[10px] leading-relaxed text-krem/80 backdrop-blur-md sm:text-[11px]"
          : "border-y border-emas-garis bg-emas-muda px-4 py-2.5 text-center text-xs leading-relaxed text-emas-teks md:px-8 md:text-sm"
      }
    >
      <strong className="font-bold">Mode demo:</strong>{" "}
      {ringkas
        ? "informasi masih menggunakan data contoh."
        : "sebagian informasi pada website ini masih berupa data contoh dan belum menjadi data resmi Padukuhan Majegan."}
    </aside>
  );
}
