// Fotoğraftan / taranmış PDF'ten metin okuma (OCR). Her şey tarayıcıda çalışır:
// görüntüler hiçbir sunucuya gönderilmez; yalnızca OCR ve PDF kütüphaneleri ilk kullanımda CDN'den indirilir.
// window.YDSOcr olarak kullanılır.
(function () {
  "use strict";

  var TESSERACT = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
  var TESS_OPTS = {
    workerPath: "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js",
    corePath: "https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.1",
    langPath: "https://cdn.jsdelivr.net/npm/@tesseract.js-data/eng@1.0.0/4.0.0_best_int"
  };
  var PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  var PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  var scripts = {};
  function loadScript(src) {
    if (!scripts[src]) {
      scripts[src] = new Promise(function (resolve, reject) {
        var s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        s.onerror = function () { delete scripts[src]; reject(new Error("Kütüphane indirilemedi (internet bağlantını kontrol et).")); };
        document.head.appendChild(s);
      });
    }
    return scripts[src];
  }

  var workerPromise = null;
  var progressCb = null;
  function getWorker() {
    if (!workerPromise) {
      workerPromise = loadScript(TESSERACT).then(function () {
        var opts = Object.assign({ logger: function (m) { if (progressCb) progressCb(m); } }, TESS_OPTS);
        return window.Tesseract.createWorker("eng", 1, opts);
      });
      workerPromise.catch(function () { workerPromise = null; });
    }
    return workerPromise;
  }

  // ---------- Dosyaları sayfa görüntülerine çevir ----------
  function imageToCanvas(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        c.getContext("2d").drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve(c);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error(file.name + " açılamadı.")); };
      img.src = url;
    });
  }

  // "1-3, 7" → [1,2,3,7]; boşsa tüm sayfalar
  function parseRange(text, max) {
    var out = [];
    String(text || "").split(",").forEach(function (part) {
      var m = /^\s*(\d+)\s*(?:-\s*(\d+))?\s*$/.exec(part);
      if (!m) return;
      var a = +m[1], b = m[2] ? +m[2] : a;
      for (var i = Math.max(1, a); i <= Math.min(max, b); i++) if (out.indexOf(i) === -1) out.push(i);
    });
    if (!out.length) for (var j = 1; j <= max; j++) out.push(j);
    return out;
  }

  // Bir dosyadan sayfa listesi: [{name, canvas}] (PDF'te sayfalar istenen aralıktan)
  function fileToPages(file, range) {
    var isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
    if (!isPdf) return imageToCanvas(file).then(function (c) { return [{ name: file.name, canvas: c }]; });
    return loadScript(PDFJS).then(function () {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
      return file.arrayBuffer();
    }).then(function (buf) {
      return window.pdfjsLib.getDocument({ data: buf }).promise;
    }).then(function (pdf) {
      var pages = parseRange(range, pdf.numPages);
      var out = [];
      return pages.reduce(function (p, n) {
        return p.then(function () { return pdf.getPage(n); }).then(function (page) {
          var vp = page.getViewport({ scale: 1 });
          var scale = Math.min(3, 2200 / Math.max(vp.width, vp.height));
          var view = page.getViewport({ scale: scale });
          var c = document.createElement("canvas");
          c.width = Math.round(view.width);
          c.height = Math.round(view.height);
          return page.render({ canvasContext: c.getContext("2d"), viewport: view }).promise.then(function () {
            out.push({ name: file.name + " · s." + n, canvas: trimWhite(c) });
          });
        });
      }, Promise.resolve()).then(function () { return out; });
    });
  }

  // ---------- Görüntü işlemleri ----------
  // PDF sayfasındaki boş beyaz kenarları kırp (taranmış fotoğraf çoğu zaman sayfanın bir bandındadır)
  function trimWhite(src) {
    var w = src.width, h = src.height;
    var d = src.getContext("2d").getImageData(0, 0, w, h).data;
    function blankRow(y) {
      for (var x = 0; x < w; x += 3) { var i = (y * w + x) * 4; if (d[i] < 245 || d[i + 1] < 245 || d[i + 2] < 245) return false; }
      return true;
    }
    function blankCol(x, y0, y1) {
      for (var y = y0; y < y1; y += 3) { var i = (y * w + x) * 4; if (d[i] < 245 || d[i + 1] < 245 || d[i + 2] < 245) return false; }
      return true;
    }
    var top = 0, bottom = h - 1, left = 0, right = w - 1;
    while (top < bottom && blankRow(top)) top++;
    while (bottom > top && blankRow(bottom)) bottom--;
    while (left < right && blankCol(left, top, bottom)) left++;
    while (right > left && blankCol(right, top, bottom)) right--;
    var cw = right - left + 1, ch = bottom - top + 1;
    if (cw < 50 || ch < 50 || (cw > w * 0.95 && ch > h * 0.95)) return src;
    var c = document.createElement("canvas");
    c.width = cw;
    c.height = ch;
    c.getContext("2d").drawImage(src, left, top, cw, ch, 0, 0, cw, ch);
    return c;
  }

  function rotate(src, deg) {
    deg = ((deg % 360) + 360) % 360;
    if (!deg) return src;
    var c = document.createElement("canvas");
    var side = deg % 180 !== 0;
    c.width = side ? src.height : src.width;
    c.height = side ? src.width : src.height;
    var ctx = c.getContext("2d");
    ctx.translate(c.width / 2, c.height / 2);
    ctx.rotate(deg * Math.PI / 180);
    ctx.drawImage(src, -src.width / 2, -src.height / 2);
    return c;
  }

  function scaled(src, maxSide, minSide) {
    var big = Math.max(src.width, src.height);
    var f = 1;
    if (maxSide && big > maxSide) f = maxSide / big;
    if (minSide && big < minSide) f = Math.min(2.5, minSide / big);
    if (f === 1) return src;
    var c = document.createElement("canvas");
    c.width = Math.round(src.width * f);
    c.height = Math.round(src.height * f);
    var ctx = c.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(src, 0, 0, c.width, c.height);
    return c;
  }

  // Gri tonlamaya çevir (renkli kâğıt ve gölge OCR'ı daha az şaşırtsın)
  function grayscale(src) {
    var c = document.createElement("canvas");
    c.width = src.width;
    c.height = src.height;
    var ctx = c.getContext("2d");
    ctx.drawImage(src, 0, 0);
    var img = ctx.getImageData(0, 0, c.width, c.height), d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      var g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      d[i] = d[i + 1] = d[i + 2] = g;
    }
    ctx.putImageData(img, 0, 0);
    return c;
  }

  function crop(src, x, w) {
    var c = document.createElement("canvas");
    c.width = w;
    c.height = src.height;
    c.getContext("2d").drawImage(src, x, 0, w, src.height, 0, 0, w, src.height);
    return c;
  }

  // İki sütun arasındaki boşluğu bul: orta bölgede en az koyu piksel içeren dikey şerit
  function findGutter(src) {
    var w = src.width, h = src.height;
    var data = src.getContext("2d").getImageData(0, Math.round(h * 0.1), w, Math.round(h * 0.8)).data;
    var rows = Math.round(h * 0.8);
    var dark = new Array(w).fill(0);
    for (var y = 0; y < rows; y += 2) {
      for (var x = 0; x < w; x++) {
        if (data[(y * w + x) * 4] < 110) dark[x]++;
      }
    }
    var best = Math.round(w / 2), bestVal = Infinity, win = Math.max(3, Math.round(w / 150));
    for (x = Math.round(w * 0.35); x < w * 0.65; x++) {
      var s = 0;
      for (var k = -win; k <= win; k++) s += dark[x + k] || 0;
      if (s < bestVal) { bestVal = s; best = x; }
    }
    return best;
  }

  // ---------- OCR ----------
  function textScore(data) {
    return (data.words || []).filter(function (w) {
      return /^[A-Za-z]{3,}[.,;:]?$/.test(w.text) && w.confidence > 70;
    }).length;
  }

  // Sayfanın yönünü tahmin et: küçültülmüş görüntüyü 4 yönde okuyup en çok anlamlı kelime çıkanı seç
  function detectRotation(canvas, onProgress) {
    var small = grayscale(scaled(canvas, 900));
    var best = { deg: 0, score: -1 };
    return getWorker().then(function (worker) {
      return [0, 90, 270, 180].reduce(function (p, deg) {
        return p.then(function () {
          if (best.score >= 40) return; // açıkça okunuyor; diğer yönleri deneme
          if (onProgress) onProgress(deg);
          return worker.recognize(rotate(small, deg)).then(function (r) {
            var s = textScore(r.data);
            if (s > best.score) best = { deg: deg, score: s };
          });
        });
      }, Promise.resolve());
    }).then(function () { return best.deg; });
  }

  // Sayfayı oku. columns = 1 ya da 2 (iki sütunlu sayfada sütunlar ayrı ayrı okunur)
  function recognizePage(canvas, columns, onProgress) {
    var img = grayscale(scaled(canvas, 3200, 1800));
    var parts = [img];
    if (columns === 2) {
      var g = findGutter(img);
      parts = [crop(img, 0, g), crop(img, g, img.width - g)];
    }
    var texts = [];
    return getWorker().then(function (worker) {
      return parts.reduce(function (p, part, i) {
        return p.then(function () {
          progressCb = function (m) {
            if (m.status === "recognizing text" && onProgress) onProgress((i + m.progress) / parts.length);
          };
          return worker.recognize(part).then(function (r) { texts.push(cleanText(r.data.text)); });
        });
      }, Promise.resolve());
    }).then(function () {
      progressCb = null;
      return texts.join("\n");
    });
  }

  // OCR'ın sık yaptığı hataları düzelt
  function cleanText(t) {
    return String(t)
      .replace(/[“”„]/g, "\"").replace(/[‘’]/g, "'")
      .replace(/\s*—+[.…]*/g, " ----").replace(/–/g, "-")
      .replace(/-{3,}|_{3,}|\.{4,}|…{2,}/g, "----")
      .replace(/^[ \t]*[|!\]\[]+[ \t]*/gm, "")
      .replace(/[ \t]+$/gm, "");
  }

  function warmUp() {
    return getWorker().then(function () { return true; });
  }

  window.YDSOcr = {
    fileToPages: fileToPages,
    rotate: rotate,
    scaled: scaled,
    detectRotation: detectRotation,
    recognizePage: recognizePage,
    warmUp: warmUp,
    parseRange: parseRange,
    _opts: TESS_OPTS
  };
})();
