# Agents For Change: notes for anyone working on this repo

Agents For Change is a four-week sprint where young people (future builders) build AI-native skills by solving real problems for community partners. This repo is the workspace they use during a sprint. See `README.md` for what it does and `studio/README.md` for how it's built.

## What the workspace has to protect

- **The future builder makes the calls.** AI drafts and suggests; the person decides, checks and owns the result. Never automate away a choice they should make.
- **AI output is never the authority.** Keep sources visible, keep the fact-check kit one click away, and keep the ground rules that stop the AI inventing facts.
- **The record tells the truth.** It shows what the person did, what AI did and what changed. It never fills in reflections, feedback or AI use the person didn't record, and it says "not recorded" instead.
- **It works for any discipline.** Don't assume the future builder can code. A poster, an audio story or a spreadsheet is as good as a website.
- **Real people, real problems.** The board shows local groups and the problems they'd like help with, in their own words. Groups live in `studio/src/orgs.ts` and the built-out brief in `studio/src/brief.ts`.

## How to work

- Keep changes small and reversible. Prefer the simplest thing that works for one sprint over a general platform.
- No accounts, backend or database until a real sprint shows it's needed. Saving stays in the browser, with the downloadable record as the backup.
- Copy is New Zealand English, plain and warm. Say "future builder", "community partner" and "working with AI".

## Before calling something done

From `studio/`, run `npm test`, `npm run typecheck` and `npm run build`, and report only checks that passed.

For anything a future builder sees, also run the app and look at it: the main path, a phone-width screen (390px and 320px), long text in the fields, and the empty and error states it touches.
