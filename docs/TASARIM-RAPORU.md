# Tasarım raporu

## Yaklaşım

- **Kâğıt ve mürekkep.** Hizmet, atölyeyi defterden dijitale taşımak. Görünüm defter havasında:
  kâğıt rengi zemin, mürekkep rengi metin, tek vurgu rengi (pas). Gölgeler bulanık değil, kâğıt yaprağı gibi
  düz kaydırma. Geçiş rengi (gradient), cam efekti, büyük animasyon yok.
- **Yazı tipleri:** başlıkta Fraunces, metinde IBM Plex Sans, iş numarası ve tarihte IBM Plex Mono.
  Türkçe karakterler için `latin-ext` alt kümesi.
- **Tek açık tema.** Atölyede ekran parlaklığı değişken; yüksek karşıtlık her koşulda okunur.
- **Ürün, SaaS paneli gibi değil.** Örnek ekranlar defter, iş kartı ve telefon gibi tanıdık nesnelere benzer;
  ERP modülü yok, yalnız iş takibi (K11).

Süreç (AI_LOG zaman çizelgesi): ilk sade sürüm 14.51 → Emir "daha güzel, abartmadan" (16.03) →
"yapay zekâ yapmış gibi durmasın" (16.13) → kâğıt/mürekkep sürümü (`6265bee`) → ChatGPT talimatıyla
3 yeni ürün ekranı ve bölüm sırası (`3dc249c`).

## Bölüm sırası

Sorun → çözüm → ekranlar → fayda → nasıl çalışır → başvuru. e2e testi bu sırayı başlıklardan sınar.

| # | Bölüm (h2) | İçerik |
|---|---|---|
| — | Giriş (h1 "…defterden çıkarın") | Kısa vaat + atölye panosu örnek ekranı |
| 1 | Tanıdık geliyor mu? | Defterle iş takibinin sorunları |
| 2 | Defter yerine tek ekran | Bir işin yolu: sipariş yazılır → tezgâha girer → aşamalar işaretlenir → teslim edilir |
| 3 | Ofiste, tezgâhta, telefonda | Üç örnek ekran (aşağıda) |
| 4 | Tezgâh ile ne değişir? | Üç fayda: işler tek yerde · durumlar görünür · deftere bağımlılık azalır |
| 5 | Nasıl çalışır? | Hizmetin adımları |
| 6 | Ön görüşme talebi | Form |

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
- Renk karşıtlığı (hesaplandı, 16.13): soluk metin kâğıt üzerinde 6.49:1, koyu kâğıt üzerinde 5.78:1;
  pas düğmede beyaz metin 6.79:1; pas metin kâğıt üzerinde 6.08:1. Hepsi 4.5:1'in üstünde.
- Görünür odak çizgisi (3 px pas), "İçeriğe geç" bağlantısı, yalnız klavyeyle tam akış (e2e).
- Tek animasyon: gönderiliyor simgesi, yalnız `motion-safe` (hareket azaltma açıksa dönmez). İçerik
  animasyonla gizlenmez; yumuşak kaydırma da yalnız hareket azaltma kapalıysa.

## Ölçüm: tasarımdan önce ve sonra

`scripts/olc.mjs`, üretim derlemesi, aynı makine, Chromium, ağ/işlemci kısıtlaması yok. Sayılar
makineler arası karşılaştırma için değil, değişikliğin etkisini görmek için. Ölçüm 16.57 (önce) ve 17.01 (sonra).

| Ölçü | Önce (`e89d032`) | Sonra (`3dc249c`) |
|---|---|---|
| HTML | 42.1 KB (gzip 7.6 KB) | 71.9 KB (gzip 12.1 KB) |
| JavaScript | 6 dosya, 222.4 KB aktarılan | **Değişmedi:** 6 dosya, 222.4 KB |
| CSS | 6.5 KB | 6.7 KB |
| Yazı tipi | 10 dosya, 375.1 KB | 10 dosya, 375.1 KB |
| Sayfadaki öğe | 220 | 389 |
| CLS | 0 | 0 |
| LCP (iki koşu) mobil / masaüstü | 80, 96 / 92, 100 ms | 116, 116 / 112, 124 ms |

- Yeni ekranlar yalnız HTML ve CSS ekledi; JavaScript aynı kaldı. Sayfa hâlâ statik (derleme çıktısında `○ /`).
- LCP yaklaşık 20–30 ms arttı (daha büyük HTML). Yerel ölçümde fark küçük.

## Bulgu: en büyük yük yazı tipleri

Yazı tipleri 375.1 KB ile sayfanın en ağır parçası (JavaScript'ten de büyük). Nedeni: Fraunces'in
boyut ekseni (`opsz`) ve italik dosyası, Plex Mono'nun iki ağırlığı, her biri `latin` + `latin-ext`.

Azaltma yolları: Fraunces'te `opsz` eksenini kaldırmak, italiği kaldırmak, Plex Mono'yu tek ağırlığa
indirmek. **Bu teslimde yapılmadı:** görünümü değiştirir ve tasarım onaylandıktan sonra kapsam dışı.
Yazı tipleri `next/font` ile kendi alan adımızdan, önceden yüklenerek gelir; CLS 0.
