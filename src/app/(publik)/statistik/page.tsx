import type { Metadata } from "next";
import { Hitung } from "@/components/gerak";
import { JudulSection } from "@/components/potongan";
import { kartu } from "@/components/primitif";
import { type KelompokUsia, type RincianStatistik, statistikPenduduk, TAHUN_DATA } from "@/lib/statistik";

export const metadata: Metadata = { title: "Statistik Penduduk" };
export const dynamic = "force-dynamic";

export default async function Statistik() {
  const { ringkasan, usia, jenisKelamin, pekerjaan, pendidikan } = await statistikPenduduk();

  return (
    <div className="wadah px-4 py-8 md:px-12 md:pt-10 md:pb-12 lg:px-16 lg:pt-12 lg:pb-16">
      <h1 className="judul-halaman">Statistik Penduduk</h1>
      <p className="mt-1 mb-6 text-sm text-redup lg:mt-2 lg:mb-8 lg:text-[15px]">Data padukuhan per {TAHUN_DATA} · sumber: perangkat dusun</p>

      <dl className="grid grid-cols-2 gap-3.5 md:grid-cols-4 lg:gap-5">
        {ringkasan.map((s) => <div key={s.label} data-reveal className={`${kartu()} px-5 py-4.5 lg:px-6 lg:py-6`}><dd className="font-serif text-[27px] font-bold text-hutan lg:text-[32px]"><Hitung ke={s.angka} /></dd><dt className="mt-0.5 text-[12.5px] text-redup lg:mt-1 lg:text-[13.5px]">{s.label}</dt></div>)}
      </dl>

      <section data-reveal className={`${kartu()} mt-8 px-5 py-5 md:px-6 lg:mt-10 lg:px-8 lg:py-7`}>
        <JudulSection anak="Kelompok Usia" />
        {usia.length ? <GrafikUsia data={usia} /> : <Kosong teks="Data kelompok usia belum tersedia." />}
      </section>

      <div className="mt-5 grid gap-5 lg:mt-6 lg:grid-cols-2 lg:gap-6">
        <section data-reveal className={`${kartu()} px-5 py-5 md:px-6 lg:px-7 lg:py-6`}>
          <JudulSection anak="Jenis Kelamin" />
          {jenisKelamin.length ? <Komposisi data={jenisKelamin} /> : <Kosong teks="Data jenis kelamin belum tersedia." />}
        </section>
        <section data-reveal className={`${kartu()} px-5 py-5 md:px-6 lg:px-7 lg:py-6`}>
          <JudulSection anak="Pendidikan Terakhir" />
          {pendidikan.length ? <BarisData data={pendidikan} /> : <Kosong teks="Data pendidikan belum tersedia." />}
        </section>
      </div>

      <section data-reveal className={`${kartu()} mt-5 px-5 py-5 md:px-6 lg:mt-6 lg:px-8 lg:py-7`}>
        <JudulSection anak="Pekerjaan Utama" />
        {pekerjaan.length ? <BarisData data={pekerjaan} lebar /> : <Kosong teks="Data pekerjaan belum tersedia." />}
      </section>
    </div>
  );
}

function GrafikUsia({ data }: { data: KelompokUsia[] }) {
  const puncak = Math.max(1, ...data.map((d) => d.persen));
  return <><div className="flex h-44 items-end gap-2 pt-4 md:h-56 md:gap-3">{data.map((d) => <div key={d.rentang} className="group flex flex-1 flex-col justify-end"><span className="mb-1 text-center font-mono text-[11px] font-semibold text-emas-tua opacity-0 transition-opacity group-hover:opacity-100">{d.persen}%</span><div style={{ height: `${(d.persen / puncak) * 100}%` }} className="min-h-1 rounded-t bg-daun transition-colors group-hover:bg-emas" /></div>)}</div><div className="mt-2 grid gap-2 text-center text-[11px] text-samar" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>{data.map((d) => <span key={d.rentang}>{d.rentang}</span>)}</div><p className="mt-4 text-[11.5px] text-samar">Batang menunjukkan perbandingan relatif antarkelompok usia.</p></>;
}

function Komposisi({ data }: { data: RincianStatistik[] }) {
  const total = data.reduce((sum, d) => sum + d.angka, 0);
  return <div className="mt-4"><div className="flex h-4 overflow-hidden rounded-full bg-panel">{data.map((d, i) => <div key={d.label} style={{ width: `${total ? (d.angka / total) * 100 : 0}%` }} className={i % 2 ? "bg-emas" : "bg-daun"} title={`${d.label}: ${d.angka} jiwa`} />)}</div><dl className="mt-4 grid gap-2 sm:grid-cols-2">{data.map((d, i) => <div key={d.label} className="flex items-center justify-between rounded-[10px] bg-panel px-3 py-2.5"><dt className="flex items-center gap-2 text-[12.5px] text-teks"><span className={`size-2.5 rounded-full ${i % 2 ? "bg-emas" : "bg-daun"}`} />{d.label}</dt><dd className="font-mono text-[13px] font-bold text-hutan">{d.angka.toLocaleString("id-ID")} <span className="text-[11px] font-medium text-samar">jiwa</span></dd></div>)}</dl></div>;
}

function BarisData({ data, lebar = false }: { data: RincianStatistik[]; lebar?: boolean }) {
  const puncak = Math.max(1, ...data.map((d) => d.angka));
  return <ul className={`mt-4 grid gap-3 ${lebar ? "lg:grid-cols-2 lg:gap-x-8" : ""}`}>{data.map((d) => <li key={d.label}><div className="mb-1 flex items-baseline justify-between gap-3 text-[12.5px]"><span className="font-semibold text-tinta">{d.label}</span><span className="font-mono text-emas-tua">{d.angka.toLocaleString("id-ID")} jiwa</span></div><div className="h-2 overflow-hidden rounded-full bg-panel"><div style={{ width: `${(d.angka / puncak) * 100}%` }} className="h-full rounded-full bg-daun" /></div></li>)}</ul>;
}

function Kosong({ teks }: { teks: string }) { return <p className="mt-4 rounded-[10px] border border-dashed border-garis-tebal bg-panel px-4 py-3 text-[12.5px] text-samar">{teks}</p>; }
