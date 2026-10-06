import { describe, expect, it } from "vitest";
import { dogrula } from "@/lib/basvuru";

const gecerli = {
  isim: "Deneme Atölye",
  eposta: "deneme@ornek.com",
  hizmet: "kurulum",
  aciklama: "Siparişleri defterde tutuyoruz, dijitale geçmek istiyoruz.",
};

function hatasi(girdi: unknown, alan: string) {
  const s = dogrula(girdi);
  return s.gecerli ? undefined : s.hatalar[alan as keyof typeof s.hatalar];
}

describe("doğrulama şeması", () => {
  it("geçerli veriyi kabul eder ve baştaki/sondaki boşlukları kırpar", () => {
    const s = dogrula({ ...gecerli, isim: "  Deneme Atölye  ", eposta: " deneme@ornek.com " });
    expect(s).toEqual({ gecerli: true, veri: { ...gecerli } });
  });

  it("isim: 2–100 karakter sınırları", () => {
    expect(hatasi({ ...gecerli, isim: "A" }, "isim")).toMatch(/en az 2/);
    expect(hatasi({ ...gecerli, isim: "   A  " }, "isim")).toMatch(/en az 2/);
    expect(dogrula({ ...gecerli, isim: "Al" }).gecerli).toBe(true);
    expect(dogrula({ ...gecerli, isim: "a".repeat(100) }).gecerli).toBe(true);
    expect(hatasi({ ...gecerli, isim: "a".repeat(101) }, "isim")).toMatch(/en fazla 100/);
  });

  it("e-posta: boş ve biçimsiz adresleri reddeder", () => {
    expect(hatasi({ ...gecerli, eposta: "" }, "eposta")).toBe("E-posta gerekli.");
    for (const e of ["deneme", "deneme@", "@ornek.com", "deneme@ornek", "de neme@ornek.com"]) {
      expect(hatasi({ ...gecerli, eposta: e }, "eposta"), e).toMatch(/Geçerli bir e-posta/);
    }
  });

  it("hizmet: yalnız listedeki değerler", () => {
    for (const h of ["kurulum", "aktarim", "egitim"]) {
      expect(dogrula({ ...gecerli, hizmet: h }).gecerli).toBe(true);
    }
    for (const h of ["", "erp", "KURULUM", 1]) {
      expect(hatasi({ ...gecerli, hizmet: h }, "hizmet")).toBe("Listeden bir hizmet seçin.");
    }
  });

  it("açıklama: 10–2000 karakter sınırları", () => {
    expect(hatasi({ ...gecerli, aciklama: "123456789" }, "aciklama")).toMatch(/en az 10/);
    expect(dogrula({ ...gecerli, aciklama: "1234567890" }).gecerli).toBe(true);
    expect(dogrula({ ...gecerli, aciklama: "ş".repeat(2000) }).gecerli).toBe(true);
    expect(hatasi({ ...gecerli, aciklama: "ş".repeat(2001) }, "aciklama")).toMatch(/en fazla 2000/);
  });

  it("uzunluk karakterle ölçülür, JS'in UTF-16 birimiyle değil (veritabanıyla aynı)", () => {
    // 🔧: JS .length 2, Postgres char_length 1.
    expect(hatasi({ ...gecerli, isim: "🔧" }, "isim")).toMatch(/en az 2/);
    expect(dogrula({ ...gecerli, isim: "🔧".repeat(100) }).gecerli).toBe(true);
    expect(hatasi({ ...gecerli, aciklama: "🔧".repeat(5) }, "aciklama")).toMatch(/en az 10/);
  });

  it("eksik alan ve yanlış tip çökertmez, alan hatası döner", () => {
    const s = dogrula({ isim: 42 });
    expect(s.gecerli).toBe(false);
    if (!s.gecerli) {
      expect(Object.keys(s.hatalar)).toEqual(["isim", "eposta", "hizmet", "aciklama"]);
    }
    expect(dogrula(null).gecerli).toBe(false);
    expect(dogrula("metin").gecerli).toBe(false);
  });

  it("NUL karakterini reddeder (Postgres metin alanı kabul etmez)", () => {
    expect(hatasi({ ...gecerli, aciklama: "geçerli metin\u0000sonu" }, "aciklama")).toMatch(/geçersiz karakter/);
  });
});
