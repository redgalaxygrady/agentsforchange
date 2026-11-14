import { describe, expect, it } from 'vitest';
import {
  initialLaunch, LAUNCH_STAGE_STORAGE_KEY, LAUNCH_STORAGE_KEY, launchMedium,
  launchPrompt, loadLaunch, loadLaunchStage, newVersion, nextStep, safeArtifactUrl, saveLaunch, saveLaunchStage, AI_TOOLS, PREFILL_URL_LIMIT, toolLink,
} from '../src/launchModel';
import type { LaunchState, WorkVersion } from '../src/launchModel';
import { recordHTML } from '../src/recordExport';
// With no group chosen yet, the AI brief falls back to the built-out one.
import { FOOD_RESCUE_BRIEF as BRIEF } from '../src/brief';

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

function version(fields: Partial<WorkVersion>): WorkVersion {
  return { ...newVersion(), ...fields };
}

describe('project persistence', () => {
  it('starts empty, without choosing an audience or inventing work for the learner', () => {
    const first = initialLaunch();
    first.approach = 'My plan';
    first.versions.push(version({ notes: 'draft' }));
    const next = initialLaunch();
    expect(next.audience).toBe('');
    expect(next.approach).toBe('');
    expect(next.format).toBe('');
    expect(next.versions).toEqual([]);
    expect(next.aiUse).toBe('');
    expect(loadLaunch(memory())).toEqual({ state: next, warning: null });
  });

  it('resumes every project field and version exactly', () => {
    const state = initialLaunch();
    Object.assign(state, {
      maker: 'Sam', audience: '', projectId: 'harbourside', challenge: '  ', format: 'Interactive story',
      approach: 'I choose the story', sourceNotes: '\nSource excerpt  ', learned: 'Shorter helped', aiUse: 'I rejected the first draft',
    });
    state.versions.push(version({ title: 'Rough cut', link: 'https://example.com/work', notes: 'Version 1', tried: 'Read it aloud', noticed: 'Too long', hasImage: true }));
    state.versions.push(version({ changed: 'Cut introduction' }));
    const storage = memory();
    expect(saveLaunch(state, storage)).toEqual({ ok: true });
    expect(loadLaunch(storage)).toEqual({ state, warning: null });
  });

  it.each(['{broken', 'null', '[]', '{"version":2,"approach":"Future work"}'])('warns and preserves damaged or unsupported bytes: %s', (raw) => {
    const storage = memory();
    storage.setItem(LAUNCH_STORAGE_KEY, raw);
    const result = loadLaunch(storage);
    expect(result.state).toEqual(initialLaunch());
    expect(result.warning).toContain('original saved data has not been changed');
    expect(storage.getItem(LAUNCH_STORAGE_KEY)).toBe(raw);
  });

  it('recovers valid strings and versions without coercing invalid ones', () => {
    const raw = JSON.stringify({ version: 1, maker: 'A', audience: 'Keep this', format: 42, approach: { text: 'bad' }, sourceNotes: null, learned: '', aiUse: '', versions: [{ id: 'v1', title: 'ok', link: 7, notes: 'kept', changed: '', tried: '', noticed: '', hasImage: false }, { title: 'no id' }, 'junk'] });
    const storage = memory();
    storage.setItem(LAUNCH_STORAGE_KEY, raw);
    const result = loadLaunch(storage);
    expect(result.state.audience).toBe('Keep this');
    expect(result.state.format).toBe('');
    expect(result.state.approach).toBe('');
    expect(result.state.versions).toHaveLength(1);
    expect(result.state.versions[0]).toMatchObject({ id: 'v1', title: 'ok', link: '', notes: 'kept' });
    expect(result.warning).toContain('missing or invalid');
    expect(storage.getItem(LAUNCH_STORAGE_KEY)).toBe(raw);
  });

  it('stores the last stage separately so stage navigation cannot replace damaged project data', () => {
    const storage = memory();
    const damaged = '{not valid saved work';
    storage.setItem(LAUNCH_STORAGE_KEY, damaged);
    expect(saveLaunchStage('try', storage)).toEqual({ ok: true });
    expect(loadLaunchStage(storage)).toEqual({ step: 'try', warning: null });
    expect(storage.getItem(LAUNCH_STAGE_STORAGE_KEY)).toBe('try');
    expect(storage.getItem(LAUNCH_STORAGE_KEY)).toBe(damaged);
  });

  it('reports stage storage failure without changing project bytes', () => {
    const storage = memory();
    const damaged = '{bad';
    storage.setItem(LAUNCH_STORAGE_KEY, damaged);
    storage.setItem = () => { throw new Error('blocked'); };
    expect(saveLaunchStage('keep', storage)).toMatchObject({ ok: false, message: expect.stringContaining('could not be remembered') });
    expect(storage.getItem(LAUNCH_STORAGE_KEY)).toBe(damaged);
    const unreadable = memory();
    unreadable.getItem = () => { throw new Error('blocked'); };
    expect(loadLaunchStage(unreadable).warning).toContain('could not be remembered');
  });

  it('reports project read and write failure without claiming success', () => {
    const storage = memory();
    storage.setItem(LAUNCH_STORAGE_KEY, 'prior work');
    storage.getItem = () => { throw new Error('blocked'); };
    expect(loadLaunch(storage).warning).toContain('could not be read');
    storage.setItem = () => { throw new Error('quota'); };
    expect(saveLaunch(initialLaunch(), storage)).toMatchObject({ ok: false, message: expect.stringContaining('could not be saved') });
  });

  it('rejects runtime-invalid save input before overwriting a saved record', () => {
    const storage = memory();
    storage.setItem(LAUNCH_STORAGE_KEY, 'prior work');
    expect(saveLaunch({ ...initialLaunch(), learned: 12 } as unknown as LaunchState, storage).ok).toBe(false);
    expect(saveLaunch({ ...initialLaunch(), versions: [{ id: 'x', notes: 3 }] } as unknown as LaunchState, storage).ok).toBe(false);
    expect(storage.getItem(LAUNCH_STORAGE_KEY)).toBe('prior work');
  });
});

