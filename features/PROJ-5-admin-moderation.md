# PROJ-5: Admin-Moderation

## Status: Planned
**Created:** 2026-02-27
**Last Updated:** 2026-02-27

## Dependencies
- Requires: PROJ-1, PROJ-2, PROJ-3 – Moderiert die eingereichten Spots

## User Stories
- Als Admin möchte ich alle eingereichten Spots in einer Übersicht sehen.
- Als Admin möchte ich Spots genehmigen oder ablehnen können.
- Als Admin möchte ich abgelehnte Spots löschen können.
- Als Admin möchte ich mich mit einem Passwort einloggen.

## Acceptance Criteria
- [ ] Passwortgeschützter Admin-Bereich unter `/admin`
- [ ] Liste aller Spots mit Status (Ausstehend / Genehmigt / Abgelehnt)
- [ ] Genehmigen/Ablehnen Button pro Spot
- [ ] Nur genehmigte Spots erscheinen in der öffentlichen Liste
- [ ] Löschen von Spots inkl. zugehöriger Fotos aus Storage

## Edge Cases
- Was wenn Admin versehentlich einen Spot löscht? → Bestätigungsdialog
- Was bei falschem Passwort? → Fehlermeldung, kein Hinweis auf Existenz des Accounts

---
## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
