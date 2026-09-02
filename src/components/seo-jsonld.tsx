/**
 * Pembungkus structured data JSON-LD — dirender sebagai
 * <script type="application/ld+json"> di halaman server-rendered.
 *
 * Tanda "<" di-escape agar isi data apa pun tidak pernah bisa memutus tag
 * script (keamanan dasar untuk data yang berpotensi berasal dari admin).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
