import './brand.css';
import { Tile, type TileTone } from './Tiles';

/** The mark: the lime bite tile that opens the Agents for Change lockup. */
export function Mark({ size = 28, className, tone = 'lime' }: { size?: number; className?: string; tone?: TileTone }) {
  return <Tile shape="bite" tone={tone} size={size} className={className}/>;
}

/** The mark and the wordmark, set in Inter Tight like the artwork. Size follows the parent's font size. */
export function Wordmark() {
  return <span className="ac-wordmark">
    <Mark className="ac-wordmark-mark"/>
    <span className="ac-wordmark-word">Agents for Change</span>
  </span>;
}
