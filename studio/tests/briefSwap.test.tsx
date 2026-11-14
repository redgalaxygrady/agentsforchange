import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PRACTICE_BRIEF } from './fixtures/practiceBrief';
import { PRACTICE_ORG } from './fixtures/practiceOrg';

// Rehearse a swap: everything below runs with a practice group and brief in place of the built-out food rescue.
vi.mock('../src/orgs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/orgs')>();
  const { PRACTICE_BRIEF: brief } = await import('./fixtures/practiceBrief');
  const { PRACTICE_ORG: org } = await import('./fixtures/practiceOrg');
  return { ...actual, briefFor: () => brief, orgFor: () => org, chosenChallenge: () => org.challenges[0] };
});

const { initialLaunch, launchPrompt, newVersion } = await import('../src/launchModel');
const { recordHTML } = await import('../src/recordExport');
const { StartStage } = await import('../src/StartStage');
const { MakeStage } = await import('../src/MakeStage');
const { RecordStage } = await import('../src/RecordStage');

// Words from the built-out food rescue. None should be built into the workspace itself.
const LEFTOVER = /food rescue|harbourside|raewyn|donation/i;
const noop = () => undefined;

function project() {
  const state = initialLaunch();
  Object.assign(state, { projectId: PRACTICE_ORG.id, audience: 'My aunt', format: 'A card for the shed', approach: 'AI drafts, I check' });
  state.versions.push({ ...newVersion(), title: 'First card', notes: 'A card for the shed', tried: 'My aunt', noticed: 'She asked about bait' });
  state.versions.push({ ...newVersion(), changed: 'Added bait' });
  return state;
}

function screens() {
  const state = project();
  const stage = { state, titleRef: { current: null }, onField: noop, onMove: noop, onOpen: noop };
  return {
    start: renderToStaticMarkup(<StartStage {...stage}/>),
    make: renderToStaticMarkup(<MakeStage {...stage} images={{}} imageNotes={{}} onVersionField={noop} onAddVersion={noop} onRemoveVersion={noop} onImage={noop} onRemoveImage={noop}/>),
    record: renderToStaticMarkup(<RecordStage {...stage} images={{}} onDownload={noop} onMoment={noop}/>),
  };
}

describe('swapping in another group and brief', () => {
  it('leaves no words from the food rescue on any screen of the workspace', () => {
    for (const [name, html] of Object.entries(screens())) expect(html, name).not.toMatch(LEFTOVER);
  });

  it('shows the group, its contact in their own words, its jobs, and the brief’s people, sources and who it is from', () => {
    const { start } = screens();
    expect(start).toContain(PRACTICE_ORG.name);
    expect(start).toContain(`“${PRACTICE_ORG.contact!.quote}”`);
    for (const line of PRACTICE_ORG.contact!.transcript!) expect(start).toContain(`<p>${line}</p>`);
    for (const challenge of PRACTICE_ORG.challenges) expect(start).toContain(challenge);
    expect(start).toContain(PRACTICE_BRIEF.task);
    for (const idea of PRACTICE_BRIEF.audienceIdeas) expect(start).toContain(idea);
    for (const source of PRACTICE_BRIEF.sources) expect(start).toContain(source.url);
    expect(start).toContain(PRACTICE_BRIEF.affiliation);
    expect(start).toContain('Which bait works best?');
  });

  it('drops the material when the brief has none', () => {
    const { start } = screens();
    expect(start).not.toContain('ac-material');
    expect(start).toContain('your brief already carries the fact-check kit.');
    expect(start).toContain('Your brief carries your choices and the fact-check kit, plus ground rules');
    expect(launchPrompt(project())).not.toContain('The material we are working through');
    expect(recordHTML(project(), {})).not.toContain('carried in the AI brief');
  });

  it('writes the AI brief from the new brief, keeping the general ground rules', () => {
    const prompt = launchPrompt(project());
    expect(prompt).toContain(PRACTICE_BRIEF.starter!);
    expect(prompt).not.toMatch(LEFTOVER);
    expect(prompt.startsWith(PRACTICE_BRIEF.promptIntro)).toBe(true);
    for (const rule of PRACTICE_BRIEF.promptRules) expect(prompt).toContain(`- ${rule}`);
    for (const source of PRACTICE_BRIEF.sources) expect(prompt).toContain(source.url);
    expect(prompt).toContain('Any suggested size or structure in this brief is only a default');
    expect(prompt).toContain('I own the choices, evidence checks and final judgement.');
  });

  it('names the group, the job and the new brief in the record', () => {
    const state = project();
    const record = recordHTML(state, {});
    expect(record).not.toMatch(LEFTOVER);
    expect(record).toContain(PRACTICE_BRIEF.affiliation);
    expect(record).toContain(PRACTICE_ORG.name);
    expect(record).toContain(PRACTICE_ORG.challenges[0]);
    expect(recordHTML({ ...state, maker: 'Sam' }, {})).toContain('Made by Sam for the backyard trapping practice brief');
    expect(recordHTML(initialLaunch(), {})).toContain('Get a backyard <em>trap working</em>');
  });
});
