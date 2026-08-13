import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { StatusPengaduan } from "@/content/majegan";
import { Ikon } from "@/components/ikon";
import { LencanaStatus } from "@/components/potongan";
import { db } from "@/lib/db";
import { wajibMasuk } from "@/lib/sesi";
import { tanggalPanjang } from "@/lib/tanggal";
import { Kerangka } from "@/app/admin/kerangka";
import { tanggapiPengaduan } from "@/app/admin/pengaduan/aksi";

export const metadata: Metadata = { title: "Tindak Lanjut Pengaduan" };

const pilihanStatus = [
  {
    nilai: "TERKIRIM" as StatusPengaduan,
    label: "BELUM TERLIHAT",
    keterangan: "Belum dibuka admin",
  },
  {
    nilai: "DIPROSES" as StatusPengaduan,
    label: "TERLIHAT",
    keterangan: "Sedang diproses",
  },
  {
    nilai: "SELESAI" as StatusPengaduan,
    label: "SELESAI",
    keterangan: "Pengaduan telah selesai",
  },
];  

export default async function DetailPengaduan({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ galat?: string; tersimpan?: string }>;
}) {
  const { nama, peran } = await wajibMasuk();
  const { id } = await params;
  const { galat, tersimpan } = await searchParams;

  const p = await db.pengaduan.findUnique({ where: { id } });
  if (!p) notFound();

  const baris = "text-[13.5px] text-teks";

  return (
    <Kerangka peran={peran} nama={nama}>
      <Link
        href="/admin/pengaduan"
        className="inline-flex items-center gap-2 text-[13px] font-semibold text-daun hover:text-hutan"
      >
        <Ikon nama="kembali" ukuran={15} />
        Kembali ke daftar pengaduan
      </Link>

<div className="mt-4 flex flex-wrap items-center gap-3">
  <LencanaStatus status={p.status} />
  <span className="text-[12.5px] text-samar">
    masuk {tanggalPanjang(p.dibuatPada.toISOString())}
  </span>
</div>

      {tersimpan && (
        <p
          role="status"
          className="mt-4 rounded-[10px] border border-emas-garis bg-emas-muda px-4 py-3 text-[13px] font-semibold text-emas-teks"
        >
          Status pengaduan berhasil diperbarui.
        </p>
      )}

      <div className="mt-4 grid items-start gap-4 md:grid-cols-[1.4fr_1fr]">
        <section className="rounded-xl border border-garis bg-kertas px-5 py-4.5">
          <h2 className="font-serif text-base font-semibold text-hutan">Isi laporan</h2>
          <p className="mt-2 text-[14px] leading-relaxed whitespace-pre-line text-teks">{p.isi}</p>

          <dl className="mt-4 grid gap-2 border-t border-dashed border-garis pt-3.5">
            <div className="flex gap-3">
              <dt className="w-24 flex-none text-[12.5px] font-bold text-tinta">Kategori</dt>
              <dd className={baris}>{p.kategori}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 flex-none text-[12.5px] font-bold text-tinta">Lokasi</dt>
              <dd className={baris}>{p.lokasi ?? "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-garis bg-kertas px-5 py-4.5">
          <h2 className="font-serif text-base font-semibold text-hutan">Pelapor</h2>
          {p.isAnonim ? (
            <p className="mt-2 flex items-start gap-2.5 rounded-[10px] border border-garis bg-krem px-3.5 py-3 text-[12.5px] leading-relaxed text-redup">
              <Ikon nama="gembok" ukuran={14} className="mt-0.5 flex-none" />
            Pengaduan dikirim secara anonim. Identitas pelapor tidak disimpan sehingga tidak dapat dihubungi.
            </p>
          ) : (
            <dl className="mt-2 grid gap-2">
              <div className="flex gap-3">
                <dt className="w-16 flex-none text-[12.5px] font-bold text-tinta">Nama</dt>
                <dd className={baris}>{p.namaPelapor ?? "—"}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-16 flex-none text-[12.5px] font-bold text-tinta">Kontak</dt>
                <dd className={`${baris} font-mono`}>{p.kontak ?? "—"}</dd>
              </div>
            </dl>
          )}
          <p className="mt-3 text-[11.5px] leading-relaxed text-samar">
            Data ini hanya tampil di panel. Halaman publik tidak pernah memuatnya.
          </p>
        </section>
      </div>

      <form
        action={tanggapiPengaduan}
        className="mt-4 rounded-xl border border-garis bg-kertas px-5 py-4.5"
      >
        <input type="hidden" name="id" value={p.id} />
        <h2 className="font-serif text-base font-semibold text-hutan">Tindak lanjut</h2>

        {galat && (
          <p
            role="alert"
            className="mt-3 rounded-[10px] border border-bata/40 bg-bata/10 px-4 py-3 text-[13px] font-semibold text-bata"
          >
            Tulis tanggapan dulu sebelum menandai laporan selesai.
          </p>
        )}

        <fieldset className="mt-3.5">
          <legend className="mb-2 text-[13px] font-bold text-tinta">Status</legend>
          <div className="flex flex-col gap-2">
            {pilihanStatus.map((s) => (
              <label
                key={s.nilai}
                className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-garis px-3.5 py-2.5 has-checked:border-hutan has-checked:bg-krem"
              >
                <input
                  type="radio"
                  name="status"
                  value={s.nilai}
                  defaultChecked={p.status === s.nilai}
                  className="size-4 flex-none accent-hutan"
                />
                <span className="text-[13.5px] font-bold text-tinta">
  {s.label}
</span>
                <span className="text-[12px] text-samar">{s.keterangan}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label htmlFor="tanggapan" className="mt-4 mb-1.5 block text-[13px] font-bold text-tinta">
          Tanggapan untuk pelapor
        </label>
        <textarea
          id="tanggapan"
          name="tanggapan"
          rows={4}
          defaultValue={p.tanggapan ?? ""}
          placeholder="Tulis apa yang sudah atau akan dilakukan perangkat dusun…"
          className="w-full rounded-[9px] border-[1.5px] border-garis-tebal bg-kertas px-3.5 py-3 text-sm leading-relaxed text-tinta placeholder:text-samar focus:border-daun"
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="min-h-11 rounded-[10px] bg-hutan px-6 py-3 text-sm font-bold text-krem hover:bg-daun"
          >
            Simpan Perubahan
          </button>
          <span className="text-xs text-samar">
            Tanggapan akan langsung ditampilkan kepada pelapor.
          </span>
        </div>
      </form>
    </Kerangka>
  );
}
