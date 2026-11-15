import type { CSSProperties, ReactNode } from 'react';

/**
 * The tiles from the Agents for Change artwork: rounded squares with a shape cut out, so the page shows through.
 * The paths are the artwork's own, on a 200 by 200 square centred on the origin.
 */
export const TILE_PATHS = {
  /** A pill with a bite out of each side and a hole in the middle. */
  bite: 'M50 -100L-50 -100C-74.2169 -100 -94.4127 -82.7836 -99.0155 -59.9226C-97.9972 -59.974 -96.9723 -60 -95.9412 -60C-62.8041 -60 -35.9412 -33.1371 -35.9412 0C-35.9412 33.1371 -62.8041 60 -95.9412 60C-96.9723 60 -97.9972 59.974 -99.0155 59.9226C-94.4127 82.7836 -74.2169 100 -50 100L50 100C74.2169 100 94.4127 82.7836 99.0155 59.9226C97.9972 59.974 96.9723 60 95.9412 60C62.8041 60 35.9412 33.1371 35.9412 0C35.9412 -33.1371 62.8041 -60 95.9412 -60C96.9723 -60 97.9972 -59.974 99.0155 -59.9226C94.4127 -82.7836 74.2169 -100 50 -100ZM-23 0C-23 12.7025 -12.7025 23 0 23C12.7025 23 23 12.7025 23 0C23 -12.7025 12.7025 -23 0 -23C-12.7025 -23 -23 -12.7025 -23 0Z',
  /** A gear ring with a hole in the middle. */
  gear: 'M50 -100L-50 -100C-77.6142 -100 -100 -77.6142 -100 -50L-100 50C-100 77.6142 -77.6142 100 -50 100L50 100C77.6142 100 100 77.6142 100 50L100 -50C100 -77.6142 77.6142 -100 50 -100ZM26.5517 72.6914C26.5526 77.2775 22.8354 80.9959 18.2494 80.9967L-19.143 81.0033C-23.7291 81.0041 -27.4474 77.2869 -27.4483 72.7009C-27.4491 68.1148 -30.6696 62.5387 -34.6418 60.2463L-35.5246 59.7369C-39.4967 57.4445 -45.9359 57.4457 -49.9073 59.7394C-53.8784 62.0331 -58.9572 60.6732 -61.2511 56.702L-79.9529 24.3225C-82.2466 20.3513 -80.8867 15.2725 -76.9153 12.9787C-72.9442 10.685 -69.7255 5.10779 -69.7263 0.521702L-69.7264 -0.497532C-69.7271 -5.08362 -72.9478 -10.6597 -76.92 -12.952C-80.8919 -15.2444 -82.2536 -20.3227 -79.9614 -24.2948L-61.2708 -56.6807C-58.9785 -60.6528 -53.9002 -62.0145 -49.9281 -59.7221C-45.9561 -57.4298 -39.5167 -57.4309 -35.5453 -59.7246L-34.6628 -60.2344C-30.6916 -62.5282 -27.4729 -68.1053 -27.4737 -72.6914C-27.4745 -77.2775 -23.7574 -80.9959 -19.1713 -80.9967L18.221 -81.0033C22.8072 -81.0041 26.5255 -77.2869 26.5264 -72.7009C26.5271 -68.1148 29.7478 -62.5387 33.7198 -60.2463L34.6026 -59.7369C38.5748 -57.4445 45.014 -57.4457 48.9853 -59.7394C52.9566 -62.0331 58.0354 -60.6732 60.3291 -56.702L79.0309 -24.3225C81.3246 -20.3513 79.9648 -15.2725 75.9936 -12.9787C72.0222 -10.685 68.8035 -5.1078 68.8044 -0.521709L68.8046 0.497536C68.8053 5.08362 72.0259 10.6597 75.998 12.952C79.9702 15.2444 81.3318 20.3227 79.0395 24.2948L60.3489 56.6807C58.0565 60.6528 52.9783 62.0145 49.0061 59.7221C45.0341 57.4298 38.5948 57.4309 34.6235 59.7246L33.741 60.2344C29.7696 62.5282 26.5509 68.1053 26.5517 72.6914ZM20 0C20 11.0457 11.0457 20 3.05176e-05 20C-11.0457 20 -20 11.0457 -20 0C-20 -11.0457 -11.0457 -20 3.05176e-05 -20C11.0457 -20 20 -11.0457 20 0Z',
  /** Four linked dots, like a molecule. */
  molecule: 'M50 -100L-50 -100C-77.6143 -100 -100 -77.6142 -100 -50L-100 50C-100 77.6143 -77.6143 100 -50 100L50 100C77.6143 100 100 77.6143 100 50L100 -50C100 -77.6142 77.6143 -100 50 -100ZM18.82 -66.29C20.06 -62.57 19.73 -58.44 21.35 -54.89L21.36 -54.88L21.4301 -54.7299C23.75 -50.25 29.21 -47.02 34.05 -45.58C37.7061 -44.5354 40.6804 -45.6903 43.8091 -46.9052C45.5326 -47.5744 47.3029 -48.2619 49.26 -48.61C51.41 -49.01 53.6201 -49.04 55.77 -48.7C63.09 -47.61 69.31 -41.87 71.32 -34.7899C75.7001 -21.02 62.77 -6.89996 48.72 -10.12C42.49 -11.38 37.02 -16.18 34.73 -22.16C33.5 -25.16 33.07 -28.25 31.66 -31.0999C28.79 -36.57 22.01 -40.32 16.49 -42.15C13.1588 -43.1926 9.89935 -42.4605 6.60217 -41.7199C6.00952 -41.5868 5.41571 -41.4534 4.82001 -41.33C-0.143555 -40.0617 -5.14026 -41.599 -9.87415 -43.0553C-10.3286 -43.1951 -10.7806 -43.3342 -11.23 -43.4699C-18.24 -45.33 -29.46 -38.9 -31.85 -32.13C-33.02 -28.77 -33.29 -25.13 -34.8799 -21.82C-38.17 -14.42 -46.3099 -9.56998 -54.35 -10.55C-76.45 -13.38 -77.8199 -44.24 -56.3099 -49.3C-54.12 -49.75 -51.85 -49.81 -49.6299 -49.4799C-47.7994 -49.2255 -46.106 -48.6797 -44.4434 -48.1439C-41.7278 -47.2687 -39.0943 -46.42 -36.08 -46.91C-30.85 -47.88 -23.72 -51.82 -20.94 -56.92C-19.17 -60.3399 -19.04 -64.3499 -17.5499 -67.91C-14.72 -75.29 -7.16998 -80.31 0.72998 -80.05C8.95007 -79.9699 16.5 -74.18 18.82 -66.29ZM-71.51 34.48C-76.98 12.45 -47.8099 -0.159973 -36.0699 19.6L-36.09 19.59L-35.99 19.76C-32.83 24.66 -34.04 31.7 -31.15 36.19C-26.7999 41.97 -18.33 46.73 -11.21 43.6C-6.46997 41.54 -1.09998 40.08 4.06 41.45C5.39233 41.7567 6.62787 42.1516 7.81458 42.5309C9.99463 43.2276 12.0103 43.8719 14.16 43.8201C20.16 43.41 26.29 39.8 30.1 35.18C33.23 30.91 32.73 24.34 35.92 19.74C41.63 9.99002 55.47 7.50003 64.22 14.67C74.39 22.25 73.96 38.6501 63.6801 45.98C58.64 49.84 51.6901 50.67 45.77 48.64C45.194 48.4645 44.6359 48.2836 44.0894 48.1066C41.6472 47.3153 39.4406 46.6003 36.9401 46.7801C31.79 47.14 24.05 51.55 21.23 56.1C19.17 59.43 19.1 63.51 17.71 67.2401C13 81.2401 -5.98999 84.59 -15.26 73.16C-19.47 68.61 -19.33 61.93 -22.61 56.9901C-26.23 52.23 -34.17 47.33 -40.4 47.16C-42.388 47.1481 -44.3016 47.5933 -46.2401 48.0441C-47.5582 48.3508 -48.8878 48.66 -50.26 48.83C-59.72 50.34 -69.21 43.69 -71.51 34.48Z',
} as const;

