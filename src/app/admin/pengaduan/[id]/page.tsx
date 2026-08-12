import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { StatusPengaduan } from "@/content/majegan";
import { Ikon } from "@/components/ikon";
import { LencanaStatus } from "@/components/potongan";
import { KopHalaman, isianTebal, kartu, labelBorang, tombol } from "@/components/primitif";
import { db } from "@/lib/db";
import { wajibMasuk } from "@/lib/sesi";
import { tanggalPanjang } from "@/lib/tanggal";
import { Kerangka } from "@/app/admin/kerangka";
import { tanggapiPengaduan } from "@/app/admin/pengaduan/aksi";

export const metadata: Metadata = { title: "Tindak Lanjut Pengaduan" };

const pilihanStatus: { nilai: StatusPengaduan; keterangan: string }[] = [
  { nilai: "TERKIRIM", keterangan: "Belum ditinjau" },
  { nilai: "DIPROSES", keterangan: "Sedang ditindaklanjuti" },
  { nilai: "SELESAI", keterangan: "Sudah ditangani — wajib menulis tanggapan" },
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
      <Link href="/admin/pengaduan" className={`${tombol("teks")} mb-3 text-[13px]`}>
        <Ikon nama="kembali" ukuran={15} />
        Kembali ke daftar pengaduan
      </Link>

      {/* Judul halaman, bukan kode tiket: kode turun jadi keterangan supaya jelas
          halaman apa yang sedang dibuka. */}
      <KopHalaman
        judul="Tindak Lanjut Pengaduan"
        keterangan={
          <span className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono font-bold text-hutan">{p.kodeTiket}</span>
            <LencanaStatus status={p.status} />
            <span>masuk {tanggalPanjang(p.dibuatPada.toISOString())}</span>
          </span>
        }
      />

      {tersimpan && (
        <p
          role="status"
          className="mb-4 rounded-xl border border-emas-garis bg-emas-muda px-4 py-3 text-[13px] font-semibold text-emas-teks"
        >
          Tindak lanjut tersimpan — warga bisa melihatnya lewat kode tiket di halaman Lacak.
        </p>
      )}

      <div className="grid items-start gap-4 md:grid-cols-[1.5fr_1fr] lg:gap-6">
        <section className={`${kartu()} px-5 py-5 lg:px-7 lg:py-6`}>
          <h2 className="font-serif text-base font-semibold text-hutan lg:text-[19px]">Isi laporan</h2>
          <p className="mt-2 text-[14px] leading-relaxed whitespace-pre-line text-teks lg:text-[15px] lg:leading-[1.8]">{p.isi}</p>

          <dl className="mt-4 grid gap-2 border-t border-dashed border-garis pt-3.5">
            <div className="flex gap-3">
              <dt className="w-24 flex-none text-[12.5px] font-bold text-tinta">Kategori</dt>
              <dd className={baris}>{p.kategori}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 flex-none text-[12.5px] font-bold text-tinta">Lokasi</dt>
              <dd className={baris}>{p.lokasi ?? "—"}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 flex-none text-[12.5px] font-bold text-tinta">Lampiran</dt>
              <dd className={baris}>
                {p.lampiranUrl ? (
                  <a
                    href={`/api/admin/pengaduan/${p.id}/lampiran`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-daun underline-offset-2 transition-colors duration-200 ease-out hover:text-hutan hover:underline"
                  >
                    Buka foto
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </dl>
        </section>

        <section className={`${kartu()} px-5 py-5 lg:px-7 lg:py-6`}>
          <h2 className="font-serif text-base font-semibold text-hutan lg:text-[19px]">Pelapor</h2>
          {p.isAnonim ? (
            <p className="mt-2 flex items-start gap-2.5 rounded-[10px] border border-garis bg-krem px-3.5 py-3 text-[12.5px] leading-relaxed text-redup">
              <Ikon nama="gembok" ukuran={14} className="mt-0.5 flex-none" />
              Dikirim anonim — nama & kontak tidak pernah disimpan, jadi pelapor tidak bisa
              dihubungi. Tanggapan hanya terbaca lewat kode tiket.
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
        className={`${kartu()} mt-4 px-5 py-5 lg:mt-6 lg:px-7 lg:py-6`}
      >
        <input type="hidden" name="id" value={p.id} />
        <h2 className="font-serif text-base font-semibold text-hutan lg:text-[19px]">Tindak lanjut</h2>

        {galat && (
          <p
            role="alert"
            className="mt-3 rounded-xl border border-bata/40 bg-bata/10 px-4 py-3 text-[13px] font-semibold text-bata"
          >
            Tulis tanggapan dulu sebelum menandai laporan selesai.
          </p>
        )}

        <fieldset className="mt-3.5">
          <legend className={labelBorang}>Status</legend>
          <div className="flex flex-col gap-2">
            {pilihanStatus.map((s) => (
              <label
                key={s.nilai}
                className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-garis px-3.5 py-2.5 transition-colors duration-200 ease-out hover:border-daun has-checked:border-hutan has-checked:bg-krem"
              >
                <input
                  type="radio"
                  name="status"
                  value={s.nilai}
                  defaultChecked={p.status === s.nilai}
                  className="size-4 flex-none accent-hutan"
                />
                <span className="text-[13.5px] font-bold text-tinta">{s.nilai}</span>
                <span className="text-[12px] text-samar">{s.keterangan}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label htmlFor="tanggapan" className={`${labelBorang} mt-4`}>
          Tanggapan untuk pelapor
        </label>
        <textarea
          id="tanggapan"
          name="tanggapan"
          rows={4}
          defaultValue={p.tanggapan ?? ""}
          placeholder="Tulis apa yang sudah atau akan dilakukan perangkat dusun…"
          className={`${isianTebal} leading-relaxed`}
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="submit" className={tombol("primer", "besar")}>
            Simpan Tindak Lanjut
          </button>
          <span className="text-xs text-samar">
            Tanggapan langsung terlihat warga lewat kode tiket.
          </span>
        </div>
      </form>
    </Kerangka>
  );
}
