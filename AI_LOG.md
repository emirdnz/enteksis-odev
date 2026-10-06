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

## Doğrulama

| Ne | Nasıl | Sonuç |
|---|---|---|
| İskelet | `npm run build` | Geçti (13.5x) |
| Kayıt betiği | Geçici kopyada 7 kontrol: hook her durumda 0 ile çıkıyor ve ekrana yazmıyor; bağlantı adresi, `npg_`, `ghp_`, `nfp_`, `DATABASE_URL=` maskeleniyor; proje yolu `.`, kullanıcı klasörü `~` oluyor; bozuk girdi olay yazmıyor, hata dosyasına düşüyor; özet doğru sayıyor | 7/7 geçti |
| Uçtan uca | Proje klasöründe `claude -p` ile gerçek Claude Code oturumu (14.18): hook'lar tetiklendi mi? | 5 olay yazıldı (başlangıç, istem, `Read`, tur sonu, kapanış), döküm üretildi, hata kaydı oluşmadı |
| Döküm | Kurulum oturumunun gerçek transcript'inden döküm üretildi, kişisel bilgi desenleriyle tarandı | İlk taramada bulgu vardı (aşağıda); temizlikten sonra 0 eşleşme |

## Hatalar ve düzeltmeler

| Ne oldu | Nerede | Ne yapıldı |
|---|---|---|
| İlk deneme bozuk veri gönderdi | Deneme komutunda (betikte değil): bu makinedeki kabuk tek tırnak içindeki `\` işaretlerini siliyordu | Deneme ayrı `.mjs` dosyasına taşındı, kabuk kaçışı ortadan kalktı |
| Olay adı olmayan girdi boş satır yazıyordu | `ai-kayit.mjs` | Olay adı yoksa çıkış eklendi |
| Claude çalışırken yazılan mesajlar dökümde yoktu | Transcript'te `queued_command` eki olarak duruyordu | Dökümde "(Claude çalışırken)" başlığıyla eklendi |
| `/model` gibi komutlar dökümde yoktu | Transcript'te `system/local_command` satırıydı | Dökümde gösterildi |
| Otomatik deneme istemi "Emir" diye etiketlenmişti | Döküm üretimi her kullanıcı satırını insan sayıyordu | `claude -p` istemi ayrı etiketleniyor ("Otomatik istem") |
| Dökümde ödev dışı bilgi vardı: Windows kullanıcı adı (`ls` çıktısı), kişisel ayar ve not dosyalarının içeriği, bağlam özeti | Kurulum oturumu genel çalışma alanında açılmıştı; araç çıktıları dökümde | Kullanıcı adı maskeleniyor; bağlam özeti yalnız işaretleniyor; elle dökümde desene uyan çıktı bloğu çıkarılıp yeri işaretleniyor (desen listesi repo dışında) |

## Bilinen eksikler

- Modelin iç düşünce metni Claude Code kaydında tutulmadığı için dökümde yok.
- ChatGPT konuşmaları otomatik kaydedilmez; `ai-log/chatgpt.md`'ye elle eklenir.
