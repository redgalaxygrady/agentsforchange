import './brand.css';

/**
 * The mark: a thumbprint pressed into a pat of marigold clay. Someone made this, by hand.
 * `clay` lights it with the page's clay filter; leave it off where <ClayDefs/> is not mounted, such as the downloaded record.
 */
export function Mark({ size = 28, className, clay = false }: { size?: number; className?: string; clay?: boolean }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <rect x="4" y="5" width="56" height="54" rx="20" fill="#f3b443" filter={clay ? 'url(#ac-clay-sm)' : undefined}/>
    <g fill="none" stroke="#b9741b" strokeWidth="2.6" strokeLinecap="round" opacity=".85">
      <path d="M32 22c-6 0-10.5 4.6-10.5 10.4 0 4.3 2 8 5.2 10.3"/>
      <path d="M32 27c-3.2 0-5.6 2.5-5.6 5.6 0 2.4 1.1 4.4 2.9 5.7"/>
      <path d="M32 32.2c0 2.6.9 5.2 2.6 7.2"/>
      <path d="M37 24.6c2.9 1.8 4.9 5 4.9 8.6 0 4.4-1.6 8-4.1 10.6"/>
      <path d="M36.6 30.4c.6 1 1 2.1 1 3.4 0 2.6-.7 4.9-2 6.8"/>
      <path d="M26.2 17.6c1.8-.7 3.7-1.1 5.8-1.1 8.7 0 15.6 7.2 15.6 16.2 0 3.5-.7 6.8-2 9.8"/>
      <path d="M21 21c-2.6 2.9-4.2 6.8-4.2 11.2 0 4.8 1.7 9 4.6 12.1"/>
    </g>
  </svg>;
}

/** The mark and the wordmark, set in Caprasimo. Size follows the parent's font size. */
export function Wordmark({ light = false, clay = false }: { light?: boolean; clay?: boolean }) {
  return <span className={`ac-wordmark${light ? ' is-light' : ''}`}>
    <Mark className="ac-wordmark-mark" clay={clay}/>
    <span className="ac-wordmark-word">Agents for Change</span>
  </span>;
}
