export type CallStatus = "erfolgreich" | "nicht_erfolgreich" | "weitergeleitet";

export interface TranscriptWord {
  word: string;
  start: number;
  end: number;
}

export interface TranscriptLine {
  speaker: "Kunde" | "Kiki";
  text: string;
  words: TranscriptWord[];
  startTime: number;
  endTime: number;
}

export interface Call {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerCompany?: string;
  timestamp: Date;
  duration: number; // seconds
  status: CallStatus;
  subject: string;
  summary: string;
  summaryBullets: string[];
  employeeAssigned: string;
  audioUrl: string;
  transcript: TranscriptLine[];
  topic: string;
}

const AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const employees = [
  "Thomas Müller",
  "Hans Weber",
  "Klaus Schmidt",
  "Maria Fischer",
  "Anna Wagner",
];

const topics = [
  "Sanitär",
  "Elektrik",
  "Schreinerei",
  "Heizung",
  "Dachdecker",
  "Malerei",
  "Fliesenleger",
  "Gartenbau",
];

function generateTranscript(subject: string, duration: number): TranscriptLine[] {
  const conversations: [string, string][][] = [
    [
      ["Guten Tag, hier spricht Kiki von Müller Handwerk. Wie kann ich Ihnen helfen?", "Kiki"],
      ["Hallo, ich habe ein Problem mit meinem Wasserhahn in der Küche. Er tropft seit gestern.", "Kunde"],
      ["Das tut mir leid zu hören. Können Sie mir sagen, ob es ein ständiges Tropfen ist oder nur gelegentlich?", "Kiki"],
      ["Es tropft ständig, auch wenn der Hahn ganz zugedreht ist.", "Kunde"],
      ["Verstehe. Das klingt nach einer defekten Dichtung. Ich kann Ihnen einen Termin für morgen Vormittag anbieten.", "Kiki"],
      ["Morgen Vormittag wäre perfekt. Zwischen 9 und 11 Uhr?", "Kunde"],
      ["Ja, ich trage Sie für 9:30 Uhr ein. Unser Techniker Thomas wird vorbeikommen.", "Kiki"],
      ["Wunderbar, vielen Dank!", "Kunde"],
    ],
    [
      ["Müller Handwerk, Kiki am Apparat. Was kann ich für Sie tun?", "Kiki"],
      ["Guten Tag, bei uns ist die Steckdose im Wohnzimmer ausgefallen.", "Kunde"],
      ["Seit wann besteht das Problem? Haben Sie den Sicherungskasten überprüft?", "Kiki"],
      ["Seit heute Morgen. Ja, die Sicherung war rausgesprungen, aber wenn ich sie reindrücke, springt sie sofort wieder raus.", "Kunde"],
      ["Das deutet auf einen Kurzschluss hin. Bitte versuchen Sie nicht, die Sicherung erneut einzuschalten. Wir schicken heute noch jemanden vorbei.", "Kiki"],
      ["Oh, das wäre toll. Wann kann der Elektriker kommen?", "Kunde"],
      ["Ich habe einen freien Slot um 14 Uhr. Passt das?", "Kiki"],
      ["Ja, 14 Uhr ist perfekt. Vielen Dank für die schnelle Hilfe!", "Kunde"],
    ],
    [
      ["Kiki hier, Müller Handwerk. Guten Tag!", "Kiki"],
      ["Tag, ich bräuchte einen neuen Einbauschrank für mein Schlafzimmer.", "Kunde"],
      ["Gerne! Haben Sie schon genaue Vorstellungen bezüglich der Maße und des Materials?", "Kiki"],
      ["Ich hätte gerne Eiche, etwa 2 Meter breit und 2,40 Meter hoch. Mit Schiebetüren.", "Kunde"],
      ["Das klingt nach einem schönen Projekt. Ich leite Ihre Anfrage an unseren Schreiner Klaus weiter.", "Kiki"],
      ["Wann könnte er für ein Aufmaß vorbeikommen?", "Kunde"],
      ["Nächste Woche Dienstag oder Mittwoch. Was passt Ihnen besser?", "Kiki"],
      ["Dienstag wäre gut, am besten nachmittags.", "Kunde"],
      ["Perfekt, ich notiere Dienstag, 15 Uhr. Klaus wird sich vorher noch telefonisch melden.", "Kiki"],
    ],
    [
      ["Müller Handwerk, Sie sprechen mit Kiki. Wie kann ich helfen?", "Kiki"],
      ["Hallo, unsere Heizung macht komische Geräusche und wird nicht richtig warm.", "Kunde"],
      ["Welche Art von Heizung haben Sie? Gas oder Öl?", "Kiki"],
      ["Eine Gasheizung, Viessmann, etwa 8 Jahre alt.", "Kunde"],
      ["Haben Sie die letzte Wartung im Blick? Manchmal hilft schon eine Entlüftung der Heizkörper.", "Kiki"],
      ["Die letzte Wartung war vor über einem Jahr. Entlüften habe ich schon versucht.", "Kunde"],
      ["Dann ist es Zeit für eine professionelle Wartung. Ich buche Ihnen einen Termin bei unserem Heizungstechniker.", "Kiki"],
      ["Sehr gut. Wann wäre der nächste freie Termin?", "Kunde"],
      ["Donnerstag dieser Woche, 10 Uhr. Passt das?", "Kiki"],
      ["Ja, Donnerstag passt. Danke!", "Kunde"],
    ],
    [
      ["Guten Tag, Müller Handwerk, Kiki hier.", "Kiki"],
      ["Hallo, nach dem letzten Sturm hat es bei uns durchs Dach geregnet.", "Kunde"],
      ["Oh, das ist natürlich dringend. Wo genau tritt das Wasser ein?", "Kiki"],
      ["Im Dachgeschoss, oberhalb des Schlafzimmers. Es gibt einen nassen Fleck an der Decke.", "Kunde"],
      ["Haben Sie ein Gefäß darunter gestellt? Wir sollten das schnellstmöglich begutachten.", "Kiki"],
      ["Ja, einen Eimer. Aber es tropft ziemlich stark bei Regen.", "Kunde"],
      ["Ich schicke morgen früh unseren Dachdecker Hans vorbei. Er wird den Schaden bewerten und eine Notabdichtung machen.", "Kiki"],
      ["Das wäre fantastisch. Morgen früh ab 8 bin ich zu Hause.", "Kunde"],
    ],
  ];

  const convIndex = Math.floor(Math.random() * conversations.length);
  const conversation = conversations[convIndex];
  const lines: TranscriptLine[] = [];
  let currentTime = 0;

  for (const [text, speaker] of conversation) {
    const wordsArray = text.split(" ");
    const wordDuration = (duration / conversation.length / wordsArray.length);
    const words: TranscriptWord[] = wordsArray.map((word, i) => ({
      word,
      start: currentTime + i * wordDuration,
      end: currentTime + (i + 1) * wordDuration,
    }));

    const lineStart = currentTime;
    const lineEnd = currentTime + wordsArray.length * wordDuration;

    lines.push({
      speaker: speaker as "Kunde" | "Kiki",
      text,
      words,
      startTime: lineStart,
      endTime: lineEnd,
    });

    currentTime = lineEnd + 1.5; // pause between speakers
  }

  return lines;
}

