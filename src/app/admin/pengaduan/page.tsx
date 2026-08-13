import type { Metadata } from "next";
import Link from "next/link";
import { Ikon } from "@/components/ikon";
import { LencanaBaca } from "@/components/potongan";
import { KopHalaman, kartuPutus } from "@/components/primitif";
import { db } from "@/lib/db";
import { pilihFilterBaca, type FilterBaca } from "@/lib/pengaduan";
import { wajibMasuk } from "@/lib/sesi";
import { tanggalWaktuPendek } from "@/lib/tanggal";
import { Kerangka } from "@/app/admin/kerangka";

export const metadata: Metadata = { title: "Pengaduan Warga" };
export const dynamic = "force-dynamic";

export default async function PengaduanAdmin({
  searchParams,
}: {
  searchParams: Promise<{ baca?: string }>;
}) {
  const { nama, peran } = await wajibMasuk();
  const q = await searchParams;
  const pilihan = pilihFilterBaca(q.baca);
  const where = pilihan === "belum" ? { dibacaPada: null } : pilihan === "sudah" ? { dibacaPada: { not: null } } : undefined;

  const [daftar, semua, belum, sudah] = await Promise.all([
    db.pengaduan.findMany({
      where,
      orderBy: { dibuatPada: "desc" },
      select: {
        id: true,
        kategori: true,
        lokasi: true,
        isi: true,
        lampiranUrl: true,
        dibacaPada: true,
        dibuatPada: true,
      },
    }),
    db.pengaduan.count(),
    db.pengaduan.count({ where: { dibacaPada: null } }),
    db.pengaduan.count({ where: { dibacaPada: { not: null } } }),
  ]);

  const filter: { nilai?: FilterBaca; label: string; jumlah: number }[] = [
    { label: "Semua", jumlah: semua },
    { nilai: "belum", label: "Belum Dibaca", jumlah: belum },
    { nilai: "sudah", label: "Dibaca", jumlah: sudah },
  ];

  return (
    <Kerangka peran={peran} nama={nama}>
      <KopHalaman
        judul="Pengaduan Warga"
        keterangan={`${belum} belum dibaca · identitas pelapor hanya dapat dilihat SuperAdmin`}
      />

      <nav aria-label="Filter pengaduan" className="mb-5 grid grid-cols-3 gap-2">
        {filter.map((f) => {
          const ini = f.nilai === pilihan;
          return (
            <Link
              key={f.label}
              href={f.nilai ? `/admin/pengaduan?baca=${f.nilai}` : "/admin/pengaduan"}
              aria-current={ini ? "page" : undefined}
              className={`flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-center text-[11px] leading-tight transition-colors sm:min-h-11 sm:flex-row sm:gap-2 sm:rounded-full sm:px-4 sm:py-2.5 sm:text-[12.5px] ${
                ini
                  ? "bg-hutan font-bold text-krem"
                  : "border border-garis-tebal bg-kertas font-semibold text-teks hover:border-daun hover:bg-emas-lembut hover:text-hutan"
              }`}
            >
              <span>{f.label}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${ini ? "bg-krem/15 text-krem" : "bg-panel text-samar"}`}>
                {f.jumlah}
              </span>
            </Link>
          );
        })}
      </nav>

      {daftar.length === 0 ? (
        <p className={kartuPutus}>
          {pilihan === "belum" ? "Tidak ada pengaduan yang belum dibaca." : pilihan === "sudah" ? "Belum ada pengaduan yang sudah dibaca." : "Belum ada pengaduan masuk."}
        </p>
      ) : (
        <ul className="flex flex-col gap-3 lg:gap-4">
          {daftar.map((p) => {
            const dibaca = p.dibacaPada !== null;
            return (
              <li key={p.id}>
                <Link
                  href={`/admin/pengaduan/${p.id}`}
                  className={`group relative block overflow-hidden rounded-xl border bg-kertas px-4 py-4 shadow-sm transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-daun hover:shadow-[0_12px_28px_rgba(13,56,37,.13)] motion-reduce:transform-none motion-reduce:transition-none lg:rounded-2xl lg:px-6 lg:py-5 ${
                    dibaca ? "border-garis" : "border-emas-garis bg-emas-lembut/35"
                  }`}
                >
                  <span className={`absolute inset-y-0 left-0 w-1 ${dibaca ? "bg-daun" : "bg-emas"}`} />
                  <div className="flex flex-wrap items-start gap-x-3 gap-y-2 pl-1">
                    <LencanaBaca dibaca={dibaca} />
                    <span className="rounded-full border border-garis bg-kertas px-3 py-1.5 text-[10.5px] font-bold text-tinta">
                      {p.kategori}
                    </span>
                    <span className="min-w-full text-[11.5px] text-samar sm:ml-auto sm:min-w-0">
                      {tanggalWaktuPendek(p.dibuatPada.toISOString())}
                    </span>
                  </div>

                  <p className={`mt-3 line-clamp-3 pl-1 text-[13.5px] leading-relaxed lg:text-sm ${dibaca ? "text-teks" : "font-medium text-tinta"}`}>
                    {p.isi}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-dashed border-garis pt-3 pl-1 text-[11.5px] text-samar">
                    <span className="inline-flex items-center gap-1.5">
                      <Ikon nama="pin" ukuran={13} className="text-daun" />
                      {p.lokasi ?? "Lokasi tidak dicantumkan"}
                    </span>
                    {p.lampiranUrl && (
                      <span className="inline-flex items-center gap-1.5">
                        <Ikon nama="foto" ukuran={14} className="text-daun" /> Ada lampiran
                      </span>
                    )}
                    <span className="ml-auto inline-flex min-h-10 items-center gap-2 font-bold text-hutan">
                      Buka laporan
                      <span className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">→</span>
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Kerangka>
  );
}
