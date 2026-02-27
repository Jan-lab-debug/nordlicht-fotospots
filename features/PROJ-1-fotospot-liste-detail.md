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
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
