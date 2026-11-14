import type { Brief, Material } from './brief';
import { briefFor } from './orgs';

/** One attempt at the work, made in the learner's own tools and brought back here. */
export interface WorkVersion {
  id: string;
  createdAt: string;
  title: string;
  link: string;
  notes: string;
  changed: string;
  tried: string;
  noticed: string;
  hasImage: boolean;
}

export type MomentKind = 'choice' | 'evidence' | 'leftWith';

export interface LaunchState {
  version: 1;
  /** The organisation on the board, or "own" for one the future builder brought. Empty until one is chosen. */
  projectId: string;
  /** The challenge picked, in the organisation's words or the future builder's own. */
  challenge: string;
  /** Only for an organisation the future builder brought. */
  customOrg: string;
  customAbout: string;
  maker: string;
  audience: string;
  /** What they plan to make, in their own words. Often decided after talking to the person, so it can stay empty. */
  format: string;
  /** What AI will do, and what the future builder will do. */
  approach: string;
  sourceNotes: string;
  versions: WorkVersion[];
  /** The three moments the record opens with, in the future builder's words. */
  moments: Record<MomentKind, string>;
  learned: string;
  aiUse: string;
}

export type LaunchStep = 'board' | 'start' | 'try' | 'keep';
export type TextField = Exclude<keyof LaunchState, 'version' | 'versions' | 'moments'>;
export type VersionField = Exclude<keyof WorkVersion, 'id' | 'createdAt' | 'hasImage'>;

/** The three moments, in the order the record shows them, with the record's own headings. */
export const MOMENTS: { kind: MomentKind; heading: string }[] = [
  { kind: 'choice', heading: 'A choice I owned' },
  { kind: 'evidence', heading: 'Something the evidence made me change, or keep' },
  { kind: 'leftWith', heading: 'Something I left with people' },
];

export const LAUNCH_STORAGE_KEY = 'agents-for-change.project.v1';
export const LAUNCH_STAGE_STORAGE_KEY = 'agents-for-change.stage.v1';

const textFields: TextField[] = ['projectId', 'challenge', 'customOrg', 'customAbout', 'maker', 'audience', 'format', 'approach', 'sourceNotes', 'learned', 'aiUse'];
const versionTextFields: VersionField[] = ['title', 'link', 'notes', 'changed', 'tried', 'noticed'];
const stages: LaunchStep[] = ['board', 'start', 'try', 'keep'];
/** Choosing an organisation is not work a future builder would mind losing. */
const workFields = textFields.filter((field) => field !== 'projectId' && field !== 'challenge');

export function initialLaunch(): LaunchState {
  return {
    version: 1,
    projectId: '',
    challenge: '',
    customOrg: '',
    customAbout: '',
    maker: '',
    audience: '',
    format: '',
    approach: '',
    sourceNotes: '',
    versions: [],
    moments: { choice: '', evidence: '', leftWith: '' },
    learned: '',
    aiUse: '',
  };
}

