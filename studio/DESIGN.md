---
name: Agents of Change
description: A field notebook where young people pick a real problem from a local group and show, page by page, how they worked with AI to help.
colors:
  ink: "#1d2b3a"
  ink-2: "#3e4a57"
  muted: "#5a6470"
  highlighter: "#e4f26a"
  highlighter-soft: "#f3f8c9"
  pencil: "#b23c17"
  leaf: "#2f7a45"
  paper: "#f6f1e6"
  card: "#fffdf8"
  shade: "#efe9dc"
  line: "#1d2b3a1f"
  line-strong: "#1d2b3a5c"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(44px, 5.4vw, 80px)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(36px, 4.2vw, 56px)"
    fontWeight: 600
    lineHeight: 1.05
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.15
  quote:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "19px"
    fontWeight: 400
    fontStyle: "italic"
    lineHeight: 1.4
  body:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.35
  pencil:
    fontFamily: "Caveat, cursive"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.1
rounded:
  input: "8px"
  panel: "10px"
  dialog: "12px"
  pill: "999px"
spacing:
  gutter-phone: "16px"
  gutter: "32px"
  block: "30px"
components:
  button-go:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "48px"
  button-go-big:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "56px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "48px"
  problem-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "12px 2px"
  problem-row-hover:
    backgroundColor: "{colors.highlighter-soft}"
  filter-on:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    height: "42px"
  input:
    backgroundColor: "#fffefb"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    padding: "12px 16px"
  panel:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
  launch-band:
    backgroundColor: "{colors.highlighter}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
---

# Design System: Agents of Change

## Overview

**Creative North Star: "A field notebook"**

Everything a future builder sees should feel like a notebook someone carries to a community group: ink drawings, notes in red pencil, a highlighter for what's been chosen, all on dotted paper. The person working is present on the page. Their notes sit beside the drawings, and the record at the end reads like the notebook's last pages, written up.

Key characteristics:

- Ink line drawings of people doing things (Open Doodles by Pablo Stanley, CC0), one per group, plus one for the hero and one for the empty Make page.
- A warm serif for titles over a highly legible reading face, with a handwritten face only for short notes.
- Ink is the thing you press. Highlighter marks what's chosen or current. Red pencil is the voice of the person working.
- Dotted paper everywhere, with white panels laid on it for working.

## Colors

A small palette: ink and paper, one highlighter, one red pencil.

### Primary
- **Ink** (ink): text, line drawings, the main button, the selected filter, focus rings, the record's masthead.
- **Highlighter** (highlighter): the current step, the "ready to go" dot, the highlighted words in a headline, the chosen signup row, the launch panel on the Brief, the latest version badge in the record. Always with ink text.

