"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type HeroCta = {
  label: string;
  href: string;
};

export interface MajeganVideoHeroProps {
  videoSrc?: string;
  mobileVideoSrc?: string;
  posterSrc?: string;
  eyebrow?: string;
  title?: string;
  location?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
}

const nilaiAwal = {
  videoSrc: "/videos/majegan-hero.mp4",
  posterSrc: "/gambar/majegan-hero-poster.webp",
  eyebrow: "Padukuhan",
  title: "Majegan",
  location: "Kampung budaya di Sleman: joglo, merti dusun, dan kerja bakti",
  primaryCta: { label: "Jelajahi", href: "#tentang-majegan" },
  secondaryCta: { label: "Tentang", href: "/profil" },
} satisfies Required<Omit<MajeganVideoHeroProps, "mobileVideoSrc">>;

export function MajeganVideoHero({
  videoSrc = nilaiAwal.videoSrc,
  mobileVideoSrc,
  posterSrc = nilaiAwal.posterSrc,
  eyebrow = nilaiAwal.eyebrow,
  title = nilaiAwal.title,
  location = nilaiAwal.location,
  primaryCta = nilaiAwal.primaryCta,
  secondaryCta = nilaiAwal.secondaryCta,
}: MajeganVideoHeroProps) {
  const [videoSiap, setVideoSiap] = useState(false);
  const [videoGagal, setVideoGagal] = useState(false);
  const [sudahTerpasang, setSudahTerpasang] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const preferensiKurangiGerak = useReducedMotion();
  const kurangiGerak = sudahTerpasang && preferensiKurangiGerak === true;

  useEffect(() => {
    // Sekali rAF: menandai hydrasi selesai tanpa setState sinkron di effect
    // (aturan react-hooks/set-state-in-effect).
    const rangka = requestAnimationFrame(() => setSudahTerpasang(true));
    return () => cancelAnimationFrame(rangka);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (kurangiGerak) {
      video.pause();
      return;
    }

    void video.play().catch(() => {
      // Poster tetap menjadi fallback bila kebijakan browser menolak autoplay.
    });
  }, [kurangiGerak]);

  const transisi = kurangiGerak
    ? { duration: 0 }
    : { duration: 0.8, ease: "easeOut" as const };

  return (
    <section
      id="majegan-hero"
      aria-labelledby="judul-hero-majegan"
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-[#15372B] text-[#F3EBDD]"
    >
      <Image
        src={posterSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden="true"
        className="z-0 object-cover object-[70%_center] md:object-center"
      />

      {!videoGagal && !kurangiGerak ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc}
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => setVideoSiap(true)}
          onError={() => setVideoGagal(true)}
          className={cn(
            "absolute inset-0 z-0 h-full w-full object-cover object-[70%_center] transition-opacity duration-1000 md:object-center",
            videoSiap ? "opacity-100" : "opacity-0",
          )}
        >
          {mobileVideoSrc ? <source media="(max-width: 767px)" src={mobileVideoSrc} /> : null}
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : null}

      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(8,28,20,.84)_0%,rgba(8,28,20,.62)_31%,rgba(8,28,20,.2)_62%,rgba(8,28,20,.05)_100%)] max-md:bg-[linear-gradient(90deg,rgba(8,28,20,.8)_0%,rgba(8,28,20,.48)_58%,rgba(8,28,20,.16)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(7,24,17,.26)_0%,transparent_35%,rgba(7,24,17,.2)_66%,rgba(7,24,17,.72)_100%)]"
      />

      <div className="wadah relative z-20 flex min-h-[100svh] items-end px-5 pt-30 pb-20 sm:px-8 md:items-center md:px-12 md:pt-32 md:pb-24 lg:px-16">
        <motion.div
          initial={kurangiGerak ? false : "tersembunyi"}
          animate="terlihat"
          variants={{
            tersembunyi: {},
            terlihat: {
              transition: kurangiGerak ? undefined : { staggerChildren: 0.15, delayChildren: 0.16 },
            },
          }}
          className="max-w-[42rem]"
        >
          <motion.p
            variants={{
              tersembunyi: { opacity: 0, y: 18 },
              terlihat: { opacity: 1, y: 0, transition: transisi },
            }}
            className="mb-4 flex items-center gap-2.5 text-[11px] font-extrabold tracking-[.28em] text-[#D6B45C] uppercase sm:text-xs"
          >
            <span className="h-px w-8 rounded-full bg-[#D6B45C]/70" aria-hidden="true" />
            <span>{eyebrow}</span>
          </motion.p>

          <motion.h1
            id="judul-hero-majegan"
            variants={{
              tersembunyi: { opacity: 0, y: 20 },
              terlihat: { opacity: 1, y: 0, transition: transisi },
            }}
            className="mt-2 font-serif text-[clamp(3.4rem,16vw,5.4rem)] leading-[.92] font-semibold tracking-[-.035em] text-[#F3EBDD] uppercase drop-shadow-[0_2px_20px_rgba(0,0,0,.18)] md:mt-3 md:text-[clamp(5rem,8vw,7.5rem)]"
          >
            {title}
          </motion.h1>

          <motion.p
            variants={{
              tersembunyi: { opacity: 0, y: 18 },
              terlihat: { opacity: 1, y: 0, transition: transisi },
            }}
            className="mt-[clamp(1.1rem,2.6vw,1.75rem)] text-sm font-medium tracking-[.015em] text-[#F3EBDD]/88 sm:text-base md:text-lg"
          >
            {location}
          </motion.p>

          <motion.div
            variants={{
              tersembunyi: { opacity: 0, y: 18 },
              terlihat: { opacity: 1, y: 0, transition: transisi },
            }}
            className="mt-7 flex flex-col gap-3 min-[390px]:flex-row md:mt-9"
          >
            <Link
              href={primaryCta.href}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#F3EBDD] px-5 text-[13px] font-extrabold whitespace-nowrap text-hutan transition duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-offset-4 sm:px-6 sm:text-sm"
            >
              {primaryCta.label}
              <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-1" />
            </Link>
            <Link
              href={secondaryCta.href}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#F3EBDD]/55 bg-transparent px-5 text-[13px] font-bold whitespace-nowrap text-[#F3EBDD] transition duration-300 hover:-translate-y-0.5 hover:border-[#F3EBDD] hover:bg-[#F3EBDD]/10 focus-visible:outline-offset-4 sm:px-6 sm:text-sm"
            >
              {secondaryCta.label}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
