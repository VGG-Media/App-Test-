import type { ChaosLevel } from './content'

export interface Chapter {
  id: string
  title: string
  subtitle: string
  terminalLines: string[]
  evidence: Evidence
  choices: Choice[]
  tensionDelta: number
}

export interface Evidence {
  label: string
  type: 'file' | 'audio' | 'image' | 'code' | 'location'
  content: string
  classification: 'TOP SECRET' | 'CLASSIFIED' | 'RESTRICTED' | 'EYES ONLY'
}

export interface Choice {
  id: string
  label: string
  subtext: string
  emoji: string
  justicePoints: number
  tensionPoints: number
  consequence: string
}

export interface Ending {
  id: string
  title: string
  code: string
  description: string
  detail: string
  color: string
  emoji: string
}

export const GHOST_NETWORK_INTRO = {
  title: 'GHOST NETWORK',
  subtitle: 'SIGNAL_VERLOREN.exe',
  flavor: 'Ein kooperatives Mystery-Spiel für entspannte Abende',
  briefing: [
    '> EINGEHENDE VERBINDUNG...',
    '> VERSCHLÜSSELUNG: AES-256 ██████ GEKNACKT',
    '> ABSENDER: E.VASQUEZ@[REDACTED]',
    '> ZEITSTEMPEL: 72 STUNDEN VOR LETZTEM BEKANNTEN SIGNAL',
    '> ',
    '> Wenn ihr das lest, bin ich weg.',
    '> Ich habe etwas gefunden, das nicht gefunden werden sollte.',
    '> KRONOS ist real. Das Protokoll läuft.',
    '> Findet mich. Oder findet die Wahrheit.',
    '> — E',
    '> ',
    '> [DATEIANHANG: KRONOS_FRAGMENT_001.enc]',
    '> [STANDORT: UNBEKANNT]',
  ],
}