describe('next step guidance', () => {
  it('follows only what the learner recorded', () => {
    const state = initialLaunch();
    expect(nextStep(state).kind).toBe('brief');
    state.audience = 'Nan';
    expect(nextStep(state)).toMatchObject({ kind: 'add', label: expect.stringContaining('version 1') });
    state.versions.push(version({}));
    expect(nextStep(state).kind).toBe('add');
    state.versions[0].link = 'https://example.com';
    expect(nextStep(state)).toMatchObject({ kind: 'try', label: expect.stringContaining('version 1') });
    state.versions[0].noticed = 'She got lost';
    expect(nextStep(state)).toMatchObject({ kind: 'iterate', label: expect.stringContaining('version 2') });
  });
});

describe('bounded external AI support', () => {
  it('carries current choices, sources and ground rules in the brief', () => {
    const state = initialLaunch();
    Object.assign(state, {
      audience: 'People nervous about a first visit', format: 'Interactive audio map',
      approach: 'I record; AI helps structure', sourceNotes: 'Check whether a booking is needed',
    });
    expect(launchMedium(state)).toBe('Interactive audio map');
    const prompt = launchPrompt(state);
    for (const value of [state.audience, state.format, state.approach, state.sourceNotes]) expect(prompt).toContain(value);
    for (const source of BRIEF.sources) {
      expect(prompt).toContain(source.url);
      expect(prompt).toContain(source.description);
    }
    for (const rule of BRIEF.promptRules) expect(prompt).toContain(`- ${rule}`);
    expect(prompt).toContain('If you cannot open a source, say so');
    expect(prompt).toContain('I own the choices, evidence checks and final judgement');
  });

  it('asks for a few options instead of inventing a format when nothing is decided', () => {
    const state = initialLaunch();
    state.format = '   ';
    expect(launchMedium(state)).toBe('Not decided yet');
    const prompt = launchPrompt(state);
    expect(prompt).toContain('(Not decided yet. I will talk to the person first.)');
    expect(prompt).toContain('Suggest two or three small options');
    expect(prompt).toContain('let me pick before making anything');
    state.format = 'A sign for the door';
    expect(launchPrompt(state)).toContain('A sign for the door');
    expect(launchPrompt(state)).not.toContain('Suggest two or three small options');
  });

  it('starts making with a first step and a practical handoff, without assuming a medium', () => {
    const state = initialLaunch();
    expect(launchPrompt(state)).toContain('(Not chosen yet.)');
    state.format = 'A short audio story';
    const prompt = launchPrompt(state);
    expect(prompt).toContain('concrete first making step');
    expect(prompt).toContain('usable starter or demonstration');
    expect(prompt).toContain('If what I make needs another tool');
    expect(prompt).toContain('Do not assume this is a written guide or a coding project');
    expect(prompt).toContain(BRIEF.starter!);
  });
});

