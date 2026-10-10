// Tekrar alanı: eksik kelimeler, zayıf çeviri cümleleri ve yanlış sorular tek yerde.
(window.YDS_MODULES = window.YDS_MODULES || []).push(function (app) {
  "use strict";

  var Check = window.YDSTranslateCheck;
  var esc = app.esc;
  var TERM_RE = /\{\{([^|}]+)\|([^|}]+)(?:\|([^}]*))?\}\}/g;
  var tab = null;          // "sents" | "words" | "questions"
  var wordFilter = "";     // kaynak filtresi
  var sentSort = "score";  // "score" | "recent"
  var drill = null;        // { ids, pos, cleared, improved }

  function $(id) { return document.getElementById(id); }
  function state() { return app.getState(); }
  function Art() { return window.YDSArticles; }

  function weakList() {
    var st = state();
    return Object.keys(st.weakSents).map(function (id) {
      var w = st.weakSents[id];
      var a = Art().find(w.a);
      if (!a || !a.sentences[w.i]) return null;
      return { id: id, w: w, article: a, s: a.sentences[w.i] };
    }).filter(Boolean).sort(function (x, y) {
      return sentSort === "score" ? x.w.score - y.w.score : y.w.t - x.w.t;
    });
  }

  function wrongQuestions() {
    var st = state(), qs = window.YDS_QUESTIONS || [];
    return Object.keys(st.answers).filter(function (k) { return st.answers[k] === false && qs[k]; })
      .map(function (k) { return { i: +k, q: qs[k] }; });
  }

  function totalCount() {
    return app.reviewWords().length + app.weakSentenceCount() + app.wrongQuestionCount();
  }

  function updateBadge() {
    var n = totalCount();
    var b = $("reviewBadge");
    b.textContent = n;
    b.hidden = !n;
  }

  // ---------- Sayfa ----------
  function render() {
    drill = null;
    var words = app.reviewWords().length, sents = app.weakSentenceCount(), qs = app.wrongQuestionCount();
    if (!tab) tab = sents ? "sents" : words ? "words" : qs ? "questions" : "sents";
    renderTabs();

    if (tab === "sents") renderSents();
    else if (tab === "words") renderWords();
    else renderQuestions();
    updateBadge();
  }

  function renderTabs() {
    $("revTabs").innerHTML =
      tabBtn("sents", "Çeviri cümleleri", app.weakSentenceCount()) +
      tabBtn("words", "Kelimeler", app.reviewWords().length) +
      tabBtn("questions", "Yanlış sorular", app.wrongQuestionCount());
  }

  function tabBtn(key, label, n) {
    return '<button class="rev-tab' + (tab === key ? " active" : "") + '" data-tab="' + key + '">' +
      '<span class="rev-tab-n">' + n + "</span><span>" + label + "</span></button>";
  }

  function renderSents() {
    var list = weakList();
    if (!list.length) {
      $("revBody").innerHTML = '<div class="empty-box"><p><strong>Tekrar edilecek çeviri cümlen yok.</strong></p>' +
        '<p class="muted">Makale Çeviri bölümünde çevirini kontrol ettiğinde 85 puanın altında kalan cümleler buraya eklenir. ' +
        "Burada onları tek tek yeniden çevirebilirsin; 85'i geçince listeden çıkarlar.</p>" +
        '<a class="btn btn-primary" href="#articles">Makalelere git</a></div>';
      return;
    }
    $("revBody").innerHTML =
      '<div class="toolbar">' +
      '<button class="btn btn-primary" data-drill="all">Hepsini sırayla çalış (' + list.length + ")</button>" +
      '<select id="revSort"><option value="score"' + (sentSort === "score" ? " selected" : "") + '>En düşük puan önce</option>' +
      '<option value="recent"' + (sentSort === "recent" ? " selected" : "") + ">En yeni önce</option></select></div>" +
      '<div class="rev-list">' + list.map(function (x) {
        var b = Art().band(x.w.score);
        return '<div class="rev-item sent-review ' + b + '">' +
          '<div class="sent-review-head"><span>' + esc(x.article.title) + " · Cümle " + (x.w.i + 1) + "</span>" +
          '<span class="score-pill ' + b + '">' + x.w.score + "</span></div>" +
          '<p class="sr-en">' + esc(Check.plainEnglish(x.s.en)) + "</p>" +
          '<p class="muted small">' + x.w.tries + " deneme · en iyi puan " + x.w.best +
          (x.w.first !== undefined && x.w.best > x.w.first ? " · ilk puan " + x.w.first + " → gelişme +" + (x.w.best - x.w.first) : "") + "</p>" +
          (x.w.missing && x.w.missing.length ? '<div class="chips">' + x.w.missing.map(function (m) {
            return '<span class="chip">' + esc(m) + "</span>";
          }).join("") + "</div>" : "") +
          '<div class="rev-actions"><button class="btn btn-primary btn-sm" data-drill="' + esc(x.id) + '">Tekrar çevir</button>' +
          '<button class="btn btn-sm" data-remove-sent="' + esc(x.id) + '">Listeden çıkar</button></div></div>';
      }).join("") + "</div>";
  }

  function renderWords() {
    var all = app.reviewWords();
    if (!all.length) {
      $("revBody").innerHTML = '<div class="empty-box"><p><strong>Tekrar edilecek kelimen yok.</strong></p>' +
        '<p class="muted">Makalelerde "Öğrenmedim" dediğin, çevirinde karşılığını yazamadığın, kartlarda "Bilmiyorum" dediğin ve kelime testinde yanlış yaptığın kelimeler burada toplanır.</p>' +
        '<a class="btn btn-primary" href="#articles">Makalelere git</a> <a class="btn" href="#vocab-quiz">Kelime testi çöz</a></div>';
      return;
    }
    var counts = {};
    all.forEach(function (w) { counts[w.src] = (counts[w.src] || 0) + 1; });
    if (wordFilter && !counts[wordFilter]) wordFilter = "";
    var list = all.filter(function (w) { return !wordFilter || w.src === wordFilter; });

    $("revBody").innerHTML =
      '<div class="toolbar">' +
      '<a class="btn btn-primary" href="#cards" data-cards="1">Kartlarla çalış</a>' +
      '<button class="btn" data-word-quiz="1"' + (all.length < 2 ? " disabled" : "") + ">Hızlı test</button></div>" +
      '<div class="chips filter-chips">' +
      '<button class="chip' + (!wordFilter ? " active" : "") + '" data-src="">Tümü (' + all.length + ")</button>" +
      Object.keys(counts).map(function (k) {
        return '<button class="chip' + (wordFilter === k ? " active" : "") + '" data-src="' + k + '">' +
          esc(app.srcLabels[k] || k) + " (" + counts[k] + ")</button>";
      }).join("") + "</div>" +
      '<div class="word-list">' + list.map(function (w) {
        return '<article class="word">' +
          '<div class="word-head"><h3>' + esc(w.w) + "</h3>" +
          '<span class="tag">' + esc(app.srcLabels[w.src] || w.src) + "</span>" +
          (w.n > 1 ? '<span class="tag tag-lvl3">' + w.n + " kez yanlış</span>" : "") +
          '<button class="mark" data-learn="' + esc(w.key) + '">✓ Öğrendim</button></div>' +
          '<p class="meaning">' + esc(w.m) + "</p>" +
          '<p class="example">' + esc(w.e) + "</p></article>";
      }).join("") + "</div>";
  }

  function renderQuestions() {
    var list = wrongQuestions();
    var cats = window.YDS_CATEGORIES || {};
    if (!list.length) {
      $("revBody").innerHTML = '<div class="empty-box"><p><strong>Yanlış yaptığın soru yok.</strong></p>' +
        '<p class="muted">Soru Bankası\'nda yanlış cevapladığın sorular burada listelenir; doğru cevapladığında listeden çıkar.</p>' +
        '<a class="btn btn-primary" href="#questions">Soru Bankası\'na git</a></div>';
      return;
    }
    $("revBody").innerHTML =
      '<div class="toolbar"><button class="btn btn-primary" data-wrong-q="1">Yanlışları yeniden çöz (' + list.length + ")</button></div>" +
      '<div class="rev-list">' + list.map(function (x) {
        var text = x.q.q.length > 160 ? x.q.q.slice(0, 160) + "…" : x.q.q;
        return '<div class="rev-item review"><div class="sent-review-head"><span>' + esc(cats[x.q.cat] || x.q.cat) + "</span></div>" +
          "<p>" + esc(text).replace(/----/g, '<span class="blank">______</span>') + "</p></div>";
      }).join("") + "</div>";
  }

  // ---------- Cümle tekrar çalışması ----------
  function startDrill(startId) {
    var ids = weakList().map(function (x) { return x.id; });
    if (startId !== "all") {
      // Seçilen cümleden başla, sonra listedeki diğerleriyle devam et
      var at = ids.indexOf(startId);
      ids = at >= 0 ? ids.slice(at).concat(ids.slice(0, at)) : [startId];
    }
    drill = { ids: ids, pos: 0, cleared: 0, improved: 0, checked: false };
    renderDrill();
  }

  function sentenceHtml(en) {
    var html = "", last = 0, m;
    TERM_RE.lastIndex = 0;
    while ((m = TERM_RE.exec(en))) {
      html += esc(en.slice(last, m.index)) + '<span class="term-sample">' + esc(m[1]) + "</span>";
      last = TERM_RE.lastIndex;
    }
    return html + esc(en.slice(last));
  }

  function renderDrill() {
    if (drill.pos >= drill.ids.length) return finishDrill();
    var id = drill.ids[drill.pos];
    var w = state().weakSents[id];
    var parts = id.split(":");
    var article = Art().find(parts[0]);
    var idx = parseInt(parts[1], 10);
    var s = article.sentences[idx];
    var terms = Check.parseTerms(s.en);
    drill.checked = false;

    $("revBody").innerHTML =
      '<div class="quiz-meta"><span>Cümle ' + (drill.pos + 1) + " / " + drill.ids.length + "</span>" +
      '<span class="tag">' + esc(article.title) + "</span>" +
      '<button class="linkish" data-drill-exit="1">Listeye dön</button></div>' +
      '<div class="bar"><span style="width:' + Math.round((drill.pos / drill.ids.length) * 100) + '%"></span></div>' +
      '<div class="drill-card">' +
      '<p class="drill-en">' + sentenceHtml(s.en) + "</p>" +
      (w ? '<p class="muted small">Önceki puanın: <span class="score-pill ' + Art().band(w.score) + '">' + w.score + "</span> · " + w.tries + " deneme</p>" : "") +
      '<details class="drill-hints"><summary>İpuçları: anahtar kelimelerin anlamları</summary><ul>' +
      terms.map(function (t) { return "<li><strong>" + esc(t.en) + "</strong> — " + esc(t.meaning) + "</li>"; }).join("") +
      "</ul></details>" +
      (w && w.user ? '<details class="drill-hints"><summary>Önceki çevirin</summary><p>' + esc(w.user) + "</p></details>" : "") +
      '<textarea id="drillInput" rows="4" placeholder="Bu cümleyi Türkçeye çevir…"></textarea>' +
      '<div class="toolbar art-actions">' +
      '<button class="btn btn-primary" data-drill-check="1">Kontrol et</button>' +
      '<button class="btn" data-drill-skip="1">Atla</button></div>' +
      '<div id="drillResult"></div></div>';
    $("drillInput").focus();
  }

  function checkDrill() {
    var text = $("drillInput").value;
    if (!text.trim()) { $("drillResult").innerHTML = '<p class="empty">Önce çevirini yaz.</p>'; return; }
    var id = drill.ids[drill.pos];
    var parts = id.split(":");
    var article = Art().find(parts[0]);
    var idx = parseInt(parts[1], 10);
    var s = article.sentences[idx];
    var prev = state().weakSents[id];
    var prevScore = prev ? prev.score : 0;

    var res = Check.check({ sentences: [s] }, text).sentences[0];
    res.user = text.trim();
    var r = res.result;
    Art().trackResults(article, [{ i: idx, user: res.user, result: r }]);
    if (r.score >= 85) drill.cleared++;
    else if (r.score > prevScore) drill.improved++;
    drill.checked = true;

    var b = Art().band(r.score);
    $("drillResult").innerHTML =
      '<div class="sent-review ' + b + '">' +
      '<div class="sent-review-head"><span>Sonuç</span><span class="score-pill ' + b + '">' + r.score + "</span></div>" +
      (r.score >= 85
        ? '<p class="ok">✓ Harika! Bu cümleyi doğru çevirdin; tekrar listenden çıkarıldı.</p>'
        : '<p class="muted small">' + (r.score > prevScore ? "Önceki puanından (" + prevScore + ") daha iyi. 👏 " : "") +
          "85 ve üstü puan aldığında cümle listenden çıkar.</p>") +
      '<p><span class="sr-label">Örnek çeviri:</span> ' + esc(s.tr) + "</p>" +
      '<ul class="sr-issues">' + Art().sentenceIssues(r).map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>" +
      "</div>" +
      '<div class="toolbar">' +
      (r.score < 85 ? '<button class="btn" data-drill-retry="1">Tekrar dene</button>' : "") +
      '<button class="btn btn-primary" data-drill-next="1">' + (drill.pos + 1 < drill.ids.length ? "Sonraki cümle →" : "Bitir") + "</button></div>";
    renderTabs();
    updateBadge();
  }

  function finishDrill() {
    var left = app.weakSentenceCount();
    $("revBody").innerHTML =
      '<div class="result"><div class="result-score">' + drill.cleared + "</div>" +
      "<p><strong>" + drill.cleared + "</strong> cümleyi tekrar listenden çıkardın" +
      (drill.improved ? ", <strong>" + drill.improved + "</strong> cümlede puanını yükselttin" : "") + ".</p>" +
      '<p class="muted">' + (left ? "Listende " + left + " cümle kaldı." : "Tekrar edilecek cümle kalmadı. 🎉") + "</p>" +
      '<button class="btn btn-primary" data-drill-exit="1">Listeye dön</button></div>';
    drill = null;
    updateBadge();
  }

  // ---------- Kelime hızlı testi ----------
  function startWordQuiz() {
    var pool = app.reviewWords();
    var items = pool.slice(0, 20).map(function (w) {
      var others = pool.filter(function (x) { return x.key !== w.key; })
        .concat(app.words.filter(function (x) { return x.w.toLowerCase() !== w.key; }));
      var seen = {}, distract = [];
      shuffle(others).forEach(function (x) {
        if (distract.length < 4 && x.m !== w.m && !seen[x.m]) { seen[x.m] = true; distract.push(x); }
      });
      var choices = shuffle([w].concat(distract));
      return {
        label: "Anlamı nedir?",
        prompt: w.w,
        options: choices.map(function (c) { return c.m; }),
        answer: choices.indexOf(w),
        explain: w.w + ": " + w.m + " — " + w.e,
        onAnswer: function (ok) { app.setKnown(w, ok, w.src); }
      };
    });
    $("revBody").innerHTML = '<p class="muted small">Doğru bildiğin kelimeler tekrar listenden çıkar, yanlışlar listede kalır.</p><div id="revQuiz"></div>';
    app.runQuiz($("revQuiz"), shuffle(items), {
      onFinish: function () { updateBadge(); },
      onRestart: function () { render(); }
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

  // ---------- Olaylar ----------
  $("revTabs").addEventListener("click", function (e) {
    var b = e.target.closest("[data-tab]");
    if (b) { tab = b.getAttribute("data-tab"); render(); }
  });

  $("revBody").addEventListener("click", function (e) {
    var t = e.target.closest("button, a");
    if (!t) return;
    if (t.hasAttribute("data-drill")) startDrill(t.getAttribute("data-drill"));
    else if (t.hasAttribute("data-remove-sent")) {
      delete state().weakSents[t.getAttribute("data-remove-sent")];
      app.save(); render();
    } else if (t.hasAttribute("data-drill-check")) checkDrill();
    else if (t.hasAttribute("data-drill-retry")) renderDrill();
    else if (t.hasAttribute("data-drill-next") || t.hasAttribute("data-drill-skip")) { drill.pos++; renderDrill(); }
    else if (t.hasAttribute("data-drill-exit")) render();
    else if (t.hasAttribute("data-src")) { wordFilter = t.getAttribute("data-src"); renderWords(); }
    else if (t.hasAttribute("data-learn")) {
      var k = t.getAttribute("data-learn");
      var w = app.reviewWords().find(function (x) { return x.key === k; });
      if (w) app.setKnown(w, true);
      render();
    } else if (t.hasAttribute("data-cards")) $("cardSet").value = "review";
    else if (t.hasAttribute("data-word-quiz")) startWordQuiz();
    else if (t.hasAttribute("data-wrong-q")) {
      $("qCat").value = "__wrong";
      location.hash = "#questions";
      setTimeout(function () { $("qStart").click(); }, 0);
    }
  });

  $("revBody").addEventListener("change", function (e) {
    if (e.target.id === "revSort") { sentSort = e.target.value; renderSents(); }
  });

  $("revBody").addEventListener("keydown", function (e) {
    // Ctrl/Cmd + Enter ile kontrol et
    if (e.target.id === "drillInput" && e.key === "Enter" && (e.ctrlKey || e.metaKey) && !drill.checked) {
      e.preventDefault();
      checkDrill();
    }
  });

  window.addEventListener("hashchange", updateBadge);
  updateBadge();

  app.registerRoute("review", render);
});
