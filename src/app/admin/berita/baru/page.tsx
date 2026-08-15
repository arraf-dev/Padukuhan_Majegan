import type { Metadata } from "next";
import { Komposer } from "@/components/komposer";
import { wajibMasuk } from "@/lib/sesi";
import { KerangkaKomposer } from "@/app/admin/kerangka";
import { simpanBerita } from "@/app/admin/berita/aksi";

export const metadata: Metadata = { title: "Buat Postingan Berita" };

export default async function BeritaBaru({
  searchParams,
}: {
  searchParams: Promise<{ galat?: string }>;
}) {
  const { nama, peran } = await wajibMasuk();
  const { galat } = await searchParams;

  return (
    <KerangkaKomposer
        judul="Buat Postingan Berita"
        kembali="/admin/berita"
        nama={nama}
        peran={peran}
      >
      <Komposer aksi={simpanBerita} galat={galat} />
    </KerangkaKomposer>
  );
}
