import { Mark } from './Brand';
import type { Brief } from './brief';
import { briefFor, chosenChallenge, orgFor } from './orgs';
import { hasMoments, launchMedium, MOMENTS, safeArtifactUrl, versionLabel, type LaunchState, type WorkVersion } from './launchModel';

/** One stylesheet for the in-app preview and the downloaded page, so what you see is what you keep. */
export const RECORD_CSS = `
/* The record is the one light page: chalk paper and charcoal ink from the artwork, so it prints. Lime marks the latest version; pink holds the maker's own words. */
.rd{--rd-ink:#2B2B2B;--rd-muted:#5C5555;--rd-line:#2B2B2B24;--rd-paper:#F1E9E9;--rd-card:#F8F4F4;--rd-shade:#E8DEDE;--rd-lime:#DBFF00;--rd-pink:#F7D4D4;--rd-head:'Inter Tight Variable','Inter Variable',system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--rd-ink);background:var(--rd-paper);font:15px/1.6 'Inter Variable',system-ui,-apple-system,'Segoe UI',sans-serif;border-radius:16px;overflow:hidden;overflow-wrap:anywhere}
.rd *{box-sizing:border-box}
.rd p,.rd h1,.rd h2,.rd h3,.rd dl,.rd dd,.rd ol,.rd ul{margin:0}
.rd h1,.rd h2,.rd h3{color:var(--rd-ink);font-family:var(--rd-head);text-wrap:balance}
.rd-mast{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 40px;background:var(--rd-ink);color:var(--rd-paper);font-family:var(--rd-head);font-size:16px;font-weight:500;letter-spacing:-.01em}
.rd-band{height:8px;background:var(--rd-lime)}
.rd-cover{position:relative;background:var(--rd-shade);aspect-ratio:16/8;max-height:400px;overflow:hidden}
.rd-cover img{display:block;width:100%;height:100%;object-fit:cover;object-position:top}
.rd-cover span{position:absolute;left:16px;bottom:14px;padding:3px 10px;border-radius:6px;background:var(--rd-ink);color:var(--rd-paper);font-size:13px;font-weight:600}
.rd-head{padding:30px 40px 26px}
.rd-head h1{font-size:42px;line-height:1.04;font-weight:500;letter-spacing:-.035em}
.rd-head h1 em{font-style:normal}
.rd-by{margin-top:12px;color:var(--rd-muted);font-size:15px}
.rd-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;padding:0;list-style:none}
.rd-meta li{padding:5px 12px;border:1.5px solid var(--rd-line);border-radius:8px;background:var(--rd-card);font-size:13px}
.rd-meta b{font-weight:600}
.rd-section{padding:26px 40px;border-top:1.5px solid var(--rd-line)}
.rd-section h2{margin-bottom:16px;font-size:25px;line-height:1.15;font-weight:500;letter-spacing:-.03em}
.rd-dl{display:grid;grid-template-columns:170px minmax(0,1fr);gap:10px 20px}
.rd-dl dt{color:var(--rd-muted);font-size:13px;font-weight:600;padding-top:2px}
.rd-dl dd{white-space:pre-wrap}
.rd-none{color:var(--rd-muted);font-style:italic}
.rd-versions{display:flex;flex-direction:column;gap:16px;padding:0;list-style:none}
.rd-version{display:grid;grid-template-columns:200px minmax(0,1fr);gap:20px;padding:18px;border:1px solid var(--rd-line);border-radius:16px;background:var(--rd-card)}
.rd-version--noimg{grid-template-columns:minmax(0,1fr)}
.rd-thumb{border:1px solid var(--rd-line);border-radius:10px;overflow:hidden;background:var(--rd-shade);aspect-ratio:4/3}
.rd-thumb img{display:block;width:100%;height:100%;object-fit:cover;object-position:top}
.rd-version h3{display:flex;flex-wrap:wrap;align-items:center;gap:8px;font-size:17px;line-height:1.35;font-weight:600}
.rd-badge{display:inline-block;padding:1px 9px;border-radius:6px;background:var(--rd-shade);color:var(--rd-ink);font-size:13px;font-weight:600;font-variant-numeric:tabular-nums}
.rd-badge--latest{background:var(--rd-lime)}
.rd-version a{color:var(--rd-ink);text-decoration-thickness:1.5px;text-underline-offset:3px;word-break:break-all}
.rd-version dl{display:grid;grid-template-columns:130px minmax(0,1fr);gap:6px 16px;margin-top:12px;font-size:14px}
.rd-version dt{color:var(--rd-muted);font-weight:600}
.rd-version dd{white-space:pre-wrap}
.rd-quote{white-space:pre-wrap;padding:12px 18px;border-radius:12px;background:var(--rd-pink);font-family:var(--rd-head);font-size:16px;line-height:1.5;letter-spacing:-.005em}
.rd-moments{display:grid;gap:22px;padding:0;list-style:none}
.rd-moment h3{margin-bottom:8px;font-size:15px;line-height:1.35;font-weight:600}
.rd-reflect{display:grid;gap:16px}
.rd-reflect h3{margin-bottom:6px;font-size:14px;font-weight:600;color:var(--rd-muted)}
.rd-sources{padding-left:18px;font-size:14px}
.rd-sources li+li{margin-top:6px}
.rd-sources a{color:var(--rd-ink);text-decoration-thickness:1.5px;text-underline-offset:3px}
.rd-sources .rd-muted{color:var(--rd-muted)}
.rd-foot{padding:20px 40px 28px;border-top:1.5px solid var(--rd-line);background:var(--rd-shade);color:var(--rd-muted);font-size:12.5px;line-height:1.55}
.rd-example{margin-bottom:10px!important;color:var(--rd-ink);font-weight:600}
.rd-made{display:flex;align-items:center;gap:8px;margin-top:12px!important;color:var(--rd-ink);font-weight:600}
@media (max-width:640px){.rd-mast,.rd-head,.rd-section{padding-left:20px;padding-right:20px}.rd-foot{padding:18px 20px 24px}.rd-head h1{font-size:31px}.rd-dl,.rd-version dl{grid-template-columns:minmax(0,1fr);gap:2px 0}.rd-dl dd,.rd-version dd{margin-bottom:10px}.rd-version{grid-template-columns:minmax(0,1fr);padding:14px}.rd-cover{aspect-ratio:16/10}}
@media print{.rd{border-radius:0}.rd-version,.rd-moment{break-inside:avoid}.rd-cover{max-height:300px}.rd-mast,.rd-band,.rd-badge,.rd-quote,.rd-foot{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
`;

