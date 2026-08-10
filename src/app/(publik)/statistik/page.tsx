import type { Metadata } from "next";
import { Hitung } from "@/components/gerak";
import { JudulSection } from "@/components/potongan";
import { kartu } from "@/components/primitif";
import { statistikPenduduk, TAHUN_DATA } from "@/lib/statistik";

export const metadata: Metadata = { title: "Statistik Penduduk" };

// Angkanya disunting dari panel admin (ADM-7).
export const dynamic = "force-dynamic";

/**
 * ponytail: bentuk grafik sama dengan teaser di Beranda — satu sumber data,
 * dua tempat tampil, tidak ada komponen grafik terpisah yang harus disamakan.
 */
export default async function Statistik() {
  const { ringkasan, usia } = await statistikPenduduk();
  // Batang tertinggi disorot. Sebelumnya dipatok `=== 100` karena data contoh
  // kebetulan memuncak di 100 — angka dari panel admin tidak selalu begitu.
  const puncak = Math.max(0, ...usia.map((u) => u.persen));

  return (
    <div className="wadah px-4 py-8 md:px-12 md:pt-10 md:pb-12 lg:px-16 lg:pt-12 lg:pb-16">
      <h1 className="judul-halaman">Statistik Penduduk</h1>
      <p className="mt-1 mb-6 text-sm text-redup lg:mt-2 lg:mb-8 lg:text-[15px]">
        Data padukuhan per {TAHUN_DATA} · sumber: perangkat dusun
      </p>

      <dl className="grid grid-cols-2 gap-3.5 md:grid-cols-4 lg:gap-5">
        {ringkasan.map((s) => (
          <div key={s.label} data-reveal className={`${kartu()} px-5 py-4.5 lg:px-6 lg:py-6`}>
            <dd className="font-serif text-[27px] font-bold text-hutan lg:text-[32px]">
              <Hitung ke={s.angka} />
            </dd>
            <dt className="mt-0.5 text-[12.5px] text-redup lg:mt-1 lg:text-[13.5px]">{s.label}</dt>
          </div>
        ))}
      </dl>

      {/* max-w-3xl dilepas: di kanvas 1336px kartu 768px menggantung di kiri
          dengan ruang kosong lebar di kanan. Mulai lg ruang itu dipakai untuk
          rincian per rentang, jadi grafiknya bisa melebar sekaligus terbaca. */}
      <section data-reveal className={`${kartu()} mt-8 px-5 py-5 max-lg:max-w-3xl md:px-6 lg:mt-10 lg:px-8 lg:py-7`}>
        <JudulSection anak="Kelompok Usia" />
        <div className="lg:grid lg:grid-cols-[1.5fr_1fr] lg:items-start lg:gap-10">
          <div className="min-w-0">
            <div className="flex h-40 items-end gap-2 md:gap-3 lg:h-56">
              {usia.map((k) => (
                <div
                  key={k.rentang}
                  style={{ height: `${k.persen}%` }}
                  className={`flex-1 rounded-t-[4px] ${k.persen === puncak ? "bg-emas" : "bg-garis-tebal"}`}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-samar lg:mt-3 lg:text-[12.5px]">
              {usia.map((k) => (
                <span key={k.rentang} className="flex-1 text-center">
                  {k.rentang}
                </span>
              ))}
            </div>
          </div>

          {/**
           * Rincian pendamping — hanya di layar lebar, mengisi ruang yang tadinya
           * kosong. Angkanya perbandingan terhadap kelompok terbesar (puncak =
           * 100), bukan persentase dari total penduduk: nilai `persen` di data
           * memang berskala relatif, jumlahnya tidak 100.
           */}
          <div className="mt-6 border-t border-garis pt-4 max-lg:hidden lg:mt-0 lg:border-t-0 lg:pt-0">
            <div className="mb-3 text-[11px] font-bold tracking-[.1em] text-samar">
              DIBANDING KELOMPOK TERBESAR
            </div>
            <ul aria-label="Perbandingan kelompok usia">
              {usia.map((k) => (
                <li key={k.rentang} className="flex items-center gap-3 border-b border-garis py-2 last:border-b-0">
                  <span className="w-16 flex-none text-[13px] font-semibold text-tinta">{k.rentang}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-panel">
                    <div
                      style={{ width: `${puncak ? (k.persen / puncak) * 100 : 0}%` }}
                      className={`h-full rounded-full ${k.persen === puncak ? "bg-emas" : "bg-garis-tebal"}`}
                    />
                  </div>
                  <span className="w-11 flex-none text-right font-mono text-[12.5px] font-semibold text-emas-tua">
                    {puncak ? Math.round((k.persen / puncak) * 100) : 0}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
