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
    <div className="md:grid md:min-h-screen md:grid-cols-[230px_1fr]">
      <Sidebar peran={peran} nama={nama} />
      <MenuAtas peran={peran} />
      <div className="px-4 py-6 md:px-8.5 md:pt-7 md:pb-8.5">{children}</div>
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
    <div className="flex items-center gap-3.5 bg-hutan px-4 py-3.5 text-krem md:px-8.5">
      <Link href={kembali} aria-label="Kembali">
        <Ikon nama="kembali" ukuran={18} />
      </Link>
      <h1 className="flex-1 font-serif text-[17px] font-semibold">{judul}</h1>
      <div className="flex items-center gap-2.5 text-xs text-krem/75 max-md:hidden">
        <div className="foto size-6.5 rounded-full border-[1.5px] border-emas" />
        {nama} · {peran === "admin" ? "Admin" : "SuperAdmin"}
      </div>
    </div>
  );
}
