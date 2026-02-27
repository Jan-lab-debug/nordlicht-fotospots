# PROJ-1: Fotospot-Liste & Detailansicht

## Status: Planned
**Created:** 2026-02-27
**Last Updated:** 2026-02-27

## Dependencies
- None (Basis-Feature)

## User Stories
- Als Fotograf möchte ich alle Fotospots in einer übersichtlichen Grid-Ansicht sehen, damit ich schnell interessante Locations entdecke.
- Als Nutzer möchte ich auf einen Spot klicken und alle Details sehen (Beschreibung, Foto-Tipps, Fotos, Standort), damit ich die Location gut einschätzen kann.
- Als Nutzer möchte ich auf der Detailseite die GPS-Koordinaten sehen, damit ich den Spot im Navi eingeben kann.
- Als Nutzer möchte ich sehen wann ein Spot eingereicht wurde und welche Kategorie er hat.
- Als mobiler Nutzer möchte ich die Website auf meinem Smartphone gut nutzen können.

## Acceptance Criteria
- [ ] Startseite zeigt alle genehmigten Fotospots als Grid (min. 3 Spalten auf Desktop, 1 auf Mobile)
- [ ] Jede Karte zeigt: Titelbild, Name, Region, Kategorie-Tag
- [ ] Klick auf eine Karte öffnet die Detailseite
- [ ] Detailseite zeigt: Name, Beschreibung, alle Fotos (Gallery), GPS-Koordinaten, Foto-Tipps, beste Tageszeit, empfohlene Ausrüstung, Tags, Einreichungsdatum
- [ ] GPS-Koordinaten sind als Link zu Google Maps verknüpft
- [ ] Leere Felder werden nicht angezeigt (kein "undefined" oder leere Blöcke)
- [ ] Responsive Design: Mobile-first
- [ ] Loading-State beim Laden der Spots
- [ ] Leerer State wenn keine Spots vorhanden: freundliche Nachricht + CTA zum Einreichen

## Edge Cases
- Was wenn ein Spot kein Titelbild hat? → Placeholder-Bild zeigen
- Was wenn die Beschreibung sehr lang ist? → Auf der Listenkarte kürzen (max. 120 Zeichen)
- Was wenn kein Spot in der Datenbank ist? → "Sei der Erste!" Nachricht mit Link zum Einreichen
- Was wenn der Spot nicht gefunden wird (404)? → Eigene 404-Seite
- Was wenn Bilder nicht laden? → Graceful fallback

## Technical Requirements
- Performance: Seite lädt in < 2s (Next.js SSR/SSG)
- SEO: Jede Detailseite hat eigenen Titel + Meta-Description
- Bilder: Optimiert mit next/image

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### Seitenstruktur

```
App Layout (dunkel, dramatisch)
+-- Navigation Bar
|   +-- Logo "Nordlicht" (links)
|   +-- CTA Button "Spot einreichen" (rechts)
|
+-- Home Page (/)
|   +-- Hero Section
|   |   +-- Atmosphärisches Hintergrundbild (Nordsee/Landschaft)
|   |   +-- Headline + Subtext
|   +-- Spot Grid (3 Spalten Desktop / 1 Mobile)
|       +-- SpotCard [wiederholt]
|           +-- Cover-Foto (16:9, next/image optimiert)
|           +-- Name + Region-Badge
|           +-- Kategorie-Tag(s)
|           +-- Beschreibung (gekürzt, max. 120 Zeichen)
|
+-- Spot Detailseite (/spots/[id])
    +-- Hero-Bild (volle Breite)
    +-- Spot-Header (Name, Region, Einreichungsdatum)
    +-- Foto-Galerie (Lightbox beim Klick)
    +-- Info-Bereich
    |   +-- Beschreibung
    |   +-- GPS-Koordinaten (→ Google Maps Link)
    |   +-- Beste Tageszeit
    |   +-- Empfohlene Ausrüstung
    |   +-- Foto-Tipps & Winkel
    +-- Kategorie-Tags
    +-- Zurück-Button
```

### Datenmodell

```
Fotospot:
- id            UUID (automatisch generiert)
- name          Text, max. 200 Zeichen (Pflicht)
- region        Auswahl: Schleswig-Holstein | Hamburg | Bremen |
                Niedersachsen | Mecklenburg-Vorpommern (Pflicht)
- latitude      Dezimalzahl, z.B. 53.5511 (Pflicht)
- longitude     Dezimalzahl, z.B. 9.9937 (Pflicht)
- description   Text, max. 2000 Zeichen (Pflicht)
- best_time     Auswahl: morning | midday | evening | night (optional)
- equipment     Text, max. 500 Zeichen (optional)
- photo_tips    Text, max. 1000 Zeichen (optional)
- categories    Liste von Tags (optional)
- photos        Liste von Foto-URLs (aus Supabase Storage)
- cover_photo   Erstes Foto = Titelbild für die Listenkarte
- created_at    Zeitstempel (automatisch)
- is_approved   true/false (Standard: true für MVP)

Gespeichert in: Supabase PostgreSQL
```

### Tech-Entscheidungen

| Entscheidung | Begründung |
|---|---|
| **Next.js Server Components** | Spots werden serverseitig geladen → schnelle Erstladezeit, gut für Google-Indexierung |
| **Supabase PostgreSQL** | Kostenlos, einfache Integration, kein separater Backend-Server nötig |
| **next/image** | Automatische Bildkomprimierung + Lazy Loading → schnellere Seite |
| **shadcn/ui** | Bereits installiert, dunkles Theme direkt konfigurierbar |
| **Lightbox** | Foto-Galerie mit Vollbild-Ansicht ohne eigene Implementierung |

### Neue Pakete
- `@supabase/supabase-js` – Supabase Datenbankverbindung
- `@supabase/ssr` – Server-seitige Supabase-Abfragen in Next.js
- `yet-another-react-lightbox` – Foto-Galerie Lightbox

### Neue Dateien
- `src/app/page.tsx` – Startseite mit Spot-Grid
- `src/app/spots/[id]/page.tsx` – Spot-Detailseite
- `src/components/SpotCard.tsx` – Wiederverwendbare Karten-Komponente
- `src/components/PhotoGallery.tsx` – Galerie mit Lightbox
- `src/lib/supabase.ts` – Supabase Client-Konfiguration
- `src/app/api/spots/route.ts` – API: Alle Spots abrufen
- `src/app/api/spots/[id]/route.ts` – API: Einzelnen Spot abrufen

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
