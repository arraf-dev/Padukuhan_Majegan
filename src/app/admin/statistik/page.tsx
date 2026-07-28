import type { Metadata } from "next";
import Link from "next/link";
import { Kerangka } from "@/app/admin/kerangka";
import { hapusStatistik, simpanStatistik } from "@/app/admin/statistik/aksi";
import { wajibSuperadmin } from "@/lib/sesi";
import { daftarStatistik, TAHUN_DATA, tahunTersedia } from "@/lib/statistik";

export const metadata: Metadata = { title: "Statistik Penduduk" };
export const dynamic = "force-dynamic";

const kabar: Record<string, string> = {
  tersimpan: "Angka tersimpan — halaman /statistik dan beranda sudah diperbarui.",
  hapus: "Baris dihapus.",
  "galat-label": "Label tidak boleh kosong.",
  "galat-persen": "Persentase kelompok usia harus antara 0 dan 100.",
  "galat-negatif": "Nilai tidak boleh negatif.",
};

const isian =
  "w-full rounded-[9px] border border-garis bg-krem px-3.5 py-2.5 text-[13.5px] text-tinta placeholder:text-samar focus:border-daun focus:outline-none";
const label = "mb-1.5 block text-[11px] font-bold tracking-[.08em] text-samar";

/**
 * ponytail: hanya `ringkasan` & `usia` yang dilayani form ini. Enum
 * `KategoriStatistik` juga punya jenis_kelamin/pekerjaan/pendidikan, tapi tidak
 * satu pun ditampilkan di halaman publik — isian untuk data yang tidak pernah
 * tampil hanya membuang waktu admin.
 */
const KATEGORI = [
  {
    nilai: "ringkasan" as const,
    judul: "Angka Ringkasan",
    keterangan: "Tampil sebagai kartu angka di beranda dan halaman Statistik.",
    satuan: "jumlah",
    contohLabel: "jiwa penduduk",
  },
  {
    nilai: "usia" as const,
    judul: "Kelompok Usia",
    keterangan: "Tinggi batang grafik. Isi persentase 0–100, bukan jumlah jiwa.",
    satuan: "persen (0–100)",
    contohLabel: "0–14",
  },
];

