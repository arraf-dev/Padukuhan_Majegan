import type { Metadata } from "next";
import { Hitung } from "@/components/gerak";
import { JudulSection } from "@/components/potongan";
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
    <div className="px-4 py-8 md:px-12 md:pt-9 md:pb-12">
      <h1 className="font-serif text-2xl font-semibold text-hutan md:text-[32px]">
        Statistik Penduduk
      </h1>
      <p className="mt-1 mb-6 text-sm text-redup">
        Data padukuhan per {TAHUN_DATA} · sumber: perangkat dusun
      </p>

      <dl className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
        {ringkasan.map((s) => (
          <div key={s.label} data-reveal className="rounded-xl border border-garis bg-kertas px-5 py-4.5">
            <dd className="font-serif text-[27px] font-bold text-hutan">
              <Hitung ke={s.angka} />
            </dd>
            <dt className="mt-0.5 text-[12.5px] text-redup">{s.label}</dt>
          </div>
        ))}
      </dl>

      <section data-reveal className="mt-8 max-w-3xl rounded-xl border border-garis bg-kertas px-5 py-5 md:px-6">
        <JudulSection anak="Kelompok Usia" />
        <div className="flex h-40 items-end gap-2 md:gap-3">
          {usia.map((k) => (
            <div
              key={k.rentang}
              style={{ height: `${k.persen}%` }}
              className={`flex-1 rounded-t-[4px] ${k.persen === puncak ? "bg-emas" : "bg-garis-tebal"}`}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-samar">
          {usia.map((k) => (
            <span key={k.rentang} className="flex-1 text-center">
              {k.rentang}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
