import BasaDon from "./BasaDon";
import BasvuruFormu from "./BasvuruFormu";
import { AtolyePanosu, Ekranlar, KART } from "./OrnekEkranlar";

const MENU = [
  { ad: "Sorun", hedef: "#sorun" },
  { ad: "Çözüm", hedef: "#cozum" },
  { ad: "Ekranlar", hedef: "#ekranlar" },
  { ad: "Nasıl çalışır", hedef: "#nasil" },
  { ad: "SSS", hedef: "#sss" },
];

// Tek çizgili simgeler (24×24). Hepsi süs: ekran okuyucudan gizli.
const IKON = {
  soru: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01",
  defter: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5",
  telefon:
    "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z",
  liste: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  goz: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  kalkan: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
  tik: "M20 6 9 17l-5-5",
  sag: "M5 12h14M13 6l6 6-6 6",
  arti: "M12 5v14M5 12h14",
};

function Ikon({ d, className = "size-5" }: { d: string; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

const GUVENCELER = ["Kurulum ve aktarım bizden", "Bilgisayarda ve telefonda", "Yalnız iş takibi, ek modül yok"];

const SORUNLAR = [
  {
    ikon: IKON.soru,
    baslik: "İş nerede?",
    metin: "Hangi işin hangi aşamada olduğunu öğrenmek için ustaya sormanız gerekiyor.",
  },
  {
    ikon: IKON.defter,
    baslik: "Her şey tek defterde",
    metin: "Sipariş, ölçü ve teslim tarihi aynı deftere karışık yazılıyor; defter kaybolursa iş de kayboluyor.",
  },
  {
    ikon: IKON.telefon,
    baslik: "Müşteri arayınca",
    metin: "Müşteri aradığında cevap vermek için atölyeye inip bakmak zorunda kalıyorsunuz.",
  },
];

const IS_YOLU = [
  { baslik: "Sipariş yazılır", metin: "Ofis işi bir kez açar: müşteri, ölçü, teslim tarihi, sorumlu usta." },
  { baslik: "Tezgâha girer", metin: "Usta işi alır; iş panoda “Tezgâhta” sütununa geçer." },
  { baslik: "Aşamalar işaretlenir", metin: "Her aşama bitince usta telefondan işaretler; ofis aynı anda görür." },
  { baslik: "Teslim edilir", metin: "Hazır iş teslim planında günüyle durur; sıkışan iş önceden belli olur." },
];

const FAYDALAR = [
  {
    ikon: IKON.liste,
    baslik: "İşler tek yerde",
    metin: "Her sipariş; müşterisi, ölçüsü ve teslim tarihiyle tek bir listede durur. Aramak yerine bakarsınız.",
  },
  {
    ikon: IKON.goz,
    baslik: "Durumlar görünür",
    metin: "Bekliyor, tezgâhta, teslime hazır: kim neyi ne zaman bitirdi, ofisten ve telefondan görünür.",
  },
  {
    ikon: IKON.kalkan,
    baslik: "Deftere bağımlılık azalır",
    metin: "Bilgi bir kişinin defterinde kalmaz. Usta izindeyken de iş durmaz, kayıt kaybolmaz.",
  },
];

const ADIMLAR = [
  {
    baslik: "Kurulum",
    metin: "Atölyenizi bir gün yerinde izler, iş takibini kendi aşamalarınıza göre kurarız.",
  },
  {
    baslik: "Defterden aktarım",
    metin: "Açık işleri defterden ve kâğıtlardan sisteme biz taşırız; ilk gün boş bir ekranla başlamazsınız.",
  },
  {
    baslik: "Ekip eğitimi",
    metin: "Ustalara ve ofise kullanımı yerinde gösteririz. Bir işi güncellemek birkaç dokunuş sürer.",
  },
];

const SSS = [
  {
    soru: "Bilgisayar bilgisi gerekiyor mu?",
    cevap:
      "Hayır. Ofis siparişi bir kez yazar, usta aşamayı telefondan birkaç dokunuşla işaretler. Kullanımı ekibinize yerinde gösteririz.",
  },
  {
    soru: "Defterdeki açık işler ne olacak?",
    cevap: "Açık işleri defterden ve kâğıtlardan sisteme biz taşırız; ilk gün boş bir ekranla başlamazsınız.",
  },
  {
    soru: "Muhasebe, stok ya da fatura da var mı?",
    cevap:
      "Hayır. Tezgâh yalnız iş takibi yapar: siparişler, aşamalar ve teslim tarihleri. Kapsamı bilerek dar tuttuk; öğrenmesi kolay olsun.",
  },
  {
    soru: "Ön görüşme ücretli mi?",
    cevap: "Hayır, ön görüşme ücretsizdir. Atölyenizi dinler, size uygun başlangıcı birlikte seçeriz.",
  },
  {
    soru: "Hangi atölyeler için uygun?",
    cevap:
      "Sipariş üzerine iş yapan küçük üretim atölyeleri için: marangoz, metal, döşeme ve benzerleri. İşi aşama aşama ilerleyen atölyeler en çok faydayı görür.",
  },
];

const SONRAKI = [
  "Talebiniz kaydedilir, ekranda kayıt numaranız görünür.",
  "E-postayla size dönüp kısa bir görüşme zamanı belirleriz.",
  "Görüşmede atölyenize uygun başlangıcı birlikte seçeriz.",
];

function Logo({ koyu = false }: { koyu?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={`flex size-9 items-center justify-center rounded-lg ${koyu ? "bg-white text-lacivert" : "bg-lacivert text-white"}`}
      >
        <Ikon d="M3 9h18M5 9v11M19 9v11M5 15h14M9 9V6h6v3" className="size-5" />
      </span>
      <span className={`text-xl font-bold tracking-tight ${koyu ? "text-white" : "text-lacivert"}`}>Tezgâh</span>
    </span>
  );
}

function BolumBasi({
  ust,
  id,
  baslik,
  metin,
  koyu = false,
}: {
  ust: string;
  id: string;
  baslik: string;
  metin?: string;
  koyu?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <p className={`text-sm font-semibold ${koyu ? "text-vurgu-acik-metin" : "text-vurgu"}`}>{ust}</p>
      <h2
        id={id}
        className={`mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl ${koyu ? "text-white" : "text-lacivert"}`}
      >
        {baslik}
      </h2>
      {metin && <p className={`mt-4 text-lg text-pretty ${koyu ? "text-koyu-soluk" : "text-soluk"}`}>{metin}</p>}
    </div>
  );
}

const ICERIK = "mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24";

export default function Sayfa() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-cizgi bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
          <a href="#icerik" className="rounded-lg">
            <Logo />
          </a>
          <nav aria-label="Sayfa bölümleri" className="hidden md:block">
            <ul className="flex items-center gap-7 text-sm font-medium text-soluk">
              {MENU.map((m) => (
                <li key={m.hedef}>
                  <a href={m.hedef} className="hover:text-lacivert">
                    {m.ad}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href="#basvuru"
            className="rounded-lg bg-vurgu px-4 py-2.5 text-sm font-semibold text-white hover:bg-vurgu-koyu"
          >
            Ön görüşme iste
          </a>
        </div>
      </header>

      <main id="icerik" tabIndex={-1} className="flex-1">
        <section aria-labelledby="ana-baslik" className="relative overflow-hidden border-b border-cizgi bg-yuzey">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-cizgi)_1px,transparent_1px)] bg-size-[22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pt-14 pb-20 sm:px-6 sm:pt-20 sm:pb-24 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-cizgi bg-white px-3 py-1.5 text-[13px] font-medium text-soluk sm:text-sm">
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-vurgu" />
                Küçük üretim atölyeleri için dijital iş takibi
              </p>
              <h1
                id="ana-baslik"
                className="mt-6 text-[2.5rem] leading-[1.08] font-bold tracking-tight text-balance text-lacivert sm:text-[3.4rem]"
              >
                İşlerinizi <em className="text-vurgu not-italic">defterden</em> çıkarın, tek ekrandan takip edin.
              </h1>
              <p className="mt-6 max-w-lg text-lg text-pretty text-soluk">
                Tezgâh; marangoz, metal, döşeme ve benzeri küçük atölyelerde siparişleri, aşamaları ve teslim
                tarihlerini tek yerde toplar. Kurulumu ve aktarımı biz yaparız, ekibiniz yalnız kullanır.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href="#basvuru"
                  className="inline-flex items-center gap-2 rounded-lg bg-vurgu px-6 py-3.5 font-semibold text-white shadow-sm hover:bg-vurgu-koyu sm:text-lg"
                >
                  Ücretsiz ön görüşme isteyin
                  <Ikon d={IKON.sag} />
                </a>
                <a
                  href="#nasil"
                  className="rounded-lg border border-kenar/50 bg-white px-6 py-3.5 font-semibold text-lacivert hover:border-lacivert sm:text-lg"
                >
                  Nasıl çalışır?
                </a>
              </div>
              <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2.5 text-sm font-medium">
                {GUVENCELER.map((g) => (
                  <li key={g} className="flex items-center gap-2">
                    <Ikon d={IKON.tik} className="size-4 shrink-0 text-yesil" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
            <AtolyePanosu />
          </div>
        </section>

        <section id="sorun" aria-labelledby="sorun-baslik">
          <div className={ICERIK}>
            <BolumBasi
              ust="Sorun"
              id="sorun-baslik"
              baslik="Tanıdık geliyor mu?"
              metin="Küçük atölyelerde iş takibi çoğu zaman bir deftere ve ustanın hafızasına bağlıdır."
            />
            <ul className="mt-12 grid gap-5 md:grid-cols-3">
              {SORUNLAR.map((s) => (
                <li key={s.baslik} className="rounded-xl border border-cizgi bg-white p-6 shadow-sm sm:p-7">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-vurgu-acik text-vurgu">
                    <Ikon d={s.ikon} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-lacivert">{s.baslik}</h3>
                  <p className="mt-2 text-soluk">{s.metin}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="cozum" aria-labelledby="cozum-baslik" className="border-y border-cizgi bg-yuzey">
          <div className={ICERIK}>
            <BolumBasi
              ust="Çözüm"
              id="cozum-baslik"
              baslik="Defter yerine tek ekran"
              metin="Tezgâh, defterdeki her siparişi bir iş kartına çevirir. Kart, iş bitene kadar ofisle tezgâh arasında aynı bilgiyi taşır."
            />
            <h3 className="mt-12 text-sm font-semibold text-soluk">Bir işin yolu</h3>
            <ol className="mt-6 grid gap-8 lg:grid-cols-4 lg:gap-6">
              {IS_YOLU.map((a, i) => (
                <li key={a.baslik} className="relative pl-16 lg:pt-16 lg:pl-0">
                  {i < IS_YOLU.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute top-12 -bottom-8 left-[1.375rem] w-px bg-kenar/40 lg:top-[1.375rem] lg:-right-6 lg:bottom-auto lg:left-[3.25rem] lg:h-px lg:w-auto"
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-0 flex size-11 items-center justify-center rounded-full bg-lacivert font-mono text-sm font-medium text-white"
                  >
                    {i + 1}
                  </span>
                  <p className="text-lg font-semibold text-lacivert">{a.baslik}</p>
                  <p className="mt-1.5 text-soluk">{a.metin}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="ekranlar" aria-labelledby="ekran-baslik">
          <div className={ICERIK}>
            <BolumBasi
              ust="Ekranlar"
              id="ekran-baslik"
              baslik="Ofiste, tezgâhta, telefonda"
              metin="Pano bütün işleri gösterir. Bu üç ekran tek bir işe, haftanın teslimlerine ve ustanın elindeki telefona yakından bakar."
            />
            <p className="mt-4 font-mono text-xs text-soluk">Örnek ekranlar · kurgusal veri</p>
            <Ekranlar />
          </div>
        </section>

        <section id="fayda" aria-labelledby="fayda-baslik" className="koyu bg-lacivert text-white">
          <div className={ICERIK}>
            <BolumBasi koyu ust="Faydalar" id="fayda-baslik" baslik="Tezgâh ile ne değişir?" />
            <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
              {FAYDALAR.map((f) => (
                <li key={f.baslik} className="border-t border-white/15 pt-6">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-white/10 text-vurgu-acik-metin">
                    <Ikon d={f.ikon} />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-white">{f.baslik}</h3>
                  <p className="mt-2 text-koyu-soluk">{f.metin}</p>
                </li>
              ))}
            </ul>
            <div className="mt-14 flex flex-col gap-5 rounded-xl bg-white/5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <p className="text-lg font-semibold text-white">Atölyenize uyar mı? Ücretsiz ön görüşmede konuşalım.</p>
              <a
                href="#basvuru"
                className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg bg-white px-5 py-3 font-semibold text-lacivert hover:bg-yuzey sm:self-auto"
              >
                Ön görüşme iste
                <Ikon d={IKON.sag} />
              </a>
            </div>
          </div>
        </section>

        <section id="nasil" aria-labelledby="adim-baslik">
          <div className={ICERIK}>
            <BolumBasi
              ust="Süreç"
              id="adim-baslik"
              baslik="Nasıl çalışır?"
              metin="Üç adımda defterden ekrana geçersiniz. Her adımı sizinle birlikte, atölyenizde yaparız."
            />
            <ol className="mt-12 grid gap-5 md:grid-cols-3">
              {ADIMLAR.map((a, i) => (
                <li key={a.baslik} className="rounded-xl border border-cizgi bg-white p-6 shadow-sm sm:p-8">
                  <span aria-hidden="true" className="font-mono text-sm font-medium text-vurgu">
                    Adım {i + 1}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold text-lacivert">{a.baslik}</h3>
                  <p className="mt-2 text-soluk">{a.metin}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="sss" aria-labelledby="sss-baslik" className="border-t border-cizgi">
          <div className={`${ICERIK} grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16`}>
            <BolumBasi
              ust="SSS"
              id="sss-baslik"
              baslik="Sık sorulan sorular"
              metin="Aradığınız cevap burada yoksa formda sorun; e-postayla yanıtlayalım."
            />
            <div className="divide-y divide-cizgi border-y border-cizgi">
              {SSS.map((s) => (
                <details key={s.soru} className="group">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-lg font-semibold text-lacivert">
                    {s.soru}
                    <Ikon
                      d={IKON.arti}
                      className="size-5 shrink-0 text-vurgu motion-safe:transition-transform group-open:rotate-45"
                    />
                  </summary>
                  <p className="pb-5 text-soluk">{s.cevap}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="basvuru" aria-labelledby="basvuru-baslik" className="border-t border-cizgi bg-yuzey">
          <div className={`${ICERIK} grid gap-12 lg:grid-cols-[1fr_1.45fr]`}>
            <div>
              <BolumBasi
                ust="Başvuru"
                id="basvuru-baslik"
                baslik="Ön görüşme talebi"
                metin="Atölyenizi kısaca anlatın; size uygun başlangıcı konuşmak için e-postayla dönelim."
              />
              <h3 className="mt-10 text-sm font-semibold text-soluk">Sonra ne olur?</h3>
              <ol className="mt-5 space-y-4">
                {SONRAKI.map((s, i) => (
                  <li key={s} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="flex size-7 shrink-0 items-center justify-center rounded-full border border-cizgi bg-white font-mono text-sm font-medium text-vurgu"
                    >
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className={`${KART} p-5 sm:p-10`}>
              <BasvuruFormu />
            </div>
          </div>
        </section>
      </main>

      <footer className="koyu bg-lacivert-koyu text-koyu-soluk">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr]">
          <div>
            <Logo koyu />
            <p className="mt-4 max-w-sm">
              Küçük üretim atölyeleri için dijital iş takibi. Siparişler, aşamalar ve teslim tarihleri tek ekranda.
            </p>
          </div>
          <nav aria-label="Alt bilgi bağlantıları">
            <p className="text-sm font-semibold text-white">Sayfa</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {[...MENU, { ad: "Ön görüşme", hedef: "#basvuru" }].map((m) => (
                <li key={m.hedef}>
                  <a href={m.hedef} className="hover:text-white">
                    {m.ad}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="border-t border-white/10">
          <p className="mx-auto max-w-6xl px-4 pt-6 pb-24 text-sm sm:px-6 md:pb-6">
            Tezgâh kurgusal bir hizmettir; bu sayfa bir teknik değerlendirme ödevi için hazırlanmıştır. Forma gerçek
            kişisel bilgi girmeyin.
          </p>
        </div>
      </footer>
      <BasaDon />
    </>
  );
}
