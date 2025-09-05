import { Gesture } from './types';

export const GESTURE_MAP: Record<Gesture, number> = {
  [Gesture.THUMBS_UP]: 0,
  [Gesture.OPEN_PALM]: 1,
  [Gesture.PEACE_SIGN]: 2,
  [Gesture.FIST]: 3,
  [Gesture.UNKNOWN]: -1,
};

export const GESTURE_OPTIONS = [
    { gesture: Gesture.THUMBS_UP, label: 'A', icon: '👍' },
    { gesture: Gesture.OPEN_PALM, label: 'B', icon: '🖐️' },
    { gesture: Gesture.PEACE_SIGN, label: 'C', icon: '✌️' },
    { gesture: Gesture.FIST, label: 'D', icon: '✊' },
];
