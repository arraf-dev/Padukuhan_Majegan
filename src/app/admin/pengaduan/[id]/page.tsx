import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Ikon } from "@/components/ikon";
import { LencanaBaca } from "@/components/potongan";
import { KopHalaman, kartu, tombol } from "@/components/primitif";
import { db } from "@/lib/db";
import { wajibMasuk } from "@/lib/sesi";
import { tanggalPanjang, tanggalWaktuPendek } from "@/lib/tanggal";
import { Kerangka } from "@/app/admin/kerangka";
import { tandaiDibaca } from "@/app/admin/pengaduan/aksi";

export const metadata: Metadata = { title: "Detail Pengaduan" };
export const dynamic = "force-dynamic";

export default async function DetailPengaduan({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tersimpan?: string }>;
}) {
  const [{ nama, peran }, { id }, q] = await Promise.all([wajibMasuk(), params, searchParams]);

  // Query utama sengaja tidak mengambil identitas. Dengan demikian role Admin
  // tidak pernah menerima nama/kontak di payload Server Component.
  const [p, identitas] = await Promise.all([
    db.pengaduan.findUnique({
      where: { id },
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
    peran === "superadmin"
      ? db.pengaduan.findUnique({ where: { id }, select: { namaPelapor: true, kontak: true } })
      : Promise.resolve(null),
  ]);

  if (!p) notFound();
  const dibaca = p.dibacaPada !== null;

  return (
    <Kerangka peran={peran} nama={nama}>
      <Link href="/admin/pengaduan" className={`${tombol("teks")} mb-3 text-[13px]`}>
        <Ikon nama="kembali" ukuran={15} /> Kembali ke daftar pengaduan
      </Link>

      <KopHalaman
        judul="Detail Pengaduan"
        keterangan={`${p.kategori} · masuk ${tanggalWaktuPendek(p.dibuatPada.toISOString())}`}
        aksi={
          dibaca ? (
            <div className="flex flex-col items-end gap-1.5">
              <LencanaBaca dibaca />
              <span className="text-[10.5px] text-samar">
                {tanggalWaktuPendek(p.dibacaPada!.toISOString())}
              </span>
            </div>
          ) : (
            <form action={tandaiDibaca}>
              <input type="hidden" name="id" value={p.id} />
              <button type="submit" className={`${tombol("primer")} min-h-11`}>
                Tandai Sudah Dibaca
              </button>
            </form>
          )
        }
      />

      {q.tersimpan === "dibaca" && (
        <p role="status" className="mb-4 rounded-xl border border-daun/25 bg-daun-muda px-4 py-3 text-[13px] font-semibold text-daun">
          Pengaduan sudah ditandai dibaca.
        </p>
      )}

      <div className="grid items-start gap-4 lg:grid-cols-[1.55fr_1fr] lg:gap-6">
        <section className={`${kartu()} overflow-hidden`}>
          <div className={`h-1.5 ${dibaca ? "bg-daun" : "bg-emas"}`} />
          <div className="px-5 py-5 lg:px-7 lg:py-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <LencanaBaca dibaca={dibaca} />
              <span className="rounded-full border border-garis bg-panel px-3 py-1.5 text-[10.5px] font-bold text-tinta">
                {p.kategori}
              </span>
            </div>
            <h2 className="mt-5 font-serif text-base font-semibold text-hutan lg:text-[19px]">Isi laporan</h2>
            <p className="mt-2 text-[14px] leading-[1.8] whitespace-pre-line text-teks lg:text-[15px]">
              {p.isi}
            </p>

            <dl className="mt-5 grid gap-3 border-t border-dashed border-garis pt-4 text-[13.5px]">
              <div className="grid grid-cols-[90px_1fr] gap-3">
                <dt className="font-bold text-tinta">Lokasi</dt>
                <dd className="text-teks">{p.lokasi ?? "Tidak dicantumkan"}</dd>
              </div>
              <div className="grid grid-cols-[90px_1fr] gap-3">
                <dt className="font-bold text-tinta">Dikirim</dt>
                <dd className="text-teks">{tanggalPanjang(p.dibuatPada.toISOString())}</dd>
              </div>
              <div className="grid grid-cols-[90px_1fr] gap-3">
                <dt className="font-bold text-tinta">Lampiran</dt>
                <dd>
                  {p.lampiranUrl ? (
                    <a
                      href={`/api/admin/pengaduan/${p.id}/lampiran`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-10 items-center gap-2 font-semibold text-daun underline-offset-2 hover:text-hutan hover:underline"
                    >
                      <Ikon nama="foto" ukuran={15} /> Buka lampiran foto
                    </a>
                  ) : (
                    <span className="text-samar">Tidak ada lampiran</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className={`${kartu()} px-5 py-5 lg:px-7 lg:py-6`}>
          <div className="flex items-center gap-2.5">
            <Ikon nama={peran === "superadmin" ? "warga" : "gembok"} ukuran={17} className="text-daun" />
            <h2 className="font-serif text-base font-semibold text-hutan lg:text-[19px]">Pelapor</h2>
          </div>

          {identitas ? (
            <dl className="mt-4 grid gap-3">
              <div className="rounded-[10px] bg-panel px-4 py-3">
                <dt className="text-[10.5px] font-bold tracking-[.08em] text-samar">NAMA LENGKAP</dt>
                <dd className="mt-1 text-[13.5px] font-semibold text-tinta">{identitas.namaPelapor}</dd>
              </div>
              <div className="rounded-[10px] bg-panel px-4 py-3">
                <dt className="text-[10.5px] font-bold tracking-[.08em] text-samar">NOMOR HP/WHATSAPP</dt>
                <dd className="mt-1 font-mono text-[13.5px] font-semibold text-tinta">{identitas.kontak}</dd>
              </div>
            </dl>
          ) : (
            <div className="mt-4 rounded-[10px] border border-emas-garis bg-emas-muda px-4 py-3.5">
              <p className="text-[12.5px] leading-relaxed text-emas-teks">
                Identitas pelapor hanya dapat dilihat oleh SuperAdmin. Anda tetap dapat membaca isi laporan dan membuka lampirannya.
              </p>
            </div>
          )}

          <p className="mt-4 text-[11.5px] leading-relaxed text-samar">
            Data pelapor bersifat privat dan hanya digunakan untuk keperluan penanganan pengaduan.
          </p>
        </section>
      </div>
    </Kerangka>
  );
}