describe('honest records and safe work references', () => {
  it('exports a truthful blank record and separates the work from the record', () => {
    const empty = recordHTML(initialLaunch(), {});
    expect(empty).toContain('maker’s own account');
    expect(empty).toContain('did not open, check or grade it');
    expect(empty).toContain('AI use not recorded. No AI contribution is inferred.');
    expect(empty).toContain('No versions of the work recorded yet.');
    expect(empty).toContain('No moments picked out yet.');
    expect(empty).toContain('listing a source does not mean it was reviewed');
  });

  it('includes every version and every recorded field', () => {
    const state = initialLaunch();
    Object.assign(state, {
      maker: 'Robin', format: 'Interactive map', approach: 'I check every fact', sourceNotes: 'Check local booking',
      learned: 'Test with one person first', aiUse: 'AI helped sort notes; I checked sources',
    });
    state.moments.choice = 'I said no to the AI’s colour scheme';
    state.versions.push(version({ title: 'Map draft', link: 'https://example.com/work', notes: 'Hand drawn', tried: 'Shared with a newcomer', noticed: 'They knew what to bring' }));
    state.versions.push(version({ changed: 'Added a list' }));
    const html = recordHTML(state, {});
    for (const value of ['Robin', 'Interactive map', 'I check every fact', 'Check local booking', 'Test with one person first', 'AI helped sort notes; I checked sources', 'Hand drawn', 'Shared with a newcomer', 'They knew what to bring', 'Added a list', 'I said no to the AI’s colour scheme']) expect(html).toContain(value);
    expect(html).toContain('Map draft');
    expect(html).toContain('href="https://example.com/work"');
  });

  it('treats whitespace-only fields as not recorded', () => {
    const state = initialLaunch();
    state.moments.evidence = '  \n ';
    state.learned = '\t ';
    const html = recordHTML(state, {});
    expect(html).toContain('Not recorded');
    expect(html).toContain('No moments picked out yet.');
  });

  it.each(['https://example.com/work', 'http://example.com/work', '  https://example.com/work  '])('allows an explicit web reference: %s', (value) => {
    expect(safeArtifactUrl(value)).toMatch(/^https?:\/\/example\.com\/work$/);
  });

  it.each(['', '/relative', 'example.com/work', 'javascript:alert(1)', 'data:text/html,<script>bad</script>', 'file:///tmp/work', 'https://user:password@example.com', 'https://user@example.com', 'https://example.com\n/work'])('rejects unsafe or ambiguous references: %s', (value) => {
    expect(safeArtifactUrl(value)).toBeNull();
  });
});

describe('downloadable record page', () => {
  it('is self-contained, escapes learner text, and only links safe references', () => {
    const state = initialLaunch();
    state.maker = '<b>Sam</b>';
    state.approach = "<script>alert(1)</script> I'll help";
    state.versions.push(version({ title: 'First', link: 'javascript:alert(1)', notes: 'Draft' }), version({ link: 'https://example.com/v2', changed: 'Clearer' }));
    const html = recordHTML(state, { [state.versions[1].id]: 'data:image/png;base64,AAAA' });
    expect(html).toContain("default-src 'none'; img-src data:");
    expect(html).not.toContain('<script>alert');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('I&#x27;ll help');
    expect(html).not.toContain('href="javascript:');
    expect(html).toContain('href="https://example.com/v2"');
    expect(html).toContain('src="data:image/png;base64,AAAA"');
    expect(html).toContain('<title>&lt;b&gt;Sam&lt;/b&gt; · Portfolio record</title>');
    expect(html).not.toMatch(/<script/i);
  });

  it('tags only the newest version as the latest and carries the Agents for Change mark without loading anything', () => {
    const state = initialLaunch();
    state.versions.push(version({ title: 'First' }), version({ title: 'Second' }), version({ title: 'Third' }));
    const html = recordHTML(state, {});
    expect(html.match(/rd-badge--latest/g)?.length).toBe(2);
    expect(html).toContain('<span class="rd-badge rd-badge--latest">V3</span>');
    expect(html).toContain('<span class="rd-badge">V1</span>');
    expect(html).toContain('Recorded in Agents for Change');
    expect(html).toMatch(/<svg[^>]*viewBox="0 0 64 64"/);
    expect(html).not.toMatch(/(src|href)="https?:\/\/[^"]*(fonts|\.svg|\.png)/);
  });
});

describe('AI tool links', () => {
  const byName = (name: string) => AI_TOOLS.find((tool) => tool.name === name)!;
  it('prefills Claude and ChatGPT with the encoded brief', () => {
    const text = 'Help me & "plan" a poster\nsecond line';
    expect(toolLink(byName('Claude'), text)).toEqual({ href: `https://claude.ai/new?q=${encodeURIComponent(text)}`, prefilled: true });
    expect(toolLink(byName('ChatGPT'), text).href).toBe(`https://chatgpt.com/?q=${encodeURIComponent(text)}`);
  });
  it('opens the plain tool when the brief is too long or the tool has no parameter', () => {
    expect(toolLink(byName('Claude'), 'x'.repeat(PREFILL_URL_LIMIT))).toEqual({ href: 'https://claude.ai/', prefilled: false });
    expect(toolLink(byName('Gemini'), 'short')).toEqual({ href: 'https://gemini.google.com/', prefilled: false });
  });
});
