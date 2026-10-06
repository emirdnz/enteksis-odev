import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Basvuru } from "@/lib/basvuru";
import { basvuruIsle, GOVDE_SINIRI, HIZ_SINIRI, type Depo } from "@/lib/basvuru-isle";

// Sunucu mantığı gerçek veritabanı yerine bellekteki sahte depoyla denenir.
// Sahte depo, gerçek depo gibi: kaydet() ya kimlik döndürür ya hata fırlatır.
class SahteDepo implements Depo {
  kayitlar: Basvuru[] = [];
  sayaclar = new Map<string, number>();
  kayitHatasi: Error | null = null;
  sayacHatasi: Error | null = null;

  async istekSay(anahtar: string) {
    if (this.sayacHatasi) throw this.sayacHatasi;
    const yeni = (this.sayaclar.get(anahtar) ?? 0) + 1;
    this.sayaclar.set(anahtar, yeni);
    return yeni;
  }

  async kaydet(b: Basvuru) {
    if (this.kayitHatasi) throw this.kayitHatasi;
    this.kayitlar.push(b);
    return this.kayitlar.length;
  }
}

const gecerli = {
  isim: "Deneme Atölye",
  eposta: "deneme@ornek.com",
  hizmet: "aktarim",
  aciklama: "Açık işler defterde, ustalar sormadan durumu bilemiyor.",
};

function istek(govde: unknown, basliklar: Record<string, string> = {}) {
  return new Request("http://localhost/api/basvuru", {
    method: "POST",
    headers: { "content-type": "application/json", ...basliklar },
    body: typeof govde === "string" ? govde : JSON.stringify(govde),
  });
}

let depo: SahteDepo;
beforeEach(() => {
  depo = new SahteDepo();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/basvuru", () => {
  it("geçerli başvuru → 201, kayıt yazıldı, kayıt numarası döndü", async () => {
    const y = await basvuruIsle(istek(gecerli), depo);
    expect(y.status).toBe(201);
    expect(await y.json()).toEqual({ durum: "kaydedildi", kayitNo: 1 });
    expect(depo.kayitlar).toEqual([gecerli]);
  });

  it("geçersiz başvuru → 422, alan hataları, kayıt yok", async () => {
    const y = await basvuruIsle(istek({ ...gecerli, eposta: "olmaz", aciklama: "kısa" }), depo);
    expect(y.status).toBe(422);
    const g = await y.json();
    expect(g.durum).toBe("hata");
    expect(Object.keys(g.alanlar)).toEqual(["eposta", "aciklama"]);
    expect(depo.kayitlar).toHaveLength(0);
  });

  describe("başarı yalnız kayıt gerçekten yazılınca", () => {
    it("veritabanı yazamazsa → 500, başarı yok, ham hata kullanıcıya gitmez", async () => {
      depo.kayitHatasi = new Error("connection to server at 10.0.0.1 failed: password authentication");
      const y = await basvuruIsle(istek(gecerli), depo);
      expect(y.status).toBe(500);
      const metin = await y.text();
      expect(metin).not.toContain("kaydedildi");
      expect(metin).not.toMatch(/10\.0\.0\.1|password|connection/);
      expect(JSON.parse(metin).mesaj).toMatch(/kaydedilemedi/);
      expect(depo.kayitlar).toHaveLength(0);
    });

    it("veritabanına hiç ulaşılamazsa (sayaç sorgusu düşer) → 500, kayıt yok", async () => {
      depo.sayacHatasi = new Error("fetch failed");
      const y = await basvuruIsle(istek(gecerli), depo);
      expect(y.status).toBe(500);
      expect((await y.json()).durum).toBe("hata");
      expect(depo.kayitlar).toHaveLength(0);
    });

    it("yanıt, kaydet() tamamlanmadan dönmez", async () => {
      let bitir!: (id: number) => void;
      const yavas: Depo = {
        istekSay: async () => 1,
        kaydet: () => new Promise((r) => (bitir = r)),
      };
      let dondu = false;
      const bekleyen = basvuruIsle(istek(gecerli), yavas).then((y) => ((dondu = true), y));
      await new Promise((r) => setTimeout(r, 20));
      expect(dondu).toBe(false);
      bitir(7);
      const y = await bekleyen;
      expect(y.status).toBe(201);
      expect((await y.json()).kayitNo).toBe(7);
    });
  });

  it("tuzak alan doluysa → 400, kayıt yok", async () => {
    const y = await basvuruIsle(istek({ ...gecerli, web_sitesi: "http://spam.example" }), depo);
    expect(y.status).toBe(400);
    expect(depo.kayitlar).toHaveLength(0);
  });

  it("JSON olmayan içerik türü → 415", async () => {
    const y = await basvuruIsle(istek("isim=x", { "content-type": "application/x-www-form-urlencoded" }), depo);
    expect(y.status).toBe(415);
    expect(depo.kayitlar).toHaveLength(0);
  });

  it("bozuk JSON → 400", async () => {
    const y = await basvuruIsle(istek("{bozuk"), depo);
    expect(y.status).toBe(400);
  });

  it("sınırı aşan gövde → 413 (Content-Length bildirilmişse okunmadan)", async () => {
    const buyuk = { ...gecerli, aciklama: "x".repeat(GOVDE_SINIRI) };
    const y = await basvuruIsle(istek(buyuk), depo);
    expect(y.status).toBe(413);
    expect(depo.kayitlar).toHaveLength(0);
  });

  it("sınırı aşan gövde → 413 (Content-Length yoksa akış okunurken kesilir)", async () => {
    const parca = new TextEncoder().encode("x".repeat(4096));
    let gonderilen = 0;
    const akis = new ReadableStream<Uint8Array>({
      pull(c) {
        gonderilen += parca.byteLength;
        if (gonderilen > GOVDE_SINIRI * 4) c.close();
        else c.enqueue(parca);
      },
    });
    const r = new Request("http://localhost/api/basvuru", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: akis,
      duplex: "half",
    } as RequestInit);
    const y = await basvuruIsle(r, depo);
    expect(y.status).toBe(413);
    expect(gonderilen).toBeLessThan(GOVDE_SINIRI * 2);
  });

  it(`hız sınırı: aynı istemciden ${HIZ_SINIRI.istek} başvurudan sonrası → 429`, async () => {
    const ip = { "x-nf-client-connection-ip": "203.0.113.9" };
    for (let i = 0; i < HIZ_SINIRI.istek; i++) {
      expect((await basvuruIsle(istek(gecerli, ip), depo)).status).toBe(201);
    }
    const y = await basvuruIsle(istek(gecerli, ip), depo);
    expect(y.status).toBe(429);
    expect(y.headers.get("retry-after")).toBe(String(HIZ_SINIRI.pencereDakika * 60));
    expect(depo.kayitlar).toHaveLength(HIZ_SINIRI.istek);

    // Başka istemci etkilenmez; IP açık değil özet olarak saklanır.
    const baska = await basvuruIsle(istek(gecerli, { "x-nf-client-connection-ip": "198.51.100.4" }), depo);
    expect(baska.status).toBe(201);
    expect([...depo.sayaclar.keys()].every((k) => /^[0-9a-f]{64}$/.test(k))).toBe(true);
  });
});