export default async function KelolaStatistik({
  searchParams,
}: {
  searchParams: Promise<{ tahun?: string; tersimpan?: string; terhapus?: string; galat?: string }>;
}) {
  const { nama, peran } = await wajibSuperadmin();
  const q = await searchParams;

  const diminta = Number.parseInt(q.tahun ?? "", 10);
  const tahun = Number.isFinite(diminta) ? diminta : TAHUN_DATA;

  const [baris, tahunAda] = await Promise.all([daftarStatistik(tahun), tahunTersedia()]);
  const pesan = q.terhapus
    ? kabar.hapus
    : q.galat
      ? kabar[`galat-${q.galat}`]
      : q.tersimpan
        ? kabar.tersimpan
        : undefined;

  return (
    <Kerangka peran={peran} nama={nama}>
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <div>
          <h1 className="font-serif text-xl font-semibold text-hutan md:text-2xl">
            Statistik Penduduk
          </h1>
          <p className="mt-1 text-[12.5px] text-samar">
            Data tahun {tahun} · tampil di beranda dan{" "}
            <Link href="/statistik" className="font-semibold text-daun underline">
              /statistik
            </Link>
          </p>
        </div>
        <span className="flex-1" />
        <div className="flex flex-wrap items-center gap-2">
          {tahunAda.map((t) => (
            <Link
              key={t}
              href={`/admin/statistik?tahun=${t}`}
              aria-current={t === tahun ? "page" : undefined}
              className={`min-h-11 rounded-[9px] px-4 py-2.5 text-[13px] font-bold ${
                t === tahun ? "bg-hutan text-krem" : "border border-garis text-tinta hover:border-daun"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>
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

      {KATEGORI.map((k) => {
        const isi = baris.filter((b) => b.kategori === k.nilai);

        return (
          <section key={k.nilai} className="mb-9">
            <h2 className="font-serif text-[17px] font-semibold text-hutan">{k.judul}</h2>
            <p className="mt-0.5 mb-3 text-[12.5px] text-samar">{k.keterangan}</p>

            <div className="flex flex-col gap-2.5">
              {isi.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-wrap items-end gap-3 rounded-xl border border-garis bg-kertas px-4 py-3.5 md:px-5"
                >
                  {/* Label jadi bagian kunci unik, jadi disunting = baris baru.
                      Ditampilkan mati supaya tidak ada duplikat tak disengaja. */}
                  <div className="min-w-40 flex-1">
                    <span className={label}>LABEL</span>
                    <div className="py-2.5 text-[13.5px] font-semibold text-tinta">{b.label}</div>
                  </div>

                  <form action={simpanStatistik} className="flex flex-wrap items-end gap-3">
                    <input type="hidden" name="tahun" value={tahun} />
                    <input type="hidden" name="kategori" value={k.nilai} />
                    <input type="hidden" name="label" value={b.label} />

                    <div className="w-32">
                      <label className={label} htmlFor={`nilai-${b.id}`}>
                        {k.satuan.toUpperCase()}
                      </label>
                      <input
                        id={`nilai-${b.id}`}
                        name="nilai"
                        type="number"
                        defaultValue={b.nilai}
                        className={isian}
                      />
                    </div>
                    <div className="w-20">
                      <label className={label} htmlFor={`urutan-${b.id}`}>
                        URUTAN
                      </label>
                      <input
                        id={`urutan-${b.id}`}
                        name="urutan"
                        type="number"
                        defaultValue={b.urutan}
                        className={isian}
                      />
                    </div>
                    <button
                      type="submit"
                      className="min-h-11 rounded-lg border-[1.5px] border-daun px-3.5 py-2.5 text-xs font-bold text-hutan hover:bg-[#EFE9D6]"
                    >
                      Simpan
                    </button>
                  </form>

                  <form action={hapusStatistik}>
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="tahun" value={tahun} />
                    <button
                      type="submit"
                      className="min-h-11 rounded-lg px-3 py-2.5 text-xs font-semibold text-redup hover:text-bata"
                    >
                      Hapus
                    </button>
                  </form>
                </div>
              ))}
            </div>

            <form
              action={simpanStatistik}
              className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border-[1.5px] border-dashed border-garis-tebal bg-panel px-4 py-4 md:px-5"
            >
              <input type="hidden" name="tahun" value={tahun} />
              <input type="hidden" name="kategori" value={k.nilai} />

              <div className="min-w-40 flex-1">
                <label className={label} htmlFor={`label-baru-${k.nilai}`}>
                  LABEL BARU
                </label>
                <input
                  id={`label-baru-${k.nilai}`}
                  name="label"
                  placeholder={k.contohLabel}
                  className={isian}
                />
              </div>
              <div className="w-32">
                <label className={label} htmlFor={`nilai-baru-${k.nilai}`}>
                  {k.satuan.toUpperCase()}
                </label>
                <input
                  id={`nilai-baru-${k.nilai}`}
                  name="nilai"
                  type="number"
                  defaultValue={0}
                  className={isian}
                />
              </div>
              <div className="w-20">
                <label className={label} htmlFor={`urutan-baru-${k.nilai}`}>
                  URUTAN
                </label>
                <input
                  id={`urutan-baru-${k.nilai}`}
                  name="urutan"
                  type="number"
                  defaultValue={isi.length}
                  className={isian}
                />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center gap-2 rounded-[9px] bg-hutan px-4.5 py-2.5 text-[13.5px] font-bold text-krem hover:bg-daun"
              >
                <span className="text-base leading-none">+</span> Tambah
              </button>
            </form>
          </section>
        );
      })}
    </Kerangka>
  );
}
