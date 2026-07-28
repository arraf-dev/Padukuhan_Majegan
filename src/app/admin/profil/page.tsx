import type { Metadata } from "next";
import Link from "next/link";
import { Kerangka } from "@/app/admin/kerangka";
import { hapusPerangkat, simpanNaskah, simpanPerangkat } from "@/app/admin/profil/aksi";
import { daftarPerangkat, naskahProfil } from "@/lib/profil";
import { wajibSuperadmin } from "@/lib/sesi";

export const metadata: Metadata = { title: "Profil & Struktur" };
export const dynamic = "force-dynamic";

const kabar: Record<string, string> = {
  naskah: "Naskah profil tersimpan — halaman /profil sudah diperbarui.",
  perangkat: "Data perangkat tersimpan.",
  "perangkat-baru": "Perangkat baru ditambahkan ke struktur organisasi.",
  hapus: "Perangkat dihapus dari struktur organisasi.",
  "galat-naskah": "Judul dan isi naskah tidak boleh kosong.",
  "galat-perangkat": "Nama dan jabatan wajib diisi.",
};

const isian =
  "w-full rounded-[9px] border border-garis bg-krem px-3.5 py-2.5 text-[13.5px] text-tinta placeholder:text-samar focus:border-daun focus:outline-none";
const label = "mb-1.5 block text-[11px] font-bold tracking-[.08em] text-samar";
const tombol =
  "inline-flex min-h-11 items-center gap-2 rounded-[9px] bg-hutan px-4.5 py-2.5 text-[13.5px] font-bold text-krem hover:bg-daun";

/** Naskah yang wajib ada; ditampilkan meski barisnya belum pernah dibuat. */
const NASKAH_BAKU = [
  { slug: "sejarah", judul: "Sejarah Padukuhan" },
  { slug: "visi-misi", judul: "Visi & Misi" },
];

