# YDS Çalışma Sitesi

YDS (Yabancı Dil Sınavı) için hazırlanmış, kurulum gerektirmeyen statik bir çalışma sitesi.

## Özellikler

- **Kelime Listesi** — YDS'de sık çıkan ~170 temel kelime (fiil, isim, sıfat, zarf, öbek fiil, bağlaç); Türkçe anlam ve örnek cümleyle. Arama, tür/seviye filtresi ve "biliyorum" işaretleme.
- **Kelime Kartları** — Çevrilebilir kartlar; bilinmeyen kelimeler destede tekrar karşına çıkar. Klavye: `Boşluk` çevir, `→` biliyorum, `←` bilmiyorum.
- **Kelime Testi** — Kelime listesinden otomatik oluşturulan çoktan seçmeli test (İng→Tr, Tr→İng veya karışık).
- **Soru Bankası** — YDS formatında 42 soru: kelime, dil bilgisi, bağlaç/edat, cümle tamamlama, çeviri (iki yön), okuduğunu anlama ve anlamı bozan cümle. Her sorunun Türkçe açıklaması var; "Yanlış yaptıklarım" ile tekrar çözülebilir. Klavye: `1–5` veya `A–E` ile cevapla.
- **Makale Çeviri** — YDS okuma parçası tarzında 5 özgün makale (sağlık, çevre, dil bilimi, ekoloji, tarih). Mavi anahtar kelimelere tıklayınca Türkçe anlamı ve "Öğrendim / Öğrenmedim" düğmeleri çıkar; "Öğrenmedim" denen kelimeler tekrar listesine ve kartlara eklenir. Diğer kelimelere tıklayınca cümlenin tamamının çevirisi görünür. Makalenin altındaki alana yazılan çeviri cümle cümle örnek çeviriyle karşılaştırılır, hatalar açıklanır ve 100 üzerinden puanlanır.
- İlerleme tarayıcıda (`localStorage`) saklanır; açık/koyu tema desteği; mobil uyumlu.

## Çalıştırma

`index.html` dosyasını tarayıcıda açman yeterli. GitHub Pages ile yayınlamak için depo ayarlarından **Pages → Deploy from a branch** seçip kök dizini göstermen yeterli.

## İçerik ekleme

- Kelimeler: `js/data/words.js` — `{ w, t, lvl, m, e }`
- Sorular: `js/data/questions.js` — `{ cat, q, o: [5 seçenek], a: doğru indeks (0–4), x: açıklama, passage? }`
- Makaleler: `js/data/articles.js` — her cümle `{ en, tr }`; anahtar kelimeler `{{ifade|anlam|kontrol kökleri}}` biçiminde işaretlenir (ayrıntı dosyanın başında). Çeviri puanlaması `js/translate-check.js` içindedir.
