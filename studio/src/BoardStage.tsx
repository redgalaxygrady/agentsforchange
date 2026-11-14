import { useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { ArrowDown, ArrowRight, Download, Plus } from 'lucide-react';
import { Avatar } from './Contact';
import { OrgLogo } from './Logos';
import type { LaunchState } from './launchModel';
import { AREAS, ORGS, OWN_ID, orgFor, type Area, type Org } from './orgs';
import { ClayRing } from './Clay';
import { Piece, TINTS, Town } from './Town';

export interface BoardProps {
  state: LaunchState;
  titleRef: RefObject<HTMLHeadingElement | null>;
  /** Whether the current project has work a future builder would mind losing. */
  busy: boolean;
  /** Start working with an organisation, on one of its challenges when picked from the board. */
  onChoose: (id: string, challenge?: string) => void;
  onContinue: () => void;
  onDownload: () => void;
}

/** The inline check before a new organisation replaces work already here. */
function Replace({ name, current, onYes, onNo, onDownload }: { name: string; current: string; onYes: () => void; onNo: () => void; onDownload: () => void }) {
  return <div className="ac-replace" role="alert">
    <p><strong>Start fresh with {name}?</strong> What you’ve made for {current} in this browser will be replaced. Download your record first if you want to keep it.</p>
    <div>
      <button className="ac-btn ac-btn--go" onClick={onYes}>Start fresh</button>
      <button className="ac-btn ac-btn--quiet" onClick={onDownload}><Download size={16}/> Download my record</button>
      <button className="ac-link" onClick={onNo}>Keep my project</button>
    </div>
  </div>;
}

function Card({ org, current, pending, onPick, onPoint, replace }: { org: Org; current: boolean; pending: boolean; onPick: (challenge?: string) => void; onPoint: (id: string | null) => void; replace: ReactNode }) {
  return <article className={`ac-card${org.ready ? ' is-ready' : ''}${current ? ' is-current' : ''}`} style={{ '--tint': TINTS[org.id] ?? '#e2ede6' } as CSSProperties} id={`ac-org-${org.id}`} aria-labelledby={`ac-org-${org.id}-name`} onPointerEnter={() => onPoint(org.id)} onPointerLeave={() => onPoint(null)} onFocus={() => onPoint(org.id)} onBlur={() => onPoint(null)}>
    <div className="ac-card-stage"><Piece id={org.id}/></div>
    <header className="ac-card-head">
      <OrgLogo id={org.id} size={52}/>
      <div>
        <h3 id={`ac-org-${org.id}-name`}>{org.name}</h3>
        <p>{org.kind} · {org.area}</p>
      </div>
    </header>
    {current && <p className="ac-card-yours">You’re working with them</p>}
    <p className="ac-card-about">{org.about}</p>
    <figure className="ac-say">
      <Avatar contact={org.contact} size={52}/>
      <div>
        <figcaption><strong>{org.contact.name}</strong> <span>{org.contact.role}</span></figcaption>
        <blockquote><p>“{org.contact.quote}”</p></blockquote>
      </div>
    </figure>
    <h4 className="ac-card-problems">Problems they’d like help with</h4>
    <ul className="ac-problems">
      {org.challenges.map((challenge) => <li key={challenge}>
        <button className="ac-problem" onClick={() => onPick(challenge)} aria-label={`Work with ${org.short} on: ${challenge}`}>
          <span className="ac-problem-text">{challenge}</span>
          {org.ready?.challenge === challenge ? <span className="ac-problem-ready">Ready to go</span> : <ArrowRight className="ac-problem-go" size={18} aria-hidden="true"/>}
        </button>
      </li>)}
    </ul>
    {org.ready && <p className="ac-carries">Ready to go. {org.ready.label}.</p>}
    {pending ? replace : <button className="ac-btn ac-btn--quiet ac-card-go" onClick={() => onPick()}>{current ? `Carry on with ${org.short}` : `Work with ${org.short}`} <ArrowRight size={17}/></button>}
  </article>;
}

export function BoardStage({ state, titleRef, busy, onChoose, onContinue, onDownload }: BoardProps) {
  const [area, setArea] = useState<Area | null>(null);
  const [point, setPoint] = useState<string | null>(null);
  const [pending, setPending] = useState<{ id: string; challenge?: string; from: 'tag' | 'sheet' } | null>(null);
  const current = orgFor(state);
  const featured = ORGS.find((org) => org.ready);
  const shown = ORGS.filter((org) => !area || org.area === area);

  function pick(id: string, challenge?: string, from: 'tag' | 'sheet' = 'sheet') {
    if (busy && current && id !== current.id) setPending({ id, challenge, from });
    else { setPending(null); onChoose(id, challenge); }
  }
  const replace = (name: string) => <Replace name={name} current={current?.name ?? 'your project'} onDownload={onDownload} onNo={() => setPending(null)} onYes={() => { const next = pending; setPending(null); if (next) onChoose(next.id, next.challenge); }}/>;

  return <div className="ac-board">
    <section className="ac-hero" aria-labelledby="ac-board-title">
      <div className="ac-hero-inner">
        <div className="ac-hero-copy">
          <h1 id="ac-board-title" ref={titleRef} tabIndex={-1}>Shape something good for the people <em>around you.</em></h1>
          <p className="ac-hero-lede">Groups near you have problems they’d love a hand with. Pick one, work out what AI does and what you do yourself, try it with real people, and show your working.</p>
          <div className="ac-hero-actions">
            {current
              ? <><button className="ac-btn ac-btn--go ac-btn--big" onClick={onContinue}>Carry on with {current.short} <ArrowRight size={19}/></button>
                <a className="ac-link ac-link--light" href="#ac-groups">Or see the other problems <ArrowDown size={16}/></a></>
              : <a className="ac-btn ac-btn--go ac-btn--big" href="#ac-groups">See the problems to solve <ArrowDown size={19}/></a>}
          </div>
        </div>
        <figure className="ac-hero-art">
          <Town lifted={point}/>
        </figure>
      </div>
    </section>

    {featured && <section className="ac-meet" aria-labelledby="ac-meet-title">
      <figure className="ac-meet-photo">
        <ClayRing size={168} pad={14}><Avatar contact={featured.contact} size={168} orgId={featured.id}/></ClayRing>
      </figure>
      <div className="ac-meet-copy">
        <blockquote><h2 id="ac-meet-title">“{featured.contact.quote}”</h2></blockquote>
        <p className="ac-meet-who"><strong>{featured.contact.name}</strong>, {featured.contact.role.toLowerCase()} at {featured.name}</p>
        <p className="ac-meet-note">{featured.ready?.label}, so you can start straight away.</p>
        {pending?.id === featured.id && pending.from === 'tag' ? replace(featured.name) : <button className="ac-btn ac-btn--go" onClick={() => pick(featured.id, undefined, 'tag')}>Work with {featured.short} <ArrowRight size={17}/></button>}
      </div>
    </section>}

    <section className="ac-groups" id="ac-groups" aria-labelledby="ac-groups-title">
      <div className="ac-groups-head">
        <h2 id="ac-groups-title">Problems to solve</h2>
        <p>These groups are made up, so you can practise. In a sprint, they’re real groups near you, and you meet the people behind them. Whichever problem you pick, your brief carries their story, your choices and ground rules for the AI.</p>
      </div>
      <div className="ac-filter" role="group" aria-label="Show groups working on">
        <button aria-pressed={area === null} onClick={() => setArea(null)}>Everything</button>
        {AREAS.map((item) => <button key={item} aria-pressed={area === item} onClick={() => setArea(item)}>{item}</button>)}
      </div>
      <div className="ac-cards">
        {shown.map((org) => <Card key={org.id} org={org} current={current?.id === org.id} pending={pending?.id === org.id && pending.from === 'sheet'} onPick={(challenge) => pick(org.id, challenge)} onPoint={setPoint} replace={replace(org.name)}/>)}
        <article className={`ac-card ac-card--own${current?.id === OWN_ID ? ' is-current' : ''}`} id="ac-org-own" aria-labelledby="ac-org-own-name" onPointerEnter={() => setPoint(OWN_ID)} onPointerLeave={() => setPoint(null)}>
          <header className="ac-card-head">
            <OrgLogo id={OWN_ID} size={52}/>
            <div><h3 id="ac-org-own-name">Bring your own group</h3><p>A club, a shop, a charity, a school group</p></div>
          </header>
          <p className="ac-card-about">Know a group near you with a problem they’d love a hand with? Bring them, and the problem in their words. The brief works the same way.</p>
          {pending?.id === OWN_ID ? replace('your own group') : <button className="ac-btn ac-btn--quiet ac-card-go" onClick={() => pick(OWN_ID)}><Plus size={17}/> {current?.id === OWN_ID ? 'Carry on with your group' : 'Bring your own'}</button>}
        </article>
      </div>
    </section>
  </div>;
}
