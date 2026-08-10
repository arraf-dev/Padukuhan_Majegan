import Link from "next/link";
import type { Peran } from "@/content/majegan";
import { Ikon } from "@/components/ikon";
import { MenuAtas, Sidebar } from "@/components/panel";

/**
 * Bingkai halaman panel: sidebar + menu atas + kolom isi.
 *
 * ponytail: dipanggil per halaman, bukan lewat `layout.tsx`, karena komposer
 * berita sengaja tampil penuh tanpa sidebar (sesuai mockup) — layout bersama
 * akan memaksakan sidebar ke sana juga.
 */
export function Kerangka({
  peran,
  nama,
  children,
}: {
  peran: Peran;
  nama: string;
  children: React.ReactNode;
}) {
  return (
    <div className="md:grid md:min-h-screen md:grid-cols-[230px_1fr] md:items-start lg:grid-cols-[256px_1fr]">
      <Sidebar peran={peran} nama={nama} />
      <MenuAtas peran={peran} />
      {/* max-w di sini, bukan `wadah`: kolom isi sudah diimbangi sidebar,
          jadi batasnya lebih sempit agar baris tabel tidak meregang di 1920px. */}
      <div className="mx-auto w-full max-w-[1180px] px-4 py-6 md:min-w-0 md:px-8 md:pt-8 md:pb-10 lg:max-w-[1320px] lg:px-10 lg:pt-10 lg:pb-14 xl:max-w-[1440px]">
        {children}
      </div>
    </div>
  );
}

/** Bilah atas halaman penuh (komposer): tombol kembali + judul + identitas. */
export function BilahKomposer({
  judul,
  kembali,
  nama,
  peran,
}: {
  judul: string;
  kembali: string;
  nama: string;
  peran: Peran;
}) {
  return (
    <div className="flex items-center gap-3.5 bg-hutan px-4 py-3.5 text-krem md:px-8 lg:px-12 lg:py-4">
      <Link
        href={kembali}
        aria-label="Kembali"
        className="rounded-[10px] p-1 transition-colors duration-200 ease-out hover:text-emas"
      >
        <Ikon nama="kembali" ukuran={18} />
      </Link>
      <h1 className="flex-1 font-serif text-[17px] font-semibold md:text-xl lg:text-[22px]">{judul}</h1>
      <div className="flex items-center gap-2.5 text-xs text-krem/80 max-md:hidden">
        <div className="foto size-6.5 rounded-full border-[1.5px] border-emas" />
        {nama} · {peran === "admin" ? "Admin" : "SuperAdmin"}
      </div>
    </div>
  );
}
