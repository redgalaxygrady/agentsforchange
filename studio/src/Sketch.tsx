/**
 * The drawings: hand-inked Open Doodles by Pablo Stanley (CC0, opendoodles.com), coloured in ink and highlighter.
 * Files live in public/doodles/, one per group, named by the group's id.
 */
const DOODLES = new Set(['harbourside-food-rescue', 'northgate-food-bank', 'second-round-reuse', 'ridgeline-predator-free', 'riverbank-juniors', 'elm-street-hall', 'own']);

/** A group's drawing for the top of its card. */
export function Doodle({ id, className = 'ac-doodle' }: { id: string; className?: string }) {
  const file = DOODLES.has(id) ? id : 'own';
  return <img className={className} src={`/doodles/${file}.svg`} alt="" width="1024" height="768" loading="lazy" decoding="async"/>;
}

function Note({ x, y, lines, end = false }: { x: number; y: number; lines: string[]; end?: boolean }) {
  return <text x={x} y={y} textAnchor={end ? 'end' : 'start'}>
    {lines.map((line, index) => <tspan key={line} x={x} dy={index ? 28 : 0}>{line}</tspan>)}
  </text>;
}

/** The landing picture: someone working out a problem, with pencil notes on who does what. */
export function HeroSketch() {
  return <svg className="ac-sketch" viewBox="0 0 640 520" role="img" aria-labelledby="ac-sketch-title">
    <title id="ac-sketch-title">A drawing of a young person sitting with a book and a cup of tea, working out a problem. Pencil notes say: talk to the people first, AI drafts and sorts, I check it and decide, try it with a real person.</title>
    <defs>
      <marker id="ac-pencil-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M1 1l8 4-8 4" fill="none" stroke="#b23c17" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </marker>
    </defs>
    <image href="/doodles/sitting-reading.svg" x="40" y="60" width="560" height="420"/>
    <g className="ac-pencil" aria-hidden="true">
      <Note x={18} y={96} lines={['talk to the people', 'it’s for, first']}/>
      <path d="M232 90c40-12 70-6 100 16"/>
      <Note x={470} y={70} lines={['AI drafts', 'and sorts']}/>
      <path d="M500 116c-14 40-48 70-96 82"/>
      <Note x={20} y={470} lines={['I check it', 'and decide']}/>
      <path d="M150 440c20-24 50-42 100-50"/>
      <Note x={612} y={470} lines={['try it with', 'a real person']} end/>
    </g>
  </svg>;
}
