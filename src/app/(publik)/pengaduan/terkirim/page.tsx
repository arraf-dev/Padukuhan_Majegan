import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Laporan Terkirim" };

export default async function Terkirim({
  searchParams,
}: {
  searchParams: Promise<{ kode?: string }>;
}) {
  const { kode } = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-4 py-8 md:py-14">
      <div className="rounded-2xl bg-hutan px-5 py-6 text-center text-krem md:px-8 md:py-8">
        <span className="mb-2.5 inline-flex size-11 items-center justify-center rounded-full bg-daun">
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M4.5 10.5 L8.5 14.5 L15.5 6"
              fill="none"
              stroke="#D6B45C"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h1 className="font-serif text-[17px] font-semibold md:text-xl">
          Laporan Anda sudah kami terima
        </h1>
        <p className="mx-auto my-1.5 max-w-[46ch] text-[12.5px] leading-[1.7] text-krem/80">
          Laporan tersimpan aman dan{" "}
          <strong className="text-emas">hanya dapat dibaca perangkat dusun</strong>. Kami menghubungi
          Anda lewat kontak yang dicantumkan bila diperlukan.
        </p>

        {kode && (
          <p className="mt-3.5 rounded-[10px] border border-krem/20 bg-krem/10 px-4 py-3 text-[12.5px] text-krem/80">
            Simpan kode tiket ini untuk menanyakan perkembangan laporan:
            <br />
            <strong className="font-mono text-base tracking-wide text-emas">{kode}</strong>
          </p>
        )}

        <Link
          href="/"
          className="mt-3.5 block min-h-11 rounded-[9px] bg-emas px-4 py-3.5 text-[13.5px] font-extrabold text-hutan hover:shadow-[0_4px_12px_rgba(0,0,0,.3)]"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
