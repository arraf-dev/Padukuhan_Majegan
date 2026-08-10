import type { Metadata } from "next";
import Link from "next/link";
import type { StatusPengaduan } from "@/content/majegan";
import { LencanaStatus } from "@/components/potongan";
import { KopHalaman, kartu, kartuPutus } from "@/components/primitif";
import { db } from "@/lib/db";
import { wajibMasuk } from "@/lib/sesi";
import { tanggalPendekTahun } from "@/lib/tanggal";
import { Kerangka } from "@/app/admin/kerangka";

export const metadata: Metadata = { title: "Pengaduan Warga" };

const semuaStatus: StatusPengaduan[] = ["TERKIRIM", "DIPROSES", "SELESAI"];

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
      <KopHalaman
        judul="Pengaduan Warga"
        keterangan="Identitas pelapor hanya terlihat di panel ini, tidak pernah di halaman publik."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {[undefined, ...semuaStatus].map((s) => {
          const ini = s === pilihan;
          return (
            <Link
              key={s ?? "semua"}
              href={s ? `/admin/pengaduan?status=${s}` : "/admin/pengaduan"}
              aria-current={ini ? "true" : undefined}
              className={`rounded-full px-4 py-2 text-[12.5px] transition-colors duration-200 ease-out ${
                ini
                  ? "bg-hutan font-bold text-krem"
                  : "border border-garis-tebal font-semibold text-teks hover:border-daun hover:bg-emas-lembut hover:text-hutan"
              }`}
            >
              {s ?? "Semua"}
            </Link>
          );
        })}
      </div>

      {daftar.length === 0 ? (
        <p className={kartuPutus}>
          {pilihan ? `Tidak ada pengaduan berstatus ${pilihan}.` : "Belum ada pengaduan masuk."}
        </p>
      ) : (
        // Sengaja tetap satu kolom: barisnya memuat cuplikan isi yang panjang,
        // dua kolom malah menyempitkan teks yang jadi alasan baris ini dibaca.
        <ul className="flex flex-col gap-2.5 lg:gap-3">
          {daftar.map((p) => (
            <li key={p.id}>
              <Link
                href={`/admin/pengaduan/${p.id}`}
                className={`${kartu(true)} block px-4 py-3.5 md:px-5 lg:px-6 lg:py-4`}
              >
                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
                  <span className="flex-none font-mono text-[13px] font-bold text-hutan">
                    {p.kodeTiket}
                  </span>
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
