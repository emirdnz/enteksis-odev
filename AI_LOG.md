# AI_LOG — Enteksis değerlendirme projesi

Bu dosya projede yapay zekâyı nasıl kullandığımın özetidir. Ham kayıtlar `ai-log/` klasöründe ve
otomatik tutulur; buradaki her satır oradaki bir kayda dayanır.

## Araçlar ve görev dağılımı

| Araç | Ne için | Karar |
|---|---|---|
| Claude Code (Opus 5.5) | Kod, test, komutlar, belge taslakları | Emir |
| ChatGPT | Plan ve kod incelemesi (ikinci göz) | Emir |

Kararları ben (Emir) verdim. Hesaplar (GitHub, Netlify, Neon), gizli değişkenler ve teslim bende.

## Kayıt nasıl tutuldu

- **Otomatik — Claude Code hook'ları** (`.claude/settings.json` → `.claude/hooks/ai-kayit.mjs`):
  - `ai-log/olaylar.jsonl` — her istem, her araç çağrısı, sonucu (tamam/hata) ve saati.
  - `ai-log/oturumlar/*.md` — her tur sonunda konuşmanın okunur dökümü (istem, cevap, araç, komut çıktısı).
  - Yazmadan önce bağlantı adresi, token gibi gizli değerler ve yerel klasör yolları maskelenir.
  - `npm run ai-log:ozet` — kayıtlardan sayılarla özet üretir.
- **Elle — ChatGPT:** `ai-log/chatgpt.md` (gönderdiğim istem, cevabın özeti, kabul/ret).
- **Bilinen boşluk:** Sayaçtan önceki hazırlık ve iskelet kurulumu (13.55) kayıt altyapısı kurulmadan önce
  yapıldı. O oturum başvuruyla ilgili kişisel bilgiler de içerdiği için ham dökümü eklenmedi; ödevle ilgili
  adımları aşağıda özetledim. Kayıt altyapısının kurulduğu oturum 14.03'ten itibaren aynı betikle
  dökülerek eklendi.

## Zaman çizelgesi (6 Ekim 2026, İstanbul saati)

