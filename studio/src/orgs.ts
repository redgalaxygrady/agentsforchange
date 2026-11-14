import { FOOD_RESCUE_BRIEF, type Brief } from './brief';
import type { LaunchState } from './launchModel';

export type Area = 'Food and community' | 'Volunteering' | 'Environment' | 'Sport' | 'Marketing' | 'Design';

/** The person a future builder would talk to. */
export interface Contact {
  name: string;
  role: string;
  /** A square headshot in studio/public. Without one, the card shows their initials. */
  photo?: string;
  /** One line in their own words, shown large. */
  quote: string;
  /** Everything they said, one paragraph per entry. Optional. */
  transcript?: string[];
}

/** An organisation on the board: who they are, what they do, who to talk to, and challenges they could use help with. */
export interface Org {
  id: string;
  name: string;
  /** How it is named on buttons and in the header, such as "Harbourside". */
  short: string;
  /** What kind of organisation, such as "Food rescue". */
  kind: string;
  area: Area;
  /** Their work, in two or three sentences. */
  about: string;
  contact: Contact;
  /** Current challenges, in their words. The future builder picks one. */
  challenges: string[];
  audienceIdeas: [string, string, string];
  /**
   * A challenge that comes built out, with its own task, ideas and AI ground rules for the Brief.
   * The board and the problem picker don't advertise it: problems are talked through with the group first.
   */
  ready?: { challenge: string; brief: Brief };
}

/** What the Brief and the board show about the organisation behind a project, whether from the board or brought by the future builder. */
export interface OrgView {
  id: string;
  name: string;
  short: string;
  kind: string;
  about: string;
  contact?: Contact;
  challenges: string[];
  ready?: Org['ready'];
  own: boolean;
}

export const OWN_ID = 'own';

/** A form where a community group can share a problem, such as a Google Form. Leave it empty and the board shows no button. */
export const PARTNER_SIGNUP_URL: string = '';

const FOOD_RESCUE_READY = 'Kitchens only find out what’s arrived when it turns up, and some of it won’t keep.';

