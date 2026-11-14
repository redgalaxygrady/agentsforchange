import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { hasWork, initialLaunch, LAUNCH_STORAGE_KEY, loadLaunch, newVersion, saveLaunch } from '../src/launchModel';
import type { LaunchState } from '../src/launchModel';
import { recordHTML } from '../src/recordExport';
import { RecordStage } from '../src/RecordStage';

function memory(): Storage {
  const map = new Map<string, string>();
  return {
    get length() { return map.size; },
    clear: () => map.clear(),
    getItem: (key) => map.get(key) ?? null,
    key: (index) => [...map.keys()][index] ?? null,
    removeItem: (key) => { map.delete(key); },
    setItem: (key, value) => { map.set(key, value); },
  };
}

function project(): LaunchState {
  const state = initialLaunch();
  Object.assign(state, { projectId: 'harbourside', audience: 'The cook at a community lunch', format: 'A one-page guide' });
  state.versions.push({ ...newVersion(), id: 'v-one', title: 'Rough sort', notes: 'Three columns on a page' });
  state.versions.push({ ...newVersion(), id: 'v-two', title: 'Use first at the top', changed: 'Put the cooked rice first' });
  state.moments = {
    choice: 'I kept the cooked rice out, though the AI put it in “use first”. Ana in my group agreed.',
    evidence: 'The cook read it in ten seconds, so I kept the three columns.',
    leftWith: 'I didn’t guess about the dented cans. Raewyn will decide.',
  };
  return state;
}

function stage(state: LaunchState) {
  const noop = () => undefined;
  return renderToStaticMarkup(<RecordStage state={state} titleRef={{ current: null }} onField={noop} onMove={noop} onOpen={noop} images={{}} onDownload={noop} onMoment={noop}/>);
}

describe('saving the three moments', () => {
  it('saves and resumes every moment exactly', () => {
    const storage = memory();
    const state = project();
    expect(saveLaunch(state, storage)).toEqual({ ok: true });
    expect(loadLaunch(storage)).toEqual({ state, warning: null });
  });

  it('opens a project with no moments saved, with no warning', () => {
    const storage = memory();
    const { moments: _moments, ...rest } = project();
    storage.setItem(LAUNCH_STORAGE_KEY, JSON.stringify(rest));
    const loaded = loadLaunch(storage);
    expect(loaded.warning).toBeNull();
    expect(loaded.state.moments).toEqual(initialLaunch().moments);
  });

  it('keeps the valid moments and says when some were damaged', () => {
    const storage = memory();
    const raw = JSON.stringify({ ...project(), moments: { choice: 'Kept', evidence: 7 } });
    storage.setItem(LAUNCH_STORAGE_KEY, raw);
    const loaded = loadLaunch(storage);
    expect(loaded.state.moments.choice).toBe('Kept');
    expect(loaded.state.moments.evidence).toBe('');
    expect(loaded.warning).toContain('missing or invalid');
    expect(storage.getItem(LAUNCH_STORAGE_KEY)).toBe(raw);
  });

  it('refuses to save moments in the wrong shape rather than overwrite saved work', () => {
    const storage = memory();
    storage.setItem(LAUNCH_STORAGE_KEY, 'prior work');
    const wrong = { ...project(), moments: { choice: { text: 'old shape' }, evidence: '', leftWith: '' } };
    expect(saveLaunch(wrong as unknown as LaunchState, storage).ok).toBe(false);
    expect(storage.getItem(LAUNCH_STORAGE_KEY)).toBe('prior work');
  });

  it('counts a written moment as work a future builder would mind losing', () => {
    expect(hasWork({ ...initialLaunch(), moments: { ...initialLaunch().moments, leftWith: 'Raewyn decides' } })).toBe(true);
    expect(hasWork({ ...initialLaunch(), moments: { ...initialLaunch().moments, choice: '  ' } })).toBe(false);
  });
});

describe('the record opens with three moments', () => {
  it('puts the moments before the brief, in the maker’s words, escaped', () => {
    const state = project();
    state.moments.leftWith = '<b>Raewyn</b> decides';
    const html = recordHTML(state, {});
    expect(html.indexOf('Three moments')).toBeGreaterThan(0);
    expect(html.indexOf('Three moments')).toBeLessThan(html.indexOf('The brief I set'));
    expect(html).toContain('<h3>A choice I owned</h3>');
    expect(html).toContain('The cook read it in ten seconds, so I kept the three columns.');
    expect(html).toContain('&lt;b&gt;Raewyn&lt;/b&gt; decides');
    expect(html).not.toMatch(/<script/i);
  });

  it('names a missing moment as not recorded, and says when none are picked out', () => {
    const state = project();
    state.moments.evidence = '';
    expect(recordHTML(state, {})).toContain('<h3>Something the evidence made me change, or keep</h3><p class="rd-none">Not recorded</p>');
    expect(recordHTML({ ...state, moments: initialLaunch().moments }, {})).toContain('<p class="rd-none">No moments picked out yet.</p>');
  });
});

describe('picking out the moments on Your record', () => {
  it('asks for each moment in a plain text box', () => {
    const html = stage(project());
    for (const label of ['A choice you owned', 'Something the evidence made you change, or keep', 'Something you left with people']) expect(html).toContain(label);
    expect(html).not.toContain('Shows in');
    expect(html).not.toMatch(/sparkle|wand|magic/i);
  });

  it('offers to pick out or finish the moments until all three are written', () => {
    const state = project();
    expect(stage(state)).not.toMatch(/(Pick out|Finish) your three moments/);
    state.moments.evidence = '';
    expect(stage(state)).toContain('Finish your three moments');
    state.moments = initialLaunch().moments;
    expect(stage(state)).toContain('Pick out your three moments');
  });

  it('offers one download, the web page, and no plain text copy', () => {
    const html = stage(project());
    expect(html).toContain('Download your record');
    expect(html).not.toContain('.md');
  });
});
