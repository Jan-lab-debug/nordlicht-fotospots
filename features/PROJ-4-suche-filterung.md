# PROJ-4: Suche & Filterung

## Status: Planned
**Created:** 2026-02-27
**Last Updated:** 2026-02-27

## Dependencies
- Requires: PROJ-1 (Fotospot-Liste) – Filter wird auf die Liste angewendet

## User Stories
- Als Nutzer möchte ich nach Spotname oder Beschreibung suchen können.
- Als Fotograf möchte ich Spots nach Region filtern (z.B. nur Schleswig-Holstein).
- Als Nutzer möchte ich nach Kategorien filtern (z.B. nur Leuchttürme).
- Als Nutzer möchte ich mehrere Filter gleichzeitig anwenden können.
- Als Nutzer möchte ich Filter schnell zurücksetzen können.

## Acceptance Criteria
- [ ] Suchleiste oben auf der Listenseite (Volltextsuche auf Name + Beschreibung)
- [ ] Filter-Panel: Region (Dropdown), Kategorie (Multiselect), Beste Tageszeit (Multiselect)
- [ ] Filter werden in der URL gespeichert (shareable Links)
- [ ] Anzahl gefundener Spots wird angezeigt
- [ ] "Keine Ergebnisse" State mit Hinweis die Filter zu entfernen
- [ ] Filter-Reset-Button
- [ ] Suche debounced (kein Request bei jedem Tastendruck)

## Edge Cases
- Was wenn Suchbegriff keine Treffer liefert? → Leerer State mit Vorschlag Filter zu entfernen
- Was wenn nur ein Filter aktiv ist? → Trotzdem korrekt angezeigt
- Was bei sehr langen Suchbegriffen? → Max. 100 Zeichen

---
## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
