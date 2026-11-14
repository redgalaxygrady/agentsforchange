/** A link to check facts against. */
export interface Source { id: string; title: string; url: string; description: string; }

/** A small table of material, kept short enough to travel inside the AI brief. */
export interface Material {
  /** Its heading on Start and in the AI brief, such as "A month of questions". */
  title: string;
  /** How it is named mid-sentence, such as "the month of questions". */
  name: string;
  /** Where it came from. Say plainly if it is made up for practice. */
  note: string;
  columns: string[];
  rows: string[][];
}

/**
 * Everything the workspace says about one challenge: what to do, the material, the fact-check kit and the AI ground rules.
 * The organisation itself (its work, its contact, its other challenges) lives in orgs.ts.
 */
export interface Brief {
  /** Shown at the top of the record when the latest version has no name. */
  title: string;
  /** The end of the title, set in italics where the title is large. */
  titleEmphasis?: string;
  /** What the future builder does with this challenge, shown on the Brief once it is picked. */
  task?: string;
  /** Three example people a future builder might make it for. They are suggestions and never fill the field on their own. */
  audienceIdeas: [string, string, string];
  /**
   * The organisation's own material the future builder works through with an AI tool, such as a week of their records.
   * Shown on the Brief behind a "See …" toggle and carried in every AI brief. Leave it out and neither mentions it.
   */
  material?: Material;
  /** What the AI brief asks the AI tool to do first, such as working through the material. */
  starter?: string;
  /** The fact-check kit: links to check facts against. Can be empty. */
  sources: Source[];
  factCheckIntro: string;
  factQuestionsPlaceholder: string;
  /** Opens the AI brief, after which the future builder's own choices follow. */
  promptIntro: string;
  /** Ground rules for this brief, added to the general rules every brief carries. */
  promptRules: string[];
  /** Names the project in the record, as in "Made by Aroha for the …". */
  recordLabel: string;
  /** Who the brief is from, or that it is made up. Shown on the Brief and in the record. */
  affiliation: string;
}

export const FOOD_RESCUE_BRIEF: Brief = {
  title: 'Make rescued food go further',
  titleEmphasis: 'go further',
  task: 'Every week brings a different mix. Find out from Raewyn what a usual week brings, work through it with an AI tool, and make something that helps one person use it well.',
  audienceIdeas: [
    'The cook at a community lunch, who finds out that morning what’s arrived',
    'A family collecting food for the first time',
    'A volunteer packing boxes who wants to add a recipe card',
  ],
  starter: 'Start by asking me what the food rescue told me about a usual week, then help me sort it into use first, will keep, and ask the food rescue (anything cooked, at its use-by date, or damaged). I’ll decide where each item goes.',
  sources: [],
  factCheckIntro: 'AI tools get details wrong, and food safety is where it matters most. Ask Raewyn which sources the food rescue trusts, and check anything about the food with them.',
  factQuestionsPlaceholder: 'What comes in a usual week? Who checks anything cooked?',
  promptIntro: 'I am doing “Make rescued food go further”, a practice project with Harbourside Food Rescue, a made-up example: help one person use a week of food from a food rescue well. It is not commissioned or endorsed by any real food rescue.',
  promptRules: [
    'Do not decide whether food is safe to eat or to pass on, or give accept or reject rules, temperatures or time limits for any item. List the questions for the food rescue instead.',
    'Do not add dates, times, amounts, numbers of people, portions, donors, organisations or rules that I have not given you. If you use a source I have not given you, say so and name it.',
    'Keep meal ideas to food I tell you the food rescue has, plus common pantry basics, and say which basics you assumed.',
  ],
  recordLabel: 'food rescue project',
  affiliation: 'A practice project. Harbourside Food Rescue and Raewyn are made up, and no food rescue asked for this.',
};