const subjects = [
  "Tropfender Wasserhahn in der Küche",
  "Steckdose im Wohnzimmer defekt",
  "Einbauschrank nach Maß",
  "Heizung wird nicht warm",
  "Dachschaden nach Sturm",
  "Verstopfter Abfluss im Badezimmer",
  "Neue Lichtinstallation im Flur",
  "Türrahmen reparieren",
  "Fußbodenheizung undicht",
  "Dachrinne reinigen",
  "Wand streichen nach Wasserschaden",
  "Badezimmer fliesen",
  "Terrassentür klemmt",
  "Thermostat austauschen",
  "Gartenhaus bauen",
  "Rohrleitungsbruch Keller",
  "FI-Schalter springt raus",
  "Küchenmöbel Reparatur",
  "Heizkörper tauschen",
  "Dachfenster einbauen",
  "Waschbecken montieren",
  "Außenbeleuchtung installieren",
  "Schrank Scharnier kaputt",
  "Warmwasser funktioniert nicht",
  "Schornstein sanieren",
  "Toilettenspülung defekt",
  "Sicherungskasten erneuern",
  "Holztreppe knarrt",
  "Pelletofen anschließen",
  "Regenrinne undicht",
  "Kellerwand feucht",
  "Steckdosen im Kinderzimmer",
  "Einbauregal für Büro",
  "Gastherme piept",
  "Dachziegel lose",
  "Duschkopf austauschen",
  "Dimmer einbauen",
  "Fensterbank erneuern",
  "Fußbodenheizung entlüften",
  "Balkon abdichten",
  "Wandfliesen ersetzen",
  "Lichtschalter wechseln",
  "Treppengeländer wackelt",
  "Heizkörper entlüften",
  "Dachdämmung verbessern",
  "Spülmaschine anschließen",
  "Elektroverteilung prüfen",
  "Einbauküche planen",
  "Heizungspumpe tauschen",
  "Dachgaube reparieren",
];

