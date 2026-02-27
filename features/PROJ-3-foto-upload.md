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

### Komponenten-Struktur

```
PhotoUploader (in SubmitForm eingebettet)
+-- Drag & Drop Bereich
|   +-- Icon + Hinweistext ("Fotos hier hinziehen oder klicken")
|   +-- Datei-Auswahl-Button (Fallback)
|
+-- Vorschau-Grid (nach Upload)
    +-- FotoVorschau [wiederholt, max. 5]
        +-- Vorschaubild (thumbnail)
        +-- Löschen-Button (×)
        +-- "Titelbild"-Badge (erstes Foto)
        +-- Fortschrittsbalken (während Upload)
        +-- Fehlerstatus (wenn Upload fehlschlägt)

PhotoGallery (auf Detailseite)
+-- Hauptbild (groß)
+-- Thumbnail-Reihe (weitere Fotos)
+-- Lightbox (öffnet beim Klick, Vollbild)
```

### Upload-Ablauf

```
Nutzer wählt Datei(en) aus / zieht sie in den Bereich
        ↓
Client prüft: Format (JPG/PNG/WebP) + Größe (max. 10 MB) + Anzahl (max. 5)
        ↓ (bei Fehler → Fehlermeldung direkt im UI)
Datei wird direkt an Supabase Storage hochgeladen
Fortschrittsbalken zeigt Upload-Status
        ↓
Supabase gibt öffentliche URL zurück
URL wird in der Formular-State gespeichert
        ↓
Beim Einreichen des Spots → URLs mit den Spot-Daten gespeichert
```

### Speicherstruktur in Supabase Storage

```
Bucket: spot-photos (öffentlich zugänglich)
Ordnerstruktur: spot-photos/{uuid}/{uuid}-{1..5}.jpg
Beispiel: spot-photos/a3f8.../a3f8...-1.jpg

Zugriff: Öffentliche CDN-URL direkt von Supabase
```

### Tech-Entscheidungen

| Entscheidung | Begründung |
|---|---|
| **Supabase Storage** | Direkt mit der Datenbank verbunden, CDN inklusive, kein separater Dienst nötig |
| **UUID-Dateinamen** | Verhindert Dateinamen-Konflikte und Dateiname-Enumeration |
| **Direkter Browser-Upload** | Schneller als Umweg über den Server, weniger Serverbelastung |
| **Max. 5 Fotos** | Speicherkosten im Free-Tier begrenzen |
| **react-dropzone** | Bewährte Bibliothek für Drag & Drop, gute Browser-Kompatibilität |

### Neue Pakete
- `react-dropzone` – Drag & Drop Datei-Upload UI

### Neue Dateien
- `src/components/PhotoUploader.tsx` – Upload-Komponente mit Vorschau
- `src/lib/storage.ts` – Supabase Storage Hilfsfunktionen

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
