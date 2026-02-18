
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { POINTS_PER_ACTIVITY } from '../constants';
import { useTranslation } from '../hooks/useTranslation';

declare const __API_KEY__: string;

const MoveScreen: React.FC = () => {
  const { addPoints, showToast, ageGroup, activeTasks, setActiveTask } = useAppContext();
  const { t, language } = useTranslation();
  const [task, setTask] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const currentAgeKey = ageGroup || '7-9';
  const screenTitle = t(`home.age_${currentAgeKey}.get_moving_title`);

  const getNewTask = useCallback(async (forceRefresh: boolean = false) => {
      if (!forceRefresh && activeTasks.move) {
        setTask(activeTasks.move);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const apiKey = typeof __API_KEY__ !== 'undefined' ? __API_KEY__ : "";
      
      if (!apiKey) {
        const fallback = t('move_screen.fallback_tasks')[0];
        setTask(fallback);
        setActiveTask('move', fallback);
        setIsLoading(false);
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey });
        const themes = ["animal", "superhero", "robot", "slow motion", "balance", "sports", "silly walk", "stretch", "jumping"];
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];

        let languageInstruction = language === 'mk' ? "На македонски." : (language === 'tr' ? "In Turkish." : "In English.");
        const prompt = `Short fun physical task for someone who is ${currentAgeKey} year old about ${randomTheme}. ${languageInstruction} Max 1 sentence command.`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-flash-lite-latest',
          contents: prompt,
          config: { 
              temperature: 1.0,
              thinkingConfig: { thinkingBudget: 0 }
          }
        });
        const generatedTask = response.text?.trim() || "Let's move!";
        setTask(generatedTask);
        setActiveTask('move', generatedTask);
      } catch (error) {
        console.error("Gemini Move Error:", error);
        const fallback = t('move_screen.fallback_tasks')[0];
        setTask(fallback);
        setActiveTask('move', fallback);
      } finally {
        setIsLoading(false);
      }
    }, [currentAgeKey, language, t, activeTasks.move, setActiveTask]);

  useEffect(() => {
    getNewTask();
  }, [getNewTask]);

  const handleComplete = () => {
    addPoints('physical', POINTS_PER_ACTIVITY);
    showToast(`+${POINTS_PER_ACTIVITY} points! 💪`);
    // Clear and let the effect handle the next fetch naturally
    setActiveTask('move', null);
  };

  const theme = {
    '7-9': { blob1: 'bg-lime-100', blob2: 'bg-lime-200', text: 'text-lime-800', button: 'bg-lime-500 hover:bg-lime-600', button2: 'bg-lime-100 text-lime-800' },
    '10-12': { blob1: 'bg-blue-50', blob2: 'bg-blue-100', text: 'text-blue-800', button: 'bg-blue-500 hover:bg-blue-600', button2: 'bg-blue-100 text-blue-800' },
    '12+': { blob1: 'bg-blue-100', blob2: 'bg-blue-200', text: 'text-blue-800', button: 'bg-blue-600 hover:bg-blue-700', button2: 'bg-blue-100 text-blue-800' }
  }[currentAgeKey];

  return (
    <ScreenWrapper title={screenTitle}>
      <div className="relative flex flex-col items-center justify-start pt-8 text-center space-y-8 flex-grow overflow-hidden">
        <div className={`absolute top-20 -left-16 w-72 h-72 ${theme.blob1} rounded-full opacity-50 filter blur-xl animate-blob`}></div>
        <div className={`absolute top-40 -right-16 w-72 h-72 ${theme.blob2} rounded-full opacity-50 filter blur-xl animate-blob animation-delay-2000`}></div>

        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-lg shadow-inner min-h-[120px] flex items-center justify-center w-full max-w-sm z-10 mx-4">
           {isLoading ? (
             <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 border-4 ${currentAgeKey === '7-9' ? 'border-lime-300 border-t-lime-600' : 'border-blue-300 border-t-blue-600'} rounded-full animate-spin`}></div>
                <p className={`text-xl ${theme.text} animate-pulse mt-2`}>
                    {language === 'mk' ? 'Смислувам активност...' : t('move_screen.loading')}
                </p>
             </div>
           ) : (
             <p className={`text-xl font-bold ${theme.text}`}>{task}</p>
           )}
        </div>
        <div className="w-full pt-4 z-10 space-y-3 max-w-sm mx-4">
            <button onClick={handleComplete} disabled={isLoading} className={`w-full ${theme.button} text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-gray-400 shadow-md`}>
              {t('move_screen.complete_button')}
            </button>
            <button onClick={() => getNewTask(true)} disabled={isLoading} className={`w-full ${theme.button2} font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-200`}>
              {t('move_screen.another_button')}
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

export default MoveScreen;
