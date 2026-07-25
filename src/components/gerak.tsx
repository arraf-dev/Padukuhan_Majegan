"use client";

import { useEffect, useRef, useState } from "react";

const diamkanGerak = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Dipasang sekali di root layout: apa pun yang bertanda `data-reveal` akan
 * muncul lembut saat masuk viewport. Tidak perlu membungkus tiap elemen.
 *
 * Elemen yang muncul belakangan (pindah halaman, ganti filter) ikut terpantau
 * lewat MutationObserver — tanpa itu isinya akan menetap tak terlihat.
 */
export function Reveal() {
  useEffect(() => {
    const langsung = diamkanGerak();

    const penglihat = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("siap");
          penglihat.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    const pasang = (akar: Element | Document) => {
      const semua = [
        ...(akar instanceof Element && akar.matches("[data-reveal]:not(.siap)") ? [akar] : []),
        ...akar.querySelectorAll("[data-reveal]:not(.siap)"),
      ];
      for (const el of semua) {
        if (langsung) el.classList.add("siap");
        else penglihat.observe(el);
      }
    };

    pasang(document);

    const perubahan = new MutationObserver((mutasi) => {
      for (const m of mutasi) {
        for (const n of m.addedNodes) {
          if (n instanceof Element) pasang(n);
        }
      }
    });
    perubahan.observe(document.body, { childList: true, subtree: true });

    return () => {
      penglihat.disconnect();
      perubahan.disconnect();
    };
  }, []);

  return null;
}

/** Angka statistik yang menghitung naik saat terlihat. */
export function Hitung({ ke, className }: { ke: number; className?: string }) {
  const [nilai, setNilai] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (diamkanGerak()) {
      setNilai(ke);
      return;
    }

    let rangka = 0;
    const pengamat = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        pengamat.disconnect();
        const mulai = performance.now();
        const durasi = 900;
        const langkah = (kini: number) => {
          const t = Math.min((kini - mulai) / durasi, 1);
          // ease-out: cepat di awal, melambat di akhir
          setNilai(Math.round(ke * (1 - Math.pow(1 - t, 3))));
          if (t < 1) rangka = requestAnimationFrame(langkah);
        };
        rangka = requestAnimationFrame(langkah);
      },
      { threshold: 0.4 },
    );
    pengamat.observe(el);
    return () => {
      pengamat.disconnect();
      cancelAnimationFrame(rangka);
    };
  }, [ke]);

  return (
    <span ref={ref} className={className}>
      {nilai.toLocaleString("id-ID")}
    </span>
  );
}
