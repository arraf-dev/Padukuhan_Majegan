import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { KopHalaman, isian, kartu, kartuPutus, label, tombol } from "@/components/primitif";
import { Button } from "@/components/ui/button";
import { Kerangka } from "@/app/admin/kerangka";
import { gantiSandi, hapusPengguna, setelSandi, simpanPengguna, tambahPengguna } from "@/app/admin/akun/aksi";
import { PANJANG_SANDI_MIN } from "@/lib/auth";
import { db } from "@/lib/db";
import { wajibMasuk } from "@/lib/sesi";
import { tanggalPendekTahun } from "@/lib/tanggal";

export const metadata: Metadata = { title: "Akun & Pengguna" };
export const dynamic = "force-dynamic";

const kabar: Record<string, string> = {
  "1": "Perubahan akun tersimpan.",
  sandi: "Sandi akun disetel ulang — sampaikan sandi barunya langsung ke orangnya.",
  "sandi-sendiri": "Sandi Anda berhasil diganti.",
  dinonaktifkan: "Akun dinonaktifkan, bukan dihapus — namanya masih tercatat sebagai penulis berita.",
  hapus: "Akun dihapus.",
  "galat-lengkapi": "Nama dan email wajib diisi.",
  "galat-panjang": "Nama atau jabatan terlalu panjang (maks. 100 karakter).",
  "galat-sandi-lama": "Sandi lama salah.",
  "galat-sandi-pendek": `Sandi minimal ${PANJANG_SANDI_MIN} karakter.`,
  "galat-tidak-cocok": "Ulangan sandi tidak sama dengan sandi baru.",
  "galat-email-dipakai": "Email itu sudah dipakai akun lain.",
  "galat-superadmin-terakhir": "Ditolak — ini superadmin aktif terakhir.",
  "galat-diri-sendiri": "Anda tidak bisa menonaktifkan atau menghapus akun Anda sendiri.",
};

