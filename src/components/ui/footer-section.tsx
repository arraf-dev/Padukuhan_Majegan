"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import type { Peran } from "@/content/majegan";
import { desa, navigasi } from "@/content/majegan";
import { Logo } from "@/components/ikon";
import { cn } from "@/lib/utils";

type IkonTautan = ComponentType<{ className?: string }>;

interface TautanFooter {
  judul: string;
  href: string;
  eksternal?: boolean;
  ikon?: IkonTautan;
}

interface BagianFooter {
  label: string;
  tautan: TautanFooter[];
}

const tautanPublik: BagianFooter[] = [
  {
    label: "Jelajahi",
    tautan: navigasi.slice(0, 5).map((item) => ({ judul: item.label, href: item.href })),
  },
  {
    label: "Pelayanan",
    tautan: [
      { judul: "Informasi Layanan", href: "/layanan" },
      { judul: "Kirim Pengaduan", href: "/pengaduan" },
      { judul: "Statistik Penduduk", href: "/statistik" },
    ],
  },
  {
    label: "Tautan terkait",
    tautan: [
      {
        judul: "Kalurahan Pandowoharjo",
        href: desa.websiteKalurahan,
        eksternal: true,
        ikon: Globe2,
      },
    ],
  },
];

const tautanAdminDasar: TautanFooter[] = [
  { judul: "Dashboard", href: "/admin" },
  { judul: "Berita", href: "/admin/berita" },
  { judul: "Pengaduan", href: "/admin/pengaduan" },
  { judul: "Akun Saya", href: "/admin/akun" },
];

const tautanSuperadmin: TautanFooter[] = [
  { judul: "Profil & Struktur", href: "/admin/profil" },
  { judul: "Layanan", href: "/admin/layanan" },
  { judul: "Statistik", href: "/admin/statistik" },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.4" cy="6.7" r="1.15" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M16.6 5.82a4.84 4.84 0 0 1-1.2-3.2h-3.5v12.82a2.94 2.94 0 1 1-2.05-2.8V9.08a6.47 6.47 0 1 0 5.55 6.4V9a8.3 8.3 0 0 0 4.86 1.56V7.08a4.9 4.9 0 0 1-3.66-1.26Z" />
    </svg>
  );
}

function Tautan({ tautan, className }: { tautan: TautanFooter; className?: string }) {
  const isi = (
    <>
      {tautan.ikon && <tautan.ikon className="size-4 flex-none" />}
      <span>{tautan.judul}</span>
      {tautan.eksternal && <ExternalLink className="size-3.5 flex-none opacity-60" />}
    </>
  );
  const kelas = cn(
    "inline-flex min-h-11 items-center gap-2 rounded-lg py-2 text-[13px] font-medium text-krem/78 transition-colors duration-200 hover:text-emas",
    className,
  );

  if (tautan.eksternal) {
    return (
      <a href={tautan.href} target="_blank" rel="noopener noreferrer" className={kelas}>
        {isi}
      </a>
    );
  }

  return (
    <Link href={tautan.href} className={kelas}>
      {isi}
    </Link>
  );
}

