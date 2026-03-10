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
  customerRole?: string;
  timestamp: string; // ISO string to avoid hydration issues
  duration: number;
  status: CallStatus;
  subject: string;
  summary: string;
  summaryBullets: string[];
  employeeAssigned: string;
  audioUrl: string;
  transcript: TranscriptLine[];
  topic: string;
  totalCalls: number;
  avgCallTime: string;
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
  "Sanitär", "Elektrik", "Schreinerei", "Heizung",
  "Dachdecker", "Malerei", "Fliesenleger", "Gartenbau",
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateTranscript(convIndex: number, duration: number): TranscriptLine[] {
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

  const conversation = conversations[convIndex % conversations.length];
  const lines: TranscriptLine[] = [];
  let currentTime = 0;

  for (const [text, speaker] of conversation) {
    const wordsArray = text.split(" ");
    const wordDuration = duration / conversation.length / wordsArray.length;
    const words: TranscriptWord[] = wordsArray.map((word, i) => ({
      word,
      start: Math.round((currentTime + i * wordDuration) * 100) / 100,
      end: Math.round((currentTime + (i + 1) * wordDuration) * 100) / 100,
    }));

    const lineStart = Math.round(currentTime * 100) / 100;
    const lineEnd = Math.round((currentTime + wordsArray.length * wordDuration) * 100) / 100;

    lines.push({
      speaker: speaker as "Kunde" | "Kiki",
      text,
      words,
      startTime: lineStart,
      endTime: lineEnd,
    });

    currentTime = lineEnd + 1.5;
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

const roles = [
  "Eigentümer", "Geschäftsführer", "Hausmeister", "Mieter",
  "Eigentümer", "Mieterin", "Architekt", "Eigentümerin",
  "Verwalter", "Eigentümerin", "Eigentümer", "Verwalterin",
  "Mieter", "Geschäftsführerin", "Eigentümer", "Verwalterin",
  "Eigentümer", "Mieterin", "Geschäftsführer", "Mieterin",
  "Geschäftsführer", "Eigentümerin", "Eigentümer", "Geschäftsführerin",
  "Eigentümer", "Verwalterin", "Eigentümer", "Mieterin",
  "Geschäftsführer", "Eigentümerin", "Eigentümer", "Verwalterin",
  "Geschäftsführer", "Mieterin", "Eigentümer", "Eigentümerin",
  "Mieter", "Verwalterin", "Eigentümer", "Mieterin",
  "Verwalter", "Eigentümerin", "Eigentümer", "Mieterin",
  "Geschäftsführer", "Eigentümerin", "Eigentümer", "Mieterin",
  "Geschäftsführer", "Verwalterin",
];

// Deterministic phone numbers
const phones = [
  "+49 170 3847291", "+49 171 9284756", "+49 172 6483920", "+49 176 1928374",
  "+49 151 8374625", "+49 152 7463829", "+49 157 2938475", "+49 160 4827361",
  "+49 170 5928374", "+49 171 3847562", "+49 172 9281746", "+49 176 4738291",
  "+49 151 6283947", "+49 152 8374615", "+49 157 3928471", "+49 160 7284936",
  "+49 170 2847391", "+49 171 5839274", "+49 172 3748291", "+49 176 8293741",
  "+49 151 4738291", "+49 152 6928374", "+49 157 8374629", "+49 160 2938471",
  "+49 170 7382941", "+49 171 4928371", "+49 172 8293746", "+49 176 3847291",
  "+49 151 9284736", "+49 152 3847291", "+49 157 6283947", "+49 160 8374625",
  "+49 170 4738291", "+49 171 2938475", "+49 172 7463829", "+49 176 5928374",
  "+49 151 3847291", "+49 152 9281746", "+49 157 4827361", "+49 160 6483920",
  "+49 170 8293741", "+49 171 3748291", "+49 172 5839274", "+49 176 2847391",
  "+49 151 7382941", "+49 152 4928371", "+49 157 8293746", "+49 160 3847291",
  "+49 170 6283947", "+49 171 8374615",
];

const emails = [
  "markus.braun@gmail.com", "petra.schneider@web.de", "juergen.wolf@gmx.de", "sabine.becker@t-online.de",
  "wolfgang.hoffmann@outlook.de", "monika.richter@gmail.com", "stefan.klein@web.de", "ursula.neumann@gmx.de",
  "frank.zimmermann@t-online.de", "brigitte.krueger@outlook.de", "andreas.hartmann@gmail.com", "karin.lange@web.de",
  "michael.schwarz@gmx.de", "helga.meier@t-online.de", "dieter.werner@outlook.de", "ingrid.schmitz@gmail.com",
  "rainer.koch@web.de", "gabriele.schaefer@gmx.de", "bernd.bauer@t-online.de", "elisabeth.lorenz@outlook.de",
  "uwe.hofmann@gmail.com", "renate.ludwig@web.de", "manfred.moeller@gmx.de", "christa.huber@t-online.de",
  "helmut.krause@outlook.de", "heike.scholz@gmail.com", "gerhard.kaiser@web.de", "martina.fuchs@gmx.de",
  "peter.herrmann@t-online.de", "doris.walter@outlook.de", "herbert.koenig@gmail.com", "susanne.mayer@web.de",
  "werner.lang@gmx.de", "angelika.koehler@t-online.de", "karl.jung@outlook.de", "gisela.peters@gmail.com",
  "norbert.mueller@web.de", "birgit.frank@gmx.de", "horst.lehmann@t-online.de", "ilse.berger@outlook.de",
  "otto.schreiber@gmail.com", "ruth.martin@web.de", "friedrich.keller@gmx.de", "erika.haas@t-online.de",
  "guenter.vogt@outlook.de", "elfriede.sommer@gmail.com", "heinz.winter@web.de", "lieselotte.berg@gmx.de",
  "ernst.fischer@t-online.de", "hannelore.brandt@outlook.de",
];

// Deterministic durations (in seconds) and hour offsets
const durations = [
  183, 325, 192, 407, 278, 200, 346, 512, 156, 337,
  421, 267, 189, 398, 301, 543, 225, 367, 445, 198,
  284, 431, 356, 210, 478, 312, 267, 389, 502, 178,
  345, 256, 412, 298, 367, 189, 434, 278, 523, 201,
  378, 245, 467, 312, 189, 534, 278, 345, 423, 198,
];

const hourOffsets = [
  2, 5, 8, 12, 15, 18, 24, 28, 32, 36,
  42, 48, 52, 56, 60, 72, 78, 84, 96, 108,
  120, 132, 144, 156, 168, 180, 192, 204, 216, 228,
  240, 252, 264, 276, 288, 312, 336, 360, 384, 408,
  432, 456, 480, 504, 528, 552, 576, 600, 648, 696,
];

const statusPattern: CallStatus[] = [
  "erfolgreich", "erfolgreich", "erfolgreich", "nicht_erfolgreich", "erfolgreich",
  "weitergeleitet", "erfolgreich", "erfolgreich", "erfolgreich", "weitergeleitet",
  "erfolgreich", "nicht_erfolgreich", "erfolgreich", "erfolgreich", "weitergeleitet",
  "erfolgreich", "erfolgreich", "nicht_erfolgreich", "erfolgreich", "erfolgreich",
  "erfolgreich", "weitergeleitet", "erfolgreich", "erfolgreich", "nicht_erfolgreich",
  "erfolgreich", "erfolgreich", "weitergeleitet", "erfolgreich", "erfolgreich",
  "nicht_erfolgreich", "erfolgreich", "erfolgreich", "erfolgreich", "weitergeleitet",
  "erfolgreich", "erfolgreich", "erfolgreich", "nicht_erfolgreich", "erfolgreich",
  "weitergeleitet", "erfolgreich", "erfolgreich", "erfolgreich", "erfolgreich",
  "nicht_erfolgreich", "weitergeleitet", "erfolgreich", "erfolgreich", "erfolgreich",
];

const employeeAssignments = [
  0, 1, 2, 3, 4, 0, 1, 2, 3, 4,
  0, 1, 2, 3, 4, 0, 1, 2, 3, 4,
  0, 1, 2, 3, 4, 0, 1, 2, 3, 4,
  0, 1, 2, 3, 4, 0, 1, 2, 3, 4,
  0, 1, 2, 3, 4, 0, 1, 2, 3, 4,
];

const totalCallsPerCustomer = [
  23, 5, 12, 8, 15, 3, 19, 7, 11, 4,
  16, 9, 22, 6, 14, 2, 18, 10, 13, 7,
  20, 4, 17, 8, 11, 3, 15, 6, 21, 5,
  12, 9, 16, 7, 14, 2, 19, 8, 10, 4,
  13, 6, 18, 5, 11, 3, 15, 7, 20, 9,
];

const avgCallTimes = [
  "1:35", "2:10", "3:45", "1:20", "2:55", "4:10", "1:50", "3:20", "2:40", "1:15",
  "3:05", "2:25", "1:45", "3:30", "2:15", "4:00", "1:55", "2:50", "3:15", "1:30",
  "2:45", "1:10", "3:40", "2:05", "1:25", "3:50", "2:35", "1:40", "3:10", "2:20",
  "1:50", "3:25", "2:00", "1:15", "3:35", "2:30", "1:45", "3:00", "2:10", "1:35",
  "2:55", "1:20", "3:45", "2:40", "1:30", "3:15", "2:25", "1:50", "3:05", "2:15",
];

// Use a fixed base date to avoid hydration mismatch
const BASE_DATE = new Date("2026-03-10T14:00:00.000Z");

export function createDummyCalls(): Call[] {
  const calls: Call[] = [];

  for (let i = 0; i < 50; i++) {
    const timestamp = new Date(BASE_DATE.getTime() - hourOffsets[i] * 60 * 60 * 1000);
    const name = customerNames[i];

    calls.push({
      id: `call-${(i + 1).toString().padStart(3, "0")}`,
      customerName: name,
      customerPhone: phones[i],
      customerEmail: emails[i],
      customerCompany: companies[i],
      customerRole: roles[i],
      timestamp: timestamp.toISOString(),
      duration: durations[i],
      status: statusPattern[i],
      subject: subjects[i % subjects.length],
      summary: summaries[i % summaries.length],
      summaryBullets: bulletSets[i % bulletSets.length],
      employeeAssigned: employees[employeeAssignments[i]],
      audioUrl: AUDIO_URL,
      transcript: generateTranscript(i, durations[i]),
      topic: topics[i % topics.length],
      totalCalls: totalCallsPerCustomer[i],
      avgCallTime: avgCallTimes[i],
    });
  }

  return calls;
}

export const dummyCalls: Call[] = createDummyCalls();
