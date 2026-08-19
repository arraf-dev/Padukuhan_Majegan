import Image from "next/image";
import Link from "next/link";
import type { AlbumGaleriRingkas } from "@/lib/galeri";
import { LencanaKategoriGaleri } from "@/components/album-galeri";

const posisi = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-2",
  "md:col-span-1",
  "md:col-span-1",
];

export function GaleriBento({ albums }: { albums: AlbumGaleriRingkas[] }) {
  return (
    <div className="grid auto-rows-[150px] grid-cols-2 gap-2.5 sm:gap-3 md:auto-rows-[170px] md:grid-cols-4 lg:gap-4">
      {albums.slice(0, 4).map((album, indeks) => (
        <Link
          key={album.id}
          href={`/galeri/${album.slug}`}
          data-reveal
          className={`group relative min-w-0 overflow-hidden rounded-xl border border-garis bg-foto lg:rounded-2xl ${posisi[indeks] ?? ""}`}
        >
          {album.coverUrl ? (
            <Image
              src={album.coverUrl}
              alt={`Sampul album ${album.judul}`}
              fill
              sizes={indeks === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
              priority={indeks === 0}
              loading={indeks === 0 ? "eager" : "lazy"}
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
            />
          ) : (
            <div className="foto size-full" aria-hidden="true" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-hutan/90 via-hutan/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4.5">
            <LencanaKategoriGaleri kategori={album.kategori} className="text-[9px]" />
            <h3 className="mt-1.5 line-clamp-2 font-serif text-[15px] leading-snug font-semibold text-krem sm:text-lg">
              {album.judul}
            </h3>
            <p className="mt-1 text-[10.5px] text-krem/70 sm:text-xs">{album.jumlahFoto} foto</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
