---
name: Agents for Change
description: A small town modelled in clay, where young people pick a real problem and show how they worked with AI to help.
colors:
  potters-teal: "#1f5f5b"
  potters-teal-deep: "#164845"
  marigold: "#f3b443"
  marigold-deep: "#b9741b"
  marigold-soft: "#fdf0d3"
  coral: "#ef7a5a"
  plum: "#7b3f63"
  sky: "#8fc3e8"
  leaf: "#2f7a45"
  meadow: "#7fb56c"
  paper: "#eef1ec"
  card-paper: "#fffdf9"
  slip: "#f2f4ef"
  cream: "#fdf8ee"
  ink: "#17302e"
  ink-soft: "#34504c"
  muted: "#556b67"
  line: "#dfe6e0"
  line-strong: "#bccac2"
typography:
  display:
    fontFamily: "Caprasimo, Cooper Black, Georgia, serif"
    fontSize: "clamp(42px, 4.9vw, 70px)"
    fontWeight: 400
    lineHeight: 1.03
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Caprasimo, Cooper Black, Georgia, serif"
    fontSize: "clamp(36px, 4.2vw, 56px)"
    fontWeight: 400
    lineHeight: 1.04
  title:
    fontFamily: "Caprasimo, Cooper Black, Georgia, serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.15
  body:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.35
rounded:
  input: "14px"
  button: "16px"
  button-big: "20px"
  panel: "22px"
  card: "28px"
  band: "32px"
  pill: "999px"
spacing:
  gutter-phone: "16px"
  gutter: "32px"
  card-gap: "28px"
  block: "30px"
components:
  button-go:
    backgroundColor: "{colors.marigold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "0 22px"
    height: "48px"
  button-go-big:
    backgroundColor: "{colors.marigold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button-big}"
    padding: "0 28px"
    height: "58px"
  button-quiet:
    backgroundColor: "{colors.card-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "0 22px"
    height: "48px"
  problem-row:
    backgroundColor: "{colors.slip}"
    textColor: "{colors.ink}"
    rounded: "16px"
    padding: "13px 14px 13px 16px"
  problem-row-hover:
    backgroundColor: "{colors.marigold-soft}"
  chip:
    backgroundColor: "{colors.slip}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "7px 15px"
  filter-on:
    backgroundColor: "{colors.potters-teal}"
    textColor: "{colors.card-paper}"
    rounded: "{rounded.pill}"
    height: "42px"
  input:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    padding: "12px 16px"
  card:
    backgroundColor: "{colors.card-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "26px 24px 24px"
  launch-band:
    backgroundColor: "{colors.potters-teal}"
    textColor: "{colors.cream}"
    rounded: "{rounded.band}"
    padding: "40px 44px"
---

# Design System: Agents for Change

## Overview

**Creative North Star: "Shaped by hand"**

Everything a future builder sees should look like someone made it at a kitchen table: pictures modelled in clay, controls pressed out of clay, reading laid on cut paper. The landing stands on a deep potter's-slip teal with a small clay town on an island in the harbour; every group on the board has its own piece of that town, and there is an empty plot for a group you bring. The working pages (Brief, Make & try, Your record) are pale paper, so the reading is calm, but the clay still turns up in the step discs, the photo frames and the empty state.

The point of the look is the product's point: this is people making useful things for people near them, not software issuing tasks. Warmth comes from material and colour, never from exclamation, sparkle or "magic" AI imagery. Density is generous: one decision per block, one problem per row.

**Key Characteristics:**
- Real SVG lighting for clay (`ac-clay`, `ac-clay-flat`, `ac-clay-sm` in `src/Clay.tsx`), lit from the top left like a model on a table by a window.
- A chunky rolled-clay display face over a highly legible reading face.
- Teal ground for arriving, paper ground for working.
- Marigold is the thing you press.
- Cards sit a little off square on a sheet of their group's colour.

## Colors

A saturated, hand-mixed palette: one deep teal ground, one marigold for action, and a small family of clay colours that name the groups.

