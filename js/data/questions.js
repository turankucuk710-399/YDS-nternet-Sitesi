// YDS formatında örnek sorular.
// cat: kategori anahtarı, a: doğru seçeneğin indeksi (0 = A ... 4 = E)
// passage: (isteğe bağlı) soruya ait okuma metni
window.YDS_CATEGORIES = {
  kelime: "Kelime Bilgisi",
  dilbilgisi: "Dil Bilgisi",
  baglac: "Bağlaç / Edat",
  tamamlama: "Cümle Tamamlama",
  ceviriEnTr: "Çeviri (İng → Tr)",
  ceviriTrEn: "Çeviri (Tr → İng)",
  okuma: "Okuduğunu Anlama",
  bozan: "Anlamı Bozan Cümle"
};

window.YDS_QUESTIONS = [
  // ===== Kelime Bilgisi =====
  {
    cat: "kelime",
    q: "Despite years of research, scientists have not been able to ---- the exact cause of the disease.",
    o: ["determine", "abandon", "conceal", "deprive", "persist"],
    a: 0,
    x: "\"determine the cause\" = nedenini belirlemek. Diğer seçenekler (terk etmek, gizlemek, yoksun bırakmak, sürmek) anlama uymaz."
  },
  {
    cat: "kelime",
    q: "Plastic waste ---- a serious threat to marine ecosystems, as many animals mistake it for food.",
    o: ["yields", "poses", "conveys", "attains", "derives"],
    a: 1,
    x: "\"pose a threat\" kalıbı = tehdit oluşturmak. YDS'de çok sık çıkan bir eşdizimdir."
  },
  {
    cat: "kelime",
    q: "Elderly people and young children are particularly ---- to infections because their immune systems are weaker.",
    o: ["reluctant", "eligible", "susceptible", "obsolete", "abundant"],
    a: 2,
    x: "\"susceptible to\" = -e yatkın / hassas. Bağışıklık sistemi zayıf olanlar enfeksiyonlara daha yatkındır."
  },
  {
    cat: "kelime",
    q: "The new policy aims to ---- the negative effects of climate change on agriculture.",
    o: ["mitigate", "accelerate", "exploit", "precede", "conceal"],
    a: 0,
    x: "\"mitigate\" = hafifletmek, azaltmak. Olumsuz etkileri azaltmak amaçlanıyor."
  },
  {
    cat: "kelime",
    q: "Although the theory sounds ----, there is still no solid evidence to support it.",
    o: ["obsolete", "plausible", "detrimental", "marginal", "vulnerable"],
    a: 1,
    x: "\"Although\" zıtlık kurar: kuram akla yatkın (plausible) görünse de kanıt yok."
  },
  {
    cat: "kelime",
    q: "Many experts believe that the current rate of economic growth cannot be ---- for much longer.",
    o: ["sustained", "prohibited", "concealed", "deprived", "induced"],
    a: 0,
    x: "\"sustain\" = sürdürmek. Mevcut büyüme hızı daha uzun süre sürdürülemez."
  },
  {
    cat: "kelime",
    q: "Scientists ---- the sudden decline in bee populations to the widespread use of pesticides.",
    o: ["impose", "attribute", "interfere", "comprise", "undergo"],
    a: 1,
    x: "\"attribute X to Y\" = X'i Y'ye bağlamak/atfetmek. Arı nüfusundaki düşüş pestisitlere bağlanıyor."
  },
  {
    cat: "kelime",
    q: "The government decided to ---- coal-fired power plants over the next decade and replace them with renewable sources.",
    o: ["come up with", "phase out", "look into", "account for", "cope with"],
    a: 1,
    x: "\"phase out\" = aşamalı olarak kaldırmak. Kömür santralleri on yıl içinde kademeli olarak kapatılacak."
  },
  {
    cat: "kelime",
    q: "Many of the social problems in the region ---- poverty and a lack of access to education.",
    o: ["stem from", "give up", "turn down", "set up", "put off"],
    a: 0,
    x: "\"stem from\" = -den kaynaklanmak. Sorunlar yoksulluktan kaynaklanıyor."
  },

  // ===== Dil Bilgisi =====
  {
    cat: "dilbilgisi",
    q: "By the time the rescue team arrived, the fire ---- most of the building.",
    o: ["destroys", "has destroyed", "had destroyed", "will destroy", "is destroying"],
    a: 2,
    x: "\"By the time + Past Simple\" → ana cümlede Past Perfect (had destroyed): kurtarma ekibi gelmeden önce yangın binayı yok etmişti."
  },
  {
    cat: "dilbilgisi",
    q: "If the government ---- earlier, the economic crisis could have been prevented.",
    o: ["acts", "acted", "had acted", "would act", "has acted"],
    a: 2,
    x: "Type 3 koşul cümlesi: If + Past Perfect, ... could/would have + V3."
  },
  {
    cat: "dilbilgisi",
    q: "Since the beginning of the century, global temperatures ---- by about one degree Celsius.",
    o: ["rose", "have risen", "had risen", "are rising", "will have risen"],
    a: 1,
    x: "\"Since + başlangıç noktası\" → Present Perfect (have risen): geçmişte başlayıp şimdiye uzanan durum."
  },
  {
    cat: "dilbilgisi",
    q: "The ancient city, ---- was discovered in 1870, attracts thousands of tourists every year.",
    o: ["that", "where", "which", "whose", "what"],
    a: 2,
    x: "Virgüllü (non-defining) sıfat cümlelerinde \"that\" kullanılamaz; nesne için \"which\" gelir."
  },
  {
    cat: "dilbilgisi",
    q: "Not only ---- the exam, but she also got the highest score in the class.",
    o: ["she passed", "did she pass", "she did pass", "passed she", "has passed she"],
    a: 1,
    x: "\"Not only\" cümle başında olumsuz zarf olarak devrik yapı (inversion) gerektirir: Not only did she pass..."
  },
  {
    cat: "dilbilgisi",
    q: "The results of the experiment are expected ---- next month.",
    o: ["to publish", "publishing", "to be published", "being published", "to have published"],
    a: 2,
    x: "Sonuçlar kendileri yayımlamaz, yayımlanır → edilgen mastar: to be published."
  },
  {
    cat: "dilbilgisi",
    q: "You ---- have seen him at the party; he was in London that night.",
    o: ["must", "can't", "should", "might", "would"],
    a: 1,
    x: "Geçmişe yönelik kesin olumsuz çıkarım: can't have + V3 (görmüş olamazsın)."
  },
  {
    cat: "dilbilgisi",
    q: "Hardly ---- the station when the train left.",
    o: ["we had reached", "had we reached", "we reached", "did we reach", "have we reached"],
    a: 1,
    x: "\"Hardly ... when\" kalıbında Hardly cümle başındaysa devrik Past Perfect gelir: Hardly had we reached..."
  },

  // ===== Bağlaç / Edat =====
  {
    cat: "baglac",
    q: "---- the heavy rain, thousands of people attended the outdoor concert.",
    o: ["Although", "Despite", "Because", "Unless", "Whereas"],
    a: 1,
    x: "Boşluktan sonra isim öbeği (the heavy rain) var → \"Despite\" (+ isim). \"Although\" cümle alır."
  },
  {
    cat: "baglac",
    q: "Some species thrive in cold climates, ---- others can only survive in tropical regions.",
    o: ["whereas", "so that", "unless", "as if", "in case"],
    a: 0,
    x: "İki durum karşılaştırılıyor → \"whereas\" (oysa, -iken)."
  },
  {
    cat: "baglac",
    q: "The patient will make a full recovery ---- he follows the doctor's instructions carefully.",
    o: ["even though", "provided that", "whereas", "so that", "despite"],
    a: 1,
    x: "Koşul belirtiliyor → \"provided that\" (-mesi şartıyla)."
  },
  {
    cat: "baglac",
    q: "The flight was cancelled ---- a technical problem with the engine.",
    o: ["because", "due to", "although", "so", "unless"],
    a: 1,
    x: "Boşluktan sonra isim öbeği var ve neden bildiriliyor → \"due to\" (+ isim)."
  },
  {
    cat: "baglac",
    q: "The data collected so far is limited; ----, the conclusions of the study should be treated with caution.",
    o: ["moreover", "hence", "otherwise", "in contrast", "similarly"],
    a: 1,
    x: "Sebep-sonuç ilişkisi var: veri sınırlı, bu yüzden (hence) sonuçlara temkinli yaklaşılmalı."
  },
  {
    cat: "baglac",
    q: "Researchers wore protective clothing ---- they would not be exposed to the chemicals.",
    o: ["so that", "even if", "whereas", "unless", "as though"],
    a: 0,
    x: "Amaç bildiriliyor → \"so that\" (-sin diye). Arkasından genellikle can/could/would gelir."
  },
  {
    cat: "baglac",
    q: "---- you start treatment early, the disease can cause permanent damage.",
    o: ["Unless", "As long as", "Because", "Once", "Provided that"],
    a: 0,
    x: "\"Unless\" = if not. Tedaviye erken başlamazsan hastalık kalıcı hasara yol açabilir."
  },

  // ===== Cümle Tamamlama =====
  {
    cat: "tamamlama",
    q: "Although the vaccine has proven highly effective in clinical trials, ----.",
    o: [
      "it was developed by a team of international scientists",
      "some people remain hesitant about getting vaccinated",
      "it has saved millions of lives since its introduction",
      "clinical trials are an essential part of drug development",
      "the results were published in a leading medical journal"
    ],
    a: 1,
    x: "\"Although\" zıtlık ister: aşı etkili olsa da bazı insanlar hâlâ tereddütlü."
  },
  {
    cat: "tamamlama",
    q: "If governments do not take urgent action to reduce carbon emissions, ----.",
    o: [
      "renewable energy has become cheaper in recent years",
      "many countries signed the Paris Agreement in 2015",
      "global temperatures could rise to dangerous levels",
      "scientists had warned about this for decades",
      "fossil fuels were the main source of energy in the past"
    ],
    a: 2,
    x: "Type 1 koşul (If + present) → ana cümlede gelecek/olasılık: could rise. Anlam da uyumlu."
  },
  {
    cat: "tamamlama",
    q: "----, the number of people working from home has increased dramatically.",
    o: [
      "Unless companies invest in new technology",
      "Since the outbreak of the pandemic",
      "Even though offices were closed",
      "So that employees could save time",
      "Whereas most jobs required physical presence"
    ],
    a: 1,
    x: "Ana cümle Present Perfect (has increased) → \"Since + olay\" uyumludur."
  },
  {
    cat: "tamamlama",
    q: "The researchers had to repeat the experiment several times ----.",
    o: [
      "because the initial results were inconsistent",
      "although they will publish the results soon",
      "unless the funding is approved",
      "whereas the laboratory is well-equipped",
      "even if the data has been accurate"
    ],
    a: 0,
    x: "Deneyin tekrarlanma nedeni: ilk sonuçların tutarsız olması. Zaman ve anlam uyumlu."
  },
  {
    cat: "tamamlama",
    q: "So rapidly did the city grow in the 19th century ----.",
    o: [
      "because industrialisation created many jobs",
      "that its infrastructure could not keep up with the population",
      "although many people moved to the countryside",
      "which is why it is now a major tourist destination",
      "when the railway was built"
    ],
    a: 1,
    x: "\"So + sıfat/zarf ... that\" yapısı: şehir o kadar hızlı büyüdü ki altyapı yetişemedi."
  },

  // ===== Çeviri İng → Tr =====
  {
    cat: "ceviriEnTr",
    q: "Although the region is rich in natural resources, most of its inhabitants live in poverty.",
    o: [
      "Bölge doğal kaynaklar açısından zengin olduğu için sakinlerinin çoğu yoksulluk içinde yaşamaktadır.",
      "Bölge sakinlerinin çoğu yoksulluk içinde yaşasa da bölge doğal kaynaklar açısından zengindir.",
      "Bölge doğal kaynaklar açısından zengin olmasına rağmen sakinlerinin çoğu yoksulluk içinde yaşamaktadır.",
      "Doğal kaynaklar açısından zengin bölgelerde yaşayanların çoğu yoksuldur.",
      "Bölge doğal kaynaklar bakımından zengin olsa bile sakinlerinin bir kısmı yoksulluk içinde yaşayabilir."
    ],
    a: 2,
    x: "\"Although\" = -e rağmen; ana fikir \"sakinlerin çoğu yoksul\". B'de vurgu ters çevrilmiş, E'de \"most\" yerine \"bir kısmı\" ve \"yaşayabilir\" denmiş."
  },
  {
    cat: "ceviriEnTr",
    q: "Recent studies have shown that regular physical activity can significantly reduce the risk of heart disease.",
    o: [
      "Son çalışmalar, düzenli fiziksel aktivitenin kalp hastalığı riskini önemli ölçüde azaltabileceğini göstermiştir.",
      "Son çalışmalara göre düzenli fiziksel aktivite kalp hastalığını tamamen önlemektedir.",
      "Düzenli fiziksel aktivitenin kalp hastalığı riskini azalttığı uzun zamandır bilinmektedir.",
      "Son çalışmalar, kalp hastalarının düzenli fiziksel aktivite yapması gerektiğini göstermiştir.",
      "Son çalışmalar, fiziksel aktivitenin kalp hastalığı riskini artırabileceğini ortaya koymuştur."
    ],
    a: 0,
    x: "\"can significantly reduce the risk\" = riskini önemli ölçüde azaltabilir. Diğer seçeneklerde anlam kayması (tamamen önlemek, artırmak vb.) var."
  },
  {
    cat: "ceviriEnTr",
    q: "It is widely believed that the invention of the printing press brought about profound changes in European society.",
    o: [
      "Matbaanın icadının Avrupa toplumunda derin değişikliklere yol açtığına yaygın olarak inanılmaktadır.",
      "Matbaanın icadı, Avrupa toplumunun derin değişikliklere uğradığı bir dönemde gerçekleşmiştir.",
      "Avrupa toplumundaki derin değişiklikler matbaanın icat edilmesini sağlamıştır.",
      "Matbaanın icadının Avrupa toplumunu az da olsa değiştirdiği düşünülmektedir.",
      "Pek çok kişi, matbaanın Avrupa'da icat edildiğine inanmaktadır."
    ],
    a: 0,
    x: "\"It is widely believed\" = yaygın olarak inanılmaktadır; \"bring about profound changes\" = derin değişikliklere yol açmak."
  },

  // ===== Çeviri Tr → İng =====
  {
    cat: "ceviriTrEn",
    q: "Uzmanlar, yapay zekânın önümüzdeki on yılda pek çok mesleği dönüştüreceğini öngörüyor.",
    o: [
      "Experts predicted that artificial intelligence had transformed many professions over the last decade.",
      "Experts anticipate that artificial intelligence will transform many professions over the next decade.",
      "According to experts, many professions are transforming artificial intelligence in the next decade.",
      "Artificial intelligence will be transformed by many professionals over the next decade, experts say.",
      "Experts doubt whether artificial intelligence will transform any profession in the next decade."
    ],
    a: 1,
    x: "\"öngörüyor\" = anticipate (şimdiki zaman); \"dönüştürecek\" = will transform; \"önümüzdeki on yıl\" = the next decade."
  },
  {
    cat: "ceviriTrEn",
    q: "Hastalık erken teşhis edilirse tedavi edilmesi çok daha kolay olur.",
    o: [
      "The disease was much easier to treat because it had been diagnosed early.",
      "Unless the disease is diagnosed early, it is much easier to treat.",
      "If the disease is diagnosed early, it is much easier to treat.",
      "Early diagnosis of the disease would have made treatment impossible.",
      "Even if the disease is diagnosed early, treating it is not easy."
    ],
    a: 2,
    x: "\"teşhis edilirse\" = if it is diagnosed (edilgen koşul); \"çok daha kolay\" = much easier."
  },
  {
    cat: "ceviriTrEn",
    q: "Su kıtlığı, dünyanın birçok bölgesinde giderek artan bir sorun hâline gelmektedir.",
    o: [
      "Water scarcity is becoming a growing problem in many parts of the world.",
      "Water scarcity has been solved in many parts of the world.",
      "Many parts of the world have an abundance of water.",
      "Water scarcity was once a problem in only a few parts of the world.",
      "The world's water problem stems from scarcity in a few regions."
    ],
    a: 0,
    x: "\"giderek artan bir sorun hâline gelmektedir\" = is becoming a growing problem."
  },

  // ===== Okuduğunu Anlama =====
  {
    cat: "okuma",
    passage: "Sleep is essential for both physical and mental health. During sleep, the brain consolidates memories and removes waste products that accumulate during the day. Research has shown that people who regularly sleep less than six hours a night are more susceptible to a range of health problems, including obesity, heart disease and depression. Despite this evidence, sleep deprivation is widespread in modern societies, largely due to long working hours and the use of electronic devices late at night. Experts therefore recommend that adults aim for seven to nine hours of sleep and avoid screens for at least an hour before bed.",
    q: "According to the passage, which of the following is one reason why sleep deprivation is common today?",
    o: [
      "People are unaware that sleep affects memory.",
      "The brain cannot remove waste products efficiently.",
      "People often use electronic devices late at night.",
      "Most adults sleep more than nine hours a night.",
      "Obesity and heart disease prevent people from sleeping."
    ],
    a: 2,
    x: "Metinde \"largely due to long working hours and the use of electronic devices late at night\" deniyor."
  },
  {
    cat: "okuma",
    passage: "Sleep is essential for both physical and mental health. During sleep, the brain consolidates memories and removes waste products that accumulate during the day. Research has shown that people who regularly sleep less than six hours a night are more susceptible to a range of health problems, including obesity, heart disease and depression. Despite this evidence, sleep deprivation is widespread in modern societies, largely due to long working hours and the use of electronic devices late at night. Experts therefore recommend that adults aim for seven to nine hours of sleep and avoid screens for at least an hour before bed.",
    q: "The word \"susceptible\" in the passage is closest in meaning to ----.",
    o: ["resistant", "vulnerable", "indifferent", "accustomed", "immune"],
    a: 1,
    x: "\"susceptible\" = yatkın, hassas → en yakın anlam \"vulnerable\" (savunmasız). \"resistant\" ve \"immune\" zıt anlamlıdır."
  },
  {
    cat: "okuma",
    passage: "Honeybees play a crucial role in agriculture by pollinating about a third of the crops we eat. However, bee populations have declined considerably in recent decades. Scientists attribute this decline to several factors, such as habitat loss, pesticide use and diseases spread by parasites. Since no single cause is responsible, solving the problem requires a comprehensive approach. Some countries have already restricted the use of certain pesticides, while others encourage farmers to plant wildflowers that provide food for bees.",
    q: "It can be inferred from the passage that ----.",
    o: [
      "pesticides are the only cause of the decline in bee populations",
      "bees are not important for food production",
      "banning a single pesticide would completely solve the problem",
      "tackling the decline in bees requires action on several fronts",
      "wildflowers are harmful to honeybees"
    ],
    a: 3,
    x: "Metin tek bir neden olmadığını ve \"comprehensive approach\" gerektiğini söylüyor → birden çok alanda önlem gerekli."
  },
  {
    cat: "okuma",
    passage: "Honeybees play a crucial role in agriculture by pollinating about a third of the crops we eat. However, bee populations have declined considerably in recent decades. Scientists attribute this decline to several factors, such as habitat loss, pesticide use and diseases spread by parasites. Since no single cause is responsible, solving the problem requires a comprehensive approach. Some countries have already restricted the use of certain pesticides, while others encourage farmers to plant wildflowers that provide food for bees.",
    q: "What is the main idea of the passage?",
    o: [
      "Farmers should stop growing crops that need pollination.",
      "The decline in honeybees, which are vital for agriculture, has multiple causes and needs a broad solution.",
      "Parasites are a more serious threat to bees than pesticides.",
      "Honeybees produce a third of the world's food.",
      "Wildflowers have replaced crops in many countries."
    ],
    a: 1,
    x: "Metin arıların önemini, azalmalarının birden çok nedenini ve kapsamlı çözüm ihtiyacını anlatıyor."
  },

  // ===== Anlamı Bozan Cümle =====
  {
    cat: "bozan",
    q: "(I) The Great Wall of China was built over many centuries to protect Chinese states from invasions. (II) It stretches for thousands of kilometres across mountains, deserts and grasslands. (III) Contrary to popular belief, it cannot be seen from space with the naked eye. (IV) Chinese cuisine varies greatly from region to region and is popular worldwide. (V) Today, the wall is one of the most visited tourist attractions in the world.",
    o: ["I", "II", "III", "IV", "V"],
    a: 3,
    x: "Paragraf Çin Seddi'ni anlatıyor; IV. cümle Çin mutfağından bahsederek akışı bozuyor."
  },
  {
    cat: "bozan",
    q: "(I) Regular exercise has numerous benefits for mental health. (II) It reduces stress by lowering levels of cortisol in the body. (III) It also stimulates the release of endorphins, which improve mood. (IV) Many gyms offer discounted memberships at the beginning of the year. (V) Furthermore, people who exercise regularly tend to sleep better and feel less anxious.",
    o: ["I", "II", "III", "IV", "V"],
    a: 3,
    x: "Konu egzersizin ruh sağlığına faydaları; spor salonu üyelik indirimleri (IV) konudan sapıyor."
  },
  {
    cat: "bozan",
    q: "(I) Antibiotics are medicines used to treat bacterial infections. (II) However, their overuse has led to the emergence of resistant bacteria. (III) These so-called superbugs pose a serious threat to public health. (IV) Antibiotics were first discovered by Alexander Fleming in 1928, when he noticed mould killing bacteria. (V) To tackle this problem, doctors are urged to prescribe antibiotics only when necessary.",
    o: ["I", "II", "III", "IV", "V"],
    a: 3,
    x: "Paragraf antibiyotik direnci sorununu ve çözümünü anlatıyor; IV. cümle tarihsel bilgi vererek III ile V arasındaki bağı koparıyor."
  }
];
