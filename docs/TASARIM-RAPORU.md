# Tasarım raporu

## Yaklaşım (son sürüm: açık kurumsal)

- **Açık kurumsal.** Beyaz zemin, lacivert başlık ve yazı, tek vurgu rengi (turuncu). Fayda bölümü ve alt bilgi
  lacivert bant. Kartlarda ince kenar ve yumuşak gölge.
- **Yapışkan üst menü:** Sorun · Çözüm · Ekranlar · Nasıl çalışır · SSS ve "Ön görüşme iste" düğmesi.
  Mobilde menü gizli, düğme görünür (açılır menü için JavaScript gerekmesin diye). Bölümler alt bilgide de listeli.
- **Yazı tipleri:** metin ve başlıkta IBM Plex Sans, iş numarası ve tarihte IBM Plex Mono. Türkçe karakterler
  için `latin-ext` alt kümesi.
- **Tek açık tema.** Atölyede ekran parlaklığı değişken; yüksek karşıtlık her koşulda okunur.
- **Ürün, ERP değil.** Örnek ekranlar yalnız iş takibini gösterir (K11). Sık sorulan sorular bunu açıkça söyler.

Süreç (AI_LOG zaman çizelgesi): ilk sade sürüm 14.51 → Emir "daha güzel, abartmadan" (16.03) →
"yapay zekâ yapmış gibi durmasın" (16.13) → kâğıt/mürekkep sürümü (`6265bee`) → ChatGPT talimatıyla
3 yeni ürün ekranı ve bölüm sırası (`3dc249c`) → Emir "içime sinmedi, daha kurumsal" (17.36) →
açık kurumsal sürüm ayrı dalda yapıldı, Emir yerelde baktı ve seçti (17.58, K33).

## Bölüm sırası

Sorun → çözüm → ekranlar → fayda → nasıl çalışır → sık sorulan sorular → başvuru. e2e testi bu sırayı
başlıklardan sınar.

| # | Bölüm (h2) | İçerik |
|---|---|---|
| — | Giriş (h1 "…defterden çıkarın") | Kısa vaat, iki düğme, üç güvence, atölye panosu örnek ekranı |
| 1 | Tanıdık geliyor mu? | Defterle iş takibinin üç sorunu, simgeli kartlar |
| 2 | Defter yerine tek ekran | Bir işin yolu: sipariş yazılır → tezgâha girer → aşamalar işaretlenir → teslim edilir |
| 3 | Ofiste, tezgâhta, telefonda | Üç örnek ekran (aşağıda) |
| 4 | Tezgâh ile ne değişir? | Üç fayda: işler tek yerde · durumlar görünür · deftere bağımlılık azalır (lacivert bant) |
| 5 | Nasıl çalışır? | Hizmetin üç adımı |
| 6 | Sık sorulan sorular | Beş soru; yalnız sayfada zaten söylenenleri tekrar eder |
| 7 | Ön görüşme talebi | Form |

## Dört örnek ürün ekranı (`src/app/OrnekEkranlar.tsx`)

