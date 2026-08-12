const alamat = process.env.SMOKE_URL?.trim();

if (!alamat) {
  console.error("SMOKE_URL wajib diisi, misalnya: SMOKE_URL=https://majegan.vercel.app npm run test:smoke");
  process.exit(1);
}

let asal;
try {
  asal = new URL(alamat);
} catch {
  console.error("SMOKE_URL harus berupa URL yang sah.");
  process.exit(1);
}

if (asal.protocol !== "https:") {
  console.error("SMOKE_URL harus menggunakan HTTPS.");
  process.exit(1);
}

const rute = [
  "/",
  "/profil",
  "/berita",
  "/layanan",
  "/statistik",
  "/pengaduan",
  "/pengaduan/lacak",
  "/robots.txt",
  "/sitemap.xml",
  "/api/health",
];

let gagal = false;
for (const path of rute) {
  const url = new URL(path, asal).toString();
  try {
    const respons = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(10_000) });
    const sehat = respons.ok;
    console.log(`${sehat ? "OK" : "GAGAL"} ${respons.status} ${url}`);
    if (!sehat) gagal = true;
  } catch (galat) {
    console.log(`GAGAL koneksi ${url}: ${galat instanceof Error ? galat.message : "galat tidak diketahui"}`);
    gagal = true;
  }
}

if (gagal) process.exit(1);
