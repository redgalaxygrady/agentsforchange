import type { Brief } from '../../src/brief';

/**
 * A made-up brief for rehearsing a swap. No real group asked for this; it is here so the
 * tests can prove nothing about the live brief is left in the workspace's own code.
 */
export const PRACTICE_BRIEF: Brief = {
  title: 'Get a backyard trap working',
  titleEmphasis: 'trap working',
  task: 'Talk to the trapping group and the people this affects, then make something that helps one person set their first trap.',
  audienceIdeas: [
    'My aunt, who was given a trap and never set it',
    'A flatmate who is squeamish about rats',
    'A neighbour who wants to help the birds but isn’t sure how',
  ],
  starter: 'Start by helping me work out where the trap should go and what to do first. I’ll check it with the trapping group.',
  sources: [
    { id: 'doc', title: 'Department of Conservation', url: 'https://www.doc.govt.nz/', description: 'Official guidance on predator control. Check trap advice against it.' },
    { id: 'pfnz', title: 'Predator Free NZ', url: 'https://predatorfreenz.org/', description: 'Guidance for backyard trappers. Check local group details with the partner.' },
  ],
  factCheckIntro: 'AI tools get details wrong. Check general facts here, and local details with the partner.',
  factQuestionsPlaceholder: 'Which bait works best? Who do I tell what I caught?',
  promptIntro: 'I am doing “Get a backyard trap working”, a practice brief made up to test Agents of Change: help someone set their first backyard trap and keep checking it. No real group asked for this.',
  promptRules: [
    'Do not invent trap models, prices, local group contacts or council rules.',
    'Do not give advice on poisons. Point to official guidance instead.',
    'Distinguish general information from local arrangements that I must check with the partner.',
  ],
  recordLabel: 'backyard trapping practice brief',
  affiliation: 'A practice brief made up to test Agents of Change. No real group asked for this.',
};