function Value({ text, fallback = 'Not recorded' }: { text: string; fallback?: string }) {
  return text.trim() ? <>{text}</> : <span className="rd-none">{fallback}</span>;
}

function VersionEntry({ version, index, image, latest }: { version: WorkVersion; index: number; image?: string; latest: boolean }) {
  const link = safeArtifactUrl(version.link);
  return <li className={`rd-version${image ? '' : ' rd-version--noimg'}`} id={`rd-version-${version.id}`}>
    {image && <div className="rd-thumb"><img data-ac-version={version.id} src={image} alt={`Screenshot of ${versionLabel(index).toLowerCase()}`}/></div>}
    <div>
      <h3><span className={`rd-badge${latest ? ' rd-badge--latest' : ''}`}>V{index + 1}</span>{version.title.trim() || versionLabel(index)}</h3>
      <dl>
        <dt>Work</dt>
        <dd>{link ? <a href={link} rel="noopener noreferrer">{link}</a> : version.link.trim() ? <>{version.link}</> : <span className="rd-none">No link recorded</span>}</dd>
        <dt>What it is</dt><dd><Value text={version.notes}/></dd>
        {index > 0 && <><dt>What changed</dt><dd><Value text={version.changed} fallback="No change recorded"/></dd></>}
        <dt>Tried with</dt><dd><Value text={version.tried}/></dd>
        <dt>What happened</dt><dd><Value text={version.noticed} fallback="No observations or feedback recorded"/></dd>
      </dl>
    </div>
  </li>;
}

/** One of the three moments, in the maker's own words. */
function MomentEntry({ text, heading }: { text: string; heading: string }) {
  return <li className="rd-moment">
    <h3>{heading}</h3>
    {text.trim() ? <p className="rd-quote">{text}</p> : <p className="rd-none">Not recorded</p>}
  </li>;
}

/** The brief's title, with its emphasis marked when the title ends with it. */
export function BriefTitle({ brief }: { brief: Brief }) {
  const { title, titleEmphasis } = brief;
  if (!titleEmphasis || !title.endsWith(titleEmphasis)) return <>{title}</>;
  return <>{title.slice(0, -titleEmphasis.length)}<em>{titleEmphasis}</em></>;
}