| Saat | Ne oldu | Araç |
|---|---|---|
| Sayaç öncesi | İlan ve değerlendirme rehberi okundu; yığın, yayın ve veritabanı kararları; iş planı | Claude Code |
| 13.53 | 24 saatlik sayaç başladı | — |
| 13.55 | `create-next-app` ile Next.js 16.3.8 iskeleti; `.env.example`; `npm run build` geçti | Claude Code |
| 14.01 | Durum özeti: kalan süre, eksikler (git/repo yok, hizmet seçilmedi) | Claude Code |
| 14.03 | Emir: "Önce tüm konuşma ve araç kullanımı kayda geçsin" → kayıt altyapısı işi | — |
| 14.05–14.12 | Kayıt betiği + hook ayarı yazıldı; geçici klasörde 7 kontrolle denendi | Claude Code |
| 14.13 | **Emir müdahalesi:** Claude planı anlatmadan uygulamaya geçmişti. Emir durdurup açıklama istedi → 6 adımlı plan ve bulunan hatalar yazıldı, onaydan sonra devam edildi | — |
| 14.15 | ChatGPT'ye danışma istemi hazırlandı (`ai-log/chatgpt.md`) | Claude Code → ChatGPT |
| 14.18 | İlk commit (`78b7df4`, yalnız iskelet). Proje klasöründe `claude -p` ile gerçek oturum açılıp hook'lar uçtan uca denendi | Claude Code |
| 14.19 | Dökümde otomatik deneme istemi "Emir" diye etiketlenmişti → düzeltildi | Claude Code |
| 14.21 | Bağlam penceresi doldu; Claude Code konuşmayı özetleyip devam etti | — |
| 14.22 | Commit öncesi kişisel bilgi taraması: dökümde ödev dışı dosya içerikleri bulundu → temizlendi | Claude Code |
| 14.22 | ChatGPT cevabı geldi: 6 öneri kabul, hizmet seçimi Emir'de (`ai-log/chatgpt.md`) | ChatGPT |
| 14.22 | **Emir kuralı:** veritabanında yıkıcı işlem AI'a doğrudan çalıştırılmaz (K8) | — |
| 14.27 | Emir: hizmet A (atölye iş takibi) seçildi (K11); public GitHub reposuna gönderme onaylandı | — |
| 14.29 | Commit biçimi tartışıldı: Emir tek commit önerdi, Claude Code adım adım commit önerdi → Emir kabul etti (K12) | Claude Code |
| 14.30 | Public repo açıldı ve gönderildi: `github.com/emirdnz/enteksis-odev` | Claude Code |
| 14.33 | Kurulum oturumu kapandı; son dökümü elle alındı. Ödev, proje klasöründe açılan yeni oturumda otomatik kayıtla sürer | Claude Code |
| 14.34 | Yeni oturum (proje klasörü, otomatik kayıt). Emir plan istedi → 10 adımlı plan | Claude Code |
| 14.36 | **Emir:** tüm adımlar için yetki; "bana bir şey yaptırma, ciddi sorun olursa söyle" | — |
| 14.37–14.38 | Netlify'da oturum kapalı. Hesaba giriş Claude Code'un güvenlik kuralı gereği yapılamaz → Emir'e soruldu: "Girişi ben yaparım" (K21) | Claude Code |
| 14.39 | Bağımlılıklar: `zod`, `@neondatabase/serverless`; `vitest`, Playwright, axe | Claude Code |
| 14.41–14.44 | Neon: `neonctl` ile tarayıcı yetkilendirmesi, proje (Postgres 18, aws-us-east-2). Havuzlu bağlantı adresi ekrana yazılmadan `.env.local`'a yazıldı | Claude Code |
| 14.42 | Emir, Neon sitesinin "agent skills + MCP kur" istemini yapıştırdı → otomatik güvenlik denetimi global kurulumu engelledi; gereksiz bulundu (K20) | Claude Code |
| 14.46 | Emir durum sordu → engeller ve Netlify'da kendisinin yapacağı 3 adım bildirildi | Claude Code |
| 14.47–14.49 | Şema, sunucu mantığı, API, veritabanı tabloları (`npm run db:kur`); birim testleri 18/18 | Claude Code |
| 14.51 | Bağlam penceresi doldu; Claude Code özetleyip devam etti | — |
| 14.51–14.53 | Landing sayfası ve form; lint + build | Claude Code |
| 14.53–14.57 | Playwright + axe e2e testleri (3 hata bulundu, aşağıda); 30/30 | Claude Code |
| 14.57 | 4 commit (`f1716f2`, `8c92666`, `2294e1e`, `a5a04db`) ve GitHub'a gönderim | Claude Code |
| 14.58 | README yazıldı, AI_LOG güncellendi. Netlify içe aktarımı Emir'de bekliyor | Claude Code |
| 15.00 | Kişisel bilgi olayı fark edildi ve düzeltildi (aşağıda, Hatalar); `be44554` | Claude Code |
| 15.07 | Emir Netlify'da siteyi repodan içe aktardı; `main@be44554` 35 sn'de yayınlandı | Emir |
| 15.08–15.11 | Canlı denetim: sayfa, güvenlik başlıkları, API 405/415/422 doğru. Canlı kayıt 500 döndü, başarı gösterilmedi. Netlify fonksiyon günlüğü ve ortam değişkenleri sayfası salt okunur incelendi: `DATABASE_URL` tanımlı değil | Claude Code |
| 15.18–15.22 | Bağlantı koptu: Emir'in 3 mesajı cevapsız kaldı; `/clear` ile yeni oturum | — |
| 15.23–15.27 | Durum bildirimi. Emir değişkeni eklediğini düşünüyordu → yeniden denetim: canlı kayıt yine 500; Netlify'da proje değişkeni yok, tek yayın 15.07; veritabanı tabloları boş (salt okuma) | Claude Code |
| 15.28–15.33 | Emir değişkeni ekledi. Claude Code değeri ekrana basmadan panoya kopyaladı; Value kutusuna yazmak ona yasak (K21) | Emir + Claude Code |
| 15.39 | Yeniden yayın: "Deploy project" tıklamasını otomatik güvenlik denetimi engelledi → Emir bastı | Emir |
| 15.41 | Canlı kayıt yine 500. Netlify fonksiyon günlüğü: değer `DATABASE_URL="…"` biçiminde, yani satırın tamamı yapıştırılmış; sürücü hatası adresi şifresiyle günlüğe yazmış (Hatalar) | Claude Code |
| 15.45–15.52 | Emir değeri düzeltti (4 yayın bağlamı), yeniden yayınladı | Emir |
| 15.53 | Canlı test 5/5 geçti (1 bilerek atlandı); veritabanında 1 kurgusal kayıt; hız sınırı anahtarı Netlify başlığından geliyor (yedek değer değil) | Claude Code |
| 15.54–15.55 | Günlükte bağlantı şifresi maskeleme + birim testi (K22); README'ye canlı adres | Claude Code |
| 15.56–15.58 | 3 commit (maskeleme, README, AI_LOG); Emir: "GitHub'a yolla" → gönderildi, Netlify yeni sürümü yayınladı | Claude Code |
| 16.00 | Yeni sürümde canlı test: 5 geçti, 1 atlandı | Claude Code |
| 16.01 | Emir ödevin amacını sordu (tek sayfa + gerçekten çalışan form + veritabanı) → kısa, evet/hayır cevap | Claude Code |
| 16.03–16.11 | **Emir:** "Tasarım daha güzel olsun, abartmadan" → yeni görünüm, e2e geçti, yerel önizleme Emir'e açıldı | Claude Code |
| 16.13–16.16 | **Emir:** "Yapay zekâ yapmış gibi durmasın" → kâğıt/mürekkep görünümü: Fraunces + IBM Plex, renk karşıtlığı hesaplandı (K30) | Claude Code |
| 16.18–16.20 | Emir örnek ekranı beğenmedi → atölye panosu yeniden çizildi | Claude Code |
| 16.28–16.32 | Emir: ChatGPT'ye verilecek proje raporu, D diskine md → yazıldı, panoya kopyalandı (Hatalar: proje dışı klasör listelendi) | Claude Code |
| 16.39 | ChatGPT'nin teslim öncesi denetim talimatı yapıştırıldı (`ai-log/chatgpt.md` §2) | ChatGPT |
| 16.40 | Salt okuma denetim: canlı başlıklar (HSTS var, CSP yok), `npm audit`, GitHub tarama durumu, Next.js CSP rehberi; 8 adımlı plan Emir'e | Claude Code |
| 16.43 | **Emir:** "kalsın, yap" — ham kayıt repoda kalır (K23), plan onaylandı | — |
| 16.44–16.47 | Kayıt temizliği (Hatalar); commit: tasarım `6265bee`, kayıt betiği `f926351` | Claude Code |
| 16.48–16.54 | Veri bütünlüğü: uzunluk karakterle ölçülür, şema 2/10, göç 001 + `db:goc`, gerçek Postgres testleri; canlıda salt okuma ön kontrol; `c194ec0` (K24–K26) | Claude Code |
| 16.54–16.57 | Güvenlik: CSP (K27); çift gönderim testi önce düştü → `useRef` kilidi (K29); `e89d032` | Claude Code |
| 16.57–17.01 | Tasarım: önce ölçüm, 3 yeni ürün ekranı + 2 bölüm, sonra ölçüm; `3dc249c` (K30) | Claude Code |
| 17.02 | Tam koşu: lint, tip, birim, `npm audit` | Claude Code |
| 17.04–17.14 | `docs/` altında 5 rapor; README ve AI_LOG güncellendi | Claude Code |
| –17.16 | Commit öncesi tarama, `1e78c17`; son doğrulama: audit, lint, tip, derleme, birim, e2e | Claude Code |
| 17.17 | **Emir:** "gönderebilirsin" → GitHub'a gönderildi, Netlify yeni sürümü yayınladı | Claude Code |
| 17.18 | Canlı başlıklar, canlı test, mobil ve masaüstü ekran görüntüsü; yerel önizleme (`localhost:3000`) Emir'e açıldı | Claude Code |
| 17.19 | Emir yerelde formu gönderdi, ekranda "kayıt numaranız 4" → salt okuma sorgusuyla veritabanında görüldü | Emir · Claude Code |
| 17.20–17.21 | **Emir göç 001'i canlıda çalıştırdı** (`npm run db:goc`); salt okuma sorgusuyla kısıtlar doğrulandı | Emir · Claude Code |
| 17.21–17.23 | Raporlar son duruma getirildi; `7b8b5b8` gönderildi | Claude Code |
| 17.24 | Canlı kontrolde site bir kez yanıt vermedi (000); hemen tekrar: sayfa 200, API 422 | Claude Code |
| 17.25 | **Emir:** kayıt 4'ü Neon panelinde gördü, form çalışıyor; "bütün her şeyi pushlayacağız" → kalan kayıt satırları gönderildi | Emir · Claude Code |

