export type ChaosLevel = 1 | 2 | 3 | 4 | 5

export interface ContentItem {
  text: string
  level: ChaosLevel
  category?: string
}

export const truthQuestions: ContentItem[] = [
  // Level 1 - Harmlos
  { text: "Was war dein peinlichstes Erlebnis in der Schule?", level: 1 },
  { text: "Welchen Song hörst du heimlich und gibst es nie zu?", level: 1 },
  { text: "Was ist deine größte Angst im Leben?", level: 1 },
  { text: "Was ist das Seltsamste, das du jemals gegessen hast?", level: 1 },
  { text: "Welche Berühmtheit findest du insgeheim uncool?", level: 1 },
  { text: "Was ist die dümmste Sache, die du je aus Liebe getan hast?", level: 1 },
  { text: "Wie lange hast du dich zuletzt nicht geduscht?", level: 1 },
  { text: "Was ist dein peinlichstes Hobby?", level: 1 },
  { text: "Welche Serie schaust du, obwohl du dich dafür schämst?", level: 1 },
  { text: "Was war das teuerste Impuls-Shopping, das du je gemacht hast?", level: 1 },

  // Level 2 - Etwas persönlicher
  { text: "Wen in diesem Raum würdest du am liebsten für einen Tag mit dir tauschen?", level: 2 },
  { text: "Was ist das Schlimmste, das du jemals gelogen hast?", level: 2 },
  { text: "Wann hast du zuletzt wie ein Kind geweint?", level: 2 },
  { text: "Was ist das Seltsamste, das du je googelt hast?", level: 2 },
  { text: "Welchen deiner Freunde findest du manchmal heimlich nervig?", level: 2 },
  { text: "Was ist dein größter Dealbreaker beim Daten?", level: 2 },
  { text: "Hast du schon mal jemanden in diesem Raum vor anderen schlecht gemacht?", level: 2 },
  { text: "Was ist die verrückteste Ausrede, die du je benutzt hast, um nicht arbeiten zu gehen?", level: 2 },
  { text: "Wer hier im Raum hat deiner Meinung nach den schlechtesten Geschmack?", level: 2 },
  { text: "Was ist dein größtes Geheimnis, das du noch nie jemandem erzählt hast?", level: 2 },

  // Level 3 - Würzig
  { text: "Wen in diesem Raum würdest du am liebsten küssen?", level: 3 },
  { text: "Was ist das Unmoralischste, das du je getan hast?", level: 3 },
  { text: "Hast du schon mal jemanden in diesem Raum attraktiv gefunden?", level: 3 },
  { text: "Was ist dein seltsamster romantischer Moment?", level: 3 },
  { text: "Welchen hier anwesenden kannst du dir am wenigsten als Partner vorstellen?", level: 3 },
  { text: "Was ist das Dreisteste, das du je bei jemandem klar gemacht hast?", level: 3 },
  { text: "Wie viele Menschen hast du schon geküsst?", level: 3 },
  { text: "Was ist der wildeste Ort, an dem du dich schon geküsst hast?", level: 3 },

  // Level 4 - Heiß
  { text: "Was ist deine wildeste Party-Geschichte, die du noch nie erzählt hast?", level: 4 },
  { text: "Hast du schon mal jemanden gedatet, obwohl du Gefühle für jemand anderen hattest?", level: 4 },
  { text: "Was ist das Mutigste und Dümmste, das du je für Liebe getan hast?", level: 4 },
  { text: "Welchen hier im Raum würdest du heute Nacht flirten, wenn du müsstest?", level: 4 },

  // Level 5 - Chaos
  { text: "Was ist die wildeste Lüge, die du je erzählt hast – und wem?", level: 5 },
  { text: "Was ist der skandalöseste Moment deines Lebens?", level: 5 },
  { text: "Erzähl uns etwas über dich, das uns garantiert überrascht.", level: 5 },
]