export const chapters: Chapter[] = [
  {
    id: 'chapter_1',
    title: 'KAPITEL 01',
    subtitle: 'ERSTE_SPUR.log',
    terminalLines: [
      '> ANALYSE VON KRONOS_FRAGMENT_001.enc...',
      '> ENTSCHLÜSSELUNG: 34% ████░░░░░░',
      '> PARTIELLE DATEN WIEDERHERGESTELLT:',
      '> — Projekt: KRONOS PROTOKOLL',
      '> — Status: PHASE 3 AKTIV',
      '> — Ziel: [████ REDACTED ████]',
      '> — Letzte bekannte Position: 52.5200°N, 13.4050°E [BERLIN]',
      '> ',
      '> WARNUNG: Aktivitäten auf Elenas letztem Gerät',
      '> → Jemand hat versucht, ihre Festplatte zu löschen.',
      '> → Backup-Fragment wurde auf einem Darknet-Server gesichert.',
      '> → Server-Standort: Unbekannt. IP verschleiert.',
      '> ',
      '> Ihr habt zwei Optionen...',
    ],
    evidence: {
      label: 'DATEI: elena_backup_shard.enc',
      type: 'code',
      classification: 'TOP SECRET',
      content: `FRAGMENT [3/7]:
"...sie wissen nicht, dass ich alles dokumentiert habe.
Das KRONOS-Protokoll ist keine Theorie — es ist ein aktives
Überwachungsprogramm. Ziel: 40.000 Zielpersonen in 12 Ländern.
Die Beauftragten nennen sich D-7. Ich habe Namen.
Wenn ihr das lest — prüft das Datum: [████].
Der Schlüssel liegt im Datum. Vertraut niemandem mit
einer '7' in der Kennung."

> METADATEN: Erstellt 03:47 Uhr, 72h vor Verschwinden
> GERÄTE-ID: VAS_PRO_X1 [LETZTE AKTIVITÄT]`,
    },
    choices: [
      {
        id: 'c1_trace',
        label: 'Digitale Spur sofort verfolgen',
        subtext: 'Riskant, aber schnell. Ihr könntet entdeckt werden.',
        emoji: '⚡',
        justicePoints: 2,
        tensionPoints: 3,
        consequence: 'Ihr findet den Backup-Server — aber aktiviert einen Alarm. Jemand weiß, dass ihr sucht.',
      },
      {
        id: 'c1_safe',
        label: 'Langsam und unsichtbar vorgehen',
        subtext: 'Sicher, aber die Zeit läuft. Elena könnte nicht mehr viel Zeit haben.',
        emoji: '🕶️',
        justicePoints: 1,
        tensionPoints: 1,
        consequence: 'Kein Alarm, aber ein weiteres Datenfragment geht verloren. KRONOS löscht aktiv.',
      },
    ],
    tensionDelta: 0,
  },

  {
    id: 'chapter_2',
    title: 'KAPITEL 02',
    subtitle: 'DATENSCHATTEN.sys',
    terminalLines: [
      '> SERVER LOKALISIERT: NODE_47 [TOR RELAY — OSTBERLIN]',
      '> INFILTRATION: ████████████ 100%',
      '> ',
      '> DATEN-DUMP LÄUFT...',
      '> → Elenas komplette Korrespondenz: 3 MONATE',
      '> → Letzte Nachricht: AN "CIPHER" — unbekannter Kontakt',
      '> → Inhalt: "D-7 weiß von mir. Ich brauche Extraktion."',
      '> ',
      '> CIPHER ist ein Informant. Identität unbekannt.',
      '> Server-Logs zeigen: CIPHER hat Elena geholfen, Daten zu sichern.',
      '> Aber: CIPHER hat auch Zugang zu KRONOS-internen Systemen.',
      '> ',
      '> FRAGE: Ist CIPHER ein Freund — oder D-7s Maulwurf?',
      '> ',
      '> Ihr habt eine Kontaktmöglichkeit gefunden...',
    ],
    evidence: {
      label: 'KORRESPONDENZ: cipher_exchange.msg',
      type: 'file',
      classification: 'CLASSIFIED',
      content: `[VERSCHLÜSSELT — SIGNAL-PROTOKOLL]

CIPHER → VASQUEZ [68h vor Verschwinden]:
"Ich habe alles arrangiert. Geh zur Adresse im Anhang.
Vertrau niemandem von D-7. Besonders nicht #D-7-114."

VASQUEZ → CIPHER [67h vor Verschwinden]:
"Wie kann ich dir vertrauen? Du hast Zugang zu KRONOS."

CIPHER → VASQUEZ [67h vor Verschwinden]:
"Weil ich derjenige bin, der dieses System zerstören will.
#D-7-114 hat meine Familie. Ich habe keine Wahl mehr."

[LETZTE NACHRICHT — CIPHER]:
"Sie kommen. Aktiviere Protokoll GHOST."

> STATUS: LETZTE VERBINDUNG 71h 23min AGO`,
    },
    choices: [
      {
        id: 'c2_contact',
        label: 'CIPHER kontaktieren',
        subtext: 'Risikoreich — könnte eine Falle sein. Aber könnte Elenas Standort enthüllen.',
        emoji: '📡',
        justicePoints: 3,
        tensionPoints: 4,
        consequence: 'CIPHER antwortet. Kurze Nachricht: "NODE_22 — Macht es schnell. Sie sind überall."',
      },
      {
        id: 'c2_solo',
        label: 'Ohne CIPHER weiterermitteln',
        subtext: 'Langsamer, aber keine Exposition. Vertraut nur euren eigenen Daten.',
        emoji: '🔒',
        justicePoints: 2,
        tensionPoints: 2,
        consequence: 'Ihr findet KRONOS-Finanzströme. Eine Briefkastenfirma in Luxemburg: HELIOS SEVEN GmbH.',
      },
    ],
    tensionDelta: 1,
  },

  {
    id: 'chapter_3',
    title: 'KAPITEL 03',
    subtitle: 'VERRAT.exe — INTRUSION DETECTED',
    terminalLines: [
      '> !! WARNUNG: EINGEHENDE VERBINDUNG AUF EUREM KANAL !!',
      '> !! UNBEKANNTE IP — ROUTING ÜBER 14 LÄNDER !!',
      '> ',
      '> [UNBEKANNT]: "Ihr seid tief genug eingetaucht."',
      '> [UNBEKANNT]: "Jemand in eurer Gruppe ist kein Unbekannter für uns."',
      '> [UNBEKANNT]: "Agent #D-7-114 hat eine neue Aufgabe erhalten."',
      '> ',
      '> VERBINDUNG GETRENNT.',
      '> ',
      '> Stille.',
      '> ',
      '> Wer ist D-7-114?',
      '> Analyse der letzten 48h eurer Aktivität zeigt:',
      '> → Zwei Zugriffe auf GHOST-NETWORK-Protokolle von INNEN',
      '> → Zeitpunkt: Als ihr alle "offline" wart',
      '> → Einer von euch hat Zugang zu D-7-Terminals',
      '> ',
      '> Das Misstrauen beginnt...',
    ],
    evidence: {
      label: 'LOG: intrusion_analysis.sys',
      type: 'code',
      classification: 'EYES ONLY',
      content: `ZUGRIFFS-PROTOKOLL [GHOST-NETWORK-INTERN]:

ZUGRIFF #1: 04:12 Uhr
> TERMINAL-ID: GN-09
> DATEI: kronos_evidence_cache
> AKTION: READ — kein Alarm ausgelöst

ZUGRIFF #2: 04:47 Uhr
> TERMINAL-ID: GN-09
> DATEI: cipher_contact_point
> AKTION: COPY → [EXTERNE IP]
> EXTERNE IP: [█████████ REDACTED █████████]

GN-09 NUTZER-LOG: [3 Zeichen GELÖSCHT]

> D-7 KENNUNG ÜBEREINSTIMMUNG: #D-7-114
> KONFIDENZ: 94.7%
>
> "Das System lügt nicht. Menschen lügen."
> — E.VASQUEZ, LETZTER EINTRAG`,
    },
    choices: [
      {
        id: 'c3_confront',
        label: 'Den Verdächtigen konfrontieren',
        subtext: 'Sprecht es als Gruppe aus. Könnte die Mission sprengen — oder retten.',
        emoji: '🎭',
        justicePoints: 4,
        tensionPoints: 5,
        consequence: 'Dramatische Stille. Dann: Eine Geständnis-Nachricht. GN-09 war erpresst. Nicht freiwillig.',
      },
      {
        id: 'c3_isolate',
        label: 'Verdächtigen informationstechnisch isolieren',
        subtext: 'Stiller, professioneller. Kein Konflikt. Aber das Vertrauen ist gebrochen.',
        emoji: '🔇',
        justicePoints: 2,
        tensionPoints: 2,
        consequence: 'GN-09 merkt es. Sendet nur: "Ihr habt recht. Es tut mir leid. Elena ist in NODE_22."',
      },
    ],
    tensionDelta: 2,
  },

  {
    id: 'chapter_4',
    title: 'KAPITEL 04',
    subtitle: 'KRONOS_CORE — ZUGANG ERLANGT',
    terminalLines: [
      '> NODE_22 LOKALISIERT: UNTERIRDISCHES RECHENZENTRUM',
      '> STANDORT: [REDACTED], THÜRINGEN',
      '> ',
      '> VERBINDUNG ZU KRONOS-HAUPTSERVER HERGESTELLT',
      '> DATEN-DUMP: 847 GB — LÄDT...',
      '> ',
      '> WAS IHR FINDET, ÄNDERT ALLES:',
      '> → 40.000 Ziel-Profile: Journalisten, Aktivisten, Wissenschaftler',
      '> → Auftraggeberliste: 7 Regierungsbehörden, 3 Konzerne',
      '> → PHASE 4 geplant: Aktive Eliminierung, nicht nur Überwachung',
      '> ',
      '> Elena ist hier. Vitaldaten: STABIL.',
      '> Aber: D-7 weiß, dass ihr im System seid.',
      '> IHR HABT 8 MINUTEN.',
      '> ',
      '> Elena befreien ODER Daten sichern?',
      '> Beides gleichzeitig ist nicht möglich.',
    ],
    evidence: {
      label: 'DATEI: kronos_protokoll_KOMPLETT',
      type: 'file',
      classification: 'TOP SECRET',
      content: `KRONOS PROTOKOLL — VOLLVERSION [AUSZUG]

PHASE 1: Identifikation [ABGESCHLOSSEN]
→ 40.247 Zielpersonen in 12 EU-Staaten

PHASE 2: Überwachung [ABGESCHLOSSEN]
→ 24/7 Echtzeit-Monitoring aller Kommunikation
→ Finanzielle Bewegungen: VOLLSTÄNDIG ERFASST

PHASE 3: Isolation [AKTIV]
→ Berufliche und soziale Sabotage
→ Psychologische Destabilisierung
→ [#D-7-114 zuständig für Zone CENTRAL]

PHASE 4: NEUTRALISIERUNG [STARTDATUM: ████]
→ Methode: [██████ REDACTED ██████]
→ Beauftrage Einheiten: ██ bereit
→ Genehmigung: DIRECTOR HARMON — SIGNIERT

NOTIZ: "Projekt KRONOS darf unter keinen Umständen
öffentlich werden. Koste es, was es wolle."
— D.HARMON, UNTERZEICHNET`,
    },
    choices: [
      {
        id: 'c4_elena',
        label: 'Elena sofort befreien',
        subtext: 'Daten bleiben zurück. Aber Elena lebt. KRONOS auch.',
        emoji: '❤️',
        justicePoints: 3,
        tensionPoints: 3,
        consequence: 'Elena ist frei. Aber KRONOS löscht in Echtzeit. Die Beweise schrumpfen. Phase 4 ist noch nicht gestoppt.',
      },
      {
        id: 'c4_data',
        label: 'Daten sichern und veröffentlichen',
        subtext: 'Elena bleibt in Gefahr. Aber 40.000 Menschen könnten gerettet werden.',
        emoji: '💾',
        justicePoints: 5,
        tensionPoints: 5,
        consequence: 'Die Daten laufen live. Elena sendet eine Notfall-Nachricht: "Ich schaffe es raus. Gebt sie frei."',
      },
    ],
    tensionDelta: 3,
  },

  {
    id: 'chapter_5',
    title: 'KAPITEL 05',
    subtitle: 'NULL_TAG — DIE LETZTE ENTSCHEIDUNG',
    terminalLines: [
      '> DIE WELT HAT 6 STUNDEN AUF EURE DATEN GEWARTET.',
      '> DIRECTOR HARMON LEUGNET ALLES.',
      '> ',
      '> Elena ist in Sicherheit. CIPHER ist untergetaucht.',
      '> Die Medien haben die ersten Fragmente.',
      '> ',
      '> D-7 bietet einen Deal an:',
      '> → "Gebt uns die Master-Kopie zurück."',
      '> → "Wir lassen alle in Ruhe."',
      '> → "PHASE 4 wird nie kommen."',
      '> ',
      '> Glaubt ihr ihnen?',
      '> ',
      '> Die Welt schaut zu.',
      '> GHOST NETWORK muss entscheiden.',
    ],
    evidence: {
      label: 'NACHRICHT: harmon_deal.msg — EINGEHEND',
      type: 'file',
      classification: 'RESTRICTED',
      content: `VON: D.HARMON [VERIFIZIERT]
AN: GHOST_NETWORK [KANAL UNBEKANNT]

"Ihr seid kompetente Leute. Das respektiere ich.

Was ihr gefunden habt, ist komplex. Die Namen auf
dieser Liste sind keine Unschuldigen — das sind
destabilisierende Elemente in einem fragilen System.

PHASE 4 war nie zur Ausführung vorgesehen.
Nur als Druckmittel.

Gebt uns die Master-Kopie. Innerhalb 2 Stunden.
Alles wird gut.

Wenn nicht: Euer aller Leben ändert sich.
Ich meine das nicht als Drohung.
Nur als Realität.

— DH"

> ANALYSE: HARMON LÜGT IN 3 PUNKTEN
> KONFIDENZ-SCORE: 97.2%`,
    },
    choices: [
      {
        id: 'c5_release',
        label: 'Alles veröffentlichen — vollständig',
        subtext: 'Kein Zurück. KRONOS fällt. Aber ihr werdet nie wieder anonym sein.',
        emoji: '🌐',
        justicePoints: 5,
        tensionPoints: 4,
        consequence: 'FINALE: LICHT',
      },
      {
        id: 'c5_deal',
        label: 'Den Deal annehmen',
        subtext: 'Sicherheit für alle. Aber KRONOS überlebt. Und Phase 4 vielleicht auch.',
        emoji: '🤝',
        justicePoints: 1,
        tensionPoints: 1,
        consequence: 'FINALE: SCHATTEN',
      },
    ],
    tensionDelta: 2,
  },
]

