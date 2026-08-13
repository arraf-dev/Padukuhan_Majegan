import type { Metadata } from "next";
import Link from "next/link";
import type { StatusPengaduan } from "@/content/majegan";
import { LencanaStatus } from "@/components/potongan";
import { db } from "@/lib/db";
import { wajibMasuk } from "@/lib/sesi";
import { tanggalPendekTahun } from "@/lib/tanggal";
import { Kerangka } from "@/app/admin/kerangka";

export const metadata: Metadata = { title: "Pengaduan Warga" };

const semuaStatus: StatusPengaduan[] = ["TERKIRIM", "DIPROSES", "SELESAI"];
const labelStatus = (status?: StatusPengaduan) => {
  switch (status) {
    case "TERKIRIM":
      return "Belum Terlihat";
    case "DIPROSES":
      return "Terlihat";
    case "SELESAI":
      return "Selesai";
    default:
      return "Semua";
  }
};
export default async function PengaduanAdmin({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { nama, peran } = await wajibMasuk();
  const { status } = await searchParams;
  const pilihan = semuaStatus.find((s) => s === status);

  const daftar = await db.pengaduan.findMany({
    where: pilihan ? { status: pilihan } : undefined,
    orderBy: { dibuatPada: "desc" },
    select: {
      id: true,
      kodeTiket: true,
      kategori: true,
      isi: true,
      status: true,
      tanggapan: true,
      isAnonim: true,
      dibuatPada: true,
    },
  });

  return (
    <Kerangka peran={peran} nama={nama}>
      <h1 className="font-serif text-xl font-semibold text-hutan md:text-2xl">Pengaduan Warga</h1>
      <p className="mt-1 text-[12.5px] text-samar">
        Identitas pelapor hanya terlihat di panel ini, tidak pernah di halaman publik.
      </p>

      <div className="my-4.5 flex flex-wrap gap-2">
        {[undefined, ...semuaStatus].map((s) => {
          const ini = s === pilihan;
          return (
            <Link
              key={s ?? "semua"}
              href={s ? `/admin/pengaduan?status=${s}` : "/admin/pengaduan"}
              aria-current={ini ? "true" : undefined}
              className={`rounded-full px-4 py-2 text-[12.5px] ${
                ini
                  ? "bg-hutan font-bold text-krem"
                  : "border border-garis-tebal font-semibold text-teks hover:border-daun hover:text-hutan"
              }`}
            >
              {labelStatus(s)}
            </Link>
          );
        })}
      </div>

      {daftar.length === 0 ? (
        <p className="rounded-xl border border-dashed border-garis-tebal bg-panel px-5 py-10 text-center text-sm text-redup">
          {pilihan
  ? `Tidak ada pengaduan ${labelStatus(pilihan).toLowerCase()}.`
  : "Belum ada pengaduan masuk."}
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {daftar.map((p) => (
            <li key={p.id}>
              <Link
                href={`/admin/pengaduan/${p.id}`}
                className="block rounded-xl border border-garis bg-kertas px-4 py-3.5 transition hover:border-daun md:px-5"
              >
                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
                  
                  <LencanaStatus status={p.status} />
                  <span className="flex-none rounded-full border border-garis px-2.5 py-1 text-[11px] font-semibold text-redup">
                    {p.kategori}
                  </span>
                  <span className="flex-1" />
                  <span className="flex-none text-[11.5px] text-samar">
                    {tanggalPendekTahun(p.dibuatPada.toISOString())}
                    {p.isAnonim && " · anonim"}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-teks">{p.isi}</p>
                {!p.tanggapan && p.status !== "TERKIRIM" && (
                  <p className="mt-1.5 text-[11.5px] font-semibold text-bata">
                    Belum ada tanggapan tertulis untuk pelapor.
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Kerangka>
  );
}
