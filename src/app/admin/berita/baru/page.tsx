import type { Metadata } from "next";
import Link from "next/link";
import { Ikon } from "@/components/ikon";
import { Komposer } from "@/components/komposer";
import { wajibMasuk } from "@/lib/sesi";

export const metadata: Metadata = { title: "Buat Postingan Berita" };

export default async function BeritaBaru() {
  const { nama, peran } = await wajibMasuk();

  return (
    <>
      <div className="flex items-center gap-3.5 bg-hutan px-4 py-3.5 text-krem md:px-8.5">
        <Link href="/admin" aria-label="Kembali ke panel">
          <Ikon nama="kembali" ukuran={18} />
        </Link>
        <h1 className="flex-1 font-serif text-[17px] font-semibold">Buat Postingan Berita</h1>
        <div className="flex items-center gap-2.5 text-xs text-krem/75 max-md:hidden">
          <div className="foto size-6.5 rounded-full border-[1.5px] border-emas" />
          {nama} · {peran === "admin" ? "Admin" : "SuperAdmin"}
        </div>
      </div>
      <Komposer />
    </>
  );
}
