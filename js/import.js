// Toplu soru içe aktarma: düz metin olarak yapıştırılan YDS sorularını ayrıştırır.
// Tarayıcıda window.YDSImport, Node'da module.exports olarak kullanılır.
//
// Desteklenen biçim (esnek):
//   17-21: For these questions, choose ...     ← yönerge satırları atlanır
//   Elvis Presley is the single most ... (17)---- ...   ← okuma / boşluk parçası
//   17. A) Instead of  B) Regardless of ...    ← seçenekler aynı ya da ayrı satırlarda
//   1. Attaining ---- in the current job is ...
//   A) assurance
//   B) competence
//   ...
//   Cevap: B                                   ← soru altında cevap (isteğe bağlı)
//   1-B 2-C 3.A 4) D                           ← ya da ayrı bir cevap anahtarı
(function (root) {
  "use strict";

  var CONNECTORS = ("although because unless despite whereas while if so such both either neither whether rather " +
    "not only but also as since once until before after even though provided given that case instead of addition " +
    "regardless long as far soon just only when contrary according due to thanks owing spite terms opposed means " +
    "aim result similar accordance moreover however therefore otherwise least illustrate furthermore hence thus " +
    "whereby nevertheless nonetheless besides").split(" ");
  var PREPS = ("at on in by with for from to into through about over under upon against among between within " +
    "towards toward across along beyond around throughout during without behind").split(" ");
  var WORDSET = {};
  CONNECTORS.concat(PREPS).forEach(function (w) { WORDSET[w] = true; });

  var KEY_PAIR = /(\d{1,2})\s*[-.):]?\s*([A-E])\b/g;
  var Q_START = /^\s*(\d{1,2})\s*[.),]\s*(.*)$/;
  // OCR'da seçenek harfi bozulabilir ("©)", "£)", "0)", "1b)"); sıradaki seçenek olarak kabul edilir
  var LOOSE_OPT = /^\s*[(\[{]?\s*(\S{1,2}?)\s*[)\]}]\s*(.*)$/;
  var STRICT_OPT = /^\s*[(\[]?\s*([A-E])\s*[).\]]\s+(.*)$/;
  var JUNK = /\b(english|yay[ıi]nlar[ıi]|informal|www\.|\.com)\b/i;
  var OPT_SPLIT = /(?:^|\s)([A-E])\s*\)\s*/g;
  var INSTRUCTION = /^\s*\d{1,2}\s*[-–]\s*\d{1,2}\s*[:.]|for these questions|answer these questions|choose the (best|most|irrelevant)|this test consists/i;
  var TURKISH = /[çğıöşüÇĞİÖŞÜ]/;

  function isKeyLine(line) {
    var stripped = line.replace(KEY_PAIR, "").replace(/cevap(lar)?\s*anahtar[ıi]\s*:?|answers?\s*:?/i, "").trim();
    var pairs = line.match(KEY_PAIR);
    return pairs && pairs.length >= 2 && !/[a-z]{3,}/i.test(stripped);
  }

  // "A) x  B) y" → [["A","x"],["B","y"]]; satırda seçenek yoksa null
  // loose: satır başındaki en fazla 3 karakterlik OCR artığını yok say ("re A) …")
  function splitOptions(line, loose) {
    var parts = [], m, idx = [];
    OPT_SPLIT.lastIndex = 0;
    while ((m = OPT_SPLIT.exec(line))) idx.push({ letter: m[1], start: m.index, after: OPT_SPLIT.lastIndex });
    var prefix = idx.length ? line.slice(0, idx[0].start).trim() : "";
    if (!idx.length || prefix && !(loose && prefix.length <= 3 && !/\s/.test(prefix))) return null;
    idx.forEach(function (p, i) {
      parts.push([p.letter, line.slice(p.after, i + 1 < idx.length ? idx[i + 1].start : line.length).trim()]);
    });
    return parts;
  }

  // YDS'deki standart soru sırasına göre kategori
  function categorize(num, q) {
    var n = q.n;
    if (n >= 1 && n <= 6) return "kelime";
    if (n >= 7 && n <= 16) return isConnectorQuestion(q) ? "baglac" : "dilbilgisi";
    if (n >= 17 && n <= 26) return "cloze";
    if (n >= 27 && n <= 36) return "tamamlama";
    if (n >= 37 && n <= 42) return TURKISH.test(q.q) ? "ceviriTrEn" : "ceviriEnTr";
    if (n >= 43 && n <= 62) return "okuma";
    if (n >= 63 && n <= 67) return "diyalog";
    if (n >= 68 && n <= 71) return "yenidenIfade";
    if (n >= 72 && n <= 75) return "eksikCumle";
    if (n >= 76 && n <= 80) return "bozan";
    return null;
  }

  function isConnectorQuestion(q) {
    var hits = q.o.filter(function (o) {
      return o.toLowerCase().split(/[\s/]+/).filter(Boolean).every(function (w) { return WORDSET[w.replace(/[^a-z]/g, "")]; });
    }).length;
    return hits >= 3;
  }

  // Kâğıt kenarı, sayfa numarası gibi OCR artıkları
  function isJunk(line) {
    var letters = (line.match(/[A-Za-zÇĞİÖŞÜçğıöşü]/g) || []).length;
    if (letters < 4) return true;
    if (letters / line.length < 0.5) return true;
    return JUNK.test(line) && line.length < 40;
  }

  // Numarası bilinmeyen soru için kaba tahmin (önizlemede değiştirilebilir)
  function guessCategory(q) {
    var avg = q.o.join(" ").length / 5;
    if (avg < 16) return isConnectorQuestion(q) ? "baglac" : "kelime";
    if (/----/.test(q.q)) return q.q.length > 220 ? "eksikCumle" : "tamamlama";
    return "okuma";
  }

  function parse(text, opts) {
    opts = opts || {};
    var lines = String(text).replace(/\r/g, "").split("\n");
    var questions = [], key = {}, passage = "", passageOpen = false, cur = null, last = null;
    var skipped = [];
    var afterPage = false; // sayfa ayracından sonra numaralı yeni soru beklenir

    function finish() {
      if (cur) questions.push(cur);
      cur = null;
      last = null;
    }

    lines.forEach(function (raw) {
      var line = raw.replace(/\s+/g, " ").trim();
      if (!line) return;

      // Sayfa ayracı ("=== Sayfa 3 ==="): tamamlanmış soru burada biter, yarım kalan sonraki sayfada sürer
      if (/^=+\s*sayfa\b.*=+$/i.test(line)) {
        if (cur && cur.o.length === 5) finish();
        if (!cur) { passage = ""; passageOpen = false; }
        afterPage = true;
        return;
      }

      // Cevap anahtarı satırı
      if (isKeyLine(line)) {
        var m;
        KEY_PAIR.lastIndex = 0;
        while ((m = KEY_PAIR.exec(line))) key[+m[1]] = "ABCDE".indexOf(m[2]);
        return;
      }
      // Soru altındaki "Cevap: B"
      var ans = /^(cevap|doğru cevap|answer)\s*[:\-]?\s*([A-E])\b/i.exec(line);
      if (ans && cur) { cur.ans = "ABCDE".indexOf(ans[2].toUpperCase()); return; }

      if (INSTRUCTION.test(line)) { finish(); passage = ""; passageOpen = true; return; }

      // Seçenekleri yarım kalmış soruda bozuk harfli seçenek satırı
      if (cur && (cur.o.length || cur.q) && cur.o.length < 5 && !splitOptions(line)) {
        var so = STRICT_OPT.exec(line);
        var lo = !so && cur.o.length ? LOOSE_OPT.exec(line) : null;
        if (so && "ABCDE".indexOf(so[1]) === cur.o.length && so[2]) { cur.o.push(so[2]); last = "o"; return; }
        if (lo && lo[2] && (!/^\d+$/.test(lo[1]) || lo[1] === "0")) { cur.o.push(lo[2]); last = "o"; return; }
      }

      var qs = Q_START.exec(line);
      if (qs && (+qs[1] === 0 || opts.ocr && /^\s*\d+\s*\)/.test(line))) qs = null;
      // OCR noktayı kaçırabilir: "72 Many ancient …" (yalnızca önceki soru tamamsa)
      if (!qs && opts.ocr && (!cur || cur.o.length === 5 || afterPage)) {
        var bare = /^\s*(\d{1,2})\s+([A-Z][a-z].*)$/.exec(line);
        if (bare && +bare[1] > 0 && +bare[1] <= 80) qs = bare;
      }
      // Aynı satırda okuma parçası gibi uzun metinler numarayla başlamaz; "1. ..." yeni soru
      if (qs) afterPage = false;
      if (qs && (!cur || cur.o.length || +qs[1] !== cur.n)) {
        var rest = qs[2];
        finish();
        cur = { n: +qs[1], q: "", o: [], passage: passage };
        passageOpen = false;
        var inline = splitOptions(rest);
        if (inline) {
          inline.forEach(function (p) { cur.o.push(p[1]); });
          last = "o";
        } else {
          cur.q = rest;
          last = "q";
        }
        return;
      }

      var op = splitOptions(line, opts.ocr);
      // Numarası okunamamış soru: "A)" ile başlayan seçenekler, önceki metin soru kökü olur
      if (op && op[0][0] === "A" && (!cur || cur.o.length === 5) && passage) {
        finish();
        var prevN = questions.length ? questions[questions.length - 1].n : 0;
        cur = { n: prevN ? prevN + 1 : 0, guessed: true, q: passage, o: [], passage: "" };
        passage = "";
        passageOpen = false;
      }
      if (op && cur) {
        op.forEach(function (p) {
          var i = "ABCDE".indexOf(p[0]);
          if (i === cur.o.length) cur.o.push(p[1]);
          else if (i < cur.o.length) cur.o[i] += " " + p[1];
        });
        last = "o";
        return;
      }

      if (opts.ocr && isJunk(line)) return;

      // Devam satırı ya da yeni okuma parçası
      // Küçük harfle başlayan satır son seçeneğin devamıdır
      if (cur && cur.o.length === 5 && last === "o" && /^[a-zçğıöşü0-9,;:)]/.test(line)) { cur.o[4] += " " + line; return; }
      if (cur && cur.o.length === 5) {
        // Seçenekleri tamamlanmış sorudan sonra gelen metin: yeni parça
        finish();
        passage = line;
        passageOpen = true;
        return;
      }
      if (cur && last === "o" && cur.o.length) { cur.o[cur.o.length - 1] += " " + line; return; }
      if (cur && last === "q") { cur.q += (cur.q ? " " : "") + line; return; }
      // Sorudan önce gelen metin: parça
      passage = passageOpen || !passage ? (passage ? passage + " " : "") + line : line;
      passageOpen = true;
    });
    finish();

    // Kategori, cevap ve doğrulama
    var out = [];
    questions.forEach(function (q) {
      q.q = q.q.trim();
      q.o = q.o.map(function (o) { return o.trim(); });
      var a = q.ans !== undefined ? q.ans : key[q.n];
      if (q.o.length !== 5 || q.o.some(function (o) { return !o; })) { skipped.push({ n: q.n, why: "5 seçenek bulunamadı" }); return; }
      if (a === undefined || a < 0) {
        if (!opts.keepUnanswered) { skipped.push({ n: q.n, why: "cevap yok" }); return; }
        a = -1;
      }
      var cat = opts.category && opts.category !== "auto" ? opts.category : q.guessed ? guessCategory(q) : categorize(q.n, q);
      if (!cat) { skipped.push({ n: q.n, why: "kategori belirlenemedi (1–80 dışında)" }); return; }
      if (!q.q && cat === "cloze") q.q = "(" + q.n + ") numaralı boşluğa hangisi gelmelidir?";
      if (!q.q) { skipped.push({ n: q.n, why: "soru metni yok" }); return; }
      var item = { n: q.n, cat: cat, q: q.q, o: q.o, a: a, x: "Toplu içe aktarıldı" + (q.n ? " (soru " + q.n + ")" : "") + "." };
      if (q.passage && (cat === "cloze" || cat === "okuma")) item.passage = q.passage;
      out.push(item);
    });
    return { questions: out, skipped: skipped, keyCount: Object.keys(key).length };
  }

  var api = { parse: parse, categorize: categorize };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.YDSImport = api;
})(this);
