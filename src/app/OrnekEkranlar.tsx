// Ürünün neye benzediğini gösteren örnek ekranlar. Kurgusal veri; tüm ekranlarda aynı işler.
// Sunucu bileşeni: tarayıcıya JavaScript göndermez. Her ekran role="img" ve tek bir açıklamayla
// okunur; içindeki düğme görünümlü öğeler gerçek düğme değildir, odak almaz.

// Ürün kartı: ince kenar, yumuşak gölge.
export const KART =
  "rounded-xl border border-cizgi bg-white shadow-[0_1px_2px_rgb(15_27_45/0.06),0_18px_40px_-18px_rgb(15_27_45/0.28)]";

const ASAMA_SAYISI = 5;

function AsamaCubugu({ sira }: { sira: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: ASAMA_SAYISI }, (_, i) => (
        <span
          key={i}
          className={`h-2 flex-1 rounded-full ${
            i < sira
              ? "bg-neon/90 shadow-[0_0_6px_rgb(0_71_255/0.9),0_0_16px_rgb(0_71_255/0.5)]"
              : "bg-neon/12"
          }`}
        />
      ))}
    </div>
  );
}

function Usta({ ad }: { ad: string }) {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-lacivert font-mono text-[9px] text-white">
      {ad}
    </span>
  );
}

// ——— Atölye panosu (giriş bölümü) ———

type OrnekIs = {
  no: number;
  is: string;
  teslim: string;
  usta: string;
  not?: string;
  asama?: { ad: string; sira: number };
  bugun?: boolean;
};

const PANO: { durum: string; nokta: string; isler: OrnekIs[] }[] = [
  {
    durum: "Bekliyor",
    nokta: "bg-kenar",
    isler: [
      { no: 217, is: "Merdiven korkuluğu", teslim: "10 Eki", usta: "MA", not: "Ölçü alındı" },
      { no: 218, is: "Vitrin çerçevesi", teslim: "16 Eki", usta: "HK", not: "Cam bekleniyor" },
    ],
  },
  {
    durum: "Tezgâhta",
    nokta: "bg-vurgu",
    isler: [
      { no: 214, is: "Mutfak dolabı", teslim: "9 Eki", usta: "HK", asama: { ad: "Montaj", sira: 3 } },
      { no: 209, is: "Ceviz yemek masası", teslim: "15 Eki", usta: "MA", asama: { ad: "Zımpara", sira: 2 } },
    ],
  },
  {
    durum: "Teslime hazır",
    nokta: "bg-yesil",
    isler: [{ no: 211, is: "Koltuk döşeme 3+1", teslim: "bugün", usta: "SD", bugun: true }],
  },
];

function IsKarti({ s }: { s: OrnekIs }) {
  const { asama } = s;
  return (
    <div
      className={`rounded-lg border bg-white p-2.5 sm:p-3 ${s.bugun ? "border-vurgu shadow-[inset_3px_0_0_var(--color-vurgu)]" : "border-cizgi"}`}
    >
      <div className="font-mono text-[10px] text-soluk">#{s.no}</div>
      <div className="mt-0.5 text-xs leading-snug font-medium sm:text-[13px]">{s.is}</div>
      {asama && (
        <div className="mt-2.5">
          <AsamaCubugu sira={asama.sira} />
          <div className="mt-1 text-[11px] text-soluk">
            {asama.ad} · {asama.sira}/{ASAMA_SAYISI}
          </div>
        </div>
      )}
      {s.not && <div className="mt-1 text-[11px] text-soluk">{s.not}</div>}
      <div className="mt-2.5 flex items-center justify-between gap-1">
        <span className={`font-mono text-[10px] ${s.bugun ? "font-medium text-vurgu" : "text-soluk"}`}>
          {s.bugun ? "teslim bugün" : s.teslim}
        </span>
        <Usta ad={s.usta} />
      </div>
    </div>
  );
}

