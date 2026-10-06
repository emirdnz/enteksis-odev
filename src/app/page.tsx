import BasvuruFormu from "./BasvuruFormu";
import { AtolyePanosu, Ekranlar, YAPRAK } from "./OrnekEkranlar";

const SORUNLAR = [
  "Hangi işin hangi aşamada olduğunu öğrenmek için ustaya sormanız gerekiyor.",
  "Sipariş, ölçü ve teslim tarihi aynı deftere karışık yazılıyor; defter kaybolursa iş de kayboluyor.",
  "Müşteri aradığında cevap vermek için atölyeye inip bakmak zorunda kalıyorsunuz.",
];

const IS_YOLU = [
  { baslik: "Sipariş yazılır", metin: "Ofis işi bir kez açar: müşteri, ölçü, teslim tarihi, sorumlu usta." },
  { baslik: "Tezgâha girer", metin: "Usta işi alır; iş panoda “Tezgâhta” sütununa geçer." },
  { baslik: "Aşamalar işaretlenir", metin: "Her aşama bitince usta telefondan işaretler; ofis aynı anda görür." },
  { baslik: "Teslim edilir", metin: "Hazır iş teslim planında günüyle durur; sıkışan iş önceden belli olur." },
];

const FAYDALAR = [
  {
    baslik: "İşler tek yerde",
    metin: "Her sipariş; müşterisi, ölçüsü ve teslim tarihiyle tek bir listede durur. Aramak yerine bakarsınız.",
  },
  {
    baslik: "Durumlar görünür",
    metin: "Bekliyor, tezgâhta, teslime hazır: kim neyi ne zaman bitirdi, ofisten ve telefondan görünür.",
  },
  {
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

const SONRAKI = [
  "Talebiniz kaydedilir, ekranda kayıt numaranız görünür.",
  "E-postayla size dönüp kısa bir görüşme zamanı belirleriz.",
  "Görüşmede atölyenize uygun başlangıcı birlikte seçeriz.",
];

function Logo() {
  return <span className="font-serif text-2xl font-semibold tracking-tight text-murekkep">Tezgâh</span>;
}

export default function Sayfa() {
  return (
    <>
      <header id="ust" tabIndex={-1} className="border-b border-cizgi">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <Logo />
          <a
            href="#basvuru"
            className="font-medium text-pas underline decoration-1 underline-offset-4 hover:text-pas-koyu"
          >
            Ön görüşme iste
          </a>
        </div>
      </header>

      <main id="icerik" tabIndex={-1} className="flex-1">
        <section aria-labelledby="ana-baslik">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-14 pb-20 sm:px-6 sm:pt-20 sm:pb-28 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <p className="font-mono text-sm text-soluk">Küçük üretim atölyeleri için dijital iş takibi</p>
              <h1
                id="ana-baslik"
                className="mt-5 font-serif text-[2.6rem] leading-[1.08] font-normal tracking-tight text-balance sm:text-6xl"
              >
                İşlerinizi <em className="text-pas">defterden</em> çıkarın, tek ekrandan takip edin.
              </h1>
              <p className="mt-7 max-w-lg text-lg text-pretty text-soluk">
                Tezgâh; marangoz, metal, döşeme ve benzeri küçük atölyelerde siparişleri, aşamaları ve teslim
                tarihlerini tek yerde toplar. Kurulumu ve aktarımı biz yaparız, ekibiniz yalnız kullanır.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <a
                  href="#basvuru"
                  className="rounded-[3px] bg-pas px-6 py-3.5 text-lg font-medium text-white hover:bg-pas-koyu"
                >
                  Ücretsiz ön görüşme isteyin
                </a>
                <a
                  href="#nasil"
                  className="font-medium underline decoration-cizgi decoration-2 underline-offset-4 hover:decoration-murekkep"
                >
                  Nasıl çalışır?
                </a>
              </div>
            </div>
            <AtolyePanosu />
          </div>
        </section>

        <section aria-labelledby="sorun-baslik" className="border-t border-cizgi">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_2fr]">
            <h2 id="sorun-baslik" className="font-serif text-3xl tracking-tight sm:text-4xl">
              Tanıdık geliyor mu?
            </h2>
            <ul className="border-t border-cizgi">
              {SORUNLAR.map((s) => (
                <li key={s} className="border-b border-cizgi py-5 font-serif text-xl leading-snug text-pretty">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="cozum-baslik" className="border-t border-cizgi">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_2fr]">
            <div>
              <h2 id="cozum-baslik" className="font-serif text-3xl tracking-tight sm:text-4xl">
                Defter yerine tek ekran
              </h2>
              <p className="mt-4 text-lg text-pretty text-soluk">
                Tezgâh, defterdeki her siparişi bir iş kartına çevirir. Kart, iş bitene kadar ofisle tezgâh arasında
                aynı bilgiyi taşır.
              </p>
            </div>
            <div>
              <h3 className="font-mono text-sm text-soluk">Bir işin yolu</h3>
              <ol className="mt-4 border-t border-cizgi">
                {IS_YOLU.map((a, i) => (
                  <li key={a.baslik} className="grid gap-1 border-b border-cizgi py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
                    <span className="font-medium">
                      <span aria-hidden="true" className="mr-2.5 font-mono text-sm text-pas">
                        {i + 1}
                      </span>
                      {a.baslik}
                    </span>
                    <span className="text-soluk">{a.metin}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section aria-labelledby="ekran-baslik" className="border-t border-cizgi">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="grid gap-4 lg:grid-cols-[1fr_2fr] lg:gap-8">
              <h2 id="ekran-baslik" className="font-serif text-3xl tracking-tight sm:text-4xl">
                Ofiste, tezgâhta, telefonda
              </h2>
              <div>
                <p className="max-w-xl text-lg text-soluk">
                  Pano bütün işleri gösterir. Bu üç ekran tek bir işe, haftanın teslimlerine ve ustanın elindeki
                  telefona yakından bakar.
                </p>
                <p className="mt-3 font-mono text-xs text-soluk">Örnek ekranlar · kurgusal veri</p>
              </div>
            </div>
            <Ekranlar />
          </div>
        </section>

        <section aria-labelledby="fayda-baslik" className="border-t border-cizgi">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 id="fayda-baslik" className="font-serif text-3xl tracking-tight sm:text-4xl">
              Tezgâh ile ne değişir?
            </h2>
            <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
              {FAYDALAR.map((f) => (
                <li key={f.baslik} className="border-t-2 border-murekkep pt-5">
                  <h3 className="font-serif text-2xl">{f.baslik}</h3>
                  <p className="mt-3 text-soluk">{f.metin}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="nasil" aria-labelledby="adim-baslik" className="bg-kagit-koyu">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="grid gap-4 lg:grid-cols-[1fr_2fr] lg:gap-8">
              <h2 id="adim-baslik" className="font-serif text-3xl tracking-tight sm:text-4xl">
                Nasıl çalışır?
              </h2>
              <p className="max-w-xl text-lg text-soluk">
                Üç adımda defterden ekrana geçersiniz. Her adımı sizinle birlikte, atölyenizde yaparız.
              </p>
            </div>
            <ol className="mt-12 border-t border-murekkep/25">
              {ADIMLAR.map((a, i) => (
                <li
                  key={a.baslik}
                  className="grid gap-x-8 gap-y-2 border-b border-murekkep/25 py-7 sm:grid-cols-[4rem_1fr_2fr] sm:items-baseline"
                >
                  <span aria-hidden="true" className="font-serif text-4xl text-pas italic">
                    {i + 1}
                  </span>
                  <h3 className="font-serif text-2xl">{a.baslik}</h3>
                  <p className="text-soluk">{a.metin}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="basvuru" aria-labelledby="basvuru-baslik">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_1.45fr]">
            <div>
              <h2 id="basvuru-baslik" className="font-serif text-3xl tracking-tight sm:text-4xl">
                Ön görüşme talebi
              </h2>
              <p className="mt-4 text-lg text-soluk">
                Atölyenizi kısaca anlatın; size uygun başlangıcı konuşmak için e-postayla dönelim.
              </p>
              <h3 className="mt-10 font-mono text-sm text-soluk">Sonra ne olur?</h3>
              <ol className="mt-4 border-t border-cizgi">
                {SONRAKI.map((s, i) => (
                  <li key={s} className="flex gap-4 border-b border-cizgi py-3.5">
                    <span aria-hidden="true" className="font-mono text-sm text-pas">
                      {i + 1}.
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className={`${YAPRAK} p-5 sm:p-10`}>
              <BasvuruFormu />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-cizgi">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-soluk sm:px-6 md:flex-row md:items-baseline md:justify-between">
          <Logo />
          <p className="max-w-xl">
            Tezgâh kurgusal bir hizmettir; bu sayfa bir teknik değerlendirme ödevi için hazırlanmıştır. Forma gerçek
            kişisel bilgi girmeyin.
          </p>
          <a
            href="#ust"
            className="inline-flex items-center gap-2 self-start py-2 font-medium text-pas underline decoration-1 underline-offset-4 hover:text-pas-koyu md:self-auto"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            Başa dön
          </a>
        </div>
      </footer>
    </>
  );
}
