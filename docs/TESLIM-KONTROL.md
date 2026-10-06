# Teslim kontrol listesi

✅ tamam · ⏳ bekliyor · ⚠️ not. Son doğrulama 6 Ekim 2026, 17.15–17.21; ayrıntı `AI_LOG.md` → Doğrulama.

## Teslim edilecekler

| # | Ne | Değer | Durum |
|---|---|---|---|
| 1 | Canlı URL | https://enteksisodev.netlify.app | ✅ son sürüm yayında (17.17); canlı test 17.18 |
| 2 | Repo (public) | https://github.com/emirdnz/enteksis-odev | ✅ |
| 3 | README | `README.md` | ✅ |
| 4 | AI kaydı | `AI_LOG.md` + `ai-log/` | ✅ |
| 5 | Commit kimliği | Son gönderimden sonra | ⏳ Emir'e verilecek |
| 6 | Yalnız kurgusal veri | Testler, örnek ekranlar, canlı kayıtlar | ✅ |
| 7 | Yazılı problem çözme | Teslim formunda | ⏳ Emir |

## Son doğrulama (bu sırayla)

| # | Adım | Komut / yöntem | Sonuç |
|---|---|---|---|
| 1 | Değişiklik listesi | `git status`, gönderilmemiş commit'ler | ✅ 6 commit gönderilmeyi bekliyordu; çalışma alanında yalnız kayıt dosyası |
| 2 | Gizli değer ve kişisel bilgi taraması | Genel desenler + repo dışı yerel terim listesi; yalnız sayı | ✅ gerçek değer 0 (tek eşleşme yer tutucu "şifre" kelimesi) |
| 3 | Bağımlılık açığı | `npm audit --omit=dev`, `npm audit` | ✅ yayın 0 · ⚠️ geliştirme 5 yüksek (lint aracı zinciri, düzeltmesi yok) |
| 4 | Lint | `npm run lint` | ✅ 0 |
| 5 | Tip | `npx tsc --noEmit` | ✅ 0 |
| 6 | Derleme | `npm run build` | ✅ `/` statik, `/api/basvuru` dinamik |
| 7 | Birim | `npx vitest run` | ✅ 26/26 |
| 8 | Uçtan uca + axe | `npm run test:e2e` (mobil + masaüstü) | ✅ 36/36 |
| 9 | Gönderme | **Emir onayıyla** `git push` | ✅ 17.17 |
| 10 | Canlı başlıklar | `curl -sI` → CSP, HSTS, nosniff; API `Cache-Control: no-store` | ✅ 17.18 |
| 11 | Canlı akış | `CANLI_URL=… npx playwright test tests/e2e/canli.spec.ts` | ✅ 5 geçti, 1 atlandı (17.18). Emir'in yerel denemesi: kayıt 4 veritabanında (17.19) |
| 12 | Mobil ve masaüstü görünüm | Ekran görüntüsü 390×844, 1280×800 | ✅ yatay kaydırma yok · ⚠️ Netlify rozeti sağ altta (kodda yok) |

## Emir'in onayı ya da eylemi gereken işler

| İş | Neden Emir | Durum |
|---|---|---|
| Canlı veritabanında göç 001 | Üretim verisine dokunan komutu Claude Code çalıştırmaz (K8) | ✅ 17.20, `npm run db:goc`; kısıtlar doğrulandı |
| GitHub'a gönderme | Dışarıya yayın | ✅ 17.17 onay |
| Teslim formu | Hesap ve teslim Emir'de | ⏳ |
| Dependabot açmak (isteğe bağlı) | Repo ayarı | GitHub → Settings → Code security |
