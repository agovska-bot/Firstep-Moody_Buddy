
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { AgeGroup } from '../types';
import { useTranslation } from '../hooks/useTranslation';

declare const __API_KEY__: string;

const BreathingExercise: React.FC<{ onFinish: () => void; ageGroup: AgeGroup | null }> = ({ onFinish, ageGroup }) => {
    const [phase, setPhase] = useState(-1); // -1: Ready, 0: In, 1: Hold, 2: Out, 3: Hold
    const [cycle, setCycle] = useState(0);
    const { t } = useTranslation();

    const PHASE_DURATION = 4000;
    const GET_READY_DURATION = 2500;

    const phases = [
        { text: t('calm_zone_screen.breathe_in') },
        { text: t('calm_zone_screen.breathe_hold') },
        { text: t('calm_zone_screen.breathe_out') },
        { text: t('calm_zone_screen.breathe_hold') },
    ];

    const currentText = phase >= 0 ? phases[phase].text : t('calm_zone_screen.breathe_get_ready');
    const currentDuration = phase >= 0 ? PHASE_DURATION : GET_READY_DURATION;
    
    const scaleClass = (phase === 0 || phase === 1) ? 'scale-125' : 'scale-100';

    useEffect(() => {
        const timer = setTimeout(() => {
            if (phase === -1) {
                setPhase(0);
                return;
            }

            const nextPhase = (phase + 1) % 4;

            if (nextPhase === 0) {
                const nextCycle = cycle + 1;
                if (nextCycle >= 3) {
                    onFinish();
                    return;
                }
                setCycle(nextCycle);
            }
            
            setPhase(nextPhase);
        }, currentDuration);

        return () => clearTimeout(timer);
    }, [phase, cycle, onFinish, currentDuration]);

    const getTheme = () => {
        switch (ageGroup) {
            case '7-9':
                return { gradient: 'bg-gradient-to-br from-sky-300 to-cyan-400', text: 'text-sky-600' };
            case '10-12':
                return { gradient: 'bg-gradient-to-br from-green-300 to-emerald-400', text: 'text-emerald-600' };
            default:
                return { gradient: 'bg-gradient-to-br from-sky-300 to-cyan-400', text: 'text-sky-600' };
        }
    }
    const theme = getTheme();

    return (
        <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <div className="relative w-60 h-60">
                <div 
                    className={`absolute inset-0 ${theme.gradient} rounded-full transition-transform duration-[4000ms] ease-in-out ${scaleClass}`}
                />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <h2 className="text-4xl font-bold text-white [text-shadow:1px_1px_3px_rgba(0,0,0,0.2)]">
                        {currentText}
                    </h2>
                </div>
            </div>
            <p className={`text-xl ${theme.text} mt-10 font-semibold`}>
                 {phase >= 0 ? t('calm_zone_screen.breathe_cycle_of').replace('{cycle}', String(cycle + 1)).replace('{total}', '3') : t('calm_zone_screen.breathe_get_ready_subtitle')}
            </p>
        </div>
    );
};


const CalmZoneScreen: React.FC = () => {
  const { ageGroup } = useAppContext();
  const { t, language } = useTranslation();
  const [task, setTask] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);

  const screenTitle = t(`home.age_${ageGroup}.calm_zone_title`);

  const getNewTask = useCallback(async () => {
    setIsLoading(true);
    const apiKey = typeof __API_KEY__ !== 'undefined' ? __API_KEY__ : "";
    if (!apiKey) {
        const fallbackTasks = t('calm_zone_screen.fallback_tasks');
        setTask(fallbackTasks[Math.floor(Math.random() * fallbackTasks.length)]);
        setIsLoading(false);
        return;
    }

    try {
        const ai = new GoogleGenAI({apiKey: apiKey});
        const themes = ["listening sounds", "favorite color", "textures", "body scan", "peaceful place"];
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];

        let languageInstruction = "English.";
        if (language === 'mk') languageInstruction = "Македонски јазик.";
        
        const prompt = `Short mental calming exercise for someone aged ${ageGroup} about ${randomTheme}. ${languageInstruction} Max 1 sentence command.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: prompt,
            config: {
                temperature: 1.1,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        setTask(response.text?.trim() || "Take a deep breath.");
    } catch (error) {
        console.error("Error fetching calm task:", error);
        const fallbackTasks = t('calm_zone_screen.fallback_tasks');
        setTask(fallbackTasks[Math.floor(Math.random() * fallbackTasks.length)]);
    } finally {
        setIsLoading(false);
    }
  }, [ageGroup, language, t]);

  useEffect(() => {
    if (!showBreathingExercise) {
        getNewTask();
    }
  }, [showBreathingExercise, getNewTask]);

    const theme = {
        '7-9': {
            blob1: 'bg-sky-100', blob2: 'bg-sky-200', text: 'text-sky-800',
            button: 'bg-sky-500 hover:bg-sky-600',
            button2: 'bg-sky-100 text-sky-800',
        },
        '10-12': {
            blob1: 'bg-emerald-50', blob2: 'bg-emerald-100', text: 'text-emerald-800',
            button: 'bg-emerald-500 hover:bg-emerald-600',
            button2: 'bg-emerald-100 text-emerald-800',
        },
        '12+': {
            blob1: 'bg-sky-100', blob2: 'bg-sky-200', text: 'text-sky-800',
            button: 'bg-sky-500 hover:bg-sky-600',
            button2: 'bg-sky-100 text-sky-800',
        }
    }[ageGroup || '7-9'];

  if (showBreathingExercise) {
      return (
          <ScreenWrapper title={t('calm_zone_screen.breathe_title')}>
              <BreathingExercise onFinish={() => setShowBreathingExercise(false)} ageGroup={ageGroup} />
          </ScreenWrapper>
      )
  }

  return (
    <ScreenWrapper title={screenTitle}>
      <div className="relative flex flex-col items-center justify-start pt-8 text-center space-y-8 flex-grow overflow-hidden">
        <div className={`absolute top-20 -left-16 w-72 h-72 ${theme.blob1} rounded-full opacity-50 filter blur-xl animate-blob`}></div>
        <div className={`absolute top-40 -right-16 w-72 h-72 ${theme.blob2} rounded-full opacity-50 filter blur-xl animate-blob animation-delay-2000`}></div>
        
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-lg shadow-inner min-h-[120px] flex items-center justify-center w-full max-w-sm z-10 mx-4">
          {isLoading ? (
            <p className={`text-xl ${theme.text} animate-pulse`}>
              {language === 'mk' ? 'Смислувам мирна мисла...' : t('calm_zone_screen.loading')}
            </p>
          ) : (
            <p className={`text-xl font-bold ${theme.text}`}>{task}</p>
          )}
        </div>
        <div className="w-full pt-4 z-10 space-y-3 max-w-sm mx-4">
            <button
              onClick={() => setShowBreathingExercise(true)}
              className={`w-full ${theme.button} text-white font-bold py-3 px-4 rounded-lg shadow-md transition transform active:scale-95`}
            >
             {t('calm_zone_screen.breathing_exercise_button')}
            </button>
            <button
              onClick={getNewTask}
              disabled={isLoading}
              className={`w-full ${theme.button2} font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-200`}
            >
              {t('calm_zone_screen.another_button')}
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

export default CalmZoneScreen;
