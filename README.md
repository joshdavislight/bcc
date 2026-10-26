# Boulder Circus Center website

A lightweight, static website for the Boulder Circus Center, replacing a WordPress + Avada installation.

## Goals

- Hostable from GitHub Pages with no server-side runtime.
- Editable by a human or an LLM using Markdown and JSON files.
- Fast, accessible, and optimized for search engines and AI answer engines.
- Routes visitors to the right registration portal: iClassPro for youth, FitDegree for adults, Skedda for rentals.

## Status

Phase 1 scaffold complete. Design pass and content polish are next.

## Quick start

```bash
npm install
npm run dev
```

Open the URL printed in the terminal.

```bash
npm run check   # validate everything before committing
npm run build   # generate the static site in dist/
```

## Project docs

- `docs/editing.md` — how to add pages and edit content
- `docs/architecture.md` — stack, content flow, build pipeline
- `AGENTS.md` — instructions for AI agents working on this repo

## Key decisions

- **Framework:** Astro 7, static output
- **Hosting:** GitHub Pages, deployed via GitHub Actions
- **Content:** Markdown for pages, JSON for structured data (classes, rooms)
- **CMS:** none — git + GitHub web editor
- **Waiver service:** buy, not build (FlatWaiver lead candidate)
- **Email:** keep HostGator email; add explicit `mail` A record before apex cutover
