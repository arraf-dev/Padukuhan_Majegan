import type { Metadata } from "next";
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
      <h1 className="mb-5 font-serif text-xl font-semibold text-hutan md:text-2xl">Layanan Baru</h1>
      <BorangLayanan galat={galat} />
    </Kerangka>
  );
}
