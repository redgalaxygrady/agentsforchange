import { useState, type DragEvent } from 'react';
import { ArrowRight, ExternalLink, ImagePlus, Link2, PenLine, Plus, FileText, Trash2 } from 'lucide-react';
import { briefFor, chosenChallenge, orgFor } from './orgs';
import { nextStep, safeArtifactUrl, versionLabel, type VersionField, type WorkVersion } from './launchModel';
import type { StageProps } from './stageProps';

export interface MakeProps extends StageProps {
  images: Record<string, string | undefined>;
  imageNotes: Record<string, string | undefined>;
  onVersionField: (id: string, field: VersionField, value: string) => void;
  onAddVersion: (screenshot?: File) => void;
  onRemoveVersion: (id: string) => void;
  onImage: (id: string, file: File) => void;
  onRemoveImage: (id: string) => void;
}

function focusField(id: string) {
  const element = document.getElementById(id);
  element?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  window.setTimeout(() => element?.focus({ preventScroll: true }), 250);
}

export function MakeStage(props: MakeProps) {
  const { state, titleRef, onMove, onOpen, onAddVersion } = props;
  const step = nextStep(state);
  const latest = state.versions.at(-1);
  const n = state.versions.length;
  const ordered = state.versions.map((version, index) => ({ version, index })).reverse();

  const action = step.kind === 'brief'
    ? <button className="ac-btn ac-btn--primary" onClick={onOpen}><FileText size={17}/> Get your brief</button>
    : step.kind === 'add' && !latest
      ? <button className="ac-btn ac-btn--primary" onClick={() => onAddVersion()}><Plus size={17}/> Add version 1</button>
      : step.kind === 'add' && latest
        ? <button className="ac-btn ac-btn--primary" onClick={() => focusField(`ac-link-${latest.id}`)}>Add your work <ArrowRight size={17}/></button>
        : step.kind === 'try' && latest
          ? <button className="ac-btn ac-btn--primary" onClick={() => focusField(`ac-tried-${latest.id}`)}>Note how it went <ArrowRight size={17}/></button>
          : <div className="ac-next-actions"><button className="ac-btn ac-btn--primary" onClick={() => onAddVersion()}><Plus size={17}/> Start version {n + 1}</button><button className="ac-btn ac-btn--quiet" onClick={() => onMove('keep')}>Finish your record</button></div>;

  return <div className="ac-page ac-make">
    <header className="ac-page-head">
      <h1 ref={titleRef} tabIndex={-1}>Make it, try it, <em>make it better</em></h1>
    </header>

    <div className="ac-next" role="status">
      <span className="ac-next-label">Next</span>
      <p>{step.label}</p>
      {action}
    </div>

    <div className="ac-make-layout">
      <div className="ac-make-main">
        {n === 0 ? <EmptyWork onAdd={onAddVersion}/> : <>
          {ordered.map(({ version, index }) => <VersionCard key={version.id} {...props} version={version} index={index}/>)}
        </>}
      </div>

      <aside className="ac-make-aside" aria-label="Your brief and sources">
        <BriefCard {...props}/>
      </aside>
    </div>
  </div>;
}

/** A version tag: the latest stands out from earlier ones. */
function VersionBadge({ index, latest }: { index: number; latest: boolean }) {
  return <span className={`ac-badge${latest ? ' is-latest' : ''}`}>V{index + 1}</span>;
}