/** `example` marks a made-up record shown to explain the product, so it can never pass for a real future builder's account. */
export function RecordDocument({ state, images, example = false }: { state: LaunchState; images: Record<string, string | undefined>; example?: boolean }) {
  const latestIndex = [...state.versions].map((version, index) => ({ version, index })).reverse().find(({ version }) => images[version.id]);
  const cover = latestIndex ? images[latestIndex.version.id] : undefined;
  const latest = state.versions.at(-1);
  const brief = briefFor(state);
  const org = orgFor(state);
  return <article className="rd">
    <div className="rd-mast"><span>{example ? 'Example portfolio record (made up)' : 'Portfolio record'}</span><span>Agents for Change</span></div>
    <div className="rd-band"/>
    {cover && <div className="rd-cover"><img src={cover} alt="The latest version of the work"/><span>{versionLabel(latestIndex!.index)}</span></div>}
    <header className="rd-head">
      <h1>{latest?.title.trim() || <BriefTitle brief={brief}/>}</h1>
      <p className="rd-by">{state.maker.trim() ? `Made by ${state.maker.trim()} for the ${brief.recordLabel}` : `A ${brief.recordLabel}`}</p>
      <ul className="rd-meta">
        <li><b>For</b> {state.audience.trim() || 'audience not chosen'}</li>
        <li><b>Making</b> {launchMedium(state)}</li>
        <li><b>Versions</b> {state.versions.length}</li>
      </ul>
    </header>
    <section className="rd-section">
      <h2>Three moments</h2>
      {hasMoments(state)
        ? <ol className="rd-moments">{MOMENTS.map(({ kind, heading }) => <MomentEntry key={kind} text={state.moments[kind]} heading={heading}/>)}</ol>
        : <p className="rd-none">No moments picked out yet.</p>}
    </section>
    <section className="rd-section">
      <h2>The brief I set</h2>
      <dl className="rd-dl">
        <dt>Group</dt><dd>{org ? org.name : <span className="rd-none">Not chosen</span>}</dd>
        <dt>The problem</dt><dd><Value text={chosenChallenge(state)}/></dd>
        <dt>Who it’s for</dt><dd><Value text={state.audience}/></dd>
        <dt>What I planned to make</dt><dd>{launchMedium(state)}</dd>
        <dt>AI and me</dt><dd><Value text={state.approach}/></dd>
        <dt>Facts to check</dt><dd><Value text={state.sourceNotes}/></dd>
      </dl>
    </section>
    <section className="rd-section">
      <h2>What I made</h2>
      {state.versions.length
        ? <ol className="rd-versions">{state.versions.map((version, index) => <VersionEntry key={version.id} version={version} index={index} image={images[version.id]} latest={index === state.versions.length - 1}/>)}</ol>
        : <p className="rd-none">No versions of the work recorded yet.</p>}
    </section>
    <section className="rd-section">
      <h2>What I learned</h2>
      <div className="rd-reflect">
        <div><h3>What I can do now</h3>{state.learned.trim() ? <p className="rd-quote">{state.learned}</p> : <p className="rd-none">Not recorded</p>}</div>
        <div><h3>What I did, and where AI helped</h3>{state.aiUse.trim() ? <p className="rd-quote">{state.aiUse}</p> : <p className="rd-none">AI use not recorded. No AI contribution is inferred.</p>}</div>
      </div>
    </section>
    <section className="rd-section">
      <h2>Sources provided</h2>
      {brief.sources.length || brief.material ? <ul className="rd-sources">
        {brief.sources.map((source) => <li key={source.id}><a href={source.url} rel="noopener noreferrer">{source.title}</a></li>)}
        {brief.material && <li>{brief.material.title}, carried in the AI brief. <span className="rd-muted">{brief.material.note}</span></li>}
      </ul> : <p className="rd-none">None provided with this problem.</p>}
    </section>
    <footer className="rd-foot">{example && <p className="rd-example">A made-up example to show what a finished record looks like. The maker, the group, the people and everything above are invented.</p>}<p>This record is the maker’s own account. The work lives in the maker’s own tools; Agents for Change did not open, check or grade it. {brief.affiliation} Copying an AI prompt does not mean AI was used, and listing a source does not mean it was reviewed.</p><p className="rd-made"><Mark size={22} tone="ink"/>Recorded in Agents for Change</p></footer>
  </article>;
}

/** A self-contained page: no scripts, no network requests, screenshots embedded as data URLs. */
