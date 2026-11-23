// Die Kräuter des Zauberwalds (Startseite): Suche im dunklen Wald, Rätselkarten und Zauberkessel.
// Bewusst ohne Heilversprechen – Verwendung in der Küche und ehrliche Hinweise zur Verwechslungsgefahr.

export type HerbId = "baerlauch" | "brennnessel" | "giersch" | "spitzwegerich" | "loewenzahn" | "knoblauchsrauke" | "gundermann";

export type Herb = {
  id: HerbId;
  name: string;
  latin: string;
  /** Rätsel für die Karte («Wer bin ich?») */
  riddle: string;
  /** Kurz beim Finden im Wald */
  found: string;
  use: string;
  caution: string;
  season: string;
  /** Farbe im Zauberkessel */
  color: string;
  /** Für den Namen des Tranks */
  adjective: string;
  noun: string;
};

export const herbs: Herb[] = [
  {
    id: "baerlauch",
    name: "Bärlauch",
    latin: "Allium ursinum",
    riddle: "Im Frühling bedecke ich ganze Waldböden und dufte nach Knoblauch. Wer mich pflückt, muss genau hinschauen.",
    found: "Du riechst ihn, bevor du ihn siehst: Knoblauchduft im Frühlingswald.",
    use: "Pesto, Kräuterbutter, Suppe – am besten roh oder nur kurz erwärmt.",
    caution: "Verwechslungsgefahr mit den giftigen Maiglöckchen und der Herbstzeitlose. Jedes Blatt einzeln prüfen.",
    season: "März bis Mai",
    color: "#5fae3c",
    adjective: "Wilder",
    noun: "Frühlingsruf",
  },
  {
    id: "brennnessel",
    name: "Brennnessel",
    latin: "Urtica dioica",
    riddle: "Wer mich berührt, spürt mich. Trotzdem landen meine jungen Triebe gerne im Kochtopf.",
    found: "Vorsicht, sie brennt! Junge Triebspitzen sammelt man mit Handschuhen.",
    use: "Wie Spinat, in Suppen, als Tee oder getrocknet – die Samen schmecken nussig.",
    caution: "Mit Handschuhen pflücken. Durch Kochen, Trocknen oder Walzen verlieren die Brennhaare ihre Wirkung.",
    season: "März bis Oktober",
    color: "#3f8f4b",
    adjective: "Kribbelnder",
    noun: "Brennzauber",
  },
  {
    id: "giersch",
    name: "Giersch",
    latin: "Aegopodium podagraria",
    riddle: "Gärtnerinnen verfluchen mich, Köchinnen lieben mich. Mein Stängel ist dreikantig, meine Blätter dreimal dreigeteilt.",
    found: "Das «Unkraut», das in Wahrheit ein Wildgemüse ist.",
    use: "Junge Blätter im Salat, im Flammkuchen oder als Pesto – mild, leicht nach Petersilie und Karotte.",
    caution: "Doldenblütler: Es gibt giftige Doppelgänger wie Hundspetersilie oder Schierling. Nur sicher bestimmt sammeln.",
    season: "April bis Juni",
    color: "#86c25a",
    adjective: "Unverwüstlicher",
    noun: "Gartengeist",
  },
  {
    id: "spitzwegerich",
    name: "Spitzwegerich",
    latin: "Plantago lanceolata",
    riddle: "Ich wachse am Wegrand, habe lange, schmale Blätter mit Längsnerven – und ich bin das Kraut im Verkräutert-Logo.",
    found: "Das Logo-Kraut! Seine Blüten schmecken leicht nach Pilzen.",
    use: "Junge Blätter in Salat und Kräuterquark, Blütenknospen gebraten, klassisch als Sirup.",
    caution: "Leicht zu erkennen an den parallelen Blattnerven. Nicht an Hunde-Wegrändern sammeln.",
    season: "April bis September",
    color: "#a3c96b",
    adjective: "Wegweisender",
    noun: "Pfadfinder-Elixier",
  },
  {
    id: "loewenzahn",
    name: "Löwenzahn",
    latin: "Taraxacum officinale",
    riddle: "Meine Blätter haben Zähne, meine Blüte ist eine kleine Sonne – und später werde ich zur Pusteblume.",
    found: "Eine kleine Sonne im Gras – und später ein Wunsch zum Pusten.",
    use: "Junge Blätter im Salat (angenehm bitter), Blüten für Sirup oder «Löwenzahnhonig».",
    caution: "Nur abseits von gedüngten Wiesen und Strassen sammeln. Der Milchsaft färbt die Finger.",
    season: "März bis Oktober",
    color: "#e8c22e",
    adjective: "Sonniger",
    noun: "Pustewunsch",
  },
  {
    id: "knoblauchsrauke",
    name: "Knoblauchsrauke",
    latin: "Alliaria petiolata",
    riddle: "Meine Blätter sind herzförmig, meine weissen Blüten haben vier Blätter, und zerrieben rieche ich mild nach Knoblauch.",
    found: "Knoblaucharoma ohne Knoblauchfahne – perfekt für einen frischen Dip.",
    use: "Fein gehackt im Dip, in Pesto, Kräuterbutter oder Salat.",
    caution: "Die Blätter verändern sich im Lauf des Jahres – die Pflanze in allen Stadien kennenlernen.",
    season: "März bis Juni",
    color: "#cfe7a2",
    adjective: "Herziger",
    noun: "Waldrand-Dip",
  },
  {
    id: "gundermann",
    name: "Gundermann",
    latin: "Glechoma hederacea",
    riddle: "Ich krieche durchs Gras, habe runde, gekerbte Blätter und kleine violette Blüten. Ich schmecke würzig-minzig.",
    found: "Klein, kriechend und überraschend würzig.",
    use: "Sparsam als Würzkraut, in Kräuterbutter, Quark oder als essbare Deko.",
    caution: "Sehr aromatisch – nur in kleinen Mengen verwenden.",
    season: "März bis Juni",
    color: "#9a7bd1",
    adjective: "Geheimnisvoller",
    noun: "Veilchenduft",
  },
];

export const herbById = Object.fromEntries(herbs.map((h) => [h.id, h])) as Record<HerbId, Herb>;