### Primary
- **Potter's-slip Teal** (potters-teal): the landing ground, the launch band on the Brief, the selected filter, the "You're working with them" pill and focus rings. Always carries cream text.
- **Marigold Clay** (marigold): the one thing to press on any screen (the main button, the current step, the "Ready to go" pill, ticks on chosen rows). Its darker partner (marigold-deep) draws the thumbprint in the mark.

### Secondary
- **Coral** (coral): the clay ring round a contact's photo, and warm accents in the town.
- **Plum, Sky, Meadow** (plum, sky, meadow): town and illustration colours only. They tint the groups' cards through soft paper tints (see Components).

### Neutral
- **Table Paper** (paper): the page ground for working pages, always with the fine grain.
- **Card Paper** (card-paper): cards, blocks, dialogs, the header.
- **Slip** (slip): problem rows, chips and quiet pills: unfired clay.
- **Cream** (cream): text on teal.
- **Ink, Soft Ink, Muted** (ink, ink-soft, muted): body text, secondary text, metadata.
- **Line, Strong Line** (line, line-strong): dividers and input strokes.

### Named Rules
**The One Marigold Rule.** Each screen has one marigold action that matters most. A second marigold button on the same view means one of them should be quiet.

**The Group Colour Rule.** A group's colour comes from its piece of the town (`TINTS` in `src/Town.tsx`) and is used only as the paper its card sits on and the panel behind its piece. It never colours text or buttons.

## Typography

**Display Font:** Caprasimo (with Cooper Black, Georgia)
**Body Font:** Atkinson Hyperlegible (with system-ui)

**Character:** Caprasimo reads like a word rolled out of clay: soft, heavy and friendly. Atkinson Hyperlegible was designed for low-vision readers and keeps every form field and paragraph plain to read.

### Hierarchy
- **Display** (400, clamp(42px, 4.9vw, 70px), 1.03): the landing headline only, cream on teal, with the last words in marigold.
- **Headline** (400, clamp(36px, 4.2vw, 56px), 1.04): page titles on Brief, Make & try and Your record, and "Problems to solve".
- **Title** (400, 22px to 26px): group names on cards, block headings, version titles, the contact's name.
- **Body** (400, 16px to 19px, 1.6): all reading text, capped near 38em per line, with pretty wrapping.
- **Label** (700, 13px to 15px): buttons, filters, metadata, step names.

### Named Rules
**The Small Labels Stay Plain Rule.** Caprasimo is for 19px and up. Anything smaller, including small headings inside the record preview, uses Atkinson Hyperlegible at 700.

**The No Italic Display Rule.** Caprasimo has no italic. Emphasis in headlines is colour (marigold on teal, teal on paper), never a slanted face.

## Layout

Content sits in a 1240px column with 32px gutters (16px on phones). The landing is a two-column hero (copy and town) that stacks below 1100px; below 820px the headline comes first, then the town, then the lede and button, so clay shows on the first phone screen. Raewyn's band overlaps the hero by 36px. The board is an auto-filling grid of cards at least 340px wide with 28px gaps; the bring-your-own card always spans the full row at the end. Working pages use stacked blocks with 20px between them, and Make & try adds a sticky side column above 1100px. Breakpoints: 1100, 820, 520 and 360px.

## Elevation & Depth

Depth is physical, not digital. Clay pictures get their depth from SVG lighting and a soft cast shadow inside the filter. Buttons and rows are pressed clay: a light inset on top, a darker inset underneath, and a short drop. On press they sink (the shadow turns inward and the element moves down 1px to 2px). Cards and blocks lift gently off the table with one shared soft shadow, and board cards add a solid offset sheet of their group's colour beneath them, like layered cut paper.