function TautanSosial({
  label,
  href,
  ikon: Ikon,
}: {
  label: string;
  href?: string;
  ikon: IkonTautan;
}) {
  const kelas =
    "group inline-flex min-h-11 items-center gap-2 rounded-xl border border-krem/15 bg-krem/[.06] px-3 text-xs font-bold text-krem/80 transition duration-200 hover:-translate-y-0.5 hover:border-emas/55 hover:bg-krem/10 hover:text-emas";

  if (!href) {
    return (
      <span
        aria-disabled="true"
        title={`Tautan resmi ${label} belum tersedia`}
        className={cn(kelas, "cursor-not-allowed opacity-55 hover:translate-y-0 hover:border-krem/15 hover:text-krem/80")}
      >
        <Ikon className="size-[18px]" />
        {label}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Buka profil ${label} di tab baru`}
      className={kelas}
    >
      <Ikon className="size-[18px] transition-transform duration-200 group-hover:scale-105" />
      {label}
    </a>
  );
}

export function Footer({
  tahun,
  varian = "publik",
  peran = "admin",
}: {
  tahun: number;
  varian?: "publik" | "admin";
  peran?: Peran;
}) {
  if (varian === "admin") return <FooterAdmin tahun={tahun} peran={peran} />;

  return (
    <footer className="relative isolate w-full overflow-hidden rounded-t-[2rem] border-t border-emas/40 bg-hutan text-krem md:rounded-t-[3rem]">
      <div className="joglo" />
      <div className="pointer-events-none absolute inset-x-0 top-2 -z-10 mx-auto h-44 max-w-4xl bg-[radial-gradient(50%_100%_at_50%_0%,rgba(214,180,92,.2),transparent)]" />
      <div className="absolute top-2 left-1/2 h-px w-1/3 -translate-x-1/2 rounded-full bg-emas/65 blur-[1px]" />

      <div className="wadah px-5 pt-10 pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:px-12 md:pt-14 md:pb-9 lg:px-16 lg:pt-16 lg:pb-11">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1.75fr] lg:gap-14 xl:gap-20">
          <AnimatedContainer className="max-w-xl">
            <div className="flex items-center gap-3.5">
              <Logo ukuran={42} />
              <div>
                <div className="font-serif text-xl font-semibold text-krem md:text-2xl">{desa.nama}</div>
                <div className="mt-0.5 text-xs text-krem/65">{desa.wilayahSingkat}</div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-[13px] leading-relaxed text-krem/72 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 flex-none text-emas" />
                <address className="not-italic">
                  {desa.alamat.map((baris) => (
                    <span key={baris} className="block">{baris}</span>
                  ))}
                </address>
              </div>
              <div className="space-y-1">
                <a href={desa.whatsappUrl} className="flex min-h-9 items-center gap-2.5 hover:text-emas">
                  <MessageCircle className="size-4 flex-none text-emas" />
                  <span>WhatsApp {desa.whatsapp}</span>
                </a>
                <a href={`mailto:${desa.email}`} className="flex min-h-9 items-center gap-2.5 hover:text-emas">
                  <Mail className="size-4 flex-none text-emas" />
                  <span className="min-w-0 break-all">{desa.email}</span>
                </a>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5" aria-label="Media sosial">
              <TautanSosial label="Instagram" href={desa.instagramUrl} ikon={InstagramIcon} />
              <TautanSosial label="TikTok" href={desa.tiktokUrl || undefined} ikon={TikTokIcon} />
            </div>
          </AnimatedContainer>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 sm:gap-x-8">
            {tautanPublik.map((bagian, index) => (
              <AnimatedContainer key={bagian.label} delay={0.08 + index * 0.08}>
                <nav aria-label={bagian.label}>
                  <h2 className="text-[11px] font-extrabold tracking-[.12em] text-emas uppercase">
                    {bagian.label}
                  </h2>
                  <ul className="mt-3 space-y-0.5">
                    {bagian.tautan.map((tautan) => (
                      <li key={tautan.judul}>
                        <Tautan tautan={tautan} />
                      </li>
                    ))}
                  </ul>
                </nav>
              </AnimatedContainer>
            ))}
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-2 border-t border-krem/15 pt-5 text-[11.5px] leading-relaxed text-krem/60 md:mt-11 md:flex-row md:items-center md:justify-between">
          <span>© {tahun} {desa.nama}. Dikelola oleh perangkat padukuhan.</span>
          <span>Dibangun bersama Tim KKN Majegan UNY 2026</span>
        </div>
      </div>
    </footer>
  );
}

function FooterAdmin({ tahun, peran }: { tahun: number; peran: Peran }) {
  const tautanPanel = peran === "superadmin"
    ? [...tautanAdminDasar.slice(0, 3), ...tautanSuperadmin, tautanAdminDasar[3]]
    : tautanAdminDasar;

  return (
    <footer className="relative overflow-hidden rounded-t-[1.75rem] border-t border-garis-tebal bg-kertas md:rounded-t-[2.25rem]">
      <div className="absolute inset-x-0 top-0 mx-auto h-32 max-w-2xl bg-[radial-gradient(45%_100%_at_50%_0%,rgba(214,180,92,.2),transparent)]" />
      <div className="relative px-4 py-7 md:px-8 md:py-8 lg:px-10">
        <div className="mx-auto grid w-full max-w-[1240px] gap-7 sm:grid-cols-[1fr_1.4fr] sm:items-start lg:grid-cols-[1fr_2fr]">
          <AnimatedContainer className="flex items-center gap-3">
            <Logo ukuran={34} />
            <div>
              <div className="font-serif text-[17px] font-semibold text-hutan">Majegan Admin</div>
              <p className="text-[11.5px] text-redup">Panel pengelolaan informasi padukuhan</p>
            </div>
          </AnimatedContainer>

          <AnimatedContainer delay={0.1} className="grid gap-5 xl:grid-cols-[1fr_auto] xl:items-start">
            <nav aria-label="Navigasi footer panel">
              <h2 className="text-[10px] font-extrabold tracking-[.12em] text-emas-tua uppercase">Navigasi panel</h2>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {tautanPanel.map((tautan) => (
                  <Link
                    key={tautan.href}
                    href={tautan.href}
                    className="inline-flex min-h-10 items-center py-2 text-xs font-semibold text-redup transition-colors hover:text-hutan"
                  >
                    {tautan.judul}
                  </Link>
                ))}
              </div>
            </nav>
            <Link
              href="/"
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-garis-tebal bg-krem px-4 text-xs font-bold text-hutan transition-colors hover:border-emas hover:bg-emas-muda"
            >
              Lihat website publik
              <ExternalLink className="size-3.5" />
            </Link>
          </AnimatedContainer>
        </div>
        <div className="mx-auto mt-6 flex w-full max-w-[1240px] flex-col gap-1 border-t border-garis pt-4 text-[11px] text-samar sm:flex-row sm:justify-between">
          <span>© {tahun} {desa.nama}</span>
          <span>Khusus perangkat padukuhan yang berwenang</span>
        </div>
      </div>
    </footer>
  );
}

type AnimatedContainerProps = {
  delay?: number;
  className?: string;
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.04, children }: AnimatedContainerProps) {
  return (
    <div data-reveal data-jeda={Math.round(delay * 10)} className={className}>
      {children}
    </div>
  );
}