export default async function KelolaProfil({
  searchParams,
}: {
  searchParams: Promise<{ tersimpan?: string; terhapus?: string; galat?: string; konfirmasi?: string }>;
}) {
  const { nama, peran } = await wajibSuperadmin();
  const { tersimpan, terhapus, galat, konfirmasi } = await searchParams;

  const [naskah, perangkat] = await Promise.all([naskahProfil(), daftarPerangkat()]);

  // Baris yang belum ada di DB tetap muncul sebagai form kosong — kalau tidak,
  // naskah yang terlanjur dihapus tidak akan pernah bisa dibuat lagi dari panel.
  const barisNaskah = NASKAH_BAKU.map((b) => ({
    ...b,
    ...(naskah.find((n) => n.slug === b.slug) ?? { konten: "", draft: true }),
  }));

  const pesan = terhapus ? kabar.hapus : galat ? kabar[`galat-${galat}`] : tersimpan ? kabar[tersimpan] : undefined;

  return (
    <Kerangka peran={peran} nama={nama}>
      <div className="mb-5">
        <h1 className="font-serif text-xl font-semibold text-hutan md:text-2xl">Profil & Struktur</h1>
        <p className="mt-1 text-[12.5px] text-samar">
          Naskah profil dan daftar perangkat dusun · tampil di halaman{" "}
          <Link href="/profil" className="font-semibold text-daun underline">
            /profil
          </Link>
        </p>
      </div>

      {pesan && (
        <p
          role="status"
          className={`mb-4 rounded-[10px] px-4 py-3 text-[13px] font-semibold ${
            galat
              ? "border border-bata/35 bg-bata/10 text-bata"
              : "border border-emas-garis bg-emas-muda text-emas-teks"
          }`}
        >
          {pesan}
        </p>
      )}

      {/* ---------- Naskah ---------- */}
      <section className="mb-9">
        <h2 className="mb-3 font-serif text-[17px] font-semibold text-hutan">Naskah</h2>
        <div className="flex flex-col gap-4">
          {barisNaskah.map((n) => (
            <form
              key={n.slug}
              action={simpanNaskah}
              className="rounded-xl border border-garis bg-kertas px-4 py-4 md:px-5"
            >
              <input type="hidden" name="slug" value={n.slug} />

              <div className="mb-3">
                <label className={label} htmlFor={`judul-${n.slug}`}>
                  JUDUL
                </label>
                <input id={`judul-${n.slug}`} name="judul" defaultValue={n.judul} className={isian} />
              </div>

              <div className="mb-3">
                <label className={label} htmlFor={`konten-${n.slug}`}>
                  ISI · pisahkan paragraf dengan satu baris kosong
                  {n.slug === "visi-misi" && " · blok pertama = visi, blok berikutnya = butir misi"}
                </label>
                <textarea
                  id={`konten-${n.slug}`}
                  name="konten"
                  rows={n.slug === "visi-misi" ? 7 : 9}
                  defaultValue={n.konten}
                  className={`${isian} leading-relaxed`}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2.5 text-[13px] text-tinta">
                  <input
                    type="checkbox"
                    name="draft"
                    defaultChecked={n.draft}
                    className="size-4 accent-hutan"
                  />
                  Tandai <strong>Draft</strong> — warga melihat label DRAFT
                </label>
                <span className="flex-1" />
                <button type="submit" className={tombol}>
                  Simpan Naskah
                </button>
              </div>
            </form>
          ))}
        </div>
      </section>

      {/* ---------- Struktur organisasi ---------- */}
      <section>
        <h2 className="mb-1 font-serif text-[17px] font-semibold text-hutan">Struktur Organisasi</h2>
        <p className="mb-3 text-[12.5px] text-samar">
          {perangkat.length} orang · urutan terkecil tampil sebagai Dukuh di kartu paling atas
        </p>

        <div className="flex flex-col gap-2.5">
          {perangkat.map((p, i) => {
            const mintaHapus = konfirmasi === p.id;

            return (
              <div key={p.id} className="rounded-xl border border-garis bg-kertas px-4 py-3.5 md:px-5">
                <form action={simpanPerangkat} className="flex flex-wrap items-end gap-3">
                  <input type="hidden" name="id" value={p.id} />

                  <div className="min-w-40 flex-1">
                    <label className={label}>NAMA</label>
                    <input name="nama" defaultValue={p.nama} className={isian} />
                  </div>
                  <div className="min-w-40 flex-1">
                    <label className={label}>JABATAN</label>
                    <input name="jabatan" defaultValue={p.jabatan} className={isian} />
                  </div>
                  <div className="w-20">
                    <label className={label}>URUTAN</label>
                    <input
                      name="urutan"
                      type="number"
                      defaultValue={p.urutan}
                      className={isian}
                      aria-label={`Urutan ${p.nama}`}
                    />
                  </div>
                  <div className="min-w-48 flex-1">
                    <label className={label}>TAUTAN FOTO · opsional</label>
                    <input
                      name="fotoUrl"
                      defaultValue={p.fotoUrl ?? ""}
                      placeholder="https://…"
                      className={isian}
                    />
                  </div>

                  <div className="flex flex-none items-center gap-2">
                    <button
                      type="submit"
                      className="min-h-11 rounded-lg border-[1.5px] border-daun px-3.5 py-2.5 text-xs font-bold text-hutan hover:bg-[#EFE9D6]"
                    >
                      Simpan
                    </button>
                    <Link
                      href={mintaHapus ? "/admin/profil" : `/admin/profil?konfirmasi=${p.id}`}
                      className="rounded-lg px-3 py-2.5 text-xs font-semibold text-redup hover:text-bata"
                    >
                      {mintaHapus ? "Batal" : "Hapus"}
                    </Link>
                  </div>
                </form>

                {i === 0 && (
                  <p className="mt-2 text-[11.5px] text-samar">
                    Urutan terkecil — tampil sebagai kartu Dukuh di halaman publik.
                  </p>
                )}

                {mintaHapus && (
                  <form
                    action={hapusPerangkat}
                    className="mt-3 flex flex-wrap items-center gap-3 rounded-[10px] border border-bata/35 bg-bata/10 px-4 py-3"
                  >
                    <input type="hidden" name="id" value={p.id} />
                    <span className="flex-1 text-[12.5px] leading-relaxed text-bata">
                      Hapus <strong>{p.nama}</strong> dari struktur organisasi?
                    </span>
                    <button
                      type="submit"
                      className="min-h-10 flex-none rounded-lg bg-bata px-4 py-2 text-xs font-bold text-krem hover:opacity-90"
                    >
                      Ya, hapus
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>

        {/* Form kosong untuk menambah — selalu di bawah daftar. */}
        <form
          action={simpanPerangkat}
          className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border-[1.5px] border-dashed border-garis-tebal bg-panel px-4 py-4 md:px-5"
        >
          <div className="min-w-40 flex-1">
            <label className={label} htmlFor="nama-baru">
              NAMA
            </label>
            <input id="nama-baru" name="nama" placeholder="Nama perangkat" className={isian} />
          </div>
          <div className="min-w-40 flex-1">
            <label className={label} htmlFor="jabatan-baru">
              JABATAN
            </label>
            <input id="jabatan-baru" name="jabatan" placeholder="Ketua RT 09" className={isian} />
          </div>
          <div className="w-20">
            <label className={label} htmlFor="urutan-baru">
              URUTAN
            </label>
            <input
              id="urutan-baru"
              name="urutan"
              type="number"
              defaultValue={perangkat.length}
              className={isian}
            />
          </div>
          <button type="submit" className={tombol}>
            <span className="text-base leading-none">+</span> Tambah
          </button>
        </form>
      </section>
    </Kerangka>
  );
}
