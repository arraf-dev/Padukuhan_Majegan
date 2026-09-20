import { expect, test } from "@playwright/test";
import { paksaMasuk, perlu } from "./helpers";

const judul = "Posyandu Lansia Padukuhan Majegan";
const altPemeriksaan =
  "Kader Posyandu Lansia mendampingi pemeriksaan kesehatan warga lanjut usia di Padukuhan Majegan.";
const altPendampingan =
  "Pendampingan pemeriksaan kesehatan dasar bagi warga lanjut usia dalam Posyandu Lansia Padukuhan Majegan.";

test("berita Posyandu Lansia menampilkan dokumentasi dan keterangan", async ({ page }) => {
  await page.goto("/berita/posyandu-lansia-padukuhan-majegan");
  await expect(page.getByRole("heading", { name: judul })).toBeVisible();
  await expect(page.getByText("KEGIATAN", { exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: altPemeriksaan })).toBeVisible();
  await expect(page.getByRole("img", { name: altPendampingan })).toBeVisible();
  await expect(page.getByText("Pemeriksaan kesehatan dasar untuk warga lanjut usia.")).toBeVisible();
  await expect(page.getByText("Pendampingan kader selama kegiatan Posyandu Lansia.")).toBeVisible();
});

test("panel berita tidak menampilkan fixture demo", async ({ page }) => {
  await paksaMasuk(page, perlu("E2E_SUPERADMIN_EMAIL"), perlu("E2E_SUPERADMIN_SANDI"));
  await page.goto("/admin/berita");

  for (const judulDemo of [
    "Merti Dusun Majegan 2026",
    "Kerja Bakti Bersih Kali",
    "Jadwal Posyandu Agustus",
    "Pengecoran Jalan Tahap II",
    "Panen Raya Kelompok Wanita Tani",
    "Jadwal Ronda Malam Bulan Agustus",
    "Perbaikan Saluran Irigasi Blok Timur Rampung",
    "Pendataan Ulang Penerima BLT-DD Tahap III",
    "Pelatihan Olahan Pangan untuk Pelaku UMKM",
    "Penambahan Lampu Jalan di RT 05 dan RT 06",
    "Persiapan Lomba Agustusan Padukuhan",
    "Rencana Pembangunan Pos Kamling RT 07",
  ]) {
    await expect(page.getByText(judulDemo, { exact: true })).toHaveCount(0);
  }
});
