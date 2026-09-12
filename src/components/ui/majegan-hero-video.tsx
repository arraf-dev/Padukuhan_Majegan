"use client";

import { useEffect, useState } from "react";

type NetworkInformation = {
  effectiveType?: string;
  saveData?: boolean;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation;
};

/**
 * Video adalah pemanis, bukan konten utama. Ponsel memakai poster statis agar
 * halaman pertama tetap ringan; video hanya dimuat pada layar lebar dengan
 * koneksi yang tidak sedang dalam mode hemat data.
 */
export function MajeganHeroVideo({ src }: { src: string }) {
  const [bolehPutar, setBolehPutar] = useState(false);
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const koneksi = (navigator as NavigatorWithConnection).connection;

    const perbarui = () => {
      const jaringanLambat = koneksi?.saveData || koneksi?.effectiveType === "slow-2g" || koneksi?.effectiveType === "2g";
      setBolehPutar(media.matches && !jaringanLambat);
    };

    perbarui();
    media.addEventListener("change", perbarui);
    return () => media.removeEventListener("change", perbarui);
  }, []);

  if (!bolehPutar) return null;

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      onCanPlay={() => setSiap(true)}
      className={`absolute inset-0 z-0 h-full w-full object-cover object-center transition-opacity duration-700 ${siap ? "opacity-100" : "opacity-0"}`}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
