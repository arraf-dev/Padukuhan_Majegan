import type { Metadata } from "next";
import Link from "next/link";
import { Ikon } from "@/components/ikon";
import { Kerangka } from "@/app/admin/kerangka";
import { hapusLayanan } from "@/app/admin/layanan/aksi";
import { daftarLayananAdmin } from "@/lib/layanan";
import { wajibSuperadmin } from "@/lib/sesi";

export const metadata: Metadata = { title: "Kelola Layanan" };
export const dynamic = "force-dynamic";

const kabar: Record<string, string> = {
  baru: "Layanan baru tersimpan — sudah tampil di halaman /layanan.",
  sunting: "Perubahan layanan tersimpan.",
  hapus: "Layanan dihapus.",
};

export default async function KelolaLayanan({
  searchParams,
}: {
  searchParams: Promise<{ tersimpan?: string; terhapus?: string; konfirmasi?: string }>;
}) {
  const { nama, peran } = await wajibSuperadmin();
  const { tersimpan, terhapus, konfirmasi } = await searchParams;

  const daftar = await daftarLayananAdmin();
  const pesan = terhapus ? kabar.hapus : tersimpan ? kabar[tersimpan] : undefined;

  return (
    <Kerangka peran={peran} nama={nama}>
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <div>
          <h1 className="font-serif text-xl font-semibold text-hutan md:text-2xl">Kelola Layanan</h1>
          <p className="mt-1 text-[12.5px] text-samar">
            {daftar.length} layanan · urutan menentukan susunan di halaman publik
          </p>
        </div>
        <span className="flex-1" />
        <Link
          href="/admin/layanan/baru"
          className="inline-flex min-h-11 items-center gap-2 rounded-[9px] bg-hutan px-4.5 py-2.5 text-[13.5px] font-bold text-krem hover:bg-daun"
        >
          <span className="text-base leading-none">+</span> Layanan Baru
        </Link>
      </div>

      {pesan && (
        <p
          role="status"
          className="mb-4 rounded-[10px] border border-emas-garis bg-emas-muda px-4 py-3 text-[13px] font-semibold text-emas-teks"
        >
          {pesan}
        </p>
      )}

      {daftar.length === 0 ? (
        <p className="rounded-xl border border-dashed border-garis-tebal bg-panel px-5 py-10 text-center text-sm text-redup">
          Belum ada layanan. Mulai dari tombol <strong>Layanan Baru</strong> di atas.
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {daftar.map((l) => {
            const mintaHapus = konfirmasi === l.id;

            return (
              <li key={l.id} className="rounded-xl border border-garis bg-kertas px-4 py-3.5 md:px-5">
                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
                  <span className="flex size-7 flex-none items-center justify-center rounded-full bg-panel text-[11.5px] font-extrabold text-samar">
                    {l.urutan}
                  </span>

                  <div className="min-w-48 flex-1">
                    <div className="text-[14px] font-semibold text-tinta">{l.namaLayanan}</div>
                    <div className="mt-0.5 text-[11.5px] text-samar">
                      {l.persyaratan.length} syarat · {l.estimasiWaktu} · {l.biaya}
                    </div>
                  </div>

                  <div className="flex flex-none items-center gap-2">
                    <Link
                      href={`/layanan/${l.slug}`}
                      className="rounded-lg border border-garis px-3 py-2 text-xs font-semibold text-tinta hover:border-daun hover:text-hutan"
                    >
                      Lihat
                    </Link>
                    <Link
                      href={`/admin/layanan/${l.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border-[1.5px] border-daun px-3 py-2 text-xs font-bold text-hutan hover:bg-[#EFE9D6]"
                    >
                      <Ikon nama="surat" ukuran={13} />
                      Sunting
                    </Link>
                    <Link
                      href={mintaHapus ? "/admin/layanan" : `/admin/layanan?konfirmasi=${l.id}`}
                      className="rounded-lg px-3 py-2 text-xs font-semibold text-redup hover:text-bata"
                    >
                      {mintaHapus ? "Batal" : "Hapus"}
                    </Link>
                  </div>
                </div>

                {mintaHapus && (
                  <form
                    action={hapusLayanan}
                    className="mt-3 flex flex-wrap items-center gap-3 rounded-[10px] border border-bata/35 bg-bata/10 px-4 py-3"
                  >
                    <input type="hidden" name="id" value={l.id} />
                    <span className="flex-1 text-[12.5px] leading-relaxed text-bata">
                      Hapus <strong>{l.namaLayanan}</strong>? Halaman{" "}
                      <code>/layanan/{l.slug}</code> akan menjadi 404.
                    </span>
                    <button
                      type="submit"
                      className="min-h-10 flex-none rounded-lg bg-bata px-4 py-2 text-xs font-bold text-krem hover:opacity-90"
                    >
                      Ya, hapus
                    </button>
                  </form>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Kerangka>
  );
}
