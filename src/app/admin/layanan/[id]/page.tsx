import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Ikon } from "@/components/ikon";
import { KopHalaman, tombol } from "@/components/primitif";
import { Kerangka } from "@/app/admin/kerangka";
import { BorangLayanan } from "@/app/admin/layanan/borang";
import { layananUntukForm } from "@/lib/layanan";
import { wajibSuperadmin } from "@/lib/sesi";

export const metadata: Metadata = { title: "Sunting Layanan" };
export const dynamic = "force-dynamic";

export default async function SuntingLayanan({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ galat?: string }>;
}) {
  const { nama, peran } = await wajibSuperadmin();
  const { id } = await params;
  const { galat } = await searchParams;

  const awal = await layananUntukForm(id);
  if (!awal) notFound();

  return (
    <Kerangka peran={peran} nama={nama}>
      <Link href="/admin/layanan" className={`${tombol("teks")} mb-3 text-[13px]`}>
        <Ikon nama="kembali" ukuran={15} />
        Kembali ke daftar layanan
      </Link>
      <KopHalaman judul="Sunting Layanan" keterangan={awal.nama} />
      <BorangLayanan awal={awal} galat={galat} />
    </Kerangka>
  );
}
