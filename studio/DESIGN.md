---
name: Agents for Change
description: A charcoal workspace of rounded-square tiles where young people pick a real problem from a local group and show how they worked with AI to help.
colors:
  ground: "#2B2B2B"
  panel: "#343232"
  panel-2: "#3B3838"
  well: "#232222"
  chalk: "#F1E9E9"
  chalk-2: "#C9C0C0"
  muted: "#B5ACAC"
  placeholder: "#A69D9D"
  lime: "#DBFF00"
  lime-hover: "#E6FF4D"
  on-lime: "#3F4500"
  pink: "#FFB5B5"
  line: "#F1E9E91f"
  line-strong: "#F1E9E952"
  wash: "#F1E9E90f"
  record-ink: "#2B2B2B"
  record-muted: "#5C5555"
  record-card: "#F8F4F4"
  record-shade: "#E8DEDE"
  record-pink: "#F7D4D4"
typography:
  display:
    fontFamily: "Inter Tight Variable, Inter Variable, system-ui, sans-serif"
    fontSize: "clamp(48px, 6vw, 92px)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.034em"
  headline:
    fontFamily: "Inter Tight Variable, Inter Variable, system-ui, sans-serif"
    fontSize: "clamp(40px, 4.8vw, 68px)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Inter Tight Variable, Inter Variable, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  quote:
    fontFamily: "Inter Tight Variable, Inter Variable, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.38
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.35
  small:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  mark: "6px"
  badge: "8px"
  small: "10px"
  control: "12px"
  control-big: "14px"
  inset: "16px"
  bar: "20px"
  panel: "24px"
  feature: "28px"
  tile: "25%"
spacing:
  gutter-phone: "16px"
  gutter: "32px"
  block: "32px"
  section: "56px"
components:
  button-go:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ground}"
    rounded: "{rounded.control}"
    padding: "0 22px"
    height: "48px"
  button-go-big:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ground}"
    rounded: "{rounded.control-big}"
    padding: "0 28px"
    height: "56px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.chalk}"
    rounded: "{rounded.control}"
    padding: "0 22px"
    height: "48px"
  problem-row:
    backgroundColor: "transparent"
    textColor: "{colors.chalk}"
    padding: "13px 4px"
  problem-row-hover:
    backgroundColor: "{colors.wash}"
  filter-on:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ground}"
    rounded: "{rounded.control}"
    height: "42px"
  input:
    backgroundColor: "{colors.well}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.panel}"
  launch-band:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ground}"
    rounded: "{rounded.feature}"
---

# Design System: Agents for Change

## Overview

**Creative North Star: "Tiles on charcoal"**

The look comes straight from the Agents for Change artwork: a charcoal ground, chalk-white type, and rounded-square tiles in lime, pink and chalk, each with a shape cut out so the ground shows through. The tiles stand for the pieces of the work (people, tools, checking, trying), and they turn a quarter when you reach for them. Everything else is quiet: a clean neo-grotesque, dark panels to work in, and one light page at the end, the record, so it prints.

Key characteristics:

- Three tile shapes from the artwork (the bite, the gear and the molecule), drawn from the artwork's own paths in `src/Tiles.tsx`, at quarter-turns.
- Inter Tight for the name and headings, Inter for reading. Medium weight, tight tracking, nothing ornamental.
- Lime is what you press and what's chosen. Pink is people and their words, and the soft alerts.
- Corners are a quarter of the height, like the tiles: 12px on a 48px button, 24px on a panel.

## Colors

The artwork's four colours, plus three charcoal steps for working surfaces.

