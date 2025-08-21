<<<<<<< HEAD
# Minimalistischer Web-Taschenrechner

Ein einfacher, eigenständiger Taschenrechner (Addition, Subtraktion, Multiplikation, Division) als Single-File Web‑App (`index.html`). Keine externen Abhängigkeiten.

## Nutzung

1. Repository klonen oder Dateien lokal speichern.
2. `index.html` im Browser (Chrome, Firefox, Safari, Edge) öffnen – fertig.
3. Zwei Zahlen eingeben und eine Operation auswählen. Ergebnis erscheint sofort.

## Features
- Vier Grundrechenarten
- Direkte Aktualisierung beim Tippen
- Tastaturkürzel: `+ - * /` zum Wechseln der Operation, `Enter` zum Aktualisieren
- Responsive & Dark-Mode freundlich (via `prefers-color-scheme`)
- Keine externen Skripte, kein Tracking

## Struktur
```
index.html   # Enthält HTML, CSS & JavaScript
README.md    # Diese Anleitung
```

## Lizenz
MIT (optional anpassbar).
=======
# Deutscher Einkommenssteuer-Rechner (vereinfachte Näherung 2024)

Interaktive, clientseitige Web‑App (HTML/CSS/JS) zur überschlägigen Berechnung der deutschen Einkommensteuer für das Jahr 2024. Kein Server, keine Bibliotheken – alles lokal im Browser.

> WICHTIG: Nicht amtlich. Vereinfachte Formeln & Annahmen. Ohne Gewähr!

## Features

- Progressive Einkommensteuer (Grundtarif) nach vereinfachter §32a EStG Formel 2024.
- Grundfreibetrag, Kinderfreibeträge (vereinfachte volle Anrechnung), Werbungskostenpauschale (>= 1.230 €) & Entfernungspauschale.
- Sonderausgaben & außergewöhnliche Belastungen (vereinfachte direkte Minderung des zvE).
- Solidaritätszuschlag mit Freigrenze + vereinfachter linearer Übergang.
- Kirchensteuer (8 % / 9 % optional).
- Netto, Gesamtsteuerlast, effektiver Steuersatz.
- Dynamisches Ergebnis + kleines Tortendiagramm per Canvas ohne externe Lib.
- CSV Export & Drucken (Browser PDF Export).
- Responsive Dark/Light Theme (system preference), Tastatur‑ und Screenreader-freundlich.

## Struktur
```
index.html   # Einstieg + Formular & Ergebnis
styles.css   # Layout & Responsive Styles
script.js    # Logik, Berechnung, Diagramm, Export
README.md    # Diese Datei
```

## Lokale Nutzung
Einfach die `index.html` im Browser öffnen (Doppelklick oder via einfachem Fileserver).

### Optionaler Development Server (z. B. Python)
```bash
python3 -m http.server 8000
# Dann http://localhost:8000 im Browser öffnen
```

## Berechnungslogik (Kurzfassung)
1. Eingaben erfassen.
2. Entfernungspauschale berechnen: 0,30 € bis 20 km, ab 21. km 0,38 €, * Arbeitstage.
3. Werbungskosten: max(benutzer, Pauschale 1.230 €, Entfernungspauschale).
4. Kinderfreibeträge: Anzahl * 9.408 € (volle Anrechnung – real ggf. Aufteilung, sowie Günstigerprüfung mit Kindergeld hier ignoriert).
5. Sonderausgaben & außergewöhnliche Belastungen: direkter Abzug (vereinfachte Annahme, keine zumutbare Eigenbelastung).
6. zvE = Brutto – Summe Abzüge (falls <0 => 0).
7. Einkommensteuer: vereinfachte Parameter/Formeln für 2024 (Zonen). (Nicht alle Rundungen exakt amtlich.)
8. Solidaritätszuschlag: 0 unterhalb Freigrenze ~17.543 € ESt, darüber linearer Übergang bis volle 5,5% (vereinfachte Approximation).
9. Kirchensteuer: Einkommensteuer * 8 % oder 9 %.
10. Gesamtsteuer & Netto (vereinfacht: Brutto – Steuer; Sozialabgaben ignoriert).

## Grenzen / Nicht abgedeckt
- Keine exakte Abbildung aller Detailregelungen (Splittingtarif, Vorsorgeaufwendungen-Höchstbeträge, Günstigerprüfung Kindergeld, außergewöhnliche Belastungen mit zumutbarer Eigenbelastung, progressive Soli-Milderungszone exakte Formel, Altersentlastungsbeträge, Verluste, Kapitalerträge etc.).
- Steuerklassen beeinflussen hier nicht die Jahressteuer (lediglich Info); reale Lohnsteuer differiert.
- Rundungsdifferenzen möglich.

## Barrierefreiheit
- Labels & Fieldsets für semantische Zuordnung.
- Tastaturbedienbar, sichtbarer Fokus.
- ARIA-Live Bereich für Ergebnis.
- Tooltips erscheinen bei Hover und Fokus.

## Export
- CSV: Einfacher Semikolon-getrennter Export der wichtigsten Werte.
- PDF: Browser Druckfunktion (Datei -> Drucken -> Als PDF sichern / Systemdialog).

## Lizenz
MIT (siehe unten). Bitte Haftungsausschluss beachten.

## Mitmachen
Verbesserungen willkommen: Pull Request mit klarer Beschreibung einreichen (z.B. genauere Formeln, Splitting, Tests).

## Haftungsausschluss
Diese Anwendung ersetzt keine steuerliche Beratung. Nutzung auf eigene Verantwortung.

## Lizenztext
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
>>>>>>> c9539d9 (bin)