## Karar kaydı

| # | Konu | Karar | Neden |
|---|---|---|---|
| K1 | Yığın | Next.js 16 + TypeScript | Tek projede ön yüz + sunucu; Netlify destekli |
| K2 | Veritabanı | Neon (Postgres) | Render'ın ücretsiz Postgres'i 30 günde doluyor; değerlendirme bu süreyi aşabilir |
| K3 | Yayın | Netlify, olmazsa Render | Emir'in son kararı. Not: Render'ın ücretsiz servisi 15 dk trafiksiz kalınca uyuyor (açılış ~1 dk) |
| K4 | Veri erişimi | ORM yok, `@neondatabase/serverless` + parametreli sorgu | Tek tablo için sade; SQL enjeksiyonuna karşı parametreli |
| K5 | Arayüz | Sade | Rehber: "Sade ve işlevsel arayüz tam puan alabilir" |
| K6 | AI kaydı | Claude Code hook'larıyla otomatik | Elle tutulan kayıt unutulur; hook her olayı yakalar |
| K7 | Kayıt kapsamı | Ödev, proje klasöründe açılan ayrı oturumda yürür | Kayıt public repoya gidiyor; kişisel konular karışmasın |
| K8 | Yıkıcı DB işlemi | `DROP`/`DELETE`/`TRUNCATE`/veri değiştiren migration AI tarafından çalıştırılmaz; önce etkisi gösterilir, Emir çalıştırır | Emir'in kuralı: üretim verisinde son kontrol insanda (`CLAUDE.md`) |
| K9 | İş sırası | Önce canlı iskelet, sonra form → doğrulama → DB → başarı zinciri, landing ondan sonra; hız sınırı en sona; 4 saat (30 dk tampon) | ChatGPT önerisi, Claude Code görüşüyle uyumlu; kabul |
| K10 | Kayıt altyapısı | Daha fazla geliştirilmez | ChatGPT önerisi: asıl teslim belgesi AI_LOG.md; kabul |
| K11 | Hizmet | Küçük üretim atölyeleri için dijital iş takibi; dar kapsam, ERP'ye genişletilmez | Emir'in kararı. Gerçek deneyime dayanıyor (aile atölyesinde kâğıt-defter takibi); Claude Code ve ChatGPT de bunu önermişti |
| K12 | Commit biçimi | Her adım ayrı commit, tek işe tek mesaj; geçmiş sonradan birleştirilmez | Emir tek commit önerdi. Claude Code: değerlendirici süreci commit geçmişinden görür, AI_LOG commit kimliklerine atıf yapar, tek parça teslim kopya izlenimi verebilir. Emir kabul etti |
| K13 | Doğrulama | `zod` ile tek şema (`src/lib/basvuru.ts`); form ve API aynı dosyayı kullanır | Claude Code önerdi. İki ayrı kural yazılırsa zamanla ayrışır; Emir'in "tek şema" kararıyla uyumlu |
| K14 | Sunucu ucu | Route handler `POST /api/basvuru` (Server Action değil) | Claude Code önerdi. Durum kodları (201/422/429/500) açık, testte ve `curl` ile sınanabilir; diğer yöntemlere 405 kendiliğinden |
| K15 | Neon bölgesi | aws-us-east-2 | Claude Code seçti: Netlify fonksiyonlarının varsayılan bölgesi us-east-2; veritabanıyla aynı bölge gecikmeyi düşürür |
| K16 | Hız sınırı | Doğrulamadan sonra, kayıttan önce; 10 dakikada 5; anahtar Netlify'ın `x-nf-client-connection-ip` başlığının SHA-256 özeti; tek atomik upsert | Claude Code önerdi. `X-Forwarded-For` istemci tarafından sahtelenebilir; atomik sorgu eşzamanlı isteklerde sayacı kaçırmaz |
| K17 | Veritabanı kısıtları | `CHECK` ile uzunluk ve hizmet listesi | Uygulama doğrulaması atlanırsa bile bozuk veri yazılmaz |
| K18 | Marka | "Tezgâh" (kurgusal); altbilgide kurgusal olduğu ve gerçek kişisel veri girilmemesi yazar | Ödev kuralı: yalnız kurgusal test verisi |
| K19 | E2E ve veritabanı | Yerel e2e sunucusu bilerek ulaşılamayan veritabanı adresiyle açılır; canlı test yalnız `CANLI_URL` ile, tek kurgusal kayıt | Claude Code önerdi. Testler gerçek veriye dokunmaz ve "kayıt yazılamazsa başarı yok" kuralı gerçek sunucuda sınanır |
| K20 | Neon agent skills / MCP | Kurulmadı | Otomatik güvenlik denetimi global kurulumu engelledi. `npx neonctl` işi görüyor; projeye bağımlılık eklemiyor |
| K21 | Netlify girişi ve `DATABASE_URL` | Emir yapar | Claude Code'un güvenlik kuralı hesaba girişi ve gizli değeri forma yazmayı yasaklıyor; ayrıca otomatik denetim `netlify login`'i engelledi |
| K22 | Sunucu günlüğü | Hata mesajındaki bağlantı adresinin kullanıcı adı ve şifresi `//***@` ile maskelenir (`gunlukIcinTemizle`) | Claude Code önerdi. Canlıda sürücü hatası adresi şifresiyle birlikte günlüğe yazdı; günlük özel olsa da şifre orada durmamalı |
| K23 | Ham AI kaydı (`ai-log/`) | Repoda kalır | ChatGPT "gerekli mi" diye sordu. Emir: "kalsın". AI ile üretimin kanıtı; yazılırken maskeleniyor; çıkarmak git geçmişinden zaten silmez |
| K24 | Veritabanı alt sınırları | `sema.sql`'de isim 2, açıklama 10. Canlı için yalnız kısıt ekleyen göç (`db/gocler/001`); **Emir çalıştırır** (`npm run db:goc`; 17.20'de uygulandı) | Denetimde bulundu: veritabanı 1 karakteri kabul ediyordu. K8 gereği üretim verisine dokunan komut Emir'de; göç, kurala uymayan satır varsa hiçbir şeyi değiştirmeden durur |
| K25 | Uzunluk ölçüsü | Karakter (kod noktası) sayılır, JavaScript'in UTF-16 birimi değil | Claude Code buldu: emoji uygulamada 2, Postgres'te 1 sayılıyordu. Artık iki taraf aynı ölçüyü kullanır |
| K26 | Veritabanı testleri | PGlite: bellekte gerçek Postgres, yalnız geliştirme bağımlılığı | Claude Code önerdi. `CHECK` kısıtları ve göç, canlı veritabanına dokunmadan gerçek Postgres'te sınanır |
| K27 | CSP | Nonce'suz; `script-src 'self' 'unsafe-inline'` | Next.js rehberi: nonce her isteği dinamik yapar. Sayfa statik kalsın; sayfa kullanıcı verisi göstermiyor. HSTS kodda yok: Netlify zaten gönderiyor (`curl` ile görüldü) |
| K28 | Marka yazımı | "Tezgâh" | ChatGPT talimatında "TEZGAH" geçiyordu. Doğru Türkçe yazım kalır; Emir planla onayladı |
| K29 | Çift gönderim | `useRef` kilidi | Yeni test, aynı görevdeki iki gönderimde 2 istek gittiğini gösterdi; durum (state) kontrolü eski değeri görüyordu |
| K30 | Tasarım | Kâğıt/mürekkep; 4 kurgusal ürün ekranı (pano, iş detayı, teslim planı, telefon); sıra sorun → çözüm → ekranlar → fayda | Emir'in istekleri (16.03, 16.13, 16.18) + ChatGPT talimatı (en az 4 ekran, SaaS paneli değil). Ekranlar sunucu bileşeni: JavaScript eklemez |
| K31 | Yazı tipleri | Küçültülmedi | Ölçümde en büyük yük (375 KB). Küçültmek görünümü değiştirir; teslimden önce kapsam dışı. `docs/TASARIM-RAPORU.md`'de yazılı |

