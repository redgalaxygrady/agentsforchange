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
  task: 'Every week brings a different mix. Work through a week of Harbourside’s donations with an AI tool, and make something that helps one person use it well.',
  audienceIdeas: [
    'The cook at a community lunch, who finds out that morning what’s arrived',
    'A family collecting food for the first time',
    'A volunteer packing boxes who wants to add a recipe card',
  ],
  material: {
    title: 'A week of donations',
    name: 'the week of donations',
    note: 'Made up for practice. With a real community partner, it’s their own list.',
    columns: ['Day', 'What', 'From', 'Label'],
    rows: [
      ['Mon', '18 sourdough loaves', 'A bakery', 'Best before Tue'],
      ['Mon', '24 bags of mixed salad', 'A supermarket', 'Use by Tue'],
      ['Mon', '30 cheese scones', 'A café', 'Baked today'],
      ['Tue', '9 pumpkins, some marked', 'A grower', 'No label'],
      ['Tue', '12 tubs of yoghurt, 1\u00a0kg', 'A supermarket', 'Use by Thu'],
      ['Wed', '2 crates of spotty bananas', 'A supermarket', 'No label'],
      ['Wed', '4 trays of cooked rice', 'A café', 'Cooked yesterday'],
      ['Thu', '40 dented cans of tomatoes', 'A wholesaler', 'Best before 2027'],
      ['Thu', '8\u00a0kg of chicken thighs', 'A supermarket', 'Use by Thu'],
      ['Fri', '15 bunches of silverbeet', 'A grower', 'No label'],
      ['Fri', '60 fruit buns', 'A bakery', 'Best before Sat'],
      ['Fri', '20 bottles of milk, 2\u00a0L', 'A supermarket', 'Use by Sun'],
    ],
  },
  starter: 'Start by helping me sort the week of donations into use first, will keep, and ask the food rescue (anything cooked, at its use-by date, or damaged). I’ll decide where each item goes.',
  sources: [
    { id: 'dates', title: 'Best before and use by dates', url: 'https://www.mpi.govt.nz/food-safety-home/how-read-food-labels', description: 'From the Ministry for Primary Industries: what the two date marks mean. Check anything about dates against it.' },
    { id: 'donating', title: 'Donating food', url: 'https://www.mpi.govt.nz/dmsdocument/3783-Donations-of-food-from-commercial-sources', description: 'Official guidance for businesses donating food. Food past its use-by date must not be donated.' },
    { id: 'storing', title: 'How to store food', url: 'https://lovefoodhatewaste.co.nz/storage-tips/', description: 'Love Food Hate Waste’s A to Z of keeping food fresh for longer. Check storage tips against it.' },
  ],
  factCheckIntro: 'AI tools get details wrong, and food safety is where it matters most. Check dates and storage here, and anything about this week’s food with the food rescue itself.',
  factQuestionsPlaceholder: 'Who do I ask about the cooked rice? What can someone do with 18 loaves?',
  promptIntro: 'I am doing “Make rescued food go further”, a practice project with Harbourside Food Rescue, a made-up example: help one person use a week of food from a food rescue well. It is not commissioned or endorsed by any real food rescue.',
  promptRules: [
    'Do not decide whether food is safe to eat or to pass on, or give accept or reject rules, temperatures or time limits for any item. List the questions for the food rescue instead.',
    'Do not add dates, times, amounts, numbers of people, portions, donors, organisations or rules that are not in this brief. If you use a source outside this pack, say so and name it.',
    'Keep meal ideas to food in the list plus common pantry basics, and say which basics you assumed.',
  ],
  recordLabel: 'food rescue project',
  affiliation: 'A practice project. Harbourside Food Rescue, Raewyn and the week of donations are made up, and no food rescue asked for this.',
};
