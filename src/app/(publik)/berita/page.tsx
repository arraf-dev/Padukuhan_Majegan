import type { Metadata } from "next";
import Link from "next/link";
import { kategoriBerita, pengumuman } from "@/content/majegan";
import { Atap } from "@/components/ikon";
import { KartuAlbum } from "@/components/potongan";
import { kartu, kartuPutus, tombol } from "@/components/primitif";
import { beritaTerbit } from "@/lib/berita";
import { tanggalPendekTahun } from "@/lib/tanggal";

export const metadata: Metadata = {
  title: "Kabar Majegan",
  description:
    "Berita dan pengumuman resmi Padukuhan Majegan: kegiatan warga, pembangunan, dan informasi layanan di Kalurahan Pandowoharjo, Kapanewon Sleman.",
  alternates: { canonical: "/berita" },
};

const PER_HALAMAN = 6;

export default async function Berita({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; hal?: string }>;
}) {
  const { kategori, hal } = await searchParams;
  const berita = await beritaTerbit();

  const terpilih = kategoriBerita.find((k) => k === kategori);
  const tersaring = terpilih ? berita.filter((b) => b.kategori === terpilih) : berita;

  const jumlahHalaman = Math.max(1, Math.ceil(tersaring.length / PER_HALAMAN));
  const halaman = Math.min(Math.max(Number(hal) || 1, 1), jumlahHalaman);
  const tampil = tersaring.slice((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN);

  const tautan = (k?: string) => (k ? `/berita?kategori=${encodeURIComponent(k)}` : "/berita");

  return (
    <div className="wadah px-4 pt-6 pb-10 md:px-12 md:pt-10 md:pb-12 lg:px-16 lg:pt-12 lg:pb-16">
      <div className="flex flex-wrap items-baseline gap-4">
        <h1 className="judul-halaman">Kabar Majegan</h1>
        <p className="text-sm text-redup lg:text-[15px]">Berita &amp; pengumuman resmi padukuhan</p>
      </div>

      <div className="my-4.5 flex flex-wrap gap-2 md:mt-5 md:mb-6 lg:mt-7 lg:mb-8">
        {[undefined, ...kategoriBerita].map((k) => {
          const ini = k === terpilih;
          return (
            <Link
              key={k ?? "semua"}
              href={tautan(k)}
              aria-current={ini ? "true" : undefined}
              // min-h-11 hanya di mobile: target sentuh 44px untuk jempol,
              // desktop tetap ramping karena diklik pakai tetikus.
              className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-[13px] transition-colors duration-200 ease-out md:min-h-0 ${
                ini
                  ? "bg-hutan font-bold text-krem"
                  : "border border-garis-tebal font-semibold text-teks hover:border-daun hover:bg-emas-lembut hover:text-hutan"
              }`}
            >
              {k ?? "Semua"}
            </Link>
          );
        })}
      </div>

      <div className="grid items-start gap-6 md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_340px] lg:gap-10 xl:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          {tampil.length === 0 ? (
            <p className={kartuPutus}>Belum ada berita pada kategori ini.</p>
          ) : (
            // 3 kolom baru di xl: pada 1280px ke atas, 2 kolom menyisakan
            // kartu selebar ~430px — terlalu gemuk untuk kartu album.
            <div className="grid gap-4.5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
              {tampil.map((b) => (
                <KartuAlbum key={b.slug} b={b} />
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-4 rounded-xl bg-hutan px-6 py-4 text-krem lg:mt-7 lg:rounded-2xl lg:px-8 lg:py-5">
            <span className="font-serif text-[15px] font-semibold">Butuh layanan?</span>
            {/* Di atas latar hutan, ragam `sekunder` tidak terbaca — outline terang dipakai. */}
            <Link
              href="/layanan"
              className="inline-flex items-center rounded-[10px] border border-krem/40 px-4 py-2 text-[13px] font-semibold transition-colors duration-200 ease-out hover:border-emas hover:text-emas"
            >
              Layanan Surat
            </Link>
            <Link href="/pengaduan" className={tombol("primer", "kecil")}>
              Kirim Pengaduan
            </Link>
            <span className="flex-1" />
            <span className="text-xs text-krem/70 max-md:hidden">
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
                    className={`flex size-11 items-center justify-center rounded-[10px] text-[13px] transition-colors duration-200 ease-out md:size-9 ${
                      ini
                        ? "bg-hutan font-bold text-krem"
                        : "border border-garis-tebal text-teks hover:border-daun hover:bg-emas-lembut hover:text-hutan"
                    }`}
                  >
                    {n}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Sticky di desktop: daftar berita jauh lebih panjang dari pengumuman,
            tanpa ini rail ikut tergulir habis dan menyisakan kolom kosong.
            top-24 = di bawah bilah nav yang kini menempel. */}
        <aside
          data-reveal
          className={`${kartu()} px-6 py-6 max-md:mt-6 md:sticky md:top-24 lg:px-7 lg:py-7`}
        >
          <div className="mb-1.5 flex items-center gap-2.5">
            <Atap ukuran={22} className="flex-none" />
            <h2 className="font-serif text-lg font-semibold text-hutan lg:text-xl">Pengumuman</h2>
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
