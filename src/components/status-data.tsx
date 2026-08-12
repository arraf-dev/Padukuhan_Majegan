import { modeData } from "@/lib/env";

/** Penanda eksplisit agar konten seed tidak disalahartikan sebagai data resmi. */
export function StatusDataDemo() {
  if (modeData() !== "demo") return null;

  return (
    <aside
      role="status"
      className="border-y border-emas-garis bg-emas-muda px-4 py-2.5 text-center text-xs leading-relaxed text-emas-teks md:px-8 md:text-sm"
    >
      <strong className="font-bold">Mode demo:</strong> sebagian informasi pada website ini masih berupa data contoh dan belum menjadi data resmi Padukuhan Majegan.
    </aside>
  );
}
