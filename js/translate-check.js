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
      .split(/(?<=[.!?…;])\s+|\n+/)
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

    var NEG = -1e9;
    var dp = [], back = [];
    for (var i = 0; i <= n; i++) {
      dp.push(new Array(m + 1).fill(NEG));
      back.push(new Array(m + 1).fill(null));
    }
    dp[0][0] = 0;
    for (var j0 = 1; j0 <= m; j0++) { dp[0][j0] = 0; back[0][j0] = { skip: true }; }

    for (i = 1; i <= n; i++) {
      for (var j = 0; j <= m; j++) {
        // Fazladan kullanıcı cümlesini atla
        if (j > 0 && dp[i][j - 1] > dp[i][j]) { dp[i][j] = dp[i][j - 1]; back[i][j] = { skip: true }; }
        for (var k = Math.max(0, j - 3); k <= j; k++) {
          if (dp[i - 1][k] === NEG) continue;
          var starts = [k];
          if (k > 0 && j === k) starts.push(k - 1); // paylaşılan cümle
          if (k > 0 && j > k) starts.push(k - 1);
          for (var si = 0; si < starts.length; si++) {
            var s = starts[si];
            if (j - s > 3) continue;
            var r = evalGroup(i - 1, s, j);
            var val = dp[i - 1][k] + r.score * weights[i - 1];
            if (val > dp[i][j]) { dp[i][j] = val; back[i][j] = { k: k, s: s }; }
          }
        }
      }
    }

    // Geri izleme
    var details = new Array(n);
    i = n; j = m;
    while (i > 0) {
      var b = back[i][j];
      if (!b) break;
      if (b.skip) { j--; continue; }
      details[i - 1] = {
        en: refs[i - 1].en,
        tr: refs[i - 1].tr,
        user: user.slice(b.s, j).join(" "),
        result: evalGroup(i - 1, b.s, j)
      };
      j = b.k; i--;
    }

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
