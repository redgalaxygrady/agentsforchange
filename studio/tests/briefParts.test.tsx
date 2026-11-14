import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PRACTICE_BRIEF_WITH_MATERIAL as BRIEF } from './fixtures/practiceBriefWithMaterial';

// A brief's own material, checked with a practice brief so it stays covered when the built-out brief changes.
vi.mock('../src/orgs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/orgs')>();
  const { PRACTICE_BRIEF_WITH_MATERIAL: brief } = await import('./fixtures/practiceBriefWithMaterial');
  const { PRACTICE_ORG: org } = await import('./fixtures/practiceOrg');
  return { ...actual, briefFor: () => brief, orgFor: () => org, chosenChallenge: () => org.challenges[0] };
});

const { initialLaunch, launchPrompt, newVersion } = await import('../src/launchModel');
const { recordHTML } = await import('../src/recordExport');
const { StartStage } = await import('../src/StartStage');

const material = BRIEF.material!;
const noop = () => undefined;

function project() {
  const state = initialLaunch();
  Object.assign(state, { projectId: 'practice-trappers', audience: 'My aunt', format: 'A card for the shed', approach: 'AI drafts, I check' });
  state.versions.push({ ...newVersion(), title: 'First card' });
  return state;
}

const start = () => renderToStaticMarkup(<StartStage state={project()} titleRef={{ current: null }} onField={noop} onMove={noop} onOpen={noop}/>);

describe('a brief with material', () => {
  it('keeps every row of the material behind a closed toggle, under the picked job', () => {
    const html = start();
    const at = html.indexOf('<details class="ac-material"><summary>See the month of trap checks');
    expect(at).toBeGreaterThan(html.indexOf(BRIEF.task!));
    const sheet = html.slice(at, html.indexOf('</details>', at));
    expect(sheet).toContain(`<caption><strong>${material.title}</strong><span>${material.note}</span></caption>`);
    expect(sheet.match(/<tr role="row">/g)).toHaveLength(material.rows.length + 1);
    expect(sheet).toContain('<td role="cell">3</td><td role="cell">Compost bin</td><td role="cell">Bait gone</td>');
    expect(html).toContain('your brief already carries the month of trap checks and the fact-check kit.');
  });

  it('carries every row in the brief, between the approach and the reference pack', () => {
    const prompt = launchPrompt(project());
    const at = prompt.indexOf(`The material we are working through: ${material.title}. ${material.note}`);
    expect(at).toBeGreaterThan(prompt.indexOf('What AI will do, and what I will do:'));
    expect(at).toBeLessThan(prompt.indexOf('Official reference pack'));
    expect(prompt).toContain(['Week | Trap | Found', ...material.rows.map((row) => row.join(' | '))].join('\n'));
  });

  it('lists the material as provided in the record', () => {
    expect(recordHTML(project(), {})).toContain(`<li>${material.title}, carried in the AI brief. <span class="rd-muted">${material.note}</span></li>`);
  });
});