export const ORGS: Org[] = [
  {
    id: 'harbourside-food-rescue', short: 'Harbourside', name: 'Harbourside Food Rescue', kind: 'Food rescue', area: 'Food and community',
    about: 'Collects good food that shops, bakeries and growers can’t sell, and passes it on to community kitchens and food banks the same week. One coordinator and about forty volunteer drivers.',
    contact: {
      name: 'Raewyn', role: 'Coordinator', photo: '/people/harbourside-food-rescue.jpg',
      quote: 'The people cooking with it only find out what’s arrived when it turns up, and some of it won’t keep.',
      transcript: [
        'Kia ora, I’m Raewyn. I coordinate the food rescue.',
        'Every week, shops, bakeries and growers give us good food they can’t sell, and we pass it on to community kitchens and food banks.',
        'The trouble is, no two weeks are the same. One week it’s eighteen loaves and a pile of salad. The next week it’s eight kilos of chicken that has to be used that day, and trays of cooked rice nobody’s quite sure about.',
        'The people cooking with it only find out what’s arrived when it turns up, and some of it won’t keep.',
        'Too much still ends up in the bin.',
        'Right now we send the kitchens the list each morning, and a few tips, and it sort of works. But we’d really like to hear your ideas, once you’ve talked to our cooks and volunteers.',
      ],
    },
    challenges: [FOOD_RESCUE_READY, 'Finding drivers for the early-morning pickups.', 'Telling donors what happened to the food they gave.'],
    audienceIdeas: FOOD_RESCUE_BRIEF.audienceIdeas,
    ready: { challenge: FOOD_RESCUE_READY, brief: FOOD_RESCUE_BRIEF },
  },
  {
    id: 'northgate-food-bank', short: 'Northgate', name: 'Northgate Community Food Bank', kind: 'Food bank', area: 'Volunteering',
    about: 'Packs food parcels on weekdays and runs a Saturday morning pantry for families who can’t get there during the week. Almost everything is done by volunteers.',
    contact: { name: 'Hana Wright', role: 'Volunteer coordinator', quote: 'Weekdays are fine. It’s Saturday mornings where I’m ringing round at nine the night before.' },
    challenges: ['Saturday shifts keep coming up short, and signups arrive on paper, by text and in passing.', 'Young volunteers often come once and don’t come back.', 'Families don’t know the Saturday pantry exists.'],
    audienceIdeas: ['A Year 12 student who needs volunteer hours', 'A parent who could bring their teenager along', 'Hana, who rings round the night before'],
  },
  {
    id: 'second-round-reuse', short: 'Second Round', name: 'Second Round Reuse Shop', kind: 'Reuse shop', area: 'Marketing',
    about: 'Sells donated furniture, tools and building materials at low prices, so good things stay out of the tip. Paid for by its sales, with a small team and weekend volunteers.',
    contact: { name: 'Dev Patel', role: 'Shop manager', quote: 'People drive past us to the tip with a perfectly good table on the trailer.' },
    challenges: ['Most people don’t know the shop takes furniture and tools.', 'Its social media posts get very few views.', 'Big donations arrive on days with no one to unload them.'],
    audienceIdeas: ['Someone clearing out a parent’s house', 'A student moving out of a flat', 'A builder with leftover materials'],
  },
  {
    id: 'ridgeline-predator-free', short: 'Ridgeline', name: 'Ridgeline Predator Free', kind: 'Conservation group', area: 'Environment',
    about: 'Neighbours and landowners trapping rats, stoats and possums along the ridge so native birds can come back. They run trap lines and trail cameras, and report to their funder each year.',
    contact: { name: 'Graham Ellis', role: 'Trap-line coordinator', quote: 'We’ve got eleven thousand photos on a hard drive, and I’ve looked at maybe two hundred.' },
    challenges: ['Thousands of camera photos and no quick way to see what turned up where.', 'Trap checks drop off over winter.', 'New neighbours don’t know how to join.'],
    audienceIdeas: ['A volunteer checking one trap line', 'Graham, writing the yearly report', 'A neighbour thinking of joining'],
  },
  {
    id: 'riverbank-juniors', short: 'Riverbank Juniors', name: 'Riverbank Juniors Football Club', kind: 'Sports club', area: 'Sport',
    about: 'Runs Saturday football for about 200 children aged five to twelve, coached by parents. A committee of six does everything else, from registrations to the canteen.',
    contact: { name: 'Lisa Tan', role: 'Club secretary', quote: 'New families turn up to the wrong field, in the rain, and we never see them again.' },
    challenges: ['Families who join mid-season don’t know where to go or who to ask.', 'Finding enough parent coaches each season.', 'Game-day changes reach families too late.'],
    audienceIdeas: ['A parent new to town', 'An eight-year-old at their first game', 'A volunteer coach with no spare time'],
  },
  {
    id: 'elm-street-hall', short: 'Elm Street Hall', name: 'Elm Street Community Hall', kind: 'Community hall', area: 'Design',
    about: 'A hall run by a volunteer committee and hired out for classes, meetings and parties. The hire money keeps the doors open.',
    contact: { name: 'Pat O’Connor', role: 'Committee chair', quote: 'Half my week is answering “is the hall free on Friday?”' },
    challenges: ['Booking means ringing three different people.', 'The price list is a photo of a whiteboard.', 'Regular groups don’t know about each other.'],
    audienceIdeas: ['A dance group looking for a weekly space', 'Someone planning a 21st', 'The volunteer who holds the keys'],
  },
];

export const AREAS: Area[] = ORGS.map((org) => org.area).filter((area, index, all) => all.indexOf(area) === index);

export function orgById(id: string): Org | undefined {
  return ORGS.find((org) => org.id === id);
}

export function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]!.toUpperCase()).join('');
}

/** The organisation behind a project, or null before one is chosen. */
export function orgFor(state: Pick<LaunchState, 'projectId' | 'customOrg' | 'customAbout'>): OrgView | null {
  if (state.projectId === OWN_ID) {
    const name = state.customOrg.trim();
    return { id: OWN_ID, name: name || 'Your own organisation', short: name || 'Your own', kind: 'Bring your own', about: state.customAbout.trim(), challenges: [], own: true };
  }
  const org = orgById(state.projectId);
  return org ? { ...org, own: false } : null;
}

