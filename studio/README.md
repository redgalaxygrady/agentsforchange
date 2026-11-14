# Agents for Change workspace

A Vite + React + TypeScript app. It runs entirely in the browser.

## Run

Requires Node 22.12 or newer. From this directory:

```sh
npm ci
npm run dev        # http://127.0.0.1:5173
npm test           # Vitest
npm run typecheck  # TypeScript, the only static check
npm run build      # type checks, then builds static files into dist/
```

## How it's put together

- `src/orgs.ts`: the groups on the board (their work, contact, quote and problems), which brief a project gets, and the lighter brief for any problem that isn't built out or for a group the future builder brings.
- `src/brief.ts`: the one built-out brief (Harbourside Food Rescue): its task, the week of donations, the fact-check sources, the AI ground rules and the record labels.
- `src/Launchpad.tsx`: the shell. It holds the project state, saving, the brief dialog and the stages.
- `src/BoardStage.tsx`: the landing board of groups and their problems. `src/StartStage.tsx`, `src/MakeStage.tsx`, `src/RecordStage.tsx`: Brief, Make & try and Your record.
- `src/launchModel.ts`: project state, saving and loading, and the AI brief.
- `src/RecordDocument.tsx`, `src/recordExport.tsx`: the record, both in the app and as the downloaded page.
- `src/Brand.tsx`, `src/brand.css`: the thumbprint mark and wordmark. `src/Clay.tsx` is the SVG lighting filter that makes drawings look like modelling clay, and `src/Town.tsx` is the clay town on the landing page, one piece per group. `src/Logos.tsx` holds the groups' invented logos and `src/Contact.tsx` their people. `src/base.css` and `src/launch.css` hold the rest of the styles. The look is written up in `DESIGN.md`.

## Changing the groups

For a real sprint, replace the groups in `src/orgs.ts` with real local ones, and the built-out brief in `src/brief.ts` with the material one of them provides. A contact's headshot goes in `public/people/{group-id}.jpg`; without one, the card shows their initials. Each group also has an invented logo in `src/Logos.tsx` and a clay piece in `src/Town.tsx`, both keyed by its id. `tests/briefSwap.test.tsx` runs every screen with a practice group and brief, to prove nothing from the live brief is built into the workspace.

Every group on the board now is a practice example: Harbourside Food Rescue, Raewyn, the week of donations and the other five groups are made up, and the page says so.

## Data

- Project work saves in this browser's localStorage (`agents-for-change.project.v1`), with screenshots in IndexedDB. Nothing is uploaded, and browsers can clear it, so future builders download their record at the end of each session.
- The app never calls an AI model. The AI brief goes to the tool the future builder chooses, as they wrote it.

## Hosting

Vercel builds the `studio/` folder using `vercel.json`: `npm ci`, then `npm test && npm run build`, serving `dist/`.
