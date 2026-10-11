// YDS soru türlerine göre özgün olarak yazılmış ek sorular (yeni türler: Cloze, Diyalog, Yakın Anlamlı Cümle).
// Bu dosya questions.js'ten sonra yüklenir; mevcut soruların sırası (ve kayıtlı cevaplar) değişmez.
Object.assign(window.YDS_CATEGORIES, {
  "cloze": "Paragraf Boşluk (Cloze)",
  "diyalog": "Diyalog Tamamlama",
  "yenidenIfade": "Yakın Anlamlı Cümle"
});

window.YDS_QUESTIONS.push.apply(window.YDS_QUESTIONS, [
  {
    "cat": "kelime",
    "q": "Regular exercise is widely regarded as an effective ---- against heart disease, although it cannot remove the risk entirely.",
    "o": [
      "resemblance",
      "withdrawal",
      "adherence",
      "submission",
      "safeguard"
    ],
    "a": 4,
    "x": "\"safeguard against\" = -e karşı koruma, güvence. Egzersiz kalp hastalığına karşı bir korumadır; diğer seçenekler (benzerlik, boyun eğme, bağlılık, geri çekilme) anlama uymaz."
  },
  {
    "cat": "kelime",
    "q": "Although smartphones are now common in most countries, the ---- of fast internet access still varies considerably between urban and rural areas.",
    "o": [
      "availability",
      "endurance",
      "resemblance",
      "submission",
      "termination"
    ],
    "a": 0,
    "x": "\"availability\" = erişilebilirlik, bulunabilirlik. Hızlı internete erişim kır ve kent arasında farklılık gösteriyor."
  },
  {
    "cat": "kelime",
    "q": "Since the 1990s, the number of people working from home has grown ----, and the trend accelerated further during the pandemic.",
    "o": [
      "reluctantly",
      "fruitlessly",
      "steadily",
      "vaguely",
      "hardly"
    ],
    "a": 2,
    "x": "\"grow steadily\" = istikrarlı biçimde artmak. \"hardly\" (neredeyse hiç) ve \"fruitlessly\" (boşuna) cümlenin devamıyla çelişir."
  },
  {
    "cat": "kelime",
    "q": "Learning to code is increasingly seen as a way to ---- skills that are in high demand on the job market.",
    "o": [
      "exclude",
      "deteriorate",
      "relieve",
      "acquire",
      "restrict"
    ],
    "a": 3,
    "x": "\"acquire skills\" = beceri edinmek. YDS'de sık geçen bir eşdizimdir."
  },
  {
    "cat": "kelime",
    "q": "Volunteers who work with refugees often ---- unexpected difficulties, such as language barriers and a lack of basic supplies.",
    "o": [
      "look for",
      "hand over",
      "give up",
      "turn down",
      "run into"
    ],
    "a": 4,
    "x": "\"run into (difficulties)\" = (zorluklarla) karşılaşmak. \"look for\" aramak anlamına gelir; insanlar zorluk aramaz."
  },
  {
    "cat": "kelime",
    "q": "The effects of the new medication are not ----; patients usually begin to feel better only after several weeks of treatment.",
    "o": [
      "instantaneous",
      "preliminary",
      "detrimental",
      "hospitable",
      "convertible"
    ],
    "a": 0,
    "x": "\"instantaneous\" = anında olan. Etkinin ancak haftalar sonra başlaması, anında olmadığını gösterir."
  },
  {
    "cat": "kelime",
    "q": "The museum decided to ---- its opening hours in summer to accommodate the growing number of tourists.",
    "o": [
      "deprive",
      "extend",
      "diminish",
      "undermine",
      "conceal"
    ],
    "a": 1,
    "x": "\"extend opening hours\" = açık kalma saatlerini uzatmak. Artan turist sayısını karşılamak için saatler uzatılır."
  },
  {
    "cat": "kelime",
    "q": "Many scientists remain ---- about the long-term safety of the new technology, arguing that far more research is needed.",
    "o": [
      "obsolete",
      "abundant",
      "hospitable",
      "sceptical",
      "eligible"
    ],
    "a": 3,
    "x": "\"sceptical about\" = -den şüpheli, kuşkulu. \"Daha fazla araştırma gerekli\" demeleri şüpheci olduklarını gösterir."
  },
  {
    "cat": "kelime",
    "q": "The report ---- the sharp rise in obesity rates to changes in diet and an increasingly sedentary lifestyle.",
    "o": [
      "adheres",
      "complies",
      "attributes",
      "consists",
      "refrains"
    ],
    "a": 2,
    "x": "\"attribute X to Y\" = X'i Y'ye bağlamak. Diğerleri farklı edat ister: comply with, refrain from, consist of, adhere to."
  },
  {
    "cat": "kelime",
    "q": "Researchers ---- a series of experiments to test whether the drug could slow down the progression of the disease.",
    "o": [
      "turned down",
      "made up",
      "put off",
      "came across",
      "carried out"
    ],
    "a": 4,
    "x": "\"carry out experiments\" = deney yapmak, yürütmek."
  },
  {
    "cat": "dilbilgisi",
    "q": "A recent study ---- that people who ---- fewer than six hours a night are more likely to catch a cold.",
    "o": [
      "shows / would sleep",
      "will show / have slept",
      "showed / had slept",
      "has shown / sleep",
      "had shown / will sleep"
    ],
    "a": 3,
    "x": "Yakın zamanda yapılmış bir araştırmanın bulgusu Present Perfect (has shown) ile verilir; genel bir doğru anlatıldığı için ikinci boşlukta Simple Present (sleep) gelir."
  },
  {
    "cat": "dilbilgisi",
    "q": "By the time the first vaccines ----, the virus ---- to more than fifty countries.",
    "o": [
      "would be developed / has spread",
      "have been developed / spreads",
      "are developed / had spread",
      "had been developed / spreads",
      "were developed / had already spread"
    ],
    "a": 4,
    "x": "\"By the time + Past Simple\" yapısında ana cümle Past Perfect olur: aşılar geliştirildiğinde virüs zaten yayılmıştı."
  },
  {
    "cat": "dilbilgisi",
    "q": "If the ancient city ---- by the volcanic eruption, we ---- so much about daily life in the Roman period today.",
    "o": [
      "had not been buried / would not know",
      "is not buried / would not have known",
      "was not buried / will not know",
      "has not been buried / do not know",
      "were not buried / had not known"
    ],
    "a": 0,
    "x": "Karma koşul cümlesi: geçmişteki bir koşul (had not been buried) bugünkü bir sonucu (would not know … today) etkiler."
  },
  {
    "cat": "dilbilgisi",
    "q": "The old bridge, which ---- in 1890, ---- for repairs since last spring.",
    "o": [
      "had built / was closed",
      "was building / is closed",
      "is built / had been closed",
      "was built / has been closed",
      "has been built / closes"
    ],
    "a": 3,
    "x": "1890 geçmişte bitmiş bir zaman → edilgen Past Simple (was built). \"since last spring\" → Present Perfect edilgen (has been closed)."
  },
  {
    "cat": "dilbilgisi",
    "q": "Most scientists believe that the dinosaurs ---- out as a result of a massive asteroid impact, although some ---- to volcanic activity as a contributing factor.",
    "o": [
      "were dying / have been pointed",
      "die / had pointed",
      "have died / pointed",
      "died / point",
      "had died / will point"
    ],
    "a": 3,
    "x": "Dinozorların yok oluşu geçmişte tamamlanmış bir olaydır (died); bazı bilim insanlarının bugünkü görüşü Simple Present (point to) ile verilir."
  },
  {
    "cat": "dilbilgisi",
    "q": "Ideally, the new law ---- pollution levels considerably by now; in reality, however, air quality ---- only slightly.",
    "o": [
      "would reduce / had improved",
      "should have reduced / has improved",
      "must have reduced / improves",
      "could reduce / will improve",
      "might have reduced / was improving"
    ],
    "a": 1,
    "x": "\"Ideally … in reality\" karşıtlığı, beklenip gerçekleşmeyen durumu anlatan \"should have + V3\" ister. \"by now\" ile gerçek durum Present Perfect'tir."
  },
  {
    "cat": "dilbilgisi",
    "q": "It is essential that every patient ---- about the possible side effects before the treatment ----.",
    "o": [
      "was informed / began",
      "will be informed / has begun",
      "be informed / begins",
      "is informed / will begin",
      "has informed / had begun"
    ],
    "a": 2,
    "x": "\"It is essential that\" yapısından sonra fiilin yalın hâli gelir (subjunctive): be informed. Zaman bağlacı \"before\" sonrası Simple Present kullanılır."
  },
  {
    "cat": "dilbilgisi",
    "q": "Not until the 19th century ---- that many diseases ---- by microorganisms.",
    "o": [
      "did scientists realise / were caused",
      "scientists realised / had caused",
      "would scientists realise / have caused",
      "had scientists realised / cause",
      "scientists did realise / are caused"
    ],
    "a": 0,
    "x": "\"Not until\" cümle başında olumsuz zarf olduğu için devrik yapı gerekir (did scientists realise). Hastalıklar mikroorganizmalar tarafından \"neden olunur\" → edilgen (were caused)."
  },
  {
    "cat": "baglac",
    "q": "---- young children are given clear and consistent rules, they tend to feel more secure and behave more calmly.",
    "o": [
      "Once",
      "Even if",
      "Although",
      "Whereas",
      "Unless"
    ],
    "a": 0,
    "x": "\"Once\" = -dığında, -dıktan sonra. Kurallar verildiğinde çocuklar kendini güvende hisseder; zıtlık ya da olumsuz koşul yok."
  },
  {
    "cat": "baglac",
    "q": "The new model is ---- cheaper ---- more energy-efficient than its predecessor, so sales are expected to rise.",
    "o": [
      "whether / or",
      "both / and",
      "such / that",
      "neither / nor",
      "either / or"
    ],
    "a": 1,
    "x": "Satışların artması beklendiğine göre iki olumlu özellik birlikte vardır: \"both … and\" (hem … hem de)."
  },
  {
    "cat": "baglac",
    "q": "---- a city grows, ---- demand there is for public transport, housing and clean water.",
    "o": [
      "Such big / that",
      "So big / that",
      "As big / as much",
      "The more / the less",
      "The bigger / the more"
    ],
    "a": 4,
    "x": "\"The + karşılaştırma …, the + karşılaştırma\" (ne kadar … o kadar) yapısı: şehir büyüdükçe talep artar."
  },
  {
    "cat": "baglac",
    "q": "Online courses have become popular ---- their flexibility, which allows students to study at their own pace.",
    "o": [
      "instead of",
      "due to",
      "in spite of",
      "except for",
      "unlike"
    ],
    "a": 1,
    "x": "Boşluktan sonra isim öbeği var ve sebep bildiriliyor: \"due to\" (-den dolayı)."
  },
  {
    "cat": "baglac",
    "q": "Printed books remain the main medium in literary studies, ---- in many scientific fields journal articles are far more influential.",
    "o": [
      "whereas",
      "in case",
      "so that",
      "unless",
      "as if"
    ],
    "a": 0,
    "x": "İki alan karşılaştırılıyor: \"whereas\" (oysa, -iken)."
  },
  {
    "cat": "baglac",
    "q": "---- its small size, the island has an extraordinarily rich variety of plant and animal species.",
    "o": [
      "As a result of",
      "Due to",
      "Because of",
      "Despite",
      "Owing to"
    ],
    "a": 3,
    "x": "Küçük olmasına rağmen zengin tür çeşitliliği: zıtlık → \"Despite\" (+ isim). Diğer seçeneklerin hepsi sebep bildirir."
  },
  {
    "cat": "baglac",
    "q": "Farmers in the region have increased their yields considerably ---- modern irrigation techniques.",
    "o": [
      "instead of",
      "regardless of",
      "in contrast to",
      "with the help of",
      "except for"
    ],
    "a": 3,
    "x": "Verim modern sulama teknikleri sayesinde artmış: \"with the help of\" (-in yardımıyla)."
  },
  {
    "cat": "baglac",
    "q": "You should back up your files regularly ---- your computer suddenly breaks down.",
    "o": [
      "in case",
      "even though",
      "as long as",
      "so that",
      "whereas"
    ],
    "a": 0,
    "x": "\"in case\" = -e karşı, ihtimaline karşı. Bilgisayar bozulursa diye önlem alınıyor."
  },
  {
    "cat": "cloze",
    "q": "(1) numaralı boşluğa hangisi gelmelidir?",
    "o": [
      "without",
      "instead of",
      "unless",
      "despite",
      "after"
    ],
    "a": 4,
    "x": "Keçiler meyveleri yedikten sonra enerjik oluyor: \"after eating\".",
    "passage": "Coffee is one of the most widely consumed beverages in the world, but its origins are surprisingly obscure. According to a popular legend, an Ethiopian goat herder noticed that his animals became unusually energetic (1)---- eating the berries of a certain shrub. Whether or not the story is true, historians agree that coffee drinking had (2)---- in Yemen by the 15th century, where Sufi monks used it to stay awake during night-time prayers. From there, the habit spread rapidly to Cairo, Istanbul and eventually Europe, (3)---- coffee houses became important centres of social and intellectual life. (4)---- some rulers tried to ban coffee, fearing that these places encouraged political discussion, such efforts generally failed. Today, millions of farmers depend on the crop for their livelihood, and coffee is (5)---- in more than 70 countries."
  },
  {
    "cat": "cloze",
    "q": "(2) numaralı boşluğa hangisi gelmelidir?",
    "o": [
      "become extinct",
      "been forgotten",
      "been prohibited",
      "been abandoned",
      "become established"
    ],
    "a": 4,
    "x": "Kahve içme alışkanlığı 15. yüzyılda Yemen'de yerleşmişti (become established); sonraki cümleler alışkanlığın yayıldığını anlatıyor.",
    "passage": "Coffee is one of the most widely consumed beverages in the world, but its origins are surprisingly obscure. According to a popular legend, an Ethiopian goat herder noticed that his animals became unusually energetic (1)---- eating the berries of a certain shrub. Whether or not the story is true, historians agree that coffee drinking had (2)---- in Yemen by the 15th century, where Sufi monks used it to stay awake during night-time prayers. From there, the habit spread rapidly to Cairo, Istanbul and eventually Europe, (3)---- coffee houses became important centres of social and intellectual life. (4)---- some rulers tried to ban coffee, fearing that these places encouraged political discussion, such efforts generally failed. Today, millions of farmers depend on the crop for their livelihood, and coffee is (5)---- in more than 70 countries."
  },
  {
    "cat": "cloze",
    "q": "(3) numaralı boşluğa hangisi gelmelidir?",
    "o": [
      "what",
      "whom",
      "where",
      "whose",
      "which"
    ],
    "a": 2,
    "x": "Önceki isim bir yer (Europe); \"where\" orada kahvehanelerin önemli merkezler hâline geldiğini anlatır. Arkasından tam bir cümle geldiği için \"which\" olmaz.",
    "passage": "Coffee is one of the most widely consumed beverages in the world, but its origins are surprisingly obscure. According to a popular legend, an Ethiopian goat herder noticed that his animals became unusually energetic (1)---- eating the berries of a certain shrub. Whether or not the story is true, historians agree that coffee drinking had (2)---- in Yemen by the 15th century, where Sufi monks used it to stay awake during night-time prayers. From there, the habit spread rapidly to Cairo, Istanbul and eventually Europe, (3)---- coffee houses became important centres of social and intellectual life. (4)---- some rulers tried to ban coffee, fearing that these places encouraged political discussion, such efforts generally failed. Today, millions of farmers depend on the crop for their livelihood, and coffee is (5)---- in more than 70 countries."
  },
  {
    "cat": "cloze",
    "q": "(4) numaralı boşluğa hangisi gelmelidir?",
    "o": [
      "Because",
      "Unless",
      "Since",
      "Once",
      "Although"
    ],
    "a": 4,
    "x": "Bazı yöneticiler yasaklamaya çalıştı ama başarısız oldu: zıtlık → \"Although\".",
    "passage": "Coffee is one of the most widely consumed beverages in the world, but its origins are surprisingly obscure. According to a popular legend, an Ethiopian goat herder noticed that his animals became unusually energetic (1)---- eating the berries of a certain shrub. Whether or not the story is true, historians agree that coffee drinking had (2)---- in Yemen by the 15th century, where Sufi monks used it to stay awake during night-time prayers. From there, the habit spread rapidly to Cairo, Istanbul and eventually Europe, (3)---- coffee houses became important centres of social and intellectual life. (4)---- some rulers tried to ban coffee, fearing that these places encouraged political discussion, such efforts generally failed. Today, millions of farmers depend on the crop for their livelihood, and coffee is (5)---- in more than 70 countries."
  },
  {
    "cat": "cloze",
    "q": "(5) numaralı boşluğa hangisi gelmelidir?",
    "o": [
      "to grow",
      "growing",
      "grown",
      "grow",
      "having grown"
    ],
    "a": 2,
    "x": "Kahve yetiştirilir → edilgen yapı: \"is grown\".",
    "passage": "Coffee is one of the most widely consumed beverages in the world, but its origins are surprisingly obscure. According to a popular legend, an Ethiopian goat herder noticed that his animals became unusually energetic (1)---- eating the berries of a certain shrub. Whether or not the story is true, historians agree that coffee drinking had (2)---- in Yemen by the 15th century, where Sufi monks used it to stay awake during night-time prayers. From there, the habit spread rapidly to Cairo, Istanbul and eventually Europe, (3)---- coffee houses became important centres of social and intellectual life. (4)---- some rulers tried to ban coffee, fearing that these places encouraged political discussion, such efforts generally failed. Today, millions of farmers depend on the crop for their livelihood, and coffee is (5)---- in more than 70 countries."
  },
  {
    "cat": "cloze",
    "q": "(1) numaralı boşluğa hangisi gelmelidir?",
    "o": [
      "whom",
      "what",
      "which",
      "how",
      "whose"
    ],
    "a": 3,
    "x": "Bilim insanları bu yön bulmanın \"nasıl\" mümkün olduğunu açıklayamıyordu: \"how\".",
    "passage": "Sea turtles are famous for their ability to return to the very beach where they hatched, sometimes after travelling thousands of kilometres. For a long time, scientists could not explain (1)---- such remarkable navigation was possible. Recent research suggests that turtles rely (2)---- the Earth's magnetic field, which varies slightly from place to place. Hatchlings appear to 'imprint' on the magnetic signature of their home beach, and years later they use this information to find their way back. (3)----, this ability may also make them vulnerable: changes in the magnetic field, as well as artificial structures that (4)---- it, could lead turtles to the wrong place. Researchers therefore argue that coastal development should be planned more carefully (5)---- these endangered animals."
  },
  {
    "cat": "cloze",
    "q": "(2) numaralı boşluğa hangisi gelmelidir?",
    "o": [
      "over",
      "from",
      "on",
      "in",
      "at"
    ],
    "a": 2,
    "x": "\"rely on\" = -e dayanmak, güvenmek.",
    "passage": "Sea turtles are famous for their ability to return to the very beach where they hatched, sometimes after travelling thousands of kilometres. For a long time, scientists could not explain (1)---- such remarkable navigation was possible. Recent research suggests that turtles rely (2)---- the Earth's magnetic field, which varies slightly from place to place. Hatchlings appear to 'imprint' on the magnetic signature of their home beach, and years later they use this information to find their way back. (3)----, this ability may also make them vulnerable: changes in the magnetic field, as well as artificial structures that (4)---- it, could lead turtles to the wrong place. Researchers therefore argue that coastal development should be planned more carefully (5)---- these endangered animals."
  },
  {
    "cat": "cloze",
    "q": "(3) numaralı boşluğa hangisi gelmelidir?",
    "o": [
      "Therefore",
      "However",
      "For instance",
      "Similarly",
      "In other words"
    ],
    "a": 1,
    "x": "Önceki cümle yeteneğin faydasını, bu cümle zararını anlatıyor: zıtlık → \"However\".",
    "passage": "Sea turtles are famous for their ability to return to the very beach where they hatched, sometimes after travelling thousands of kilometres. For a long time, scientists could not explain (1)---- such remarkable navigation was possible. Recent research suggests that turtles rely (2)---- the Earth's magnetic field, which varies slightly from place to place. Hatchlings appear to 'imprint' on the magnetic signature of their home beach, and years later they use this information to find their way back. (3)----, this ability may also make them vulnerable: changes in the magnetic field, as well as artificial structures that (4)---- it, could lead turtles to the wrong place. Researchers therefore argue that coastal development should be planned more carefully (5)---- these endangered animals."
  },
  {
    "cat": "cloze",
    "q": "(4) numaralı boşluğa hangisi gelmelidir?",
    "o": [
      "emerge",
      "disrupt",
      "persist",
      "prevail",
      "comprise"
    ],
    "a": 1,
    "x": "Yapay yapılar manyetik alanı bozar: \"disrupt\" (bozmak, sekteye uğratmak).",
    "passage": "Sea turtles are famous for their ability to return to the very beach where they hatched, sometimes after travelling thousands of kilometres. For a long time, scientists could not explain (1)---- such remarkable navigation was possible. Recent research suggests that turtles rely (2)---- the Earth's magnetic field, which varies slightly from place to place. Hatchlings appear to 'imprint' on the magnetic signature of their home beach, and years later they use this information to find their way back. (3)----, this ability may also make them vulnerable: changes in the magnetic field, as well as artificial structures that (4)---- it, could lead turtles to the wrong place. Researchers therefore argue that coastal development should be planned more carefully (5)---- these endangered animals."
  },
  {
    "cat": "cloze",
    "q": "(5) numaralı boşluğa hangisi gelmelidir?",
    "o": [
      "instead of protect",
      "so as not protecting",
      "in order to protect",
      "in spite of protecting",
      "with a view to protect"
    ],
    "a": 2,
    "x": "Amaç bildiriliyor: \"in order to + V1\" (-mek için). \"with a view to\" yapısından sonra -ing gelmesi gerekirdi.",
    "passage": "Sea turtles are famous for their ability to return to the very beach where they hatched, sometimes after travelling thousands of kilometres. For a long time, scientists could not explain (1)---- such remarkable navigation was possible. Recent research suggests that turtles rely (2)---- the Earth's magnetic field, which varies slightly from place to place. Hatchlings appear to 'imprint' on the magnetic signature of their home beach, and years later they use this information to find their way back. (3)----, this ability may also make them vulnerable: changes in the magnetic field, as well as artificial structures that (4)---- it, could lead turtles to the wrong place. Researchers therefore argue that coastal development should be planned more carefully (5)---- these endangered animals."
  },
  {
    "cat": "tamamlama",
    "q": "Though people often assume that creativity declines with age, ----.",
    "o": [
      "recent studies show that many artists produce their most innovative work in later life",
      "the brain continues to grow rapidly until the age of twenty-five",
      "older adults were asked to complete a series of memory tasks",
      "creative people tend to prefer working alone rather than in groups",
      "young children are naturally curious about the world around them"
    ],
    "a": 0,
    "x": "\"Though\" zıtlık kurar: yaygın varsayımın (yaratıcılık yaşla azalır) tersini söyleyen seçenek doğrudur."
  },
  {
    "cat": "tamamlama",
    "q": "Unless students see the material they study as relevant to their own lives, ----.",
    "o": [
      "most schools had introduced a new curriculum by 2010",
      "they are unlikely to stay motivated for long",
      "teachers have been using digital tools in classrooms",
      "they would have achieved higher grades",
      "learning a foreign language takes many years"
    ],
    "a": 1,
    "x": "\"Unless\" (= if not) Type 1 koşul kurar: ana cümlede şimdiki/gelecek zaman ve anlamca bir sonuç gerekir."
  },
  {
    "cat": "tamamlama",
    "q": "----, many advertisers have stopped using such methods because of strong public criticism.",
    "o": [
      "Unless companies spend more money on online advertising",
      "Even though some studies claim that hidden messages influence buying decisions",
      "As soon as the internet became widely available",
      "Since consumers are rarely aware of how adverts affect them",
      "Whereas television remains the most popular medium"
    ],
    "a": 1,
    "x": "Ana cümledeki \"such methods\" ifadesi bu yöntemlerin boşlukta tanımlanmasını ister; \"Even though\" ile kurulan zıtlık da anlama uygundur."
  },
  {
    "cat": "tamamlama",
    "q": "Elephant populations in parts of Africa have fallen sharply in recent decades, ----.",
    "o": [
      "so that they could be protected more effectively",
      "even if their herds are tracked by satellite",
      "unless the ivory trade had been banned in 1989",
      "just as a male elephant can weigh up to six tonnes",
      "largely because of poaching and the loss of their natural habitat"
    ],
    "a": 4,
    "x": "Nüfusun azalmasının nedeni açıklanmalı: kaçak avcılık ve habitat kaybı."
  },
  {
    "cat": "tamamlama",
    "q": "The way your body responds to stress may determine ----.",
    "o": [
      "that stress has always been part of human life",
      "because hormones travel through the bloodstream",
      "whether you develop certain health problems later in life",
      "so many people are working longer hours",
      "although doctors recommend regular exercise"
    ],
    "a": 2,
    "x": "\"determine\" fiilinden sonra belirlenen şeyi anlatan bir isim cümlesi gelir: \"whether …\" (-ip -mediğini)."
  },
  {
    "cat": "tamamlama",
    "q": "While chronic stress is known to harm both physical and mental health, ----.",
    "o": [
      "short periods of stress can actually improve performance and concentration",
      "it has been linked to heart disease and depression",
      "stress hormones are produced by the adrenal glands",
      "employees should take regular breaks at work",
      "many people try to relax by listening to music"
    ],
    "a": 0,
    "x": "\"While\" burada zıtlık bildirir: kronik stresin zararının karşısına kısa süreli stresin faydası konur. \"it has been linked to heart disease\" zıtlık değil, aynı yönde bilgidir."
  },
  {
    "cat": "tamamlama",
    "q": "Archaeologists had long assumed that the city was abandoned after a war ----.",
    "o": [
      "as long as local people visit the site",
      "whereas the ancient walls are still standing today",
      "until new evidence revealed that a severe drought had forced people to leave",
      "so the excavations will continue next summer",
      "because they will publish their findings soon"
    ],
    "a": 2,
    "x": "Past Perfect (had assumed) ve \"until\": yeni kanıt ortaya çıkana kadar böyle düşünülüyordu."
  },
  {
    "cat": "tamamlama",
    "q": "So many people now shop online ----.",
    "o": [
      "when the first online shops appeared in the 1990s",
      "which is why prices have generally fallen",
      "that a large number of traditional stores have been forced to close",
      "because delivery services are becoming faster",
      "although customers still like to try on clothes"
    ],
    "a": 2,
    "x": "\"So + many/much … that\" yapısı: o kadar çok kişi online alışveriş yapıyor ki mağazalar kapanmak zorunda kalıyor."
  },
  {
    "cat": "ceviriEnTr",
    "q": "According to recent research, regular reading may help protect the brain from age-related decline by strengthening the connections between nerve cells.",
    "o": [
      "Son araştırmalar, beyni korumanın tek yolunun sinir hücreleri arasındaki bağlantıları güçlendiren düzenli okuma olduğunu ortaya koymuştur.",
      "Son araştırmalara göre düzenli kitap okumak, sinir hücreleri arasındaki bağlantıları güçlendirerek beynin yaşa bağlı gerilemeden korunmasına yardımcı olabilir.",
      "Son araştırmalara göre sinir hücreleri arasındaki bağlantılar güçlendiğinde düzenli okuma alışkanlığı kazanılır ve bu, yaşa bağlı gerilemeyi önler.",
      "Son araştırmalar, düzenli okumanın yaşa bağlı gerilemeyi tamamen ortadan kaldırdığını ve sinir hücrelerini güçlendirdiğini göstermiştir.",
      "Son araştırmalara göre yaşa bağlı gerileme, sinir hücreleri arasındaki bağlantıların zayıflamasından kaynaklanır ve düzenli okumayla önlenemez."
    ],
    "a": 1,
    "x": "\"may help protect … by strengthening\" = güçlendirerek korunmasına yardımcı olabilir. Diğer seçeneklerde kesinlik (tamamen, tek yol) eklenmiş ya da sebep-sonuç ters çevrilmiş."
  },
  {
    "cat": "ceviriEnTr",
    "q": "Although many people associate hypnosis with stage shows, it is actually used by doctors to treat a range of conditions, including insomnia and chronic pain.",
    "o": [
      "Hipnoz sahne gösterilerinde kullanıldığı için pek çok kişi onu doktorların uykusuzluk ve kronik ağrı tedavisinde kullandığı bir yöntem olarak görmez.",
      "Doktorlar uykusuzluk ve kronik ağrıyı tedavi etmek için hipnozu sahne gösterilerinden daha sık kullanmaktadır.",
      "Hipnozun sahne gösterilerindeki kullanımı, doktorların onu uykusuzluk ve kronik ağrı gibi rahatsızlıkların tedavisinde kullanmasına yol açmıştır.",
      "Pek çok kişi hipnozu sahne gösterileriyle ilişkilendirir; oysa doktorlar onu yalnızca uykusuzluğun tedavisinde kullanır.",
      "Pek çok kişi hipnozu sahne gösterileriyle ilişkilendirse de hipnoz aslında doktorlar tarafından uykusuzluk ve kronik ağrı da dahil olmak üzere çeşitli rahatsızlıkların tedavisinde kullanılmaktadır."
    ],
    "a": 4,
    "x": "\"Although\" = -se de; \"a range of conditions, including …\" = … da dahil olmak üzere çeşitli rahatsızlıklar. \"yalnızca uykusuzluk\" ve sebep-sonuç kuran seçenekler anlamı değiştirir."
  },
  {
    "cat": "ceviriEnTr",
    "q": "One of the main challenges of protecting coral reefs is that most of the damage is caused by factors that originate far from the reefs themselves.",
    "o": [
      "Mercan resiflerini korumanın tek zorluğu, hasara yol açan etkenlerin nereden kaynaklandığının bilinmemesidir.",
      "Mercan resiflerine zarar veren etkenlerin çoğu resiflerin yakınında ortaya çıktığından onları korumak oldukça zordur.",
      "Mercan resiflerini korumak zordur, çünkü resiflerin çoğu insanların yaşadığı yerlerden çok uzaktadır.",
      "Mercan resiflerini korumanın başlıca zorluklarından biri, hasarın büyük kısmının resiflerin kendisinden çok uzakta ortaya çıkan etkenlerden kaynaklanmasıdır.",
      "Mercan resiflerine verilen zararın büyük kısmı, resiflerden uzakta yaşayan insanların onları korumakta zorlanmasından kaynaklanır."
    ],
    "a": 3,
    "x": "\"One of the main challenges\" = başlıca zorluklarından biri; \"factors that originate far from the reefs\" = resiflerden çok uzakta ortaya çıkan etkenler."
  },
  {
    "cat": "ceviriTrEn",
    "q": "Pek çok uzman, yapay zekânın gelecekte bazı meslekleri ortadan kaldırırken yenilerini de yaratacağını düşünmektedir.",
    "o": [
      "According to many experts, new professions will be created only if artificial intelligence eliminates the old ones.",
      "Many experts think that, in the future, artificial intelligence will eliminate some professions while also creating new ones.",
      "Artificial intelligence, which many experts consider a threat, will replace all existing professions in the future.",
      "Many experts believe that artificial intelligence has already eliminated more professions than it has created.",
      "Many experts doubt that artificial intelligence will create any new professions in the future."
    ],
    "a": 1,
    "x": "\"ortadan kaldırırken … yenilerini de yaratacağını\" = will eliminate some … while also creating new ones. Diğer seçenekler zamanı, koşulu ya da yargıyı değiştiriyor."
  },
  {
    "cat": "ceviriTrEn",
    "q": "Düzenli uyku, yalnızca fiziksel sağlık için değil, aynı zamanda öğrenme ve hafıza için de gereklidir.",
    "o": [
      "Learning and memory depend on physical health, which requires regular sleep.",
      "Regular sleep is essential not only for physical health but also for learning and memory.",
      "Although regular sleep is essential for physical health, it has little effect on learning and memory.",
      "Neither physical health nor memory can be improved without learning to sleep regularly.",
      "Regular sleep is more essential for learning and memory than it is for physical health."
    ],
    "a": 1,
    "x": "\"yalnızca … değil, aynı zamanda … de\" = not only … but also. Karşılaştırma ya da zıtlık kuran seçenekler anlamı bozar."
  },
  {
    "cat": "ceviriTrEn",
    "q": "Şehirlerin hızla büyümesi, toplu taşıma ve temiz suya olan talebin artmasına yol açmıştır.",
    "o": [
      "The rapid growth of cities has led to an increase in the demand for public transport and clean water.",
      "As cities grow rapidly, public transport and clean water will become less important.",
      "The demand for public transport and clean water has slowed down the growth of cities.",
      "Although cities have grown rapidly, the demand for public transport and clean water has remained stable.",
      "Cities have grown rapidly because the demand for public transport and clean water has increased."
    ],
    "a": 0,
    "x": "\"… yol açmıştır\" = has led to. Sebep (şehirlerin büyümesi) ve sonuç (talep artışı) yer değiştirmemelidir."
  },
  {
    "cat": "okuma",
    "q": "According to the passage, the earliest writing in Mesopotamia ----.",
    "o": [
      "consisted of a small number of symbols",
      "represented individual sounds rather than words",
      "was used mainly to record trade",
      "was later replaced by Chinese characters",
      "was invented by religious leaders"
    ],
    "a": 2,
    "x": "Metin: \"scribes began pressing wedge-shaped marks into clay tablets to record trade transactions\".",
    "passage": "Writing systems have developed independently in several parts of the world. The earliest known examples come from Mesopotamia, where around 3200 BCE scribes began pressing wedge-shaped marks into clay tablets to record trade transactions. These early signs represented whole words or ideas rather than sounds, which meant that thousands of symbols were needed. Over time, many writing systems moved towards representing sounds, which greatly reduced the number of symbols a learner had to memorise. The alphabet, in which each symbol stands roughly for a single sound, was the most economical of these developments. However, simplicity was not the only factor that determined which systems survived. Political power, religion and trade often played a greater role: a script spread when the people who used it gained influence, regardless of how easy it was to learn. This helps explain why Chinese characters, which are far more complex than an alphabet, have been in continuous use for more than three thousand years."
  },
  {
    "cat": "okuma",
    "q": "It can be inferred from the passage that a writing system ----.",
    "o": [
      "needs religious support in order to be invented",
      "does not necessarily survive just because it is easy to learn",
      "with fewer symbols is always older than one with many symbols",
      "always becomes simpler as it spreads to other regions",
      "can only be used by powerful nations"
    ],
    "a": 1,
    "x": "Metin, sadeliğin yazının yaşamasını belirleyen tek etken olmadığını; siyasi güç, din ve ticaretin daha önemli olabildiğini söylüyor.",
    "passage": "Writing systems have developed independently in several parts of the world. The earliest known examples come from Mesopotamia, where around 3200 BCE scribes began pressing wedge-shaped marks into clay tablets to record trade transactions. These early signs represented whole words or ideas rather than sounds, which meant that thousands of symbols were needed. Over time, many writing systems moved towards representing sounds, which greatly reduced the number of symbols a learner had to memorise. The alphabet, in which each symbol stands roughly for a single sound, was the most economical of these developments. However, simplicity was not the only factor that determined which systems survived. Political power, religion and trade often played a greater role: a script spread when the people who used it gained influence, regardless of how easy it was to learn. This helps explain why Chinese characters, which are far more complex than an alphabet, have been in continuous use for more than three thousand years."
  },
  {
    "cat": "okuma",
    "q": "The word \"economical\" in the passage is closest in meaning to ----.",
    "o": [
      "efficient",
      "complicated",
      "expensive",
      "ancient",
      "political"
    ],
    "a": 0,
    "x": "Alfabe, en az sembolle iş gören, yani en verimli (efficient) sistemdir.",
    "passage": "Writing systems have developed independently in several parts of the world. The earliest known examples come from Mesopotamia, where around 3200 BCE scribes began pressing wedge-shaped marks into clay tablets to record trade transactions. These early signs represented whole words or ideas rather than sounds, which meant that thousands of symbols were needed. Over time, many writing systems moved towards representing sounds, which greatly reduced the number of symbols a learner had to memorise. The alphabet, in which each symbol stands roughly for a single sound, was the most economical of these developments. However, simplicity was not the only factor that determined which systems survived. Political power, religion and trade often played a greater role: a script spread when the people who used it gained influence, regardless of how easy it was to learn. This helps explain why Chinese characters, which are far more complex than an alphabet, have been in continuous use for more than three thousand years."
  },
  {
    "cat": "okuma",
    "q": "Why does the author mention Chinese characters?",
    "o": [
      "To suggest that complex scripts will soon disappear",
      "To argue that the alphabet was invented in China",
      "To show that a complex script can survive for a very long time",
      "To explain how trade was recorded in Mesopotamia",
      "To compare the cost of different writing materials"
    ],
    "a": 2,
    "x": "Çince karakterler, karmaşık olmalarına rağmen 3000 yıldan uzun süredir kullanıldıkları için örnek veriliyor.",
    "passage": "Writing systems have developed independently in several parts of the world. The earliest known examples come from Mesopotamia, where around 3200 BCE scribes began pressing wedge-shaped marks into clay tablets to record trade transactions. These early signs represented whole words or ideas rather than sounds, which meant that thousands of symbols were needed. Over time, many writing systems moved towards representing sounds, which greatly reduced the number of symbols a learner had to memorise. The alphabet, in which each symbol stands roughly for a single sound, was the most economical of these developments. However, simplicity was not the only factor that determined which systems survived. Political power, religion and trade often played a greater role: a script spread when the people who used it gained influence, regardless of how easy it was to learn. This helps explain why Chinese characters, which are far more complex than an alphabet, have been in continuous use for more than three thousand years."
  },
  {
    "cat": "diyalog",
    "q": "Interviewer: You started your own company when you were only 22. What was the biggest challenge at the beginning?\nFounder: ----\nInterviewer: So how did you finally convince investors?\nFounder: I spent months preparing a detailed business plan and showing them our early results.",
    "o": [
      "Our products are now sold in more than twenty countries.",
      "Definitely finding money. Nobody wanted to invest in someone so young with no track record.",
      "I think young people should travel more before starting a career.",
      "My parents were both teachers, so they encouraged me to study hard.",
      "We are planning to open a new office in Berlin next year."
    ],
    "a": 1,
    "x": "Sonraki soru yatırımcıları nasıl ikna ettiğini soruyor; demek ki en büyük zorluk para/yatırım bulmaktı."
  },
  {
    "cat": "diyalog",
    "q": "Ali: I've been trying to drink eight glasses of water a day, but it's really hard.\nZeynep: ----\nAli: Really? So tea and soup count too?\nZeynep: Exactly. Most people get plenty of water without even trying.",
    "o": [
      "You should avoid drinking water just before going to bed.",
      "I usually go to the gym three times a week.",
      "Actually, you don't need to drink that much plain water; a lot of it comes from other drinks and food.",
      "Drinking too much coffee can make you feel anxious.",
      "Bottled water is more expensive than tap water in most cities."
    ],
    "a": 2,
    "x": "Ali'nin \"çay ve çorba da sayılıyor mu?\" sorusu, suyun başka içecek ve yiyeceklerden de alındığının söylendiğini gösterir."
  },
  {
    "cat": "diyalog",
    "q": "Student: I keep forgetting new words a few days after I learn them.\nTeacher: ----\nStudent: So reviewing them again just before I forget is the key?\nTeacher: Yes, that's the idea behind spaced repetition.",
    "o": [
      "Learning grammar is more important than learning vocabulary.",
      "You could also watch films in English with subtitles.",
      "Most students find reading comprehension the hardest part of the exam.",
      "That's normal. Memory fades quickly unless you review the words at increasing intervals.",
      "You should choose a dictionary with more example sentences."
    ],
    "a": 3,
    "x": "Öğrencinin cevabı (unutmadan hemen önce tekrar etmek) öğretmenin aralıklı tekrardan söz ettiğini gösterir."
  },
  {
    "cat": "diyalog",
    "q": "Emma: Did you know that some cities are painting roofs white to fight the heat?\nMark: ----\nEmma: Because white surfaces reflect sunlight instead of absorbing it, so buildings stay cooler.",
    "o": [
      "Yes, I painted my bedroom white last year.",
      "Really? How would the colour of a roof make any difference?",
      "Which cities have the most tourists in summer?",
      "Summers have been getting hotter every year.",
      "I prefer living in the countryside anyway."
    ],
    "a": 1,
    "x": "Emma'nın \"Because …\" ile başlayan açıklaması, Mark'ın çatı renginin neden fark yarattığını sorduğunu gösterir."
  },
  {
    "cat": "yenidenIfade",
    "q": "The more time teenagers spend on social media, the less time they tend to devote to sleep and physical activity.",
    "o": [
      "Teenagers spend more time on sleep and exercise than on social media.",
      "Teenagers who sleep and exercise more are more likely to use social media.",
      "Using social media has no effect on how much teenagers sleep or exercise.",
      "Social media encourages teenagers to sleep more and become more active.",
      "Teenagers who use social media heavily generally sleep and exercise less than those who use it less."
    ],
    "a": 4,
    "x": "\"The more …, the less …\" ters orantıyı anlatır: sosyal medya kullanımı arttıkça uyku ve egzersiz azalır."
  },
  {
    "cat": "yenidenIfade",
    "q": "Had the warning been taken seriously, the damage caused by the flood could have been prevented.",
    "o": [
      "No warning was given before the flood caused serious damage.",
      "The flood would have caused damage even if the warning had been taken seriously.",
      "The flood caused damage because the warning was not taken seriously.",
      "The warning was taken seriously, so the flood caused little damage.",
      "People took the warning seriously only after the flood had caused damage."
    ],
    "a": 2,
    "x": "Devrik Type 3 koşul (Had … been taken) gerçekleşmemiş bir geçmişi anlatır: uyarı ciddiye alınmadı, bu yüzden hasar oldu."
  },
  {
    "cat": "yenidenIfade",
    "q": "It was not until the invention of the microscope that scientists were able to observe bacteria.",
    "o": [
      "Scientists could observe bacteria only after the microscope had been invented.",
      "Bacteria were the first thing scientists observed with a microscope.",
      "Scientists observed bacteria long before the microscope was invented.",
      "The microscope was invented by scientists who wanted to observe bacteria.",
      "Without bacteria, the microscope would never have been invented."
    ],
    "a": 0,
    "x": "\"It was not until X that Y\" = Y ancak X'ten sonra oldu."
  },
  {
    "cat": "yenidenIfade",
    "q": "Despite being one of the smallest countries in Europe, Luxembourg has one of the highest incomes per person in the world.",
    "o": [
      "Luxembourg has a high income per person because it is one of the smallest countries in Europe.",
      "Although Luxembourg is among Europe's smallest countries, its income per person is among the highest in the world.",
      "Luxembourg is the smallest country in Europe and has the highest income in the world.",
      "Small countries in Europe usually have the highest incomes in the world.",
      "Luxembourg's income per person is high, but it is still lower than that of other European countries."
    ],
    "a": 1,
    "x": "\"Despite\" zıtlığı \"Although\" ile korunur; \"one of the smallest / one of the highest\" ifadeleri \"among the …\" ile aynı anlamı verir."
  },
  {
    "cat": "bozan",
    "q": "(I) Obsessions are unwanted thoughts or images that repeatedly enter a person's mind. (II) They often cause significant anxiety, even when the person knows they are irrational. (III) Common examples include fears of contamination or doubts about whether a door has been locked. (IV) Many famous scientists kept detailed diaries throughout their careers. (V) To reduce their anxiety, people with obsessions may perform repetitive actions such as washing their hands.",
    "o": [
      "I",
      "II",
      "III",
      "IV",
      "V"
    ],
    "a": 3,
    "x": "Paragraf takıntıları (obsession) anlatıyor; ünlü bilim insanlarının günlük tutması (IV) konudan sapıyor."
  },
  {
    "cat": "bozan",
    "q": "(I) The Silk Road was a network of trade routes connecting China with the Mediterranean. (II) Along these routes, merchants exchanged goods such as silk, spices and precious metals. (III) Silk is produced by the larvae of a moth that feeds on mulberry leaves. (IV) However, ideas, religions and technologies also travelled along the Silk Road. (V) As a result, the routes played a crucial role in shaping the cultures of Asia and Europe.",
    "o": [
      "I",
      "II",
      "III",
      "IV",
      "V"
    ],
    "a": 2,
    "x": "Paragraf İpek Yolu'nun ticari ve kültürel rolünü anlatıyor; ipeğin nasıl üretildiği (III) akışı bozuyor."
  }
]);

