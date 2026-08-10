"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { desa, navigasi } from "@/content/majegan";
import { Ikon, Logo, type NamaIkon } from "@/components/ikon";

const aktif = (path: string, href: string) =>
  href === "/" ? path === "/" : path.startsWith(href);

export function Header() {
  const path = usePathname();

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

export function Footer() {
  return (
    <>
      <div className="joglo" />
      <footer className="bg-hutan text-[13px] leading-relaxed text-krem/80">
        <div className="wadah px-5 pt-8 pb-6 md:px-12 md:pt-[34px] lg:px-16 lg:pt-12 lg:pb-8">
        <div className="grid gap-8 md:grid-cols-[1.3fr_1fr_1fr] md:gap-9 lg:grid-cols-[1.6fr_1fr_1fr] lg:gap-14">
          <div>
            <div className="mb-2.5 flex items-center gap-3">
              <Logo ukuran={34} />
              <div className="font-serif text-base font-semibold text-krem">{desa.nama}</div>
            </div>
            {desa.alamat.map((baris) => (
              <div key={baris}>{baris}</div>
            ))}
          </div>
          <div>
            <div className="mb-2 text-[12.5px] font-bold tracking-[.08em] text-emas">KONTAK</div>
            {/* py-1: menaikkan tinggi target sentuh tautan footer dari 21px */}
            <a href={desa.whatsappUrl} className="block py-1 transition-colors duration-200 ease-out hover:text-emas">
              WhatsApp: {desa.whatsapp}
            </a>
            <a
              href={`mailto:${desa.email}`}
              className="block break-all py-1 transition-colors duration-200 ease-out hover:text-emas"
            >
              Email: {desa.email}
            </a>
          </div>
          <div>
            <div className="mb-2 text-[12.5px] font-bold tracking-[.08em] text-emas">TAUTAN</div>
            {/* ponytail: URL tujuan menyusul dari kalurahan — ditulis sebagai teks
                dulu, bukan tautan mati. Ganti jadi <a href> begitu alamatnya turun. */}
            {["Kalurahan Pandowoharjo", "Kabupaten Sleman", "Lapor! Sleman"].map((t) => (
              <span key={t} className="block text-krem/70">
                {t}
              </span>
            ))}
            <Link
              href="/pengaduan/lacak"
              className="mt-1.5 block py-1 transition-colors duration-200 ease-out hover:text-emas"
            >
              Lacak Pengaduan
            </Link>
            {/* Untuk perangkat dusun, bukan warga — sengaja dibuat tidak menonjol.
                Opasitas ditahan di 70%: di bawah itu kontrasnya jatuh di bawah AA. */}
            <Link
              href="/admin/masuk"
              className="mt-1.5 block py-1 text-krem/70 transition-colors duration-200 ease-out hover:text-emas"
            >
              Masuk Panel
            </Link>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-1 border-t border-krem/15 pt-4 text-[11.5px] text-krem/70 md:flex-row md:justify-between">
          <span>
            Website resmi {desa.nama}, {desa.kalurahan} — dikelola oleh perangkat dusun.
          </span>
          <span>Dibangun bersama Tim KKN Majegan UNY 2026</span>
        </div>
        </div>
      </footer>
    </>
  );
}
