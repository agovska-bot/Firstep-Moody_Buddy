import { Mood } from './types';

export const MOOD_OPTIONS: Mood[] = ['Happy', 'Sad', 'Angry', 'Worried', 'Tired'];

export const MOOD_EMOJIS: Record<Mood, string> = {
  Happy: '😊',
  Sad: '😢',
  Angry: '😠',
  Worried: '😟',
  Tired: '😴',
};

export const MOOD_COLORS: Record<Mood, string> = {
  Happy: 'bg-yellow-400',
  Sad: 'bg-blue-400',
  Angry: 'bg-red-400',
  Worried: 'bg-purple-400',
  Tired: 'bg-gray-400',
};

export const POINTS_PER_ACTIVITY = 10;