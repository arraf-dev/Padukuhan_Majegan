import type { Metadata } from "next";
import Link from "next/link";
import { type StatusPengaduan } from "@/content/majegan";
import { Ikon } from "@/components/ikon";
import { db } from "@/lib/db";
import { tanggalPanjang } from "@/lib/tanggal";

export const metadata: Metadata = {
  title: "Lacak Pengaduan",
  description: "Cek perkembangan laporan Anda dengan kode tiket yang diberikan saat pengiriman.",
};

const tahap: StatusPengaduan[] = ["TERKIRIM", "DIPROSES", "SELESAI"];

const keterangan: Record<StatusPengaduan, string> = {
  TERKIRIM: "Laporan masuk dan menunggu ditinjau perangkat dusun.",
  DIPROSES: "Laporan sedang ditindaklanjuti.",
  SELESAI: "Laporan sudah selesai ditangani.",
};

export default async function Lacak({
  searchParams,
}: {
  searchParams: Promise<{ kode?: string }>;
}) {
  const dicari = (await searchParams).kode?.trim().toUpperCase() ?? "";

  // Halaman ini publik: siapa pun yang menebak kode tiket bisa membukanya.
  // `select` sengaja sempit — tanpa itu nama & kontak pelapor ikut terkirim ke
  // browser (LPR-3, kebijakan privasi Bab 12). Jangan tambah field ke sini.
  const hasil = dicari
    ? await db.pengaduan.findUnique({
        where: { kodeTiket: dicari },
        select: {
          kodeTiket: true,
          kategori: true,
          isi: true,
          status: true,
          tanggapan: true,
          dibuatPada: true,
        },
      })
    : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      <h1 className="font-serif text-2xl font-semibold text-hutan md:text-[30px]">
        Lacak Pengaduan
      </h1>
      <p className="mt-1.5 text-sm leading-relaxed text-teks">
        Masukkan kode tiket yang Anda terima setelah mengirim laporan — contohnya{" "}
        <span className="font-mono font-bold text-emas-tua">MJG-2607-4X9K</span>.
      </p>

      <form className="mt-5 flex flex-wrap gap-2.5">
        <label htmlFor="kode" className="sr-only">
          Kode tiket
        </label>
        <input
          id="kode"
          name="kode"
          defaultValue={dicari}
          required
          autoCapitalize="characters"
          placeholder="MJG-XXXX-XXXX"
          className="min-w-52 flex-1 rounded-[9px] border-[1.5px] border-garis-tebal bg-kertas px-3.5 py-3 font-mono text-sm tracking-wide text-tinta uppercase placeholder:font-sans placeholder:normal-case placeholder:text-samar focus:border-daun"
        />
        <button
          type="submit"
          className="min-h-11 rounded-[10px] bg-hutan px-6 py-3 text-sm font-extrabold text-krem hover:bg-daun"
        >
          Lacak
        </button>
      </form>

      {dicari && !hasil && (
        <p
          role="status"
          className="mt-5 rounded-[10px] border border-bata/35 bg-bata/10 px-4 py-3.5 text-[13px] leading-relaxed text-bata"
        >
          Kode <strong className="font-mono">{dicari}</strong> tidak ditemukan. Periksa kembali
          penulisannya, atau hubungi perangkat dusun bila kode sudah benar.
        </p>
      )}

      {hasil && (
        <section className="mt-5 rounded-2xl border border-garis bg-kertas px-5 py-5 md:px-7 md:py-6">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-base font-bold text-hutan">{hasil.kodeTiket}</span>
            <span className="text-xs text-samar">
              {hasil.kategori} · dikirim {tanggalPanjang(hasil.dibuatPada.toISOString())}
            </span>
          </div>
          <p className="mt-2.5 text-[14px] leading-relaxed text-teks">{hasil.isi}</p>

          <ol className="mt-5 flex flex-col">
            {tahap.map((t, i) => {
              const lewat = tahap.indexOf(hasil.status) >= i;
              const akhir = i === tahap.length - 1;
              return (
                <li key={t} className="flex gap-3.5">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex size-7 flex-none items-center justify-center rounded-full text-xs font-extrabold ${
                        lewat ? "bg-hutan text-emas" : "border-[1.5px] border-garis-tebal text-pucat"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {!akhir && (
                      <span className={`w-0.5 flex-1 ${lewat ? "bg-hutan/40" : "bg-garis"}`} />
                    )}
                  </div>
                  <div className={akhir ? "pt-0.5" : "pt-0.5 pb-4"}>
                    <div
                      className={`text-[13.5px] font-bold ${lewat ? "text-tinta" : "text-pucat"}`}
                    >
                      {t}
                    </div>
                    <div className="mt-0.5 text-[12.5px] text-redup">{keterangan[t]}</div>
                  </div>
                </li>
              );
            })}
          </ol>

          {hasil.tanggapan && (
            <div className="mt-1 rounded-[10px] border border-emas-garis bg-emas-muda px-4 py-3.5">
              <div className="mb-1 text-[11.5px] font-bold tracking-[.08em] text-emas-tua">
                TANGGAPAN PERANGKAT DUSUN
              </div>
              <p className="text-[13px] leading-relaxed text-emas-teks">{hasil.tanggapan}</p>
            </div>
          )}
        </section>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[10px] border border-garis bg-krem px-4 py-3.5 text-[12.5px] text-redup">
        <Ikon nama="obrolan" ukuran={16} className="flex-none text-daun" />
        Kehilangan kode tiket?{" "}
        <Link href="/pengaduan" className="font-semibold text-daun underline">
          kirim laporan baru
        </Link>{" "}
        atau hubungi perangkat dusun lewat WhatsApp.
      </div>
    </div>
  );
}
