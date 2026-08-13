import type { Metadata } from "next";
import Link from "next/link";
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

const isian =
  "w-full rounded-[9px] border border-garis bg-krem px-3.5 py-2.5 text-[13.5px] text-tinta placeholder:text-samar focus:border-daun focus:outline-none";
const label = "mb-1.5 block text-[11px] font-bold tracking-[.08em] text-samar";

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
      <div className="mb-5">
        <h1 className="font-serif text-xl font-semibold text-hutan md:text-2xl">Akun & Pengguna</h1>
        <p className="mt-1 text-[12.5px] text-samar">
          {daftar.length} akun · {superadminAktif} superadmin aktif ·{" "}
          <Link href="/admin/sandi" className="font-semibold text-daun underline">
            ganti sandi saya
          </Link>
        </p>
      </div>

      {pesan && (
        <p
          role="status"
          className={`mb-4 rounded-[10px] px-4 py-3 text-[13px] font-semibold ${
            q.galat
              ? "border border-bata/35 bg-bata/10 text-bata"
              : "border border-emas-garis bg-emas-muda text-emas-teks"
          }`}
        >
          {pesan}
        </p>
      )}

      <div className="flex flex-col gap-2.5">
        {daftar.map((p) => {
          const sayaSendiri = p.id === saya.id;
          const setelUlang = q.sandi === p.id;

          return (
            <div key={p.id} className="rounded-xl border border-garis bg-kertas px-4 py-3.5 md:px-5">
              <form
  action={simpanPengguna}
  className="grid gap-4 lg:grid-cols-[2fr_2fr_180px] items-end"
>
                <input type="hidden" name="id" value={p.id} />

                <div className="min-w-44 flex-1">
                  <label className={label}>NAMA</label>
                  <input name="nama" defaultValue={p.nama} className={isian} />
                  <div className="mt-2 space-y-1 text-[11.5px] text-samar">
  <p>{p.email}</p>

  <p>
    Bergabung {tanggalPendekTahun(p.dibuatPada.toISOString())}
    {p._count.berita > 0 && ` • ${p._count.berita} berita`}
  </p>
</div>
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

                <button
                  type="submit"
                  className="min-h-11 rounded-lg border-[1.5px] border-daun px-3.5 py-2.5 text-xs font-bold text-hutan hover:bg-[#EFE9D6]"
                >
                  Simpan
                </button>
              </form>

              <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs">
                <Link
                  href={setelUlang ? "/admin/akun" : `/admin/akun?sandi=${p.id}`}
                  className="font-semibold text-redup hover:text-hutan"
                >
                  {setelUlang ? "Batal setel sandi" : "Setel ulang sandi"}
                </Link>

                {sayaSendiri ? (
                  <span className="text-samar">akun Anda sendiri — tidak bisa dihapus dari sini</span>
                ) : (
                  <form action={hapusPengguna}>
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      className="font-semibold text-redup hover:text-bata"
                      // Akun yang pernah menulis berita dinonaktifkan, bukan dihapus.
                      title={
                        p._count.berita > 0
                          ? "Akun ini pernah menulis berita — akan dinonaktifkan, bukan dihapus"
                          : "Hapus akun"
                      }
                    >
                      {p._count.berita > 0 ? "Nonaktifkan" : "Hapus"}
                    </button>
                  </form>
                )}
              </div>

              {setelUlang && (
                <form
                  action={setelSandi}
                  className="mt-3 flex flex-wrap items-end gap-3 rounded-[10px] border border-emas-garis bg-emas-muda px-4 py-3"
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
                  <button
                    type="submit"
                    className="min-h-11 rounded-lg bg-hutan px-4 py-2.5 text-xs font-bold text-krem hover:bg-daun"
                  >
                    Setel Sandi
                  </button>
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
        className="mt-6 rounded-xl border-[1.5px] border-dashed border-garis-tebal bg-panel px-4 py-4 md:px-5"
      >
        <h2 className="mb-3 font-serif text-[15px] font-semibold text-hutan">Tambah Akun Admin</h2>
        <div className="flex flex-wrap items-end gap-3">
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
          <button
            type="submit"
            className="inline-flex min-h-11 items-center gap-2 rounded-[9px] bg-hutan px-4.5 py-2.5 text-[13.5px] font-bold text-krem hover:bg-daun"
          >
            <span className="text-base leading-none">+</span> Tambah
          </button>
        </div>
      </form>
    </Kerangka>
  );
}
