
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { POINTS_PER_ACTIVITY } from '../constants';
import { useTranslation } from '../hooks/useTranslation';

declare const __API_KEY__: string;

const KindnessScreen: React.FC = () => {
  const { addPoints, showToast, ageGroup, activeTasks, setActiveTask } = useAppContext();
  const { t, language } = useTranslation();
  const [task, setTask] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  const currentAgeKey = ageGroup || '7-9';
  const screenTitle = t(`home.age_${currentAgeKey}.kindness_act_title`);

  const getNewTask = useCallback(async (forceRefresh: boolean = false) => {
      if (!forceRefresh && activeTasks.kindness) {
        setTask(activeTasks.kindness);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const apiKey = typeof __API_KEY__ !== 'undefined' ? __API_KEY__ : "";
      
      if (!apiKey) {
        const fallbackTasks = t('kindness_screen.fallback_tasks');
        const fallback = fallbackTasks[Math.floor(Math.random() * fallbackTasks.length)];
        setTask(fallback);
        setActiveTask('kindness', fallback);
        setIsLoading(false);
        return;
      }
      
      try {
        const ai = new GoogleGenAI({apiKey: apiKey});
        const themes = ["a family member", "a friend", "helping at home", "giving a compliment", "sharing", "saying thank you"];
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];

        let languageInstruction = "English.";
        if (language === 'mk') languageInstruction = "Македонски јазик.";
        
        const prompt = `Generate a single short act of kindness for a child aged ${currentAgeKey} about ${randomTheme}. ${languageInstruction} Max 1 sentence command.`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: { 
              temperature: 0.9,
              thinkingConfig: { thinkingBudget: 0 }
          }
        });
        const generatedTask = response.text?.trim() || "Do something kind today.";
        setTask(generatedTask);
        setActiveTask('kindness', generatedTask);
      } catch (error) {
        const fallbackTasks = t('kindness_screen.fallback_tasks');
        const fallback = fallbackTasks[Math.floor(Math.random() * fallbackTasks.length)];
        setTask(fallback);
        setActiveTask('kindness', fallback);
      } finally {
        setIsLoading(false);
      }
    }, [currentAgeKey, language, t, activeTasks.kindness, setActiveTask]);

  useEffect(() => {
    getNewTask();
  }, [getNewTask]);

  const handleComplete = () => {
    addPoints('kindness', POINTS_PER_ACTIVITY);
    showToast(`+${POINTS_PER_ACTIVITY} points! 💖`);
    setActiveTask('kindness', null);
  };

  const theme = {
    '7-9': { blob1: 'bg-emerald-50', blob2: 'bg-emerald-100', text: 'text-emerald-800', button: 'bg-emerald-500 hover:bg-emerald-600', button2: 'bg-emerald-100 text-emerald-800' },
    '10-12': { blob1: 'bg-rose-50', blob2: 'bg-rose-100', text: 'text-rose-800', button: 'bg-rose-500 hover:bg-rose-600', button2: 'bg-rose-100 text-rose-800' },
    '12+': { blob1: 'bg-rose-100', blob2: 'bg-rose-200', text: 'text-rose-800', button: 'bg-rose-600 hover:bg-rose-700', button2: 'bg-rose-100 text-rose-800' }
  }[currentAgeKey];

  return (
    <ScreenWrapper title={screenTitle}>
      <div className="relative flex flex-col items-center justify-start pt-8 text-center space-y-8 flex-grow overflow-hidden">
        <div className={`absolute top-20 -left-16 w-72 h-72 ${theme.blob1} rounded-full opacity-50 filter blur-xl animate-blob`}></div>
        <div className={`absolute top-40 -right-16 w-72 h-72 ${theme.blob2} rounded-full opacity-50 filter blur-xl animate-blob animation-delay-2000`}></div>

        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-lg shadow-inner min-h-[120px] flex items-center justify-center w-full max-w-sm z-10">
          {isLoading ? (
            <p className={`text-xl ${theme.text} animate-pulse`}>{t('kindness_screen.loading')}</p>
          ) : (
            <p className={`text-xl font-bold ${theme.text}`}>{task}</p>
          )}
        </div>
        <div className="w-full pt-4 z-10 space-y-3">
            <button onClick={handleComplete} disabled={isLoading} className={`w-full ${theme.button} text-white font-bold py-3 px-4 rounded-xl transition shadow-md active:scale-95 disabled:opacity-50`}>
                {t('kindness_screen.complete_button')}
            </button>
            <button onClick={() => getNewTask(true)} disabled={isLoading} className={`w-full ${theme.button2} font-bold py-2 px-4 rounded-xl transition disabled:bg-gray-200`}>
                {t('kindness_screen.another_button')}
            </button>
        </div>
      </div>
       <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </ScreenWrapper>
  );
};

export default KindnessScreen;
