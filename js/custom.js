// Kullanıcının kendi kelimelerini ve sorularını eklemesi.
// Eklenenler yalnızca bu tarayıcıda (localStorage) saklanır; siteye ya da depoya yüklenmez.
(window.YDS_MODULES = window.YDS_MODULES || []).push(function (app) {
  "use strict";

  var esc = app.esc;
  var Check = window.YDSTranslateCheck;
  var L = ["A", "B", "C", "D", "E"];

  function $(id) { return document.getElementById(id); }
  function state() { return app.getState(); }
  function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function lower(s) { return String(s).trim().toLowerCase(); }

  // ---------- Sitedeki cümlelerden örnek bulma ----------
  var corpus = null;

  function buildCorpus() {
    var list = [];
    (window.YDS_ARTICLES || []).forEach(function (a) {
      a.sentences.forEach(function (s) {
        list.push({ en: Check.plainEnglish(s.en), tr: s.tr, src: "Makale: " + a.title });
      });
    });
    (window.YDS_QUESTIONS || []).forEach(function (q) {
      if (q.uid) return;
      // Çeviri sorularında doğru seçenek, cümlenin çevirisidir
      if (q.cat === "ceviriEnTr") list.push({ en: q.q, tr: q.o[q.a], src: "Soru Bankası" });
      else if (q.cat === "ceviriTrEn") list.push({ en: q.o[q.a], tr: q.q, src: "Soru Bankası" });
      else if (q.q.indexOf("----") === -1 && !/^\(I\)/.test(q.q) && q.q.length > 30) list.push({ en: q.q, tr: "", src: "Soru Bankası" });
      if (q.passage) {
        q.passage.replace(/([.!?])\s+/g, "$1\n").split("\n").forEach(function (p) {
          if (p.indexOf("----") === -1) list.push({ en: p.trim(), tr: "", src: "Okuma parçası" });
        });
      }
    });
    (window.YDS_WORDS || []).forEach(function (w) {
      if (w.e && !w.u) list.push({ en: w.e, tr: "", src: "Kelime listesi" });
    });
    var seen = {};
    return list.filter(function (x) {
      if (!x.en || seen[x.en]) return false;
      seen[x.en] = true;
      return true;
    });
  }

  // Kelimeyi (çekimli hâlleriyle) içeren cümleler: çevirisi olanlar ve orta uzunluktakiler önce
  function findExamples(word) {
    if (!corpus) corpus = buildCorpus();
    var re = app.wordRegex(word);
    return corpus.filter(function (x) { return re.test(x.en); })
      .sort(function (a, b) {
        if (!!b.tr !== !!a.tr) return b.tr ? 1 : -1;
        return Math.abs(a.en.length - 110) - Math.abs(b.en.length - 110);
      })
      .slice(0, 4);
  }

  // Makalelerdeki işaretli terimlerden anlam önerisi
  var termMeanings = null;
  function suggestMeaning(word) {
    if (!termMeanings) {
      termMeanings = {};
      (window.YDS_ARTICLES || []).forEach(function (a) {
        a.sentences.forEach(function (s) {
          Check.parseTerms(s.en).forEach(function (t) { termMeanings[lower(t.en)] = t.meaning; });
        });
      });
    }
    return termMeanings[lower(word)] || "";
  }

  function existing(word) {
    var w = lower(word);
    return app.words.find(function (x) { return lower(x.w) === w; });
  }

  // ---------- Kelime ekleme ----------
  function addWord(data) {
    var uw = {
      id: newId(),
      w: data.w.trim(),
      m: data.m.trim(),
      t: data.t || "x",
      e: (data.e || "").trim(),
      etr: (data.etr || "").trim(),
      t0: Date.now()
    };
    state().userWords.push(uw);
    app.mergeUserContent();
    var main = app.words.find(function (x) { return x.u && x.id === uw.id; });
    app.setKnown(main, false, "eklenen");           // kelime tekrar listesine
    if (uw.e) {                                       // örnek cümle çeviri tekrarına
      state().weakSents["u:" + uw.id] = { a: "__user", i: uw.id, score: null, best: 0, tries: 0, t: Date.now() };
    }
    app.save();
    return uw;
  }

  function deleteWord(id) {
    var st = state();
    var uw = st.userWords.find(function (x) { return x.id === id; });
    if (!uw || !confirm('"' + uw.w + '" kelimesi silinsin mi?')) return;
    st.userWords = st.userWords.filter(function (x) { return x.id !== id; });
    delete st.missedWords[uw.w];
    delete st.known[uw.w];
    delete st.weakSents["u:" + id];
    app.mergeUserContent();
    app.save();
    app.renderWords();
  }

  function selectedExample() {
    return { e: $("cwEx").value, etr: $("cwExTr").value };
  }

  function updateWordHelp() {
    var word = $("cwWord").value.trim();
    var help = $("cwHelp");
    if (!word) { help.innerHTML = ""; $("cwSuggest").innerHTML = ""; return; }
    var ex = existing(word);
    if (ex) {
      help.innerHTML = '<p class="bad small">"' + esc(ex.w) + '" zaten kelime listesinde: ' + esc(ex.m) + "</p>";
      $("cwSuggest").innerHTML = "";
      return;
    }
    var m = suggestMeaning(word);
    help.innerHTML = m && !$("cwMeaning").value.trim()
      ? '<p class="small">Önerilen anlam: <strong>' + esc(m) + '</strong> <button class="linkish" data-use-meaning="' + esc(m) + '">kullan</button></p>'
      : "";
    var found = findExamples(word);
    $("cwSuggest").innerHTML = found.length
      ? '<p class="small muted">Sitede bu kelimeyi içeren cümleler (seçmek için tıkla):</p>' +
        found.map(function (x, i) {
          return '<button class="ex-choice" data-ex="' + i + '"><span>' + esc(x.en) + "</span>" +
            '<span class="muted small">' + esc(x.src) + (x.tr ? " · çevirisi var" : "") + "</span></button>";
        }).join("")
      : '<p class="small muted">Sitede bu kelimeyi içeren bir cümle bulunamadı; istersen kendin bir örnek cümle yaz.</p>';
    $("cwSuggest")._found = found;
  }

  function saveWord() {
    var w = $("cwWord").value.trim(), m = $("cwMeaning").value.trim();
    var msg = $("cwMsg");
    if (!w || !m) { msg.innerHTML = '<p class="bad">Kelime ve Türkçe anlamı zorunlu.</p>'; return; }
    if (existing(w)) { msg.innerHTML = '<p class="bad">"' + esc(w) + '" zaten kelime listesinde.</p>'; return; }
    var ex = selectedExample();
    var auto = false;
    if (!ex.e.trim()) {
      var found = findExamples(w);
      if (found.length) { ex = { e: found[0].en, etr: found[0].tr }; auto = true; }
    }
    var uw = addWord({ w: w, m: m, t: $("cwType").value, e: ex.e, etr: ex.etr });
    msg.innerHTML = '<div class="tracked good"><strong>' + esc(uw.w) + "</strong> eklendi: kelime listesine, kartlara, kelime testine ve Tekrar → Kelimeler'e girdi." +
      (uw.e ? "<br>Örnek cümle" + (auto ? " (siteden otomatik bulundu)" : "") + " Tekrar → Çeviri cümleleri'ne eklendi: <em>" + esc(uw.e) + "</em>" +
        (uw.etr ? "" : "<br><span class=\"muted small\">Bu cümlenin çevirisi olmadığı için çeviri kontrolünde yalnızca kelimenin anlamına bakılacak.</span>")
        : "<br>Örnek cümle bulunamadı; yalnızca kelime eklendi.") +
      ' <a href="#review">Tekrar\'a git →</a></div>';
    ["cwWord", "cwMeaning", "cwEx", "cwExTr"].forEach(function (id) { $(id).value = ""; });
    $("cwType").value = "x";
    $("cwHelp").innerHTML = "";
    $("cwSuggest").innerHTML = "";
    app.renderWords();
  }

  // Toplu ekleme: her satır "kelime = anlam"
  function bulkAdd() {
    var lines = $("cwBulk").value.split("\n");
    var added = [], skipped = [], bad = [];
    lines.forEach(function (line) {
      if (!line.trim()) return;
      var m = line.split(/\s*[=:\t]\s*|\s+-\s+/);
      var w = (m[0] || "").trim(), mean = m.slice(1).join(", ").trim();
      if (!w || !mean) { bad.push(line.trim()); return; }
      if (existing(w)) { skipped.push(w); return; }
      var found = findExamples(w);
      added.push(addWord({ w: w, m: mean, t: "x", e: found[0] ? found[0].en : "", etr: found[0] ? found[0].tr : "" }));
    });
    var withSent = added.filter(function (x) { return x.e; }).length;
    $("cwBulkMsg").innerHTML =
      (added.length ? '<div class="tracked good"><strong>' + added.length + " kelime</strong> eklendi" +
        (withSent ? ", bunlardan " + withSent + " tanesine sitede örnek cümle bulunup çeviri tekrarına eklendi" : "") +
        '. <a href="#review">Tekrar\'a git →</a></div>' : "") +
      (skipped.length ? '<p class="small muted">Zaten listede olduğu için atlandı: ' + skipped.map(esc).join(", ") + "</p>" : "") +
      (bad.length ? '<p class="small bad">Anlaşılamayan satırlar ("kelime = anlam" biçiminde yaz): ' + bad.map(esc).join(" · ") + "</p>" : "");
    if (added.length) $("cwBulk").value = "";
    app.renderWords();
  }

  // ---------- Soru ekleme ----------
  function renderQuestionForm() {
    var cats = window.YDS_CATEGORIES || {};
    $("cqCat").innerHTML = Object.keys(cats).map(function (k) {
      return '<option value="' + k + '">' + esc(cats[k]) + "</option>";
    }).join("");
    $("cqBulkCat").innerHTML += Object.keys(cats).map(function (k) {
      return '<option value="' + k + '">Hepsi: ' + esc(cats[k]) + "</option>";
    }).join("");
    $("cqOptions").innerHTML = L.map(function (letter, i) {
      return '<label class="cq-opt"><input type="radio" name="cqCorrect" value="' + i + '"' + (i === 0 ? " checked" : "") + ">" +
        "<span>" + letter + ')</span><input type="text" id="cqO' + i + '" placeholder="' + letter + ' seçeneği"></label>';
    }).join("");
    renderMyQuestions();
  }

  function renderMyQuestions() {
    var qs = state().userQs;
    var cats = window.YDS_CATEGORIES || {};
    $("cqMineCount").textContent = qs.length;
    $("cqMine").innerHTML = qs.length ? qs.map(function (q) {
      return '<li><div><span class="tag">' + esc(cats[q.cat] || q.cat) + "</span> " + esc(q.q.length > 120 ? q.q.slice(0, 120) + "…" : q.q) +
        '<div class="small muted">' + (q.a >= 0 ? "Doğru cevap: " + L[q.a] + ") " + esc(q.o[q.a]) : "Cevap henüz işaretlenmedi (çözerken sorulacak)") + "</div></div>" +
        '<button class="btn btn-sm" data-del-q="' + esc(q.uid) + '">Sil</button></li>';
    }).join("") : '<li class="muted">Henüz soru eklemedin.</li>';
  }

  function saveQuestion() {
    var msg = $("cqMsg");
    var q = $("cqText").value.trim();
    var o = L.map(function (_, i) { return $("cqO" + i).value.trim(); });
    var checked = document.querySelector('input[name="cqCorrect"]:checked');
    if (!q || o.some(function (x) { return !x; })) {
      msg.innerHTML = '<p class="bad">Soru metni ve beş seçeneğin hepsi zorunlu.</p>';
      return;
    }
    var item = {
      uid: newId(),
      cat: $("cqCat").value,
      q: q,
      o: o,
      a: parseInt(checked.value, 10),
      x: $("cqExplain").value.trim() || "Bu soruyu sen ekledin; açıklama girilmemiş."
    };
    var passage = $("cqPassage").value.trim();
    if (passage) item.passage = passage;
    state().userQs.push(item);
    app.mergeUserContent();
    app.save();
    app.refreshQuestionCats();
    msg.innerHTML = '<div class="tracked good">Soru eklendi. Soru Bankası\'nda "Eklediğim sorular" ya da kendi kategorisinde çıkacak; yanlış yaparsan otomatik olarak Tekrar\'a düşecek.</div>';
    ["cqText", "cqExplain"].concat(L.map(function (_, i) { return "cqO" + i; })).forEach(function (id) { $(id).value = ""; });
    // Okuma parçası aynı parçaya birden çok soru eklemek için korunur
    renderMyQuestions();
  }

  // ---------- Toplu soru içe aktarma ----------
  var lastBatch = null;

  // 2. adım: metni ayır ve önizle
  var pending = [];

  function parsePreview() {
    var res = window.YDSImport.parse($("cqBulk").value, { category: $("cqBulkCat").value, keepUnanswered: true, ocr: true });
    var msg = $("cqBulkMsg");
    msg.innerHTML = "";
    pending = res.questions.map(function (q) { q.on = true; return q; });
    if (!pending.length) {
      $("cqPreviewBox").hidden = true;
      msg.innerHTML = '<p class="bad">Hiç soru ayrılamadı.' +
        (res.skipped.length ? " " + res.skipped.length + " soru bulundu ama eksikti: " + skippedText(res.skipped) : " Soru numaralarının ve A) … E) seçeneklerinin satır başında olduğunu kontrol et.") + "</p>";
      return;
    }
    renderPreview(res.skipped);
    $("cqPreviewBox").hidden = false;
    $("cqPreviewBox").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderPreview(skipped) {
    var cats = window.YDS_CATEGORIES || {};
    var noAns = pending.filter(function (q) { return q.a < 0; }).length;
    var head = '<p class="small">' + pending.length + " soru ayrıldı." +
      (noAns ? " <strong>" + noAns + " sorunun cevabı yok</strong> — sorun değil: hepsini şimdi kaydedebilirsin; soruyu çözerken doğru şıkkı bir kez işaretlemen istenir. İstersen şimdiden de işaretleyebilirsin." : " Cevapların hepsi anahtardan alındı; kontrol edip kaydedebilirsin.") + "</p>" +
      (skipped && skipped.length ? '<p class="small bad">Ayrılamayanlar: ' + skippedText(skipped) + " — metinde düzeltip yeniden ayırabilirsin.</p>" : "");
    $("cqPreview").innerHTML = head + '<ol class="imp-list">' + pending.map(function (q, i) {
      return '<li class="imp-item' + (q.a < 0 ? " no-ans" : "") + (q.on ? "" : " off") + '" data-imp="' + i + '">' +
        '<div class="imp-head"><label><input type="checkbox" data-imp-on' + (q.on ? " checked" : "") + "> Ekle</label>" +
        '<span class="imp-num">' + (q.n ? q.n + "." : "Numarasız") + "</span>" +
        '<select data-imp-cat aria-label="Kategori">' + Object.keys(cats).map(function (k) {
          return '<option value="' + k + '"' + (k === q.cat ? " selected" : "") + ">" + esc(cats[k]) + "</option>";
        }).join("") + "</select></div>" +
        (q.passage ? '<p class="imp-passage">Parça: ' + esc(q.passage.length > 160 ? q.passage.slice(0, 160) + "…" : q.passage) + "</p>" : "") +
        '<p class="imp-q">' + esc(q.q) + "</p>" +
        q.o.map(function (o, k) {
          return '<label class="imp-opt' + (q.a === k ? " is-ans" : "") + '"><input type="radio" name="imp-a-' + i + '" value="' + k + '"' + (q.a === k ? " checked" : "") + ">" +
            "<b>" + L[k] + ")</b><span>" + esc(o) + "</span></label>";
        }).join("") + "</li>";
    }).join("") + "</ol>";
  }

  function previewChange(e) {
    var li = e.target.closest("[data-imp]");
    if (!li) return;
    var q = pending[parseInt(li.getAttribute("data-imp"), 10)];
    if (e.target.matches("[data-imp-on]")) q.on = e.target.checked;
    else if (e.target.matches("[data-imp-cat]")) q.cat = e.target.value;
    else if (e.target.type === "radio") {
      q.a = parseInt(e.target.value, 10);
      q.on = true;
      li.querySelector("[data-imp-on]").checked = true;
      li.classList.remove("no-ans");
      li.querySelectorAll(".imp-opt").forEach(function (el, k) { el.classList.toggle("is-ans", k === q.a); });
    }
    li.classList.toggle("off", !q.on);
  }

  // 3. adım: işaretlenenleri kaydet
  function bulkImport() {
    var cats = window.YDS_CATEGORIES || {};
    var msg = $("cqBulkMsg");
    var chosen = pending.filter(function (q) { return q.on; });
    var missing = chosen.filter(function (q) { return q.a < 0; }).length;
    if (!chosen.length) {
      msg.innerHTML = '<p class="bad">Kaydedilecek soru seçilmedi.</p>';
      return;
    }
    var batch = newId();
    var existing = {};
    state().userQs.forEach(function (q) { existing[q.cat + "|" + q.q] = true; });
    var added = 0, dup = 0, counts = {};
    chosen.forEach(function (p) {
      if (existing[p.cat + "|" + p.q]) { dup++; return; }
      var q = { uid: newId(), b: batch, cat: p.cat, q: p.q, o: p.o, a: p.a, x: p.x };
      if (p.passage && (p.cat === "cloze" || p.cat === "okuma")) q.passage = p.passage;
      existing[q.cat + "|" + q.q] = true;
      state().userQs.push(q);
      counts[q.cat] = (counts[q.cat] || 0) + 1;
      added++;
    });
    app.mergeUserContent();
    app.save();
    app.refreshQuestionCats();
    renderMyQuestions();
    lastBatch = added ? batch : null;
    $("cqBulkUndo").hidden = !lastBatch;
    msg.innerHTML =
      '<div class="tracked good"><strong>' + added + " soru</strong> eklendi" +
      (added ? ": " + Object.keys(counts).map(function (k) { return esc(cats[k] || k) + " " + counts[k]; }).join(", ") : "") + "." +
      (dup ? " " + dup + " soru zaten ekli olduğu için atlandı." : "") +
      (missing ? " " + missing + " sorunun cevabını çözerken işaretleyeceksin." : "") +
      " Soru Bankası'nda \"Eklediğim sorular\" ya da kendi kategorilerinde çıkacak.</div>";
    if (added) {
      $("cqBulk").value = "";
      pending = [];
      $("cqPreviewBox").hidden = true;
    }
  }

  // 1. adım: fotoğraf / PDF'ten metin okuma
  var ocrPages = [], ocrBusy = false;

  function thumb(page) {
    var c = window.YDSOcr.scaled(window.YDSOcr.rotate(page.canvas, page.rot || 0), 260);
    return c.toDataURL("image/jpeg", 0.7);
  }

  function renderOcrPages() {
    $("ocrPages").innerHTML = ocrPages.map(function (p, i) {
      return '<div class="ocr-page" data-ocr="' + i + '"><img alt="" src="' + p.thumb + '">' +
        '<div class="ocr-name" title="' + esc(p.name) + '">' + esc(p.name) + "</div>" +
        '<div class="ocr-state' + (p.done ? " done" : "") + '">' + esc(p.state || (p.manual ? "Yön: elle" : "Yön: otomatik")) + "</div>" +
        '<div class="ocr-tools"><button type="button" data-rot="-90" title="Sola döndür" aria-label="Sola döndür"' + (ocrBusy ? " disabled" : "") + ">↺</button>" +
        '<button type="button" data-rot="90" title="Sağa döndür" aria-label="Sağa döndür"' + (ocrBusy ? " disabled" : "") + ">↻</button>" +
        '<button type="button" data-ocr-del title="Kaldır" aria-label="Kaldır"' + (ocrBusy ? " disabled" : "") + ">✕</button></div></div>";
    }).join("");
    $("ocrRun").hidden = !ocrPages.length;
    $("ocrClear").hidden = !ocrPages.length;
    $("ocrRun").disabled = ocrBusy || !ocrPages.some(function (p) { return !p.done; });
    $("ocrClear").disabled = ocrBusy;
  }

  function ocrStatus(html, frac) {
    $("ocrMsg").innerHTML = '<p class="small">' + html + "</p>" +
      (frac !== undefined ? '<div class="ocr-bar"><span style="width:' + Math.round(frac * 100) + '%"></span></div>' : "");
  }

  function addOcrFiles(files) {
    if (!window.YDSOcr || !files.length) return;
    ocrBusy = true;
    renderOcrPages();
    ocrStatus("Dosyalar açılıyor…");
    var list = Array.prototype.slice.call(files);
    list.reduce(function (p, f) {
      return p.then(function () { return window.YDSOcr.fileToPages(f, $("ocrRange").value); }).then(function (pages) {
        pages.forEach(function (pg) {
          pg.rot = 0;
          pg.thumb = thumb(pg);
          ocrPages.push(pg);
        });
      });
    }, Promise.resolve()).then(function () {
      ocrStatus(ocrPages.length + ' sayfa hazır. Gerekirse yönünü düzelt, sonra "Metni oku"ya bas.');
    }, function (err) {
      ocrStatus('<span class="bad">' + esc(err.message || String(err)) + "</span>");
    }).then(function () {
      ocrBusy = false;
      renderOcrPages();
      $("ocrFiles").value = "";
    });
  }

  function runOcr() {
    if (ocrBusy) return;
    var todo = ocrPages.filter(function (p) { return !p.done; });
    if (!todo.length) return;
    ocrBusy = true;
    var cols = parseInt($("ocrCols").value, 10);
    var texts = [];
    var total = todo.length;
    ocrStatus("Okuma motoru hazırlanıyor (ilk seferde indirilir)…", 0);
    renderOcrPages();
    window.YDSOcr.warmUp().then(function () {
      return todo.reduce(function (p, page, idx) {
        return p.then(function () {
          var label = "Sayfa " + (idx + 1) + "/" + total;
          page.state = "Yön bulunuyor…";
          renderOcrPages();
          ocrStatus(label + ": yön bulunuyor…", idx / total);
          var rot = page.manual ? Promise.resolve(page.rot) : window.YDSOcr.detectRotation(page.canvas);
          return rot.then(function (deg) {
            if (deg !== page.rot) { page.rot = deg; page.thumb = thumb(page); }
            page.state = "Okunuyor…";
            renderOcrPages();
            return window.YDSOcr.recognizePage(window.YDSOcr.rotate(page.canvas, page.rot), cols, function (f) {
              ocrStatus(label + " okunuyor… %" + Math.round(f * 100), (idx + f) / total);
            });
          }).then(function (text) {
            texts.push("=== Sayfa: " + page.name + " ===\n" + text);
            page.done = true;
            page.state = "Okundu ✓";
            renderOcrPages();
          });
        });
      }, Promise.resolve());
    }).then(function () {
      var box = $("cqBulk");
      var joined = texts.join("\n").trim();
      box.value = (box.value.trim() ? box.value.trim() + "\n" : "") + joined;
      ocrStatus('<span class="good">' + total + " sayfa okundu ve metin 2. adımdaki kutuya eklendi.</span> Bozuk okunan yerleri düzelt, sonra \"Soruları ayır\"a bas.");
    }, function (err) {
      if (texts.length) {
        var box = $("cqBulk");
        box.value = (box.value.trim() ? box.value.trim() + "\n" : "") + texts.join("\n").trim();
      }
      ocrStatus('<span class="bad">Okuma durdu: ' + esc(err && err.message ? err.message : String(err)) + "</span>" +
        (texts.length ? " Okunan " + texts.length + " sayfanın metni kutuya eklendi." : ""));
    }).then(function () {
      ocrBusy = false;
      renderOcrPages();
    });
  }

  function skippedText(list) {
    return list.map(function (s) { return (s.n || "numarasız") + " (" + esc(s.why) + ")"; }).join(", ");
  }

  function undoBatch() {
    if (!lastBatch) return;
    var st = state();
    st.userQs.filter(function (q) { return q.b === lastBatch; }).forEach(function (q) {
      delete st.answers["u" + q.uid];
      delete st.qWrong["u" + q.uid];
    });
    st.userQs = st.userQs.filter(function (q) { return q.b !== lastBatch; });
    lastBatch = null;
    app.mergeUserContent();
    app.save();
    app.refreshQuestionCats();
    renderMyQuestions();
    $("cqBulkUndo").hidden = true;
    $("cqBulkMsg").innerHTML = '<p class="muted">Son içe aktarma geri alındı.</p>';
  }

  function deleteQuestion(uid) {
    var st = state();
    if (!confirm("Bu soru silinsin mi?")) return;
    st.userQs = st.userQs.filter(function (q) { return q.uid !== uid; });
    delete st.answers["u" + uid];
    delete st.qWrong["u" + uid];
    app.mergeUserContent();
    app.save();
    app.refreshQuestionCats();
    renderMyQuestions();
  }

  // ---------- Olaylar ----------
  $("cwToggle").addEventListener("click", function () {
    var p = $("cwPanel");
    p.hidden = !p.hidden;
    this.setAttribute("aria-expanded", String(!p.hidden));
    if (!p.hidden) $("cwWord").focus();
  });
  var timer = null;
  $("cwWord").addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(updateWordHelp, 200);
  });
  $("cwHelp").addEventListener("click", function (e) {
    var b = e.target.closest("[data-use-meaning]");
    if (b) { $("cwMeaning").value = b.getAttribute("data-use-meaning"); $("cwHelp").innerHTML = ""; }
  });
  $("cwSuggest").addEventListener("click", function (e) {
    var b = e.target.closest("[data-ex]");
    if (!b) return;
    var x = $("cwSuggest")._found[parseInt(b.getAttribute("data-ex"), 10)];
    $("cwEx").value = x.en;
    $("cwExTr").value = x.tr || "";
    document.querySelectorAll(".ex-choice").forEach(function (el) { el.classList.toggle("active", el === b); });
  });
  $("cwSave").addEventListener("click", saveWord);
  $("cwBulkSave").addEventListener("click", bulkAdd);

  $("cqToggle").addEventListener("click", function () {
    var p = $("cqPanel");
    p.hidden = !p.hidden;
    this.setAttribute("aria-expanded", String(!p.hidden));
  });
  $("cqSave").addEventListener("click", saveQuestion);
  $("cqBulkParse").addEventListener("click", parsePreview);
  $("ocrFiles").addEventListener("change", function () { addOcrFiles(this.files); });
  $("ocrRun").addEventListener("click", runOcr);
  $("ocrClear").addEventListener("click", function () {
    ocrPages = [];
    $("ocrMsg").innerHTML = "";
    renderOcrPages();
  });
  $("ocrPages").addEventListener("click", function (e) {
    var box = e.target.closest("[data-ocr]");
    if (!box || ocrBusy) return;
    var i = parseInt(box.getAttribute("data-ocr"), 10);
    var r = e.target.closest("[data-rot]");
    if (r) {
      var p = ocrPages[i];
      p.rot = ((p.rot + parseInt(r.getAttribute("data-rot"), 10)) % 360 + 360) % 360;
      p.manual = true;
      p.done = false;
      p.state = "";
      p.thumb = thumb(p);
      renderOcrPages();
    } else if (e.target.closest("[data-ocr-del]")) {
      ocrPages.splice(i, 1);
      renderOcrPages();
    }
  });
  $("cqPreview").addEventListener("change", previewChange);
  $("cqBulkSave").addEventListener("click", bulkImport);
  $("cqBulkUndo").addEventListener("click", undoBatch);
  $("cqMine").addEventListener("click", function (e) {
    var b = e.target.closest("[data-del-q]");
    if (b) deleteQuestion(b.getAttribute("data-del-q"));
  });
  renderQuestionForm();

  window.YDSCustom = { deleteWord: deleteWord, findExamples: findExamples };
});