### Primary
- **Lime** (lime): the main button, the current stage, the selected filter, the chosen problem, the latest version badge, the "Next" label, emphasis in a page title, focus rings, text selection. Always with charcoal text on it. On the lime launch panel, secondary text is on-lime (#3F4500).

### Secondary
- **Pink** (pink): a person's own words (every quote from a contact), the "Check the facts" badge, the version count, and soft alerts (save problems, the "start fresh?" check, the made-up example note). Never a button.

### Neutral
- **Ground** (ground): the page.
- **Panel, Panel-2** (panel, panel-2): working panels, and insets inside them.
- **Well** (well): fields you write into, drop zones, the sheet table, the dialog summary.
- **Chalk, Chalk-2, Muted, Placeholder**: text, from headings down to placeholder. All pass 4.5:1 on every charcoal step.
- **Line, Line-strong, Wash**: rules, outlines on quiet controls, hover fills.

### The record
The record is chalk paper (#F1E9E9) with charcoal ink, a lime band under the masthead, lime on the latest version badge, and pink behind the maker's own words. The mark at its foot is the charcoal tile.

### Named Rules
**The One Lime Button Rule.** Each view has one lime button that matters most. Others are chalk outlines.

**The Lime Means Chosen Rule.** Lime marks what you press, what's current or what's picked. It never decorates something the person hasn't reached.

**The Pink Is People Rule.** Pink carries other people's words and gentle warnings. It is never something you press.

## Typography

**Display and heading font:** Inter Tight (variable), weight 500
**Body font:** Inter (variable, optical sizes)

**Character:** The artwork sets the name in a tight neo-grotesque, and Inter Tight is the closest open match: single-storey g, slanted t terminals, tight fit. Inter carries every paragraph and field, so long answers stay easy to read.

### Hierarchy
- **Display** (500, clamp(48px, 6vw, 92px), 0.98): the landing headline, with the last words in lime.
- **Headline** (500, clamp(40px, 4.8vw, 68px)): stage titles and the board heading.
- **Title** (500, 21px to 28px): group names, block headings, version titles.
- **Quote** (Inter Tight 400, 19px to 42px, pink): a contact in their own words.
- **Body** (400, 16px, 1.55): everything a person reads or types.
- **Label** (600, 14px to 15px): field labels, buttons, filters, dt.

### Named Rules
**The Emphasis Is Lime Rule.** Headline emphasis is the same face in lime. No italics, highlighter strokes or gradient text.

**The No Kicker Rule.** No small labels above headings. A heading carries its own weight.

## Layout

Content sits in a 1240px column with 32px gutters (16px on phones). The landing hero is the headline beside the artwork's 4 by 3 tile grid, with the four how-it-works steps captioned under it; below 820px the order is headline, one row of four tiles, the steps in two columns, lede, button. Group entries are open columns (three tiles, name, what they do, the contact's quote in pink, then their problems as a ruled list), with no box round them. Working pages use dark panels on the ground.

## Elevation & Depth

Depth on charcoal comes from the surface steps (ground, panel, panel-2, well) and thin chalk lines, not from shadows.

### Shadow Vocabulary
- **panel** (`0 20px 40px -28px #000000cc`): the contact card, the own-group form and versions, which lift slightly.
- **dialog** (`0 30px 80px -10px #000000b3`): the brief dialog.
- **paper** (`drop-shadow(0 20px 32px #00000073)`): the light record sitting on the dark page.

### Named Rules
**The Board Stays Flat Rule.** Group entries on the board have no box or shadow. Only working panels lift.

## Shapes

Rounded squares throughout, with the corner a quarter of the side: tiles (25%), avatars (25%), stage numbers, step badges, ticks, problem dots, buttons and fields. No pills and no circles, except the groups' own logos, which are theirs.

## Components

### Buttons
Lime fill with charcoal text for the main action (48px, 12px corners; 56px and 14px for the big one). Quiet buttons are a 1.5px chalk outline that brightens on hover. On the lime launch panel the main button flips to charcoal with lime text. Trailing arrows nudge right on hover.

### Problem rows
A ruled line, a square outline dot that fills lime on hover, the problem in the group's words, and an arrow that turns lime.

### Chips and filters
12px-corner outlines. A selected filter or a pressed chip is lime with charcoal text.

### Cards
Panels are panel (#343232) with 24px corners. Insets inside them (the job note, the Try it area, sources) are panel-2 with 16px to 18px corners.

### Inputs / Fields
Wells (#232222) with a 1.5px line-strong border and 12px corners. Focus: lime border and a soft lime ring. The caret is lime.

### Navigation
A sticky charcoal header with a hairline under it: the tile mark and name, the group's name, and three stage buttons with square number badges. The current stage is lime with a charcoal badge. On phones the stages take the second row.

### Tiles
`Tile` draws one of the three artwork shapes in lime, pink, chalk or charcoal (ink) at a quarter-turn. `HeroTiles` is the landing grid; it turns into place once on load (staggered, from a quarter back) and each tile turns on hover. `OrgTiles` gives each group three tiles, keyed by id in `ORG_TILES`, falling back to a set picked from the id; they turn when you hover the entry. `EmptyTile` is a dashed slot for something of yours: your own group, your first version. All turning stops under reduced motion.

## Do's and Don'ts

### Do:
- **Do** keep one lime button per view.
- **Do** use lime only for what's pressed, chosen or current.
- **Do** put people's words in pink.
- **Do** keep corners at a quarter of the height.
- **Do** give a new group its three tiles in `ORG_TILES`.

### Don't:
- **Don't** use pink for buttons, links or anything you press.
- **Don't** add a kicker or eyebrow above a heading.
- **Don't** put a box or shadow round board entries.
- **Don't** invent new tile shapes; use the artwork's three.
- **Don't** use sparkles, glows, gradient text or any "magic" AI imagery.
