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

const pemeriksaan = [
  { path: "/", status: [200] },
  { path: "/profil", status: [200] },
  { path: "/berita", status: [200] },
  { path: "/layanan", status: [200] },
  { path: "/statistik", status: [200] },
  { path: "/pengaduan", status: [200] },
  { path: "/pengaduan/terkirim", status: [200] },
  { path: "/pengaduan/lacak", status: [404] },
  { path: "/admin", status: [302, 303, 307, 308] },
  { path: "/robots.txt", status: [200] },
  { path: "/sitemap.xml", status: [200] },
  { path: "/api/health", status: [200] },
];

let gagal = false;
for (const { path, status } of pemeriksaan) {
  const url = new URL(path, asal).toString();
  try {
    const respons = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(10_000) });
    const sehat = status.includes(respons.status);
    console.log(`${sehat ? "OK" : "GAGAL"} ${respons.status} ${url}`);
    if (!sehat) gagal = true;
  } catch (galat) {
    console.log(`GAGAL koneksi ${url}: ${galat instanceof Error ? galat.message : "galat tidak diketahui"}`);
    gagal = true;
  }
}

if (gagal) process.exit(1);
