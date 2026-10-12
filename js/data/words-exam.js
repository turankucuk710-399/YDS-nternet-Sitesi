// 2021–2022 YDS kelime sorularının (1–6) ve kelime şıklı boşluk sorularının şıklarındaki kelimeler.
// Anlamlar ve örnek cümleler özgündür. Listede zaten olanlar yalnızca "sınav şıkkı" olarak işaretlenir.
(function () {
  var NEW = [
    {
      "w": "assurance",
      "t": "n",
      "lvl": 3,
      "m": "güvence, teminat; özgüven",
      "e": "The company gave assurances that no jobs would be lost."
    },
    {
      "w": "competence",
      "t": "n",
      "lvl": 3,
      "m": "yetkinlik, yeterlilik",
      "e": "She showed great competence in handling the crisis."
    },
    {
      "w": "balance",
      "t": "n",
      "lvl": 1,
      "m": "denge; bakiye",
      "e": "It is important to keep a balance between work and rest."
    },
    {
      "w": "insurance",
      "t": "n",
      "lvl": 1,
      "m": "sigorta",
      "e": "Travel insurance covers medical costs abroad."
    },
    {
      "w": "discrimination",
      "t": "n",
      "lvl": 2,
      "m": "ayrımcılık",
      "e": "The law forbids discrimination on the basis of gender."
    },
    {
      "w": "substitution",
      "t": "n",
      "lvl": 3,
      "m": "yerine koyma, ikame",
      "e": "The substitution of sugar with honey changed the taste."
    },
    {
      "w": "exposure",
      "t": "n",
      "lvl": 2,
      "m": "maruz kalma; teşhir",
      "e": "Long exposure to the sun can damage your skin."
    },
    {
      "w": "controversy",
      "t": "n",
      "lvl": 3,
      "m": "tartışma, anlaşmazlık",
      "e": "The new law caused a great deal of controversy."
    },
    {
      "w": "neglect",
      "t": "v",
      "lvl": 3,
      "m": "ihmal etmek",
      "e": "He neglected his studies and failed the exam."
    },
    {
      "w": "evident",
      "t": "adj",
      "lvl": 2,
      "m": "belli, açık, aşikâr",
      "e": "It was evident that she was nervous."
    },
    {
      "w": "convenient",
      "t": "adj",
      "lvl": 1,
      "m": "elverişli, uygun",
      "e": "Online banking is very convenient."
    },
    {
      "w": "constructive",
      "t": "adj",
      "lvl": 3,
      "m": "yapıcı",
      "e": "Thank you for your constructive criticism."
    },
    {
      "w": "strictly",
      "t": "adv",
      "lvl": 2,
      "m": "kesinlikle; sıkı bir şekilde",
      "e": "Smoking is strictly forbidden in the building."
    },
    {
      "w": "cautiously",
      "t": "adv",
      "lvl": 3,
      "m": "dikkatle, temkinli bir şekilde",
      "e": "Investors are cautiously optimistic about the market."
    },
    {
      "w": "ardently",
      "t": "adv",
      "lvl": 4,
      "m": "şevkle, tutkuyla",
      "e": "She ardently supported the campaign for clean water."
    },
    {
      "w": "improve",
      "t": "v",
      "lvl": 1,
      "m": "geliştirmek, iyileştirmek",
      "e": "Reading every day will improve your vocabulary."
    },
    {
      "w": "receive",
      "t": "v",
      "lvl": 1,
      "m": "almak, teslim almak",
      "e": "Did you receive my email?"
    },
    {
      "w": "rely on",
      "t": "phr",
      "lvl": 2,
      "m": "-e güvenmek, -e dayanmak",
      "e": "Many families rely on a single income."
    },
    {
      "w": "break into",
      "t": "phr",
      "lvl": 3,
      "m": "(zorla) girmek; (bir alana) girmek",
      "e": "Thieves broke into the shop last night."
    },
    {
      "w": "pass for",
      "t": "phr",
      "lvl": 4,
      "m": "… gibi görünmek, … yerine geçmek",
      "e": "With his perfect accent, he could pass for a native speaker."
    },
    {
      "w": "lead to",
      "t": "phr",
      "lvl": 1,
      "m": "-e yol açmak",
      "e": "Poor diet can lead to serious health problems."
    },
    {
      "w": "ration",
      "t": "n",
      "lvl": 3,
      "m": "pay, tayın, belirli miktar",
      "e": "Each soldier received a daily ration of bread."
    },
    {
      "w": "possession",
      "t": "n",
      "lvl": 2,
      "m": "mülk, sahip olunan şey; sahiplik",
      "e": "He lost all his possessions in the fire."
    },
    {
      "w": "structure",
      "t": "n",
      "lvl": 1,
      "m": "yapı",
      "e": "The structure of the brain is extremely complex."
    },
    {
      "w": "sense",
      "t": "n",
      "lvl": 1,
      "m": "duyu; anlam; his",
      "e": "Dogs have a very good sense of smell."
    },
    {
      "w": "resemblance",
      "t": "n",
      "lvl": 3,
      "m": "benzerlik",
      "e": "There is a strong resemblance between the two sisters."
    },
    {
      "w": "adjustment",
      "t": "n",
      "lvl": 3,
      "m": "ayarlama, uyum sağlama",
      "e": "Moving to a new country requires many adjustments."
    },
    {
      "w": "submission",
      "t": "n",
      "lvl": 4,
      "m": "teslim (etme); boyun eğme",
      "e": "The deadline for the submission of essays is Friday."
    },
    {
      "w": "adherence",
      "t": "n",
      "lvl": 4,
      "m": "(kurala) bağlılık, uyma",
      "e": "Strict adherence to the diet is necessary for success."
    },
    {
      "w": "utilisation",
      "t": "n",
      "lvl": 4,
      "m": "kullanım, yararlanma",
      "e": "Better utilisation of resources can reduce costs."
    },
    {
      "w": "withdrawal",
      "t": "n",
      "lvl": 3,
      "m": "geri çekilme; (para) çekme; yoksunluk",
      "e": "The withdrawal of troops began in March."
    },
    {
      "w": "precaution",
      "t": "n",
      "lvl": 3,
      "m": "önlem, tedbir",
      "e": "Take precautions against fire."
    },
    {
      "w": "termination",
      "t": "n",
      "lvl": 4,
      "m": "sona erdirme, fesih",
      "e": "The termination of the contract surprised everyone."
    },
    {
      "w": "hospitable",
      "t": "adj",
      "lvl": 4,
      "m": "misafirperver; elverişli",
      "e": "The local people were extremely hospitable."
    },
    {
      "w": "convertible",
      "t": "adj",
      "lvl": 4,
      "m": "dönüştürülebilir",
      "e": "The sofa is convertible into a bed."
    },
    {
      "w": "instantaneous",
      "t": "adj",
      "lvl": 4,
      "m": "anlık, anında olan",
      "e": "The effect of the medicine was almost instantaneous."
    },
    {
      "w": "preliminary",
      "t": "adj",
      "lvl": 4,
      "m": "ön, hazırlık niteliğinde",
      "e": "Preliminary results suggest the drug is safe."
    },
    {
      "w": "conveniently",
      "t": "adv",
      "lvl": 3,
      "m": "uygun bir şekilde; işine geldiği gibi",
      "e": "The hotel is conveniently located near the station."
    },
    {
      "w": "alternatively",
      "t": "adv",
      "lvl": 3,
      "m": "alternatif olarak, ya da",
      "e": "You can take the bus or, alternatively, walk."
    },
    {
      "w": "precisely",
      "t": "adv",
      "lvl": 2,
      "m": "tam olarak, kesin olarak",
      "e": "That is precisely what I meant."
    },
    {
      "w": "fruitfully",
      "t": "adv",
      "lvl": 4,
      "m": "verimli bir şekilde",
      "e": "The two teams worked fruitfully together."
    },
    {
      "w": "exclude",
      "t": "v",
      "lvl": 2,
      "m": "hariç tutmak, dışlamak",
      "e": "The price excludes tax."
    },
    {
      "w": "relieve",
      "t": "v",
      "lvl": 3,
      "m": "rahatlatmak, hafifletmek",
      "e": "This medicine will relieve the pain."
    },
    {
      "w": "restrict",
      "t": "v",
      "lvl": 2,
      "m": "kısıtlamak, sınırlamak",
      "e": "The new rules restrict the use of phones in class."
    },
    {
      "w": "hand over",
      "t": "phr",
      "lvl": 2,
      "m": "teslim etmek, devretmek",
      "e": "He handed over the keys to the new owner."
    },
    {
      "w": "look for",
      "t": "phr",
      "lvl": 1,
      "m": "aramak",
      "e": "I'm looking for my glasses."
    },
    {
      "w": "run into",
      "t": "phr",
      "lvl": 3,
      "m": "(sorunla) karşılaşmak; rastlamak",
      "e": "We ran into problems with the software."
    },
    {
      "w": "withdraw",
      "t": "v",
      "lvl": 3,
      "m": "geri çekmek; (para) çekmek; çekilmek",
      "e": "She withdrew her application at the last minute."
    },
    {
      "w": "adopt",
      "t": "v",
      "lvl": 2,
      "m": "benimsemek; evlat edinmek",
      "e": "The school adopted a new teaching method."
    },
    {
      "w": "execute",
      "t": "v",
      "lvl": 3,
      "m": "uygulamak, yürütmek; idam etmek",
      "e": "The plan was executed perfectly."
    },
    {
      "w": "recall",
      "t": "v",
      "lvl": 3,
      "m": "hatırlamak; geri çağırmak",
      "e": "I can't recall where I left my keys."
    },
    {
      "w": "convert",
      "t": "v",
      "lvl": 2,
      "m": "dönüştürmek",
      "e": "The old factory was converted into apartments."
    },
    {
      "w": "betray",
      "t": "v",
      "lvl": 3,
      "m": "ihanet etmek; ele vermek",
      "e": "He felt betrayed by his closest friend."
    },
    {
      "w": "enhancement",
      "t": "n",
      "lvl": 3,
      "m": "geliştirme, iyileştirme",
      "e": "The software update includes several security enhancements."
    },
    {
      "w": "facility",
      "t": "n",
      "lvl": 2,
      "m": "tesis; imkân",
      "e": "The city has excellent sports facilities."
    },
    {
      "w": "demonstration",
      "t": "n",
      "lvl": 2,
      "m": "gösteri; kanıtlama",
      "e": "Thousands joined the demonstration against the war."
    },
    {
      "w": "provision",
      "t": "n",
      "lvl": 3,
      "m": "sağlama, temin; hüküm",
      "e": "The provision of clean water is a priority."
    },
    {
      "w": "commitment",
      "t": "n",
      "lvl": 3,
      "m": "bağlılık; taahhüt",
      "e": "Learning a language requires time and commitment."
    },
    {
      "w": "mitigation",
      "t": "n",
      "lvl": 4,
      "m": "hafifletme, azaltma",
      "e": "Flood mitigation measures include building new walls."
    },
    {
      "w": "conservation",
      "t": "n",
      "lvl": 3,
      "m": "koruma (doğal kaynaklar)",
      "e": "Wildlife conservation is important for future generations."
    },
    {
      "w": "statement",
      "t": "n",
      "lvl": 1,
      "m": "açıklama, ifade",
      "e": "The police issued a statement about the accident."
    },
    {
      "w": "sentiment",
      "t": "n",
      "lvl": 4,
      "m": "duygu, kanaat",
      "e": "Public sentiment has turned against the government."
    },
    {
      "w": "adaptable",
      "t": "adj",
      "lvl": 3,
      "m": "uyum sağlayabilen, uyarlanabilir",
      "e": "Children are often more adaptable than adults."
    },
    {
      "w": "accessible",
      "t": "adj",
      "lvl": 3,
      "m": "erişilebilir, ulaşılabilir",
      "e": "The museum is accessible to wheelchair users."
    },
    {
      "w": "comparable",
      "t": "adj",
      "lvl": 3,
      "m": "karşılaştırılabilir, benzer",
      "e": "The two cities are comparable in size."
    },
    {
      "w": "applicable",
      "t": "adj",
      "lvl": 3,
      "m": "uygulanabilir, geçerli",
      "e": "These rules are applicable to all students."
    },
    {
      "w": "admirably",
      "t": "adv",
      "lvl": 4,
      "m": "takdire değer biçimde",
      "e": "She handled the difficult situation admirably."
    },
    {
      "w": "conclusively",
      "t": "adv",
      "lvl": 4,
      "m": "kesin olarak, kesinlikle",
      "e": "The study conclusively proved the link between smoking and cancer."
    },
    {
      "w": "feasibly",
      "t": "adv",
      "lvl": 4,
      "m": "uygulanabilir biçimde, makul olarak",
      "e": "The project could feasibly be finished by June."
    },
    {
      "w": "sufficiently",
      "t": "adv",
      "lvl": 3,
      "m": "yeterince",
      "e": "The patient has recovered sufficiently to go home."
    },
    {
      "w": "release",
      "t": "v",
      "lvl": 2,
      "m": "serbest bırakmak; yayımlamak; salmak",
      "e": "The band will release a new album next month."
    },
    {
      "w": "stand out",
      "t": "phr",
      "lvl": 3,
      "m": "göze çarpmak, öne çıkmak",
      "e": "Her bright red coat made her stand out in the crowd."
    },
    {
      "w": "carry away",
      "t": "phr",
      "lvl": 4,
      "m": "kendinden geçirmek; sürüklemek",
      "e": "Don't get carried away and spend all your money."
    },
    {
      "w": "bring in",
      "t": "phr",
      "lvl": 3,
      "m": "getirmek; (yasa vb.) yürürlüğe koymak; gelir getirmek",
      "e": "The government brought in new laws on recycling."
    },
    {
      "w": "come over",
      "t": "phr",
      "lvl": 3,
      "m": "uğramak; (duygu) kaplamak",
      "e": "Why don't you come over for dinner?"
    },
    {
      "w": "irreversible",
      "t": "adj",
      "lvl": 4,
      "m": "geri döndürülemez",
      "e": "Some damage to the environment may be irreversible."
    },
    {
      "w": "unavailable",
      "t": "adj",
      "lvl": 2,
      "m": "mevcut olmayan, ulaşılamayan",
      "e": "The manager is unavailable at the moment."
    },
    {
      "w": "unconventional",
      "t": "adj",
      "lvl": 4,
      "m": "alışılmışın dışında",
      "e": "She has an unconventional approach to teaching."
    },
    {
      "w": "dramatically",
      "t": "adv",
      "lvl": 2,
      "m": "büyük ölçüde, çarpıcı biçimde",
      "e": "Prices have risen dramatically this year."
    },
    {
      "w": "supposedly",
      "t": "adv",
      "lvl": 3,
      "m": "güya, sözde",
      "e": "The film is supposedly based on a true story."
    },
    {
      "w": "temporarily",
      "t": "adv",
      "lvl": 2,
      "m": "geçici olarak",
      "e": "The road is temporarily closed."
    },
    {
      "w": "slightly",
      "t": "adv",
      "lvl": 1,
      "m": "biraz, hafifçe",
      "e": "The new version is slightly faster."
    },
    {
      "w": "randomly",
      "t": "adv",
      "lvl": 2,
      "m": "rastgele",
      "e": "Participants were randomly divided into two groups."
    }
  ];
  var EXAM = ["accessible", "adaptable", "adherence", "adjustment", "admirably", "adopt", "alienate", "alternatively", "anticipate", "applicable", "arbitrary", "ardently", "assurance", "attain", "attribute", "balance", "betray", "break into", "bring in", "call off", "carry away", "cautiously", "cease", "come over", "commitment", "comparable", "competence", "conclusively", "condemn", "conservation", "constructive", "controversy", "convenient", "conveniently", "convert", "convertible", "curtail", "demonstration", "deteriorate", "deterrent", "detrimental", "devastate", "diminish", "discrimination", "dispel", "dramatically", "drastically", "embody", "enhancement", "ensure", "evident", "exceed", "exclude", "execute", "exponentially", "exposure", "facility", "falsify", "feasibly", "fruitfully", "give up", "hand down", "hand over", "hospitable", "implication", "improve", "inevitable", "instantaneous", "insurance", "irrefutable", "irreversible", "jeopardise", "lead to", "look for", "manifest", "mediocre", "merely", "mitigation", "neglect", "overtly", "pass for", "possession", "precaution", "precisely", "preliminary", "prevalence", "provision", "randomly", "ration", "recall", "receive", "recession", "release", "relieve", "rely on", "resemblance", "restrict", "revive", "run into", "sense", "sentiment", "slightly", "stand out", "statement", "strictly", "structure", "submission", "substitution", "sufficiently", "supposedly", "temporarily", "termination", "turn down", "unavailable", "unconventional", "utilisation", "vulnerable", "withdraw", "withdrawal"];
  var have = {};
  window.YDS_WORDS.forEach(function (w) { have[w.w.toLowerCase()] = w; });
  NEW.forEach(function (w) { if (!have[w.w.toLowerCase()]) { window.YDS_WORDS.push(w); have[w.w.toLowerCase()] = w; } });
  EXAM.forEach(function (k) { if (have[k]) have[k].sik = true; });
})();
