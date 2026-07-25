"use client";

import Link from "next/link";
import { Logo } from "@/components/ikon";

/**
 * Batas galat runtime. Tanpa berkas ini warga melihat layar putih bawaan Next
 * dalam bahasa Inggris; di sini setidaknya ada penjelasan dan tombol coba lagi.
 *
 * ponytail: pesan galat asli sengaja tidak ditampilkan ke warga. Cukup dicatat
 * ke konsol — pemantauan (Sentry dsb.) menyusul kalau memang dibutuhkan.
 */
export default function Galat({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-5 py-12 text-center">
      <Logo ukuran={56} />
      <h1 className="mt-4 font-serif text-2xl font-semibold text-hutan">
        Maaf, terjadi gangguan
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-teks">
        Halaman ini gagal dimuat. Coba muat ulang sebentar lagi — kalau masih bermasalah, sampaikan
        ke perangkat dusun.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        <button
          onClick={reset}
          className="min-h-11 rounded-[10px] bg-hutan px-6 py-3 text-sm font-extrabold text-krem hover:bg-daun"
        >
          Coba lagi
        </button>
        <Link
          href="/"
          className="min-h-11 rounded-[10px] border border-garis-tebal bg-kertas px-6 py-3 text-sm font-semibold text-tinta hover:border-daun"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