// Paragraf Tamamlama (YDS 72–75 türü) — özgün sorular
Object.assign(window.YDS_CATEGORIES, { eksikCumle: "Paragraf Tamamlama" });
window.YDS_QUESTIONS.push.apply(window.YDS_QUESTIONS, [
  {
    "cat": "eksikCumle",
    "q": "Honeybees communicate the location of food through a series of movements known as the 'waggle dance'. A bee returning to the hive moves in a figure-of-eight pattern, and the angle of its run indicates the direction of the food relative to the sun. ---- In this way, other bees can fly directly to a flower patch several kilometres away without searching for it themselves.",
    "o": [
      "However, bees are unable to see the colour red.",
      "Unlike bees, many wasps live alone and do not form colonies.",
      "Some farmers rent beehives to pollinate their fruit trees.",
      "Honey has been used as a natural medicine since ancient times.",
      "Meanwhile, the duration of the dance tells the other bees how far away the food is."
    ],
    "a": 4,
    "x": "Boşluktan önce dansın yönü, sonra da diğer arıların doğrudan çiçeklere uçabildiği anlatılıyor. Eksik bilgi mesafedir: dansın süresi uzaklığı gösterir."
  },
  {
    "cat": "eksikCumle",
    "q": "For most of history, people slept in two separate periods each night. They went to bed shortly after dark, woke up around midnight for an hour or two, and then slept again until morning. ---- Historians believe that the spread of artificial lighting in the 19th century gradually made this pattern disappear, as people began to stay up later and sleep in a single block.",
    "o": [
      "During this waking period, they would pray, read, talk to neighbours or simply lie quietly in bed.",
      "Some animals, such as dolphins, sleep with only half of their brain at a time.",
      "Night shifts are known to increase the risk of certain illnesses.",
      "Modern doctors recommend that adults sleep for seven to nine hours.",
      "Electric light bulbs were first sold commercially in the 1880s."
    ],
    "a": 0,
    "x": "Paragraf iki parçalı uykuyu anlatıyor; boşluk, gece yarısındaki uyanıklık süresinde ne yapıldığını açıklayan cümleyle tamamlanır. Sonraki cümle bu alışkanlığın neden kaybolduğunu anlatır."
  },
  {
    "cat": "eksikCumle",
    "q": "Many cities are replacing traditional streetlights with LED lamps because they use far less electricity. ---- Bright white LEDs emit large amounts of blue light, which can confuse migrating birds and disrupt the sleep of people living nearby. As a result, some cities now choose warmer-coloured LEDs that are less harmful but still save energy.",
    "o": [
      "In other words, cities spend a lot of money on lighting.",
      "For example, the first streetlights used gas instead of electricity.",
      "However, this change has an unexpected downside.",
      "Similarly, solar panels are becoming more efficient every year.",
      "Therefore, LED lamps are cheaper to produce than ever before."
    ],
    "a": 2,
    "x": "Boşluktan önce LED'in faydası, sonra zararları anlatılıyor. Bu yön değişimini \"However\" ile başlayan cümle sağlar."
  },
  {
    "cat": "eksikCumle",
    "q": "The Great Barrier Reef is the largest living structure on Earth and can even be seen from space. It is made up of nearly 3,000 individual reefs and supports thousands of species of fish, molluscs and corals. ---- Rising sea temperatures have caused several mass bleaching events since 1998, and scientists warn that the reef could lose most of its corals within decades if global warming continues.",
    "o": [
      "The reef was declared a World Heritage Site in 1981.",
      "Australia also has some of the world's most venomous snakes.",
      "Yet this remarkable ecosystem is now under serious threat.",
      "Corals are actually animals, not plants as many people believe.",
      "Tourists can visit the reef by boat from several coastal towns."
    ],
    "a": 2,
    "x": "Paragraf resifin büyüklüğünden sonra karşılaştığı tehditlere geçiyor; geçişi \"Yet … under serious threat\" cümlesi kurar."
  }
]);