export function AtolyePanosu() {
  return (
    <figure className="relative">
      <div
        role="img"
        aria-label="Örnek ekran: atölye panosu. İşler bekliyor, tezgâhta ve teslime hazır sütunlarında duruyor; her kartta işin aşaması, teslim tarihi ve sorumlu usta görünür."
        className={KART}
      >
        <div className="flex items-center gap-3 border-b border-cizgi px-4 py-3 sm:px-5">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-yuzey-koyu" />
            <span className="size-2.5 rounded-full bg-yuzey-koyu" />
            <span className="size-2.5 rounded-full bg-yuzey-koyu" />
          </span>
          <span className="text-sm font-semibold sm:text-base">Atölye panosu</span>
          <span className="ml-auto font-mono text-[11px] text-soluk sm:text-xs">6 Eki · 5 açık iş</span>
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-b-xl bg-yuzey p-2.5 sm:gap-3 sm:p-4">
          {PANO.map((sutun) => (
            <div key={sutun.durum} className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 px-0.5 pb-0.5 text-[11px] leading-tight font-medium sm:text-xs">
                <span className={`size-1.5 shrink-0 rounded-full ${sutun.nokta}`} />
                <span>{sutun.durum}</span>
                <span className="ml-auto font-mono text-soluk">{sutun.isler.length}</span>
              </div>
              {sutun.isler.map((s) => (
                <IsKarti key={s.no} s={s} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <figcaption className="mt-4 text-center font-mono text-xs text-soluk lg:text-left">Örnek ekran · kurgusal veri</figcaption>
    </figure>
  );
}

// ——— İş detayı ———

const BILGILER = [
  ["Müşteri", "Demir ailesi"],
  ["Ölçü", "240 × 60 × 90 cm, ceviz kaplama"],
  ["Teslim", "9 Eki Cuma · 3 gün kaldı"],
] as const;

const ASAMALAR: { ad: string; durum: "bitti" | "simdi" | "sirada"; tarih?: string }[] = [
  { ad: "Ölçü", durum: "bitti", tarih: "2 Eki" },
  { ad: "Kesim", durum: "bitti", tarih: "4 Eki" },
  { ad: "Montaj", durum: "simdi", tarih: "bugün" },
  { ad: "Boya", durum: "sirada" },
  { ad: "Kontrol", durum: "sirada" },
];

const NOTLAR = [
  { kim: "HK", zaman: "6 Eki 09.40", metin: "Menteşeler geldi, montaja başlandı." },
  { kim: "Ofis", zaman: "5 Eki 16.15", metin: "Müşteri kulp rengini perşembe bildirecek." },
];

function IsDetayi() {
  return (
    <div
      role="img"
      aria-label="Örnek ekran: iş detayı. 214 numaralı mutfak dolabı tezgâhta; müşteri, ölçü ve teslim tarihi, beş aşamadan üçüncüsü olan montajın sürdüğü ve ustanın son notu görünüyor."
      className={KART}
    >
      <div className="flex items-start justify-between gap-3 border-b border-cizgi px-4 py-3.5">
        <div>
          <div className="font-mono text-[11px] text-soluk">#214</div>
          <div className="text-lg leading-tight font-semibold">Mutfak dolabı</div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-cizgi px-2 py-0.5 text-[11px] font-medium">
          <span className="size-1.5 rounded-full bg-vurgu" />
          Tezgâhta
        </span>
      </div>
      <dl className="grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-1.5 px-4 py-3 text-xs">
        {BILGILER.map(([ad, deger]) => (
          <div key={ad} className="contents">
            <dt className="text-soluk">{ad}</dt>
            <dd>{deger}</dd>
          </div>
        ))}
        <dt className="text-soluk">Usta</dt>
        <dd>
          <Usta ad="HK" />
        </dd>
      </dl>
      <div className="border-t border-cizgi bg-yuzey px-4 py-3">
        <div className="font-mono text-[10px] text-soluk">AŞAMALAR · 3/5</div>
        <ol className="mt-2 space-y-1.5 text-xs">
          {ASAMALAR.map((a) => (
            <li key={a.ad} className="flex items-center gap-2">
              <span
                className={`flex size-3.5 shrink-0 items-center justify-center rounded-full border text-[8px] ${
                  a.durum === "bitti"
                    ? "border-yesil bg-yesil text-white"
                    : a.durum === "simdi"
                      ? "border-vurgu bg-white"
                      : "border-kenar bg-white"
                }`}
              >
                {a.durum === "bitti" ? "✓" : a.durum === "simdi" ? <span className="size-1.5 rounded-full bg-vurgu" /> : ""}
              </span>
              <span className={a.durum === "simdi" ? "font-medium" : a.durum === "sirada" ? "text-soluk" : ""}>
                {a.ad}
              </span>
              {a.tarih && (
                <span className={`ml-auto font-mono text-[10px] ${a.durum === "simdi" ? "text-vurgu" : "text-soluk"}`}>
                  {a.tarih}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
      <div className="border-t border-cizgi px-4 py-3">
        <div className="font-mono text-[10px] text-soluk">NOTLAR</div>
        <ul className="mt-2 space-y-2 text-xs">
          {NOTLAR.map((n) => (
            <li key={n.zaman}>
              <span className="font-mono text-[10px] text-soluk">
                {n.zaman} · {n.kim}
              </span>
              <p className="leading-snug">{n.metin}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ——— Teslim planı ———

type PlanSatiri = { gun: string; is?: { no: number; ad: string; durum: string; nokta: string }; uyari?: string };

const BU_HAFTA: PlanSatiri[] = [
  { gun: "Sal 6", is: { no: 211, ad: "Koltuk döşeme 3+1", durum: "Hazır", nokta: "bg-yesil" } },
  { gun: "Çar 7" },
  { gun: "Per 8" },
  {
    gun: "Cum 9",
    is: { no: 214, ad: "Mutfak dolabı", durum: "Montaj 3/5", nokta: "bg-vurgu" },
    uyari: "3 günde 3 aşama",
  },
  { gun: "Cmt 10", is: { no: 217, ad: "Merdiven korkuluğu", durum: "Bekliyor", nokta: "bg-kenar" } },
];

const GELECEK_HAFTA: PlanSatiri[] = [
  { gun: "Per 15", is: { no: 209, ad: "Ceviz yemek masası", durum: "Zımpara 2/5", nokta: "bg-vurgu" } },
  { gun: "Cum 16", is: { no: 218, ad: "Vitrin çerçevesi", durum: "Bekliyor", nokta: "bg-kenar" } },
];

function PlanSatirlari({ satirlar }: { satirlar: PlanSatiri[] }) {
  return (
    <ul>
      {satirlar.map((s) => (
        <li
          key={s.gun}
          className={`grid grid-cols-[3rem_1fr] gap-2 border-b border-cizgi px-4 py-2 text-xs last:border-b-0 ${s.uyari ? "shadow-[inset_3px_0_0_var(--color-vurgu)]" : ""}`}
        >
          <span className="font-mono text-[11px] text-soluk">{s.gun}</span>
          {s.is ? (
            <span className="min-w-0">
              <span className="flex items-baseline justify-between gap-2">
                <span className="truncate font-medium">{s.is.ad}</span>
                <span className="shrink-0 font-mono text-[10px] text-soluk">#{s.is.no}</span>
              </span>
              <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-soluk">
                <span className={`size-1.5 shrink-0 rounded-full ${s.is.nokta}`} />
                {s.is.durum}
                {s.uyari && <span className="ml-auto font-medium text-vurgu">{s.uyari}</span>}
              </span>
            </span>
          ) : (
            <span className="text-soluk">—</span>
          )}
        </li>
      ))}
    </ul>
  );
}

function TeslimPlani() {
  return (
    <div
      role="img"
      aria-label="Örnek ekran: teslim planı. Bu hafta gün gün çıkacak işler: salı koltuk döşeme hazır, cuma mutfak dolabı üç günde üç aşamayla sıkışık olarak işaretli, cumartesi merdiven korkuluğu. Gelecek hafta iki iş daha var."
      className={KART}
    >
      <div className="flex items-baseline justify-between gap-3 border-b border-cizgi px-4 py-3.5">
        <span className="text-lg leading-tight font-semibold">Teslim planı</span>
        <span className="font-mono text-[11px] text-soluk">6–10 Eki</span>
      </div>
      <PlanSatirlari satirlar={BU_HAFTA} />
      <div className="border-y border-cizgi bg-yuzey px-4 py-1.5 font-mono text-[10px] text-soluk">GELECEK HAFTA</div>
      <PlanSatirlari satirlar={GELECEK_HAFTA} />
    </div>
  );
}

// ——— Telefondan hızlı durum ———

function TelefonDurum() {
  return (
    <div
      role="img"
      aria-label="Örnek ekran: telefondan hızlı durum. Usta, 209 numaralı ceviz yemek masasında zımpara aşamasını tek dokunuşla bitirip sıradaki aşama verniğe geçiriyor; not da ekleyebiliyor."
      className="mx-auto w-full max-w-[15rem] rounded-[2rem] border-[6px] border-lacivert bg-lacivert shadow-[0_18px_40px_-18px_rgb(15_27_45/0.45)]"
    >
      <div className="mx-auto my-1.5 h-1 w-10 rounded-full bg-white/30" />
      <div className="rounded-[1.4rem] bg-yuzey px-3.5 pt-3 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-lacivert">Tezgâh</span>
          <Usta ad="MA" />
        </div>
        <div className="mt-4 font-mono text-[10px] text-soluk">#209 · teslim 15 Eki</div>
        <div className="text-lg leading-tight font-semibold">Ceviz yemek masası</div>
        <div className="mt-3">
          <AsamaCubugu sira={2} />
          <div className="mt-1 text-[11px] text-soluk">Şu an: Zımpara · 2/5</div>
        </div>
        <div className="mt-4 rounded-lg bg-vurgu px-3 py-2.5 text-center text-sm font-semibold text-white">
          Zımpara bitti ✓
        </div>
        <div className="mt-1 text-center text-[11px] text-soluk">Sıradaki: Vernik</div>
        <div className="mt-3 rounded-lg border border-kenar bg-white px-3 py-2 text-center text-sm">Not ekle</div>
      </div>
    </div>
  );
}

// ——— Ekranlar bölümü ———

const EKRANLAR = [
  {
    baslik: "İş detayı",
    metin: "Müşteri aradığında cevap burada: ölçü, aşama, teslim tarihi ve son not. Atölyeye inmeye gerek kalmaz.",
    ekran: <IsDetayi />,
  },
  {
    baslik: "Teslim planı",
    metin: "Hangi iş hangi gün çıkacak, hangisi sıkışık; haftanın başında görünür, son güne kalmaz.",
    ekran: <TeslimPlani />,
  },
  {
    baslik: "Telefondan durum",
    metin: "Usta aşamayı tezgâhın başında, iki dokunuşla işaretler. Pano kendiliğinden güncellenir.",
    ekran: <TelefonDurum />,
  },
];

export function Ekranlar() {
  return (
    <div className="mt-14 grid items-start gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-[1.15fr_1.1fr_0.85fr]">
      {EKRANLAR.map((e) => (
        <figure key={e.baslik}>
          {e.ekran}
          <figcaption className="mt-5">
            <h3 className="text-xl font-semibold">{e.baslik}</h3>
            <p className="mt-2 text-soluk">{e.metin}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
