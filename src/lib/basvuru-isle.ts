import { createHash } from "node:crypto";
import { dogrula, type AlanHatalari, type Basvuru, type BasvuruYaniti } from "./basvuru";

// En uzun geçerli form ~8 KB eder (2000 karakter × en çok 4 bayt + diğer alanlar).
export const GOVDE_SINIRI = 16 * 1024;

export const HIZ_SINIRI = { istek: 5, pencereDakika: 10 } as const;

export const TUZAK_ALAN = "web_sitesi";

// Veritabanı arayüzü. Gerçeği src/lib/depo.ts'de; testler sahte bir depo verir.
export interface Depo {
  /** İstemcinin içinde bulunulan zaman penceresindeki sayacı bir artırır, yeni değeri döndürür. */
  istekSay(istemciAnahtari: string): Promise<number>;
  /** Başvuruyu yazar, yazılan satırın kimliğini döndürür. Yazamazsa hata fırlatır. */
  kaydet(basvuru: Basvuru): Promise<number>;
}

export async function basvuruIsle(istek: Request, depo: Depo): Promise<Response> {
  const tur = istek.headers.get("content-type") ?? "";
  if (!tur.toLowerCase().startsWith("application/json")) {
    return hata(415, "İstek biçimi desteklenmiyor.");
  }

  const govde = await govdeOku(istek, GOVDE_SINIRI);
  if (govde === null) return hata(413, "Gönderilen veri çok büyük.");

  let girdi: unknown;
  try {
    girdi = JSON.parse(govde);
  } catch {
    return hata(400, "İstek okunamadı.");
  }

  // Tuzak alan: ekranda görünmez, insan doldurmaz; dolduran bottur. Kayıt yok, başarı da yok.
  if (girdi && typeof girdi === "object" && (girdi as Record<string, unknown>)[TUZAK_ALAN]) {
    return hata(400, "İstek reddedildi.");
  }

  const sonuc = dogrula(girdi);
  if (!sonuc.gecerli) {
    return hata(422, "Bazı alanlar hatalı. Lütfen düzeltip tekrar gönderin.", sonuc.hatalar);
  }

  try {
    const sayi = await depo.istekSay(istemciAnahtari(istek));
    if (sayi > HIZ_SINIRI.istek) {
      return hata(429, "Kısa sürede çok fazla talep gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.", undefined, {
        "Retry-After": String(HIZ_SINIRI.pencereDakika * 60),
      });
    }

    // Başarı yanıtı yalnız INSERT bir kimlik döndürdükten sonra kurulur.
    const kayitNo = await depo.kaydet(sonuc.veri);
    return yanit(201, { durum: "kaydedildi", kayitNo });
  } catch (e) {
    // Ham hata yalnız sunucu günlüğüne; kullanıcıya genel mesaj.
    console.error("[basvuru] kaydedilemedi:", e instanceof Error ? `${e.name}: ${e.message}` : e);
    return hata(500, "Talebiniz şu an kaydedilemedi. Lütfen biraz sonra tekrar deneyin.");
  }
}

// Gövdeyi sınırı aşınca okumayı keserek okur; Content-Length eksik ya da yanlış olsa da korur.
async function govdeOku(istek: Request, sinir: number): Promise<string | null> {
  const bildirilen = Number(istek.headers.get("content-length"));
  if (bildirilen > sinir) return null;
  if (!istek.body) return "";

  const okuyucu = istek.body.getReader();
  const parcalar: Uint8Array[] = [];
  let toplam = 0;
  for (;;) {
    const { done, value } = await okuyucu.read();
    if (done) break;
    toplam += value.byteLength;
    if (toplam > sinir) {
      await okuyucu.cancel();
      return null;
    }
    parcalar.push(value);
  }

  const bayt = new Uint8Array(toplam);
  let konum = 0;
  for (const p of parcalar) {
    bayt.set(p, konum);
    konum += p.byteLength;
  }
  return new TextDecoder().decode(bayt);
}

// Netlify istemci IP'sini bu başlığa kendisi yazar. İstemcinin gönderebildiği
// X-Forwarded-For'a güvenilmez. IP açık saklanmaz, özeti saklanır.
function istemciAnahtari(istek: Request): string {
  const ip = istek.headers.get("x-nf-client-connection-ip") ?? "yerel";
  return createHash("sha256").update(ip).digest("hex");
}

function yanit(kod: number, govde: BasvuruYaniti, basliklar?: Record<string, string>): Response {
  return Response.json(govde, { status: kod, headers: { "Cache-Control": "no-store", ...basliklar } });
}

function hata(kod: number, mesaj: string, alanlar?: AlanHatalari, basliklar?: Record<string, string>): Response {
  return yanit(kod, alanlar ? { durum: "hata", mesaj, alanlar } : { durum: "hata", mesaj }, basliklar);
}
