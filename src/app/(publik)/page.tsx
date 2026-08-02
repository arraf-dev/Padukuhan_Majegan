import Link from "next/link";
import { pengumuman } from "@/content/majegan";
import { Hitung } from "@/components/gerak";
import { JudulSection, KartuRingkas } from "@/components/potongan";
import { Sambutan } from "@/components/sambutan";
import { beritaTerbit } from "@/lib/berita";
import { type KelompokUsia, statistikPenduduk } from "@/lib/statistik";
import { tanggalPendek } from "@/lib/tanggal";

// ponytail: sama seperti halaman Berita — on-demand dulu, ISR di Minggu 5.
export const dynamic = "force-dynamic";

export default async function Beranda() {
  const [terbaru, { ringkasan, usia }] = await Promise.all([beritaTerbit(3), statistikPenduduk()]);

  return (
    <>
      <Sambutan ringkasan={ringkasan} />

      {/* Pengumuman berjalan — berhenti bila pengguna minta gerak dikurangi.
          Hanya di mobile; layar lebar memakai kartu "Pengumuman Terbaru" di bawah. */}
      <div className="mx-4 flex items-center gap-2.5 overflow-hidden rounded-[10px] border border-emas-garis bg-emas-muda px-3.5 py-2.5 md:hidden">
        <span className="flex-none text-[10px] font-bold tracking-[.08em] text-emas-tua">
          PENGUMUMAN
        </span>
        <div className="h-6 flex-1 overflow-hidden">
          <div className="ticker flex flex-col">
            {[...pengumuman, pengumuman[0]].map((p, i) => (
              <span
                key={i}
                className="flex h-6 items-center whitespace-nowrap text-[12.5px] text-emas-teks"
              >
                {p.teks}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Berita & pengumuman ---------- */}
      <section className="px-4 pt-6 pb-10 md:px-12 md:pt-2 md:pb-10">
        <div className="md:hidden">
          <div className="mb-2.5 flex items-baseline justify-between">
            <h2 className="font-serif text-lg font-semibold text-hutan">Berita Terbaru</h2>
            <Link href="/berita" className="text-[12.5px] font-semibold text-daun">
              Lihat semua →
            </Link>
          </div>
        </div>
        <div className="hidden md:block">
          <JudulSection anak="Berita & Pengumuman" tautan={{ href: "/berita", label: "Lihat semua" }} />
        </div>

        <div className="flex flex-col gap-2.5 md:grid md:grid-cols-3 md:gap-4.5">
          {terbaru.map((b) => (
            <KartuRingkas key={b.slug} b={b} />
          ))}
        </div>

        <div className="mt-2.5 grid gap-2.5 md:mt-4.5 md:grid-cols-2 md:gap-4.5">
          <div
            data-reveal
            className="rounded-xl border border-garis bg-kertas p-3.5 transition md:px-5.5 md:py-5 md:hover:-translate-y-[3px]"
          >
            <div className="mb-2 font-serif text-[13px] font-semibold text-hutan md:mb-2.5 md:text-[15px]">
              Statistik Penduduk
            </div>
            <BatangUsia usia={usia} />
            <div className="mt-2 flex justify-between text-[10.5px] text-samar max-md:hidden">
              {usia.map((k) => (
                <span key={k.rentang}>{k.rentang}</span>
              ))}
            </div>
            <div className="mt-2 font-serif text-lg font-bold text-hutan md:hidden">
              <Hitung ke={ringkasan[0]?.angka ?? 0} />
            </div>
            <div className="text-[10.5px] text-samar md:hidden">jiwa · data 2026</div>
            <Link
              href="/statistik"
              className="mt-2.5 inline-block text-[12.5px] font-semibold text-daun max-md:hidden"
            >
              Lihat statistik →
            </Link>
          </div>

          <div
            data-reveal
            className="rounded-xl border border-garis bg-kertas px-5.5 py-5 transition hover:-translate-y-[3px] max-md:hidden"
          >
            <div className="mb-2.5 font-serif text-[15px] font-semibold text-hutan">
              Pengumuman Terbaru
            </div>
            <ul className="flex flex-col gap-2.5 text-[13px] leading-snug">
              {pengumuman.slice(0, 3).map((p) => (
                <li key={p.tanggal} className="flex gap-2.5">
                  <span className="flex-none pt-0.5 font-mono text-[11px] font-semibold text-emas-tua">
                    {tanggalPendek(p.tanggal)}
                  </span>
                  <span>{p.teks}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

/** Batang kelompok usia — dipakai di teaser Beranda. */
function BatangUsia({ usia }: { usia: KelompokUsia[] }) {
  const puncak = Math.max(0, ...usia.map((u) => u.persen));

  return (
    <div className="flex h-10 items-end gap-[5px] md:h-[52px] md:gap-[7px]">
      {usia.map((k) => (
        <div
          key={k.rentang}
          style={{ height: `${k.persen}%` }}
          title={`${k.rentang} tahun`}
          className={`flex-1 rounded-t md:rounded-t-[4px] ${
            k.persen === puncak ? "bg-emas" : "bg-garis-tebal"
          }`}
        />
      ))}
    </div>
  );
}