### Shadow Vocabulary
- **Table lift** (`0 1px 2px #0c2b291a, 0 14px 30px -16px #0c2b2966`): cards, blocks, dialogs.
- **Pressed clay** (`inset 0 2px 1px #ffffff8c, inset 0 -5px 9px #7a4a0a33, 0 2px 2px #0c2b2926, 0 9px 16px -8px #0c2b2980`): marigold buttons at rest.
- **Pushed in** (`inset 0 4px 9px #7a4a0a4d, inset 0 -1px 1px #ffffff59, 0 1px 1px #0c2b2926`): any pressed control while held.
- **Paper sheet** (`8px 10px 0 -2px <group tint>`): beneath board cards only.

### Named Rules
**The Real Clay Rule.** If it is meant to look modelled, draw it in SVG and give it `filter="url(#ac-clay)"` (or `ac-clay-sm` under 64px). Don't fake clay with stacked CSS gradients. Mount `<ClayDefs/>` once per page; the downloaded record has no defs, so anything shared with the record must not depend on the filter.

## Shapes

Everything is soft and slightly uneven. Inputs are 14px, buttons 16px (20px when big), panels 22px, cards 28px with corners that differ by a few pixels so they look cut by hand, bands 32px, and filters and chips are full pills. Board cards sit off square by up to half a degree and straighten when pointed at; they sit square on phones. No hard corners and no thin outline-only boxes, except the dashed edge that marks something not made yet (the bring-your-own card, the empty plot, the empty version).

## Components

### Buttons
- **Shape:** soft pressed slab (16px, 20px when big), at least 48px tall.
- **Go:** marigold with ink text and the pressed-clay shadow. Grain shows through.
- **Quiet:** card paper with a 1.5px pale stroke drawn as a shadow ring.
- **Hover / Active:** lifts 1px on hover; sinks 2px with an inward shadow while pressed. Focus shows a teal ring.

### Problem rows
The clickable unit of the board: one problem in the group's own words, a slip-coloured row with an arrow (or a "Ready to go" marigold pill). Hover warms it to soft marigold; pressing leaves a thumb-dent that fades.

### Chips and filters
Slip pills with a pale ring. A selected filter turns teal with cream text and sits pressed in.

### Cards
- **Corner Style:** 28px with slightly uneven corners.
- **Background:** card paper with grain over a sheet of the group's tint.
- **Inside:** the group's piece of the town on a tinted panel, the logo and name, what they do, the contact in their own words, then "Problems they'd like help with" as rows.
- **Padding:** 26px 24px 24px (22px 18px 20px on phones).

### Inputs / Fields
- **Style:** white, 2px strong-line stroke, 14px radius, a faint inset.
- **Focus:** teal stroke with a 4px soft teal ring.
- **Long answers:** short answers that can run long (who the work is for) use a textarea that grows with its content.

### Navigation
A sticky paper header with the wordmark, the group's name, and three stage buttons, each with a numbered clay disc. The current stage is a marigold pill with an ink disc. On phones the stages take a full row and shorten their labels. The save status only appears once there is a project.

### Clay ring and clay disc
`ClayRing` presses a thick coral clay ring round a contact's photo (Raewyn on the board and on the Brief). `ClayDisc` is a small clay coin with a number or tick pressed into it, used for step numbers.

### The town
`Town` in `src/Town.tsx` is the landing picture. Each group's piece is a link to its card and lifts when that card is pointed at; `Piece` shows the same piece on the card. New groups need a piece, a crop and a tint.

## Do's and Don'ts

### Do:
- **Do** draw anything meant to look modelled as SVG under the clay filter.
- **Do** keep one marigold action per view.
- **Do** keep problems in the group's own words, one per row.
- **Do** show the honest label that the groups are made up, on the board and in the footer.
- **Do** check every new screen at 390px and 320px with long text in the fields.

### Don't:
- **Don't** use sparkles, asterisks, glowing gradients or any "magic" AI imagery.
- **Don't** use exclamation marks or em dashes in copy.
- **Don't** set Caprasimo below 19px or in italic.
- **Don't** put a small label above a heading. Let the heading say it.
- **Don't** colour text or buttons with a group's tint.
- **Don't** call the problems "jobs".
