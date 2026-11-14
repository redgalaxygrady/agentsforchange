import { ArrowRight, Download } from 'lucide-react';
import { RecordDocument, RECORD_CSS } from './RecordDocument';
import { MOMENTS, type MomentKind } from './launchModel';
import type { StageProps } from './stageProps';

/** How each moment is asked for on screen. The record itself uses the first-person headings in MOMENTS. */
const MOMENT_PROMPTS: Record<MomentKind, { id: string; label: string; placeholder: string }> = {
  choice: { id: 'lp-moment-choice', label: 'A choice you owned', placeholder: 'What you decided, and why. Saying no to an AI suggestion counts.' },
  evidence: { id: 'lp-moment-evidence', label: 'Something the evidence made you change, or keep', placeholder: 'What you saw, heard or checked, and what you did about it' },
  leftWith: { id: 'lp-moment-left', label: 'Something you left with people', placeholder: 'What wasn’t yours to decide, or what you couldn’t be sure of, and who you left it with' },
};

/** Enough rows to show what the future builder has written, within limits, so long answers stay readable as they type. */
function rows(text: string, perLine: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.ceil(text.length / perLine) + text.split('\n').length - 1));
}

export function RecordStage({ state, titleRef, onField, onMove, images, onDownload, onMoment }: StageProps & {
  images: Record<string, string | undefined>;
  onDownload: () => void;
  onMoment: (kind: MomentKind, value: string) => void;
}) {
  const latest = state.versions.at(-1);
  const unwritten = MOMENTS.filter(({ kind }) => !state.moments[kind].trim());
  const gaps: { text: string; go: () => void }[] = [];
  if (!state.versions.length) gaps.push({ text: 'Add the work you made', go: () => onMove('try') });
  else if (!state.versions.some((version) => version.tried.trim() || version.noticed.trim())) gaps.push({ text: 'Try a version with someone', go: () => onMove('try', latest ? `ac-tried-${latest.id}` : undefined) });
  if (unwritten.length) gaps.push({ text: unwritten.length === MOMENTS.length ? 'Pick out your three moments' : 'Finish your three moments', go: () => onMove('keep', MOMENT_PROMPTS[unwritten[0].kind].id) });
  if (!state.audience.trim()) gaps.push({ text: 'Say who it’s for', go: () => onMove('start', 'lp-audience') });

  return <div className="ac-page ac-record">
    <style>{RECORD_CSS}</style>
    <header className="ac-page-head">
      <h1 ref={titleRef} tabIndex={-1}>Show what you made, <em>and how</em></h1>
      <p className="ac-lede">Your portfolio record tells the story behind the work: what you chose, what you tried, what changed, and what AI did. It opens with three moments you pick out. The rest builds itself from your versions.</p>
    </header>

    <div className="ac-record-layout">
      <div className="ac-record-side">
        <section className="ac-side-card" aria-labelledby="ac-moments-title">
          <h2 className="ac-side-title" id="ac-moments-title">Pick three moments</h2>
          <p className="ac-moments-intro">Your record opens with these. Say who helped, if anyone did: others in your group, an industry expert, the people you’re working with, or AI.</p>
          {MOMENTS.map(({ kind }) => {
            const prompt = MOMENT_PROMPTS[kind];
            const moment = state.moments[kind];
            return <div key={kind} className="ac-field ac-moment">
              <label htmlFor={prompt.id}>{prompt.label}</label>
              <textarea id={prompt.id} rows={rows(moment || prompt.placeholder, 26, 3, 10)} value={moment} onChange={(event) => onMoment(kind, event.target.value)} placeholder={prompt.placeholder}/>
            </div>;
          })}
        </section>

        <section className="ac-side-card">
          <h2 className="ac-side-title">Finish it</h2>
          <div className="ac-field"><label htmlFor="lp-maker">Your name <span className="ac-soft">optional</span></label><input id="lp-maker" className="ac-input" value={state.maker} onChange={(event) => onField('maker', event.target.value)} placeholder="How you’d like to be credited"/></div>
          <div className="ac-field"><label htmlFor="lp-learned">What can you do now that you couldn’t before?</label><textarea id="lp-learned" rows={3} value={state.learned} onChange={(event) => onField('learned', event.target.value)} placeholder="Something you’d do again without help next time"/></div>
          <div className="ac-field"><label htmlFor="lp-aiuse">What did you do, and where did AI help?</label><textarea id="lp-aiuse" rows={4} value={state.aiUse} onChange={(event) => onField('aiUse', event.target.value)} placeholder="What you asked it for, what you kept, what you changed or threw out, and what you checked yourself"/></div>
        </section>

        {gaps.length > 0 && <section className="ac-side-card ac-gaps">
          <h2 className="ac-side-label">Could make it stronger</h2>
          <ul>{gaps.map((gap) => <li key={gap.text}><button className="ac-link" onClick={gap.go}>{gap.text} <ArrowRight size={14}/></button></li>)}</ul>
          <small>Anything you skip shows as “not recorded”. Nothing is filled in for you.</small>
        </section>}

        <section className="ac-side-card ac-keep">
          <button className="ac-btn ac-btn--primary ac-btn--full" onClick={onDownload}><Download size={17}/> Download your record</button>
          <small>A single web page with your screenshots inside. Open it in any browser, or print it to PDF. Your work is saved in this browser only, so download a copy at the end of each session.</small>
        </section>
      </div>

      <div className="ac-paper" aria-label="Preview of your Portfolio record">
        <RecordDocument state={state} images={images}/>
      </div>
    </div>
  </div>;
}