export const dareChallenge: ContentItem[] = [
  // Level 1
  { text: "Mach 15 Liegestütze vor allen!", level: 1 },
  { text: "Singe 30 Sekunden einen Song deiner Wahl – jetzt!", level: 1 },
  { text: "Mach 1 Minute lang kein Wort – wer dich zum Reden bringt, trinkt auch.", level: 1 },
  { text: "Ruf jemanden aus deinen Kontakten an und sag nur: 'Ich vermisse dich'.", level: 1 },
  { text: "Tanze solo für 30 Sekunden – alle schauen zu.", level: 1 },
  { text: "Imitiere eine berühmte Persönlichkeit für 1 Minute.", level: 1 },
  { text: "Iss einen Löffel voll von dem seltsamsten Gewürz in der Küche.", level: 1 },
  { text: "Schreib deinem letzten Instagram-Follower eine Sprachnachricht.", level: 1 },
  { text: "Mach dein bestes Tier-Geräusch für 20 Sekunden.", level: 1 },
  { text: "Zeig dein Suchverlauf dem nächsten Mitspieler.", level: 1 },

  // Level 2
  { text: "Lasse jemanden dein Handy für 2 Minuten übernehmen.", level: 2 },
  { text: "Schreibe deiner Mutter eine Message: 'Ich bin verheiratet'.", level: 2 },
  { text: "Ruf bei einem Pizzaservice an und behaupte, du hättest Schmetterlinge als Topping bestellt.", level: 2 },
  { text: "Mach 60 Sekunden lang den Babbling Brook – sprich nonsense-Sätze mit ernstem Gesicht.", level: 2 },
  { text: "Poste eine peinliche Story – sie muss 1 Stunde online bleiben!", level: 2 },
  { text: "Trink ein Glas Wasser ohne Hände.", level: 2 },
  { text: "Erzähle einen Witz – wenn niemand lacht, trinkst du.", level: 2 },
  { text: "Spreche für die nächsten 3 Runden wie ein Pirat.", level: 2 },

  // Level 3
  { text: "Sitze für die nächste Runde auf dem Schoß deines rechten Nachbarn.", level: 3 },
  { text: "Gib dem Mitspieler zu deiner Linken ein echtes Kompliment – so persönlich wie möglich.", level: 3 },
  { text: "Mach einen Handstand oder versuche es für 30 Sekunden.", level: 3 },
  { text: "Ruf die letzte Person an, mit der du gestritten hast, und sag ihr: 'Du hattest recht.'", level: 3 },
  { text: "Lasse alle dein Telefon-Hintergrund-Bild raten, und zeige es dann.", level: 3 },

  // Level 4
  { text: "Lasse die Gruppe ein Tattoo auf deinen Arm malen – mit einem Edding.", level: 4 },
  { text: "Schreibe einer Ex/einem Ex eine mysteriöse Message: '...Ich weiß Bescheid 👀'", level: 4 },
  { text: "Mach 2 Minuten lang auf allen Vieren wie ein Hund – alle können Kommandos geben.", level: 4 },

  // Level 5
  { text: "Tausche für die nächsten 10 Minuten dein Oberteil mit dem deines Nachbarn.", level: 5 },
  { text: "Rufe dein Lieblingsrestaurant an und bestelle auf Englisch mit einem schlechten Akzent.", level: 5 },
  { text: "Lass die Gruppe eine Story auf deinem Instagram posten – ohne zu sehen, was es ist.", level: 5 },
]

export const neverHaveIEver: ContentItem[] = [
  // Level 1
  { text: "...ein Blind Date gehabt.", level: 1 },
  { text: "...bei einer Prüfung gespickt.", level: 1 },
  { text: "...jemanden aus Versehen auf Social Media geliked, während ich stalkte.", level: 1 },
  { text: "...meinen Eltern gegenüber gelogen, wo ich bin.", level: 1 },
  { text: "...ein Essen ins Restaurant zurückgeschickt.", level: 1 },
  { text: "...eine Verabredung abgesagt, weil ich zu faul war.", level: 1 },
  { text: "...in einem Aufzug gepupst und so getan, als wäre ich es nicht.", level: 1 },
  { text: "...jemanden geghostet.", level: 1 },
  { text: "...mehr als 1.000€ für ein einziges Item ausgegeben.", level: 1 },
  { text: "...bei einem Film oder einer Serie geweint.", level: 1 },
  { text: "...mich krank gemeldet, obwohl ich fit war.", level: 1 },
  { text: "...eine Netflix-Serie in einem Tag durchgeschaut.", level: 1 },

  // Level 2
  { text: "...jemanden auf einer Party geküsst, dessen Namen ich nicht kannte.", level: 2 },
  { text: "...etwas getan, das ich bereue, weil ich zu viel getrunken hatte.", level: 2 },
  { text: "...jemandem im Raum eine Nachricht geschrieben, obwohl wir nebeneinander saßen.", level: 2 },
  { text: "...jemanden beim Date gecancelt, weil ich gefunden hatte, dass er/sie nicht attraktiv genug war.", level: 2 },
  { text: "...auf einer Party heimlich in jemandes Zimmer eingeschaut.", level: 2 },
  { text: "...eine Stunde oder länger an einer Message getippt und sie dann gelöscht.", level: 2 },
  { text: "...ein Geheimnis weitergegeben, das ich schwor zu hüten.", level: 2 },
  { text: "...mich in eine Situation eingemischt, die mich nichts anging.", level: 2 },

  // Level 3
  { text: "...gleichzeitig zwei Personen gedatet.", level: 3 },
  { text: "...eine Beziehung begonnen, obwohl ich wusste, dass es nichts wird.", level: 3 },
  { text: "...an einem öffentlichen Ort etwas sehr Peinliches getan.", level: 3 },
  { text: "...eine Romanze mit jemandem begonnen, den ich wirklich nicht hätte sollen.", level: 3 },
  { text: "...auf einem ersten Date gelogen, um beeindruckend zu wirken.", level: 3 },

  // Level 4
  { text: "...eine Freundschaft oder Beziehung aus rein egoistischen Gründen aufrechterhalten.", level: 4 },
  { text: "...etwas Gestohlenes besessen – egal wie klein.", level: 4 },
  { text: "...jemanden aus der Gruppe heimlich attraktiv gefunden.", level: 4 },

  // Level 5
  { text: "...jemanden manipuliert, um ihn für mich zu gewinnen.", level: 5 },
  { text: "...etwas getan, das ich garantiert nie meinen Eltern erzählen würde.", level: 5 },
  { text: "...eine Entscheidung getroffen, die mein Leben komplett auf den Kopf gestellt hat.", level: 5 },
]

