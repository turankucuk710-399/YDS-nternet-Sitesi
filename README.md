# YDS Çalışma Sitesi

YDS (Yabancı Dil Sınavı) için hazırlanmış, kurulum gerektirmeyen statik bir çalışma sitesi.

## Özellikler

- **Kelime Listesi** — YDS'de sık çıkan ~170 temel kelime (fiil, isim, sıfat, zarf, öbek fiil, bağlaç); Türkçe anlam ve örnek cümleyle. Arama, tür/seviye filtresi ve "biliyorum" işaretleme.
- **Kelime Kartları** — Çevrilebilir kartlar; bilinmeyen kelimeler destede tekrar karşına çıkar. Klavye: `Boşluk` çevir, `→` biliyorum, `←` bilmiyorum.
- **Kelime Testi** — Kelime listesinden otomatik oluşturulan çoktan seçmeli test (İng→Tr, Tr→İng veya karışık).
- **Soru Bankası** — YDS formatında 11 kategoride 106 özgün soru: kelime, dil bilgisi, bağlaç/edat, paragraf boşluk (cloze), cümle tamamlama, çeviri (iki yön), okuduğunu anlama, diyalog tamamlama, yakın anlamlı cümle ve anlamı bozan cümle. Her sorunun Türkçe açıklaması var; "Yanlış yaptıklarım" ile tekrar çözülebilir. Klavye: `1–5` veya `A–E` ile cevapla.
- **Makale Çeviri** — YDS okuma parçası tarzında 5 özgün makale (sağlık, çevre, dil bilimi, ekoloji, tarih). Mavi anahtar kelimelere tıklayınca Türkçe anlamı ve "Öğrendim / Öğrenmedim" düğmeleri çıkar; "Öğrenmedim" denen kelimeler tekrar listesine ve kartlara eklenir. Diğer kelimelere tıklayınca cümlenin tamamının çevirisi görünür. Makalenin altındaki alana yazılan çeviri cümle cümle örnek çeviriyle karşılaştırılır, hatalar açıklanır ve 100 üzerinden puanlanır.
- **Tekrar** — Sitenin her bölümündeki yanlışlar otomatik olarak burada toplanır. Üstteki "Nereden geldi?" özeti her bölümden (Kelime Testi, Kartlar, Soru Bankası, Makale Çeviri) kaç hata geldiğini gösterir. Üç sekme:
  - *Kelimeler:* Kelime testinde yanlış cevaplanan, kartlarda "Bilmiyorum" denen, Soru Bankası'nın kelime/bağlaç sorularında kaçırılan, makalede "Öğrenmedim" denen ve çeviride karşılığı yazılamayan kelimeler; kaynağa göre filtrelenir, kartlarla veya hızlı testle tekrar edilir.
  - *Yanlış sorular:* Soru Bankası'nda yanlış yapılan sorular; verilen yanlış cevap, kaç kez yanlış yapıldığı, doğru cevap ve açıklama. Sayfa içinde yeniden çözülür, doğru cevaplanan listeden çıkar.
  - *Çeviri cümleleri:* Makale çevirisinde 85 puanın altında kalan cümleler; cümle cümle yeniden çevrilip puanlanır, 85'i geçen listeden çıkar.
- **Kelime ekleme** — Kelimeler sayfasındaki "+ Kelime ekle" ile kendi kelimelerini ekleyebilirsin (tek tek ya da `kelime = anlam` satırlarıyla toplu). Eklenen kelime kelime listesine, kartlara, kelime testine ve Tekrar'a otomatik girer. Örnek cümle girilmezse site makalelerde ve sorularda bu kelimeyi içeren bir cümle arar (makale cümlelerinin çevirisi de gelir); örnek cümle Tekrar → Çeviri cümleleri'ne eklenir.
- **Soru ekleme** — Soru Bankası'ndaki "+ Soru ekle" ile kendi sorularını ekleyebilirsin. Eklenen kelime ve sorular yalnızca o tarayıcıda saklanır, siteye yüklenmez.
- İlerleme tarayıcıda (`localStorage`) saklanır; açık/koyu tema desteği; mobil uyumlu.

## Çalıştırma

`index.html` dosyasını tarayıcıda açman yeterli. GitHub Pages ile yayınlamak için depo ayarlarından **Pages → Deploy from a branch** seçip kök dizini göstermen yeterli.

## İçerik ekleme

- Kelimeler: `js/data/words.js` — `{ w, t, lvl, m, e }`
- Sorular: `js/data/questions.js` ve `js/data/questions-extra.js` (yeni sorular her zaman listenin sonuna eklenmeli; kayıtlı cevaplar sıra numarasıyla tutulur)
- Soru biçimi: `{ cat, q, o: [5 seçenek], a: doğru indeks (0–4), x: açıklama, passage? }`
- Makaleler: `js/data/articles.js` — her cümle `{ en, tr }`; anahtar kelimeler `{{ifade|anlam|kontrol kökleri}}` biçiminde işaretlenir (ayrıntı dosyanın başında). Çeviri puanlaması `js/translate-check.js` içindedir.
