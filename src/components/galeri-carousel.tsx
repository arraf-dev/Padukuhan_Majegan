"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { AlbumGaleriRingkas } from "@/lib/galeri";
import { LencanaKategoriGaleri } from "@/components/album-galeri";
import { tanggalPendekTahun } from "@/lib/tanggal";

export function GaleriCarousel({ albums }: { albums: AlbumGaleriRingkas[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [bisaKiri, setBisaKiri] = useState(false);
  const [bisaKanan, setBisaKanan] = useState(albums.length > 1);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const perbaruiTombol = () => {
      setBisaKiri(rail.scrollLeft > 4);
      setBisaKanan(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 4);
    };

    perbaruiTombol();
    rail.addEventListener("scroll", perbaruiTombol, { passive: true });
    window.addEventListener("resize", perbaruiTombol);
    return () => {
      rail.removeEventListener("scroll", perbaruiTombol);
      window.removeEventListener("resize", perbaruiTombol);
    };
  }, [albums.length]);

  if (albums.length === 0) return null;

  const geser = (arah: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: arah * Math.max(280, rail.clientWidth * 0.84), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={railRef}
        id="galeri-carousel"
        className="flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
        tabIndex={0}
        aria-label="Album terbaru"
      >
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/galeri/${album.slug}`}
            className="group min-w-[82%] snap-start overflow-hidden rounded-xl border border-garis bg-kertas lg:min-w-[31.5%] lg:rounded-2xl"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-foto">
              {album.coverUrl ? (
                <Image
                  src={album.coverUrl}
                  alt={`Sampul album ${album.judul}`}
                  fill
                  sizes="(min-width: 1024px) 31vw, 82vw"
                  priority
                  loading="eager"
                  className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <div className="foto size-full" aria-hidden="true" />
              )}
              <span className="absolute top-3 left-3">
                <LencanaKategoriGaleri kategori={album.kategori} />
              </span>
            </div>
            <div className="px-4 py-3.5">
              <p className="font-mono text-[10px] font-bold tracking-[.06em] text-emas-tua">
                {tanggalPendekTahun(album.tanggalKegiatan)}
              </p>
              <h3 className="mt-1.5 line-clamp-2 font-serif text-[17px] leading-snug font-semibold text-tinta">
                {album.judul}
              </h3>
              <p className="mt-1 text-[11.5px] text-samar">{album.jumlahFoto} foto dokumentasi</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => geser(-1)}
          disabled={!bisaKiri}
          aria-label="Geser album terbaru ke kiri"
          aria-controls="galeri-carousel"
          className="flex size-11 items-center justify-center rounded-full border border-garis-tebal bg-kertas text-lg text-hutan transition-colors hover:border-daun hover:bg-emas-lembut disabled:cursor-not-allowed disabled:opacity-35"
        >
          <span aria-hidden="true">&#8592;</span>
        </button>
        <button
          type="button"
          onClick={() => geser(1)}
          disabled={!bisaKanan}
          aria-label="Geser album terbaru ke kanan"
          aria-controls="galeri-carousel"
          className="flex size-11 items-center justify-center rounded-full border border-garis-tebal bg-kertas text-lg text-hutan transition-colors hover:border-daun hover:bg-emas-lembut disabled:cursor-not-allowed disabled:opacity-35"
        >
          <span aria-hidden="true">&#8594;</span>
        </button>
      </div>
    </div>
  );
}
