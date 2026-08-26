import type { Metadata } from "next";
import Link from "next/link";
import { Ikon } from "@/components/ikon";
import { KopHalaman, tombol } from "@/components/primitif";
import { BorangPotensi } from "@/app/admin/potensi/borang";
import { Kerangka } from "@/app/admin/kerangka";
import { getPotensiAlbumOptions, getPotensiCategories } from "@/lib/potensi";
import { wajibMasuk } from "@/lib/sesi";

export const metadata: Metadata = { title: "Potensi Baru" };

export default async function PotensiBaru({ searchParams }: { searchParams: Promise<{ galat?: string }> }) {
  const { nama, peran } = await wajibMasuk();
  const { galat } = await searchParams;
  const [kategori, albumOptions] = await Promise.all([getPotensiCategories(), getPotensiAlbumOptions()]);

  return (
    <Kerangka peran={peran} nama={nama}>
      <Link href="/admin/potensi" className={`${tombol("teks")} mb-3 text-[13px]`}>
        <Ikon nama="kembali" ukuran={15} /> Kembali ke Potensi
      </Link>
      <KopHalaman judul="Tambah Potensi" keterangan="Buat cerita baru untuk Pariwisata, UMKM, atau Budaya Majegan." />
      <BorangPotensi kategori={kategori} albumOptions={albumOptions} galat={galat} />
    </Kerangka>
  );
}
