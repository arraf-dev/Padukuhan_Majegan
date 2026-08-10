import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { KopHalaman, isian, kartu, kartuPutus, label } from "@/components/primitif";
import { Button } from "@/components/ui/button";
import { Kerangka } from "@/app/admin/kerangka";
import { hapusPengguna, setelSandi, simpanPengguna, tambahPengguna } from "@/app/admin/akun/aksi";
import { PANJANG_SANDI_MIN } from "@/lib/auth";
import { db } from "@/lib/db";
import { wajibSuperadmin } from "@/lib/sesi";
import { tanggalPendekTahun } from "@/lib/tanggal";

export const metadata: Metadata = { title: "Akun & Pengguna" };
export const dynamic = "force-dynamic";

const kabar: Record<string, string> = {
  "1": "Perubahan akun tersimpan.",
  sandi: "Sandi akun disetel ulang — sampaikan sandi barunya langsung ke orangnya.",
  dinonaktifkan: "Akun dinonaktifkan, bukan dihapus — namanya masih tercatat sebagai penulis berita.",
  hapus: "Akun dihapus.",
  "galat-lengkapi": "Nama dan email wajib diisi.",
  "galat-sandi-pendek": `Sandi minimal ${PANJANG_SANDI_MIN} karakter.`,
  "galat-email-dipakai": "Email itu sudah dipakai akun lain.",
  "galat-superadmin-terakhir":
    "Ditolak — ini superadmin aktif terakhir. Kalau diturunkan, tidak ada lagi yang bisa mengelola akun.",
  "galat-diri-sendiri": "Anda tidak bisa menonaktifkan atau menghapus akun Anda sendiri.",
};


