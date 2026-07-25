import type { Metadata } from "next";
import { anggaran, desa } from "@/content/majegan";
import { Ikon } from "@/components/ikon";
import { JudulSection } from "@/components/potongan";
import { tanggalPanjang } from "@/lib/tanggal";

export const metadata: Metadata = {
  title: "Transparansi Anggaran",
  description: `Ringkasan pendapatan dan belanja ${desa.nama} tahun ${anggaran.tahun}.`,
};

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const persen = (nominal: number, dari: number) => Math.round((nominal / dari) * 100);

export default function Anggaran() {
  const sisa = anggaran.pendapatan - anggaran.belanja;
  const terbesar = Math.max(...anggaran.bidang.map((b) => b.nominal));

  const ringkas = [
    { label: "PENDAPATAN", nominal: anggaran.pendapatan, warna: "text-hutan" },
    { label: "BELANJA", nominal: anggaran.belanja, warna: "text-hutan" },
    { label: "SISA / SILPA", nominal: sisa, warna: sisa < 0 ? "text-bata" : "text-daun" },
  ];

  return (
    <div className="px-4 py-8 md:px-12 md:pt-9 md:pb-12">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="font-serif text-2xl font-semibold text-hutan md:text-[32px]">
          Transparansi Anggaran
        </h1>
        <p className="text-sm text-redup">
          Tahun anggaran {anggaran.tahun} · diperbarui {tanggalPanjang(anggaran.diperbarui)}
        </p>
      </div>

      {!anggaran.resmi && (
        <p
          role="note"
          className="mt-4 flex items-start gap-2.5 rounded-[10px] border border-bata/35 bg-bata/10 px-4 py-3 text-[12.5px] leading-relaxed text-bata"
        >
          <Ikon nama="gembok" ukuran={14} className="mt-0.5 flex-none" />
          <span>
            <strong>Angka contoh, belum resmi.</strong> Izin publikasi APBDes dari kalurahan masih
            diproses — halaman ini menampilkan struktur tampilannya, bukan data sebenarnya.
          </span>
        </p>
      )}

      <dl className="mt-5 grid gap-4 md:grid-cols-3">
        {ringkas.map((r) => (
          <div key={r.label} data-reveal className="rounded-xl border border-garis bg-kertas px-5 py-4.5">
            <dt className="text-[11.5px] font-bold tracking-[.08em] text-redup">{r.label}</dt>
            <dd className={`mt-1.5 font-serif text-[26px] font-bold ${r.warna}`}>
              {rupiah.format(r.nominal)}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid items-start gap-7 md:grid-cols-[1.4fr_1fr]">
        <section data-reveal className="rounded-xl border border-garis bg-kertas px-5 py-5 md:px-6.5 md:py-6">
          <JudulSection anak="Belanja per Bidang" />
          <ul className="flex flex-col gap-4">
            {anggaran.bidang.map((b) => (
              <li key={b.nama}>
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span className="flex-1 text-[13.5px] font-semibold text-tinta">{b.nama}</span>
                  <span className="font-mono text-[13px] font-bold text-hutan">
                    {rupiah.format(b.nominal)}
                  </span>
                  <span className="w-10 text-right text-[11.5px] text-samar">
                    {persen(b.nominal, anggaran.belanja)}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-panel">
                  <div
                    style={{ width: `${persen(b.nominal, terbesar)}%` }}
                    className="h-full rounded-full bg-hutan"
                  />
                </div>
                <p className="mt-1 text-[11.5px] text-samar">{b.catatan}</p>
              </li>
            ))}
          </ul>
        </section>

        <section data-reveal className="rounded-xl border border-garis bg-kertas px-5 py-5 md:px-6">
          <JudulSection anak="Sumber Pendapatan" />
          <ul className="flex flex-col">
            {anggaran.sumber.map((s, i) => (
              <li
                key={s.nama}
                className={`flex flex-wrap items-baseline gap-x-3 py-2.5 ${
                  i < anggaran.sumber.length - 1 ? "border-b border-dashed border-garis" : ""
                }`}
              >
                <span className="flex-1 text-[13px] text-teks">{s.nama}</span>
                <span className="font-mono text-[12.5px] font-bold text-hutan">
                  {rupiah.format(s.nominal)}
                </span>
                <span className="w-10 text-right text-[11.5px] text-samar">
                  {persen(s.nominal, anggaran.pendapatan)}%
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-4 rounded-[10px] border border-emas-garis bg-emas-muda px-4 py-3 text-xs leading-relaxed text-emas-teks">
            Rincian lengkap APBDes tersedia di Balai Dusun. Ada pertanyaan soal penggunaan
            anggaran? Sampaikan lewat halaman Pengaduan.
          </p>
        </section>
      </div>
    </div>
  );
}
