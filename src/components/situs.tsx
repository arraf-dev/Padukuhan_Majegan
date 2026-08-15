"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { desa, navigasi } from "@/content/majegan";
import { Ikon, Logo, type NamaIkon } from "@/components/ikon";
import { StatusDataDemo } from "@/components/status-data";

const aktif = (path: string, href: string) =>
  href === "/" ? path === "/" : path.startsWith(href);

export function Header({ modeDemo = false }: { modeDemo?: boolean }) {
  const path = usePathname();
  const beranda = path === "/";
  const [digulir, setDigulir] = useState(false);

  useEffect(() => {
    if (!beranda) return;

    const perbarui = () => setDigulir(window.scrollY > 28);
    perbarui();
    window.addEventListener("scroll", perbarui, { passive: true });
    return () => window.removeEventListener("scroll", perbarui);
  }, [beranda]);

  if (beranda) {
    return (
      <header className="fixed inset-x-0 top-0 z-50 text-krem">
        {modeDemo ? <StatusDataDemo ringkas /> : null}
        <div
          className={`border-b transition-[background-color,border-color,box-shadow] duration-400 ease-out ${
            digulir
              ? "border-krem/12 bg-hutan/92 shadow-[0_8px_30px_rgba(5,24,16,.16)] backdrop-blur-md"
              : "border-transparent bg-gradient-to-b from-hutan-pekat/55 to-transparent"
          }`}
        >
          <nav
            aria-label="Navigasi utama"
            className="wadah flex min-h-17 items-center justify-between gap-5 px-5 sm:px-8 md:min-h-20 md:px-12 lg:px-16"
          >
            <Link
              href="/"
              aria-label={`Beranda ${desa.nama}`}
              aria-current="page"
              className="flex min-h-11 items-center gap-3"
            >
              <Logo ukuran={38} className="drop-shadow-sm" />
              <span className="leading-tight">
                <span className="block font-serif text-[17px] font-semibold text-krem md:text-lg">
                  Majegan
                </span>
                <span className="block text-[9px] font-bold tracking-[.16em] text-krem/65 uppercase md:text-[10px]">
                  Pandowoharjo · Sleman
                </span>
              </span>
            </Link>

            <div className="hidden items-stretch md:flex">
              {navigasi.slice(1).map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="inline-flex min-h-11 items-center border-b-2 border-transparent px-3 text-[13px] font-semibold text-krem/82 transition-colors duration-300 hover:border-emas hover:text-krem lg:px-4 lg:text-sm"
                >
                  {n.label}
                </Link>
              ))}
            </div>

            <Link
              href="/layanan"
              className="inline-flex min-h-10 items-center rounded-full border border-krem/35 px-4 text-xs font-bold text-krem transition-colors hover:border-krem hover:bg-krem/10 md:hidden"
            >
              Layanan
            </Link>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header>
      {/* Warna latar tetap penuh selebar layar; hanya isinya yang dibatasi `wadah`. */}
      <div className="bg-hutan text-krem">
        <div className="wadah flex items-center gap-3 px-5 py-3 md:gap-3.5 md:px-12 lg:px-16 lg:py-4">
          <Link
            href="/"
            aria-label={`Beranda ${desa.nama}`}
            className="flex min-h-11 flex-none items-center md:min-h-0"
          >
            <Logo ukuran={34} className="md:hidden" />
            <Logo ukuran={42} className="hidden md:block" />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="font-serif text-[15px] font-semibold md:text-[19px] lg:text-[22px]">
              {desa.nama}
            </div>
            <div className="truncate text-[10.5px] text-krem/75 md:text-[12.5px] lg:text-[13.5px]">
              <span className="md:hidden">Kalurahan Pandowoharjo, Sleman, DIY</span>
              <span className="hidden md:inline">{desa.wilayah}</span>
            </div>
          </div>
          <a
            href={desa.whatsappUrl}
            className="hidden text-right text-[12.5px] font-semibold text-emas transition-colors duration-200 ease-out hover:text-krem md:block lg:text-[13.5px]"
          >
            WhatsApp {desa.whatsapp}
          </a>
        </div>
      </div>

      <div className="joglo" />

      {/* Nav desktop menempel di atas saat digulir — halaman panjang seperti
          Profil dan Layanan jadi tidak perlu digulir balik untuk pindah menu.
          Blok ini `hidden md:block`, jadi mobile (yang memakai NavBawah) tidak
          tersentuh. Rail sticky di halaman lain memakai `top-24` agar tidak
          tertutup bilah ini. */}
      <div className="hidden border-b border-garis bg-kertas md:sticky md:top-0 md:z-40 md:block md:bg-kertas/92 md:backdrop-blur">
        <nav className="wadah flex items-center gap-1 px-12 lg:px-16">
          {navigasi.map((n) => {
            const ini = aktif(path, n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={ini ? "page" : undefined}
                className={`border-b-[3px] px-3.5 py-[15px] text-sm transition-colors duration-200 ease-out lg:px-4.5 lg:py-[18px] lg:text-[15px] ${
                  ini
                    ? "border-emas font-bold text-hutan"
                    : "border-transparent font-medium text-teks hover:bg-krem hover:text-hutan"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {modeDemo ? <StatusDataDemo /> : null}
    </header>
  );
}

const tab: { href: string; label: string; ikon: NamaIkon }[] = [
  { href: "/", label: "Beranda", ikon: "rumah" },
  { href: "/berita", label: "Berita", ikon: "berita" },
  { href: "/layanan", label: "Layanan", ikon: "kisi" },
  { href: "/pengaduan", label: "Lapor", ikon: "obrolan" },
  { href: "/profil", label: "Profil", ikon: "warga" },
];

/** Navigasi bawah khusus mobile — 5 tab, target sentuh ≥ 44px. */
export function NavBawah() {
  const path = usePathname();

  return (
    // pb menyertakan safe-area: tanpa itu tab tertimpa home indicator iPhone.
    <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-garis bg-kertas px-1.5 pt-2 pb-[calc(18px+env(safe-area-inset-bottom))] md:hidden">
      {tab.map((t) => {
        const ini = aktif(path, t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={ini ? "page" : undefined}
            className={`flex min-h-11 flex-col items-center justify-center gap-1 ${
              ini ? "text-hutan" : "text-[#7C8B7E]"
            }`}
          >
            <Ikon nama={t.ikon} ukuran={22} />
            <span className={`text-[10.5px] ${ini ? "font-extrabold" : "font-semibold"}`}>
              {t.label}
            </span>
            {ini && <span className="h-[3px] w-4 rounded-sm bg-emas" />}
          </Link>
        );
      })}
    </nav>
  );
}
