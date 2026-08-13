import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Komposer } from "@/components/komposer";
import { db } from "@/lib/db";
import { wajibMasuk } from "@/lib/sesi";
import { KerangkaKomposer } from "@/app/admin/kerangka";
import { simpanBerita } from "@/app/admin/berita/aksi";

export const metadata: Metadata = { title: "Sunting Berita" };

export default async function SuntingBerita({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ galat?: string }>;
}) {
  const { nama, peran } = await wajibMasuk();
  const { id } = await params;
  const { galat } = await searchParams;

  const b = await db.berita.findUnique({
    where: { id },
    select: {
      id: true,
      judul: true,
      konten: true,
      lokasi: true,
      gambarSampul: true,
      terbitPada: true,
      dibuatPada: true,
      kategori: { select: { nama: true } },
    },
  });
  if (!b) notFound();

  return (
    <KerangkaKomposer judul="Sunting Berita" kembali="/admin/berita" nama={nama} peran={peran}>
      <Komposer
        aksi={simpanBerita}
        galat={galat}
        awal={{
          id: b.id,
          judul: b.judul,
          konten: b.konten,
          kategori: b.kategori.nama,
          lokasi: b.lokasi ?? "",
          gambarSampul: b.gambarSampul ?? "",
          tanggal: (b.terbitPada ?? b.dibuatPada).toISOString(),
        }}
      />
    </KerangkaKomposer>
  );
}