const summaries = [
  "Kunde meldet einen tropfenden Wasserhahn. Termin für morgen vereinbart.",
  "Steckdose ausgefallen, Sicherung springt. Verdacht auf Kurzschluss. Techniker kommt heute.",
  "Anfrage für Einbauschrank in Eiche mit Schiebetüren. Aufmaß-Termin vereinbart.",
  "Heizung macht Geräusche und wird nicht warm. Wartungstermin gebucht.",
  "Dachschaden nach Sturm, Wasser tritt ein. Nottermin für morgen früh.",
  "Abfluss im Bad verstopft. Rohrreinigung für heute Nachmittag geplant.",
  "Kunde wünscht neue Beleuchtung im Eingangsbereich. Beratungstermin vereinbart.",
  "Türrahmen beschädigt nach Einbruchsversuch. Dringender Reparaturtermin.",
  "Fußbodenheizung im Wohnzimmer undicht. Leckageortung geplant.",
  "Dachrinne voll mit Laub. Reinigungstermin für nächste Woche.",
];

const bulletSets = [
  ["Wasserhahn tropft seit gestern", "Vermutlich defekte Dichtung", "Termin morgen 9:30 Uhr", "Techniker: Thomas Müller"],
  ["Steckdose komplett ausgefallen", "Sicherung springt wiederholt raus", "Kurzschluss vermutet", "Nottermin heute 14 Uhr"],
  ["Einbauschrank 2m x 2,40m gewünscht", "Material: Eiche mit Schiebetüren", "Aufmaß nächste Woche Dienstag 15 Uhr", "Schreiner Klaus meldet sich vorab"],
  ["Gasheizung Viessmann, 8 Jahre alt", "Geräusche und unzureichende Wärme", "Letzte Wartung über 1 Jahr her", "Wartungstermin Donnerstag 10 Uhr"],
  ["Wasser tritt durch Dach ein", "Nasser Fleck im Schlafzimmer", "Notabdichtung erforderlich", "Dachdecker kommt morgen 8 Uhr"],
  ["Abfluss im Bad komplett verstopft", "Hausmittel haben nicht geholfen", "Rohrreinigung nötig", "Termin heute 15:30 Uhr"],
  ["Neue Beleuchtung für Flur und Eingang", "LED gewünscht, mit Dimmer", "Beratungstermin vereinbart", "Elektriker kommt Freitag"],
  ["Türrahmen durch Einbruchsversuch beschädigt", "Schloss muss getauscht werden", "Polizei war vor Ort", "Dringender Termin morgen"],
  ["Fußbodenheizung leckt im Wohnbereich", "Feuchte Stelle auf dem Boden", "Leckageortung mit Wärmebildkamera", "Termin übermorgen 9 Uhr"],
  ["Dachrinne verstopft mit Laub", "Wasser läuft über die Fassade", "Reinigung und Prüfung", "Nächste Woche Montag"],
];

