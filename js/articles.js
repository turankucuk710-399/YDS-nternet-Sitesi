// Makale Çeviri bölümü: makale listesi, tıklanabilir kelimeler, tekrar listesi ve çeviri kontrolü.
(window.YDS_MODULES = window.YDS_MODULES || []).push(function (app) {
  "use strict";

  var ARTICLES = window.YDS_ARTICLES || [];
  var Check = window.YDSTranslateCheck;
  var esc = app.esc;
  var TERM_RE = /\{\{([^|}]+)\|([^|}]+)(?:\|([^}]*))?\}\}/g;

  function $(id) { return document.getElementById(id); }
  function state() { return app.getState(); }
  function keyOf(term) { return term.toLocaleLowerCase("en"); }
  function findArticle(id) { return ARTICLES.find(function (a) { return a.id === id; }); }

  function wordCount(a) {
    return a.sentences.reduce(function (n, s) {
      return n + Check.plainEnglish(s.en).split(/\s+/).filter(Boolean).length;
    }, 0);
  }

  function termsOf(a) {
    var seen = {}, list = [];
    a.sentences.forEach(function (s) {
      Check.parseTerms(s.en).forEach(function (t) {
        var k = keyOf(t.en);
        if (!seen[k]) { seen[k] = true; list.push(k); }
      });
    });
    return list;
  }

  function draftKey(id) { return "yds-art-draft-" + id; }
  function loadDraft(id) { try { return localStorage.getItem(draftKey(id)) || ""; } catch (e) { return ""; } }
  function saveDraft(id, v) { try { localStorage.setItem(draftKey(id), v); } catch (e) { } }

  // ---------- Liste ----------
  function renderList() {
    $("artList").hidden = false;
    $("artReader").hidden = true;
    closePop();

    $("artCards").innerHTML = ARTICLES.map(function (a) {
      var words = wordCount(a);
      var terms = termsOf(a);
      var learned = terms.filter(function (k) {
        var w = state().artWords[k];
        return w && w.st === "learned";
      }).length;
      var best = state().artScores[a.id];
      return '<a class="art-card" href="#articles/' + a.id + '">' +
        '<h3>' + esc(a.title) + "</h3>" +
        '<div class="art-meta"><span>' + esc(a.topic) + "</span><span>" + a.level + "</span><span>" + words +
        " kelime</span><span>~" + Math.max(2, Math.round(words / 50)) + " dk</span></div>" +
        '<div class="art-progress"><span>Öğrenilen kelime: ' + learned + " / " + terms.length + "</span>" +
        (best !== undefined ? '<span class="score-pill ' + band(best) + '">En iyi çeviri: ' + best + "</span>" : "") +
        "</div></a>";
    }).join("");
    renderReview();
  }

  function renderReview() {
    var list = app.reviewWords();
    $("artReviewCount").textContent = list.length;
    $("artReviewList").innerHTML = list.length ? list.map(function (w) {
      return '<li><div><strong>' + esc(w.w) + "</strong> — " + esc(w.m) +
        '<div class="muted small">' + esc(w.e) + "</div></div>" +
        '<button class="btn btn-good btn-sm" data-learn="' + esc(w.key) + '">Öğrendim</button></li>';
    }).join("") : '<li class="muted">Henüz tekrar listende kelime yok. Makalelerde mavi kelimelere tıklayıp "Öğrenmedim" dediğin kelimeler burada toplanır.</li>';
    $("artReviewCards").hidden = !list.length;
  }

  // ---------- Okuyucu ----------
  var current = null;

  function renderArticleText(a) {
    return a.sentences.map(function (s, i) {
      var html = "", last = 0, m;
      TERM_RE.lastIndex = 0;
      while ((m = TERM_RE.exec(s.en))) {
        html += plainWords(s.en.slice(last, m.index));
        var k = keyOf(m[1]);
        html += '<span class="term ' + statusClass(k) + '" tabindex="0" role="button" data-k="' + esc(k) +
          '" data-w="' + esc(m[1]) + '" data-m="' + esc(m[2]) + '">' + esc(m[1]) + "</span>";
        last = TERM_RE.lastIndex;
      }
      html += plainWords(s.en.slice(last));
      return '<span class="sent" data-s="' + i + '">' + html + "</span>";
    }).join(" ");
  }

  function plainWords(text) {
    return text.split(/([A-Za-z0-9][A-Za-z0-9'’-]*)/).map(function (part, i) {
      return i % 2 ? '<span class="w">' + esc(part) + "</span>" : esc(part);
    }).join("");
  }

  function statusClass(k) {
    var w = state().artWords[k];
    return w ? (w.st === "learned" ? "is-learned" : "is-review") : "";
  }

  function renderReader(a) {
    current = a;
    $("artList").hidden = true;
    $("artReader").hidden = false;
    closePop();

    var words = wordCount(a);
    $("artHead").innerHTML = "<h1>" + esc(a.title) + "</h1>" +
      '<div class="art-meta"><span>' + esc(a.topic) + "</span><span>~" + Math.max(2, Math.round(words / 50)) +
      " dk</span><span>" + a.level + "</span><span>" + words + " kelime</span></div>";
    $("artText").innerHTML = renderArticleText(a);
    $("artInput").value = loadDraft(a.id);
    $("artRefBox").hidden = true;
    $("artRefToggle").textContent = "Örnek çeviriyi göster";
    $("artRefBox").innerHTML = a.sentences.map(function (s) { return "<p>" + esc(s.tr) + "</p>"; }).join("");
    $("artResult").innerHTML = "";
  }

  function route(arg) {
    var a = arg && findArticle(arg);
    if (a) renderReader(a); else renderList();
  }

  // ---------- Açılır kutu (popover) ----------
  var pop, popTarget = null;

  function closePop() {
    if (pop) pop.hidden = true;
    popTarget = null;
    document.querySelectorAll(".sent.is-active").forEach(function (el) { el.classList.remove("is-active"); });
  }

  function placePop(el) {
    pop.hidden = false;
    var r = el.getBoundingClientRect();
    var pw = pop.offsetWidth, ph = pop.offsetHeight;
    var left = r.left + r.width / 2 - pw / 2;
    left = Math.max(8, Math.min(left, document.documentElement.clientWidth - pw - 8));
    var above = r.top - ph - 10 > 70; // yapışkan menünün altında kalmasın
    var top = above ? r.top - ph - 10 : r.bottom + 10;
    pop.style.left = left + window.scrollX + "px";
    pop.style.top = top + window.scrollY + "px";
    pop.style.setProperty("--arrow-x", Math.max(14, Math.min(pw - 14, r.left + r.width / 2 - left)) + "px");
    pop.classList.toggle("below", !above);
  }

  function showTerm(el) {
    var k = el.getAttribute("data-k");
    var w = state().artWords[k];
    pop.innerHTML =
      '<div class="pop-term">' + esc(el.getAttribute("data-w")) + "</div>" +
      '<div class="pop-mean">' + esc(el.getAttribute("data-m")) + "</div>" +
      (w ? '<div class="pop-status">' + (w.st === "learned" ? "✓ Öğrendiklerinde" : "↻ Tekrar listende") + "</div>" : "") +
      '<div class="pop-actions">' +
      '<button class="btn btn-good btn-sm" data-act="learned">Öğrendim</button>' +
      '<button class="btn btn-bad btn-sm" data-act="review">Öğrenmedim</button></div>';
    popTarget = el;
    placePop(el);
  }

  function showSentence(sentEl) {
    var i = parseInt(sentEl.getAttribute("data-s"), 10);
    sentEl.classList.add("is-active");
    pop.innerHTML = '<div class="pop-label">Cümlenin anlamı</div><div class="pop-sent">' + esc(current.sentences[i].tr) + "</div>";
    popTarget = sentEl;
    placePop(sentEl.querySelector(".w.is-clicked") || sentEl);
  }

  function markTerm(st) {
    var el = popTarget;
    var k = el.getAttribute("data-k");
    var sentEl = el.closest(".sent");
    var s = current.sentences[parseInt(sentEl.getAttribute("data-s"), 10)];
    state().artWords[k] = {
      w: el.getAttribute("data-w"),
      m: el.getAttribute("data-m"),
      s: Check.plainEnglish(s.en),
      a: current.id,
      st: st
    };
    // Aynı kelime ana kelime listesinde de varsa onu da güncelle
    var main = app.words.find(function (x) { return x.w.toLowerCase() === k; });
    if (main) app.setKnown(main, st === "learned"); else app.save();

    document.querySelectorAll('.term[data-k="' + CSS.escape(k) + '"]').forEach(function (t) {
      t.classList.remove("is-learned", "is-review");
      t.classList.add(st === "learned" ? "is-learned" : "is-review");
    });
    pop.innerHTML = '<div class="pop-done">' + (st === "learned" ? "✓ Öğrendiklerine eklendi" : "↻ Tekrar listene eklendi") + "</div>";
    placePop(el);
    setTimeout(function () { if (popTarget === el) closePop(); }, 900);
  }

  // ---------- Çeviri kontrolü ----------
  function band(score) { return score >= 85 ? "good" : score >= 50 ? "mid" : "bad"; }

  function summary(score) {
    if (score >= 90) return "Mükemmel! Metnin anlamını neredeyse tamamen doğru aktarmışsın.";
    if (score >= 75) return "Çok iyi. Birkaç ifadeyi gözden geçirirsen çevirin kusursuz olacak.";
    if (score >= 50) return "İyi bir başlangıç, ama bazı cümlelerde önemli kavramlar eksik ya da farklı çevrilmiş.";
    if (score >= 25) return "Çevirinin önemli bir kısmı eksik ya da metinden uzak. Aşağıdaki açıklamalara göz at.";
    return "Çevirin metinle pek örtüşmüyor. Mavi kelimelerin anlamlarına bakıp cümle cümle yeniden dene.";
  }

  function sentenceIssues(r) {
    var out = [];
    if (r.empty) return ["Bu cümle çevrilmemiş ya da çevirinde karşılığı bulunamadı."];
    if (r.missing.length) {
      out.push("Karşılığı bulunamayan ifadeler: " + r.missing.map(function (t) {
        return "<strong>" + esc(t.en) + "</strong> (" + esc(t.meaning) + ")";
      }).join(", ") + ". Eş anlamlı başka bir kelime kullandıysan doğru olabilir; örnek çeviriyle karşılaştır.");
    }
    if (r.untranslated.length) out.push("Çevrilmeden bırakılmış İngilizce kelimeler: <strong>" + r.untranslated.map(esc).join(", ") + "</strong>.");
    if (r.short) out.push("Çevirin bu cümleye göre çok kısa; bazı bölümleri atlamış olabilirsin.");
    if (r.long) out.push("Çevirin bu cümleye göre çok uzun; metinde olmayan anlamlar eklemiş olabilirsin.");
    if (!out.length && r.lowOverlap) out.push("Anahtar kavramlar var, ama ifade örnek çeviriden oldukça farklı. Anlamın tam korunduğunu kontrol et.");
    if (!out.length) out.push("Anlam doğru aktarılmış. 👍");
    return out;
  }

  function runCheck() {
    var text = $("artInput").value;
    if (!text.trim()) {
      $("artResult").innerHTML = '<p class="empty">Önce yukarıdaki alana çevirini yaz.</p>';
      return;
    }
    var res = Check.check(current, text);
    var prev = state().artScores[current.id];
    if (prev === undefined || res.score > prev) { state().artScores[current.id] = res.score; app.save(); }

    var counts = { good: 0, mid: 0, bad: 0 };
    res.sentences.forEach(function (d) { counts[band(d.result.score)]++; });

    $("artResult").innerHTML =
      '<div class="result art-score ' + band(res.score) + '">' +
      '<div class="result-score">' + res.score + "<small>/100</small></div>" +
      "<p>" + summary(res.score) + "</p>" +
      '<p class="muted small">' + res.sentences.length + " cümleden " + counts.good + " tanesi iyi, " + counts.mid +
      " tanesi kısmen doğru, " + counts.bad + " tanesi eksik ya da hatalı." + "</p>" +
      '<p class="muted small">Puan nasıl hesaplanır? Her cümlede anahtar kavramların (mavi kelimeler) çevirinde karşılık bulup bulmadığına (%60) ve örnek çeviriyle içerik benzerliğine (%40) bakılır; atlanan, çok kısa kalan ya da çevrilmeden bırakılan bölümler puan düşürür. Farklı ama doğru bir ifade seçtiysen puanın biraz düşük çıkabilir, bu yüzden örnek çeviriyle karşılaştırmayı unutma.</p>' +
      "</div>" +
      res.sentences.map(function (d, i) {
        var b = band(d.result.score);
        return '<div class="sent-review ' + b + '">' +
          '<div class="sent-review-head"><span>Cümle ' + (i + 1) + '</span><span class="score-pill ' + b + '">' + d.result.score + "</span></div>" +
          '<p class="sr-en">' + esc(d.en) + "</p>" +
          '<p><span class="sr-label">Senin çevirin:</span> ' + (d.user ? esc(d.user) : '<em class="muted">—</em>') + "</p>" +
          '<p><span class="sr-label">Örnek çeviri:</span> ' + esc(d.tr) + "</p>" +
          '<ul class="sr-issues">' + sentenceIssues(d.result).map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>" +
          "</div>";
      }).join("");
    $("artResult").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------- Olaylar ----------
  pop = document.createElement("div");
  pop.className = "art-pop";
  pop.hidden = true;
  document.body.appendChild(pop);

  pop.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (b && popTarget) markTerm(b.getAttribute("data-act"));
    e.stopPropagation();
  });

  $("artText").addEventListener("click", function (e) {
    e.stopPropagation();
    var term = e.target.closest(".term");
    if (term) {
      if (popTarget === term) { closePop(); return; }
      closePop();
      showTerm(term);
      return;
    }
    var sent = e.target.closest(".sent");
    if (sent) {
      if (popTarget === sent) { closePop(); return; }
      closePop();
      document.querySelectorAll(".w.is-clicked").forEach(function (x) { x.classList.remove("is-clicked"); });
      var w = e.target.closest(".w");
      if (w) w.classList.add("is-clicked");
      showSentence(sent);
    }
  });

  $("artText").addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("term")) {
      e.preventDefault();
      e.target.click();
    }
  });

  document.addEventListener("click", function () { if (popTarget) closePop(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePop(); });
  window.addEventListener("resize", closePop);
  window.addEventListener("hashchange", closePop);

  $("artCheck").addEventListener("click", runCheck);
  $("artClear").addEventListener("click", function () {
    $("artInput").value = "";
    saveDraft(current.id, "");
    $("artResult").innerHTML = "";
  });
  $("artRefToggle").addEventListener("click", function () {
    var box = $("artRefBox");
    box.hidden = !box.hidden;
    this.textContent = box.hidden ? "Örnek çeviriyi göster" : "Örnek çeviriyi gizle";
  });
  $("artInput").addEventListener("input", function () { if (current) saveDraft(current.id, this.value); });

  $("artReviewList").addEventListener("click", function (e) {
    var b = e.target.closest("[data-learn]");
    if (!b) return;
    var k = b.getAttribute("data-learn");
    if (state().artWords[k]) {
      state().artWords[k].st = "learned";
      var main = app.words.find(function (x) { return x.w.toLowerCase() === k; });
      if (main) app.setKnown(main, true); else app.save();
    }
    renderReview();
  });
  $("artReviewCards").addEventListener("click", function () { $("cardSet").value = "art-review"; });

  app.registerRoute("articles", route);
});
