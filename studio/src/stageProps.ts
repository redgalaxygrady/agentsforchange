import type { RefObject } from 'react';
import type { LaunchState, LaunchStep, TextField } from './launchModel';

export interface StageProps {
  state: LaunchState;
  titleRef: RefObject<HTMLHeadingElement | null>;
  onField: (key: TextField, value: string) => void;
  onMove: (step: LaunchStep, focusId?: string) => void;
  /** Open the brief, ready to take to an AI tool. */
  onOpen: () => void;
}
