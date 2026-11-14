import type { Brief } from '../../src/brief';
import { PRACTICE_BRIEF } from './practiceBrief';

/**
 * The practice brief with its optional material filled in.
 * It proves those parts work for any brief, so the live brief's own tests can be replaced in a swap.
 */
export const PRACTICE_BRIEF_WITH_MATERIAL: Brief = {
  ...PRACTICE_BRIEF,
  material: {
    title: 'A month of trap checks',
    name: 'the month of trap checks',
    note: 'Made up for practice.',
    columns: ['Week', 'Trap', 'Found'],
    rows: [
      ['1', 'Back fence', 'Nothing'],
      ['2', 'Back fence', 'Rat'],
      ['3', 'Compost bin', 'Bait gone'],
    ],
  },
};