## Doğrulama

| Ne | Nasıl | Sonuç |
|---|---|---|
| İskelet | `npm run build` | Geçti (13.5x) |
| Kayıt betiği | Geçici kopyada 7 kontrol: hook her durumda 0 ile çıkıyor ve ekrana yazmıyor; bağlantı adresi, `npg_`, `ghp_`, `nfp_`, `DATABASE_URL=` maskeleniyor; proje yolu `.`, kullanıcı klasörü `~` oluyor; bozuk girdi olay yazmıyor, hata dosyasına düşüyor; özet doğru sayıyor | 7/7 geçti |
| Uçtan uca | Proje klasöründe `claude -p` ile gerçek Claude Code oturumu (14.18): hook'lar tetiklendi mi? | 5 olay yazıldı (başlangıç, istem, `Read`, tur sonu, kapanış), döküm üretildi, hata kaydı oluşmadı |
| Döküm | Kurulum oturumunun gerçek transcript'inden döküm üretildi, kişisel bilgi desenleriyle tarandı | İlk taramada bulgu vardı (aşağıda); temizlikten sonra 0 eşleşme |
| Neon bağlantısı | Adres ekrana yazılmadan maskeli ayrıştırıldı | Havuzlu (pooler) adres, `.env.local`'da; `.gitignore` kapsamında |
| Tablolar | `npm run db:kur` | `tablolar: basvurular, hiz_siniri` |
| Birim + sunucu | `npx vitest run` | 18/18 |
| Lint | `npm run lint` | 0 hata, 0 uyarı (ilk koşudaki 1 uyarı düzeltildi) |
| Derleme | `npm run build` | Geçti; `/` statik, `/api/basvuru` dinamik |
| E2E | `npx playwright test` (15 test × mobil 390×844 + masaüstü 1280×800, axe WCAG 2.2 AA) | 30/30 |
| Commit öncesi tarama | `ai-log/` ve `AI_LOG.md`'de bağlantı adresi, parola, `npg_`/`ghp_`/`nfp_`/`sk-` token, e-posta, kullanıcı klasörü | Gizli değer 0. `sk-` eşleşmeleri "ta**sk-**id" (yanlış alarm). Neon proje ve organizasyon kimliği var: gizli değil, erişim vermez |
| Canlı (ilk yayın, 15.08) | `curl` ile `/` ve `/api/basvuru`; `CANLI_URL=https://enteksisodev.netlify.app npx playwright test` | Sayfa 200, güvenlik başlıkları var, `x-powered-by` yok; API GET 405, form-urlencoded 415, geçersiz 422. Playwright: 4 geçti, 1 atlandı (mobilde kayıt bilerek yok), 1 düştü (canlı kayıt → 500, nedeni Hatalar'da) |
| Canlı (değişken düzeltildikten sonra, 15.53) | `CANLI_URL=… npx playwright test tests/e2e/canli.spec.ts`; veritabanında salt okuma sorgusu | 5 geçti, 1 atlandı. `basvurular`: 1 satır. `hiz_siniri` anahtarı "yerel" yedeğinin özeti değil → `x-nf-client-connection-ip` başlığı geliyor, ziyaretçiler ayrı sayılıyor |
| Maskeleme düzeltmesinden sonra | `npx vitest run`, `npm run lint`, `npm run build`, `npx playwright test` | 19/19, 0 uyarı, geçti, 30/30 |
| Kayıt dosyalarında şifre | `ai-log/` ve `AI_LOG.md`'de genel desenle (`npg_…`, `postgresql://kullanıcı:şifre@`) tarama; aranan değer komuta yazılmadı | 0 eşleşme |
| Canlı yeni sürüm (16.00) | `CANLI_URL=… npx playwright test tests/e2e/canli.spec.ts` | 5 geçti, 1 atlandı |
| Tasarım değişiklikleri (16.10, 16.16, 16.20) | `npx playwright test` her değişiklikten sonra | Üç koşuda 30/30 |
| Renk karşıtlığı (16.13) | WCAG formülüyle hesap | Soluk metin kâğıtta 6.49:1, koyu kâğıtta 5.78:1; pas düğmede beyaz 6.79:1; hepsi ≥ 4.5:1 |
| Göç ön kontrolü, canlı (16.54) | `npm run db:goc -- --kontrol` (salt okuma) | 4 eski `CHECK` kısıtı; 2 satır, yeni kurala uymayan 0 |
| Veri bütünlüğü (16.53) | `npx vitest run` | 26/26 (veritabanı testleri 6/6) |
| Testin hatayı yakaladığı (16.53) | Uzunluk düzeltmesi bilerek geri alındı, testler koşuldu, düzeltme geri kondu | 3 test düştü; geri koyunca hepsi geçti |
| Çift gönderim (16.55–16.56) | Yeni e2e testi kilitten önce ve sonra | Önce düştü (2 istek), sonra geçti; e2e 34/34 |
| CSP (16.56) | `npm run build`; e2e'de başlık ve konsol | `/` hâlâ statik; CSP ihlali 0; üretimde `unsafe-eval` yok |
| Sayfa ölçümü (16.57 → 17.01) | `node scripts/olc.mjs`, üretim derlemesi, aynı makine | JavaScript 222.4 KB, değişmedi; HTML gzip 7.6 → 12.1 KB; CLS 0 → 0; LCP 80–100 → 112–124 ms. Ayrıntı `docs/TASARIM-RAPORU.md` |
| Tam koşu (17.01–17.02) | `npx playwright test`, `npx eslint .`, `npx tsc --noEmit`, `npx vitest run`, `npm audit` | 36/36, 0, 0, 26/26. Audit: yayına giden paketlerde 0; geliştirmede 5 yüksek (lint aracı zinciri, düzeltmesi yok) |
| Commit öncesi tarama (16.47, 16.54, 16.57, 17.01) | Genel gizli değer ve yerel yol desenleri + repo dışı yerel terim listesi (`grep -f`, yalnız sayı) | 0 eşleşme |
| GitHub (16.40) | Repo güvenlik ayarları | Secret scanning ve push protection açık, uyarı 0; Dependabot kapalı |
| Commit öncesi tarama (17.15) | Aynı desenler + yerel terim listesi, yalnız sayı | Gerçek değer 0. Tek eşleşme: AI_LOG'daki desen tarifinde yer tutucu "şifre" kelimesi |
| Son doğrulama, gönderme öncesi (17.15–17.16) | `npm audit --omit=dev`, `npm audit`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npx vitest run`, `npm run test:e2e` | Yayın 0 açık; geliştirme 5 yüksek (aynı zincir); lint 0; tip 0; derleme geçti (`/` statik); 26/26; 36/36; 3217 portu kapandı |
| Canlı başlıklar (17.18) | `curl -sI`; API'ye boş gövde | CSP (`unsafe-eval` 0), HSTS, nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy. API: 422 ve `Cache-Control: no-store` |
| Canlı test (17.18) | `CANLI_URL=… npx playwright test tests/e2e/canli.spec.ts` | 5 geçti, 1 atlandı |
| Canlı görünüm (17.18–17.19) | Ekran görüntüsü 390×844 ve 1280×800 | Yatay kaydırma yok; pano tam. Netlify'ın "Powered by Netlify" rozeti sağ altta sayfanın üstünde (kodda yok) |
| Yerel form → veritabanı (17.19) | Emir yerelde gönderdi; salt okuma `SELECT` (ad ve e-posta yazdırılmadı) | Ekranda kayıt 4; veritabanında 4 numara, 17.19 |
| Göç 001, canlı (17.20–17.21) | Emir: `npm run db:goc`; sonra salt okuma `pg_constraint` | "satır: 4 · yeni kurala uymayan: 0 · uygulandı". `basvurular_isim_en_az` (≥ 2) ve `basvurular_aciklama_en_az` (≥ 10) etkin, doğrulanmış; satır sayısı 4, değişmedi |

## Hatalar ve düzeltmeler

| Ne oldu | Nerede | Ne yapıldı |
|---|---|---|
| İlk deneme bozuk veri gönderdi | Deneme komutunda (betikte değil): bu makinedeki kabuk tek tırnak içindeki `\` işaretlerini siliyordu | Deneme ayrı `.mjs` dosyasına taşındı, kabuk kaçışı ortadan kalktı |
| Olay adı olmayan girdi boş satır yazıyordu | `ai-kayit.mjs` | Olay adı yoksa çıkış eklendi |
| Claude çalışırken yazılan mesajlar dökümde yoktu | Transcript'te `queued_command` eki olarak duruyordu | Dökümde "(Claude çalışırken)" başlığıyla eklendi |
| `/model` gibi komutlar dökümde yoktu | Transcript'te `system/local_command` satırıydı | Dökümde gösterildi |
| Otomatik deneme istemi "Emir" diye etiketlenmişti | Döküm üretimi her kullanıcı satırını insan sayıyordu | `claude -p` istemi ayrı etiketleniyor ("Otomatik istem") |
| Dökümde ödev dışı bilgi vardı: Windows kullanıcı adı (`ls` çıktısı), kişisel ayar ve not dosyalarının içeriği, bağlam özeti | Kurulum oturumu genel çalışma alanında açılmıştı; araç çıktıları dökümde | Kullanıcı adı maskeleniyor; bağlam özeti yalnız işaretleniyor; elle dökümde desene uyan çıktı bloğu çıkarılıp yeri işaretleniyor (desen listesi repo dışında) |
| `npm install` ERESOLVE | vitest 5, `@types/node` 22+ istiyor; iskelette 20 vardı | `@types/node@^24` |
| Neon yetkilendirmesi "CSRF value … does not match" | İlk tarayıcı yetkilendirmesi | Yeni yetki adresiyle tekrarlandı, geçti |
| `neonctl projects list` JSON yerine soru sordu | Birden çok organizasyon olduğu için etkileşimli seçim | `--org-id` verildi, girdi kapatıldı |
| Vite uyarısı: ESM yapılandırma CJS dosyada | `vitest.config.ts` | `vitest.config.mts` |
| Tarayıcı eklentisi Netlify sayfasında ekran görüntüsü alamadı | Site izni yoktu | Emir izin verdi |
| Otomatik güvenlik denetimi 3 komutu engelledi: global Neon CLI kurulumu (agent skills/MCP), `netlify login`, tarayıcıda Netlify proje oluşturma sayfası | Claude Code izin katmanı | Atlatma denenmedi. Netlify adımları Emir'e devredildi (K21); Neon eklentileri kurulmadı (K20) |
| E2E ilk koşu: 36 test düştü, sayfa başka bir uygulamaya aitti | 3100 portunda başka bir uygulama çalışıyordu; ayar mevcut sunucuyu yeniden kullanıyordu | Port 3217; mevcut sunucuyu yeniden kullanma kapatıldı. O uygulamaya dokunulmadı |
| E2E: tarayıcı bulunamadı | Playwright 1.63'ün istediği Chromium sürümü yoktu | `npx playwright install chromium` |
| E2E: 8 test "strict mode violation" | Next.js'in sayfa duyurucusu da `role="alert"` taşıyor; seçici iki öğe buldu | Seçici formun içiyle sınırlandı. Uygulama hatası değildi |
| Lint uyarısı: radyo düğmesinde `aria-invalid` desteklenmiyor | `BasvuruFormu.tsx` | Kaldırıldı; hata metni `fieldset`'e `aria-describedby` ile bağlı |
| **Kişisel bilgi public repoya gitti (15.00):** Claude Code'un kişisel bilgi tarama komutu, aranan e-posta kullanıcı adını desen olarak içeriyordu; komut kayda düştü. Tarama eşleşme bulduğu hâlde aynı komut zinciri durmadan commit'leyip gönderdi (`c33e7f4`) | Tarama ile commit tek komutta zincirlenmişti; arada kontrol yoktu. Hook bu terimi maskelemiyordu | Hook'a gitignore'lu yerel terim listesiyle maskeleme ve `yeniden-maskele` komutu eklendi; eski kayıtlar yeniden maskelendi (0 eşleşme). Tarama ve commit artık ayrı adım. `c33e7f4` geçmişte duruyor; geçmişi yeniden yazmak Emir'in kararı |
| Canlı kayıt 500 "Talebiniz şu an kaydedilemedi" (15.08) | Netlify: proje ortam değişkeni yok. Günlük: `[basvuru] kaydedilemedi: Error: DATABASE_URL tanımlı değil`. Veritabanında `basvurular` ve `hiz_siniri` boş, yani istek veritabanına hiç ulaşmadı | Gizli değeri forma Claude Code yazamaz (K21). Emir değişkeni ekleyip yeniden yayınlayacak. Olumlu yan: "kayıt yazılmadıysa başarı yok" kuralı canlıda da tuttu |
| Değişken eklendi sanıldı, eklenmemişti (15.23) | Netlify: proje değişkeni yoktu, tek yayın 15.07 | Yeniden denetlendi, Emir ekledi |
| Değer yanlış biçimde kaydedildi (15.41) | Value kutusuna `.env.local` satırının tamamı (`DATABASE_URL="…"`) girildi; sürücü "not a valid URL" dedi | Emir 4 bağlamda değeri düzeltti; Claude Code doğru değeri panoya koydu ve biçimini (başı `postgresql://`, tırnak yok) ekrana basmadan denetledi |
| **Şifre sunucu günlüğüne yazıldı (15.41):** sürücü hatası bağlantı adresini olduğu gibi içeriyordu, kod mesajı günlüğe aynen yazıyordu | `src/lib/basvuru-isle.ts`. Netlify günlüğü yalnız hesap sahibine açık, 24 saat tutulur; public değil | K22: maskeleme + birim testi. Public kayıt dosyaları tarandı: 0 eşleşme |
| Talimatlar Emir'e karışık geldi | Claude Code'un adım listeleri uzundu, "Value" kutusunun ne olduğu anlatılmamıştı | Adımlar tek kutu, tek düğmeye indirildi; menüler Emir'e açık hâlde bırakıldı |
| Komut girdi beklerken takıldı (16.09) | Form görünümü komutu `cat > geçici-dosya` ile başlıyordu, girdi bekledi | Komut durduruldu, boş geçici dosya silindi; betik çalışma klasörüne yazılıp çalıştırıldı |
| **Proje dışı klasör listelendi (16.30):** D: kökü listelendi; çıktıdaki kişisel dosya adları kayda düştü | Rapor D: köküne yazılacaktı, yer kontrolü için `ls`. Kural: bu oturumda proje dışı klasör okunmaz | Adlar yerel maske listesine eklendi, kayıtlar yeniden maskelendi (16.44): 0 eşleşme. Henüz commit'lenmemişti |
| D: köküne yazılamadı (16.31) | `Write` aracı `EPERM` verdi | Rapor çalışma klasörüne yazılıp kopyalandı |
| Panoda Türkçe karakter bozuldu (16.32) | `clip.exe` | PowerShell `Set-Clipboard` ile UTF-8 okunarak kopyalandı |
| **`yeniden-maskele` 4 JSON satırını bozdu (16.44)** | Satır düz metin gibi değiştiriliyordu; kaçışlı karakterlere denk gelen değişiklik JSON'u bozdu (satır 55, 317, 336, 349) | Betik artık her satırı JSON olarak çözüp değerleri maskeliyor. Özet bozuk satırı atlayıp numarasını yazıyor. Kayıt elle düzeltilmedi (Bilinen eksikler) |
| Özet betiği `zaman` alanı olmayan satırda çöktü | `ai-kayit.mjs ozet` | Alan yoksa satır atlanıyor |
| Metin değiştirme CRLF dosyada eşleşmedi | Node ile yapılan değişiklik; dosya Windows satır sonluydu | `Edit` aracıyla yapıldı |
| PGlite kayıt numarasını sayı döndürdü (16.53) | Test `BigInt` bekliyordu | Test beklentisi sayıya çevrildi |
| **Çift gönderimde 2 istek (16.55)** | Yeni e2e testi buldu: `BasvuruFormu.tsx` kilidi React durumuna bakıyordu | `useRef` kilidi (K29); test geçti |
| Taşıma sonrası artık bileşen (17.00) | `page.tsx`'te kullanılmayan `IsKarti` kalmıştı | Silindi; tip ve lint temiz |
| Uzun AI_LOG değişikliği kabukta tırnak hatası verdi (17.13) | Tek satırlık kabuk komutunda | Betik dosyaya yazılıp çalıştırıldı |
| Göç komutu ilk denemede çalışmadı (17.20) | Komutun sonunda fazladan nokta (`db:goc.`); npm betiği bulamadı | Hiçbir şey değişmedi; noktasız komutla yeniden çalıştırıldı |

## Bilinen eksikler

- Modelin iç düşünce metni Claude Code kaydında tutulmadığı için dökümde yok.
- ChatGPT konuşmaları otomatik kaydedilmez; `ai-log/chatgpt.md`'ye elle eklenir.
- Güvenlik denetiminin engellediği komutlar çalışmadığı için `olaylar.jsonl`'da yok; oturum dökümünde
  (`ai-log/oturumlar/`) ret mesajlarıyla birlikte görünür.
- `olaylar.jsonl`'da 4 satır okunamıyor (satır 55, 317, 336, 349; `yeniden-maskele` hatası, 16.44).
  Elle düzeltilmedi; `npm run ai-log:ozet` bu satırları atlar ve numaralarını yazar. Aynı olaylar oturum dökümünde okunur.
- Canlıda Netlify sağ alt köşeye "Powered by Netlify" rozeti ekliyor; örnek panonun köşesini örtüyor. Kodda yok; kapatma yolu denenmedi.