const customerNames = [
  "Markus Braun", "Petra Schneider", "Jürgen Wolf", "Sabine Becker",
  "Wolfgang Hoffmann", "Monika Richter", "Stefan Klein", "Ursula Neumann",
  "Frank Zimmermann", "Brigitte Krüger", "Andreas Hartmann", "Karin Lange",
  "Michael Schwarz", "Helga Meier", "Dieter Werner", "Ingrid Schmitz",
  "Rainer Koch", "Gabriele Schäfer", "Bernd Bauer", "Elisabeth Lorenz",
  "Uwe Hofmann", "Renate Ludwig", "Manfred Möller", "Christa Huber",
  "Helmut Krause", "Heike Scholz", "Gerhard Kaiser", "Martina Fuchs",
  "Peter Herrmann", "Doris Walter", "Herbert König", "Susanne Mayer",
  "Werner Lang", "Angelika Köhler", "Karl Jung", "Gisela Peters",
  "Norbert Müller", "Birgit Frank", "Horst Lehmann", "Ilse Berger",
  "Otto Schreiber", "Ruth Martin", "Friedrich Keller", "Erika Haas",
  "Günter Vogt", "Elfriede Sommer", "Heinz Winter", "Lieselotte Berg",
  "Ernst Fischer", "Hannelore Brandt",
];

const companies = [
  undefined, "Braun Immobilien GmbH", undefined, "Becker & Söhne",
  "Hoffmann Projektbau", undefined, "Klein Architekten", undefined,
  "Zimmermann Hausverwaltung", undefined, undefined, "Lange Wohnbau",
  undefined, "Meier Facility Management", undefined, "Schmitz Immobilien",
  undefined, undefined, "Bauer Bauträger", undefined,
  "Hofmann Development", undefined, undefined, "Huber Gastro",
  undefined, "Scholz Verwaltung", undefined, undefined,
  "Herrmann Hausbau", undefined, undefined, "Mayer Wohnungen",
  "Lang Gewerbe", undefined, undefined, undefined,
  undefined, "Frank Immobilien", undefined, undefined,
  "Schreiber Verwaltung", undefined, undefined, undefined,
  "Vogt Baugruppe", undefined, undefined, undefined,
  "Fischer & Partner", undefined,
];

function randomPhone(): string {
  const prefixes = ["+49 170", "+49 171", "+49 172", "+49 176", "+49 151", "+49 152", "+49 157", "+49 160"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = Math.floor(Math.random() * 9000000 + 1000000);
  return `${prefix} ${num}`;
}

function randomEmail(name: string): string {
  const parts = name.toLowerCase().split(" ");
  const domains = ["gmail.com", "web.de", "gmx.de", "t-online.de", "outlook.de"];
  return `${parts[0]}.${parts[1]}@${domains[Math.floor(Math.random() * domains.length)]}`;
}

const statuses: CallStatus[] = ["erfolgreich", "nicht_erfolgreich", "weitergeleitet"];

export function generateCalls(): Call[] {
  const calls: Call[] = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const hoursAgo = Math.floor(Math.random() * 720); // last 30 days
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    const duration = Math.floor(Math.random() * 540) + 60; // 1-10 minutes
    const statusWeights = Math.random();
    const status: CallStatus = statusWeights < 0.6 ? "erfolgreich" : statusWeights < 0.85 ? "weitergeleitet" : "nicht_erfolgreich";
    const subjectIndex = i % subjects.length;
    const summaryIndex = i % summaries.length;
    const topicIndex = i % topics.length;
    const name = customerNames[i];

    calls.push({
      id: `call-${(i + 1).toString().padStart(3, "0")}`,
      customerName: name,
      customerPhone: randomPhone(),
      customerEmail: randomEmail(name),
      customerCompany: companies[i],
      timestamp,
      duration,
      status,
      subject: subjects[subjectIndex],
      summary: summaries[summaryIndex],
      summaryBullets: bulletSets[summaryIndex],
      employeeAssigned: employees[Math.floor(Math.random() * employees.length)],
      audioUrl: AUDIO_URL,
      transcript: generateTranscript(subjects[subjectIndex], duration),
      topic: topics[topicIndex],
    });
  }

  return calls.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export const dummyCalls = generateCalls();
