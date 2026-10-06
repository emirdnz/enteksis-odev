// AI çalışma kaydı — Claude Code hook'ları bu betiği çağırır (.claude/settings.json).
//
//   Her olay   → ai-log/olaylar.jsonl   (istem, araç çağrısı, sonuç, saat)
//   Tur sonu   → ai-log/oturumlar/*.md  (konuşmanın okunur dökümü, transcript'ten yeniden üretilir)
//
// Elle kullanım:
//   node .claude/hooks/ai-kayit.mjs ozet                                  → sayılarla özet (Markdown)
//   node .claude/hooks/ai-kayit.mjs yeniden-maskele                       → mevcut kayıtlara güncel maskeyi uygular
//   node .claude/hooks/ai-kayit.mjs dok <transcript.jsonl> [--bas ISO] [--son ISO] [--gizle-dosya <desenler.txt>]
//
// Hook modunda betik işi asla durdurmaz: hata ai-log/kayit-hatalari.log'a yazılır, çıkış kodu 0.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const LOG = path.join(KOK, "ai-log");
const OLAYLAR = path.join(LOG, "olaylar.jsonl");
const OTURUMLAR = path.join(LOG, "oturumlar");
const HATALAR = path.join(LOG, "kayit-hatalari.log");
const TZ = "Europe/Istanbul";

// ---------- maskeleme: gizli değer ve yerel yol repoya girmez ----------

const kacisli = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function yolBicimleri(yol) {
  const duz = yol.replace(/[\\/]+$/, "");
  const ileri = duz.replace(/\\/g, "/"); //                          D:/WORKS/...
  const bash = ileri.replace(/^([A-Za-z]):/, (_, h) => "/" + h.toLowerCase()); // /d/WORKS/...
  const json = duz.replace(/\\/g, "\\\\"); //                         D:\\WORKS\\... (JSON içinde)
  return [json, duz, ileri, bash];
}

const MASKELER = [
  ...yolBicimleri(KOK).map((y) => [new RegExp(kacisli(y), "gi"), "."]),
  ...yolBicimleri(os.homedir()).map((y) => [new RegExp(kacisli(y), "gi"), "~"]),
  [new RegExp(`\\b${kacisli(os.userInfo().username)}\\b`, "g"), "kullanici"],
  [/postgres(?:ql)?:\/\/[^\s"'`<>]+/gi, "postgresql://***"],
  [/\bnpg_[A-Za-z0-9]+/g, "npg_***"],
  [/\b(gh[pousr]_|github_pat_)[A-Za-z0-9_]+/g, "$1***"],
  [/\bnfp_[A-Za-z0-9]+/g, "nfp_***"],
  [/\bsk-[A-Za-z0-9_-]{16,}/g, "sk-***"],
  [/\b([A-Z0-9_]*(?:DATABASE_URL|PASSWORD|SECRET|TOKEN|API_KEY))(\s*=\s*)("?)[^\s"']+\3/g, "$1$2$3***$3"],
  ...gizliTerimler().map((t) => [new RegExp(kacisli(t), "gi"), "***"]),
];

// Kişisel terimler (ör. e-posta adresi) koda yazılamaz: kod public. Liste gitignore'lu yerel dosyada,
// satır başına bir terim. Dosya yoksa ya da okunamazsa maskeleme bu terimler olmadan sürer.
function gizliTerimler() {
  try {
    return fs
      .readFileSync(path.join(KOK, ".claude", "hooks", "gizli-terimler.local.txt"), "utf8")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 4 && !s.startsWith("#"));
  } catch {
    return [];
  }
}

export function maskele(metin) {
  let s = String(metin);
  for (const [desen, yerine] of MASKELER) s = s.replace(desen, yerine);
  return s;
}

function derinMaskele(v) {
  if (typeof v === "string") return maskele(v);
  if (Array.isArray(v)) return v.map(derinMaskele);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, derinMaskele(x)]));
  return v;
}

// ---------- yardımcılar ----------

const kisalt = (s, n) => {
  s = String(s ?? "");
  return s.length > n ? s.slice(0, n) + "…" : s;
};

