import type { Metadata } from "next";
import Link from "next/link";
import { Ikon } from "@/components/ikon";
import { KopHalaman, tombol } from "@/components/primitif";
import { Kerangka } from "@/app/admin/kerangka";
import { BorangLayanan } from "@/app/admin/layanan/borang";
import { wajibSuperadmin } from "@/lib/sesi";

export const metadata: Metadata = { title: "Layanan Baru" };

export default async function LayananBaru({
  searchParams,
}: {
  searchParams: Promise<{ galat?: string }>;
}) {
  const { nama, peran } = await wajibSuperadmin();
  const { galat } = await searchParams;

  return (
    <Kerangka peran={peran} nama={nama}>
      <Link href="/admin/layanan" className={`${tombol("teks")} mb-3 text-[13px]`}>
        <Ikon nama="kembali" ukuran={15} />
        Kembali ke daftar layanan
      </Link>
      <KopHalaman
        judul="Layanan Baru"
        keterangan="Isi lengkap agar warga tahu syarat & alurnya sebelum datang."
      />
      <BorangLayanan galat={galat} />
    </Kerangka>
  );
}
