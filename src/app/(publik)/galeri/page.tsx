import type { Metadata } from "next";
import Link from "next/link";
import { kategoriGaleri, type KategoriGaleri } from "@/content/galeri";
import { AlbumGaleriCard } from "@/components/album-galeri";
import { GaleriCarousel } from "@/components/galeri-carousel";
import { JudulSection } from "@/components/potongan";
import { kartuPutus, tombol } from "@/components/primitif";
import { getGalleryYears, getLatestAlbums, getPublishedAlbums } from "@/lib/galeri";

export const metadata: Metadata = {
  title: "Galeri Majegan",
  description: "Dokumentasi kegiatan dan kebersamaan warga Padukuhan Majegan.",
  alternates: { canonical: "/galeri" },
};

export const dynamic = "force-dynamic";

const PER_HALAMAN = 9;

const query = (nilai: { kategori?: string; tahun?: number; hal?: number }) => {
  const params = new URLSearchParams();
  if (nilai.kategori) params.set("kategori", nilai.kategori);
  if (nilai.tahun) params.set("tahun", String(nilai.tahun));
  if (nilai.hal && nilai.hal > 1) params.set("hal", String(nilai.hal));
  const hasil = params.toString();
  return hasil ? `/galeri?${hasil}` : "/galeri";
};

const kategoriDariParam = (nilai?: string): KategoriGaleri | undefined =>
  kategoriGaleri.find((kategori) => kategori === nilai);

export default async function Galeri({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; tahun?: string; hal?: string }>;
}) {
  const params = await searchParams;
  const kategori = kategoriDariParam(params.kategori);
  const angkaTahun = Number(params.tahun);
  const tahun = Number.isInteger(angkaTahun) && angkaTahun >= 2000 && angkaTahun <= 2100 ? angkaTahun : undefined;
  const angkaHalaman = Number(params.hal);
  const halaman = Number.isInteger(angkaHalaman) && angkaHalaman > 0 ? angkaHalaman : 1;

  const [{ albums, halaman: halamanAktif, jumlahHalaman }, terbaru, tahunTersedia] = await Promise.all([
    getPublishedAlbums({ kategori, tahun, halaman, perHalaman: PER_HALAMAN }),
    getLatestAlbums(4),
    getGalleryYears(),
  ]);
  const sedangMemfilter = Boolean(kategori || tahun);

  return (
    <div className="wadah px-4 pt-6 pb-12 md:px-12 md:pt-10 md:pb-14 lg:px-16 lg:pt-12 lg:pb-20">
      <header className="max-w-2xl">
        <p className="font-mono text-[11px] font-bold tracking-[.16em] text-emas-tua">CERITA VISUAL WARGA</p>
        <h1 className="judul-halaman mt-2">Galeri Majegan</h1>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-teks md:text-[15px]">
          Dokumentasi kegiatan dan kebersamaan warga Padukuhan Majegan, dari kerja bakti hingga tradisi yang terus dirawat.
        </p>
      </header>

      {terbaru.length > 0 && (
        <section className="mt-9 md:mt-12">
          <JudulSection anak="Album Terbaru" tautan={sedangMemfilter ? { href: "/galeri", label: "lihat semua" } : undefined} />
          <GaleriCarousel albums={terbaru} />
        </section>
      )}

      <section className="mt-10 md:mt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <JudulSection anak="Semua Dokumentasi" />
            <p className="-mt-2 text-xs text-samar md:text-[13px]">
              {albums.length > 0 ? `${albums.length} album pada tampilan ini` : "Belum ada album pada filter ini"}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-garis bg-panel/55 p-3 md:mt-6 md:flex-row md:items-center md:justify-between md:rounded-2xl md:p-3.5">
          <nav aria-label="Filter kategori galeri" className="flex min-w-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link
              href={query({ tahun })}
              aria-current={!kategori ? "true" : undefined}
              className={`min-h-11 shrink-0 rounded-full px-4 py-2.5 text-[12.5px] font-bold ${!kategori ? "bg-hutan text-krem" : "border border-garis-tebal bg-kertas text-teks hover:border-daun"}`}
            >
              Semua
            </Link>
            {kategoriGaleri.map((item) => (
              <Link
                key={item}
                href={query({ kategori: item, tahun })}
                aria-current={kategori === item ? "true" : undefined}
                className={`min-h-11 shrink-0 rounded-full px-4 py-2.5 text-[12.5px] font-bold ${kategori === item ? "bg-hutan text-krem" : "border border-garis-tebal bg-kertas text-teks hover:border-daun"}`}
              >
                {item}
              </Link>
            ))}
          </nav>

          <form method="get" className="flex shrink-0 items-center gap-2">
            {kategori && <input type="hidden" name="kategori" value={kategori} />}
            <label htmlFor="tahun" className="sr-only">Filter tahun</label>
            <select id="tahun" name="tahun" defaultValue={tahun ?? ""} className="min-h-11 rounded-[10px] border border-garis-tebal bg-kertas px-3 text-[12.5px] font-semibold text-teks">
              <option value="">Semua tahun</option>
              {tahunTersedia.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <button type="submit" className={`${tombol("sekunder", "kecil")} min-h-11`}>Terapkan</button>
          </form>
        </div>

        {albums.length === 0 ? (
          <div className={`${kartuPutus} mt-5 md:mt-6`}>
            <p className="font-serif text-lg font-semibold text-hutan">Belum ada dokumentasi</p>
            <p className="mt-1.5 text-[13px]">Dokumentasi kegiatan Padukuhan Majegan akan ditampilkan di sini.</p>
            {sedangMemfilter && (
              <Link href="/galeri" className={`${tombol("teks")} mt-4 text-[13px]`}>Hapus filter</Link>
            )}
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3 xl:gap-6">
            {albums.map((album, indeks) => <AlbumGaleriCard key={album.id} album={album} prioritas={indeks === 0} />)}
          </div>
        )}

        {jumlahHalaman > 1 && (
          <nav aria-label="Halaman galeri" className="mt-7 flex justify-center gap-2">
            {Array.from({ length: jumlahHalaman }, (_, indeks) => indeks + 1).map((nomor) => (
              <Link
                key={nomor}
                href={query({ kategori, tahun, hal: nomor })}
                aria-current={nomor === halamanAktif ? "page" : undefined}
                className={`flex size-11 items-center justify-center rounded-[10px] text-[13px] md:size-9 ${nomor === halamanAktif ? "bg-hutan font-bold text-krem" : "border border-garis-tebal bg-kertas text-teks hover:border-daun"}`}
              >
                {nomor}
              </Link>
            ))}
          </nav>
        )}
      </section>
    </div>
  );
}
