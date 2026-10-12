(function () {
  "use strict";

  var WORDS = window.YDS_WORDS || [];
  var QUESTIONS = window.YDS_QUESTIONS || [];
  var CATEGORIES = window.YDS_CATEGORIES || {};
  var LETTERS = ["A", "B", "C", "D", "E"];
  var TYPE_LABELS = { v: "fiil", n: "isim", adj: "sıfat", adv: "zarf", phr: "öbek fiil", conj: "bağlaç", art: "makale kelimesi", x: "kelime" };
  var BUILTIN_Q = QUESTIONS.length; // sitenin kendi soruları; kullanıcı soruları bunların arkasına eklenir
  var LEVEL_LABELS = { 1: "Temel", 2: "Orta", 3: "İleri", 4: "C2" };

  // ---------- Yardımcılar ----------
  function $(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function trLower(s) { return s.toLocaleLowerCase("tr"); }

  // ---------- Kalıcı durum (localStorage) ----------
  var STORE_KEY = "yds-study-v1";
  function emptyState() {
    return { known: {}, answers: {}, vocabBest: 0, artWords: {}, artScores: {}, missedWords: {}, weakSents: {}, qWrong: {},
      userWords: [], userQs: [], srs: {} };
  }
  var state = emptyState();

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        state.known = parsed.known || {};
        state.answers = parsed.answers || {};
        state.vocabBest = parsed.vocabBest || 0;
        state.artWords = parsed.artWords || {};
        state.artScores = parsed.artScores || {};
        state.missedWords = parsed.missedWords || {};
        state.weakSents = parsed.weakSents || {};
        state.qWrong = parsed.qWrong || {};
        state.userWords = parsed.userWords || [];
        state.userQs = parsed.userQs || [];
        state.srs = parsed.srs || {};
      }
    } catch (e) { /* depolama yoksa bellekte devam et */ }
    mergeUserContent();
  }

  // ---------- Kullanıcının eklediği kelimeler ve sorular ----------
  // Eklenen kelimeler ana kelime listesine (u: true), sorular soru bankasına (uid) katılır;
  // böylece listede, kartlarda, testlerde ve tekrarda otomatik olarak yer alırlar.
  function mergeUserContent() {
    for (var i = WORDS.length - 1; i >= 0; i--) if (WORDS[i].u) WORDS.splice(i, 1);
    QUESTIONS.length = BUILTIN_Q;
    state.userWords.forEach(function (uw) {
      WORDS.push({ w: uw.w, t: uw.t || "x", lvl: 0, m: uw.m, e: uw.e || "", u: true, id: uw.id });
    });
    state.userQs.forEach(function (uq) { QUESTIONS.push(uq); });
  }

  // Soru anahtarı: sitenin soruları için sıra numarası, kullanıcı soruları için "u" + kimlik.
  // Kullanıcı soruları kalıcı bir anahtarla tutulur; site soruları çoğalsa da cevaplar karışmaz.
  function qKey(i) {
    var q = QUESTIONS[i];
    return q && q.uid ? "u" + q.uid : String(i);
  }
  function qIndex(key) {
    key = String(key);
    if (key.charAt(0) === "u") {
      for (var i = BUILTIN_Q; i < QUESTIONS.length; i++) if ("u" + QUESTIONS[i].uid === key) return i;
      return -1;
    }
    var n = parseInt(key, 10);
    return n >= 0 && n < BUILTIN_Q ? n : -1;
  }

  // Bir kelimeyi (çekimli hâlleriyle) cümlede bulan düzenli ifade: "pose" → poses, posed, posing
  function wordRegex(word) {
    var parts = String(word).trim().toLowerCase().split(/\s+/).map(function (p) {
      return p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    });
    var w0 = parts[0];
    if (/[^aeiou]y$/.test(w0)) {
      // embody → embodies, embodied, embodying
      parts[0] = w0.slice(0, -1) + "(?:y|ies|ied|ying)";
    } else {
      var first = w0.replace(/e$/, "");
      parts[0] = first + "(?:e|es|s|ed|d|ing|ies|ied)?";
    }
    return new RegExp("\\b" + parts.join("\\s+") + "\\b", "i");
  }

  var storageOk = true;

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
      storageOk = true;
    } catch (e) {
      storageOk = false;
      showStorageWarning();
    }
  }

  // Tarayıcı kaydı tutabiliyor mu? Uygulama içi tarayıcılar ve gizli sekmeler kaydı silebilir.
  function checkStorage() {
    try {
      localStorage.setItem("yds-probe", "1");
      storageOk = localStorage.getItem("yds-probe") === "1";
      localStorage.removeItem("yds-probe");
    } catch (e) { storageOk = false; }
    // Tarayıcıdan, yer darlığında bu sitenin verisini silmemesini iste
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { }
    if (!storageOk) showStorageWarning();
  }

  function showStorageWarning() {
    var el = $("storageWarning");
    if (!el) return;
    el.hidden = false;
    el.innerHTML = "<strong>⚠️ Bu tarayıcı ilerlemeni kaydetmiyor.</strong> Gizli sekmede ya da bir uygulamanın (WhatsApp, Instagram vb.) içinden açtıysan " +
      "siteyi Chrome veya Safari'de normal sekmede aç. Ana ekrana eklemek de işe yarar.";
  }

  function exportBackup() {
    var data = JSON.stringify({ app: "yds-calisma", v: 1, at: new Date().toISOString(), state: state });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([data], { type: "application/json" }));
    a.download = "yds-yedek-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }

  function importBackup(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var d = JSON.parse(reader.result);
        if (!d || d.app !== "yds-calisma" || !d.state) throw new Error("bad");
        if (!confirm("Yedek yüklensin mi? Bu tarayıcıdaki mevcut ilerlemenin yerini alacak.")) return;
        localStorage.setItem(STORE_KEY, JSON.stringify(d.state));
        location.reload();
      } catch (e) {
        alert("Bu dosya geçerli bir YDS Çalışma yedeği değil.");
      }
    };
    reader.readAsText(file);
  }

  // Makale kelimeleri (t: "art") state.artWords içinde "learned" / "review" olarak tutulur.
  // Ana listedeki kelimelerden yanlış yapılan / bilinmeyenler state.missedWords içinde
  // kaynağıyla (src) birlikte tutulur; ikisi birlikte "Tekrar" alanının kelime listesini oluşturur.
  function isKnown(w) {
    if (w.t === "art") return !!(state.artWords[w.key] && state.artWords[w.key].st === "learned");
    return !!state.known[w.w];
  }

  function findMain(lower) {
    return WORDS.find(function (x) { return x.w.toLowerCase() === lower; });
  }

  function setMain(w, val, src) {
    if (val) {
      state.known[w.w] = true;
      delete state.missedWords[w.w];
    } else {
      delete state.known[w.w];
      var prev = state.missedWords[w.w] || { n: 0 };
      state.missedWords[w.w] = { n: prev.n + 1, t: Date.now(), src: src || prev.src || "liste" };
    }
  }

  // src: kelimenin tekrar listesine nereden düştüğü (makale, ceviri, test, kart, liste)
  function setKnown(w, val, src) {
    if (w.t === "art") {
      var a = state.artWords[w.key];
      if (a) {
        a.st = val ? "learned" : "review";
        if (!val && src) a.src = src;
        a.t = Date.now();
      }
      var main = findMain(w.key);
      if (main) setMain(main, val, src || "makale");
    } else {
      setMain(w, val, src);
      var art = state.artWords[w.w.toLowerCase()];
      if (art) art.st = val ? "learned" : "review";
    }
    save();
  }

  var SRC_LABELS = { makale: "Makale", ceviri: "Çeviri hatası", test: "Kelime testi", kart: "Kartlar", soru: "Soru Bankası", liste: "Kelime listesi", eklenen: "Eklediğim" };

  // Bir seçenek metnini ana kelime listesindeki kelimeyle eşleştirir ("poses" → "pose", "Despite" → "despite").
  function matchWord(text) {
    var t = String(text).toLowerCase().replace(/[^a-z\s-]/g, "").trim();
    if (!t) return null;
    return WORDS.find(function (x) { return x.w === t; }) ||
      WORDS.find(function (x) { return x.w.length >= 4 && t.indexOf(x.w) === 0 && t.length - x.w.length <= 3 && t.indexOf(" ") === -1; }) ||
      null;
  }

  // Soru Bankası cevabını kaydeder; yanlışsa soruyu ve (kelime/bağlaç sorusuysa) doğru cevaptaki kelimeyi tekrara ekler.
  function recordAnswer(i, ok, chosen) {
    var q = QUESTIONS[i];
    var key = qKey(i);
    state.answers[key] = ok;
    if (ok) {
      delete state.qWrong[key];
    } else {
      var prev = state.qWrong[key] || { n: 0 };
      state.qWrong[key] = { n: prev.n + 1, t: Date.now(), c: chosen };
      if (q && (q.cat === "kelime" || q.cat === "baglac")) {
        var w = matchWord(q.o[q.a]);
        if (w) { setKnown(w, false, "soru"); return; }
      }
    }
    save();
  }

  function reviewWords() {
    var seen = {}, list = [];
    Object.keys(state.artWords).forEach(function (k) {
      var a = state.artWords[k];
      if (a.st !== "review") return;
      seen[k] = true;
      list.push({ w: a.w, t: "art", m: a.m, e: a.s, key: k, src: a.src || "makale", at: a.a, time: a.t || 0 });
    });
    Object.keys(state.missedWords).forEach(function (word) {
      var main = WORDS.find(function (x) { return x.w === word; });
      if (!main || seen[word.toLowerCase()]) return;
      var mw = state.missedWords[word];
      list.push({ w: main.w, t: main.t, m: main.m, e: main.e, key: word.toLowerCase(), src: mw.src, n: mw.n, time: mw.t || 0 });
    });
    return list.sort(function (a, b) { return b.time - a.time; });
  }

  function weakSentenceCount() { return Object.keys(state.weakSents).length; }

  function wrongQuestionCount() {
    return Object.keys(state.answers).filter(function (k) { return state.answers[k] === false && qIndex(k) >= 0; }).length;
  }

  // ---------- Tema ----------
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("yds-theme"); } catch (e) { }
    if (saved) document.documentElement.setAttribute("data-theme", saved);

    function current() {
      var cur = document.documentElement.getAttribute("data-theme");
      if (cur) return cur;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    function paintIcon() { $("themeToggle").textContent = current() === "dark" ? "☀" : "☾"; }

    paintIcon();
    $("themeToggle").addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("yds-theme", next); } catch (e) { }
      paintIcon();
    });
  }

  // ---------- Yönlendirme ----------
  var routes = {
    home: renderHome,
    words: renderWords,
    cards: routeCards,
    "vocab-quiz": function () { },
    questions: function () { }
  };

  function route() {
    var parts = location.hash.replace("#", "").split("/");
    var name = parts[0] || "home";
    var arg = parts.slice(1).join("/");
    if (!routes[name]) name = "home";
    document.querySelectorAll(".view").forEach(function (v) {
      v.hidden = v.id !== "view-" + name;
    });
    document.querySelectorAll("#nav a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-route") === name);
    });
    routes[name](arg);
    updateSrsBadge();
    window.scrollTo(0, 0);
  }

  // ---------- Ana sayfa ----------
  function renderHome() {
    var knownCount = WORDS.filter(isKnown).length;
    var answeredIds = Object.keys(state.answers);
    var correct = answeredIds.filter(function (k) { return state.answers[k]; }).length;
    var pct = WORDS.length ? Math.round((knownCount / WORDS.length) * 100) : 0;

    var due = dueCards();
    var hard = due.filter(function (w) { var r = state.srs[cardKey(w)]; return !r || r.box === 0; }).length;
    $("srsBanner").hidden = !due.length;
    $("srsBanner").innerHTML = due.length
      ? '<div><strong>🔁 Tekrar zamanı:</strong> ' + due.length + " kelime seni bekliyor" +
        (hard ? " (" + hard + " tanesi zor)" : "") + '.</div><a class="btn btn-primary" href="#cards" id="srsGo">Kartlarla tekrar et</a>'
      : "";
    $("homeStats").innerHTML =
      stat(knownCount + " / " + WORDS.length, "Öğrenilen kelime", pct) +
      stat(answeredIds.length + " / " + QUESTIONS.length, "Çözülen soru",
        QUESTIONS.length ? Math.round((answeredIds.length / QUESTIONS.length) * 100) : 0) +
      stat(answeredIds.length ? Math.round((correct / answeredIds.length) * 100) + "%" : "—", "Soru başarı oranı", null) +
      stat(state.vocabBest ? state.vocabBest + "%" : "—", "En iyi kelime testi", null) +
      stat(String(pendingWordCount() + weakSentenceCount() + wrongQuestionCount()), "Tekrar bekleyen", null, "#review");
  }

  function stat(value, label, pct, href) {
    var tag = href ? 'a href="' + href + '"' : "div";
    return "<" + tag + ' class="stat' + (href ? " stat-link" : "") + '"><div class="stat-value">' + esc(value) +
      '</div><div class="stat-label">' + esc(label) + "</div>" +
      (pct === null || pct === undefined ? "" : '<div class="bar"><span style="width:' + pct + '%"></span></div>') +
      "</" + (href ? "a" : "div") + ">";
  }

  // ---------- Kelime listesi ----------
  function renderWords() {
    var q = trLower($("wordSearch").value.trim());
    var type = $("wordType").value;
    var lvl = $("wordLevel").value;
    var status = $("wordStatus").value;

    var list = WORDS.filter(function (w) {
      if (type && w.t !== type) return false;
      if (lvl && String(w.lvl) !== lvl) return false;
      if (status === "known" && !isKnown(w)) return false;
      if (status === "mine" && !w.u) return false;
      if (status === "sik" && !w.sik) return false;
      if (status === "unknown" && isKnown(w)) return false;
      if (q && trLower(w.w).indexOf(q) === -1 && trLower(w.m).indexOf(q) === -1) return false;
      return true;
    }).sort(function (a, b) { return a.w.localeCompare(b.w, "en"); });

    $("wordCount").textContent = list.length + " kelime gösteriliyor";
    $("wordList").innerHTML = list.length ? list.map(function (w) {
      var known = isKnown(w);
      return '<article class="word' + (known ? " is-known" : "") + '">' +
        '<div class="word-head"><h3>' + esc(w.w) + '</h3>' +
        '<span class="tag">' + (TYPE_LABELS[w.t] || "kelime") + '</span>' +
        (w.u ? '<span class="tag tag-mine">Eklediğim</span>' : '<span class="tag tag-lvl' + w.lvl + '">' + LEVEL_LABELS[w.lvl] + "</span>") +
        (w.sik ? '<span class="tag tag-sik">Sınav şıkkı</span>' : "") +
        '<button class="mark" data-word="' + esc(w.w) + '" aria-pressed="' + known + '" title="Bildiklerime ekle/çıkar">' +
        (known ? "✓ Biliyorum" : "+ Biliyorum") + "</button></div>" +
        '<p class="meaning">' + esc(w.m) + "</p>" +
        (w.e ? '<p class="example">' + esc(w.e) + "</p>" : "") +
        (w.u ? '<button class="linkish small" data-del-word="' + esc(w.id) + '">Bu kelimeyi sil</button>' : "") +
        "</article>";
    }).join("") : '<p class="empty">Aramana uygun kelime bulunamadı.</p>';
  }

  function initWords() {
    ["wordSearch", "wordType", "wordLevel", "wordStatus"].forEach(function (id) {
      $(id).addEventListener("input", renderWords);
    });
    $("wordList").addEventListener("click", function (e) {
      var del = e.target.closest("[data-del-word]");
      if (del) { if (window.YDSCustom) window.YDSCustom.deleteWord(del.getAttribute("data-del-word")); return; }
      var btn = e.target.closest(".mark");
      if (!btn) return;
      var w = WORDS.find(function (x) { return x.w === btn.getAttribute("data-word"); });
      if (w) { setKnown(w, !isKnown(w), "liste"); renderWords(); }
    });
  }

  // ---------- Aralıklı tekrar (SRS) ----------
  // Kartlarda "Bilmiyorum" ya da "Tekrara ihtiyacım var" denen her kelime state.srs içinde kalıcı olarak
  // tutulur (sıfırlanmadıkça silinmez). Her kelimenin bir kutusu (box) ve bir sonraki tekrar zamanı (due) vardır:
  //   Bilmiyorum  → kutu 0: her girişte ve oturum içinde birkaç kart sonra yeniden sorulur
  //   Tekrar      → kutu 1: siteye her yeni girişte (ve aynı girişte 1 saat sonra) yeniden sorulur
  //   Biliyorum   → bir üst kutu; aralık giderek uzar (1, 3, 7, 16, 35 gün) ama kelime hafızadan çıkmaz.
  //                 Aynı girişte "Bilmiyorum/Tekrar" denmiş bir kelime, o girişte "Biliyorum" dense de kutu 1'de
  //                 kalır; zor listesinden çıkması için başka bir girişte de bilinmesi gerekir.
  var MIN = 60e3, HOUR = 60 * MIN, DAY = 24 * HOUR;
  var BOX_INTERVALS = [0, HOUR, DAY, 3 * DAY, 7 * DAY, 16 * DAY, 35 * DAY];
  // Her sayfa açılışı yeni bir "giriş"tir
  var VISIT = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  // Zor (0) ve tekrar (1) kutusundaki kelimeler her yeni girişte sorulur
  function isDue(r, now) {
    return r.due <= now || (r.box <= 1 && r.seen !== VISIT);
  }
  var BOX_LABELS = ["Zor", "Tekrar", "Öğreniliyor", "Öğreniliyor", "İyi", "İyi", "Çok iyi"];

  function cardKey(w) { return String(w.key || w.w).toLowerCase(); }

  function srsPlan(w, grade) {
    var r = state.srs[cardKey(w)] || { box: 0 };
    var box;
    if (grade === 0) box = 0;
    else if (grade === 1) box = r.box >= 2 ? r.box - 1 : 1;
    else if (!state.srs[cardKey(w)]) box = null;
    else if (r.box <= 1 && r.hardVisit === VISIT) box = 1; // bu girişte zorlanıldı: bir sonraki girişte yine sorulsun
    else box = Math.min(BOX_INTERVALS.length - 1, r.box + 1);
    return box === null ? null : { box: box, wait: BOX_INTERVALS[box] };
  }

  function srsAnswer(w, grade) {
    var k = cardKey(w), now = Date.now();
    var plan = srsPlan(w, grade);
    if (!plan) return; // hiç zorlanılmamış kelimeye "Biliyorum": takibe almaya gerek yok
    var r = state.srs[k] || { n: 0, lapses: 0, reviews: 0, added: now };
    r.box = plan.box;
    r.due = now + plan.wait;
    r.n++;
    if (grade === 0) r.lapses++;
    if (grade === 1) r.reviews++;
    if (grade < 2) r.hardVisit = VISIT;
    r.seen = VISIT;
    r.last = now;
    r.g = grade;
    // Kelime listesinde olmayan (makale / eklenen) kelimeler için gösterim bilgisi
    r.w = w.w; r.m = w.m; r.e = w.e || ""; r.t = w.t;
    state.srs[k] = r;
  }

  function wordByKey(k) {
    var main = WORDS.find(function (x) { return x.w.toLowerCase() === k; });
    if (main) return main;
    var a = state.artWords[k];
    if (a) return { w: a.w, t: "art", m: a.m, e: a.s, key: k };
    var r = state.srs[k];
    return r && r.w ? { w: r.w, t: r.t === "art" ? "art" : (r.t || "x"), m: r.m, e: r.e, key: k } : null;
  }

  // Zamanı gelen kartlar: önce zorlar (kutu 0), sonra en çok gecikenler
  function dueCards(now) {
    now = now || Date.now();
    var keys = Object.keys(state.srs).filter(function (k) { return isDue(state.srs[k], now); })
      .sort(function (a, b) {
        var ra = state.srs[a], rb = state.srs[b];
        return ra.box - rb.box || ra.due - rb.due;
      });
    var seen = {}, list = [];
    keys.forEach(function (k) {
      var w = wordByKey(k);
      if (w) { seen[k] = true; list.push(w); }
    });
    // Diğer bölümlerden (test, makale, soru) tekrar listesine düşen ama kartlarda henüz çalışılmamış kelimeler
    reviewWords().forEach(function (w) {
      var k = cardKey(w);
      if (!seen[k] && !state.srs[k]) { seen[k] = true; list.push(w); }
    });
    return list;
  }

  // Tekrar listesindeki kelimeler ile zamanı gelen kartların birleşimi (aynı kelime iki kez sayılmaz)
  function pendingWordCount() {
    var keys = {};
    reviewWords().forEach(function (w) { keys[cardKey(w)] = true; });
    dueCards().forEach(function (w) { keys[cardKey(w)] = true; });
    return Object.keys(keys).length;
  }

  function srsCounts() {
    var c = { total: 0, hard: 0, review: 0, learning: 0, due: dueCards().length };
    Object.keys(state.srs).forEach(function (k) {
      var b = state.srs[k].box;
      c.total++;
      if (b === 0) c.hard++; else if (b === 1) c.review++; else c.learning++;
    });
    return c;
  }

  function nextDueText() {
    var now = Date.now(), next = Infinity;
    var hard = Object.keys(state.srs).some(function (k) { return state.srs[k].box <= 1; });
    if (hard) return "siteye bir sonraki girişinde";
    Object.keys(state.srs).forEach(function (k) { if (state.srs[k].due > now) next = Math.min(next, state.srs[k].due); });
    return next === Infinity ? "" : waitText(next - now);
  }

  function planText(plan) {
    if (!plan) return "takip edilmez";
    if (plan.box === 0) return "birazdan";
    if (plan.box === 1) return "sonraki girişte";
    return waitText(plan.wait);
  }

  function waitText(ms) {
    if (ms <= 0) return "hemen";
    if (ms < HOUR) return Math.max(1, Math.round(ms / MIN)) + " dk sonra";
    if (ms < DAY) return Math.round(ms / HOUR) + " saat sonra";
    return Math.round(ms / DAY) + " gün sonra";
  }

  function updateSrsBadge() {
    var n = dueCards().length;
    var b = $("cardsBadge");
    if (b) { b.textContent = n; b.hidden = !n; }
  }

  // ---------- Kartlar ----------
  var deck = [], deckPos = 0, flipped = false, sessionReps = {}, cardsOpened = false;

  function startCards() {
    var set = $("cardSet").value;
    sessionReps = {};
    var pool;
    if (set === "smart") pool = dueCards();
    else if (set === "review") pool = shuffle(reviewWords());
    else if (set === "hard") {
      pool = Object.keys(state.srs).filter(function (k) { return state.srs[k].box <= 1; })
        .map(wordByKey).filter(Boolean);
      pool = shuffle(pool);
    } else {
      pool = shuffle(WORDS.filter(function (w) {
        if (set === "all") return true;
        if (set === "c2") return w.lvl === 4;
        if (set === "sik") return !!w.sik;
        if (set === "unknown") return !isKnown(w);
        return w.t === set;
      }));
    }
    deck = pool;
    deckPos = 0;
    showCard();
  }

  function routeCards() {
    // İlk açılışta zamanı gelen kart varsa akıllı tekrarla başla
    if (!cardsOpened) {
      cardsOpened = true;
      $("cardSet").value = dueCards().length ? "smart" : "unknown";
    }
    startCards();
  }

  function renderSrsSummary() {
    var c = srsCounts();
    $("srsSummary").innerHTML = c.total || c.due
      ? '<span class="srs-chip hard">Zor: <strong>' + c.hard + "</strong></span>" +
        '<span class="srs-chip review">Tekrar: <strong>' + c.review + "</strong></span>" +
        '<span class="srs-chip learning">Öğreniliyor: <strong>' + c.learning + "</strong></span>" +
        '<span class="srs-chip due">Şu an sorulacak: <strong>' + c.due + "</strong></span>"
      : '<span class="muted small">"Bilmiyorum" ya da "Tekrara ihtiyacım var" dediğin kelimeler burada takip edilir ve aralıklarla yeniden sorulur.</span>';
  }

  function showCard() {
    flipped = false;
    $("flashcard").classList.remove("flipped");
    var done = deckPos >= deck.length;
    $("cardKnown").disabled = $("cardUnknown").disabled = $("cardReview").disabled = done;
    renderSrsSummary();
    updateSrsBadge();

    if (done) {
      var smart = $("cardSet").value === "smart";
      $("cardProgress").textContent = deck.length ? "Bu desteyi bitirdin!" : "";
      $("cardFront").innerHTML = deck.length
        ? '<div class="card-word">Tebrikler! 🎉</div><div class="card-sub">' +
          (smart && nextDueText() ? "Sıradaki tekrar " + nextDueText() + "." : "Yeni bir deste seç veya tekrar başlamak için tıkla.") + "</div>"
        : smart
          ? '<div class="card-word">Şu an sorulacak kart yok</div><div class="card-sub">' +
            (nextDueText() ? "Sıradaki tekrar " + nextDueText() + ". " : "") + "Başka bir deste seçerek devam edebilirsin.</div>"
          : '<div class="card-word">Kart yok</div><div class="card-sub">Bu desteyi tamamen biliyorsun. Başka bir deste seç.</div>';
      $("cardBack").innerHTML = "";
      ["cardUnknown", "cardReview", "cardKnown"].forEach(function (id) { $(id).querySelector(".when").textContent = ""; });
      return;
    }

    var w = deck[deckPos];
    var rev = $("cardReverse").checked;
    var en = '<div class="card-word">' + esc(w.w) + '</div><div class="card-sub">' + (TYPE_LABELS[w.t] || "kelime") + "</div>";
    var tr = '<div class="card-word tr">' + esc(w.m) + '</div><div class="card-example">' + esc(w.e || "") + "</div>";
    $("cardFront").innerHTML = rev ? '<div class="card-word tr">' + esc(w.m) + "</div>" : en;
    $("cardBack").innerHTML = rev ? en + '<div class="card-example">' + esc(w.e || "") + "</div>" : tr;

    var r = state.srs[cardKey(w)];
    $("cardProgress").innerHTML = "Kart " + (deckPos + 1) + " / " + deck.length +
      (r ? ' · <span class="srs-tag box' + Math.min(r.box, 2) + '">' + BOX_LABELS[r.box] + "</span>" +
        (r.lapses ? " · " + r.lapses + " kez bilmedin" : "")
        : isKnown(w) ? " · bu kelimeyi biliyorsun" : "");

    // Düğmelerde bir sonraki tekrar zamanı
    $("cardUnknown").querySelector(".when").textContent = planText(srsPlan(w, 0));
    $("cardReview").querySelector(".when").textContent = planText(srsPlan(w, 1));
    $("cardKnown").querySelector(".when").textContent = planText(srsPlan(w, 2));
  }

  function flipCard() {
    if (deckPos >= deck.length) { startCards(); return; }
    flipped = !flipped;
    $("flashcard").classList.toggle("flipped", flipped);
  }

  // grade: 0 = Bilmiyorum, 1 = Tekrara ihtiyacım var, 2 = Biliyorum
  function answerCard(grade) {
    if (deckPos >= deck.length) return;
    var w = deck[deckPos];
    var k = cardKey(w);
    srsAnswer(w, grade);
    setKnown(w, grade === 2, "kart");
    // Oturum içinde yeniden gösterme: bilinmeyen 3 kart sonra (en fazla 5 kez), tekrar istenen 8 kart sonra (bir kez)
    var reps = sessionReps[k] || 0;
    if (grade === 0 && reps < 5) {
      deck.splice(Math.min(deck.length, deckPos + 4), 0, w);
      sessionReps[k] = reps + 1;
    } else if (grade === 1 && reps < 1) {
      deck.splice(Math.min(deck.length, deckPos + 9), 0, w);
      sessionReps[k] = reps + 1;
    }
    deckPos++;
    save();
    showCard();
  }

  function initCards() {
    $("flashcard").addEventListener("click", flipCard);
    $("cardKnown").addEventListener("click", function () { answerCard(2); });
    $("cardReview").addEventListener("click", function () { answerCard(1); });
    $("cardUnknown").addEventListener("click", function () { answerCard(0); });
    $("cardSet").addEventListener("change", startCards);
    $("cardReverse").addEventListener("change", showCard);
    document.addEventListener("keydown", function (e) {
      if ($("view-cards").hidden) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === " ") { e.preventDefault(); flipCard(); }
      else if (e.key === "ArrowRight" || e.key === "3") answerCard(2);
      else if (e.key === "ArrowDown" || e.key === "2") { e.preventDefault(); answerCard(1); }
      else if (e.key === "ArrowLeft" || e.key === "1") answerCard(0);
    });
    updateSrsBadge();
  }

  // ---------- Ortak çoktan seçmeli test motoru ----------
  // items: [{ prompt, passage?, options, answer, explain?, onAnswer? }]
  function runQuiz(container, items, opts) {
    var pos = 0, score = 0, results = [];

    function render() {
      if (pos >= items.length) return finish();
      var it = items[pos];
      container.innerHTML =
        '<div class="quiz-meta"><span>Soru ' + (pos + 1) + " / " + items.length + "</span>" +
        (it.label ? '<span class="tag">' + esc(it.label) + "</span>" : "") +
        "<span>Doğru: " + score + "</span></div>" +
        '<div class="bar"><span style="width:' + Math.round((pos / items.length) * 100) + '%"></span></div>' +
        (it.passage ? '<div class="passage">' + passageHtml(it.passage, it.prompt) + "</div>" : "") +
        '<p class="prompt">' + highlightBlank(esc(it.prompt)) + "</p>" +
        '<div class="options">' + it.options.map(function (o, i) {
          return '<button class="option" data-i="' + i + '"><span class="letter">' + LETTERS[i] + ")</span> " + esc(o) + "</button>";
        }).join("") + "</div>" +
        '<div class="feedback" id="quizFeedback"></div>';

      container.querySelectorAll(".option").forEach(function (btn) {
        btn.addEventListener("click", function () { choose(parseInt(btn.getAttribute("data-i"), 10)); });
      });
    }

    function choose(i) {
      var it = items[pos];
      var ok = i === it.answer;
      if (ok) score++;
      results.push({ item: it, chosen: i, ok: ok });
      if (it.onAnswer) it.onAnswer(ok, i);

      container.querySelectorAll(".option").forEach(function (btn) {
        var bi = parseInt(btn.getAttribute("data-i"), 10);
        btn.disabled = true;
        if (bi === it.answer) btn.classList.add("correct");
        else if (bi === i) btn.classList.add("wrong");
      });

      var fb = container.querySelector("#quizFeedback");
      fb.innerHTML =
        '<p class="' + (ok ? "ok" : "bad") + '">' + (ok ? "Doğru!" : "Yanlış. Doğru cevap: " + LETTERS[it.answer] + ")") + "</p>" +
        (it.explain ? '<p class="explain">' + esc(it.explain) + "</p>" : "") +
        '<button class="btn btn-primary" id="quizNext">' + (pos + 1 < items.length ? "Sonraki soru →" : "Sonuçları gör") + "</button>";
      var next = container.querySelector("#quizNext");
      next.focus();
      next.addEventListener("click", function () { pos++; render(); });
    }

    function finish() {
      var pct = items.length ? Math.round((score / items.length) * 100) : 0;
      if (opts.onFinish) opts.onFinish(pct);
      var wrong = results.filter(function (r) { return !r.ok; });
      container.innerHTML =
        '<div class="result"><div class="result-score">' + pct + "%</div>" +
        "<p>" + items.length + " sorudan <strong>" + score + "</strong> doğru, <strong>" + (items.length - score) + "</strong> yanlış.</p>" +
        '<p class="muted">' + resultMessage(pct) + "</p>" +
        '<button class="btn btn-primary" id="quizAgain">Tekrar çöz</button></div>' +
        (wrong.length ? "<h2>Yanlış yaptıkların</h2>" + wrong.map(function (r) {
          return '<div class="review"><p class="prompt">' + highlightBlank(esc(r.item.prompt)) + "</p>" +
            '<p><span class="bad">Senin cevabın: ' + LETTERS[r.chosen] + ") " + esc(r.item.options[r.chosen]) + "</span><br>" +
            '<span class="ok">Doğru cevap: ' + LETTERS[r.item.answer] + ") " + esc(r.item.options[r.item.answer]) + "</span></p>" +
            (r.item.explain ? '<p class="explain">' + esc(r.item.explain) + "</p>" : "") + "</div>";
        }).join("") : "");
      container.querySelector("#quizAgain").addEventListener("click", opts.onRestart);
    }

    render();
  }

  // Paragraftaki boşlukları vurgular; soru "(3) numaralı boşluk…" ise o boşluk ayrıca işaretlenir
  function passageHtml(passage, prompt) {
    var cur = /^\((\d+)\)/.exec(prompt || "");
    return esc(passage).replace(/\((\d+)\)\s*----/g, function (m, n) {
      return '<span class="blank-num' + (cur && cur[1] === n ? " is-current" : "") + '">(' + n + ')&nbsp;______</span>';
    }).replace(/----/g, '<span class="blank">______</span>');
  }

  function highlightBlank(html) {
    return html.replace(/----/g, '<span class="blank">______</span>');
  }

  function resultMessage(pct) {
    if (pct >= 90) return "Mükemmel! Bu konuya hâkimsin.";
    if (pct >= 70) return "Çok iyi. Yanlışlarını gözden geçirip devam et.";
    if (pct >= 50) return "Fena değil, ama biraz daha tekrar faydalı olur.";
    return "Kelime kartlarıyla tekrar yapıp yeniden dene.";
  }

  // Test sırasında 1-5 veya A-E tuşlarıyla cevaplama, Enter ile ilerleme
  document.addEventListener("keydown", function (e) {
    var view = document.querySelector(".view:not([hidden])");
    if (!view || (view.id !== "view-vocab-quiz" && view.id !== "view-questions" && view.id !== "view-review")) return;
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") return;
    var key = e.key.toUpperCase();
    var idx = "12345".indexOf(key);
    if (idx === -1) idx = LETTERS.indexOf(key);
    if (idx !== -1) {
      var btn = view.querySelector('.option[data-i="' + idx + '"]:not(:disabled)');
      if (btn) btn.click();
    }
  });

  // ---------- Kelime testi ----------
  function buildVocabItems(count, dir) {
    var picked = shuffle(WORDS).slice(0, Math.min(count, WORDS.length));
    return picked.map(function (w) {
      var d = dir === "mix" ? (Math.random() < 0.5 ? "en" : "tr") : dir;
      // Çeldiricileri mümkünse aynı türden seç
      var same = shuffle(WORDS.filter(function (x) { return x !== w && x.t === w.t; }));
      var other = shuffle(WORDS.filter(function (x) { return x !== w && x.t !== w.t; }));
      var distractors = same.concat(other).slice(0, 4);
      var choices = shuffle([w].concat(distractors));
      return {
        label: d === "en" ? "Anlamı nedir?" : "İngilizcesi nedir?",
        prompt: d === "en" ? w.w : w.m,
        options: choices.map(function (c) { return d === "en" ? c.m : c.w; }),
        answer: choices.indexOf(w),
        explain: w.w + " (" + TYPE_LABELS[w.t] + "): " + w.m + " — " + w.e,
        onAnswer: function (ok) { if (!ok) setKnown(w, false, "test"); }
      };
    });
  }

  function initVocabQuiz() {
    function start() {
      var count = parseInt($("vqCount").value, 10);
      var items = buildVocabItems(count, $("vqDir").value);
      runQuiz($("vqBody"), items, {
        onFinish: function (pct) {
          if (pct > state.vocabBest) { state.vocabBest = pct; save(); }
        },
        onRestart: start
      });
    }
    $("vqStart").addEventListener("click", start);
  }

  // ---------- Soru bankası ----------
  var refreshCats = null;

  function initQuestions() {
    var sel = $("qCat");
    refreshCats = function () {
      var counts = {}, mine = 0, prev = sel.value;
      QUESTIONS.forEach(function (q) { counts[q.cat] = (counts[q.cat] || 0) + 1; if (q.uid) mine++; });
      sel.innerHTML = '<option value="">Tüm kategoriler (' + QUESTIONS.length + ")</option>" +
        '<option value="__wrong">Yanlış yaptıklarım</option>' +
        (mine ? '<option value="__mine">Eklediğim sorular (' + mine + ")</option>" : "") +
        Object.keys(CATEGORIES).map(function (k) {
          return '<option value="' + k + '">' + esc(CATEGORIES[k]) + " (" + (counts[k] || 0) + ")</option>";
        }).join("");
      if (sel.querySelector('option[value="' + prev + '"]')) sel.value = prev;
    };
    refreshCats();

    function start() {
      var cat = sel.value;
      var pool = [];
      QUESTIONS.forEach(function (q, i) {
        if (cat === "__wrong") { if (state.answers[qKey(i)] === false) pool.push(i); }
        else if (cat === "__mine") { if (q.uid) pool.push(i); }
        else if (!cat || q.cat === cat) pool.push(i);
      });
      if ($("qShuffle").checked) pool = shuffle(pool);
      if (!pool.length) {
        $("qBody").innerHTML = '<p class="empty">' + (cat === "__wrong"
          ? "Yanlış yaptığın soru yok. Harika!" : "Bu kategoride soru bulunamadı.") + "</p>";
        return;
      }
      var items = pool.map(function (i) {
        var q = QUESTIONS[i];
        return {
          label: CATEGORIES[q.cat],
          passage: q.passage,
          prompt: q.q,
          options: q.o,
          answer: q.a,
          explain: q.x,
          onAnswer: function (ok, chosen) { recordAnswer(i, ok, chosen); }
        };
      });
      runQuiz($("qBody"), items, { onRestart: start });
    }
    $("qStart").addEventListener("click", start);
  }

  // Diğer modüllerin (ör. makale çeviri) kullanması için küçük bir arayüz
  window.YDSApp = {
    esc: esc,
    words: WORDS,
    getState: function () { return state; },
    save: save,
    setKnown: setKnown,
    reviewWords: reviewWords,
    weakSentenceCount: weakSentenceCount,
    wrongQuestionCount: wrongQuestionCount,
    srcLabels: SRC_LABELS,
    questions: QUESTIONS,
    qKey: qKey,
    qIndex: qIndex,
    wordRegex: wordRegex,
    mergeUserContent: mergeUserContent,
    renderWords: renderWords,
    refreshQuestionCats: function () { if (refreshCats) refreshCats(); },
    recordAnswer: recordAnswer,
    runQuiz: runQuiz,
    // Başka bölümlerden belirli bir kart destesini açmak için (ilk açılıştaki otomatik seçimi atlar)
    openCards: function (set) { cardsOpened = true; $("cardSet").value = set; },
    registerRoute: function (name, fn) { routes[name] = fn; }
  };

  document.addEventListener("click", function (e) {
    if (e.target.closest("#srsGo")) { cardsOpened = true; $("cardSet").value = "smart"; }
  });

  // ---------- Başlangıç ----------
  function init() {
    load();
    checkStorage();
    $("backupExport").addEventListener("click", exportBackup);
    $("backupImport").addEventListener("change", function () { if (this.files[0]) importBackup(this.files[0]); this.value = ""; });
    initTheme();
    initWords();
    initCards();
    initVocabQuiz();
    initQuestions();
    // app.js'ten önce yüklenen modüller (ör. js/articles.js) burada başlatılır
    (window.YDS_MODULES || []).forEach(function (fn) { fn(window.YDSApp); });
    $("resetProgress").addEventListener("click", function () {
      if (!confirm("Tüm ilerlemen (bildiğin kelimeler, kart tekrar hafızası, tekrar listen, soru ve çeviri sonuçları) silinecek. Emin misin?")) return;
      // Eklediğin kelimeler ve sorular ilerleme sayılmaz; sıfırlamada korunur
      var keepWords = state.userWords, keepQs = state.userQs;
      state = emptyState();
      state.userWords = keepWords;
      state.userQs = keepQs;
      save();
      route();
    });
    window.addEventListener("hashchange", route);
    route();
  }

  init();
})();
