import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
      <h1 className="mb-5 font-serif text-xl font-semibold text-hutan md:text-2xl">
        Sunting Layanan
      </h1>
      <BorangLayanan awal={awal} galat={galat} />
    </Kerangka>
  );
}
