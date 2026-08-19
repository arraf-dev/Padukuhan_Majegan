"use client";

import Image from "next/image";
import { useState } from "react";
import type { FotoGaleri } from "@/content/galeri";
import { GaleriLightbox } from "@/components/galeri-lightbox";

export function GaleriGrid({
  judulAlbum,
  foto,
}: {
  judulAlbum: string;
  foto: FotoGaleri[];
}) {
  const [terbuka, setTerbuka] = useState<number | null>(null);

  if (foto.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-garis-tebal bg-kertas/60 px-5 py-10 text-center text-sm text-redup">
        Belum ada foto pada album ini.
      </p>
    );
  }

  const tutup = () => {
    const indeks = terbuka;
    setTerbuka(null);
    if (indeks === null) return;

    requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(`[data-gallery-photo="${indeks}"]`)?.focus();
    });
  };

  const navigasi = (arah: -1 | 1) => {
    if (terbuka === null) return;
    setTerbuka((sekarang) => {
      if (sekarang === null) return null;
      return (sekarang + arah + foto.length) % foto.length;
    });
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:gap-4">
        {foto.map((gambar, indeks) => (
          <button
            key={gambar.id}
            type="button"
            data-gallery-photo={indeks}
            onClick={() => setTerbuka(indeks)}
            aria-label={`Buka foto ${indeks + 1} dari ${foto.length}: ${gambar.alt}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-garis bg-foto text-left transition duration-300 ease-out hover:-translate-y-0.5 hover:border-daun hover:shadow-[0_12px_28px_rgba(13,56,37,.13)] focus-visible:-translate-y-0.5 focus-visible:border-daun lg:rounded-2xl"
          >
            <Image
              src={gambar.url}
              alt={gambar.alt}
              fill
              sizes="(min-width: 1024px) 31vw, (min-width: 768px) 30vw, 50vw"
              loading={indeks === 0 ? "eager" : "lazy"}
              className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-hutan/82 via-hutan/25 to-transparent px-3 pt-8 pb-3 text-[11px] leading-snug text-krem opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:opacity-100">
              {gambar.caption || gambar.alt}
            </span>
          </button>
        ))}
      </div>

      {terbuka !== null && (
        <GaleriLightbox
          judulAlbum={judulAlbum}
          foto={foto}
          indeks={terbuka}
          onClose={tutup}
          onNavigasi={navigasi}
        />
      )}
    </>
  );
}
