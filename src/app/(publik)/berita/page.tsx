import type { Metadata } from "next";
import Link from "next/link";
import { berita, kategoriBerita, pengumuman } from "@/content/majegan";
import { Atap } from "@/components/ikon";
import { KartuAlbum } from "@/components/potongan";
import { tanggalPendekTahun } from "@/lib/tanggal";

export const metadata: Metadata = { title: "Kabar Majegan" };

const PER_HALAMAN = 6;

export default async function Berita({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; hal?: string }>;
}) {
  const { kategori, hal } = await searchParams;

  const terpilih = kategoriBerita.find((k) => k === kategori);
  const tersaring = terpilih ? berita.filter((b) => b.kategori === terpilih) : berita;

  const jumlahHalaman = Math.max(1, Math.ceil(tersaring.length / PER_HALAMAN));
  const halaman = Math.min(Math.max(Number(hal) || 1, 1), jumlahHalaman);
  const tampil = tersaring.slice((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN);

  const tautan = (k?: string) => (k ? `/berita?kategori=${encodeURIComponent(k)}` : "/berita");

  return (
    <div className="px-4 pt-6 pb-10 md:px-12 md:pt-9 md:pb-11">
      <div className="flex flex-wrap items-baseline gap-4">
        <h1 className="font-serif text-2xl font-semibold text-hutan md:text-[32px]">
          Kabar Majegan
        </h1>
        <p className="text-sm text-redup">Berita &amp; pengumuman resmi padukuhan</p>
      </div>

      <div className="my-4.5 flex flex-wrap gap-2 md:mt-4.5 md:mb-6.5">
        {[undefined, ...kategoriBerita].map((k) => {
          const ini = k === terpilih;
          return (
            <Link
              key={k ?? "semua"}
              href={tautan(k)}
              aria-current={ini ? "true" : undefined}
              className={`rounded-full px-4 py-2 text-[13px] ${
                ini
                  ? "bg-hutan font-bold text-krem"
                  : "border border-garis-tebal font-semibold text-teks hover:border-daun hover:text-hutan"
              }`}
            >
              {k ?? "Semua"}
            </Link>
          );
        })}
      </div>

      <div className="grid items-start gap-6.5 md:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          {tampil.length === 0 ? (
            <p className="rounded-xl border border-dashed border-garis-tebal bg-panel px-5 py-8 text-center text-sm text-redup">
              Belum ada berita pada kategori ini.
            </p>
          ) : (
            <div className="grid gap-4.5 md:grid-cols-2">
              {tampil.map((b) => (
                <KartuAlbum key={b.slug} b={b} />
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-4 rounded-xl bg-hutan px-5.5 py-4 text-krem">
            <span className="font-serif text-[15px] font-semibold">Butuh layanan?</span>
            <Link
              href="/layanan"
              className="rounded-lg border border-krem/40 px-4 py-2 text-[13px] font-semibold hover:border-emas hover:text-emas"
            >
              Layanan Surat
            </Link>
            <Link
              href="/pengaduan"
              className="rounded-lg bg-emas px-4 py-2.5 text-[13px] font-bold text-hutan hover:shadow-[0_4px_12px_rgba(138,109,43,.4)]"
            >
              Kirim Pengaduan
            </Link>
            <span className="flex-1" />
            <span className="text-xs text-krem/60 max-md:hidden">
              dikelola perangkat dusun &amp; karang taruna
            </span>
          </div>

          {jumlahHalaman > 1 && (
            <nav aria-label="Halaman berita" className="mt-6 flex justify-center gap-[7px]">
              {Array.from({ length: jumlahHalaman }, (_, i) => i + 1).map((n) => {
                const ini = n === halaman;
                const href = terpilih
                  ? `/berita?kategori=${encodeURIComponent(terpilih)}&hal=${n}`
                  : `/berita?hal=${n}`;
                return (
                  <Link
                    key={n}
                    href={href}
                    aria-current={ini ? "page" : undefined}
                    className={`flex size-9 items-center justify-center rounded-[9px] text-[13px] ${
                      ini
                        ? "bg-hutan font-bold text-krem"
                        : "border border-garis-tebal text-teks hover:border-daun hover:text-hutan"
                    }`}
                  >
                    {n}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <aside
          data-reveal
          className="rounded-2xl border border-garis bg-kertas px-6 py-5.5 max-md:mt-6"
        >
          <div className="mb-1.5 flex items-center gap-2.5">
            <Atap ukuran={22} className="flex-none" />
            <h2 className="font-serif text-lg font-semibold text-hutan">Pengumuman</h2>
          </div>
          <ul className="flex flex-col">
            {pengumuman.map((p, i) => (
              <li
                key={p.tanggal}
                className={`py-3.5 ${i < pengumuman.length - 1 ? "border-b border-dashed border-garis" : ""}`}
              >
                <div className="font-mono text-[11px] font-semibold text-emas-tua">
                  {tanggalPendekTahun(p.tanggal)}
                </div>
                <div className="mt-1 text-[13.5px] leading-snug text-tinta">{p.teks}</div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