let counter = 0;
export function newVersion(now = new Date()): WorkVersion {
  counter += 1;
  return {
    id: `v-${now.getTime().toString(36)}-${counter.toString(36)}`,
    createdAt: now.toISOString(),
    title: '', link: '', notes: '', changed: '', tried: '', noticed: '',
    hasImage: false,
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const PRESERVED = 'The original saved data has not been changed.';

function readVersion(value: unknown): { version: WorkVersion | null; recovered: boolean } {
  if (!isObject(value) || typeof value.id !== 'string' || !value.id) return { version: null, recovered: true };
  const version: WorkVersion = {
    id: value.id,
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : '',
    title: '', link: '', notes: '', changed: '', tried: '', noticed: '',
    hasImage: value.hasImage === true,
  };
  let recovered = false;
  for (const field of versionTextFields) {
    if (typeof value[field] === 'string') version[field] = value[field];
    else if (value[field] !== undefined) recovered = true;
  }
  return { version, recovered };
}

/** Moments are optional, so a project without them is complete, not damaged. */
function readMoments(value: unknown, state: LaunchState): boolean {
  if (value === undefined) return false;
  if (!isObject(value)) return true;
  let recovered = false;
  for (const { kind } of MOMENTS) {
    if (typeof value[kind] === 'string') state.moments[kind] = value[kind];
    else if (value[kind] !== undefined) recovered = true;
  }
  return recovered;
}

/** Read saved project data, keeping every valid field and noting any that had to be left out. */
function readLaunch(saved: unknown): { state: LaunchState; recovered: boolean } | null {
  if (!isObject(saved) || saved.version !== 1) return null;
  const state = initialLaunch();
  let recovered = false;
  for (const field of textFields) {
    if (typeof saved[field] === 'string') state[field] = saved[field];
    else recovered = true;
  }
  if (Array.isArray(saved.versions)) {
    for (const item of saved.versions) {
      const result = readVersion(item);
      if (result.version) state.versions.push(result.version);
      recovered ||= result.recovered;
    }
  } else recovered = true;
  if (readMoments(saved.moments, state)) recovered = true;
  return { state, recovered };
}

/** Loading never writes: damaged original bytes remain available until an explicit save. */
export function loadLaunch(storage?: Storage): { state: LaunchState; warning: string | null } {
  const state = initialLaunch();
  let raw: string | null;
  try {
    const target = storage ?? globalThis.localStorage;
    if (!target) return { state, warning: 'Browser storage is unavailable. Download your record before leaving this tab.' };
    raw = target.getItem(LAUNCH_STORAGE_KEY);
  } catch {
    return { state, warning: 'Your saved work could not be read. Browser storage may be blocked. Download your record before leaving.' };
  }
  if (raw === null) return { state, warning: null };

  let saved: unknown;
  try { saved = JSON.parse(raw); }
  catch { return { state, warning: `Saved project work is damaged and could not be opened. ${PRESERVED} A fresh project is shown.` }; }
  const read = readLaunch(saved);
  if (!read) return { state, warning: `Saved project work has an unsupported format. ${PRESERVED} A fresh project is shown.` };
  return {
    state: read.state,
    warning: read.recovered ? `Some saved fields were missing or invalid. Valid work was recovered; missing fields start empty. ${PRESERVED}` : null,
  };
}

/** Whether a project has anything in it a learner would mind losing. */
export function hasWork(state: LaunchState): boolean {
  return state.versions.length > 0 || workFields.some((field) => state[field].trim())
    || MOMENTS.some(({ kind }) => state.moments[kind].trim());
}

/** Whether the learner has written anything for any of the three moments. */
export function hasMoments(state: LaunchState): boolean {
  return MOMENTS.some(({ kind }) => state.moments[kind].trim());
}

export function withoutVersion(state: LaunchState, id: string): LaunchState {
  return { ...state, versions: state.versions.filter((version) => version.id !== id) };
}

export function loadLaunchStage(storage?: Storage): { step: LaunchStep; warning: string | null } {
  try {
    const target = storage ?? globalThis.localStorage;
    if (!target) return { step: 'board', warning: 'Your current stage could not be remembered because browser storage is unavailable.' };
    const raw = target.getItem(LAUNCH_STAGE_STORAGE_KEY);
    if (raw === null) return { step: 'board', warning: null };
    if (stages.includes(raw as LaunchStep)) return { step: raw as LaunchStep, warning: null };
    return { step: 'board', warning: 'Your last stage could not be restored. Your saved project work is unchanged.' };
  } catch {
    return { step: 'board', warning: 'Your current stage could not be remembered because browser storage is blocked. Your project work is unchanged.' };
  }
}

/** Presentation state is stored separately, so navigation cannot replace damaged project data. */
export function saveLaunchStage(step: LaunchStep, storage?: Storage): { ok: boolean; message?: string } {
  if (!stages.includes(step)) return { ok: false, message: 'The current stage could not be saved.' };
  try {
    const target = storage ?? globalThis.localStorage;
    if (!target) return { ok: false, message: 'Your current stage could not be remembered because browser storage is unavailable.' };
    target.setItem(LAUNCH_STAGE_STORAGE_KEY, step);
    return { ok: true };
  } catch {
    return { ok: false, message: 'Your current stage could not be remembered because browser storage is blocked. Your project work is still available in this tab.' };
  }
}

function validState(state: LaunchState): boolean {
  return isObject(state) && state.version === 1
    && textFields.every((field) => typeof state[field] === 'string')
    && Array.isArray(state.versions)
    && state.versions.every((item) => isObject(item) && typeof item.id === 'string' && typeof item.hasImage === 'boolean' && versionTextFields.every((field) => typeof item[field] === 'string'))
    && isObject(state.moments)
    && MOMENTS.every(({ kind }) => typeof state.moments[kind] === 'string');
}

export function saveLaunch(state: LaunchState, storage?: Storage): { ok: boolean; message?: string } {
  if (!validState(state)) {
    return { ok: false, message: 'Your work could not be saved because some fields have an invalid format. The previous saved data has not been changed.' };
  }
  try {
    const target = storage ?? globalThis.localStorage;
    if (!target) return { ok: false, message: 'Browser storage is unavailable. Download your record before leaving this tab.' };
    target.setItem(LAUNCH_STORAGE_KEY, JSON.stringify(state));
    return { ok: true };
  } catch {
    return { ok: false, message: 'Your latest changes could not be saved. Browser storage may be full or blocked. Keep this tab open and download your record.' };
  }
}

/** Validate a user-controlled reference for opening; this function never requests its contents. */
export function safeArtifactUrl(value: string): string | null {
  if (/[\u0000-\u001f\u007f]/.test(value)) return null;
  try {
    const url = new URL(value.trim());
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return null;
    return url.href;
  } catch { return null; }
}

/** What they plan to make, or that they haven't decided, which is fine before talking to the person. */
export function launchMedium(state: Pick<LaunchState, 'format'>): string {
  return state.format.trim() || 'Not decided yet';
}

export function versionLabel(index: number): string {
  return `Version ${index + 1}`;
}

/** What the learner should do next, judged only from what they have recorded. */
export function nextStep(state: LaunchState): { kind: 'brief' | 'add' | 'try' | 'iterate'; label: string } {
  const latest = state.versions.at(-1);
  if (!latest) {
    return state.audience.trim()
      ? { kind: 'add', label: 'Back from your tool? Add what you made as version 1.' }
      : { kind: 'brief', label: 'Say who it’s for, then take your brief to an AI tool.' };
  }
  const hasWork = latest.link.trim() || latest.notes.trim() || latest.hasImage;
  const n = state.versions.length;
  if (!hasWork) return { kind: 'add', label: `Add a link, screenshot or description to version ${n}.` };
  if (!latest.tried.trim() && !latest.noticed.trim()) return { kind: 'try', label: `Try version ${n} with someone, or check it yourself as if you were them.` };
  return { kind: 'iterate', label: `Make version ${n + 1} from what you noticed, or finish your record.` };
}


function note(value: string, fallback: string): string {
  return value.trim() ? value : fallback;
}

/** The brief's material as plain rows, so an AI tool can read it straight from the pasted brief. */
function materialBlock(material: Material): string {
  return `The material we are working through: ${material.title}. ${material.note}
${[material.columns, ...material.rows].map((row) => row.join(' | ')).join('\n')}`;
}

function sourcesBlock(brief: Brief): string {
  if (!brief.sources.length) return 'Reference sources:\n(None provided with this challenge yet. Ask me which sources the organisation trusts before you rely on any.)';
  return `Official reference pack (provided; I have not necessarily checked each source):
${brief.sources.map((source) => `- ${source.title}: ${source.url}\n  What to check: ${source.description}`).join('\n')}`;
}

export function launchPrompt(state: LaunchState): string {
  const brief = briefFor(state);
  const planned = state.format.trim();
  const task = `Help me shape this and make a useful first version. Do not assume this is a written guide or a coding project. ${brief.starter ?? ''} ${planned
    ? 'Then suggest one concrete first making step for what I plan to make.'
    : 'I have not decided what to make yet, because I want to talk to the person first. Suggest two or three small options that would suit them, and let me pick before making anything.'} Offer a usable starter or demonstration where your tool supports it. If what I make needs another tool, explain a practical handoff. Explain important choices and leave me room to change the direction. Ask a focused question only when a missing choice blocks useful progress.`.replace(/\s+/g, ' ');

  return `${brief.promptIntro} I choose who it is for, what to make, and how AI helps.

Who I am making this for:
${note(state.audience, '(Not chosen yet.)')}

What I plan to make:
${planned || '(Not decided yet. I will talk to the person first.)'}

What AI will do, and what I will do:
${note(state.approach, '(Not recorded yet.)')}

${brief.material ? `${materialBlock(brief.material)}

` : ''}${sourcesBlock(brief)}

My source notes and questions:
${note(state.sourceNotes, '(No source notes recorded.)')}

What I need from you now:
${task}

Boundaries for our work:
- Where my notes set a length, format or other constraint, follow it. Any suggested size or structure in this brief is only a default for when I have not said.
${brief.promptRules.map((rule) => `- ${rule}`).join('\n')}
- Use official sources for factual claims. If you cannot open a source, say so and ask for its text rather than claiming you checked it.
- Keep sources and uncertainty visible. Make suggestions inspectable, challengeable and revisable.
- Help me decide how to check whether the result is useful to the person I am making it for. Do not pretend a test or human review happened.
- I own the choices, evidence checks and final judgement. AI assistance is material for me to evaluate; it is not proof of my understanding.`;
}

/** Longest encoded link we trust a tool to accept; longer briefs open the tool empty and rely on the copied text. */
export const PREFILL_URL_LIMIT = 6000;

export interface AiTool { name: string; url: string; prefill?: (text: string) => string }

/** Gemini has no documented plain-chat parameter, so it opens empty and the learner pastes. */
export const AI_TOOLS: AiTool[] = [
  { name: 'ChatGPT', url: 'https://chatgpt.com/', prefill: (text) => `https://chatgpt.com/?q=${encodeURIComponent(text)}` },
  { name: 'Claude', url: 'https://claude.ai/', prefill: (text) => `https://claude.ai/new?q=${encodeURIComponent(text)}` },
  { name: 'Gemini', url: 'https://gemini.google.com/' },
];

export function toolLink(tool: AiTool, text: string): { href: string; prefilled: boolean } {
  const filled = tool.prefill?.(text);
  return filled && filled.length <= PREFILL_URL_LIMIT ? { href: filled, prefilled: true } : { href: tool.url, prefilled: false };
}

/** The dialog's fine print about sending, true to whether this text fits in any tool's link. */
export function sendingNote(text: string): string {
  const filled = AI_TOOLS.filter((tool) => toolLink(tool, text).prefilled).map((tool) => tool.name);
  return `Agents of Change sends nothing itself. ${filled.length
    ? `Opening ${filled.join(' or ')} puts it in the link so it lands in their box, and you press send when you are ready.`
    : 'It’s too long to fit in a link, so opening a tool copies it for you to paste in, and you press send when you are ready.'}`;
}
