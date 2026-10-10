// Çeviri kontrol motoru: kullanıcının Türkçe çevirisini örnek çeviriyle karşılaştırır,
// cümle cümle hizalar, eksik kavramları bulur ve 100 üzerinden puan verir.
// Tarayıcıda window.YDSTranslateCheck, Node'da module.exports olarak kullanılır.
(function (root) {
  "use strict";

  var TERM_RE = /\{\{([^|}]+)\|([^|}]+)(?:\|([^}]*))?\}\}/g;

  // Anlam taşımayan sık kelimeler (benzerlik hesabına katılmaz)
  var STOP = ("ve veya ya da de ki bir bu şu o bunu buna bunun bunlar bunları onlar onları onların için ile gibi " +
    "daha çok en her hem ise ne mi mı mu mü olarak olan olup olduğu olduğunu olması olmak olur oldu " +
    "kadar sonra önce ama fakat ancak yine bile hiç tüm bütün çünkü diye göre karşı dair üzere şey").split(" ");
  var STOP_SET = {};
  STOP.forEach(function (w) { STOP_SET[w] = true; });

  function normalize(s) {
    return String(s)
      .toLocaleLowerCase("tr")
      .replace(/[âà]/g, "a").replace(/[îì]/g, "i").replace(/[ûù]/g, "u")
      .replace(/[’'`´]/g, " ")
      .replace(/[^a-zçğıöşü0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokens(s) {
    var n = normalize(s);
    return n ? n.split(" ") : [];
  }

  // Türkçe kökü kabaca çıkar: mastar ekini at, sondaki yumuşayabilen ünsüzü at.
  function rootOf(word) {
    var w = normalize(word);
    if (w.length > 5 && /m[ae]k$/.test(w)) w = w.slice(0, -3);
    if (w.length > 4 && /[çkpt]$/.test(w)) w = w.slice(0, -1);
    return w.slice(0, 8);
  }

  // Bir terimin kontrol alternatiflerini döndürür: [[kök, kök], [kök], ...]
  function termAlternatives(meaning, stems) {
    var src = stems && stems.trim() ? stems.split("/") : meaning.split(",");
    return src.map(function (alt) {
      return normalize(alt).split(" ").filter(Boolean).map(function (w) {
        return stems && stems.trim() ? w : rootOf(w);
      });
    }).filter(function (a) { return a.length; });
  }

  // Cümledeki işaretli terimleri ayıklar.
  function parseTerms(en) {
    var list = [], m;
    TERM_RE.lastIndex = 0;
    while ((m = TERM_RE.exec(en))) {
      list.push({ en: m[1], meaning: m[2], alts: termAlternatives(m[2], m[3]) });
    }
    return list;
  }

  function plainEnglish(en) {
    return en.replace(TERM_RE, "$1");
  }

  function hasStem(tokList, stem) {
    // "destekle" → "destekliyor" gibi ünlü daralmasını da kabul et
    var short = stem.length >= 5 && /[ae]$/.test(stem) ? stem.slice(0, -1) : null;
    for (var i = 0; i < tokList.length; i++) {
      if (tokList[i].indexOf(stem) === 0) return true;
      if (short && tokList[i].indexOf(short) === 0 && /^[ıiuü]/.test(tokList[i].slice(short.length))) return true;
    }
    return false;
  }

  function termFound(term, tokList) {
    return term.alts.some(function (alt) {
      return alt.every(function (stem) { return hasStem(tokList, stem); });
    });
  }

  function keyOf(tok) { return tok.slice(0, 5); }

  function contentKeys(text) {
    return tokens(text).filter(function (t) { return t.length > 1 && !STOP_SET[t]; }).map(keyOf);
  }

  function splitSentences(text) {
    return String(text)
      .replace(/([.!?…;])\s+/g, "$1\n") // eski Safari sürümleri lookbehind desteklemiyor
      .split(/\n+/)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return normalize(s).length > 0; });
  }

  // Tek bir örnek cümleyi, kullanıcının ona eşlenen metniyle karşılaştırır.
  function scoreSentence(ref, userText, englishWords) {
    var userToks = tokens(userText);
    var res = { score: 0, missing: [], found: [], untranslated: [], short: false, long: false, empty: false, lowOverlap: false };
    if (!userToks.length) { res.empty = true; return res; }

    ref.terms.forEach(function (t) {
      (termFound(t, userToks) ? res.found : res.missing).push(t);
    });
    var coverage = ref.terms.length ? res.found.length / ref.terms.length : null;

    var refKeys = ref.keys;
    var userKeySet = {};
    userToks.forEach(function (t) { userKeySet[keyOf(t)] = true; });
    var hit = refKeys.filter(function (k) { return userKeySet[k]; }).length;
    var overlap = refKeys.length ? Math.min(1, (hit / refKeys.length) / 0.6) : 1;
    res.lowOverlap = overlap < 0.45;

    var base = coverage === null ? overlap : 0.6 * coverage + 0.4 * overlap;

    var ratio = normalize(userText).length / Math.max(1, normalize(ref.tr).length);
    if (ratio < 0.5) { res.short = true; base *= ratio / 0.5; }
    if (ratio > 2.2) { res.long = true; base *= 0.9; }

    var refTokSet = {};
    ref.trTokens.forEach(function (t) { refTokSet[t] = true; });
    userToks.forEach(function (t) {
      if (englishWords[t] && !refTokSet[t] && res.untranslated.indexOf(t) === -1) res.untranslated.push(t);
    });
    base *= Math.max(0.6, 1 - 0.07 * res.untranslated.length);

    res.score = Math.round(Math.max(0, Math.min(1, base)) * 100);
    return res;
  }

  // Makaleyi kontrol için hazırlar (bir kez yapılır).
  function prepare(article) {
    var englishWords = {};
    var refs = article.sentences.map(function (s) {
      var plain = plainEnglish(s.en);
      tokens(plain).forEach(function (t) { if (t.length >= 4) englishWords[t] = true; });
      return {
        en: plain,
        tr: s.tr,
        terms: parseTerms(s.en),
        keys: contentKeys(s.tr),
        trTokens: tokens(s.tr)
      };
    });
    return { refs: refs, englishWords: englishWords };
  }

  // Kullanıcı cümlelerini örnek cümlelere sıralı biçimde hizalar.
  // Her örnek cümle 0-3 ardışık kullanıcı cümlesi alır; iki komşu örnek cümle
  // bir kullanıcı cümlesini paylaşabilir (iki cümleyi tek cümlede çevirme durumu).
  function check(article, userText) {
    var prep = article._prep || (article._prep = prepare(article));
    var refs = prep.refs;
    var user = splitSentences(userText);
    var n = refs.length, m = user.length;
    var weights = refs.map(function (r) { return Math.max(3, r.keys.length); });
    var cache = {};

    function evalGroup(i, s, j) {
      var k = i + ":" + s + ":" + j;
      if (!cache[k]) cache[k] = scoreSentence(refs[i], user.slice(s, j).join(" "), prep.englishWords);
      return cache[k];
    }

    // dp[f][i][j]: ilk i örnek cümle, ilk j kullanıcı cümlesiyle eşlendiğinde en iyi toplam.
    // f = 1 ise i. örnek cümlenin grubu, bir önceki cümlenin son kullanıcı cümlesini paylaşıyor
    // (kullanıcı iki cümleyi tek cümlede çevirmiş). Paylaşılan grup ancak gerçekten eşleşiyorsa
    // (puan >= SHARE_MIN) puan kazandırır; böylece bir cümle çevrilmemiş komşulara yayılmaz.
    var NEG = -1e9, SHARE_MIN = 40;
    var dp = [[], []], back = [[], []];
    for (var f = 0; f < 2; f++) {
      for (var i = 0; i <= n; i++) {
        dp[f].push(new Array(m + 1).fill(NEG));
        back[f].push(new Array(m + 1).fill(null));
      }
    }
    dp[0][0][0] = 0;
    for (var j0 = 1; j0 <= m; j0++) { dp[0][0][j0] = 0; back[0][0][j0] = { skip: true, pf: 0 }; }

    function relax(f, i, j, val, b) {
      if (val > dp[f][i][j]) { dp[f][i][j] = val; back[f][i][j] = b; }
    }

    for (i = 1; i <= n; i++) {
      for (var j = 0; j <= m; j++) {
        // Fazladan kullanıcı cümlesini atla
        if (j > 0) {
          relax(0, i, j, dp[0][i][j - 1], { skip: true, pf: 0 });
          relax(0, i, j, dp[1][i][j - 1], { skip: true, pf: 1 });
        }
        for (var k = Math.max(0, j - 3); k <= j; k++) {
          for (var pf = 0; pf < 2; pf++) {
            if (dp[pf][i - 1][k] === NEG) continue;
            // Paylaşımsız grup [k, j)
            var r = evalGroup(i - 1, k, j);
            relax(0, i, j, dp[pf][i - 1][k] + r.score * weights[i - 1] - 0.5 * (j - k), { k: k, s: k, pf: pf });
            // Önceki cümlenin son kullanıcı cümlesini paylaşan grup [k-1, j)
            if (k > 0 && j - k + 1 <= 3) {
              var r2 = evalGroup(i - 1, k - 1, j);
              var eff = r2.score >= SHARE_MIN ? r2.score : 0;
              // Gruba alınan her kullanıcı cümlesi için küçük bir bedel: eşitlikte daha dar grubu seç
              relax(1, i, j, dp[pf][i - 1][k] + eff * weights[i - 1] - 0.5 * (j - k + 1), { k: k, s: k - 1, pf: pf });
            }
          }
        }
      }
    }

    // Geri izleme
    var details = new Array(n);
    j = m; i = n;
    var cf = dp[1][n][m] > dp[0][n][m] ? 1 : 0;
    while (i > 0) {
      var b = back[cf][i][j];
      if (!b) break;
      if (b.skip) { j--; cf = b.pf; continue; }
      details[i - 1] = {
        en: refs[i - 1].en,
        tr: refs[i - 1].tr,
        user: user.slice(b.s, j).join(" "),
        result: evalGroup(i - 1, b.s, j),
        range: [b.s, j]
      };
      j = b.k; cf = b.pf; i--;
    }

    // Bir önceki cümlenin zaten aldığı metni yeniden kullanan ve düşük puan alan cümle
    // aslında çevrilmemiştir (tek bir kullanıcı cümlesi birden çok örnek cümleye yayılmasın).
    var prevRange = null;
    details.forEach(function (d, idx) {
      if (!d) { prevRange = null; return; }
      var r = d.range;
      var reused = prevRange && r[0] >= prevRange[0] && r[1] <= prevRange[1];
      prevRange = reused ? prevRange : r;
      if (reused && d.result.score < SHARE_MIN) details[idx] = null;
      if (details[idx]) delete details[idx].range;
    });

    var totalW = 0, sum = 0;
    details.forEach(function (d, idx) {
      if (!d) {
        details[idx] = d = { en: refs[idx].en, tr: refs[idx].tr, user: "", result: scoreSentence(refs[idx], "", prep.englishWords) };
      }
      totalW += weights[idx];
      sum += d.result.score * weights[idx];
    });

    return {
      score: totalW ? Math.round(sum / totalW) : 0,
      sentences: details,
      userSentenceCount: m
    };
  }

  var api = {
    check: check,
    parseTerms: parseTerms,
    plainEnglish: plainEnglish,
    termFound: termFound,
    tokens: tokens,
    TERM_RE: TERM_RE
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.YDSTranslateCheck = api;
})(this);
