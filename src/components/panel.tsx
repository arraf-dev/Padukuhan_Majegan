"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { akun, menuAdmin, type Peran } from "@/content/majegan";
import { Ikon, Logo } from "@/components/ikon";
import { keluar } from "@/app/admin/aksi";

/**
 * Sidebar panel admin. Peran `admin` hanya melihat Dashboard, Berita,
 * Pengaduan, dan Akun Saya — menu pengelolaan padukuhan tetap terkunci.
 */
export function Sidebar({ peran, nama }: { peran: Peran; nama: string }) {
  const path = usePathname();
  const terbatas = peran === "admin";
  const dasar =
    "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13.5px] transition-colors duration-200 ease-out lg:px-3.5 lg:py-3 lg:text-sm";

  return (
    // Sticky setinggi layar: daftar isi panel sering panjang (berita, pengaduan),
    // tanpa ini menu ikut tergulir hilang dan harus balik ke atas untuk pindah.
    <aside className="flex flex-col bg-hutan px-3.5 pt-5 pb-4.5 text-krem max-md:hidden md:sticky md:top-0 md:h-screen lg:px-4 lg:pt-6">
      <div className="flex items-center gap-2.5 border-b border-krem/15 px-2.5 pb-4.5">
        <Logo ukuran={30} />
        <div>
          <div className="font-serif text-sm font-semibold lg:text-[15px]">Majegan Admin</div>
          <div className="text-[10px] text-krem/70 lg:text-[11px]">panel perangkat dusun</div>
        </div>
      </div>

      {/* min-h-0 + overflow: di layar pendek menu terpanjang (superadmin) tidak
          terpotong tanpa bisa dijangkau karena induknya dipatok h-screen. */}
      <nav className="flex min-h-0 flex-1 flex-col gap-[3px] overflow-y-auto pt-3.5">
        {menuAdmin.map((m, i) => {
          const kunci = terbatas && m.superadmin;
          const pertamaKunci = kunci && !menuAdmin[i - 1]?.superadmin;
          const aktif = !kunci && (path === m.href || (m.href !== "/admin" && path.startsWith(`${m.href}/`)));

          if (kunci) {
            return (
              <div key={m.href}>
                {pertamaKunci && (
                  <>
                    <div className="mx-2.5 mt-2.5 mb-1.5 border-t border-dashed border-krem/20" />
                    <div className="px-3 pt-1 pb-1.5 text-[10px] font-bold tracking-[.1em] text-krem/70">
                      KHUSUS SUPERADMIN
                    </div>
                  </>
                )}
                <span
                  aria-disabled="true"
                  title="Hanya SuperAdmin (Dukuh) yang dapat membuka menu ini"
                  // /55, bukan /35: tetap terbaca "terkunci" tapi labelnya masih bisa dibaca.
                  className={`${dasar} cursor-not-allowed font-medium text-krem/55`}
                >
                  <Ikon nama="gembok" ukuran={15} />
                  {m.label}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={m.href}
              href={m.href}
              aria-current={aktif ? "page" : undefined}
              className={`${dasar} ${
                aktif
                  ? "bg-emas font-bold text-hutan"
                  : "font-medium text-krem/85 hover:bg-krem/10 hover:text-krem"
              }`}
            >
                <Ikon nama={m.ikon} ukuran={17} />
                <span className="flex-1">{terbatas && m.href === "/admin/akun" ? "Akun Saya" : m.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Keluar dipindah ke sini dari Dashboard: sebelumnya hanya bisa diakses
          dari satu halaman. Aksi `keluar` sendiri tidak diubah. */}
      <div className="flex flex-none items-center gap-2.5 border-t border-krem/15 px-2.5 pt-3 lg:pt-4">
        <div className="foto size-8 flex-none rounded-full border-[1.5px] border-emas lg:size-9" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12.5px] font-bold lg:text-[13.5px]">{nama}</div>
          <div className="text-[10px] text-krem/70 lg:text-[11px]">{akun[peran].jabatan}</div>
        </div>
        <form action={keluar}>
          <button
            type="submit"
            className="rounded-[10px] px-2.5 py-2 text-[11.5px] font-bold text-krem/70 transition-colors duration-200 ease-out hover:bg-krem/10 hover:text-emas"
          >
            Keluar
          </button>
        </form>
      </div>
    </aside>
  );
}

/** Pengganti sidebar di layar kecil. */
export function MenuAtas({ peran, nama }: { peran: Peran; nama: string }) {
  const path = usePathname();
  const terbatas = peran === "admin";

  return (
    <details className="group border-b border-krem/15 bg-hutan text-krem md:hidden">
      <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 marker:content-none">
        <Logo ukuran={30} />
        <span className="min-w-0 flex-1 truncate font-serif text-sm font-semibold">Majegan Admin</span>
        <span className="rounded-[10px] border border-krem/25 px-3 py-2 text-xs font-bold group-open:bg-emas group-open:text-hutan">
          Menu
        </span>
      </summary>
      <nav className="border-t border-krem/15 px-3 py-3">
        {menuAdmin
          .filter((m) => !(terbatas && m.superadmin))
          .map((m) => {
            const aktif = path === m.href || (m.href !== "/admin" && path.startsWith(`${m.href}/`));
            return (
              <Link
                key={m.href}
                href={m.href}
                aria-current={aktif ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm ${
                  aktif ? "bg-emas font-bold text-hutan" : "font-medium text-krem/85"
                }`}
              >
                <Ikon nama={m.ikon} ukuran={17} />
                {terbatas && m.href === "/admin/akun" ? "Akun Saya" : m.label}
              </Link>
            );
          })}
        <div className="mt-3 flex items-center gap-3 border-t border-krem/15 px-3 pt-3">
          <div className="foto size-8 rounded-full border border-emas" />
          <Link href="/admin/akun" className="min-w-0 flex-1 truncate text-xs font-bold hover:text-emas">
            {nama} · Akun
          </Link>
          <form action={keluar}>
            <button type="submit" className="min-h-10 rounded-[10px] px-3 text-xs font-bold text-krem/80 hover:bg-krem/10 hover:text-emas">
              Keluar
            </button>
          </form>
        </div>
      </nav>
    </details>
  );
}
