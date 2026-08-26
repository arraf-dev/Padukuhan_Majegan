import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Ikon } from "@/components/ikon";
import { KopHalaman, tombol } from "@/components/primitif";
import { BorangPotensi } from "@/app/admin/potensi/borang";
import { Kerangka } from "@/app/admin/kerangka";
import { getPotensiAlbumOptions, getPotensiById, getPotensiCategories } from "@/lib/potensi";
import { wajibMasuk } from "@/lib/sesi";

export const metadata: Metadata = { title: "Edit Potensi" };
export const dynamic = "force-dynamic";

export default async function SuntingPotensi({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ galat?: string }>;
}) {
  const { nama, peran } = await wajibMasuk();
  const { id } = await params;
  const { galat } = await searchParams;
  const [awal, kategori] = await Promise.all([getPotensiById(id), getPotensiCategories()]);
  if (!awal) notFound();
  const albumOptions = await getPotensiAlbumOptions(id);

  return (
    <Kerangka peran={peran} nama={nama}>
      <Link href="/admin/potensi" className={`${tombol("teks")} mb-3 text-[13px]`}>
        <Ikon nama="kembali" ukuran={15} /> Kembali ke Potensi
      </Link>
      <KopHalaman judul="Edit Potensi" keterangan={awal.judul} />
      <BorangPotensi awal={awal} kategori={kategori} albumOptions={albumOptions} galat={galat} />
    </Kerangka>
  );
}
