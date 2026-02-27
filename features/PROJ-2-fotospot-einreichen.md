# PROJ-2: Fotospot einreichen

## Status: Planned
**Created:** 2026-02-27
**Last Updated:** 2026-02-27

## Dependencies
- Requires: PROJ-1 (Fotospot-Liste) – Eingereichte Spots erscheinen in der Liste

## User Stories
- Als Fotograf möchte ich anonym (ohne Account) einen neuen Fotospot einreichen, damit ich meine Entdeckungen teilen kann.
- Als Nutzer möchte ich ein übersichtliches Formular mit klaren Feldern sehen, damit das Einreichen einfach ist.
- Als Nutzer möchte ich Foto-Tipps zu meinem Spot hinzufügen (beste Tageszeit, Ausrüstung, Winkel), damit andere Fotografen optimal vorbereitet sind.
- Als Nutzer möchte ich eine Bestätigung nach dem Einreichen erhalten, damit ich weiß dass mein Spot gespeichert wurde.
- Als Nutzer möchte ich Kategorien/Tags vergeben können, damit Spots leichter gefunden werden.

## Acceptance Criteria
- [ ] Formular ist über einen prominenten CTA-Button erreichbar ("Spot einreichen")
- [ ] Pflichtfelder: Name des Spots, Region (Dropdown: Schleswig-Holstein, Hamburg, Bremen, Niedersachsen, Mecklenburg-Vorpommern), Koordinaten (Lat/Lng oder Adresse), Beschreibung
- [ ] Optionale Felder: Beste Tageszeit (Dropdown: Morgens/Goldene Stunde, Mittags, Abends/Blaue Stunde, Nacht), Empfohlene Ausrüstung (Freitext), Foto-Tipps/Winkel (Freitext), Kategorie (Multiselect: Küste, Wattenmeer, Wald, See/Teich, Stadtansicht, Leuchtturm, Sonnenuntergang, Sonstiges)
- [ ] Client-seitige Validierung mit Fehlermeldungen
- [ ] Nach erfolgreichem Einreichen: Erfolgsmeldung + Option zurück zur Liste
- [ ] Formular wird nach Einreichen zurückgesetzt
- [ ] Spots sind sofort nach Einreichen sichtbar (kein Moderation-Schritt im MVP)
- [ ] Spam-Schutz: Honeypot-Feld

## Edge Cases
- Was wenn Koordinaten ungültig sind? → Fehlermeldung mit Beispiel (53.5511° N, 9.9937° E)
- Was wenn der Name bereits existiert? → Warnung, aber Einreichen trotzdem erlauben
- Was wenn das Formular verlassen wird? → Keine Warnung nötig im MVP
- Was bei Netzwerkfehler beim Speichern? → Fehlermeldung + Retry-Möglichkeit
- Was wenn alle Felder leer sind? → Submit-Button disabled bis Pflichtfelder ausgefüllt

## Technical Requirements
- Kein Login / keine Auth erforderlich
- Honeypot-Feld gegen einfache Bots
- Input-Sanitierung serverseitig

---
## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
