@AGENTS.md

# Enteksis değerlendirme ödevi — oturum kuralları

Bu klasörde açılan Claude Code oturumunun her istemi, cevabı ve araç çağrısı **public repoya**
kaydedilir (`ai-log/`). Bu yüzden:
- Bağlam bu dosyada. Genel çalışma alanı dosyaları (`SIMDI.md`, `BASLA.md` vb.) ve proje dışı
  klasörler bu oturumda **okunmaz**.
- Ödev dışı kişisel konu açılmaz. Gizli adres/anahtar sohbete yapıştırılmaz; `.env.local`'a Emir koyar.

## Ödev
- Bir hizmet için landing page (mobil + masaüstü) + form: isim, e-posta, hizmet seçimi, açıklama.
- İstemci + sunucu doğrulaması; gönderiliyor / başarı / hata durumları.
- Sunucuda kalıcı kayıt. **Başarı mesajı yalnız kayıt gerçekten yazıldıysa.**
- Teslim: canlı URL, repo, README, `AI_LOG.md`, commit kimliği. Yalnız kurgusal test verisi.
- Süre: 6 Eki 2026 13.53 → **7 Eki 2026 13.52** (sunucu sayacı). Hedef 3–4 saat aktif emek.
- Puan: ürün 25 · mühendislik 20 · AI ile üretim 20 · erişilebilirlik 10 · test/teslim 10 ·
  yazılı problem çözme 10 · geçmiş katkı 5. Sade ve işlevsel arayüz tam puan alabilir.

## Kararlar (Emir)
- Next.js 16 + TypeScript. ORM yok: `@neondatabase/serverless`, parametreli sorgu.
- Veritabanı Neon (havuzlu bağlantı adresi), yayın Netlify (olmazsa Render). Repo public.
- Hizmet (6 Eki 14.27): **küçük üretim atölyeleri için dijital iş takibi** — kâğıt/defterden dijitale.
  Dar kapsam: tek hizmet, 3 fayda (işler tek yerde · durumlar görünür · defter bağımlılığı azalır).
  ERP'ye genişletilmez, yeni modül icat edilmez. Formdaki hizmet seçenekleri 3 tane, bu hizmete bağlı.
- Doğrulama tek şema (tarayıcı + sunucu): isim 2–100, e-posta biçimi, hizmet listeden, açıklama 10–2000.
- Kötüye kullanım: gizli tuzak alanı, istek boyutu sınırı, hız sınırı veritabanında.

## Rol dağılımı
- **Emir:** karar, hesaplar (GitHub, Netlify, Neon), gizli değişkenler, teslim düğmesi.
- **Claude Code:** kod, test, komut, belge taslağı.
- **ChatGPT:** Emir'in plan/inceleme aracı. Cevabı bu sohbete yapıştırılınca kayda girer;
  özeti `ai-log/chatgpt.md`'ye yazılır.

## Kayıt (otomatik — elle düzenleme)
- `.claude/hooks/ai-kayit.mjs` → `ai-log/olaylar.jsonl` (her istem, araç çağrısı, sonuç) ve
  `ai-log/oturumlar/*.md` (her tur sonunda konuşma dökümü). Gizli değer ve yerel yol maskelenir.
- Betikte hata çıkarsa `ai-log/kayit-hatalari.log`'a düşer; düzelt ve `AI_LOG.md`'ye yaz.

## AI_LOG.md disiplini — her anlamlı adımdan sonra
- **Zaman çizelgesi:** gerçek saat (İstanbul), ne yapıldı, hangi araç.
- **Karar kaydı:** öneri → kimden → kabul/ret → neden.
- **Doğrulama:** çalıştırılan komut + gerçek sonuç (ör. `npm test` → 14/14).
- **Hata:** gerçekten olduysa yaz, uydurma. Bulunmadıysa nasıl doğrulandığını yaz.
- Commit öncesi `ai-log/` dosyalarında gizli değer ya da kişisel bilgi kalmadığını kontrol et.

## Veritabanı ve altyapıda yıkıcı işlem (Emir, 6 Eki 14.22)
- `DROP`, `DELETE`, `TRUNCATE`, mevcut veriyi değiştiren migration, toplu silme **doğrudan çalıştırılmaz**.
- Önce neyin değişeceği gösterilir; mümkünse test veritabanında denenir; geri dönüş yolu yazılır.
- Üretim verisini etkileyebilecek komutu Claude Code çalıştırmaz; Emir son kontrolü yapıp kendisi çalıştırır.
- Yeni tablo oluşturmak (`CREATE TABLE IF NOT EXISTS`) yıkıcı değildir, ama ilk kez de Emir'e gösterilir.

## Emir ile konuşma
- Önce numaralı, sade plan; sonra iş. Biten adım ✅, sıradaki ⏳.
- "Hata" dendiyse aynı cümlede: nerede, ne oldu, ne yapıldı.
- Kısa cümle. Uzun içerik dosyaya.
- Hesap, gizli adres, GitHub'a gönderme, yayın ve teslim Emir'e sorulur.
