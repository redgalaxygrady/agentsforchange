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
  it('is labelled as practice, and hands over no material or sources of its own', () => {
    expect(BRIEF.material).toBeUndefined();
    expect(BRIEF.sources).toEqual([]);
    expect(BRIEF.affiliation).toContain('made up');
  });

  it('shows Raewyn’s words in full, and sends the future builder to her for the week’s food and the sources to trust', () => {
    const html = start();
    for (const line of HARBOURSIDE.contact.transcript!) expect(html).toContain(`<p>${line}</p>`);
    expect(html).toContain('Read what Raewyn said');
    expect(html).toContain('Find out from Raewyn what a usual week brings');
    expect(html).toContain('Ask Raewyn which sources the food rescue trusts');
    expect(html).not.toContain('ac-material');
    expect(html).not.toContain('ac-sources');
    expect(html).toContain('That’s enough to start. The rest of this page is optional.');
    expect(html).toContain('Your brief carries your choices, plus ground rules so the AI doesn’t make things up.');
  });

  it('leaves what to make until after talking to the person', () => {
    const html = start();
    expect(html).toContain('What might you make?');
    expect(html).not.toContain('type="radio" name="lp-format"');
    expect(html).toContain('That’s enough to start.');
    expect(start(project({ audience: '' }))).not.toContain('That’s enough to start.');
  });

  it('carries every ground rule in the AI brief, with the food safety calls left to the food rescue', () => {
    const prompt = launchPrompt(project());
    expect(prompt).not.toContain('The material we are working through');
    expect(prompt).toContain('Ask me which sources the organisation trusts before you rely on any.');
    expect(prompt).toContain('Start by asking me what the food rescue told me about a usual week');
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

  it('reminds the future builder on Make & try to check facts with the group', () => {
    const html = renderToStaticMarkup(<MakeStage state={project()} titleRef={{ current: null }} onField={noop} onMove={noop} onOpen={noop} images={{}} imageNotes={{}} onVersionField={noop} onAddVersion={noop} onRemoveVersion={noop} onImage={noop} onRemoveImage={noop}/>);
    expect(html).toContain('Check the facts');
    expect(html).toContain('AI tools get details wrong. Check facts with the group, and note what they trust.');
  });

  it('says in the record that no sources came with it', () => {
    const state = project();
    state.versions.push({ ...newVersion(), title: 'Use first list' });
    const html = recordHTML(state, {});
    expect(html).toContain('None provided with this problem.');
    expect(html).toContain('Harbourside Food Rescue');
  });
});
