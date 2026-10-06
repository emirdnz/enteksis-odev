import BasvuruFormu from "./BasvuruFormu";

const SORUNLAR = [
  "Hangi işin hangi aşamada olduğunu öğrenmek için ustaya sormanız gerekiyor.",
  "Sipariş, ölçü ve teslim tarihi aynı deftere karışık yazılıyor; defter kaybolursa iş de kayboluyor.",
  "Müşteri aradığında cevap vermek için atölyeye inip bakmak zorunda kalıyorsunuz.",
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

export default function Sayfa() {
  return (
    <>
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <span className="text-xl font-bold tracking-tight text-stone-900">Tezgâh</span>
          <a
            href="#basvuru"
            className="rounded-md px-3 py-2 text-sm font-semibold text-amber-800 underline-offset-4 hover:underline"
          >
            Ön görüşme iste
          </a>
        </div>
      </header>

      <main id="icerik" tabIndex={-1} className="flex-1">
        <section aria-labelledby="ana-baslik" className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-800">
              Küçük üretim atölyeleri için dijital iş takibi
            </p>
            <h1 id="ana-baslik" className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              İşlerinizi defterden çıkarın, tek ekrandan takip edin.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-stone-700">
              Tezgâh; marangoz, metal, döşeme ve benzeri küçük atölyelerde siparişleri, aşamaları ve teslim
              tarihlerini tek yerde toplar. Kurulumu ve aktarımı biz yaparız, ekibiniz yalnız kullanır.
            </p>
            <a
              href="#basvuru"
              className="mt-8 inline-block rounded-md bg-amber-700 px-6 py-3 text-lg font-semibold text-white hover:bg-amber-800"
            >
              Ücretsiz ön görüşme isteyin
            </a>
          </div>
        </section>

        <section aria-labelledby="sorun-baslik">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
            <h2 id="sorun-baslik" className="text-2xl font-bold text-stone-900 sm:text-3xl">
              Tanıdık geliyor mu?
            </h2>
            <ul className="mt-6 space-y-3">
              {SORUNLAR.map((s) => (
                <li key={s} className="flex gap-3 text-stone-800">
                  <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-amber-700" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="fayda-baslik" className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
            <h2 id="fayda-baslik" className="text-2xl font-bold text-stone-900 sm:text-3xl">
              Tezgâh ile ne değişir?
            </h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {FAYDALAR.map((f) => (
                <li key={f.baslik} className="rounded-lg border border-stone-300 p-6">
                  <h3 className="text-lg font-semibold text-stone-900">{f.baslik}</h3>
                  <p className="mt-2 text-stone-700">{f.metin}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="adim-baslik">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
            <h2 id="adim-baslik" className="text-2xl font-bold text-stone-900 sm:text-3xl">
              Nasıl çalışır?
            </h2>
            <ol className="mt-8 grid gap-6 md:grid-cols-3">
              {ADIMLAR.map((a, i) => (
                <li key={a.baslik} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-stone-900 font-bold text-white"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-stone-900">{a.baslik}</h3>
                    <p className="mt-1 text-stone-700">{a.metin}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="basvuru" aria-labelledby="basvuru-baslik" className="scroll-mt-4 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 id="basvuru-baslik" className="text-2xl font-bold text-stone-900 sm:text-3xl">
              Ön görüşme talebi
            </h2>
            <p className="mt-3 text-stone-700">
              Atölyenizi kısaca anlatın; size uygun başlangıcı konuşmak için e-postayla dönelim.
            </p>
            <div className="mt-8">
              <BasvuruFormu />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200">
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-stone-600 sm:px-6">
          <p>
            Tezgâh kurgusal bir hizmettir; bu sayfa bir teknik değerlendirme ödevi için hazırlanmıştır. Forma gerçek
            kişisel bilgi girmeyin.
          </p>
        </div>
      </footer>
    </>
  );
}