export const endings: Record<string, Ending> = {
  LICHT: {
    id: 'LICHT',
    title: 'LICHT_ENDE',
    code: '> MISSION: VOLLSTÄNDIG',
    emoji: '🌅',
    color: '#00ff88',
    description: 'KRONOS wird entlarvt. Director Harmon verhaftet. Die 40.000 Zielpersonen sind frei.',
    detail: `Elena Vasquez taucht 48 Stunden später wieder auf.
Erste Pressekonferenz: "GHOST NETWORK hat das getan, was Institutionen
nicht konnten: die Wahrheit über ein System aufgedeckt, das Schweigen
als Waffe benutzte."

CIPHER: Verbleib unbekannt.
D-7: Aufgelöst.
Phase 4: Wurde nie ausgeführt.

Ihr wart die Dunkelheit, die das Licht eingeschaltet hat.`,
  },
  SCHATTEN: {
    id: 'SCHATTEN',
    title: 'SCHATTEN_ENDE',
    code: '> MISSION: TEILWEISE',
    emoji: '🌙',
    color: '#a000ff',
    description: 'Elena lebt. KRONOS überlebt im Verborgenen. Der Krieg geht weiter — leise.',
    detail: `Der Deal hielt. Für jetzt.

Elena ist in Sicherheit, aber sie schläft nicht mehr gut.
KRONOS läuft unter neuem Namen: PROJEKT HELIOS.
Harmon wurde versetzt, nicht verhaftet.

Manchmal schreibt euch jemand mit einer Kennung, die
ihr nicht kennt. Nur ein Wort: "BALD."

Ihr wisst nicht, ob es eine Drohung ist.
Oder eine Warnung.
Oder eine Einladung.

Die Arbeit ist noch nicht getan.`,
  },
  DUNKEL: {
    id: 'DUNKEL',
    title: 'DUNKEL_ENDE',
    code: '> MISSION: GESCHEITERT — NEUSTART?',
    emoji: '💀',
    color: '#ff0040',
    description: 'KRONOS hat gewarnt. Und gehandelt. Aber sie haben die falsche Person unterschätzt.',
    detail: `Ihr habt verloren. Diesmal.

Elena ist fort — untergetaucht, so tief, dass selbst ihr
kein Signal mehr empfangt.

Aber sie hat etwas hinterlassen:
Ein weiteres Fragment. Verschlüsselt. Mit einem Datum.
Einem zukünftigen Datum.

"Wenn ihr das lest — der Kampf hat gerade erst begonnen.
GHOST NETWORK stirbt nicht.
Es verschwindet nur kurz."

Irgendwo läuft ein Server.
Irgendwo wartet eine Nachricht.

Die Nacht gehört denen, die im Dunkeln arbeiten.`,
  },
}
