import { defineConfig, devices } from "@playwright/test";

// .env.e2e berisi kredensial uji & URL deployment (jangan di-commit).
try {
  process.loadEnvFile(".env.e2e");
} catch {
  // Belum ada .env.e2e — biarkan reader helper melapor dengan pesan jelas.
}

const url = (process.env.E2E_URL ?? "").trim().replace(/\/+$/, "");

if (!url) {
  throw new Error(
    "E2E_URL belum diisi. Salin .env.e2e.example ke .env.e2e, isi nilai, lalu ulangi.",
  );
}

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 90_000,
  expect: { timeout: 10_000 },
  reporter: [["list"]],
  use: {
    baseURL: url,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    // Desktop: seluruh alur.
    { name: "desktop", testMatch: /.*\.spec\.ts/, use: { ...devices["Desktop Chrome"] } },
    // Layar sempit 320 px: hanya alur warga (kirim pengaduan + masuk admin).
    {
      name: "mobile-320",
      testMatch: [/(masuk|pengaduan)\.spec\.ts/],
      use: { ...devices["Desktop Chrome"], viewport: { width: 320, height: 568 } },
    },
  ],
});
