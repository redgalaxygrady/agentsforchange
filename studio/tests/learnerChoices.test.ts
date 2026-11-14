import { describe, expect, it } from 'vitest';
import { initialLaunch, launchPrompt, nextStep } from '../src/launchModel';

describe('the future builder’s own constraints come first', () => {
  it('keeps a length they chose and treats suggested sizes as defaults', () => {
    const state = { ...initialLaunch(), format: 'A 45-second welcome for someone nervous about going alone' };
    const prompt = launchPrompt(state);
    expect(prompt).toContain('45-second');
    expect(prompt).toContain('Any suggested size or structure in this brief is only a default for when I have not said.');
  });
});

describe('deciding what to make after talking to the person', () => {
  const undecided = () => ({ ...initialLaunch(), audience: 'The cook at a community lunch' });

  it('is enough to start once there is someone it is for', () => {
    expect(nextStep(undecided()).kind).toBe('add');
    expect(nextStep(initialLaunch()).kind).toBe('brief');
  });

  it('asks the AI for options to take to the person, not a finished thing', () => {
    const prompt = launchPrompt(undecided());
    expect(prompt).toContain('because I want to talk to the person first');
    expect(prompt).toContain('let me pick before making anything');
  });
});
