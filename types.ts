
export enum Screen {
  Home = 'HomeScreen',
  MoodCheck = 'MoodCheckScreen',
  Gratitude = 'GratitudeScreen',
  Move = 'MoveScreen',
  CalmZone = 'CalmZoneScreen',
  Kindness = 'KindnessScreen',
  Reflection = 'ReflectionScreen',
  AgeSelection = 'AgeSelectionScreen',
  StoryCreator = 'StoryCreatorScreen',
  LanguageSelection = 'LanguageSelectionScreen',
  RapBattle = 'RapBattleScreen',
}

export type Mood = 'Happy' | 'Sad' | 'Angry' | 'Worried' | 'Tired';

export interface MoodEntry {
  moods: Mood[];
  note: string;
  date: string;
}

export interface ReflectionEntry {
    prompt: string;
    text: string;
    date: string;
    category?: 'general' | 'gratitude';
}

export interface StoryEntry {
    title: string;
    content: string[];
    date: string;
}

export interface Points {
    gratitude: number;
    physical: number;
    kindness: number;
    creativity: number;
}

export type AgeGroup = '7-9' | '10-12' | '12+';

export type Language = 'en' | 'mk' | 'tr';
