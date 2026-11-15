import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Copy, ExternalLink, X } from 'lucide-react';
import { Wordmark } from './Brand';
import { downloadFile } from './download';
import { blobToDataUrl, deleteImage, getImage, prepareImage, putImage } from './images';
import {
  AI_TOOLS, hasWork, initialLaunch, launchPrompt, loadLaunch, loadLaunchStage, LAUNCH_STORAGE_KEY,
  newVersion, saveLaunch, saveLaunchStage, sendingNote, toolLink, withoutVersion,
  type LaunchState, type LaunchStep, type MomentKind, type TextField, type VersionField,
} from './launchModel';
import { BoardStage } from './BoardStage';
import { ExampleRecord } from './ExampleRecord';
import { EXAMPLE_HASH } from './exampleProject';
import { briefFor, chosenChallenge, orgFor } from './orgs';
import { StartStage } from './StartStage';
import { MakeStage } from './MakeStage';
import { RecordStage } from './RecordStage';
import './launch.css';

const stages: { id: LaunchStep; label: string; short: string }[] = [
  { id: 'start', label: 'Brief', short: 'Brief' },
  { id: 'try', label: 'Make & try', short: 'Make' },
  { id: 'keep', label: 'Your record', short: 'Record' },
];

export default function Launchpad() {
  const [loaded] = useState(loadLaunch);
  const [loadedStage] = useState(loadLaunchStage);
  const [state, setState] = useState<LaunchState>(loaded.state);
  const stateRef = useRef(state);
  const [warning, setWarning] = useState(loaded.warning);
  const [saveError, setSaveError] = useState('');
  const [hasSavedCopy, setHasSavedCopy] = useState(() => {
    try { return globalThis.localStorage.getItem(LAUNCH_STORAGE_KEY) !== null; }
    catch { return false; }
  });
  const [preserveSavedCopy, setPreserveSavedCopy] = useState(Boolean(loaded.warning?.includes('original saved data has not been changed')));
  const preserveRef = useRef(preserveSavedCopy);
  const [stageError, setStageError] = useState(loadedStage.warning || '');
  // Without an organisation there is nothing to brief, make or record yet, so the board comes first.
  const [step, setStep] = useState<LaunchStep>(loaded.state.projectId ? loadedStage.step : 'board');
  // The example record has its own link, so it can open straight from a slide or a message.
  const [example, setExample] = useState(() => globalThis.location?.hash === EXAMPLE_HASH);
  const [prompt, setPrompt] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [openedTool, setOpenedTool] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [images, setImages] = useState<Record<string, string | undefined>>({});
  const [imageNotes, setImageNotes] = useState<Record<string, string | undefined>>({});
  const dialog = useRef<HTMLDialogElement>(null);
  const dialogTitle = useRef<HTMLHeadingElement>(null);
  const promptText = useRef<HTMLTextAreaElement>(null);
  const promptDetails = useRef<HTMLDetailsElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // Bring back screenshots saved in this browser.
  useEffect(() => {
    let live = true;
    const created: string[] = [];
    for (const version of loaded.state.versions.filter((item) => item.hasImage)) {
      getImage(version.id).then((blob) => {
        if (!live) return;
        if (!blob) { setImageNotes((notes) => ({ ...notes, [version.id]: 'The screenshot saved for this version could not be found in this browser.' })); return; }
        const url = URL.createObjectURL(blob);
        created.push(url);
        setImages((current) => ({ ...current, [version.id]: url }));
      }).catch(() => {
        if (live) setImageNotes((notes) => ({ ...notes, [version.id]: 'This browser would not load the saved screenshot.' }));
      });
    }
    return () => { live = false; created.forEach((url) => URL.revokeObjectURL(url)); };
  }, [loaded]);

  useEffect(() => {
    const current = dialog.current;
    if (!current) return;
    if (prompt && !current.open) current.showModal();
    if (!prompt && current.open) current.close();
    if (prompt) requestAnimationFrame(() => dialogTitle.current?.focus());
  }, [prompt]);

  useEffect(() => {
    const sync = () => setExample(window.location.hash === EXAMPLE_HASH);
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    if (!example) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
    const timer = window.setTimeout(() => title.current?.focus({ preventScroll: true }), 40);
    return () => window.clearTimeout(timer);
  }, [example]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function persist(next: LaunchState) {
    const result = saveLaunch(next);
    setSaveError(result.ok ? '' : result.message || 'Unable to save. Download your record before leaving.');
    if (result.ok) {
      setWarning(null);
      setPreserveSavedCopy(false);
      preserveRef.current = false;
      setHasSavedCopy(true);
    }
  }

  function commit(change: (current: LaunchState) => LaunchState) {
    const next = change(stateRef.current);
    stateRef.current = next;
    setState(next);
    if (!preserveRef.current) persist(next);
  }

  const onField = (key: TextField, value: string) => commit((current) => ({ ...current, [key]: value }));
  const onVersionField = (id: string, field: VersionField, value: string) => commit((current) => ({
    ...current, versions: current.versions.map((version) => version.id === id ? { ...version, [field]: value } : version),
  }));
  const onMoment = (kind: MomentKind, value: string) => commit((current) => ({ ...current, moments: { ...current.moments, [kind]: value } }));

  function move(next: LaunchStep, focusId?: string) {
    if (window.location.hash === EXAMPLE_HASH) window.history.pushState(null, '', window.location.pathname + window.location.search);
    setExample(false);
    setStep(next);
    const result = saveLaunchStage(next);
    setStageError(result.ok ? '' : result.message || 'Your current stage could not be remembered.');
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.setTimeout(() => {
      const target = focusId ? document.getElementById(focusId) : null;
      if (target) { target.scrollIntoView({ block: 'center' }); target.focus({ preventScroll: true }); }
      else title.current?.focus();
    }, 40);
  }

  function addVersion(screenshot?: File) {
    const version = newVersion();
    commit((current) => ({ ...current, versions: [...current.versions, version] }));
    if (screenshot) void addImage(version.id, screenshot);
    if (step !== 'try') move('try', `ac-link-${version.id}`);
    else window.setTimeout(() => {
      const card = document.getElementById(`ac-version-${version.id}`);
      card?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      document.getElementById(`ac-link-${version.id}`)?.focus({ preventScroll: true });
    }, 60);
  }

  function dropImage(id: string) {
    setImages((current) => {
      if (current[id]) URL.revokeObjectURL(current[id]!);
      const { [id]: _removed, ...rest } = current;
      return rest;
    });
    setImageNotes((current) => ({ ...current, [id]: undefined }));
    deleteImage(id).catch(() => undefined);
  }

  function removeVersion(id: string) {
    dropImage(id);
    commit((current) => withoutVersion(current, id));
  }

  async function addImage(id: string, file: File) {
    let blob: Blob;
    try { blob = await prepareImage(file); }
    catch {
      setImageNotes((current) => ({ ...current, [id]: 'That file could not be opened as an image. Try a PNG or JPEG.' }));
      return;
    }
    setImages((current) => {
      if (current[id]) URL.revokeObjectURL(current[id]!);
      return { ...current, [id]: URL.createObjectURL(blob) };
    });
    let stored = true;
    try { await putImage(id, blob); }
    catch { stored = false; }
    setImageNotes((current) => ({ ...current, [id]: stored ? undefined : 'Shown in this tab only. This browser would not let Agents for Change keep the image, so download your record before closing.' }));
    commit((current) => ({ ...current, versions: current.versions.map((version) => version.id === id ? { ...version, hasImage: stored } : version) }));
  }

  function removeImage(id: string) {
    dropImage(id);
    commit((current) => ({ ...current, versions: current.versions.map((version) => version.id === id ? { ...version, hasImage: false } : version) }));
  }

  /** Start on an organisation from the board. The same organisation keeps its work; a new one starts fresh, keeping only the future builder's name. */
  function choose(id: string, challenge?: string) {
    const current = stateRef.current;
    if (current.projectId === id) {
      if (challenge !== undefined && challenge !== current.challenge) commit((now) => ({ ...now, challenge }));
    } else {
      current.versions.forEach((version) => dropImage(version.id));
      commit(() => ({ ...initialLaunch(), projectId: id, challenge: challenge ?? '', maker: current.maker }));
    }
    move('start');
  }

  function open() {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setCopied(false);
    setOpenedTool(null);
    setCopyFailed(false);
    if (promptDetails.current) promptDetails.current.open = false;
    setPrompt(true);
  }

  function closeDialog() {
    setPrompt(false);
    if (dialog.current?.open) dialog.current.close();
  }

  async function copyPrompt(opened?: string): Promise<boolean> {
    if (!prompt) return false;
    try {
      await navigator.clipboard.writeText(promptBody);
      setCopied(true);
      setOpenedTool(opened ?? null);
      setCopyFailed(false);
      return true;
    } catch {
      setCopied(false);
      setCopyFailed(true);
      if (promptDetails.current) promptDetails.current.open = true;
      window.setTimeout(() => { promptText.current?.focus(); promptText.current?.select(); }, 0);
      return false;
    }
  }

  /** The tool opens in a new tab. Behind it, close the dialog and wait on Make & try, so coming back lands on the next step. */
  async function openTool(name: string, prefilled: boolean) {
    if (!prompt) return;
    const copiedOk = await copyPrompt(name);
    if (!copiedOk && !prefilled) return;
    returnFocus.current = null;
    closeDialog();
    move('try');
    setNotice(!prefilled
      ? `Opened ${name}. Your brief is copied, so paste it into its box, then come back here with what you make.`
      : copiedOk
        ? `Opened ${name} with your brief in its box, and copied it too. Come back here with what you make.`
        : `Opened ${name} with your brief in its box. Come back here with what you make.`);
  }

  async function download() {
    try {
      const embedded: Record<string, string> = {};
      for (const version of state.versions) {
        const url = images[version.id];
        if (!url) continue;
        try { embedded[version.id] = await blobToDataUrl(await (await fetch(url)).blob()); }
        catch { /* A missing screenshot is left out rather than blocking the record. */ }
      }
      const { recordHTML } = await import('./recordExport');
      downloadFile('portfolio-record.html', recordHTML(state, embedded), 'text/html;charset=utf-8');
      setNotice('Your record is downloading. Read it through before you share it.');
    } catch {
      setNotice('The download could not start. Keep this tab open and try again.');
    }
  }

  const promptBody = prompt ? launchPrompt(state) : '';
  const attention = Boolean(saveError || warning || preserveSavedCopy);
  const status = saveError ? 'Not saved' : preserveSavedCopy ? 'Review saved copy' : warning ? 'Storage issue' : hasSavedCopy ? 'Saved' : 'Not saved yet';
  const stageProps = { state, titleRef: title, onField, onMove: move, onOpen: open };
  const org = orgFor(state);
  const brief = briefFor(state);

  return <div className="ac">
    <a className="ac-skip" href="#ac-main">Skip to content</a>
    <header className="ac-header">
      <div className="ac-header-inner">
        <button className="ac-brand" onClick={() => move('board')} aria-label="Agents for Change, see the problems to solve"><Wordmark/></button>
        {org && <span className="ac-project">{org.name}</span>}
        {org && <nav className="ac-steps" aria-label="Project stages">
          {stages.map((item, index) => <button key={item.id} aria-current={step === item.id ? 'step' : undefined} onClick={() => move(item.id)}>
            <b className="ac-disc">{index + 1}</b><span className="ac-steps-long">{item.label}</span><span className="ac-steps-short">{item.short}</span>
            {item.id === 'try' && state.versions.length > 0 && <i aria-label={`${state.versions.length} ${state.versions.length === 1 ? 'version' : 'versions'}`}>{state.versions.length}</i>}
          </button>)}
        </nav>}
        {(org || attention || hasSavedCopy) && <span className={`ac-save${attention ? ' is-warn' : hasSavedCopy ? ' is-ok' : ''}`} role="status">{hasSavedCopy && !attention ? <Check size={14} strokeWidth={3}/> : <span className="ac-save-dot"/>}<span>{status}</span></span>}
      </div>
    </header>

    <main className={`ac-main${step === 'board' && !example ? ' ac-main--board' : ''}`} id="ac-main">
      {attention && <div className="ac-alert" role="alert">
        <div><strong>{saveError ? 'Your latest changes are not saved.' : preserveSavedCopy ? 'Your earlier saved copy is being kept safe.' : 'Project storage needs attention.'}</strong>
          <p>{saveError || warning || 'Your current changes are only in this tab.'}{preserveSavedCopy && ' New edits stay in this tab until you choose “Save this version”.'}</p>
        </div>
        <div className="ac-alert-actions"><button onClick={() => persist(stateRef.current)}>Save this version</button><button onClick={() => { void download(); }}>Download a copy</button></div>
      </div>}
      {stageError && <p className="ac-stage-note" role="status">{stageError}</p>}

      {example && <ExampleRecord titleRef={title} onBack={() => move('board')}/>}
      {!example && step === 'board' && <BoardStage state={state} titleRef={title} busy={hasWork(state)} onChoose={choose} onContinue={() => move(state.versions.length ? 'try' : 'start')} onDownload={() => { void download(); }}/>}
      {!example && step === 'start' && <StartStage {...stageProps}/>}
      {!example && step === 'try' && <MakeStage {...stageProps} images={images} imageNotes={imageNotes} onVersionField={onVersionField} onAddVersion={addVersion} onRemoveVersion={removeVersion} onImage={addImage} onRemoveImage={removeImage}/>}
      {!example && step === 'keep' && <RecordStage {...stageProps} images={images} onDownload={download} onMoment={onMoment}/>}
    </main>

    <dialog ref={dialog} className="ac-dialog" onCancel={(event) => { event.preventDefault(); closeDialog(); }} onClose={() => { returnFocus.current?.focus(); returnFocus.current = null; }} onClick={(event) => { if (event.target === event.currentTarget) closeDialog(); }} aria-labelledby="ac-dialog-title">
      {prompt && <div className="ac-dialog-inner">
        <div className="ac-dialog-top">
          <button className="ac-icon-btn" aria-label="Close" onClick={closeDialog}><X size={20}/></button>
        </div>
        <h2 id="ac-dialog-title" ref={dialogTitle} tabIndex={-1}>Take this to your AI tool</h2>
        <p className="ac-dialog-intro">{`It sets the AI up to help you make a first version, using your choices${brief.material ? `, ${brief.material.name}` : ''} and ${brief.sources.length ? 'the fact-check kit' : 'ground rules that stop it making things up'}.`}</p>
        <dl className="ac-dialog-summary">
          {org && !org.own && <><dt>Problem</dt><dd>{chosenChallenge(state)}</dd></>}
          <dt>For</dt><dd>{state.audience.trim() || <span className="ac-muted">Not chosen yet</span>}</dd>
          <dt>Making</dt><dd>{state.format.trim() || <span className="ac-muted">Not decided yet. The AI will offer a few options.</span>}</dd>
        </dl>
        <ol className="ac-dialog-steps"><li><b>1</b>Copy it, or open a tool</li><li><b>2</b>Check it landed in your AI tool</li><li><b>3</b>Come back with what you made</li></ol>
        <div className="ac-dialog-actions">
          <button className="ac-btn ac-btn--primary" onClick={() => copyPrompt()}>{copied ? <Check size={18}/> : <Copy size={18}/>} {copied ? 'Copied' : 'Copy'}</button>
          <span className="ac-tools"><span>Open</span>{AI_TOOLS.map((tool) => { const link = toolLink(tool, promptBody); return <a key={tool.name} href={link.href} target="_blank" rel="noreferrer" onClick={() => { void openTool(tool.name, link.prefilled); }}>{tool.name}<ExternalLink size={13}/></a>; })}</span>
        </div>
        {copied && <p className="ac-ok" role="status"><Check size={16}/> {openedTool ? `Copied, and opening ${openedTool}. If its box is empty, paste it in, then come back here with what you make.` : 'Copied. Paste it into your AI tool, then come back here with what you make.'}</p>}
        {copyFailed && <p className="ac-warn" role="status">Your browser blocked copying. The full text is selected below: copy it with your device’s copy command.</p>}
        <details ref={promptDetails} className="ac-prompt">
          <summary>Read the full text first</summary>
          <label className="ac-sr" htmlFor="ac-prompt-text">Full text to paste</label>
          <textarea ref={promptText} id="ac-prompt-text" readOnly rows={12} value={promptBody}/>
        </details>
        <p className="ac-fine">Your brief goes to the AI tool as you wrote it, so leave out people’s names and anything private about them. {sendingNote(promptBody)}</p>
        <div className="ac-dialog-foot">
          <button className="ac-btn ac-btn--quiet" onClick={() => { closeDialog(); move('try'); }}>Go to Make &amp; try <ArrowRight size={17}/></button>
        </div>
      </div>}
    </dialog>

    {notice && <div className="ac-toast" role="status"><span>{notice}</span><button aria-label="Dismiss" onClick={() => setNotice('')}><X size={17}/></button></div>}
  </div>;
}
