import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { BoardStage } from '../src/BoardStage';
import { Wordmark } from '../src/Brand';
import { EXAMPLE_HASH, EXAMPLE_RECORD } from '../src/exampleProject';
import { ExampleRecord } from '../src/ExampleRecord';
import { initialLaunch, LAUNCH_STAGE_STORAGE_KEY, LAUNCH_STORAGE_KEY, MOMENTS } from '../src/launchModel';
import { ORGS, orgById, PARTNER_SIGNUP_URL } from '../src/orgs';
import { recordHTML } from '../src/recordExport';
import { StartStage } from '../src/StartStage';

const noop = () => undefined;
const HARBOURSIDE = ORGS.find((org) => org.ready)!;
const returning = { ...initialLaunch(), projectId: HARBOURSIDE.id, audience: 'The cook at a community lunch' };
const board = (state = initialLaunch()) => renderToStaticMarkup(<BoardStage state={state} titleRef={{ current: null }} busy={false} onChoose={noop} onContinue={noop} onDownload={noop}/>);

describe('what the landing page tells parents and community groups', () => {
  it('says who a sprint is for, how it runs and what a future builder leaves with', () => {
    const html = board();
    expect(html).toContain('For parents and whānau');
    expect(html).toContain('For 16 to 18-year-olds who are keen.');
    expect(html).toContain('In person, over four days.');
    expect(html).toContain('in your community, in four days');
    expect(html).not.toMatch(/four[- ]week/i);
    expect(html).toContain('Matched by hand.');
    expect(html).toContain(`href="${EXAMPLE_HASH}"`);
    expect(html).toContain('A made-up example of what a future builder leaves with.');
  });

  it('says a facilitator matches each future builder with a real group', () => {
    expect(board()).toContain('your facilitator matches you with a real group near you');
  });

  it('tells community groups how they come in, and shows a button only once there is somewhere to send them', () => {
    const html = board();
    expect(html).toContain('Run a community group?');
    if (PARTNER_SIGNUP_URL) expect(html).toContain(`href="${PARTNER_SIGNUP_URL}"`);
    else expect(html).not.toContain('Share a problem');
  });
});

describe('links stay readable', () => {
  it('never sets a link in cream, which disappears on the paper and highlighter backgrounds', () => {
    for (const html of [board(), board(returning), renderToStaticMarkup(<StartStage state={returning} titleRef={{ current: null }} onField={noop} onMove={noop} onOpen={noop}/>)]) {
      expect(html).not.toContain('ac-link--light');
    }
    expect(board(returning)).toContain('Or see the other problems');
  });
});

describe('the example record', () => {
  const page = renderToStaticMarkup(<ExampleRecord titleRef={{ current: null }} onBack={noop}/>);

  it('is about a problem a group on the board really lists', () => {
    expect(EXAMPLE_RECORD.challenge).not.toBe('');
    expect(orgById(EXAMPLE_RECORD.projectId)?.challenges).toContain(EXAMPLE_RECORD.challenge);
  });

  it('says plainly, on the page and in the record itself, that it is made up', () => {
    expect(page).toContain('This is a made-up example.');
    expect(page).toContain('Example portfolio record (made up)');
    expect(page).toContain('A made-up example to show what a finished record looks like.');
    expect(page).toContain('is a made-up example organisation');
  });

  it('says a sprint runs over four days', () => {
    expect(page).toContain('At the end of a four-day sprint');
    expect(page).not.toMatch(/four[- ]week/i);
  });

  it('shows a finished record, with every part written in', () => {
    expect(page).toContain('Made by Mia for the Northgate Community Food Bank project');
    for (const { kind } of MOMENTS) expect(EXAMPLE_RECORD.moments[kind]).not.toBe('');
    expect(page).not.toContain('Not recorded');
    expect(page).not.toContain('No link recorded');
    expect(page).not.toContain('not recorded');
  });

  it('never marks a future builder’s own record as an example', () => {
    const html = recordHTML(EXAMPLE_RECORD, {});
    expect(html).not.toContain('made up)');
    expect(html).not.toContain('A made-up example to show');
  });
});

describe('the name', () => {
  it('is Agents For Change', () => {
    expect(renderToStaticMarkup(<Wordmark/>)).toContain('Agents For Change');
    expect(recordHTML(initialLaunch(), {})).toContain('Recorded in Agents For Change');
  });

  it('keeps the old saving keys, so work saved under the earlier name still loads', () => {
    expect(LAUNCH_STORAGE_KEY).toBe('agents-for-change.project.v1');
    expect(LAUNCH_STAGE_STORAGE_KEY).toBe('agents-for-change.stage.v1');
  });
});

describe('picking a problem', () => {
  it('leaves the material and fact-check kit out, because problems are talked through with the group first', () => {
    const start = renderToStaticMarkup(<StartStage state={returning} titleRef={{ current: null }} onField={noop} onMove={noop} onOpen={noop}/>);
    for (const html of [board(), board(returning), start]) {
      expect(html).not.toContain('Comes with a week of their donations');
      expect(html).not.toMatch(/ready to go/i);
    }
    expect(start).toContain('Talk them through together, then pick the one you’d most like to help with.');
    expect(board()).toContain('Start with a conversation');
  });
});
