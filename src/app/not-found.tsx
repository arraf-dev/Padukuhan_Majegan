import Link from "next/link";
import { desa, navigasi } from "@/content/majegan";
import { Logo } from "@/components/ikon";

/**
 * 404 mandiri — sengaja tidak memakai Header/Footer supaya aman dipakai baik
 * untuk URL asing maupun untuk `notFound()` dari halaman publik, tanpa risiko
 * kop situs tampil dua kali.
 */
export default function TidakDitemukan() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-5 py-12 text-center">
      <Logo ukuran={56} />
      <p className="mt-4 font-mono text-[13px] font-bold tracking-[.12em] text-emas-tua">
        HALAMAN TIDAK DITEMUKAN
      </p>
      <h1 className="mt-1.5 font-serif text-2xl font-semibold text-hutan md:text-[30px]">
        Alamat yang Anda tuju tidak ada
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-teks">
        Mungkin tautannya salah ketik, atau halamannya sudah dipindahkan. Silakan pilih tujuan di
        bawah ini.
      </p>

      <nav className="mt-6 flex flex-wrap justify-center gap-2">
        {navigasi.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="min-h-11 rounded-[9px] border border-garis-tebal bg-kertas px-4 py-2.5 text-[13px] font-semibold text-tinta hover:border-daun hover:text-hutan"
          >
            {n.label}
          </Link>
        ))}
      </nav>

      <p className="mt-7 text-xs text-samar">
        Website resmi {desa.nama}, {desa.kalurahan}
      </p>
    </main>
  );
}
