/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { FOOD_RESCUE_BRIEF as BRIEF } from '../src/brief';
import { AI_TOOLS, initialLaunch, launchPrompt, newVersion, PREFILL_URL_LIMIT, sendingNote, toolLink } from '../src/launchModel';
import { BoardStage } from '../src/BoardStage';
import { MakeStage } from '../src/MakeStage';
import { briefFor, chosenChallenge, ORGS, orgFor, OWN_ID } from '../src/orgs';
import { recordHTML } from '../src/recordExport';
import { StartStage } from '../src/StartStage';

// Files in public/, to check the headshots the board points at are there.
const PUBLIC_FILES = Object.keys(import.meta.glob('../public/**/*'));
const HARBOURSIDE = ORGS.find((org) => org.ready)!;
const material = BRIEF.material!;
const noop = () => undefined;

function project(fields: Partial<ReturnType<typeof initialLaunch>> = {}) {
  return { ...initialLaunch(), projectId: HARBOURSIDE.id, audience: 'The cook at a community lunch', approach: 'AI sorts the list. I check dates and decide.', ...fields };
}

const board = (state = initialLaunch()) => renderToStaticMarkup(<BoardStage state={state} titleRef={{ current: null }} busy={false} onChoose={noop} onContinue={noop} onDownload={noop}/>);
const start = (state = project()) => renderToStaticMarkup(<StartStage state={state} titleRef={{ current: null }} onField={noop} onMove={noop} onOpen={noop}/>);

describe('the board of groups', () => {
  it('shows every group with its work, its contact in their own words and the jobs it has going', () => {
    const html = board();
    for (const org of ORGS) {
      expect(html).toContain(org.name);
      expect(html).toContain(org.about);
      expect(html).toContain(`“${org.contact.quote}”`);
      for (const challenge of org.challenges) expect(html).toContain(challenge);
    }
    expect(html).toContain('Bring your own group');
    expect(html).toContain('These groups are made up, so you can practise.');
  });

  it('builds out exactly one group, with a headshot that is really there', () => {
    expect(ORGS.filter((org) => org.ready)).toHaveLength(1);
    expect(HARBOURSIDE.ready!.brief).toBe(BRIEF);
    expect(PUBLIC_FILES).toContain(`../public${HARBOURSIDE.contact.photo}`);
    for (const org of ORGS) if (org.contact.photo) expect(PUBLIC_FILES, org.name).toContain(`../public${org.contact.photo}`);
  });

  it('offers to carry on with the group already picked', () => {
    expect(board(project())).toContain('Carry on with Harbourside');
    expect(board()).toContain('See the problems to solve');
  });
});

describe('which brief a project gets', () => {
  it('uses the built-out brief for the built-out job, and a lighter one for any other', () => {
    expect(briefFor(project())).toBe(BRIEF);
    expect(chosenChallenge(project())).toBe(HARBOURSIDE.ready!.challenge);
    const other = project({ challenge: HARBOURSIDE.challenges[1] });
    expect(briefFor(other)).not.toBe(BRIEF);
    expect(briefFor(other).sources).toEqual([]);
    expect(briefFor(other).promptIntro).toContain(HARBOURSIDE.challenges[1]);
  });

  it('builds a brief from the future builder’s own group and job, inventing nothing', () => {
    const own = { ...initialLaunch(), projectId: OWN_ID, customOrg: 'Westown Seed Library', challenge: 'People forget what was planted where.' };
    expect(orgFor(own)).toMatchObject({ name: 'Westown Seed Library', own: true, challenges: [] });
    const prompt = launchPrompt(own);
    expect(prompt).toContain('Westown Seed Library, which I brought myself.');
    expect(prompt).toContain('People forget what was planted where.');
    expect(prompt).not.toContain('What they do:');
    expect(prompt).toContain('Do not invent facts about the organisation');
  });
});

describe('the Harbourside brief', () => {
  it('is a week of made-up donations, labelled as practice', () => {
    expect(material.rows).toHaveLength(12);
    for (const row of material.rows) expect(row).toHaveLength(material.columns.length);
    expect(material.note).toContain('Made up for practice');
    expect(BRIEF.affiliation).toContain('made up');
  });

  it('shows Raewyn’s words in full, and the week of donations behind a closed toggle', () => {
    const html = start();
    for (const line of HARBOURSIDE.contact.transcript!) expect(html).toContain(`<p>${line}</p>`);
    expect(html).toContain('Read what Raewyn said');
    expect(html).toMatch(/<details class="ac-material"><summary>See the week of donations/);
    const at = html.indexOf('<details class="ac-material">');
    const sheet = html.slice(at, html.indexOf('</details>', at));
    expect(sheet.match(/<tr role="row">/g)).toHaveLength(material.rows.length + 1);
    expect(html).toContain('your brief already carries the week of donations and the fact-check kit.');
  });

  it('leaves what to make until after talking to the person', () => {
    const html = start();
    expect(html).toContain('What might you make?');
    expect(html).not.toContain('type="radio" name="lp-format"');
    expect(html).toContain('That’s enough to start.');
    expect(start(project({ audience: '' }))).not.toContain('That’s enough to start.');
  });

  it('carries every row and ground rule in the AI brief, with the food safety calls left to the food rescue', () => {
    const prompt = launchPrompt(project());
    const at = prompt.indexOf('The material we are working through: A week of donations.');
    expect(at).toBeGreaterThan(prompt.indexOf('What AI will do, and what I will do:'));
    expect(at).toBeLessThan(prompt.indexOf('Official reference pack'));
    for (const row of material.rows) expect(prompt).toContain(row.join(' | '));
    for (const rule of BRIEF.promptRules) expect(prompt).toContain(`- ${rule}`);
    expect(prompt).toContain('Do not decide whether food is safe to eat');
    expect(prompt).toContain('I’ll decide where each item goes.');
  });

  it('still opens Claude and ChatGPT with the brief filled in for a typical project', () => {
    const prompt = launchPrompt(project());
    for (const tool of AI_TOOLS.filter((item) => item.prefill)) expect(toolLink(tool, prompt).prefilled, tool.name).toBe(true);
    expect(sendingNote(prompt)).toContain('Opening ChatGPT or Claude puts it in the link so it lands in their box');
  });

  it('says the brief will need pasting when it is too long for a link', () => {
    const prompt = launchPrompt(project({ approach: 'x '.repeat(PREFILL_URL_LIMIT / 2) }));
    expect(AI_TOOLS.some((tool) => toolLink(tool, prompt).prefilled)).toBe(false);
    expect(sendingNote(prompt)).toContain('too long to fit in a link');
  });

  it('reminds the future builder on Make & try to check what the AI says the sources say', () => {
    const html = renderToStaticMarkup(<MakeStage state={project()} titleRef={{ current: null }} onField={noop} onMove={noop} onOpen={noop} images={{}} imageNotes={{}} onVersionField={noop} onAddVersion={noop} onRemoveVersion={noop} onImage={noop} onRemoveImage={noop}/>);
    expect(html).toContain('If your AI tool says one of these sources says something, open it and check.');
  });

  it('is listed with what was provided in the record', () => {
    const state = project();
    state.versions.push({ ...newVersion(), title: 'Use first list' });
    const html = recordHTML(state, {});
    expect(html).toContain(`<li>A week of donations, carried in the AI brief. <span class="rd-muted">${material.note}</span></li>`);
    expect(html).toContain('Harbourside Food Rescue');
  });
});