### Secondary
- **Red pencil** (pencil): handwritten notes only (the hero's notes, "ready to go", "Next", dialog tags). Darkened to pass contrast on paper. Never a button or a link.
- **Leaf** (leaf): the "Saved" status only.

### Neutral
- **Paper** (paper): the page ground, always with the dot grid (`--ac-dots`, 1px dots every 26px).
- **Card** (card): panels laid on the paper: blocks, contact, versions, side cards.
- **Shade** (shade): hover on quiet things, the record's footer, empty thumbnails.
- **Ink-2, Muted** (ink-2, muted): secondary text and labels.
- **Line, Line-strong** (line, line-strong): ruled lines between problems, input borders.

### Named Rules
**The One Ink Button Rule.** Each screen has one filled ink button that matters most. Others are outline pills.

**The Highlighter Means Chosen Rule.** Highlighter marks what's current, chosen or ready. It never decorates something the person hasn't picked or reached.

## Typography

**Display Font:** Fraunces 600 (with Georgia)
**Quote Font:** Fraunces 400 italic
**Body Font:** Atkinson Hyperlegible
**Note Font:** Caveat 700

**Character:** Fraunces is a warm, slightly old-style serif that reads like a printed field guide. Atkinson Hyperlegible was designed for low-vision readers and keeps every form field and paragraph plain to read. Caveat is a pencil note in the margin.

### Hierarchy
- **Display** (600, clamp(44px, 5.4vw, 80px), 1.02): the landing headline, with the last words highlighted.
- **Headline** (600, clamp(36px, 4.2vw, 56px)): stage titles.
- **Title** (600, 24px to 27px): card and block titles.
- **Quote** (400 italic, 19px): a contact speaking in their own words.
- **Body** (400, 16px, 1.55): everything a person reads or types.
- **Label** (700, 14px to 15px): field labels, button text, dt.
- **Pencil** (Caveat 700, 20px to 30px): handwritten notes.

### Named Rules
**The Short Notes Rule.** Caveat is for notes of a few words. Never a paragraph, a label or a button.

**The Emphasis Is Highlighter Rule.** Headline emphasis is a highlighter stroke behind the words, not italic and not a second colour.

## Layout

Content sits in a 1240px column with 32px gutters (16px on phones). The landing is a two-column hero (copy and the annotated drawing) that stacks below 1100px; below 820px the order is headline, drawing, lede, buttons. Group cards are notebook entries with no box: drawing, name, what they do, the contact's quote, then a ruled list of problems. The bring-your-own card spans the full width with a dashed rule under it.

## Elevation & Depth

Mostly flat, like paper. Panels lift a little off the page so the working area reads as a sheet laid on the notebook.

### Shadow Vocabulary
- **Panel** (`0 1px 2px #1d2b3a14, 0 12px 26px -20px #1d2b3a80`): blocks, versions, side cards.
- **Press** (`0 1px 1px #1d2b3a1f, 0 8px 16px -10px #1d2b3a99`): the main button at rest.
- **Pressed** (`inset 0 2px 4px #0000004d`): any button while held.

### Named Rules
**The Paper Stays Flat Rule.** Group cards on the board have no box or shadow. Only working panels lift.

## Shapes

Pills for buttons, chips and filters. 8px for inputs, 10px for panels, 12px for dialogs. Step discs and problem dots are slightly uneven circles (`border-radius: 52% 48% 50% 46%`) so they look drawn.

## Components

### Buttons
- **Go:** ink pill with paper text and the press shadow.
- **Quiet:** transparent pill with a 1.6px ink ring; hover fills with soft highlighter.
- **Hover / Active:** lifts 2px on hover; sinks 1px with an inset shadow while pressed. Focus shows a 3px ink outline.

### Problem rows
The clickable unit of the board: one problem in the group's own words, on a ruled line with a drawn dot and an arrow. A ready problem has a highlighter dot and "ready to go" in red pencil. Hover sweeps a highlighter stroke across the row.

### Chips and filters
Outline pills. A selected filter is filled ink with paper text.

### Cards
- **Board entries:** no box. The group's drawing, then name and logo, what they do, the contact's quote in Fraunces italic, and "Problems they'd like help with" in red pencil above the ruled list.
- **Working panels:** card colour, 10px radius, a 1px line ring and the panel shadow.

### Inputs / Fields
White on paper, a 1.6px line-strong border, 8px radius. Focus: ink border and a 4px highlighter ring. Labels are bold body text above the field.

### Navigation
A sticky paper header with a 1.5px ink rule under it: the wordmark, the group's name, and three stage buttons with drawn number discs. The current stage is a highlighter pill with an ink disc. On phones the stages take the second row.

### Drawings
`Doodle` in `src/Sketch.tsx` shows a group's drawing from `public/doodles/<group id>.svg` (falls back to `own.svg`). `HeroSketch` is the landing drawing with four red-pencil notes and arrows. The drawings are Open Doodles (CC0) pre-rendered with ink #1d2b3a and highlighter #e4f26a. A new group needs a new drawing: render another Open Doodle with the same two colours, or draw one in the same line style.

## Do's and Don'ts

### Do:
- **Do** keep one filled ink button per view.
- **Do** use highlighter only for what's chosen, current or ready.
- **Do** keep pencil notes to a few words.
- **Do** keep the dot grid on the page ground.
- **Do** give every new group a drawing in ink and highlighter.

### Don't:
- **Don't** use red pencil for buttons, links or anything you press.
- **Don't** set paragraphs in Caveat or use it below 20px.
- **Don't** put a box or shadow round board entries.
- **Don't** add a second accent colour. Groups are told apart by their drawings, not tints.
- **Don't** add sparkles, glows or gradients that suggest AI is doing something special.
