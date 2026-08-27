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
 * lewat MutationObserver. Web Animations API dipakai tanpa menambah class ke
 * elemen, supaya HTML streaming tidak berubah sebelum React selesai hydration.
 */
export function Reveal() {
  useEffect(() => {
    if (diamkanGerak()) return;

    const animasi = new WeakMap<Element, Animation>();

    const penglihat = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          animasi.get(e.target)?.play();
          penglihat.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    const pasang = (akar: Element | Document) => {
      const semua = [
        ...(akar instanceof Element && akar.matches("[data-reveal]") ? [akar] : []),
        ...akar.querySelectorAll("[data-reveal]"),
      ];
      for (const el of semua) {
        if (animasi.has(el)) continue;

        const jeda = Number((el as HTMLElement).dataset.jeda ?? 0) * 80;
        const gerak = el.animate(
          [
            { opacity: 0, transform: "translateY(14px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 500, delay: jeda, easing: "ease", fill: "both" },
        );
        gerak.pause();
        gerak.currentTime = 0;
        animasi.set(el, gerak);
        penglihat.observe(el);
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

    let rangka = 0;
    if (diamkanGerak()) {
      // Sekali rAF supaya setState tidak jalan sinkron di dalam effect
      // (aturan react-hooks/set-state-in-effect), tetapi tetap segera.
      rangka = requestAnimationFrame(() => setNilai(ke));
      return;
    }

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