export const hotTakes: ContentItem[] = [
  { text: "Ananas gehört auf Pizza — und wer anderes sagt, hat keinen Geschmack.", level: 1 },
  { text: "Hundehalter sind nervoser als Katzenhalter.", level: 1 },
  { text: "Kaffee schmeckt eigentlich eklig — die Leute trinken ihn nur aus Gewohnheit.", level: 1 },
  { text: "Open Relationships funktionieren nie langfristig.", level: 2 },
  { text: "Die meisten Menschen sind in Wahrheit gar nicht ehrlich — sie sind nur zu feige zum Lügen.", level: 2 },
  { text: "Heiraten ist eine veraltete Institution.", level: 2 },
  { text: "Die meisten Menschen, die Veganismus predigen, sind unerträgliche Zeitgenossen.", level: 2 },
  { text: "Instagram zerstört Beziehungen mehr als es hilft.", level: 3 },
  { text: "Geld ist der wichtigste Faktor in einer Beziehung.", level: 3 },
  { text: "Arbeitsreiche Menschen sind oft diejenigen, die am wenigsten Freunde haben.", level: 3 },
  { text: "Eine Generation weiter: Gen Z ist die am schwächsten resiliente Generation.", level: 3 },
  { text: "Die meisten 'Traumbeziehungen' auf Social Media sind nur Performance.", level: 4 },
  { text: "Loyalität ist eine Ausrede, um bei jemandem zu bleiben, der einen nicht verdient.", level: 4 },
  { text: "Der gesellschaftliche Druck zum Kinderhaben ist eine Form von Manipulation.", level: 4 },
  { text: "Die meisten Menschen mögen ihre Arbeit nicht — sie sind nur gut darin, es zu verbergen.", level: 5 },
  { text: "Die ehrlichsten Menschen sind auch die einsamsten.", level: 5 },
]

export const challenges: ContentItem[] = [
  { text: "🎤 Karaoke-Battle: Zwei Spieler singen gegeneinander – die Gruppe bestimmt den Gewinner!", level: 1 },
  { text: "🃏 Ratespiel: Beschreibe eine berühmte Person OHNE deren Namen zu sagen – die anderen raten.", level: 1 },
  { text: "⚡ Speed-Runde: Alle nennen abwechselnd Länder – wer länger als 3 Sekunden braucht oder sich wiederholt, trinkt!", level: 1 },
  { text: "🤝 Wer kennt wen besser? Zwei Spieler werden befragt – passen ihre Antworten überein, gewinnen beide Punkte.", level: 1 },
  { text: "🎭 Scharade-Chaos: Errate den Film/Song nur durch Mimik und Gesten!", level: 2 },
  { text: "🔥 Hot Seat: Eine Person, 3 Minuten, alle stellen Fragen – sie MUSS antworten!", level: 2 },
  { text: "📱 TikTok-Pflicht: Erstellt zusammen ein 15-Sek-TikTok zum Thema 'Unsere Party'.", level: 2 },
  { text: "🎲 Lügen-Spiel: Jeder sagt 2 Wahrheiten und 1 Lüge – die Gruppe muss die Lüge finden!", level: 2 },
  { text: "💃 Tanzbattle: Zwei Spieler – 30 Sekunden je – Gruppe wählt Gewinner!", level: 3 },
  { text: "🎬 Impro-Theater: Gruppe gibt Thema vor – zwei Spieler improvisieren 2 Minuten.", level: 3 },
  { text: "🔮 Prophezeiung: Jeder sagt voraus, was der Mitspieler links nächsten Monat tut.", level: 3 },
  { text: "🃏 Poker Face: Wer kann 2 Minuten lang lachen, ohne zu lachen? Alle erzählen Witze!", level: 4 },
  { text: "📸 Cringe-Foto: Die Gruppe posiert für das peinlichste Foto der Nacht – Gruppe wählt Pose!", level: 4 },
  { text: "🌀 CHAOS-Runde: Alle tauschen die Plätze, jeder bekommt das Glas des anderen!", level: 5 },
]

export const wheelColors = [
  '#ff00aa', '#a000ff', '#00f5ff', '#ff6a00', '#00ff88', '#ffe600',
  '#ff4444', '#0088ff', '#ff8800', '#44ffaa',
]

export const playerEmojis = ['🦁', '🐯', '🦊', '🐺', '🦝', '🐻', '🦄', '🐸', '🦋', '🐲']

export const playerColors = [
  '#ff00aa', '#a000ff', '#00f5ff', '#ff6a00', '#00ff88',
  '#ffe600', '#ff4444', '#0088ff',
]
