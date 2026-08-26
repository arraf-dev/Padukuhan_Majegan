import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Ikon } from "@/components/ikon";
import { KopHalaman, tombol } from "@/components/primitif";
import { UnggahGaleri } from "@/components/unggah-galeri";
import { Kerangka } from "@/app/admin/kerangka";
import { getAlbumById } from "@/lib/galeri";
import { wajibMasuk } from "@/lib/sesi";

export const metadata: Metadata = { title: "Edit Album Galeri" };
export const dynamic = "force-dynamic";

export default async function SuntingGaleri({ params }: { params: Promise<{ id: string }> }) {
  const { nama, peran } = await wajibMasuk();
  const album = await getAlbumById((await params).id);
  if (!album) notFound();

  return (
    <Kerangka peran={peran} nama={nama}>
      <Link href="/admin/galeri" className={`${tombol("teks")} mb-3 text-[13px]`}>
        <Ikon nama="kembali" ukuran={15} />
        Kembali ke daftar galeri
      </Link>
      <KopHalaman judul="Edit Album Galeri" keterangan={album.judul} />
      <UnggahGaleri awal={album} />
    </Kerangka>
  );
}
