// Sayfanın ağırlığını ve yükleme ölçülerini çıkarır (Chromium, Playwright).
// Kullanım: önce `npm run build && npx next start -p 3217`, sonra `node scripts/olc.mjs [adres]`.
// Ağ ve işlemci kısıtlaması yok: sayılar makineler arası karşılaştırma için değil,
// aynı makinede tasarım değişikliğinden önce/sonra karşılaştırma içindir.
import { gzipSync } from "node:zlib";
import { chromium } from "@playwright/test";

const adres = process.argv[2] ?? "http://localhost:3217";
const ekranlar = [
  { ad: "mobil", width: 390, height: 844 },
  { ad: "masaustu", width: 1280, height: 800 },
];

const kb = (b) => `${(b / 1024).toFixed(1)} KB`;
const tarayici = await chromium.launch();

for (const { ad, ...viewport } of ekranlar) {
  const sayfa = await tarayici.newPage({ viewport });
  const yanit = await sayfa.goto(adres, { waitUntil: "networkidle" });
  const html = await yanit.body();

  const olcu = await sayfa.evaluate(async () => {
    const lcp = await new Promise((coz) => {
      new PerformanceObserver((l) => coz(l.getEntries().at(-1)?.startTime ?? 0)).observe({
        type: "largest-contentful-paint",
        buffered: true,
      });
      setTimeout(() => coz(0), 3000);
    });
    let cls = 0;
    new PerformanceObserver((l) => l.getEntries().forEach((e) => (cls += e.hadRecentInput ? 0 : e.value))).observe({
      type: "layout-shift",
      buffered: true,
    });
    await new Promise((r) => setTimeout(r, 100));
    const kaynaklar = performance.getEntriesByType("resource");
    const topla = (tur) =>
      kaynaklar
        .filter((k) => tur(k.name, k.initiatorType))
        .reduce((t, k) => ({ adet: t.adet + 1, aktarilan: t.aktarilan + k.encodedBodySize, acik: t.acik + k.decodedBodySize }), {
          adet: 0,
          aktarilan: 0,
          acik: 0,
        });
    const gezinme = performance.getEntriesByType("navigation")[0];
    return {
      js: topla((n) => n.endsWith(".js")),
      css: topla((n) => n.endsWith(".css")),
      font: topla((n) => /\.woff2?$/.test(n)),
      lcp: Math.round(lcp),
      cls: Number(cls.toFixed(4)),
      domHazir: Math.round(gezinme.domContentLoadedEventEnd),
      ogeSayisi: document.querySelectorAll("*").length,
    };
  });

  console.log(`\n[${ad} ${viewport.width}×${viewport.height}]`);
  console.log(`HTML: ${kb(html.length)} (gzip ${kb(gzipSync(html).length)})`);
  for (const t of ["js", "css", "font"]) {
    const k = olcu[t];
    console.log(`${t.toUpperCase()}: ${k.adet} dosya · aktarılan ${kb(k.aktarilan)} · açılmış ${kb(k.acik)}`);
  }
  console.log(`LCP: ${olcu.lcp} ms · CLS: ${olcu.cls} · DOMContentLoaded: ${olcu.domHazir} ms · öğe: ${olcu.ogeSayisi}`);
  await sayfa.close();
}

await tarayici.close();
