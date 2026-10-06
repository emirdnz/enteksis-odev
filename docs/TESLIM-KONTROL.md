# Teslim kontrol listesi

✅ tamam · ⏳ bekliyor. Son doğrulama sırası sabit; sonuçlar `AI_LOG.md` → Doğrulama.

## Teslim edilecekler

| # | Ne | Değer | Durum |
|---|---|---|---|
| 1 | Canlı URL | https://enteksisodev.netlify.app | ✅ çalışıyor · ⏳ son commit'ler gönderilince yeniden yayın ve canlı test |
| 2 | Repo (public) | https://github.com/emirdnz/enteksis-odev | ✅ |
| 3 | README | `README.md` | ✅ |
| 4 | AI kaydı | `AI_LOG.md` + `ai-log/` | ✅ |
| 5 | Commit kimliği | Gönderimden sonra | ⏳ Emir'e verilecek |
| 6 | Yalnız kurgusal veri | Testler, örnek ekranlar, canlı kayıtlar | ✅ |
| 7 | Yazılı problem çözme | Teslim formunda | ⏳ Emir |

## Son doğrulama (bu sırayla)

| # | Adım | Komut / yöntem |
|---|---|---|
| 1 | Değişiklik listesi | `git status`, `git diff --stat` |
| 2 | Gizli değer ve kişisel bilgi taraması | Genel desenler + repo dışı yerel terim listesi; yalnız sayı yazdırılır |
| 3 | Bağımlılık açığı | `npm audit --omit=dev`, `npm audit` |
| 4 | Lint | `npm run lint` |
| 5 | Tip | `npx tsc --noEmit` |
| 6 | Derleme | `npm run build` |
| 7 | Birim | `npm test` |
| 8 | Uçtan uca + axe | `npm run test:e2e` (mobil + masaüstü) |
| 9 | Gönderme | **Emir onayıyla** `git push` |
| 10 | Canlı başlıklar | `curl -sI` → CSP, HSTS, nosniff; API `Cache-Control: no-store` |
| 11 | Canlı akış | `CANLI_URL=… npm run test:e2e -- tests/e2e/canli.spec.ts`: sayfa + axe, API, form → API → veritabanı → başarı |
| 12 | Mobil ve masaüstü görünüm | Canlı test iki ekranda; ekran görüntüsü |

## Emir'in onayı ya da eylemi gereken işler

| İş | Neden Emir | Komut |
|---|---|---|
| Canlı veritabanında göç 001 | Üretim verisine dokunan komutu Claude Code çalıştırmaz (K8) | `npm run db:goc` (önce isterse `npm run db:goc -- --kontrol`) |
| GitHub'a gönderme | Dışarıya yayın | Claude Code onaydan sonra çalıştırır |
| Teslim formu | Hesap ve teslim Emir'de | — |
| Dependabot açmak (isteğe bağlı) | Repo ayarı | GitHub → Settings → Code security |