export type TileShape = keyof typeof TILE_PATHS;
export type TileTone = 'lime' | 'pink' | 'chalk' | 'ink';
/** The artwork's colours. Ink is the charcoal ground, for a tile on a light page such as the record. */
export const TILE_TONES: Record<TileTone, string> = { lime: '#DBFF00', pink: '#FFB5B5', chalk: '#F1E9E9', ink: '#2B2B2B' };
/** Quarter-turns, as the artwork sets the same tile on its side. */
export type TileTurn = 0 | 1 | 2 | 3;
export interface TileSpec { shape: TileShape; tone: TileTone; turn: TileTurn }

export function Tile({ shape, tone, turn = 0, size, className, style }: Partial<TileSpec> & { shape: TileShape; tone: TileTone; size?: number; className?: string; style?: CSSProperties }) {
  return <svg className={`ac-tile ac-tile--${tone}${className ? ` ${className}` : ''}`} viewBox="-100 -100 200 200" width={size} height={size} style={{ ...style, ['--turn' as string]: `${turn * 90}deg` }} aria-hidden="true" focusable="false">
    <path fill={TILE_TONES[tone]} fillRule="evenodd" transform="scale(1,-1)" d={TILE_PATHS[shape]}/>
  </svg>;
}

const t = (shape: TileShape, tone: TileTone, turn: TileTurn = 0): TileSpec => ({ shape, tone, turn });

