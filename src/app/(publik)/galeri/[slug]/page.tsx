import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GaleriGrid } from "@/components/galeri-grid";
import { LencanaKategoriGaleri } from "@/components/album-galeri";
import { Foto } from "@/components/potongan";
import { tombol } from "@/components/primitif";
import { getAlbumBySlug, getLatestAlbums } from "@/lib/galeri";
import { tanggalPanjang } from "@/lib/tanggal";

type Params = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const album = await getAlbumBySlug((await params).slug);
  if (!album) return {};

  return {
    title: album.judul,
    description: album.deskripsi,
    alternates: { canonical: `/galeri/${album.slug}` },
    openGraph: {
      type: "article",
      title: album.judul,
      description: album.deskripsi,
      images: album.coverUrl ? [{ url: album.coverUrl, alt: `Sampul album ${album.judul}` }] : undefined,
    },
  };
}

export default async function DetailGaleri({ params }: Params) {
  const album = await getAlbumBySlug((await params).slug);
  if (!album) notFound();

  const lainnya = (await getLatestAlbums(4)).filter((item) => item.slug !== album.slug).slice(0, 3);
  const urut = [...album.foto].sort((a, b) => a.urutan - b.urutan);

  return (
    <div className="wadah px-4 pt-5 pb-12 md:px-12 md:pt-8 md:pb-14 lg:px-16 lg:pt-10 lg:pb-20">
      <Link href="/galeri" className={`${tombol("teks")} text-[13px] lg:text-sm`}>
        <span aria-hidden="true">&#8592;</span>
        Kembali ke Galeri Majegan
      </Link>

      <article className="mx-auto mt-5 max-w-5xl md:mt-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <LencanaKategoriGaleri kategori={album.kategori} />
          <span className="text-xs text-samar">{album.foto.length} foto dokumentasi</span>
        </div>
        <h1 className="judul-halaman mt-3 max-w-4xl">{album.judul}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-dashed border-garis pb-4 text-[12.5px] text-samar lg:mt-4 lg:pb-5">
          <time dateTime={album.tanggalKegiatan} className="font-mono font-bold text-emas-tua">
            {tanggalPanjang(album.tanggalKegiatan)}
          </time>
          <span>Padukuhan Majegan</span>
        </div>

        <Foto
          src={album.coverUrl}
          keterangan={`Sampul album ${album.judul}`}
          prioritas
          sizes="(min-width: 1024px) 960px, 100vw"
          className="mt-5 aspect-[16/9] rounded-xl lg:mt-7 lg:rounded-2xl"
        />

        <p className="mt-5 max-w-3xl text-[15px] leading-[1.85] text-teks lg:mt-7 lg:text-[17px]">
          {album.deskripsi}
        </p>

        <section className="mt-8 lg:mt-10" aria-labelledby="judul-foto-album">
          <div className="mb-4 flex items-center gap-3">
            <h2 id="judul-foto-album" className="font-serif text-xl font-semibold text-hutan md:text-2xl">Foto Kegiatan</h2>
            <span className="h-px flex-1 bg-garis" />
          </div>
          <GaleriGrid judulAlbum={album.judul} foto={urut} />
        </section>
      </article>

      {lainnya.length > 0 && (
        <section className="mx-auto mt-12 max-w-5xl border-t border-garis pt-8 lg:mt-16 lg:pt-10">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="font-serif text-xl font-semibold text-hutan md:text-2xl">Album Lainnya</h2>
            <span className="h-px flex-1 bg-garis" />
            <Link href="/galeri" className={`${tombol("teks")} text-[12.5px]`}>Semua album</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {lainnya.map((item) => (
              <Link key={item.id} href={`/galeri/${item.slug}`} className="group min-w-0">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-garis bg-foto">
                  <Foto
                    src={item.coverUrl}
                    keterangan={`Sampul album ${item.judul}`}
                    sizes="(min-width: 768px) 30vw, 100vw"
                    className="size-full transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <h3 className="mt-2.5 font-serif text-base font-semibold text-tinta group-hover:text-daun">{item.judul}</h3>
                <p className="mt-1 text-xs text-samar">{item.jumlahFoto} foto</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