function EmptyWork({ onAdd }: { onAdd: (screenshot?: File) => void }) {
  const [drag, setDrag] = useState(false);
  const take = (files: FileList | null | undefined) => {
    const file = files ? [...files].find((item) => item.type.startsWith('image/')) : undefined;
    if (file) onAdd(file);
  };
  return <section className={`ac-empty${drag ? ' is-drag' : ''}`} aria-labelledby="ac-empty-title" onDragOver={(event) => { event.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(event) => { event.preventDefault(); setDrag(false); take(event.dataTransfer.files); }}>
    <div className="ac-empty-stack" aria-hidden="true">
      <svg viewBox="0 0 150 150" focusable="false">
        <rect x="22" y="18" width="106" height="124" rx="22" fill="#fbe3d8" filter="url(#ac-clay)" transform="translate(-14 -10) rotate(-7 75 80)"/>
        <rect x="22" y="18" width="106" height="124" rx="22" fill="#e5efe9" filter="url(#ac-clay)" transform="translate(-6 -4) rotate(-3 75 80)"/>
        <rect x="22" y="18" width="106" height="124" rx="22" fill="#f3b443" filter="url(#ac-clay)"/>
      </svg>
      <span><Plus size={22} strokeWidth={2.6}/>V1</span>
    </div>
    <h2 id="ac-empty-title">Your first version goes here</h2>
    <p>Make a first version in your AI tool, then bring it back: a screenshot, a link, or a few words about what you made. Rough is good. Version 1 is meant to be improved.</p>
    <div className="ac-empty-actions">
      <button className="ac-btn ac-btn--primary" onClick={() => onAdd()}><Plus size={17}/> Add version 1</button>
      <label className="ac-btn ac-btn--quiet ac-file-btn"><ImagePlus size={17}/> Start with a screenshot<input className="ac-sr" type="file" accept="image/*" onChange={(event) => { take(event.target.files); event.target.value = ''; }}/></label>
    </div>
  </section>;
}

function ImageSlot({ version, label, url, note, onImage, onRemoveImage }: { version: WorkVersion; label: string; url?: string; note?: string; onImage: (id: string, file: File) => void; onRemoveImage: (id: string) => void }) {
  const [drag, setDrag] = useState(false);
  const take = (files: FileList | null | undefined) => {
    const file = files ? [...files].find((item) => item.type.startsWith('image/')) : undefined;
    if (file) onImage(version.id, file);
  };
  const onDrop = (event: DragEvent) => { event.preventDefault(); setDrag(false); take(event.dataTransfer.files); };
  if (url) return <figure className="ac-shot">
    <img src={url} alt={`Screenshot of ${label.toLowerCase()}`}/>
    <figcaption>
      <label className="ac-mini-btn">Replace<input className="ac-sr" type="file" accept="image/*" onChange={(event) => { take(event.target.files); event.target.value = ''; }}/></label>
      <button className="ac-mini-btn" onClick={() => onRemoveImage(version.id)}>Remove</button>
    </figcaption>
    {note && <p className="ac-shot-note" role="status">{note}</p>}
  </figure>;
  return <div className="ac-drop-wrap">
    <label className={`ac-drop${drag ? ' is-drag' : ''}`} onDragOver={(event) => { event.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={onDrop}>
      <input className="ac-sr" type="file" accept="image/*" onChange={(event) => { take(event.target.files); event.target.value = ''; }}/>
      <ImagePlus size={26}/>
      <strong>Add a screenshot or photo</strong>
      <small>Choose a file or drop it here</small>
    </label>
    {note && <p className="ac-shot-note" role="status">{note}</p>}
  </div>;
}

function VersionCard({ state, version, index, images, imageNotes, onVersionField, onRemoveVersion, onImage, onRemoveImage, onAddVersion }: MakeProps & { version: WorkVersion; index: number }) {
  const [confirming, setConfirming] = useState(false);
  const label = versionLabel(index);
  const link = safeArtifactUrl(version.link);
  const field = (name: VersionField) => (event: { target: { value: string } }) => onVersionField(version.id, name, event.target.value);
  const tested = version.tried.trim() || version.noticed.trim();
  const isLast = index === state.versions.length - 1;

  return <article className={`ac-version${isLast ? ' is-current' : ''}`} id={`ac-version-${version.id}`} data-version={version.id} aria-label={label}>
    <header className="ac-version-head">
      <VersionBadge index={index} latest={isLast}/>
      <label className="ac-sr" htmlFor={`ac-title-${version.id}`}>Name for {label.toLowerCase()}</label>
      <input id={`ac-title-${version.id}`} className="ac-version-title" value={version.title} onChange={field('title')} placeholder={index === 0 ? 'Name it, e.g. “First rough cut”' : `Name it, e.g. “Clearer opening”`}/>
      {confirming
        ? <span className="ac-confirm"><span>Remove {label.toLowerCase()}?</span><button onClick={() => onRemoveVersion(version.id)}>Remove</button><button onClick={() => setConfirming(false)}>Keep</button></span>
        : <button className="ac-icon-btn" aria-label={`Remove ${label.toLowerCase()}`} onClick={() => setConfirming(true)}><Trash2 size={17}/></button>}
    </header>

    <div className="ac-version-body">
      <ImageSlot version={version} label={label} url={images[version.id]} note={imageNotes[version.id]} onImage={onImage} onRemoveImage={onRemoveImage}/>
      <div className="ac-version-fields">
        <div className="ac-field">
          <label htmlFor={`ac-link-${version.id}`}><Link2 size={15}/> Link to it</label>
          <input id={`ac-link-${version.id}`} className="ac-input" type="url" value={version.link} onChange={field('link')} placeholder="https://… (a shared chat, doc, page or file)" autoComplete="url"/>
          {version.link.trim() && !link && <small className="ac-hint ac-hint--warn">Kept as text. A full https:// link can be opened from your record.</small>}
          {link && <a className="ac-open" href={link} target="_blank" rel="noreferrer">Open it <ExternalLink size={14}/></a>}
        </div>
        <div className="ac-field">
          <label htmlFor={`ac-notes-${version.id}`}>What is it?</label>
          <textarea id={`ac-notes-${version.id}`} rows={Math.min(10, Math.max(2, Math.ceil(version.notes.length / 55) + version.notes.split('\n').length - 1))} value={version.notes} onChange={field('notes')} placeholder={index === 0 ? 'A one-page site with three sections, made with…' : 'What it looks or sounds like now'}/>
        </div>
        {index > 0 && <div className="ac-field">
          <label htmlFor={`ac-changed-${version.id}`}>What changed since version {index}, and why?</label>
          <textarea id={`ac-changed-${version.id}`} rows={2} value={version.changed} onChange={field('changed')} placeholder="They only had a minute, so I put what to do first at the top."/>
        </div>}
      </div>
    </div>

    <section className="ac-try" aria-label={`Try ${label.toLowerCase()}`}>
      <div className="ac-try-head"><h3>Try it</h3><p>Hand it to someone like the person you chose, without explaining. Watch where they pause. No one around? Walk through it yourself as if you were them, and say so.</p></div>
      <div className="ac-two">
        <div className="ac-field"><label htmlFor={`ac-tried-${version.id}`}>Who tried it, or how did you check?</label><textarea id={`ac-tried-${version.id}`} rows={2} value={version.tried} onChange={field('tried')} placeholder="My neighbour, on her phone"/></div>
        <div className="ac-field"><label htmlFor={`ac-noticed-${version.id}`}>What happened?</label><textarea id={`ac-noticed-${version.id}`} rows={2} value={version.noticed} onChange={field('noticed')} placeholder="She liked… but asked… She stopped at…"/></div>
      </div>
    </section>

    {isLast && <footer className="ac-version-foot">
      <button className={`ac-btn ${tested ? 'ac-btn--primary' : 'ac-btn--quiet'}`} onClick={() => onAddVersion()}><Plus size={17}/> Start version {index + 2}</button>
    </footer>}
  </article>;
}

function BriefCard({ state, onMove, onOpen }: MakeProps) {
  const brief = briefFor(state);
  const org = orgFor(state);
  const job = chosenChallenge(state);
  return <>
    <section className="ac-side-card">
      <div className="ac-side-head"><h2 className="ac-side-label">Your brief</h2><button className="ac-link" onClick={() => onMove('start', 'lp-audience')}>Edit <PenLine size={14}/></button></div>
      <dl className="ac-brief">
        {org && <><dt>Group</dt><dd>{org.name}</dd></>}
        <dt>Problem</dt><dd>{job || <span className="ac-muted">Not picked yet</span>}</dd>
        <dt>For</dt><dd>{state.audience.trim() || <span className="ac-muted">Not chosen yet</span>}</dd>
        <dt>Making</dt><dd>{state.format.trim() || <span className="ac-muted">Not decided yet</span>}</dd>
      </dl>
      <button className="ac-btn ac-btn--quiet ac-btn--full" onClick={onOpen}><FileText size={16}/> Get your brief again</button>
    </section>
    <section className="ac-side-card">
      <h2 className="ac-side-label">Fact-check kit</h2>
      <p className="ac-side-note">{brief.sources.length ? 'If your AI tool says one of these sources says something, open it and check. Tools get this wrong.' : 'This problem has no sources yet. Check facts with the group, and note what they trust.'}</p>
      {brief.sources.length > 0 && <ul className="ac-side-sources">{brief.sources.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<ExternalLink size={13}/></a></li>)}</ul>}
      <button className="ac-link" onClick={() => onMove('start', 'lp-source-notes')}>Your fact notes <ArrowRight size={14}/></button>
    </section>
  </>;
}
