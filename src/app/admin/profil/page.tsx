import type { Metadata } from "next";
import Link from "next/link";
import { KopHalaman, isian, kartu, kartuPutus, label, tombol } from "@/components/primitif";
import { IsianBerkas } from "@/components/isian-berkas";
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
  "galat-berkas": "Foto harus berformat JPG, PNG, atau WEBP dengan ukuran maksimal 4 MB.",
};

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
      <KopHalaman
        judul="Profil & Struktur"
        keterangan={
          <>
            Naskah profil dan daftar perangkat dusun · tampil di halaman{" "}
            <Link
              href="/profil"
              className="font-semibold text-daun underline-offset-2 transition-colors duration-200 ease-out hover:text-hutan hover:underline"
            >
              /profil
            </Link>
          </>
        }
      />

      <nav aria-label="Bagian profil" className="mb-5 flex gap-2 overflow-x-auto pb-1 lg:mb-7">
        <a href="#naskah" className="min-h-11 rounded-full border border-garis bg-kertas px-4 py-2.5 text-[13px] font-bold text-hutan hover:border-daun hover:bg-emas-lembut">Profil Padukuhan</a>
        <a href="#struktur" className="min-h-11 rounded-full border border-garis bg-kertas px-4 py-2.5 text-[13px] font-bold text-hutan hover:border-daun hover:bg-emas-lembut">Struktur Perangkat</a>
      </nav>

      {pesan && (
        <p
          role="status"
          className={`mb-4 rounded-xl px-4 py-3 text-[13px] font-semibold ${
            galat
              ? "border border-bata/35 bg-bata/10 text-bata"
              : "border border-emas-garis bg-emas-muda text-emas-teks"
          }`}
        >
          {pesan}
        </p>
      )}

      {/* ---------- Naskah ---------- */}
      <section id="naskah" className="mb-9 scroll-mt-20 lg:mb-12">
        <h2 className="mb-3 font-serif text-base font-semibold text-hutan lg:mb-4 lg:text-[19px]">Naskah</h2>
        {/* Dua naskah berdampingan mulai xl — keduanya blok teks pendek,
            bertumpuk di layar lebar hanya memaksa gulir tanpa alasan. */}
        <div className="flex flex-col gap-4 xl:grid xl:grid-cols-2 xl:items-start xl:gap-5">
          {barisNaskah.map((n) => (
            <form
              key={n.slug}
              action={simpanNaskah}
              className={`${kartu()} px-4 py-4 md:px-5 lg:px-6 lg:py-5`}
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
                <button type="submit" className={`${tombol("primer")} min-h-11`}>
                  Simpan Naskah
                </button>
              </div>
            </form>
          ))}
        </div>
      </section>

      {/* ---------- Struktur organisasi ---------- */}
      <section id="struktur" className="scroll-mt-20">
        <h2 className="mb-1 font-serif text-base font-semibold text-hutan lg:text-[19px]">Struktur Organisasi</h2>
        <p className="mb-3 text-[12.5px] text-samar lg:mb-4 lg:text-[13.5px]">
          {perangkat.length} orang · urutan terkecil tampil sebagai Dukuh di kartu paling atas
        </p>

        {/* Tanpa cabang ini, struktur kosong hanya menyisakan borang tambah tanpa keterangan. */}
        {perangkat.length === 0 && (
          <p className={kartuPutus}>
            Belum ada perangkat terdaftar. Isi borang di bawah untuk menambah orang pertama.
          </p>
        )}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 lg:gap-4">
          {perangkat.map((p, i) => {
            const mintaHapus = konfirmasi === p.id;

            return (
              <div key={p.id} className={`${kartu()} px-4 py-4 md:px-5 lg:px-5 lg:py-5`}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="foto size-10 rounded-full border border-emas" />
                  <div className="min-w-0"><div className="truncate text-[13.5px] font-bold text-tinta">{p.nama}</div><div className="truncate text-[11.5px] text-emas-tua">{p.jabatan}</div></div>
                </div>
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
                  <div className="min-w-56 flex-1">
                    <span className={label}>FOTO · opsional</span>
                    <input type="hidden" name="fotoUrl" value={p.fotoUrl ?? ""} />
                    <IsianBerkas name="fotoBerkas" awal={p.fotoUrl ?? undefined} />
                  </div>

                  <div className="flex flex-none items-center gap-2">
                    <button
                      type="submit"
                      className={`${tombol("sekunder", "kecil")} min-h-11 border-daun`}
                    >
                      Simpan
                    </button>
                    <Link
                      href={mintaHapus ? "/admin/profil" : `/admin/profil?konfirmasi=${p.id}`}
                      className="rounded-[10px] px-3 py-2.5 text-xs font-semibold text-redup transition-colors duration-200 ease-out hover:text-bata"
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
                    className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-bata/35 bg-bata/10 px-4 py-3"
                  >
                    <input type="hidden" name="id" value={p.id} />
                    <span className="flex-1 text-[12.5px] leading-relaxed text-bata">
                      Hapus <strong>{p.nama}</strong> dari struktur organisasi?
                    </span>
                    <button
                      type="submit"
                      className="min-h-10 flex-none rounded-[10px] bg-bata px-4 py-2 text-xs font-bold text-krem transition-opacity duration-200 ease-out hover:opacity-90"
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
          className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-garis-tebal bg-panel px-4 py-4 md:px-5 lg:mt-5 lg:gap-4 lg:rounded-2xl lg:px-6 lg:py-5"
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
          <div className="min-w-56 flex-1">
            <span className={label}>FOTO · opsional</span>
            <IsianBerkas name="fotoBerkas" />
          </div>
          <button type="submit" className={`${tombol("primer")} min-h-11`}>
            <span className="text-base leading-none">+</span> Tambah
          </button>
        </form>
      </section>
    </Kerangka>
  );
}
