
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Screen, MoodEntry, Points, ReflectionEntry, AgeGroup, StoryEntry, Language } from '../types';
import { Chat } from '@google/genai';

interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  moodHistory: MoodEntry[];
  addMood: (mood: MoodEntry) => void;
  reflections: ReflectionEntry[];
  addReflection: (reflection: ReflectionEntry) => void;
  stories: StoryEntry[];
  addStory: (story: StoryEntry) => void;
  points: Points;
  addPoints: (category: keyof Points, amount: number) => void;
  totalPoints: number;
  toastMessage: string | null;
  showToast: (message: string) => void;
  streakDays: number;
  birthDate: string | null;
  setBirthDate: (date: string) => void;
  age: number | null;
  ageGroup: AgeGroup | null;
  isBirthdayToday: boolean;
  language: Language | null;
  setLanguage: (language: Language) => void;
  storyInProgress: string[];
  chatSession: Chat | null;
  startNewStory: (chat: Chat, firstSentence: string) => void;
  continueStory: (userSentence: string, aiSentence: string) => void;
  finishStory: (finalSentence: string) => void;
  resetApp: () => void;
  t: (key: string, fallback?: string) => any;
  isInstallable: boolean;
  installApp: () => void;
  activeTasks: Record<string, string | null>;
  setActiveTask: (category: string, task: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageStorage] = useLocalStorage<Language | null>('language', null);
  const [birthDate, setBirthDateStorage] = useLocalStorage<string | null>('birthDate', null);
  const [translationsData, setTranslationsData] = useState<Record<string, any> | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const age = useMemo(() => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }, [birthDate]);

  const ageGroup = useMemo((): AgeGroup | null => {
    if (age === null) return null;
    if (age < 10) return '7-9';
    if (age < 13) return '10-12';
    return '12+';
  }, [age]);

  const isBirthdayToday = useMemo(() => {
    if (!birthDate) return false;
    const today = new Date();
    const birth = new Date(birthDate);
    return today.getDate() === birth.getDate() && today.getMonth() === birth.getMonth();
  }, [birthDate]);

  useEffect(() => {
    const fetchTranslations = async () => {
        try {
            const [en, mk, tr] = await Promise.all([
                fetch('/locales/en.json').then(res => res.json()),
                fetch('/locales/mk.json').then(res => res.json()),
                fetch('/locales/tr.json').then(res => res.json())
            ]);
            setTranslationsData({ en, mk, tr });
        } catch (error) {
            console.error("Error loading translations:", error);
            setTranslationsData({ en: {}, mk: {}, tr: {} }); 
        }
    };
    fetchTranslations();
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const installApp = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  }, [deferredPrompt]);

  // КЛУЧНА ПРОМЕНА: Функција за прецизно одредување на првиот екран
  const determineInitialScreen = useCallback(() => {
    // Проверуваме директно во localStorage за да бидеме сигурни
    const savedLang = localStorage.getItem('language');
    const savedBirth = localStorage.getItem('birthDate');
    
    // Ако нешто фали, одиме на почеток
    if (!savedLang || savedLang === 'null') return Screen.LanguageSelection;
    if (!savedBirth || savedBirth === 'null') return Screen.AgeSelection;
    
    return Screen.Home;
  }, []);

  const [currentScreen, setCurrentScreen] = useState<Screen>(determineInitialScreen());
  const [moodHistory, setMoodHistory] = useLocalStorage<MoodEntry[]>('moodHistory', []);
  const [reflections, setReflections] = useLocalStorage<ReflectionEntry[]>('reflections', []);
  const [stories, setStories] = useLocalStorage<StoryEntry[]>('stories', []);
  const [points, setPoints] = useLocalStorage<Points>('points', { gratitude: 0, physical: 0, kindness: 0, creativity: 0 });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [storyInProgress, setStoryInProgress] = useState<string[]>([]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [activeTasks, setActiveTasks] = useLocalStorage<Record<string, string | null>>('activeTasks', { gratitude: null, move: null, kindness: null, calm: null });

  const t = useCallback((key: string, fallback?: string): any => {
    if (!translationsData) return fallback || key;
    const currentTranslations = language ? translationsData[language] : translationsData.en;
    if (!key || !currentTranslations) return fallback || key;
    const keys = key.split('.');
    let result: any = currentTranslations;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) return fallback || key;
    }
    return result;
  }, [language, translationsData]);
  
  const setLanguage = useCallback((lang: Language) => {
    setLanguageStorage(lang);
    setCurrentScreen(Screen.AgeSelection);
  }, [setLanguageStorage]);

  const setBirthDate = useCallback((date: string) => {
    setBirthDateStorage(date);
    setCurrentScreen(Screen.Home);
  }, [setBirthDateStorage]);

  const addMood = useCallback((mood: MoodEntry) => {
    setMoodHistory(prevHistory => [...prevHistory, mood]);
  }, [setMoodHistory]);

  const addReflection = useCallback((reflection: ReflectionEntry) => {
    setReflections(prev => [...prev, reflection]);
  }, [setReflections]);

  const addStory = useCallback((story: StoryEntry) => {
    setStories(prev => [...prev, story]);
  }, [setStories]);

  const addPoints = useCallback((category: keyof Points, amount: number) => {
    setPoints(prevPoints => ({
      ...prevPoints,
      [category]: prevPoints[category] + amount,
    }));
  }, [setPoints]);

  const setActiveTask = useCallback((category: string, task: string | null) => {
    setActiveTasks(prev => ({ ...prev, [category]: task }));
  }, [setActiveTasks]);

  return (
    <AppContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      moodHistory,
      addMood,
      reflections,
      addReflection,
      stories,
      addStory,
      points,
      addPoints,
      totalPoints: points.gratitude + points.physical + points.kindness + points.creativity,
      toastMessage,
      showToast: (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3000); },
      streakDays: 0, 
      birthDate,
      setBirthDate,
      age,
      ageGroup,
      isBirthdayToday,
      language,
      setLanguage,
      storyInProgress,
      chatSession,
      startNewStory: (chat, first) => { setChatSession(chat); setStoryInProgress([first]); },
      continueStory: (user, ai) => { setStoryInProgress(prev => [...prev, user, ai]); },
      finishStory: (final) => { 
        const story: StoryEntry = {
          title: `Adventure ${new Date().toLocaleDateString()}`,
          content: [...storyInProgress, final],
          date: new Date().toISOString()
        };
        setStories(prev => [...prev, story]);
        setStoryInProgress([]);
        setChatSession(null);
      },
      resetApp: () => { 
        localStorage.clear(); 
        window.location.reload(); 
      },
      t,
      isInstallable: !!deferredPrompt,
      installApp,
      activeTasks,
      setActiveTask
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
