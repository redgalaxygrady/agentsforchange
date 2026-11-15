import { useState, type ReactNode, type RefObject } from 'react';
import { ArrowDown, ArrowRight, Download, Plus } from 'lucide-react';
import { Avatar } from './Contact';
import { OrgLogo } from './Logos';
import type { LaunchState } from './launchModel';
import { EXAMPLE_HASH } from './exampleProject';
import { AREAS, ORGS, OWN_ID, orgFor, PARTNER_SIGNUP_URL, type Area, type Org } from './orgs';
import { EmptyTile, HeroTiles, OrgTiles, Tile } from './Tiles';

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

function Card({ org, current, pending, onPick, replace }: { org: Org; current: boolean; pending: boolean; onPick: (challenge?: string) => void; replace: ReactNode }) {
  return <article className={`ac-card${current ? ' is-current' : ''}`} id={`ac-org-${org.id}`} aria-labelledby={`ac-org-${org.id}-name`}>
    <div className="ac-card-stage"><OrgTiles id={org.id}/></div>
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
          <span className="ac-problem-dot" aria-hidden="true"/>
          <span className="ac-problem-text">{challenge}</span>
          <ArrowRight className="ac-problem-go" size={18} aria-hidden="true"/>
        </button>
      </li>)}
    </ul>
    {pending ? replace : <button className="ac-btn ac-btn--quiet ac-card-go" onClick={() => onPick()}>{current ? `Carry on with ${org.short}` : `Work with ${org.short}`} <ArrowRight size={17}/></button>}
  </article>;
}

export function BoardStage({ state, titleRef, busy, onChoose, onContinue, onDownload }: BoardProps) {
  const [area, setArea] = useState<Area | null>(null);
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
                <a className="ac-link ac-link--ink" href="#ac-groups">Or see the other problems <ArrowDown size={16}/></a></>
              : <a className="ac-btn ac-btn--go ac-btn--big" href="#ac-groups">See the problems to solve <ArrowDown size={19}/></a>}
          </div>
        </div>
        <figure className="ac-hero-art">
          <HeroTiles/>
          <figcaption>
            <ol className="ac-hero-how" aria-label="How it works">
              <li>Talk to the people it’s for, first</li>
              <li>AI drafts and sorts</li>
              <li>I check it and decide</li>
              <li>Try it with a real person</li>
            </ol>
          </figcaption>
        </figure>
      </div>
    </section>

    <section className="ac-parents" aria-labelledby="ac-parents-title">
      <div className="ac-parents-copy">
        <h2 id="ac-parents-title">For parents and whānau</h2>
        <p className="ac-parents-big">Real work with AI, in your community, in four days.</p>
        <p className="ac-parents-lede">Employers want young people who can use AI to solve real problems. School mostly prepares them for exams, and can’t easily give every teen a real project with a local group. That’s what a sprint does.</p>
        <a className="ac-btn ac-btn--quiet" href={EXAMPLE_HASH}>See a finished record <ArrowRight size={17}/></a>
        <p className="ac-parents-note">A made-up example of what a future builder leaves with.</p>
      </div>
      <ul className="ac-parents-points">
        <li><strong>For 16 to 18-year-olds who are keen.</strong> It works best when your teen wants to do it.</li>
        <li><strong>In person, over four days.</strong> Future builders work in a room together with a facilitator, the way a modern team does.</li>
        <li><strong>Matched by hand.</strong> Each future builder is paired with a local group and a problem that fits what they’re into, like sport, design or marketing, with an industry expert from that field.</li>
        <li><strong>Something to show for it.</strong> A portfolio record of what they made, what AI did and what they decided, shared at a portfolio fair at the end.</li>
      </ul>
    </section>

    {featured && <section className="ac-meet" aria-labelledby="ac-meet-title">
      <figure className="ac-meet-photo">
        <Avatar contact={featured.contact} size={132} orgId={featured.id}/>
        <Tile shape="gear" tone="lime" turn={1}/>
        <Tile shape="bite" tone="pink"/>
        <Tile shape="molecule" tone="chalk"/>
      </figure>
      <div className="ac-meet-copy">
        <blockquote><h2 id="ac-meet-title">“{featured.contact.quote}”</h2></blockquote>
        <p className="ac-meet-who"><strong>{featured.contact.name}</strong>, {featured.contact.role.toLowerCase()} at {featured.name}</p>
        <p className="ac-meet-note">Start with a conversation: hear what’s going on, then decide together what to work on.</p>
        {pending?.id === featured.id && pending.from === 'tag' ? replace(featured.name) : <button className="ac-btn ac-btn--go" onClick={() => pick(featured.id, undefined, 'tag')}>Work with {featured.short} <ArrowRight size={17}/></button>}
      </div>
    </section>}

    <section className="ac-groups" id="ac-groups" aria-labelledby="ac-groups-title">
      <div className="ac-groups-head">
        <h2 id="ac-groups-title">Problems to solve</h2>
        <p>These groups are made up, so you can practise. In a sprint, your facilitator matches you with a real group near you, based on what you’re into, and you meet the people behind them. Whichever problem you pick, your brief carries their story, your choices and ground rules for the AI.</p>
      </div>
      <div className="ac-filter" role="group" aria-label="Show groups working on">
        <button aria-pressed={area === null} onClick={() => setArea(null)}>Everything</button>
        {AREAS.map((item) => <button key={item} aria-pressed={area === item} onClick={() => setArea(item)}>{item}</button>)}
      </div>
      <div className="ac-cards">
        {shown.map((org) => <Card key={org.id} org={org} current={current?.id === org.id} pending={pending?.id === org.id && pending.from === 'sheet'} onPick={(challenge) => pick(org.id, challenge)} replace={replace(org.name)}/>)}
        <article className={`ac-card ac-card--own${current?.id === OWN_ID ? ' is-current' : ''}`} id="ac-org-own" aria-labelledby="ac-org-own-name">
          <div className="ac-card-stage"><span className="ac-org-tiles" aria-hidden="true"><Tile shape="molecule" tone="chalk" size={56}/><Tile shape="bite" tone="lime" turn={1} size={56}/><EmptyTile/></span></div>
          <header className="ac-card-head">
            <OrgLogo id={OWN_ID} size={52}/>
            <div><h3 id="ac-org-own-name">Bring your own group</h3><p>A club, a shop, a charity, a school group</p></div>
          </header>
          <p className="ac-card-about">Know a group near you with a problem they’d love a hand with? Bring them, and the problem in their words. The brief works the same way.</p>
          {pending?.id === OWN_ID ? replace('your own group') : <button className="ac-btn ac-btn--quiet ac-card-go" onClick={() => pick(OWN_ID)}><Plus size={17}/> {current?.id === OWN_ID ? 'Carry on with your group' : 'Bring your own'}</button>}
        </article>
      </div>
    </section>

    <section className="ac-partners" aria-labelledby="ac-partners-title">
      <h2 id="ac-partners-title">Run a community group?</h2>
      <p>Tell us about a problem you’d love a hand with, in a few sentences and in your own words. We match it with a future builder who’s into that kind of work, and you meet them in person. You get real work done, and they get real experience.</p>
      {PARTNER_SIGNUP_URL && <a className="ac-btn ac-btn--quiet" href={PARTNER_SIGNUP_URL} target="_blank" rel="noreferrer">Share a problem <ArrowRight size={17}/></a>}
    </section>
  </div>;
}
