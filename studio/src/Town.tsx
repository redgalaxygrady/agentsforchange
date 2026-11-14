import type { ReactNode } from 'react';
import { OWN_ID } from './orgs';

/**
 * The landing picture: a small town modelled in clay on an island in the harbour.
 * Each group on the board has a piece here, and the empty plot is for a group you bring.
 * Pieces are links to their group's card, and lift when that group is pointed at.
 */
const SKIN = ['#e3b48c', '#a8714f', '#6b4630'];

function Person({ x, y, body, skin, flip = false }: { x: number; y: number; body: string; skin: string; flip?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${flip ? -1.25 : 1.25} 1.25)`}>
    <path d="M-12 26c0-20 4-32 12-32s12 12 12 32z" fill={body} filter="url(#ac-clay)"/>
    <circle cx="0" cy="-15" r="10" fill={skin} filter="url(#ac-clay)"/>
  </g>;
}

function Tree({ x, y, r = 22, leaf = '#5f9e57' }: { x: number; y: number; r?: number; leaf?: string }) {
  return <g>
    <rect x={x - 4} y={y - 6} width="8" height={r + 6} rx="4" fill="#8a5a33" filter="url(#ac-clay)"/>
    <circle cx={x} cy={y - r * .55} r={r} fill={leaf} filter="url(#ac-clay)"/>
  </g>;
}

const PIECES: { id: string; label: string; art: ReactNode }[] = [
  {
    id: 'ridgeline-predator-free', label: 'Ridgeline Predator Free',
    art: <>
      <path d="M112 262c22-74 120-92 168-8z" fill="#4c8547" filter="url(#ac-clay)"/>
      <rect x="166" y="210" width="38" height="22" rx="6" fill="#9a6538" filter="url(#ac-clay)"/>
      <rect x="174" y="216" width="11" height="10" rx="3" fill="#3d2414"/>
      <path d="M228 246v10M238 246v10" stroke="#c9a46a" strokeWidth="3" strokeLinecap="round"/>
      <ellipse cx="234" cy="236" rx="17" ry="13" fill="#7a5537" filter="url(#ac-clay)"/>
      <circle cx="250" cy="230" r="7" fill="#7a5537" filter="url(#ac-clay)"/>
      <path d="M255 232q9 6 13 18" fill="none" stroke="#e2c58f" strokeWidth="3" strokeLinecap="round"/>
    </>,
  },
  {
    id: 'elm-street-hall', label: 'Elm Street Community Hall',
    art: <>
      <rect x="418" y="178" width="96" height="64" rx="8" fill="#f6efe3" filter="url(#ac-clay)"/>
      <path d="M406 186L466 140l60 46z" fill="#7b3f63" filter="url(#ac-clay)"/>
      <rect x="456" y="208" width="22" height="34" rx="6" fill="#5c2c4a"/>
      <circle cx="436" cy="206" r="8" fill="#8fc3e8"/>
      <circle cx="497" cy="206" r="8" fill="#8fc3e8"/>
    </>,
  },
  {
    id: 'harbourside-food-rescue', label: 'Harbourside Food Rescue',
    art: <>
      <rect x="120" y="300" width="112" height="60" rx="14" fill="#f6efe3" filter="url(#ac-clay)"/>
      <rect x="226" y="318" width="40" height="42" rx="12" fill="#f6efe3" filter="url(#ac-clay)"/>
      <rect x="236" y="324" width="22" height="16" rx="5" fill="#8fc3e8"/>
      <rect x="128" y="326" width="96" height="10" rx="5" fill="#ef7a5a"/>
      <circle cx="152" cy="364" r="13" fill="#2b2a28" filter="url(#ac-clay)"/>
      <circle cx="238" cy="364" r="13" fill="#2b2a28" filter="url(#ac-clay)"/>
      <rect x="280" y="330" width="44" height="32" rx="7" fill="#f3b443" filter="url(#ac-clay)"/>
      <ellipse cx="294" cy="326" rx="15" ry="9" fill="#dca866" filter="url(#ac-clay)"/>
      <ellipse cx="313" cy="324" rx="12" ry="9" fill="#e8c03a" filter="url(#ac-clay)"/>
    </>,
  },
  {
    id: 'northgate-food-bank', label: 'Northgate Community Food Bank',
    art: <>
      <path d="M342 296c4-10 16-16 22-4" fill="none" stroke="#6fae6a" strokeWidth="9" strokeLinecap="round" filter="url(#ac-clay)"/>
      <rect x="338" y="296" width="50" height="60" rx="9" fill="#c99a62" filter="url(#ac-clay)"/>
      <circle cx="380" cy="292" r="10" fill="#ef7a5a" filter="url(#ac-clay)"/>
    </>,
  },
  {
    id: 'second-round-reuse', label: 'Second Round Reuse Shop',
    art: <>
      <rect x="410" y="262" width="12" height="52" rx="6" fill="#a8683a" filter="url(#ac-clay)"/>
      <rect x="410" y="300" width="46" height="14" rx="6" fill="#c07b45" filter="url(#ac-clay)"/>
      <rect x="412" y="312" width="9" height="30" rx="4" fill="#8a5530" filter="url(#ac-clay)"/>
      <rect x="445" y="312" width="9" height="30" rx="4" fill="#8a5530" filter="url(#ac-clay)"/>
    </>,
  },
  {
    id: 'riverbank-juniors', label: 'Riverbank Juniors Football Club',
    art: <>
      <path d="M478 336v-52h76v52" fill="none" stroke="#fdf8ee" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" filter="url(#ac-clay)"/>
      <path d="M490 292v40M504 292v40M518 292v40M532 292v40M544 292v40M484 304h66M484 318h66" stroke="#fdf8ee" strokeWidth="1.4" opacity=".55"/>
      <circle cx="526" cy="372" r="12" fill="#fdf8ee" filter="url(#ac-clay)"/>
    </>,
  },
];

const CROPS: Record<string, string> = {
  'ridgeline-predator-free': '104 160 176 110',
  'elm-street-hall': '396 128 146 124',
  'harbourside-food-rescue': '108 282 232 104',
  'northgate-food-bank': '316 270 96 100',
  'second-round-reuse': '390 250 90 104',
  'riverbank-juniors': '462 270 108 122',
};

/** The colour of paper each group's card sits on, picked from its piece of the town. */
export const TINTS: Record<string, string> = {
  'ridgeline-predator-free': '#dcebd3',
  'elm-street-hall': '#efdfe8',
  'harbourside-food-rescue': '#fbe6b8',
  'northgate-food-bank': '#fbe0d5',
  'second-round-reuse': '#f0e2cf',
  'riverbank-juniors': '#d9eaf5',
};

/** One group's piece of the town on its own, for the top of its card. */
export function Piece({ id }: { id: string }) {
  const piece = PIECES.find((item) => item.id === id);
  const crop = CROPS[id];
  if (!piece || !crop) return null;
  const [x, y, w, h] = crop.split(' ').map(Number);
  return <svg className="ac-piece" viewBox={`${x - 40} ${y - 6} ${w + 80} ${h + 22}`} preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
    <ellipse cx={x + w / 2} cy={y + h + 2} rx={w / 2 + 34} ry="15" fill="#7fb56c" filter="url(#ac-clay)"/>
    <g className="ac-piece-art">{piece.art}</g>
  </svg>;
}

export function Town({ lifted, onPick }: { lifted?: string | null; onPick?: (id: string) => void }) {
  return <svg className="ac-town" viewBox="64 118 548 352" role="img" aria-labelledby="ac-town-title">
    <title id="ac-town-title">A small town modelled in clay on an island in the harbour: a food rescue van with crates of bread, a bag of groceries, a chair from the reuse shop, a hall, a football goal, and a trap with a kiwi on the ridge. There is an empty plot for a group you bring yourself.</title>
    <g fill="none" stroke="#8fc3e8" strokeWidth="5" strokeLinecap="round" opacity=".7">
      <path d="M64 168c10-8 20-8 30 0s20 8 30 0"/>
      <path d="M520 132c10-8 20-8 30 0s20 8 30 0"/>
      <path d="M560 440c10-8 20-8 30 0"/>
      <path d="M70 420c10-8 20-8 30 0s20 8 30 0"/>
    </g>
    <path d="M92 270c-8-70 100-112 206-104 102-14 236 4 272 80 34 70-14 162-112 178-100 22-238 18-316-22-56-30-46-86-50-132z" transform="translate(0 22)" fill="#3f7343" filter="url(#ac-clay)"/>
    <path d="M92 270c-8-70 100-112 206-104 102-14 236 4 272 80 34 70-14 162-112 178-100 22-238 18-316-22-56-30-46-86-50-132z" fill="#7fb56c" filter="url(#ac-clay)"/>
    <Tree x={318} y={208} r={20}/>
    <Tree x={350} y={222} r={15} leaf="#8cc07a"/>
    <Tree x={560} y={262} r={17}/>
    {PIECES.map((piece) => <a key={piece.id} href={`#ac-org-${piece.id}`} className={`ac-town-piece${lifted === piece.id ? ' is-lifted' : ''}`} aria-label={piece.label} onClick={() => onPick?.(piece.id)}>
      <title>{piece.label}</title>
      {piece.art}
    </a>)}
    <a href="#ac-org-own" className={`ac-town-piece ac-town-plot${lifted === OWN_ID ? ' is-lifted' : ''}`} aria-label="An empty plot for a group you bring" onClick={() => onPick?.(OWN_ID)}>
      <title>An empty plot for a group you bring</title>
      <ellipse cx="330" cy="414" rx="46" ry="17" fill="#6a9f5a" stroke="#fdf8ee" strokeWidth="3" strokeDasharray="7 7"/>
      <path d="M330 404v20M320 414h20" stroke="#fdf8ee" strokeWidth="4" strokeLinecap="round"/>
    </a>
    <Person x={196} y={402} body="#7b3f63" skin={SKIN[1]}/>
    <Person x={228} y={410} body="#f3b443" skin={SKIN[0]} flip/>
    <Person x={428} y={392} body="#8fc3e8" skin={SKIN[2]}/>
    <Person x={462} y={398} body="#ef7a5a" skin={SKIN[0]} flip/>
  </svg>;
}