Hepsi aynı kurgusal işleri gösterir (#209, #211, #214, #217, #218), böylece ekranlar birbirini doğrular.

| Ekran | Ne gösterir |
|---|---|
| Atölye panosu (girişte) | Bekliyor, tezgâhta, teslime hazır sütunları; her kartta aşama, teslim günü, usta |
| İş detayı (#214 mutfak dolabı) | Müşteri, ölçü, teslim ("3 gün kaldı"), beş aşama tarihleriyle, ustanın notu |
| Teslim planı (6–10 Eki) | Gün gün çıkacak işler; sıkışık gün işaretli ("3 günde 3 aşama"), gelecek hafta |
| Telefondan durum (#209 yemek masası) | Usta aşamayı tezgâhın başında işaretler; sıradaki aşama, not ekleme |

- **Sunucu bileşeni:** tarayıcıya JavaScript eklemez.
- **Erişilebilirlik:** her ekran `role="img"` ve açıklayıcı ad ("Örnek ekran: …") taşır. Düğme gibi görünen
  öğeler resmin parçasıdır; odak almaz, klavye sırasına girmez (e2e testi: içlerinde odaklanabilir öğe 0).
- **Kurgusal veri:** başlık "Örnek ekranlar · kurgusal veri"; isimler kurgusal.

## Erişilebilirlik

- axe (WCAG 2.2 AA) e2e'de 3 durumda, iki ekranda: ihlal 0.
- Renk karşıtlığı (WCAG formülüyle hesaplandı): metin beyazda 17.28:1; soluk metin beyazda 7.34:1,
  açık gride 6.78:1; turuncu düğmede beyaz yazı 5.18:1; lacivert bantta beyaz 14.52:1, soluk yazı 8.23:1,
  açık turuncu 8.61:1. Hepsi 4.5:1'in üstünde. Turuncu lacivert üstünde 2.80:1 kalıyor; bu yüzden lacivert
  bölümlerde turuncu yazı ve odak çizgisi yerine açık turuncu kullanılır.
- Görünür odak çizgisi (3 px). Yapışkan menü odaktaki öğeyi örtmesin diye `scroll-padding-top`.
- "İçeriğe geç" bağlantısı, yalnız klavyeyle tam akış (e2e).
- Sık sorulan sorular tarayıcının kendi `<details>` öğesi: JavaScript'siz, klavyeyle açılır (e2e).
- **Başa dön:** sağ altta yuvarlak düğme, sayfa 600 px'ten fazla kaydırılınca belirir. Tıklama düz bağlantı:
  en üste gider, odak içeriğin başına geçer. Görünmezken sekme sırasında ve ekran okuyucuda yok (e2e).
  Mobilde alt bilgi metni düğmenin altında kalmasın diye son satıra boşluk eklendi.
- Animasyon yalnız `motion-safe`: gönderiliyor simgesi, soru işaretinin dönmesi, düğmenin belirmesi.
  Yumuşak kaydırma da yalnız hareket azaltma kapalıysa.

## Ölçüm

`scripts/olc.mjs`, üretim derlemesi, aynı makine, Chromium, ağ/işlemci kısıtlaması yok. Sayılar
makineler arası karşılaştırma için değil, değişikliğin etkisini görmek için.

| Ölçü | İlk sade (`e89d032`, 16.57) | Kâğıt/mürekkep (`3dc249c`, 17.01) | Açık kurumsal (18.01) |
|---|---|---|---|
| HTML | 42.1 KB (gzip 7.6 KB) | 71.9 KB (gzip 12.1 KB) | 102.1 KB (gzip 17.4 KB) |
| JavaScript | 6 dosya, 222.4 KB | 6 dosya, 222.4 KB | 6 dosya, 222.9 KB |
| CSS | 6.5 KB | 6.7 KB | 7.6 KB |
| Yazı tipi | 10 dosya, 375.1 KB | 10 dosya, 375.1 KB | **6 dosya, 101.5 KB** |
| Sayfadaki öğe | 220 | 389 | 518 |
| CLS | 0 | 0 | 0 |
| LCP mobil / masaüstü | 80, 96 / 92, 100 ms | 116, 116 / 112, 124 ms | 96 / 72 ms (tek koşu) |

- Yazı tipi yükü 375.1 KB'tan 101.5 KB'a indi: başlık yazı tipi (Fraunces, boyut ekseni ve italik) çıktı.
  Önceki sürümde "küçültülmedi" denen bulgu (K31) böylece kapandı.
- JavaScript 0.5 KB arttı: yalnız "Başa dön" düğmesinin görünürlüğü için küçük bir istemci bileşeni.
  Sayfa hâlâ statik (derleme çıktısında `○ /`).
- HTML büyüdü (yeni bölümler, simgeler); gzip ile 17.4 KB.

## Canlıda görülen

Netlify sayfanın sağ alt köşesine "Powered by Netlify" rozeti ekliyordu (17.18 ekran görüntüleri); mobilde örnek
panonun köşesini örtüyordu. Rozet bizim kodda yoktu. Emir 17.34'te Netlify ayarından kapattı; canlıda artık yok.
