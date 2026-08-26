"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BarChart3, FileText, House, Images, Landmark, MessageCircle, Newspaper, UserRound } from "lucide-react";
import { desa } from "@/content/majegan";
import { Logo } from "@/components/ikon";
import { StatusDataDemo } from "@/components/status-data";
import { MajeganNavbar, type NavItem } from "@/components/ui/majegan-navbar";

const navItems: NavItem[] = [
  { name: "Beranda", url: "/", icon: House },
  { name: "Profil", url: "/profil", icon: UserRound },
  { name: "Berita", url: "/berita", icon: Newspaper },
  { name: "Galeri", url: "/galeri", icon: Images },
  { name: "Potensi", url: "/potensi", icon: Landmark },
  { name: "Layanan", url: "/layanan", icon: FileText },
  { name: "Pengaduan", url: "/pengaduan", icon: MessageCircle },
  { name: "Statistik", url: "/statistik", icon: BarChart3 },
];

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
      <header className="absolute inset-x-0 top-0 z-50 text-krem">
        {modeDemo ? <StatusDataDemo ringkas /> : null}
        <div
          className={`border-b transition-[background-color,border-color,box-shadow] duration-400 ease-out ${
            digulir
              ? "border-krem/12 bg-hutan/92 shadow-[0_8px_30px_rgba(5,24,16,.16)] backdrop-blur-md"
              : "border-transparent bg-gradient-to-b from-hutan-pekat/55 to-transparent"
          }`}
        >
          <div className="wadah flex min-h-17 items-center justify-between gap-5 px-5 sm:px-8 md:min-h-20 md:px-12 lg:px-16">
            <Link
              href="/"
              aria-label={`Beranda ${desa.nama}`}
              aria-current="page"
              className="flex min-h-11 items-center gap-3"
            >
              <Logo ukuran={38} className="drop-shadow-sm" />
              <span className="leading-tight">
                <span className="block font-serif text-[17px] font-semibold text-krem md:text-lg">Majegan</span>
                <span className="block text-[9px] font-bold tracking-[.16em] text-krem/65 uppercase md:text-[10px]">
                  Pandowoharjo · Sleman
                </span>
              </span>
            </Link>
            <MajeganNavbar items={navItems} landing scrolled={digulir} />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="relative z-50">
      <div className="bg-hutan text-krem">
        <div className="wadah flex items-center gap-3 px-5 py-3 md:gap-5 md:px-12 lg:px-16 lg:py-4">
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
          <div className="ml-auto flex items-center gap-4">
            <MajeganNavbar items={navItems} />
          </div>
        </div>
      </div>

      <div className="joglo" />

      {modeDemo ? <StatusDataDemo /> : null}
    </header>
  );
}
