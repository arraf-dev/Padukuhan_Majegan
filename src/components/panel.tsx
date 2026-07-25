"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { akun, menuAdmin, type Peran } from "@/content/majegan";
import { Ikon, Logo } from "@/components/ikon";

/**
 * Sidebar panel admin. Peran `admin` hanya melihat Dashboard, Berita, dan
 * Pengaduan — menu lain tampil terkunci, sesuai matriks peran pada mockup.
 */
export function Sidebar({ peran }: { peran: Peran }) {
  const path = usePathname();
  const pengguna = akun[peran];
  const terbatas = peran === "admin";
  const dasar = "flex items-center gap-3 rounded-[9px] px-3 py-2.5 text-[13.5px]";

  return (
    <aside className="flex flex-col bg-hutan px-3.5 pt-5 pb-4.5 text-krem max-md:hidden">
      <div className="flex items-center gap-2.5 border-b border-krem/15 px-2.5 pb-4.5">
        <Logo ukuran={30} />
        <div>
          <div className="font-serif text-sm font-semibold">Majegan Admin</div>
          <div className="text-[10px] text-krem/60">panel perangkat dusun</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-[3px] pt-3.5">
        {menuAdmin.map((m, i) => {
          const kunci = terbatas && m.superadmin;
          const pertamaKunci = kunci && !menuAdmin[i - 1]?.superadmin;
          const aktif = !kunci && path === m.href;

          if (!kunci && m.belum) {
            return (
              <span
                key={m.href}
                aria-disabled="true"
                title="Modul ini belum dibangun"
                className={`${dasar} cursor-not-allowed font-medium text-krem/45`}
              >
                <Ikon nama={m.ikon} ukuran={17} />
                <span className="flex-1">{m.label}</span>
                {m.lencana && (
                  <span className="rounded-full bg-emas/40 px-2 py-0.5 text-[11px] font-extrabold text-hutan">
                    {m.lencana}
                  </span>
                )}
              </span>
            );
          }

          if (kunci) {
            return (
              <div key={m.href}>
                {pertamaKunci && (
                  <>
                    <div className="mx-2.5 mt-2.5 mb-1.5 border-t border-dashed border-krem/20" />
                    <div className="px-3 pt-1 pb-1.5 text-[10px] font-bold tracking-[.1em] text-krem/45">
                      KHUSUS SUPERADMIN
                    </div>
                  </>
                )}
                <span
                  aria-disabled="true"
                  title="Hanya SuperAdmin (Dukuh) yang dapat membuka menu ini"
                  className={`${dasar} cursor-not-allowed font-medium text-krem/35`}
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
              href={peran === "admin" ? `${m.href}?peran=admin` : m.href}
              aria-current={aktif ? "page" : undefined}
              className={`${dasar} ${
                aktif
                  ? "bg-emas font-bold text-hutan"
                  : "font-medium text-krem/85 hover:bg-krem/10 hover:text-krem"
              }`}
            >
              <Ikon nama={m.ikon} ukuran={17} />
              <span className="flex-1">{m.label}</span>
              {m.lencana && (
                <span className="rounded-full bg-emas px-2 py-0.5 text-[11px] font-extrabold text-hutan">
                  {m.lencana}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2.5 border-t border-krem/15 px-2.5 pt-3">
        <div className="foto size-8 flex-none rounded-full border-[1.5px] border-emas" />
        <div className="flex-1">
          <div className="text-[12.5px] font-bold">{pengguna.nama}</div>
          <div className="text-[10px] text-krem/60">{pengguna.jabatan}</div>
        </div>
      </div>
    </aside>
  );
}

/** Pengganti sidebar di layar kecil. */
export function MenuAtas({ peran }: { peran: Peran }) {
  const path = usePathname();
  const terbatas = peran === "admin";

  return (
    <div className="flex gap-1.5 overflow-x-auto border-b border-krem/15 bg-hutan px-4 py-2.5 md:hidden">
      {menuAdmin
        .filter((m) => !(terbatas && m.superadmin))
        .map((m) =>
          m.belum ? (
            <span
              key={m.href}
              aria-disabled="true"
              className="rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap text-krem/40"
            >
              {m.label}
            </span>
          ) : (
            <Link
              key={m.href}
              href={terbatas ? `${m.href}?peran=admin` : m.href}
              className={`rounded-full px-3 py-1.5 text-xs whitespace-nowrap ${
                path === m.href ? "bg-emas font-bold text-hutan" : "font-medium text-krem/80"
              }`}
            >
              {m.label}
            </Link>
          ),
        )}
    </div>
  );
}
