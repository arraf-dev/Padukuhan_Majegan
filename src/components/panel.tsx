"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { akun, menuAdmin, type Peran } from "@/content/majegan";
import { Ikon, Logo } from "@/components/ikon";

/**
 * Sidebar panel admin. Peran `admin` hanya melihat Dashboard, Berita, dan
 * Pengaduan — menu lain tampil terkunci, sesuai matriks peran pada mockup.
 */
export function Sidebar({ peran, nama }: { peran: Peran; nama: string }) {
  const path = usePathname();
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
              href={m.href}
              aria-current={aktif ? "page" : undefined}
              className={`${dasar} ${
                aktif
                  ? "bg-emas font-bold text-hutan"
                  : "font-medium text-krem/85 hover:bg-krem/10 hover:text-krem"
              }`}
            >
              <Ikon nama={m.ikon} ukuran={17} />
              <span className="flex-1">{m.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2.5 border-t border-krem/15 px-2.5 pt-3">
        <div className="foto size-8 flex-none rounded-full border-[1.5px] border-emas" />
        <div className="flex-1">
          <div className="text-[12.5px] font-bold">{nama}</div>
          <div className="text-[10px] text-krem/60">{akun[peran].jabatan}</div>
        </div>
      </div>
    </aside>
  );
}

/** Pengganti sidebar di layar kecil. */
/** Menu mobile */
export function MenuAtas({ peran }: { peran: Peran }) {
  const path = usePathname();
  const terbatas = peran === "admin";
  const [buka, setBuka] = useState(false);

  return (
    <>
      {/* Header Mobile */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-garis bg-hutan px-4 py-3 md:hidden">
        <button
          onClick={() => setBuka(true)}
          className="rounded-lg p-2 text-krem hover:bg-krem/10"
        >
          ☰
        </button>

        <span className="font-semibold text-krem">Panel Admin</span>

        <div className="w-8" />
      </div>

      {/* Overlay */}
      {buka && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setBuka(false)}
        />
      )}

      {/* Sidebar Mobile */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-hutan transition-transform duration-300 md:hidden ${
          buka ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-krem/10 p-4">
          <div>
            <div className="font-bold text-krem">Majegan Admin</div>
            <div className="text-xs text-krem/60">
              Panel Perangkat Dusun
            </div>
          </div>

          <button
            onClick={() => setBuka(false)}
            className="text-xl text-krem"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col p-3">
          {menuAdmin
            .filter((m) => !(terbatas && m.superadmin))
            .map((m) => (
              <Link
                key={m.href}
                href={m.href}
                onClick={() => setBuka(false)}
                className={`mb-2 flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                  path === m.href
                    ? "bg-emas font-bold text-hutan"
                    : "text-krem hover:bg-krem/10"
                }`}
              >
                <Ikon nama={m.ikon} ukuran={18} />
                {m.label}
              </Link>
            ))}
        </nav>
      </aside>
    </>
  );
}