const saatBicimi = new Intl.DateTimeFormat("tr-TR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
const tarihBicimi = new Intl.DateTimeFormat("tr-TR", { timeZone: TZ, day: "numeric", month: "long", year: "numeric" });
const dosyaBicimi = new Intl.DateTimeFormat("sv-SE", {
  timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
});

const saat = (iso) => saatBicimi.format(new Date(iso)).replace(":", ".");
const tarihSaat = (iso) => `${tarihBicimi.format(new Date(iso))} ${saat(iso)}`;
const dosyaZamani = (iso) => dosyaBicimi.format(new Date(iso)).replace(" ", "_").replace(":", "");

function aracOzeti(ad, g = {}) {
  switch (ad) {
    case "Bash":
    case "PowerShell":
      return { aciklama: g.description, komut: kisalt(g.command, 600) };
    case "Read":
      return { dosya: g.file_path };
    case "Write":
      return { dosya: g.file_path, karakter: (g.content ?? "").length };
    case "Edit":
      return { dosya: g.file_path };
    case "Glob":
      return { desen: g.pattern, yol: g.path };
    case "Grep":
      return { desen: g.pattern, yol: g.path, glob: g.glob };
    case "WebSearch":
      return { sorgu: g.query };
    case "WebFetch":
      return { adres: g.url };
    case "Agent":
    case "Task":
      return { ajan: g.subagent_type, aciklama: g.description };
    default:
      return { girdi: kisalt(JSON.stringify(g), 300) };
  }
}

// ---------- hook: olay → olaylar.jsonl ----------

function olayYaz(g) {
  const olay = g.hook_event_name;
  const k = { zaman: new Date().toISOString(), oturum: String(g.session_id ?? "").slice(0, 8), olay };

  if (olay === "SessionStart") Object.assign(k, { kaynak: g.source, model: g.model });
  else if (olay === "UserPromptSubmit") k.istem = g.prompt;
  else if (olay === "PostToolUse") Object.assign(k, { arac: g.tool_name, ...aracOzeti(g.tool_name, g.tool_input), sonuc: "tamam" });
  else if (olay === "PostToolUseFailure")
    Object.assign(k, { arac: g.tool_name, ...aracOzeti(g.tool_name, g.tool_input), sonuc: "hata", hata: kisalt(g.error, 400) });
  else if (olay === "SubagentStop") k.ajan = g.agent_type;
  else if (olay === "SessionEnd") k.neden = g.reason;

  fs.appendFileSync(OLAYLAR, JSON.stringify(derinMaskele(k)) + "\n");
}

// ---------- döküm: transcript → okunur Markdown ----------

function temizle(metin) {
  return String(metin)
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
    .trim();
}

function kullaniciMetni(icerik) {
  if (typeof icerik === "string") {
    const komut = icerik.match(/<command-name>([\s\S]*?)<\/command-name>/);
    if (komut) {
      const arg = icerik.match(/<command-args>([\s\S]*?)<\/command-args>/)?.[1]?.trim();
      return `\`${komut[1].trim()}${arg ? " " + arg : ""}\` (Claude Code komutu)`;
    }
    const cikti = icerik.match(/<local-command-stdout>([\s\S]*?)<\/local-command-stdout>/);
    if (cikti) return cikti[1].trim() ? `> Komut çıktısı: ${cikti[1].trim()}` : null;
    return temizle(icerik) || null;
  }
  if (!Array.isArray(icerik)) return null;
  const parcalar = [];
  for (const b of icerik) {
    if (b.type === "text" && temizle(b.text)) parcalar.push(temizle(b.text));
    else if (b.type === "image") parcalar.push("_[görsel eklendi]_");
  }
  return parcalar.length ? parcalar.join("\n\n") : null;
}

function sonucMetni(r) {
  if (!r) return "";
  const c = r.content;
  if (typeof c === "string") return temizle(c);
  if (Array.isArray(c)) return temizle(c.filter((b) => b.type === "text").map((b) => b.text).join("\n"));
  return "";
}

function kuyruk(metin, satir = 12, karakter = 1200) {
  const s = metin.split("\n").slice(-satir).join("\n");
  return s.length > karakter ? "…" + s.slice(-karakter) : s;
}

function aracBolumu(b, r) {
  const durum = !r ? "…" : r.is_error ? "✗" : "✓";
  const oz = aracOzeti(b.name, b.input);
  const kabuk = b.name === "Bash" || b.name === "PowerShell";
  const etiket = kabuk
    ? oz.aciklama ?? ""
    : Object.entries(oz).filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => `${k}: \`${v}\``).join(" · ");

  let s = `\n**Araç** \`${b.name}\` ${durum}${etiket ? " — " + etiket : ""}\n`;
  const cikti = sonucMetni(r);
  if (kabuk) {
    s += "\n````text\n$ " + oz.komut + (cikti ? "\n" + kuyruk(cikti) : "") + "\n````\n";
  } else if (r?.is_error && cikti) {
    s += "\n````text\n" + kuyruk(cikti, 8, 600) + "\n````\n";
  }
  return s;
}