const UNDERSTAND_FIRST = 'Start by helping me understand the job: ask me what I found out from the people involved, and list what I still need to ask them. I’ll decide what matters.';

const GENERAL_RULES = [
  'Do not invent facts about the organisation: names, dates, prices, rules, numbers or what it already does. List those as questions for the people involved.',
  'If you use a source outside what I give you, say so and name it.',
];

const NO_CHALLENGE = 'I haven’t picked one yet.';

/** The last two words of a name, set in italics where it is large. */
function emphasis(name: string): string | undefined {
  const words = name.trim().split(/\s+/);
  return words.length > 2 ? words.slice(-2).join(' ') : undefined;
}

/** A lighter brief for any other challenge an organisation lists. */
export function orgBrief(org: Org, challenge: string): Brief {
  const whose = org.contact.name.split(' ')[0];
  return {
    title: org.name,
    titleEmphasis: emphasis(org.name),
    task: `Talk to ${whose} and the people this affects, then work with an AI tool to make something that helps one of them.`,
    audienceIdeas: org.audienceIdeas,
    starter: UNDERSTAND_FIRST,
    sources: [],
    factCheckIntro: `AI tools get details wrong. Ask ${whose} which sources they trust, and note what you find here.`,
    factQuestionsPlaceholder: 'What do they already do about this? Who could I talk to?',
    promptIntro: `I am working with ${org.name}, a ${org.kind.toLowerCase()} (a made-up example for practice). What they do: ${org.about} The challenge I picked: ${challenge.trim() || NO_CHALLENGE}`,
    promptRules: GENERAL_RULES,
    recordLabel: `${org.name} project`,
    affiliation: `${org.name} is a made-up example organisation, and no one has asked for this.`,
  };
}

/** A brief for an organisation and challenge the future builder brought themselves. */
export function ownBrief(state: Pick<LaunchState, 'customOrg' | 'customAbout' | 'challenge'>): Brief {
  const org = state.customOrg.trim();
  const about = state.customAbout.trim();
  return {
    title: org || 'My own project',
    titleEmphasis: org ? emphasis(org) : 'own project',
    task: 'Find out more from the people this affects, then work with an AI tool to make something that helps one of them.',
    audienceIdeas: ['Someone from the group who has this challenge', 'A person the group is trying to reach', 'Someone new to the group'],
    starter: UNDERSTAND_FIRST,
    sources: [],
    factCheckIntro: `AI tools get details wrong. Ask ${org || 'them'} which sources they trust, and note what you find here.`,
    factQuestionsPlaceholder: 'What do they already do about this? Who could I talk to?',
    promptIntro: `I am working with ${org || 'an organisation I chose'}, which I brought myself.${about ? ` What they do: ${about}` : ''} The challenge I picked: ${state.challenge.trim() || NO_CHALLENGE}`,
    promptRules: GENERAL_RULES,
    recordLabel: 'project the maker brought',
    affiliation: `The maker brought this organisation and challenge${org ? `: ${org}` : ''}. Nobody else has checked this record.`,
  };
}

/** The challenge a project is working on: the one picked, or the built-out one by default. */
export function chosenChallenge(state: Pick<LaunchState, 'projectId' | 'challenge'>): string {
  if (state.challenge.trim()) return state.challenge.trim();
  return orgById(state.projectId)?.ready?.challenge ?? '';
}

/** The brief a project is built around: the built-out one, a lighter one for an organisation's other challenges, or the future builder's own. */
export function briefFor(state: Pick<LaunchState, 'projectId' | 'challenge' | 'customOrg' | 'customAbout'>): Brief {
  if (state.projectId === OWN_ID) return ownBrief(state);
  const org = orgById(state.projectId);
  if (!org) return FOOD_RESCUE_BRIEF;
  if (org.ready && chosenChallenge(state) === org.ready.challenge) return org.ready.brief;
  return orgBrief(org, state.challenge);
}
