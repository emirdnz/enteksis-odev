"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ALAN_SIRASI,
  HIZMETLER,
  SINIRLAR,
  dogrula,
  type AlanAdi,
  type AlanHatalari,
  type BasvuruYaniti,
} from "@/lib/basvuru";

type Degerler = Record<AlanAdi, string>;
const BOS: Degerler = { isim: "", eposta: "", hizmet: "", aciklama: "" };

type Durum =
  { tur: "bos" } | { tur: "gonderiliyor" } | { tur: "basarili"; kayitNo: number } | { tur: "hata"; mesaj: string };

const ZAMAN_ASIMI_MS = 15_000;

const girdiSinifi =
  "mt-2 block w-full rounded-[3px] border border-kenar bg-white px-3.5 py-3 text-base text-murekkep " +
  "aria-[invalid=true]:border-red-700 aria-[invalid=true]:border-2";

export default function BasvuruFormu() {
  const [degerler, setDegerler] = useState<Degerler>(BOS);
  const [hatalar, setHatalar] = useState<AlanHatalari>({});
  const [durum, setDurum] = useState<Durum>({ tur: "bos" });
  const [odak, setOdak] = useState<{ ad: AlanAdi } | null>(null);

  const alanlar = useRef<Partial<Record<AlanAdi, HTMLElement | null>>>({});
  const tuzak = useRef<HTMLInputElement>(null);
  const basari = useRef<HTMLDivElement>(null);

  const gonderiliyor = durum.tur === "gonderiliyor";

  // Odak, hata metni ekrana çizildikten sonra taşınır; ekran okuyucu alanla birlikte hatayı okur.
  useEffect(() => {
    if (odak) alanlar.current[odak.ad]?.focus();
  }, [odak]);

  useEffect(() => {
    if (durum.tur === "basarili") basari.current?.focus();
  }, [durum.tur]);

  function ilkHatayaOdaklan(h: AlanHatalari) {
    const ilk = ALAN_SIRASI.find((ad) => h[ad]);
    if (ilk) setOdak({ ad: ilk });
  }

  function alanHatasi(ad: AlanAdi, d: Degerler) {
    const s = dogrula(d);
    return s.gecerli ? undefined : s.hatalar[ad];
  }

  function degistir(ad: AlanAdi, deger: string) {
    const yeni = { ...degerler, [ad]: deger };
    setDegerler(yeni);
    // Hatalı alan düzeltildikçe hata kalkar; henüz hatası olmayan alan yazarken uyarılmaz.
    if (hatalar[ad]) setHatalar((h) => ({ ...h, [ad]: alanHatasi(ad, yeni) }));
  }

  function birak(ad: AlanAdi) {
    if (degerler[ad] !== "") setHatalar((h) => ({ ...h, [ad]: alanHatasi(ad, degerler) }));
  }

  async function gonder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (gonderiliyor) return;

    const s = dogrula(degerler);
    if (!s.gecerli) {
      setHatalar(s.hatalar);
      setDurum({ tur: "bos" });
      ilkHatayaOdaklan(s.hatalar);
      return;
    }

    setHatalar({});
    setDurum({ tur: "gonderiliyor" });

    try {
      const yanit = await fetch("/api/basvuru", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...s.veri, web_sitesi: tuzak.current?.value ?? "" }),
        signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
      });
      const govde = (await yanit.json().catch(() => null)) as BasvuruYaniti | null;

      // Başarı yalnız sunucu kaydı doğruladığında: 201 ve kayıt numarası.
      if (yanit.status === 201 && govde?.durum === "kaydedildi") {
        setDegerler(BOS);
        setDurum({ tur: "basarili", kayitNo: govde.kayitNo });
        return;
      }

      if (govde?.durum === "hata") {
        setDurum({ tur: "hata", mesaj: govde.mesaj });
        if (govde.alanlar && Object.keys(govde.alanlar).length > 0) {
          setHatalar(govde.alanlar);
          ilkHatayaOdaklan(govde.alanlar);
        }
        return;
      }

      setDurum({ tur: "hata", mesaj: "Talebiniz gönderilemedi. Lütfen tekrar deneyin." });
    } catch (hata) {
      const zamanAsimi = hata instanceof DOMException && hata.name === "TimeoutError";
      setDurum({
        tur: "hata",
        mesaj: zamanAsimi
          ? "Sunucu zamanında yanıt vermedi. Talebiniz kaydedilmiş olabilir; tekrar göndermeden önce birkaç dakika bekleyin."
          : "Bağlantı kurulamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.",
      });
    }
  }

  if (durum.tur === "basarili") {
    return (
      <div
        ref={basari}
        tabIndex={-1}
        role="region"
        aria-labelledby="basari-baslik"
        className="rounded-[3px] border-2 border-yesil bg-yesil-acik p-6"
      >
        <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-yesil text-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3 id="basari-baslik" className="mt-4 font-serif text-2xl text-yesil">
          Talebiniz kaydedildi
        </h3>
        <p className="mt-2 text-murekkep">
          Kayıt numaranız: <strong>{durum.kayitNo}</strong>. Size e-postayla dönüş yapacağız.
        </p>
        <button
          type="button"
          onClick={() => setDurum({ tur: "bos" })}
          className="mt-5 rounded-[3px] border border-yesil bg-white px-4 py-2 font-medium text-yesil hover:bg-yesil-acik"
        >
          Yeni bir talep gönder
        </button>
      </div>
    );
  }

  const hataKimligi = (ad: AlanAdi) => (hatalar[ad] ? `${ad}-hata` : undefined);
  const aciklamaUzunlugu = degerler.aciklama.length;

  return (
    <form noValidate onSubmit={gonder} aria-describedby="form-notu" className="space-y-6">
      <p id="form-notu" className="text-sm text-soluk">
        Tüm alanlar zorunludur.
      </p>

      <div
        role="alert"
        className={durum.tur === "hata" ? "rounded-[3px] border-2 border-red-700 bg-red-50 p-4 text-red-900" : ""}
      >
        {durum.tur === "hata" ? durum.mesaj : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="isim" className="block font-medium text-murekkep">
            Adınız soyadınız
          </label>
          <input
            ref={(el) => {
              alanlar.current.isim = el;
            }}
            id="isim"
            name="isim"
            type="text"
            autoComplete="name"
            required
            maxLength={SINIRLAR.isim.en_cok}
            value={degerler.isim}
            onChange={(e) => degistir("isim", e.target.value)}
            onBlur={() => birak("isim")}
            aria-invalid={hatalar.isim ? true : undefined}
            aria-describedby={hataKimligi("isim")}
            className={girdiSinifi}
          />
          {hatalar.isim && (
            <p id="isim-hata" className="mt-1 text-sm font-medium text-red-700">
              {hatalar.isim}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="eposta" className="block font-medium text-murekkep">
            E-posta adresiniz
          </label>
          <input
            ref={(el) => {
              alanlar.current.eposta = el;
            }}
            id="eposta"
            name="eposta"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            required
            maxLength={SINIRLAR.eposta.en_cok}
            value={degerler.eposta}
            onChange={(e) => degistir("eposta", e.target.value)}
            onBlur={() => birak("eposta")}
            aria-invalid={hatalar.eposta ? true : undefined}
            aria-describedby={hataKimligi("eposta")}
            className={girdiSinifi}
          />
          {hatalar.eposta && (
            <p id="eposta-hata" className="mt-1 text-sm font-medium text-red-700">
              {hatalar.eposta}
            </p>
          )}
        </div>
      </div>

      <fieldset aria-describedby={hataKimligi("hizmet")}>
        <legend className="font-medium text-murekkep">Hangi hizmetle ilgileniyorsunuz?</legend>
        <div className="mt-3 divide-y divide-cizgi rounded-[3px] border border-kenar">
          {HIZMETLER.map((h, i) => (
            <label
              key={h.deger}
              className="flex cursor-pointer gap-3 bg-white p-4 hover:bg-kagit has-[:checked]:bg-kagit has-[:checked]:shadow-[inset_3px_0_0_var(--color-pas)]"
            >
              <input
                ref={
                  i === 0
                    ? (el) => {
                        alanlar.current.hizmet = el;
                      }
                    : undefined
                }
                type="radio"
                name="hizmet"
                value={h.deger}
                required
                checked={degerler.hizmet === h.deger}
                onChange={(e) => degistir("hizmet", e.target.value)}
                className="mt-1 size-4 shrink-0 accent-pas"
              />
              <span>
                <span className="block font-medium text-murekkep">{h.baslik}</span>
                <span className="block text-sm text-soluk">{h.aciklama}</span>
              </span>
            </label>
          ))}
        </div>
        {hatalar.hizmet && (
          <p id="hizmet-hata" className="mt-1 text-sm font-medium text-red-700">
            {hatalar.hizmet}
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor="aciklama" className="block font-medium text-murekkep">
          Atölyenizi ve ihtiyacınızı kısaca anlatın
        </label>
        <p id="aciklama-ipucu" className="text-sm text-soluk">
          Ne üretiyorsunuz, işleri bugün nasıl takip ediyorsunuz? En az {SINIRLAR.aciklama.en_az} karakter.
        </p>
        <textarea
          ref={(el) => {
            alanlar.current.aciklama = el;
          }}
          id="aciklama"
          name="aciklama"
          rows={5}
          required
          maxLength={SINIRLAR.aciklama.en_cok}
          value={degerler.aciklama}
          onChange={(e) => degistir("aciklama", e.target.value)}
          onBlur={() => birak("aciklama")}
          aria-invalid={hatalar.aciklama ? true : undefined}
          aria-describedby={["aciklama-ipucu", hataKimligi("aciklama")].filter(Boolean).join(" ")}
          className={girdiSinifi}
        />
        <div className="mt-1 flex justify-between gap-4 text-sm">
          <span id="aciklama-hata" className="font-medium text-red-700">
            {hatalar.aciklama}
          </span>
          <span className="shrink-0 font-mono text-soluk" aria-hidden="true">
            {aciklamaUzunlugu} / {SINIRLAR.aciklama.en_cok}
          </span>
        </div>
      </div>

      {/* Tuzak alan: görünmez ve ekran okuyucudan gizli; yalnız botlar doldurur. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor="web_sitesi">Web siteniz (boş bırakın)</label>
        <input ref={tuzak} id="web_sitesi" name="web_sitesi" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <button
          type="submit"
          aria-disabled={gonderiliyor}
          className="flex w-full items-center justify-center gap-2 rounded-[3px] bg-pas px-7 py-3.5 text-lg font-medium text-white hover:bg-pas-koyu aria-disabled:cursor-wait aria-disabled:opacity-80 sm:w-auto"
        >
          {gonderiliyor && (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5 motion-safe:animate-spin">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity={0.3} strokeWidth={3} />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
            </svg>
          )}
          {gonderiliyor ? "Gönderiliyor…" : "Talebi gönder"}
        </button>
        <p role="status" className="sr-only">
          {gonderiliyor ? "Talebiniz gönderiliyor, lütfen bekleyin." : ""}
        </p>
      </div>

      <p className="text-sm text-soluk">
        Bilgileriniz yalnız bu talebe dönüş yapmak için saklanır ve üçüncü kişilerle paylaşılmaz.
      </p>
    </form>
  );
}
