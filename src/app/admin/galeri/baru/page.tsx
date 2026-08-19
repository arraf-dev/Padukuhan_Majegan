import type { Metadata } from "next";
import Link from "next/link";
import { Ikon } from "@/components/ikon";
import { KopHalaman, tombol } from "@/components/primitif";
import { UnggahGaleri } from "@/components/unggah-galeri";
import { Kerangka } from "@/app/admin/kerangka";
import { wajibMasuk } from "@/lib/sesi";

export const metadata: Metadata = { title: "Album Galeri Baru" };

export default async function GaleriBaru() {
  const { nama, peran } = await wajibMasuk();

  return (
    <Kerangka peran={peran} nama={nama}>
      <Link href="/admin/galeri" className={`${tombol("teks")} mb-3 text-[13px]`}>
        <Ikon nama="kembali" ukuran={15} />
        Kembali ke daftar galeri
      </Link>
      <KopHalaman judul="Tambah Album Galeri" keterangan="Susun dokumentasi kegiatan agar mudah dilihat warga." />
      <UnggahGaleri />
    </Kerangka>
  );
}
