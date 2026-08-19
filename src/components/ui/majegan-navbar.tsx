"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

export function MajeganNavbar({
  items,
  landing = false,
  scrolled = false,
}: {
  items: NavItem[];
  landing?: boolean;
  scrolled?: boolean;
}) {
  const pathname = usePathname();
  const [terbuka, setTerbuka] = useState(false);
  const terang = landing && !scrolled;
  const hijau = terang || !landing;

  useEffect(() => {
    setTerbuka(false);
  }, [pathname]);

  useEffect(() => {
    if (!terbuka) return;
    const tutupDenganEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTerbuka(false);
    };
    document.addEventListener("keydown", tutupDenganEscape);
    return () => document.removeEventListener("keydown", tutupDenganEscape);
  }, [terbuka]);

  const aktif = (url: string) => (url === "/" ? pathname === "/" : pathname === url || pathname.startsWith(`${url}/`));

  return (
    <div className="relative flex items-center">
      <div
        className={cn(
          "relative flex items-center rounded-full border p-1 shadow-[0_12px_30px_rgba(5,24,16,.2)]",
          terang
            ? "border-krem/25 bg-hutan/45"
            : !landing
              ? "border-krem/20 bg-hutan/65 backdrop-blur-md"
              : "border-garis bg-kertas/95",
        )}
      >
        <nav aria-label="Navigasi utama" className="hidden items-center gap-0.5 lg:flex">
          {items.map((item) => {
            const ini = aktif(item.url);
            return (
              <Link
                key={item.url}
                href={item.url}
                aria-current={ini ? "page" : undefined}
                className={cn(
                  "relative inline-flex min-h-11 items-center rounded-full px-3.5 text-[12.5px] font-semibold transition-colors duration-200 xl:px-4 xl:text-[13px]",
                  hijau
                    ? ini
                      ? "text-emas"
                      : "text-krem/78 hover:bg-krem/10 hover:text-krem"
                    : ini
                      ? "bg-emas font-bold text-hutan"
                      : "text-teks hover:bg-emas-muda hover:text-hutan",
                )}
              >
                {item.name}
                {terang && ini && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-emas" />}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-expanded={terbuka}
          aria-controls="menu-navigasi-majegan"
          aria-label={terbuka ? "Tutup menu navigasi" : "Buka menu navigasi"}
          onClick={() => setTerbuka((nilai) => !nilai)}
            className={cn(
              "flex size-11 items-center justify-center rounded-full border transition-colors lg:hidden",
            hijau
              ? "border-krem/35 text-krem hover:border-emas hover:text-emas"
              : "border-garis-tebal text-hutan hover:border-daun hover:bg-emas-muda",
            )}
        >
          {terbuka ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
        </button>

        {terbuka && (
          <div
            id="menu-navigasi-majegan"
            className="absolute top-[calc(100%+0.75rem)] right-0 z-50 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-krem/15 bg-hutan p-2 shadow-[0_18px_45px_rgba(5,24,16,.28)] lg:hidden"
          >
            <nav aria-label="Menu navigasi mobile" className="flex flex-col gap-1">
              {items.map((item) => {
                const Icon = item.icon;
                const ini = aktif(item.url);
                return (
                  <Link
                    key={item.url}
                    href={item.url}
                    aria-current={ini ? "page" : undefined}
                    onClick={() => setTerbuka(false)}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition-colors",
                      ini ? "bg-emas text-hutan" : "text-krem/85 hover:bg-krem/10 hover:text-krem",
                    )}
                  >
                    <Icon aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
