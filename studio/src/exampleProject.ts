import { initialLaunch, type LaunchState } from './launchModel';
import { orgById } from './orgs';

/** Where the example record lives, so it can be linked to straight from a slide or a message. */
export const EXAMPLE_HASH = '#example-record';

const NORTHGATE = 'northgate-food-bank';

/**
 * A finished record to show what a future builder leaves with.
 * Everything in it is made up, the page around it says so, and it carries no numbers or results presented as real.
 */
export const EXAMPLE_RECORD: LaunchState = {
  ...initialLaunch(),
  projectId: NORTHGATE,
  challenge: orgById(NORTHGATE)?.challenges[0] ?? '',
  maker: 'Mia',
  audience: 'A Year 12 student who needs volunteer hours',
  format: 'A simple online signup for Saturday shifts, with a thank-you and a reminder text, and posts to find young volunteers',
  approach: 'AI helps me research how other groups find volunteers, drafts posts and messages, and suggests how to set up the signup. I talk to Hana and to students, decide what goes in, and check every detail with Hana.',
  sourceNotes: 'Which Saturday jobs are hardest to fill? What does Hana already send volunteers? Are there rules for volunteers under 18? Ask Hana, don’t guess.',
  versions: [
    {
      id: 'example-v1',
      createdAt: '',
      title: 'A signup form and three posts',
      link: 'A shared online form (Hana keeps the link)',
      notes: 'An online form for Saturday shifts that sends a thank-you straight away. Three posts for the food bank’s page, written with AI to sound like a student, not a notice board.',
      changed: '',
      tried: 'Two friends in Year 12, on their phones, and Hana',
      noticed: 'My friends skipped the post that started with “Volunteers needed”. Both stopped at the form’s home phone question. Hana said she needs to know who is coming by Thursday.',
      hasImage: false,
    },
    {
      id: 'example-v2',
      createdAt: '',
      title: 'Saturday signups in three questions',
      link: 'A shared online form (Hana keeps the link)',
      notes: 'The form asks for a name, a mobile number and which Saturday. A reminder text goes out on Thursday, and Hana gets the list that night. The posts now open with what you actually do on a Saturday morning.',
      changed: 'I cut the form to three questions because both friends stopped at the home phone question. AI suggested a reminder the night before; I moved it to Thursday because that’s when Hana needs to know.',
      tried: 'Hana and the Saturday team, over two weekends',
      noticed: 'Hana said she rang round less on Friday nights. Some students from my school signed up through the new post. One long-time volunteer still wants to sign up on paper, so the paper sheet stays.',
      hasImage: false,
    },
  ],
  moments: {
    choice: 'AI wanted to build a full volunteer app with logins. I said no: Hana and the older volunteers wouldn’t use it, so I made a simple form and kept the paper sheet.',
    evidence: 'Both friends stopped at the home phone question, so I cut the form to three questions. I kept the paper sheet because one volunteer told me she won’t use her phone for this.',
    leftWith: 'Whether under-16s can do Saturday shifts wasn’t mine to decide. I left that with Hana and the food bank’s committee, and the form says to ask.',
  },
  learned: 'I can turn a messy job into something simple that people actually use, and tell when an AI suggestion is too big for the people it’s for.',
  aiUse: 'AI drafted the posts and messages, suggested questions for the form and explained how to set up the reminder text. I interviewed Hana and two students, chose what to keep, rewrote the posts in my own voice and checked every detail with Hana. A marketing mentor helped me test which opening line worked best.',
};
