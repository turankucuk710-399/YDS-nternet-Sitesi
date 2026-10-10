(function () {
  "use strict";

  var WORDS = window.YDS_WORDS || [];
  var QUESTIONS = window.YDS_QUESTIONS || [];
  var CATEGORIES = window.YDS_CATEGORIES || {};
  var LETTERS = ["A", "B", "C", "D", "E"];
  var TYPE_LABELS = { v: "fiil", n: "isim", adj: "sıfat", adv: "zarf", phr: "öbek fiil", conj: "bağlaç", art: "makale kelimesi" };
  var LEVEL_LABELS = { 1: "Temel", 2: "Orta", 3: "İleri" };

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
    return { known: {}, answers: {}, vocabBest: 0, artWords: {}, artScores: {}, missedWords: {}, weakSents: {} };
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
      }
    } catch (e) { /* depolama yoksa bellekte devam et */ }
  }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { }
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

  var SRC_LABELS = { makale: "Makale", ceviri: "Çeviri hatası", test: "Kelime testi", kart: "Kartlar", liste: "Kelime listesi" };

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
    return Object.keys(state.answers).filter(function (k) { return state.answers[k] === false; }).length;
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
    cards: startCards,
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
    window.scrollTo(0, 0);
  }

  // ---------- Ana sayfa ----------
  function renderHome() {
    var knownCount = WORDS.filter(isKnown).length;
    var answeredIds = Object.keys(state.answers);
    var correct = answeredIds.filter(function (k) { return state.answers[k]; }).length;
    var pct = WORDS.length ? Math.round((knownCount / WORDS.length) * 100) : 0;

    $("homeStats").innerHTML =
      stat(knownCount + " / " + WORDS.length, "Öğrenilen kelime", pct) +
      stat(answeredIds.length + " / " + QUESTIONS.length, "Çözülen soru",
        QUESTIONS.length ? Math.round((answeredIds.length / QUESTIONS.length) * 100) : 0) +
      stat(answeredIds.length ? Math.round((correct / answeredIds.length) * 100) + "%" : "—", "Soru başarı oranı", null) +
      stat(state.vocabBest ? state.vocabBest + "%" : "—", "En iyi kelime testi", null) +
      stat(String(reviewWords().length + weakSentenceCount() + wrongQuestionCount()), "Tekrar bekleyen", null, "#review");
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
      if (status === "unknown" && isKnown(w)) return false;
      if (q && trLower(w.w).indexOf(q) === -1 && trLower(w.m).indexOf(q) === -1) return false;
      return true;
    }).sort(function (a, b) { return a.w.localeCompare(b.w, "en"); });

    $("wordCount").textContent = list.length + " kelime gösteriliyor";
    $("wordList").innerHTML = list.length ? list.map(function (w) {
      var known = isKnown(w);
      return '<article class="word' + (known ? " is-known" : "") + '">' +
        '<div class="word-head"><h3>' + esc(w.w) + '</h3>' +
        '<span class="tag">' + TYPE_LABELS[w.t] + '</span>' +
        '<span class="tag tag-lvl' + w.lvl + '">' + LEVEL_LABELS[w.lvl] + "</span>" +
        '<button class="mark" data-word="' + esc(w.w) + '" aria-pressed="' + known + '" title="Bildiklerime ekle/çıkar">' +
        (known ? "✓ Biliyorum" : "+ Biliyorum") + "</button></div>" +
        '<p class="meaning">' + esc(w.m) + "</p>" +
        '<p class="example">' + esc(w.e) + "</p></article>";
    }).join("") : '<p class="empty">Aramana uygun kelime bulunamadı.</p>';
  }

  function initWords() {
    ["wordSearch", "wordType", "wordLevel", "wordStatus"].forEach(function (id) {
      $(id).addEventListener("input", renderWords);
    });
    $("wordList").addEventListener("click", function (e) {
      var btn = e.target.closest(".mark");
      if (!btn) return;
      var w = WORDS.find(function (x) { return x.w === btn.getAttribute("data-word"); });
      if (w) { setKnown(w, !isKnown(w), "liste"); renderWords(); }
    });
  }

  // ---------- Kartlar ----------
  var deck = [], deckPos = 0, flipped = false;

  function startCards() {
    var set = $("cardSet").value;
    if (set === "review") { deck = shuffle(reviewWords()); deckPos = 0; showCard(); return; }
    var pool = WORDS.filter(function (w) {
      if (set === "all") return true;
      if (set === "unknown") return !isKnown(w);
      return w.t === set;
    });
    deck = shuffle(pool);
    deckPos = 0;
    showCard();
  }

  function showCard() {
    flipped = false;
    $("flashcard").classList.remove("flipped");
    var done = deckPos >= deck.length;
    $("cardKnown").disabled = $("cardUnknown").disabled = done;

    if (done) {
      $("cardProgress").textContent = deck.length ? "Bu desteyi bitirdin!" : "";
      $("cardFront").innerHTML = deck.length
        ? '<div class="card-word">Tebrikler! 🎉</div><div class="card-sub">Yeni bir deste seç veya tekrar başlamak için tıkla.</div>'
        : '<div class="card-word">Kart yok</div><div class="card-sub">Bu desteyi tamamen biliyorsun. Başka bir deste seç.</div>';
      $("cardBack").innerHTML = "";
      return;
    }

    var w = deck[deckPos];
    var rev = $("cardReverse").checked;
    var en = '<div class="card-word">' + esc(w.w) + '</div><div class="card-sub">' + TYPE_LABELS[w.t] + "</div>";
    var tr = '<div class="card-word tr">' + esc(w.m) + '</div><div class="card-example">' + esc(w.e) + "</div>";
    $("cardFront").innerHTML = rev ? '<div class="card-word tr">' + esc(w.m) + "</div>" : en;
    $("cardBack").innerHTML = rev ? en + '<div class="card-example">' + esc(w.e) + "</div>" : tr;
    $("cardProgress").textContent = "Kart " + (deckPos + 1) + " / " + deck.length +
      (isKnown(w) ? " · bu kelimeyi biliyorsun" : "");
  }

  function flipCard() {
    if (deckPos >= deck.length) { startCards(); return; }
    flipped = !flipped;
    $("flashcard").classList.toggle("flipped", flipped);
  }

  function answerCard(known) {
    if (deckPos >= deck.length) return;
    var w = deck[deckPos];
    setKnown(w, known, "kart");
    if (!known) {
      // Bilinmeyen kelimeyi birkaç kart sonra tekrar göster
      var insertAt = Math.min(deck.length, deckPos + 4);
      deck.splice(insertAt, 0, w);
    }
    deckPos++;
    showCard();
  }

  function initCards() {
    $("flashcard").addEventListener("click", flipCard);
    $("cardKnown").addEventListener("click", function () { answerCard(true); });
    $("cardUnknown").addEventListener("click", function () { answerCard(false); });
    $("cardSet").addEventListener("change", startCards);
    $("cardReverse").addEventListener("change", showCard);
    document.addEventListener("keydown", function (e) {
      if ($("view-cards").hidden) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === " ") { e.preventDefault(); flipCard(); }
      else if (e.key === "ArrowRight") answerCard(true);
      else if (e.key === "ArrowLeft") answerCard(false);
    });
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
        (it.passage ? '<div class="passage">' + esc(it.passage) + "</div>" : "") +
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
      if (it.onAnswer) it.onAnswer(ok);

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
      var next = $("quizNext");
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
      $("quizAgain").addEventListener("click", opts.onRestart);
    }

    render();
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
  function initQuestions() {
    var sel = $("qCat");
    var counts = {};
    QUESTIONS.forEach(function (q) { counts[q.cat] = (counts[q.cat] || 0) + 1; });
    sel.innerHTML = '<option value="">Tüm kategoriler (' + QUESTIONS.length + ")</option>" +
      '<option value="__wrong">Yanlış yaptıklarım</option>' +
      Object.keys(CATEGORIES).map(function (k) {
        return '<option value="' + k + '">' + esc(CATEGORIES[k]) + " (" + (counts[k] || 0) + ")</option>";
      }).join("");

    function start() {
      var cat = sel.value;
      var pool = [];
      QUESTIONS.forEach(function (q, i) {
        if (cat === "__wrong") { if (state.answers[i] === false) pool.push(i); }
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
          onAnswer: function (ok) { state.answers[i] = ok; save(); }
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
    runQuiz: runQuiz,
    registerRoute: function (name, fn) { routes[name] = fn; }
  };

  // ---------- Başlangıç ----------
  function init() {
    load();
    initTheme();
    initWords();
    initCards();
    initVocabQuiz();
    initQuestions();
    // app.js'ten önce yüklenen modüller (ör. js/articles.js) burada başlatılır
    (window.YDS_MODULES || []).forEach(function (fn) { fn(window.YDSApp); });
    $("resetProgress").addEventListener("click", function () {
      if (!confirm("Tüm ilerlemen (bildiğin kelimeler, tekrar listen, soru ve çeviri sonuçları) silinecek. Emin misin?")) return;
      state = emptyState();
      save();
      route();
    });
    window.addEventListener("hashchange", route);
    route();
  }

  init();
})();
