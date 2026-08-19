"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { FotoGaleri } from "@/content/galeri";

export function GaleriLightbox({
  judulAlbum,
  foto,
  indeks,
  onClose,
  onNavigasi,
}: {
  judulAlbum: string;
  foto: FotoGaleri[];
  indeks: number;
  onClose: () => void;
  onNavigasi: (arah: -1 | 1) => void;
}) {
  const tutupRef = useRef<HTMLButtonElement>(null);
  const aktif = foto[indeks];

  useEffect(() => {
    tutupRef.current?.focus();

    const tekan = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onNavigasi(-1);
      if (event.key === "ArrowRight") onNavigasi(1);
    };

    const overflowSebelumnya = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", tekan);

    return () => {
      document.body.style.overflow = overflowSebelumnya;
      document.removeEventListener("keydown", tekan);
    };
  }, [onClose, onNavigasi]);

  if (!aktif) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-hutan/96 p-3 text-krem backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Galeri foto ${judulAlbum}`}
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-6xl flex-col gap-3 sm:gap-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="min-w-0">
            <p className="truncate font-serif text-base font-semibold text-krem sm:text-lg">{judulAlbum}</p>
            <p className="mt-0.5 text-xs text-krem/65">Foto {indeks + 1} dari {foto.length}</p>
          </div>
          <button
            ref={tutupRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup galeri foto"
            className="flex size-11 flex-none items-center justify-center rounded-full border border-krem/25 text-2xl leading-none text-krem transition-colors hover:border-emas hover:text-emas"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => onNavigasi(-1)}
            aria-label="Foto sebelumnya"
            className="flex size-11 items-center justify-center rounded-full border border-krem/25 text-2xl text-krem transition-colors hover:border-emas hover:text-emas sm:size-14"
          >
            <span aria-hidden="true">&#8592;</span>
          </button>

          <figure className="min-w-0">
            <div className="relative h-[min(64vh,34rem)] min-h-[240px] w-full overflow-hidden rounded-xl bg-black/25 sm:h-[70vh] sm:rounded-2xl">
              <Image
                src={aktif.url}
                alt={aktif.alt}
                fill
                sizes="(min-width: 1024px) 75vw, 90vw"
                className="object-contain"
                priority
              />
            </div>
            {aktif.caption && (
              <figcaption className="mt-3 text-center text-[12.5px] leading-relaxed text-krem/78 sm:text-sm">
                {aktif.caption}
              </figcaption>
            )}
          </figure>

          <button
            type="button"
            onClick={() => onNavigasi(1)}
            aria-label="Foto berikutnya"
            className="flex size-11 items-center justify-center rounded-full border border-krem/25 text-2xl text-krem transition-colors hover:border-emas hover:text-emas sm:size-14"
          >
            <span aria-hidden="true">&#8594;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
