// Kelime eklerken Türkçe anlamları ve örnek cümleyi otomatik bulur.
// Google Çeviri'nin herkese açık uç noktasını tarayıcıdan çağırır (anahtar gerekmez);
// yalnızca aranan kelime ve örnek cümle gönderilir. window.YDSLookup olarak kullanılır.
(function () {
  "use strict";

  var API = "https://translate.googleapis.com/translate_a/single";
  var POS = { verb: "v", noun: "n", adjective: "adj", adverb: "adv", conjunction: "conj", preposition: "conj", phrase: "phr" };

  function call(text, parts) {
    var url = API + "?client=gtx&sl=en&tl=tr&dj=1&" + parts.map(function (p) { return "dt=" + p; }).join("&") +
      "&q=" + encodeURIComponent(text);
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error("Çeviri servisi yanıt vermedi (" + r.status + ").");
      return r.json();
    });
  }

  function plainTranslation(data) {
    return (data.sentences || []).map(function (s) { return s.trans || ""; }).join("").trim();
  }

  // İngilizce cümleyi Türkçeye çevir
  function translate(text) {
    return call(text, ["t"]).then(plainTranslation);
  }

  function sentenceCase(s) {
    s = String(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (!s) return "";
    s = s.charAt(0).toUpperCase() + s.slice(1);
    return /[.!?]$/.test(s) ? s : s + ".";
  }

  // En fazla 3 Türkçe anlam: sözlük girdileri sıklık puanına göre, yoksa doğrudan çeviri
  function pickMeanings(data, max) {
    var all = [];
    (data.dict || []).forEach(function (d) {
      (d.entry || []).forEach(function (e, i) {
        all.push({ w: e.word, s: typeof e.score === "number" ? e.score : 0.0001 / (i + 1), pos: d.pos });
      });
    });
    all.sort(function (a, b) { return b.s - a.s; });
    var out = [], seen = {};
    function add(w) {
      w = String(w || "").trim();
      var k = w.toLocaleLowerCase("tr");
      if (!w || seen[k] || w.split(" ").length > 5) return;
      seen[k] = true;
      out.push(w);
    }
    // Doğrudan çeviri (öbeklerde genelde en doğal karşılık) önce, sonra sözlük, sonra alternatifler
    add(plainTranslation(data));
    all.forEach(function (x) { add(x.w); });
    (data.alternative_translations || []).forEach(function (a) {
      (a.alternative || []).forEach(function (x) { add(x.word_postproc); });
    });
    return out.slice(0, max);
  }

  // Öbekler için Google örnek vermez; Vikisözlük'ten (en.wiktionary.org) örnek cümle dene
  var WIKT = "https://en.wiktionary.org/api/rest_v1/page/definition/";
  // Örnek gerçekten bu öbeği içeriyor mu? (ilk kelime çekimlenebilir: fall → fell, run → ran)
  function mentions(text, phrase) {
    var t = " " + text.toLowerCase().replace(/[^a-z' ]/g, " ") + " ";
    var words = phrase.toLowerCase().split(/\s+/);
    var rest = words.slice(1).filter(function (w) { return w.length >= 2; });
    if (rest.length) return rest.every(function (w) { return t.indexOf(" " + w + " ") !== -1; });
    return t.indexOf(" " + words[0].slice(0, 3)) !== -1;
  }

  function wiktionaryExample(word) {
    return fetch(WIKT + encodeURIComponent(word.replace(/ /g, "_"))).then(function (r) {
      if (!r.ok) return "";
      return r.json().then(function (data) {
        var found = "";
        (data.en || []).some(function (sec) {
          return (sec.definitions || []).some(function (d) {
            var list = (d.parsedExamples || []).map(function (x) { return x.example; }).concat(d.examples || []);
            return list.some(function (html) {
              var t = sentenceCase(String(html || "").replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, " "));
              if (t.length >= 20 && t.length <= 220 && mentions(t, word)) { found = t; return true; }
              return false;
            });
          });
        });
        return found;
      });
    }).catch(function () { return ""; });
  }

  // corpusExamples: sitedeki cümleler [{en, tr}] — çevirisi olan varsa o kullanılır
  function lookup(word, corpusExamples) {
    word = String(word).trim();
    return call(word, ["t", "bd", "md", "ex", "at", "qca"]).then(function (data) {
      var ld = data.ld_result && data.ld_result.srclangs;
      if (ld && ld[0] === "tr") throw new Error('"' + word + '" Türkçe görünüyor; İngilizce kelimeyi yaz.');
      // Yazım hatası varsa Google düzeltip onun anlamını verir; düzeltilmiş hâli bildir
      var corrected = data.spell && data.spell.spell_res && data.spell.spell_res.toLowerCase() !== word.toLowerCase()
        ? data.spell.spell_res : "";
      var lw = word.toLocaleLowerCase("tr");
      var meanings = pickMeanings(data, 3).filter(function (m) { return m.toLocaleLowerCase("tr") !== lw; });
      if (!meanings.length) throw new Error('"' + word + '" için anlam bulunamadı; yazımını kontrol et.');
      if (corrected) word = corrected;
      var top = (data.dict || [])[0];
      var type = top ? (POS[top.pos] || "x") : (word.indexOf(" ") > 0 ? "phr" : "x");

      var withTr = (corpusExamples || []).filter(function (x) { return x.tr; })[0];
      if (withTr) return { word: word, corrected: !!corrected, meanings: meanings, type: type, example: { en: withTr.en, tr: withTr.tr, src: "site" } };

      // Örnek adayları: tam cümle gibi duranlar (7–25 kelime) öne, en kısa parçalar sona
      var cands = ((data.examples && data.examples.example) || []).map(function (x) { return sentenceCase(x.text); });
      (data.definitions || []).forEach(function (d) {
        (d.entry || []).forEach(function (e) { if (e.example) cands.push(sentenceCase(e.example)); });
      });
      function fit(t) {
        var n = t.split(" ").length;
        return n >= 7 && n <= 25 ? 100 - Math.abs(n - 14) : n;
      }
      cands = cands.filter(Boolean).sort(function (a, b) { return fit(b) - fit(a); });
      var en = cands[0] || "";
      if (!en && corpusExamples && corpusExamples[0]) en = corpusExamples[0].en;
      var getEn = en ? Promise.resolve(en) : wiktionaryExample(word);
      return getEn.then(function (en) {
        if (!en) return { word: word, corrected: !!corrected, meanings: meanings, type: type, example: null };
        return withTranslation(en);
      });

      function withTranslation(en) {
        return translate(en).then(function (tr) {
          return { word: word, corrected: !!corrected, meanings: meanings, type: type, example: { en: en, tr: tr, src: "otomatik" } };
        }, function () {
          return { word: word, corrected: !!corrected, meanings: meanings, type: type, example: { en: en, tr: "", src: "otomatik" } };
        });
      }
    });
  }

  window.YDSLookup = { lookup: lookup, translate: translate, _pickMeanings: pickMeanings };
})();
