# PROJ-3: Foto-Upload

## Status: Planned
**Created:** 2026-02-27
**Last Updated:** 2026-02-27

## Dependencies
- Requires: PROJ-2 (Fotospot einreichen) – Upload erfolgt als Teil des Einreich-Formulars

## User Stories
- Als Nutzer möchte ich beim Einreichen eines Spots bis zu 5 Fotos hochladen können, damit der Spot gut visualisiert wird.
- Als Nutzer möchte ich eine Vorschau meiner hochgeladenen Fotos sehen bevor ich einreiche.
- Als Nutzer möchte ich ein Hauptfoto festlegen können, das auf der Listenansicht angezeigt wird.
- Als Nutzer möchte ich über den Fortschritt des Uploads informiert werden.

## Acceptance Criteria
- [ ] Drag & Drop Upload-Bereich im Einreich-Formular
- [ ] Max. 5 Fotos pro Spot
- [ ] Erlaubte Formate: JPG, PNG, WebP
- [ ] Max. Dateigröße: 10 MB pro Bild
- [ ] Vorschau der hochgeladenen Bilder im Formular
- [ ] Erstes hochgeladenes Bild = Titelbild (umsortierbar)
- [ ] Upload-Fortschrittsanzeige
- [ ] Fotos werden in Supabase Storage gespeichert (Bucket: `spot-photos`)
- [ ] Fehler bei unerlaubtem Dateiformat oder zu großer Datei: klare Fehlermeldung
- [ ] Hochgeladene Bilder sind über öffentliche URL abrufbar
- [ ] Auf Detailseite: Foto-Galerie mit Klick zum Vergrößern (Lightbox)

## Edge Cases
- Was wenn ein Upload fehlschlägt? → Fehlermeldung pro Datei, andere bleiben erhalten
- Was wenn Nutzer mehr als 5 Fotos versucht hochzuladen? → 6. Bild abgelehnt mit Hinweis
- Was wenn kein Foto hochgeladen wird? → Spot kann trotzdem eingereicht werden (Foto optional)
- Was wenn der Browser kein Drag & Drop unterstützt? → Klassischer Datei-Auswahl-Button als Fallback
- Was wenn Supabase Storage nicht erreichbar? → Fehlermeldung, Spot-Einreichung trotzdem ermöglichen (ohne Fotos)

## Technical Requirements
- Supabase Storage Bucket: `spot-photos` (public)
- Dateinamen: UUID-basiert um Konflikte zu vermeiden
- Bilder über Supabase CDN ausliefern
- Client-seitige Größenprüfung vor Upload

---
## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
