import type { RefObject } from 'react';
import { ArrowLeft } from 'lucide-react';
import { EXAMPLE_RECORD } from './exampleProject';
import { RECORD_CSS, RecordDocument } from './RecordDocument';

/** A finished record, clearly marked as made up, to show parents, partners and future builders what a sprint leaves them with. */
export function ExampleRecord({ titleRef, onBack }: { titleRef: RefObject<HTMLHeadingElement | null>; onBack: () => void }) {
  return <div className="ac-page ac-example">
    <style>{RECORD_CSS}</style>
    <header className="ac-page-head">
      <button className="ac-link ac-link--ink" onClick={onBack}><ArrowLeft size={16}/> Back to the problems</button>
      <h1 ref={titleRef} tabIndex={-1}>What a future builder <em>leaves with</em></h1>
      <p className="ac-lede">At the end of a four-day sprint, each future builder has a portfolio record like this one: what they made, who they tried it with, what changed, and where AI helped, in their own words.</p>
      <p className="ac-example-note"><strong>This is a made-up example.</strong> Mia, Northgate Community Food Bank, Hana and everything in this record are invented to show what a finished record looks like. It is not a real project or result.</p>
    </header>
    <div className="ac-paper" aria-label="Example portfolio record">
      <RecordDocument state={EXAMPLE_RECORD} images={{}} example/>
    </div>
  </div>;
}