export default async function KelolaAkun({
  searchParams,
}: {
  searchParams: Promise<{ tersimpan?: string; terhapus?: string; galat?: string; sandi?: string }>;
}) {
  const saya = await wajibMasuk();
  const q = await searchParams;
  const bisaKelola = saya.peran === "superadmin";
  const daftar = bisaKelola
    ? await db.pengguna.findMany({
        orderBy: [{ peran: "asc" }, { nama: "asc" }],
        select: { id: true, nama: true, email: true, jabatan: true, peran: true, aktif: true, dibuatPada: true, _count: { select: { berita: true } } },
      })
    : [];
  const pesan = q.terhapus ? kabar.hapus : q.galat ? kabar[`galat-${q.galat}`] : q.tersimpan ? kabar[q.tersimpan] : undefined;

  return (
    <Kerangka peran={saya.peran} nama={saya.nama}>
      <KopHalaman
        judul={bisaKelola ? "Akun & Pengguna" : "Akun Saya"}
        keterangan={bisaKelola ? `${daftar.length} akun terdaftar. Kelola pengguna dan keamanan dari satu halaman.` : "Kelola keamanan akun Anda dari halaman ini."}
      />

      {pesan && <p role="status" className={`mb-4 rounded-xl px-4 py-3 text-[13px] font-semibold ${q.galat ? "border border-bata/35 bg-bata/10 text-bata" : "border border-emas-garis bg-emas-muda text-emas-teks"}`}>{pesan}</p>}

      <section className={`${kartu()} mb-7 max-w-2xl px-4 py-4 md:px-5 lg:mb-9 lg:px-6 lg:py-5`}>
        <h2 className="font-serif text-base font-semibold text-hutan lg:text-[19px]">Keamanan Akun Saya</h2>
        <p className="mt-1 text-[12.5px] text-samar">Akun {saya.nama}. Gunakan sandi baru yang mudah diingat dan tidak dibagikan.</p>
        <form action={gantiSandi} className="mt-4 grid gap-3 md:grid-cols-3 md:items-end">
          <div><label className={label} htmlFor="lama">SANDI LAMA</label><input id="lama" name="lama" type="password" autoComplete="current-password" className={isian} /></div>
          <div><label className={label} htmlFor="baru">SANDI BARU</label><input id="baru" name="baru" type="password" autoComplete="new-password" placeholder={`minimal ${PANJANG_SANDI_MIN} karakter`} className={isian} /></div>
          <div><label className={label} htmlFor="ulangi">ULANGI SANDI</label><input id="ulangi" name="ulangi" type="password" autoComplete="new-password" className={isian} /></div>
          <button type="submit" className={`${tombol("primer")} min-h-11 md:col-span-3 md:justify-self-start`}>Ganti Sandi</button>
        </form>
      </section>

      {bisaKelola && <>
        <section>
          <h2 className="mb-1 font-serif text-base font-semibold text-hutan lg:text-[19px]">Daftar Pengguna</h2>
          <p className="mb-3 text-[12.5px] text-samar lg:mb-4">Edit peran, status aktif, atau setel ulang sandi akun perangkat.</p>
          <div className="flex flex-col gap-2.5 lg:gap-3">
            {daftar.length === 0 && <p className={kartuPutus}>Belum ada akun terdaftar.</p>}
            {daftar.map((p) => {
              const sayaSendiri = p.id === saya.id;
              const setelUlang = q.sandi === p.id;
              return <div key={p.id} className={`${kartu()} px-4 py-3.5 md:px-5 lg:px-6 lg:py-5`}>
                <form action={simpanPengguna} className="flex flex-wrap items-end gap-3"><input type="hidden" name="id" value={p.id} />
                  <div className="min-w-44 flex-1"><label className={label}>NAMA</label><input name="nama" defaultValue={p.nama} className={isian} /><p className="mt-1 truncate text-[11.5px] text-samar">{p.email} · bergabung {tanggalPendekTahun(p.dibuatPada.toISOString())}{p._count.berita > 0 && ` · ${p._count.berita} berita`}</p></div>
                  <div className="min-w-36 flex-1"><label className={label}>JABATAN</label><input name="jabatan" defaultValue={p.jabatan ?? ""} className={isian} /></div>
                  <div className="w-36"><label className={label} htmlFor={`peran-${p.id}`}>PERAN</label><select id={`peran-${p.id}`} name="peran" defaultValue={p.peran} className={isian}><option value="admin">Admin</option><option value="superadmin">Superadmin</option></select></div>
                  <label className="flex min-h-11 items-center gap-2.5 text-[13px] text-tinta"><input type="checkbox" name="aktif" defaultChecked={p.aktif} className="size-4 accent-hutan" />Aktif</label>
                  <Button type="submit" variant="outline" className="min-h-11 border-daun">Simpan</Button>
                </form>
                <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs"><Link href={setelUlang ? "/admin/akun" : `/admin/akun?sandi=${p.id}`} className="font-semibold text-redup hover:text-hutan">{setelUlang ? "Batal setel sandi" : "Setel ulang sandi"}</Link>{sayaSendiri ? <span className="text-samar">akun Anda sendiri</span> : <form action={hapusPengguna}><input type="hidden" name="id" value={p.id} /><Button type="submit" variant="ghost" className="min-h-11 px-2">{p._count.berita > 0 ? "Nonaktifkan" : "Hapus"}</Button></form>}</div>
                {setelUlang && <form action={setelSandi} className="mt-3 flex flex-wrap items-end gap-3 rounded-xl border border-emas-garis bg-emas-muda px-4 py-3"><input type="hidden" name="id" value={p.id} /><div className="min-w-52 flex-1"><label className={label} htmlFor={`sandi-${p.id}`}>SANDI BARU UNTUK {p.nama.toUpperCase()}</label><input id={`sandi-${p.id}`} name="sandi" type="password" autoComplete="new-password" placeholder={`minimal ${PANJANG_SANDI_MIN} karakter`} className={isian} /></div><Button type="submit" className="min-h-11">Setel Sandi</Button></form>}
              </div>;
            })}
          </div>
        </section>
        <form action={tambahPengguna} className="mt-6 rounded-xl border border-dashed border-garis-tebal bg-panel px-4 py-4 md:px-5 lg:mt-8 lg:rounded-2xl lg:px-6 lg:py-6">
          <h2 className="mb-3 font-serif text-base font-semibold text-hutan lg:mb-4 lg:text-[19px]">Tambah Akun Admin</h2>
          <div className="flex flex-wrap items-end gap-3 lg:gap-4"><div className="min-w-40 flex-1"><label className={label} htmlFor="nama-baru">NAMA</label><input id="nama-baru" name="nama" className={isian} /></div><div className="min-w-48 flex-1"><label className={label} htmlFor="email-baru">EMAIL</label><input id="email-baru" name="email" type="email" className={isian} /></div><div className="min-w-36 flex-1"><label className={label} htmlFor="jabatan-baru">JABATAN</label><input id="jabatan-baru" name="jabatan" className={isian} /></div><div className="w-36"><label className={label} htmlFor="peran-baru">PERAN</label><select id="peran-baru" name="peran" defaultValue="admin" className={isian}><option value="admin">Admin</option><option value="superadmin">Superadmin</option></select></div><div className="min-w-48 flex-1"><label className={label} htmlFor="sandi-baru">SANDI AWAL</label><input id="sandi-baru" name="sandi" type="password" autoComplete="new-password" className={isian} /></div><Button type="submit" className="group min-h-11">Tambah <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></Button></div>
        </form>
      </>}
    </Kerangka>
  );
}
