# Product Requirements Document – Nordlicht Fotospots

## Vision
Nordlicht Fotospots ist eine Community-Plattform für Fotografen und Naturliebhaber, die die schönsten Fotospots in Norddeutschland entdecken und teilen möchten. Nutzer können Spots ohne Account einreichen und mit Beschreibungen, Tipps und Fotos anreichern – ein kollektiver Reiseführer für Fotografen.

## Target Users
**Primär: Hobby- und Profifotografen in Norddeutschland**
- Suchen gezielt nach neuen, unbekannten Locations
- Möchten Tipps zu Licht, Tageszeit und Ausrüstung
- Teilen gerne eigene Entdeckungen mit der Community

**Sekundär: Naturliebhaber & Reisende**
- Suchen nach schönen Orten für Ausflüge
- Weniger technisch versiert, legen Wert auf einfache Navigation

## Core Features (Roadmap)

| Priority | Feature | Status |
|----------|---------|--------|
| P0 (MVP) | PROJ-1: Fotospot-Liste & Detailansicht | Planned |
| P0 (MVP) | PROJ-2: Fotospot einreichen | Planned |
| P0 (MVP) | PROJ-3: Foto-Upload | Planned |
| P1       | PROJ-4: Suche & Filterung | Planned |
| P2       | PROJ-5: Admin-Moderation | Planned |

## Success Metrics
- Anzahl eingereichter Fotospots (Ziel: 20+ in den ersten 4 Wochen)
- Seitenaufrufe pro Spot (Ziel: ø 50 Views/Spot)
- Upload-Erfolgsrate (Ziel: >95% erfolgreiche Foto-Uploads)
- Fehlerrate beim Einreichen (Ziel: <5% abgebrochene Formulare)

## Constraints
- **Timeline:** MVP in 1 Session
- **Budget:** Kostenlose Supabase Free Tier + Vercel Hobby
- **Team:** Solo-Entwicklung mit AI-Unterstützung
- **Tech Stack:** Next.js 16, Supabase (DB + Storage), Vercel, Tailwind CSS, shadcn/ui

## Non-Goals
- Keine User-Authentifizierung im MVP (anonym einreichbar)
- Keine interaktive Kartenansicht im MVP
- Keine Kommentarfunktion
- Keine Social Features (Likes, Follows)
- Keine mobile App