export default async function KelolaAkun({
  searchParams,
}: {
  searchParams: Promise<{ tersimpan?: string; terhapus?: string; galat?: string; sandi?: string }>;
}) {
  const saya = await wajibSuperadmin();
  const q = await searchParams;

  const daftar = await db.pengguna.findMany({
    orderBy: [{ peran: "asc" }, { nama: "asc" }],
    select: {
      id: true,
      nama: true,
      email: true,
      jabatan: true,
      peran: true,
      aktif: true,
      dibuatPada: true,
      _count: { select: { berita: true } },
    },
  });

  const superadminAktif = daftar.filter((p) => p.peran === "superadmin" && p.aktif).length;
  const pesan = q.terhapus
    ? kabar.hapus
    : q.galat
      ? kabar[`galat-${q.galat}`]
      : q.tersimpan
        ? kabar[q.tersimpan]
        : undefined;

  return (
    <Kerangka peran={saya.peran} nama={saya.nama}>
      <KopHalaman
        judul="Akun & Pengguna"
        keterangan={
          <>
            {daftar.length} akun · {superadminAktif} superadmin aktif ·{" "}
            <Link
              href="/admin/sandi"
              className="font-semibold text-daun underline transition-colors duration-200 ease-out hover:text-hutan"
            >
              ganti sandi saya
            </Link>
          </>
        }
      />

      {pesan && (
        <p
          role="status"
          className={`mb-4 rounded-xl px-4 py-3 text-[13px] font-semibold ${
            q.galat
              ? "border border-bata/35 bg-bata/10 text-bata"
              : "border border-emas-garis bg-emas-muda text-emas-teks"
          }`}
        >
          {pesan}
        </p>
      )}

      <div className="flex flex-col gap-2.5 lg:gap-3">
        {daftar.length === 0 && (
          <p className={kartuPutus}>
            Belum ada akun terdaftar. Tambahkan lewat borang <strong>Tambah Akun Admin</strong> di
            bawah.
          </p>
        )}
        {daftar.map((p) => {
          const sayaSendiri = p.id === saya.id;
          const setelUlang = q.sandi === p.id;

          return (
            <div key={p.id} className={`${kartu()} px-4 py-3.5 md:px-5 lg:px-6 lg:py-5`}>
              <form action={simpanPengguna} className="flex flex-wrap items-end gap-3">
                <input type="hidden" name="id" value={p.id} />

                <div className="min-w-44 flex-1">
                  <label className={label}>NAMA</label>
                  <input name="nama" defaultValue={p.nama} className={isian} />
                  <p className="mt-1 truncate text-[11.5px] text-samar">
                    {p.email} · bergabung {tanggalPendekTahun(p.dibuatPada.toISOString())}
                    {p._count.berita > 0 && ` · ${p._count.berita} berita`}
                  </p>
                </div>

                <div className="min-w-36 flex-1">
                  <label className={label}>JABATAN · opsional</label>
                  <input name="jabatan" defaultValue={p.jabatan ?? ""} className={isian} />
                </div>

                <div className="w-36">
                  <label className={label} htmlFor={`peran-${p.id}`}>
                    PERAN
                  </label>
                  <select id={`peran-${p.id}`} name="peran" defaultValue={p.peran} className={isian}>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>

                <label className="flex min-h-11 items-center gap-2.5 text-[13px] text-tinta">
                  <input
                    type="checkbox"
                    name="aktif"
                    defaultChecked={p.aktif}
                    className="size-4 accent-hutan"
                  />
                  Aktif
                </label>

                <Button type="submit" variant="outline" className="min-h-11 border-daun">
                  Simpan
                </Button>
              </form>

              <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs">
                <Link
                  href={setelUlang ? "/admin/akun" : `/admin/akun?sandi=${p.id}`}
                  className="font-semibold text-redup transition-colors duration-200 ease-out hover:text-hutan"
                >
                  {setelUlang ? "Batal setel sandi" : "Setel ulang sandi"}
                </Link>

                {sayaSendiri ? (
                  <span className="text-samar">akun Anda sendiri — tidak bisa dihapus dari sini</span>
                ) : (
                  <form action={hapusPengguna}>
                    <input type="hidden" name="id" value={p.id} />
                    <Button
                      type="submit"
                      variant="ghost"
                      className="min-h-11 px-2"
                      // Akun yang pernah menulis berita dinonaktifkan, bukan dihapus.
                      title={
                        p._count.berita > 0
                          ? "Akun ini pernah menulis berita — akan dinonaktifkan, bukan dihapus"
                          : "Hapus akun"
                      }
                    >
                      {p._count.berita > 0 ? "Nonaktifkan" : "Hapus"}
                    </Button>
                  </form>
                )}
              </div>

              {setelUlang && (
                <form
                  action={setelSandi}
                  className="mt-3 flex flex-wrap items-end gap-3 rounded-xl border border-emas-garis bg-emas-muda px-4 py-3"
                >
                  <input type="hidden" name="id" value={p.id} />
                  <div className="min-w-52 flex-1">
                    <label className={label} htmlFor={`sandi-${p.id}`}>
                      SANDI BARU UNTUK {p.nama.toUpperCase()}
                    </label>
                    <input
                      id={`sandi-${p.id}`}
                      name="sandi"
                      type="text"
                      autoComplete="off"
                      placeholder={`minimal ${PANJANG_SANDI_MIN} karakter`}
                      className={isian}
                    />
                  </div>
                  <Button type="submit" className="min-h-11">
                    Setel Sandi
                  </Button>
                  <p className="w-full text-[11.5px] text-emas-teks">
                    Sandi tampil terbaca supaya bisa langsung dicatat dan disampaikan — mintalah
                    yang bersangkutan menggantinya sendiri setelah berhasil masuk.
                  </p>
                </form>
              )}
            </div>
          );
        })}
      </div>

      {/* ---------- Tambah akun ---------- */}
      <form
        action={tambahPengguna}
        className="mt-6 rounded-xl border border-dashed border-garis-tebal bg-panel px-4 py-4 md:px-5 lg:mt-8 lg:rounded-2xl lg:px-6 lg:py-6"
      >
        <h2 className="mb-3 font-serif text-base font-semibold text-hutan lg:mb-4 lg:text-[19px]">Tambah Akun Admin</h2>
        <div className="flex flex-wrap items-end gap-3 lg:gap-4">
          <div className="min-w-40 flex-1">
            <label className={label} htmlFor="nama-baru">
              NAMA
            </label>
            <input id="nama-baru" name="nama" placeholder="Rina Putri" className={isian} />
          </div>
          <div className="min-w-48 flex-1">
            <label className={label} htmlFor="email-baru">
              EMAIL
            </label>
            <input
              id="email-baru"
              name="email"
              type="email"
              placeholder="nama@pandowoharjo.desa.id"
              className={isian}
            />
          </div>
          <div className="min-w-36 flex-1">
            <label className={label} htmlFor="jabatan-baru">
              JABATAN · opsional
            </label>
            <input id="jabatan-baru" name="jabatan" placeholder="Karang Taruna" className={isian} />
          </div>
          <div className="w-36">
            <label className={label} htmlFor="peran-baru">
              PERAN
            </label>
            <select id="peran-baru" name="peran" defaultValue="admin" className={isian}>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          <div className="min-w-48 flex-1">
            <label className={label} htmlFor="sandi-baru">
              SANDI AWAL
            </label>
            <input
              id="sandi-baru"
              name="sandi"
              type="text"
              autoComplete="off"
              placeholder={`minimal ${PANJANG_SANDI_MIN} karakter`}
              className={isian}
            />
          </div>
          <Button type="submit" className="group min-h-11">
            Tambah
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </form>
    </Kerangka>
  );
}
