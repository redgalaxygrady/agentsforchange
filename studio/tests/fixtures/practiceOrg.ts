import type { OrgView } from '../../src/orgs';

/** A made-up group for rehearsing a swap, with a contact who says more than one line. */
export const PRACTICE_ORG: OrgView = {
  id: 'practice-trappers', name: 'Backyard Trappers Practice Group', short: 'Backyard Trappers', kind: 'Trapping group',
  about: 'Gives out backyard traps and helps people keep them checked.',
  contact: { name: 'Sam Rua', role: 'Trap library volunteer', quote: 'Half the traps we give out never get set.', transcript: ['We give out traps every month.', 'Half the traps we give out never get set.'] },
  challenges: ['Half the traps we give out never get set.', 'People stop checking traps after a month.'],
  own: false,
};
