# Ödev kontrol raporu

Her ödev şartı için durum ve kanıt. Durum: **karşılanıyor** · **kısmen** · **karşılanmıyor** · **açık** (bize bağlı değil).
Tarih: 6 Ekim 2026, teslim öncesi denetim (16.43'ten sonra). Test sayıları `docs/TEST-RAPORU.md`'de.

| # | Şart | Durum | Kanıt |
|---|---|---|---|
| 1 | Bir hizmet için tanıtım sayfası | Karşılanıyor | Hizmet: küçük üretim atölyeleri için dijital iş takibi (K11). `src/app/page.tsx`: sorun → çözüm → örnek ekranlar → fayda → nasıl çalışır → başvuru |
| 2 | Mobil ve masaüstü | Karşılanıyor | Bütün e2e testleri iki ekranda koşar: 390×844 ve 1280×800 (`playwright.config.ts`). "Yatay kaydırma yok" testi iki ekranda geçiyor |
| 3 | Form alanları: isim, e-posta, hizmet seçimi, açıklama | Karşılanıyor | `src/app/BasvuruFormu.tsx`. Hizmet seçimi 3 radyo düğmesi, hepsi bu hizmete bağlı (kurulum, defterden aktarım, ekip eğitimi) |
| 4 | İstemci doğrulaması | Karşılanıyor | Tek şema `src/lib/basvuru.ts` (zod). e2e: "istemci doğrulaması: hatalı form sunucuya gitmez, ilk hatalı alana odaklanır" → istek sayısı 0 |
| 5 | Sunucu doğrulaması | Karşılanıyor | Aynı şema sunucuda. Birim: 422 testi. e2e: gerçek sunucuda 422. Canlı: 422 |
| 6 | Gönderiliyor durumu | Karşılanıyor | Düğme "Gönderiliyor…" ve `aria-disabled`; `role="status"` duyurusu. e2e "başarılı gönderim" testi yanıtı bekletip bunu sınıyor |
| 7 | Başarı durumu | Karşılanıyor | Başarı paneli kayıt numarasını gösterir ve odak alır (e2e) |
| 8 | Hata durumu | Karşılanıyor | 422 alan hatası, 500, beklenmeyen yanıt (200, 502 HTML) ve ağ hatası hata olarak gösterilir; girilen bilgi silinmez (e2e, 4 test). 15 sn zaman aşımı kodda var, ayrı testi yok |
| 9 | Sunucuda kalıcı kayıt | Karşılanıyor | Neon Postgres, `basvurular` tablosu. Canlı test kayıt yazdı; canlı veritabanında 2 kurgusal satır (16.54, salt okuma) |
| 10 | **Başarı yalnız kayıt gerçekten yazıldıysa** | Karşılanıyor | Sunucu 201'i yalnız `INSERT … RETURNING id` döndükten sonra verir. Birim: 4 test (yazamazsa 500; sayaç düşerse 500; yanıt `kaydet()` bitmeden dönmez; günlükte şifre yok). e2e: gerçek sunucu ulaşılamayan veritabanıyla → 500, arayüzde başarı yok. Arayüz başarıyı yalnız 201 + `durum: "kaydedildi"` ile gösterir |
| 11 | Veri bütünlüğü (veritabanı kuralları uygulamayla aynı) | Karşılanıyor | Bu denetimde bulundu: canlı veritabanında isim ve açıklamanın alt sınırı 1'di (uygulamada 2 ve 10). `db/sema.sql` düzeltildi; canlı için `db/gocler/001` hazır, gerçek Postgres'te (PGlite) sınandı. **Canlıda Emir çalıştırdı** (17.20, `npm run db:goc`): 4 satır, kurala uymayan 0; iki yeni kısıt doğrulandı. Uygulama doğrulaması zaten 2 ve 10'u uyguladığı için kullanıcı tarafında fark yok |
| 12 | Kötüye kullanıma karşı önlem | Karşılanıyor | Tuzak alan, 16 KB gövde sınırı, JSON zorunluluğu, veritabanında hız sınırı (10 dakikada 5), çift gönderim kilidi. Ayrıntı `docs/GUVENLIK-RAPORU.md` |
| 13 | Erişilebilirlik | Karşılanıyor | axe (WCAG 2.2 AA) e2e'de 3 durumda (boş sayfa, hata, başarı), iki ekranda; canlıda 1 kez. Yalnız klavyeyle tam akış testi. Örnek ekranlar `role="img"` + açıklama, içlerinde odak alan öğe yok (test) |
| 14 | Canlı URL | Karşılanıyor | https://enteksisodev.netlify.app son sürümle yayında (Emir onayıyla 17.17'de gönderildi). Canlı test 17.18: 5 geçti, 1 atlandı; güvenlik başlıkları doğrulandı |
| 15 | Repo | Karşılanıyor | https://github.com/emirdnz/enteksis-odev (public) |
| 16 | README | Karşılanıyor | Ne yapar, mimari, sunucuda istek sırası, kurulum, testler, güvenlik, erişilebilirlik, kaynak ve katkı (`create-next-app` iskeleti), harcanan süre, bilinen sınırlar |
| 17 | `AI_LOG.md` | Karşılanıyor | Zaman çizelgesi, karar kaydı, doğrulama, hatalar. Ham kayıt `ai-log/` (otomatik, maskeli) |
| 18 | Commit kimliği | Açık | Son commit kimliği Emir'e verilir (bu dosya o commit'in içinde, burada yazılamaz); teslim formuna Emir yazar |
| 19 | Yalnız kurgusal test verisi | Karşılanıyor | Testler ve örnek ekranlar kurgusal isim kullanır. Altbilgide "gerçek kişisel veri girmeyin" uyarısı |
| 20 | Yazılı problem çözme | Açık | Teslim formunda soruluyor olabilir. Sorular Emir'de; bu raporlar yanıt için malzeme |
| 21 | Süre | Karşılanıyor | Sayaç 6 Eki 13.53 → 7 Eki 13.52. Bu rapor 6 Ekim akşamı yazıldı |

## Kapsam dışı bırakılanlar (bilerek)

- Yönetim ekranı, e-posta onayı, kullanıcı hesabı yok. Ödev istemiyor; kayıtlar SQL ile okunur.
- Hizmet ERP'ye genişletilmedi; örnek ekranlar yalnız iş takibini gösterir (K11).

## Emir'in yapacakları

1. ✅ Canlı veritabanında göç: `npm run db:goc` (madde 11) — 17.20.
2. ✅ GitHub'a gönderme onayı (madde 14) — 17.17.
3. Teslim formu: canlı URL, repo, commit kimliği, yazılı sorular (madde 18, 20).
