import type { Metadata } from "next";
import Link from "next/link";
import { akun, type Peran } from "@/content/majegan";
import { Ikon } from "@/components/ikon";
import { Komposer } from "@/components/komposer";

export const metadata: Metadata = { title: "Buat Postingan Berita" };

export default async function BeritaBaru({
  searchParams,
}: {
  searchParams: Promise<{ peran?: string }>;
}) {
  const peran: Peran = (await searchParams).peran === "admin" ? "admin" : "superadmin";
  const pengguna = akun[peran];

  return (
    <>
      <div className="flex items-center gap-3.5 bg-hutan px-4 py-3.5 text-krem md:px-8.5">
        <Link href={peran === "admin" ? "/admin?peran=admin" : "/admin"} aria-label="Kembali ke panel">
          <Ikon nama="kembali" ukuran={18} />
        </Link>
        <h1 className="flex-1 font-serif text-[17px] font-semibold">Buat Postingan Berita</h1>
        <div className="flex items-center gap-2.5 text-xs text-krem/75 max-md:hidden">
          <div className="foto size-6.5 rounded-full border-[1.5px] border-emas" />
          {pengguna.nama} · {peran === "admin" ? "Admin" : "SuperAdmin"}
        </div>
      </div>
      <Komposer />
    </>
  );
}