// Elle döküm alınırken verilen desenlerden birine uyan araç çıktısı bloğu bütünüyle, düz metinde ise
// yalnız o satır çıkarılır; sayısı başlığa yazılır. Desen dosyası repo dışında tutulur ve komut satırında
// görünmez, dolayısıyla kayda da girmez.
function satirCikar(metin, desenler) {
  let sayi = 0;
  const uyar = (s) => desenler.some((d) => d.test(s));
  const sonuc = metin
    .replace(/````text\n[\s\S]*?\n````/g, (blok) =>
      uyar(blok) ? (sayi++, "_[komut ve çıktısı ödev dışı kişisel dosya içerdiği için çıkarıldı]_") : blok,
    )
    .split("\n")
    .map((s) => (!s.startsWith("_[") && uyar(s) ? (sayi++, "_[kişisel bilgi içeren satır çıkarıldı]_") : s))
    .join("\n");
  return { sonuc, sayi };
}

export function dokumUret(transcriptYolu, { bas, son, gizle = [] } = {}) {
  const satirlar = fs
    .readFileSync(transcriptYolu, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((s) => {
      try {
        return JSON.parse(s);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const sonuclar = new Map();
  for (const o of satirlar)
    if (o.type === "user" && Array.isArray(o.message?.content))
      for (const b of o.message.content) if (b.type === "tool_result") sonuclar.set(b.tool_use_id, b);

  const govde = [];
  let konusan = null;
  let oturum = "";
  let model = "";
  let ilk = null;
  let sonZaman = null;

  for (const o of satirlar) {
    // Claude çalışırken yazılan mesaj transcript'e "queued_command" eki olarak düşer.
    const araMesaj = o.type === "attachment" && o.attachment?.type === "queued_command" && o.attachment.origin?.kind === "human";
    // /model gibi Claude Code komutları "local_command" sistem satırıdır.
    const komut = o.type === "system" && o.subtype === "local_command";
    if ((o.type !== "user" && o.type !== "assistant" && !araMesaj && !komut) || o.isSidechain || o.isMeta || !o.timestamp) continue;
    if (bas && o.timestamp < bas) continue;
    if (son && o.timestamp > son) continue;

    if (komut) {
      const metin = kullaniciMetni(o.content);
      if (metin == null) continue;
      govde.push(metin.startsWith(">") ? `\n${metin}\n` : `\n---\n\n### Emir · ${saat(o.timestamp)}\n\n${metin}\n`);
      konusan = "emir";
    } else if (araMesaj) {
      govde.push(`\n---\n\n### Emir · ${saat(o.timestamp)} (Claude çalışırken)\n\n${temizle(o.attachment.prompt)}\n`);
      konusan = "emir";
    } else if (o.type === "user" && o.isCompactSummary) {
      // Bağlam dolunca Claude Code kendi yazdığı özetle devam eder. Özet insan mesajı değil; konuşmanın
      // tekrarıdır ve bağlamdaki her şeyi (ödev dışı notlar dahil) içerebilir, o yüzden yalnız yeri işaretlenir.
      govde.push(`\n---\n\n_${saat(o.timestamp)} · Bağlam penceresi doldu; Claude Code konuşmayı özetleyip aynı oturumda devam etti (özet metni dökümde yok)._\n`);
      konusan = null;
    } else if (o.type === "user") {
      const metin = kullaniciMetni(o.message?.content);
      if (metin == null) continue;
      // `claude -p` ile açılan oturumun istemi insan yazmadı; öyle etiketlenmesin.
      const kim = o.promptSource === "sdk" || o.entrypoint === "sdk-cli" ? "Otomatik istem (`claude -p`)" : "Emir";
      govde.push(`\n---\n\n### ${kim} · ${saat(o.timestamp)}\n\n${metin}\n`);
      konusan = "emir";
    } else {
      for (const b of o.message?.content ?? []) {
        const yazilacak =
          b.type === "text" && b.text.trim() ? `\n${b.text.trim()}\n` : b.type === "tool_use" ? aracBolumu(b, sonuclar.get(b.id)) : null;
        if (!yazilacak) continue;
        if (konusan !== "claude") govde.push(`\n### Claude · ${saat(o.timestamp)}\n`);
        konusan = "claude";
        govde.push(yazilacak);
      }
      model ||= o.message?.model ?? "";
    }
    oturum ||= o.sessionId ?? "";
    ilk ??= o.timestamp;
    sonZaman = o.timestamp;
  }

  if (!ilk) return null;

  const { sonuc: metin, sayi: cikan } = satirCikar(govde.join(""), gizle);

  const baslik = [
    `# Claude Code oturumu · ${tarihSaat(ilk)}`,
    "",
    `- Oturum: \`${oturum.slice(0, 8)}\` · Model: \`${model || "?"}\` · Son kayıt: ${saat(sonZaman)}`,
    "- Otomatik döküm: `.claude/hooks/ai-kayit.mjs`, her tur sonunda transcript'ten yeniden üretilir.",
    "- Gizli değerler ve yerel yollar maskelendi. Komut çıktılarının yalnız son satırları gösterilir;",
    "  okunan dosyaların içeriği yazılmaz. Modelin iç düşünce metni Claude Code kaydında tutulmadığı için yoktur.",
    ...(cikan ? [`- Ödevle ilgisiz kişisel dosya ya da bilgi içeren **${cikan} yer** çıkarıldı; her biri işaretli.`] : []),
    "",
  ].join("\n");

  fs.mkdirSync(OTURUMLAR, { recursive: true });
  const hedef = path.join(OTURUMLAR, `${dosyaZamani(ilk)}_${oturum.slice(0, 8)}.md`);
  fs.writeFileSync(hedef, maskele(baslik + metin));
  return hedef;
}

// ---------- özet: olaylar.jsonl → sayılar ----------

function ozet() {
  const kayitlar = fs.existsSync(OLAYLAR)
    ? fs.readFileSync(OLAYLAR, "utf8").split("\n").filter(Boolean).map((s) => JSON.parse(s))
    : [];
  const oturumlar = new Set(kayitlar.map((k) => k.oturum));
  const istem = kayitlar.filter((k) => k.olay === "UserPromptSubmit").length;
  const araclar = kayitlar.filter((k) => k.arac);
  const hata = araclar.filter((k) => k.sonuc === "hata").length;
  const dagilim = {};
  for (const k of araclar) dagilim[k.arac] = (dagilim[k.arac] ?? 0) + 1;

  const satirlar = [
    "| Ölçü | Değer |",
    "|---|---|",
    `| Oturum | ${oturumlar.size} |`,
    `| İstem | ${istem} |`,
    `| Araç çağrısı | ${araclar.length} (hatalı: ${hata}) |`,
    kayitlar.length ? `| İlk / son olay | ${tarihSaat(kayitlar[0].zaman)} / ${tarihSaat(kayitlar.at(-1).zaman)} |` : "| İlk / son olay | — |",
    "",
    "| Araç | Çağrı |",
    "|---|---|",
    ...Object.entries(dagilim)
      .sort((a, b) => b[1] - a[1])
      .map(([ad, n]) => `| \`${ad}\` | ${n} |`),
  ];
  console.log(satirlar.join("\n"));
}

// ---------- giriş ----------

function hataYaz(e) {
  try {
    fs.mkdirSync(LOG, { recursive: true });
    fs.appendFileSync(HATALAR, maskele(`${new Date().toISOString()} ${e?.stack ?? e}\n`));
  } catch {
    // kayıt da yazılamıyorsa sessiz geç: hook Claude'un işini durdurmamalı
  }
}

const [, , komut, ...arg] = process.argv;

if (komut === "ozet") {
  ozet();
} else if (komut === "yeniden-maskele") {
  // Maskeleme listesine sonradan eklenen terim, önceden yazılmış kayıtlardan da silinir.
  const dosyalar = [OLAYLAR, ...fs.readdirSync(OTURUMLAR).map((d) => path.join(OTURUMLAR, d))];
  for (const d of dosyalar) {
    const eski = fs.readFileSync(d, "utf8");
    const yeni = maskele(eski);
    if (yeni !== eski) {
      fs.writeFileSync(d, yeni);
      console.log("maskelendi:", path.relative(KOK, d));
    }
  }
} else if (komut === "dok") {
  const secenek = (ad) => {
    const i = arg.indexOf(ad);
    return i >= 0 ? new Date(arg[i + 1]).toISOString() : undefined;
  };
  const i = arg.indexOf("--gizle-dosya");
  const gizle =
    i >= 0
      ? fs.readFileSync(arg[i + 1], "utf8").split("\n").map((s) => s.trim()).filter(Boolean).map((s) => new RegExp(s, "i"))
      : [];
  console.log(dokumUret(arg[0], { bas: secenek("--bas"), son: secenek("--son"), gizle }) ?? "Bu aralıkta kayıt yok.");
} else {
  try {
    fs.mkdirSync(OTURUMLAR, { recursive: true });
    const girdi = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
    if (!girdi.hook_event_name) process.exit(0);
    olayYaz(girdi);
    if (["Stop", "SubagentStop", "SessionEnd"].includes(girdi.hook_event_name) && girdi.transcript_path)
      dokumUret(girdi.transcript_path);
  } catch (e) {
    hataYaz(e);
  }
}