/** Each group's three tiles, so groups are told apart at a glance. A group without its own set gets one from its id. */
const ORG_TILES: Record<string, [TileSpec, TileSpec, TileSpec]> = {
  'harbourside-food-rescue': [t('bite', 'pink'), t('gear', 'lime'), t('molecule', 'chalk', 1)],
  'northgate-food-bank': [t('molecule', 'lime'), t('bite', 'chalk', 1), t('gear', 'pink')],
  'second-round-reuse': [t('gear', 'chalk', 1), t('molecule', 'pink'), t('bite', 'lime')],
  'ridgeline-predator-free': [t('molecule', 'pink', 1), t('gear', 'lime', 1), t('bite', 'chalk')],
  'riverbank-juniors': [t('bite', 'lime', 1), t('molecule', 'chalk'), t('gear', 'pink', 1)],
  'elm-street-hall': [t('gear', 'pink'), t('bite', 'chalk'), t('molecule', 'lime', 1)],
};
const SHAPES: TileShape[] = ['bite', 'gear', 'molecule'];
const TONES: TileTone[] = ['lime', 'pink', 'chalk'];

export function orgTiles(id: string): [TileSpec, TileSpec, TileSpec] {
  const known = ORG_TILES[id];
  if (known) return known;
  const seed = [...id].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7);
  return [0, 1, 2].map((index) => t(SHAPES[(seed + index) % 3], TONES[(seed >> 2 + index) % 3], ((seed >> 4 + index) % 4) as TileTurn)) as [TileSpec, TileSpec, TileSpec];
}

/** A group's tiles in a row, at the top of its entry on the board. */
export function OrgTiles({ id, size = 56 }: { id: string; size?: number }) {
  return <span className="ac-org-tiles" aria-hidden="true">
    {orgTiles(id).map((tile, index) => <Tile key={index} {...tile} size={size}/>)}
  </span>;
}

/** An empty slot: where something of yours goes. */
export function EmptyTile({ size = 56, children }: { size?: number; children?: ReactNode }) {
  return <span className="ac-tile-slot" style={{ width: size, height: size }} aria-hidden="true">{children}</span>;
}

/** The landing grid, set like the artwork: four across, three down. On phones only the first row shows. */
const HERO_TILES: TileSpec[] = [
  t('bite', 'lime'), t('gear', 'lime'), t('molecule', 'pink'), t('gear', 'pink', 1),
  t('molecule', 'lime', 1), t('bite', 'pink', 1), t('molecule', 'pink'), t('molecule', 'chalk', 1),
  t('gear', 'chalk'), t('bite', 'pink'), t('gear', 'chalk', 1), t('molecule', 'chalk'),
];

export function HeroTiles() {
  return <div className="ac-hero-tiles" aria-hidden="true">
    {HERO_TILES.map((tile, index) => <Tile key={index} {...tile} style={{ ['--i' as string]: index }}/>)}
  </div>;
}
