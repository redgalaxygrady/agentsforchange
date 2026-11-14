import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, ExternalLink, FileText } from 'lucide-react';
import type { Material } from './brief';
import { ContactCard } from './Contact';
import { OrgLogo } from './Logos';
import { briefFor, chosenChallenge, orgFor, OWN_ID, type OrgView } from './orgs';
import type { StageProps } from './stageProps';

/** The brief's material, one click away on the Brief, so it is there to look at without reading as the answer. */
function MaterialSheet({ material }: { material: Material }) {
  return <details className="ac-material">
    <summary>See {material.name} <ChevronDown size={15}/><span>Your brief carries it to the AI tool.</span></summary>
    <div className="ac-hero-material">
      <div className="ac-sheet">
        {/* The roles keep it a table for screen readers when narrow screens restyle the rows as lines. */}
        <table role="table">
          <caption><strong>{material.title}</strong><span>{material.note}</span></caption>
          <thead role="rowgroup"><tr role="row">{material.columns.map((column) => <th key={column} scope="col" role="columnheader">{column}</th>)}</tr></thead>
          <tbody role="rowgroup">{material.rows.map((row, index) => <tr key={index} role="row">{row.map((cell, column) => <td key={column} role="cell">{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  </details>;
}

/** The organisation at the top of the Brief: who they are and who to talk to, or a form for one the future builder brought. */
function OrgHero({ org, state, titleRef, onField, onMove }: { org: OrgView } & Pick<StageProps, 'state' | 'titleRef' | 'onField' | 'onMove'>) {
  const back = <button className="ac-link ac-link--ink" onClick={() => onMove('board')}><ArrowLeft size={16}/> Change group</button>;
  if (org.own) {
    return <section className="ac-org-hero ac-org-hero--own" aria-labelledby="ac-start-title">
      <div className="ac-org-hero-copy">
        {back}
        <div className="ac-org-name"><OrgLogo id={OWN_ID} size={64}/><h1 id="ac-start-title" ref={titleRef} tabIndex={-1}>{state.customOrg.trim() || 'Your own group'}</h1></div>
        <p className="ac-org-lede">Tell your AI tool who they are. Only what you write here goes in your brief, so keep it to what you know.</p>
      </div>
      <div className="ac-own-form">
        <div className="ac-field"><label htmlFor="lp-custom-org">Who are they?</label><input id="lp-custom-org" className="ac-input" value={state.customOrg} onChange={(event) => onField('customOrg', event.target.value)} placeholder="Riverside Netball Club, the school library…"/></div>
        <div className="ac-field"><label htmlFor="lp-custom-about">What do they do? <span className="ac-soft">optional</span></label><textarea id="lp-custom-about" rows={3} value={state.customAbout} onChange={(event) => onField('customAbout', event.target.value)} placeholder="Who they help, and how. A sentence or two is plenty."/></div>
      </div>
    </section>;
  }
  return <section className="ac-org-hero" aria-labelledby="ac-start-title">
    <div className="ac-org-hero-copy">
      {back}
      <div className="ac-org-name"><OrgLogo id={org.id} size={64}/><div><h1 id="ac-start-title" ref={titleRef} tabIndex={-1}>{org.name}</h1><p>{org.kind} · a made-up group to practise with</p></div></div>
      <p className="ac-org-lede">{org.about}</p>
    </div>
    {org.contact && <ContactCard contact={org.contact} orgId={org.id} orgName={org.name}/>}
  </section>;
}

/** The problems an organisation would like help with. One is picked; "something else" takes the future builder's own words. */
function JobPicker({ org, state, onField }: { org: OrgView } & Pick<StageProps, 'state' | 'onField'>) {
  const picked = chosenChallenge(state);
  const listed = org.challenges.includes(picked);
  const [other, setOther] = useState(() => Boolean(state.challenge.trim()) && !org.challenges.includes(state.challenge.trim()));
  const otherOn = other || (Boolean(picked) && !listed);
  if (org.own) {
    return <div className="ac-field"><label className="ac-sr" htmlFor="lp-challenge">What could they use a hand with?</label><textarea id="lp-challenge" rows={3} value={state.challenge} onChange={(event) => onField('challenge', event.target.value)} placeholder="Something they’ve said is hard, slow or getting missed. In their words if you can."/></div>;
  }
  return <fieldset className="ac-signup" id="lp-challenge-group" tabIndex={-1}>
    <legend className="ac-sr">Pick one problem</legend>
    {org.challenges.map((challenge) => {
      const on = !otherOn && picked === challenge;
      return <label key={challenge} className={`ac-signup-row${on ? ' is-on' : ''}`}>
        <input type="radio" name="lp-challenge" checked={on} onChange={() => { setOther(false); onField('challenge', challenge); }}/>
        <span className="ac-tick" aria-hidden="true">{on && <Check size={20} strokeWidth={3.2}/>}</span>
        <span className="ac-signup-text">{challenge}{org.ready?.challenge === challenge && <small>{org.ready.label}</small>}</span>
      </label>;
    })}
    <label className={`ac-signup-row ac-signup-row--other${otherOn ? ' is-on' : ''}`}>
      <input type="radio" name="lp-challenge" checked={otherOn} onChange={() => { setOther(true); if (listed) onField('challenge', ''); }}/>
      <span className="ac-tick" aria-hidden="true">{otherOn && <Check size={20} strokeWidth={3.2}/>}</span>
      <span className="ac-signup-text">Something else they mentioned</span>
    </label>
    {otherOn && <div className="ac-field ac-custom"><label htmlFor="lp-challenge">In their words, what is it?</label><input id="lp-challenge" className="ac-input" value={listed ? '' : state.challenge} onChange={(event) => onField('challenge', event.target.value)} placeholder="Something you heard when you talked to them"/></div>}
  </fieldset>;
}

export function StartStage({ state, titleRef, onField, onMove, onOpen }: StageProps) {
  const org = orgFor(state);
  const brief = briefFor(state);
  const challenge = chosenChallenge(state);
  const hasVersions = state.versions.length > 0;
  const ready = Boolean(challenge && state.audience.trim());
  const kit = brief.sources.length ? 'the fact-check kit' : 'ground rules';
  const carries = brief.material ? `${brief.material.name} and ${kit}` : kit;

  if (!org) {
    return <div className="ac-page ac-start">
      <section className="ac-block ac-block--empty" aria-labelledby="ac-start-title">
        <h1 id="ac-start-title" ref={titleRef} tabIndex={-1}>Pick a group first</h1>
        <p>Your brief is built around a group and one of the problems they’d like help with.</p>
        <button className="ac-btn ac-btn--go" onClick={() => onMove('board')}>See who needs a hand <ArrowRight size={17}/></button>
      </section>
    </div>;
  }

  return <div className="ac-page ac-start">
    <OrgHero org={org} state={state} titleRef={titleRef} onField={onField} onMove={onMove}/>

    <section className="ac-block" aria-labelledby="ac-job-title">
      <div className="ac-block-head"><span className="ac-step">1</span><div><h2 id="ac-job-title">{org.own ? 'What problem could you help them with?' : 'Pick one problem'}</h2><p>{org.own ? 'One thing is plenty. You can sharpen it after you’ve talked to them.' : `Each is in ${org.contact?.name.split(' ')[0] ?? 'their'}’s words. Pick the one you’d most like to help with.`}</p></div></div>
      <JobPicker key={org.id} org={org} state={state} onField={onField}/>
      {challenge && brief.task && <div className="ac-job-brief" aria-live="polite">
        <p>{brief.task}</p>
        {brief.material && <MaterialSheet material={brief.material}/>}
      </div>}
    </section>

    <section className="ac-block" aria-labelledby="ac-who-title">
      <div className="ac-block-head"><span className="ac-step">2</span><div><h2 id="ac-who-title">Who are you making this for?</h2><p>Picture one real person. The more specific, the better your work will fit.</p></div></div>
      <label className="ac-sr" htmlFor="lp-audience">Who are you making this for?</label>
      <textarea id="lp-audience" rows={1} className="ac-input ac-input--big ac-grow" value={state.audience} onChange={(event) => onField('audience', event.target.value)} placeholder="Someone you could actually show it to"/>
      <div className="ac-chips" aria-label="Ideas to start from">
        <span>Ideas:</span>
        {brief.audienceIdeas.map((idea) => <button key={idea} type="button" className="ac-chip" onClick={() => onField('audience', idea)}>{idea}</button>)}
      </div>
    </section>

    <section className="ac-block" aria-labelledby="ac-what-title">
      <div className="ac-block-head"><span className="ac-step">3</span><div><h2 id="ac-what-title">What might you make? <span className="ac-soft">optional</span></h2><p>Most people decide after they’ve talked to their person. If you leave it, your brief asks the AI for a few options to take to them.</p></div></div>
      <label className="ac-sr" htmlFor="lp-format">What might you make?</label>
      <input id="lp-format" className="ac-input" value={state.format} onChange={(event) => onField('format', event.target.value)} placeholder="A poster, a page, a short video, a sign for the door…"/>
      {ready && <div className="ac-ready">
        <p>That’s enough to start. The rest of this page is optional, and your brief already carries {carries}.</p>
        <button className="ac-btn ac-btn--go" onClick={onOpen}><FileText size={17}/> Get your brief</button>
      </div>}
    </section>

    <section className="ac-block" aria-labelledby="ac-angle-title">
      <div className="ac-block-head"><span className="ac-step">4</span><div><h2 id="ac-angle-title">What will AI do, and what will you do? <span className="ac-soft">optional</span></h2><p>Rough is fine. You’ll find out more once you start.</p></div></div>
      <label className="ac-sr" htmlFor="lp-approach">What will AI do, and what will you do?</label>
      <textarea id="lp-approach" rows={3} value={state.approach} onChange={(event) => onField('approach', event.target.value)} placeholder="AI can draft and suggest. I’ll check the facts and decide what goes in."/>
    </section>

    <section className="ac-block ac-facts" aria-labelledby="ac-facts-title" id="lp-source-pack">
      <div className="ac-block-head"><span className="ac-step ac-step--quiet"><Check size={18} strokeWidth={3}/></span><div><h2 id="ac-facts-title">Fact-check kit</h2><p>{brief.factCheckIntro}</p></div></div>
      {brief.sources.length > 0 && <ul className="ac-sources">{brief.sources.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer"><strong>{source.title}</strong><ExternalLink size={14}/></a><small>{source.description}</small></li>)}</ul>}
      <div className="ac-field"><label htmlFor="lp-source-notes">{brief.sources.length ? 'Facts to use, or questions to check' : 'Sources they trust, facts to use, or questions to check'} <span className="ac-soft">optional</span></label><textarea id="lp-source-notes" rows={2} value={state.sourceNotes} onChange={(event) => onField('sourceNotes', event.target.value)} placeholder={brief.factQuestionsPlaceholder}/></div>
    </section>

    <section className="ac-launch" aria-labelledby="ac-launch-title">
      <div className="ac-launch-copy">
        <h2 id="ac-launch-title">Take your brief to an AI tool</h2>
        <p>Your brief carries {brief.material ? `your choices, ${carries}` : `your choices and ${carries}`}, plus ground rules so the AI doesn’t make things up. Paste it in and start making.</p>
      </div>
      <div className="ac-launch-actions">
        <button className="ac-btn ac-btn--go ac-btn--big" onClick={onOpen}><FileText size={18}/> Get your brief</button>
        <button className="ac-link ac-link--ink" onClick={() => onMove('try')}>{hasVersions ? 'Back to your work' : 'Already made something? Add it'} <ArrowRight size={16}/></button>
      </div>
    </section>

    <p className="ac-fineprint">{brief.affiliation}</p>
  </div>;
}
