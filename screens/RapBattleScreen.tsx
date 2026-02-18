
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTranslation } from '../hooks/useTranslation';
import BuddyIcon from '../components/BuddyIcon';

declare const __API_KEY__: string;

const SoundWave: React.FC<{ active: boolean }> = ({ active }) => (
    <div className={`flex items-end justify-center gap-1.5 h-12 mb-4 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-20'}`}>
        {[...Array(12)].map((_, i) => (
            <div 
                key={i} 
                className={`w-2.5 bg-gradient-to-t from-indigo-500 to-fuchsia-400 rounded-full ${active ? 'animate-soundwave' : ''}`} 
                style={{ 
                    height: active ? `${20 + Math.random() * 80}%` : '15%',
                    animationDelay: `${i * 0.08}s`,
                    animationDuration: `${0.6 + Math.random() * 0.4}s`
                }}
            />
        ))}
    </div>
);

const RapBattleScreen: React.FC = () => {
  const { ageGroup, showToast, language, age } = useAppContext();
  const { t } = useTranslation();
  
  const [name, setName] = useState('');
  const [mood, setMood] = useState('');
  const [rapLyrics, setRapLyrics] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateRhyme = async () => {
    if (!name.trim() || !mood.trim()) return;
    
    const apiKey = typeof __API_KEY__ !== 'undefined' ? __API_KEY__ : "";
    
    if (!apiKey) {
        showToast("AI Studio is offline. (Missing API Key)");
        return;
    }

    setIsLoading(true);
    setRapLyrics('');

    try {
        const ai = new GoogleGenAI({ apiKey });
        let langCode = language === 'mk' ? "Macedonian" : (language === 'tr' ? "Turkish" : "English");
        
        const prompt = `You are Buddy, a cool rhythmic rapper. Write a very short, fun, 4-line rhyme for a kid named ${name} who is feeling ${mood}. Use slang appropriate for a ${age} year old. Make it super energetic! Language: ${langCode}. Output ONLY the 4 lines of lyrics, no other text.`;

        const textRes = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { 
                temperature: 1.0,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        const lyrics = textRes.text?.trim() || "";
        setRapLyrics(lyrics);
    } catch (error: any) {
        console.error("Rhyme AI Error:", error);
        showToast(language === 'mk' ? "Бади е малку зафатен! Пробај пак. 🎤" : "Buddy is a bit busy! Try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const currentAgeKey = ageGroup || '7-9';
  const resultTitle = language === 'mk' ? `РАП ПОСТЕР: ${name.toUpperCase()}` : (language === 'tr' ? `${name.toUpperCase()} RAP POSTERI` : `${name.toUpperCase()}'S RAP POSTER`);

  const themeColors = {
    '7-9': { blob1: 'bg-fuchsia-100', blob2: 'bg-indigo-100' },
    '10-12': { blob1: 'bg-violet-100', blob2: 'bg-pink-100' },
    '12+': { blob1: 'bg-indigo-100', blob2: 'bg-slate-200' }
  }[currentAgeKey];

  return (
    <ScreenWrapper title={t(`home.age_${currentAgeKey}.rap_battle_title`)}>
      <style>{`
        @keyframes soundwave {
            0%, 100% { transform: scaleY(0.4); opacity: 0.6; }
            50% { transform: scaleY(1.2); opacity: 1; }
        }
        .animate-soundwave { animation: soundwave 0.5s ease-in-out infinite; }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 12s infinite alternate ease-in-out; }
        
        .lyrics-glow {
            text-shadow: 0 0 20px rgba(168, 85, 247, 0.1);
        }
      `}</style>

      <div className="relative flex flex-col items-center justify-start pt-4 text-center space-y-6 flex-grow overflow-hidden">
        
        {/* LIGHT THEME BLOBS */}
        <div className={`absolute top-0 -left-16 w-80 h-80 ${themeColors.blob1} rounded-full opacity-60 filter blur-3xl animate-blob pointer-events-none`}></div>
        <div className={`absolute bottom-0 -right-16 w-80 h-80 ${themeColors.blob2} rounded-full opacity-60 filter blur-3xl animate-blob animation-delay-4000 pointer-events-none`}></div>

        {!rapLyrics && !isLoading ? (
            <div className="relative z-10 w-full max-w-sm animate-fadeIn space-y-8 py-4">
                <div className="relative flex justify-center">
                    <BuddyIcon className="w-40 h-40 drop-shadow-xl" />
                    <div className="absolute -top-2 -right-4 bg-fuchsia-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg rotate-12 uppercase tracking-widest border-2 border-white">
                        Rap Mode
                    </div>
                </div>

                <div className="space-y-4 px-2">
                    <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2.5rem] border border-white shadow-sm space-y-4">
                        <input
                            className="w-full p-4 bg-white/80 border-2 border-fuchsia-50 rounded-2xl focus:border-fuchsia-400 outline-none text-teal-900 text-lg placeholder:text-slate-300 transition-all font-black shadow-inner"
                            placeholder={t('rap_battle_screen.name_placeholder')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            className="w-full p-4 bg-white/80 border-2 border-fuchsia-50 rounded-2xl focus:border-fuchsia-400 outline-none text-teal-900 text-lg placeholder:text-slate-300 transition-all font-black shadow-inner"
                            placeholder={t('rap_battle_screen.mood_placeholder')}
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                        />
                    </div>
                    
                    <button
                        onClick={generateRhyme}
                        disabled={!name.trim() || !mood.trim()}
                        className="w-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-fuchsia-200 active:scale-95 disabled:opacity-30 transition-all text-xl tracking-wider uppercase border-b-4 border-black/10"
                    >
                        {t('rap_battle_screen.generate_button')}
                    </button>
                </div>
            </div>
        ) : isLoading ? (
            <div className="flex flex-col items-center justify-center flex-grow space-y-10 z-10">
                <div className="relative">
                    <BuddyIcon className="w-36 h-36 animate-bounce" />
                    <div className="absolute inset-0 bg-fuchsia-200/50 blur-2xl rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-4 w-full px-8">
                    <SoundWave active={true} />
                    <p className="text-fuchsia-600 font-black text-xs tracking-[0.4em] uppercase animate-pulse">
                        {t('rap_battle_screen.loading')}
                    </p>
                </div>
            </div>
        ) : (
            <div className="relative z-10 w-full animate-fadeIn flex flex-col items-center space-y-8 px-2">
                <div className="w-full p-10 rounded-[3rem] bg-white/90 backdrop-blur-xl border-4 border-white shadow-2xl shadow-indigo-100 relative overflow-hidden flex flex-col items-center">
                    <div className="absolute -top-6 -right-6 opacity-10">
                        <span className="text-[120px]">🎵</span>
                    </div>
                    
                    <h3 className="text-indigo-400 font-black text-[10px] tracking-[0.4em] uppercase mb-10 opacity-70">
                        {resultTitle}
                    </h3>
                    
                    <div className="min-h-[160px] flex flex-col justify-center items-center w-full">
                        <SoundWave active={false} />
                        <pre className="text-teal-900 text-3xl font-black leading-snug whitespace-pre-wrap font-sans italic tracking-tighter lyrics-glow">
                            {rapLyrics}
                        </pre>
                    </div>

                    <div className="mt-12 w-16 h-1 bg-gradient-to-r from-transparent via-fuchsia-200 to-transparent rounded-full"></div>
                </div>

                <button
                    onClick={() => { setRapLyrics(''); setName(''); setMood(''); }}
                    className="bg-white/80 backdrop-blur-sm text-fuchsia-500 font-black text-xs uppercase tracking-[0.2em] px-8 py-3 rounded-full border border-fuchsia-100 shadow-sm hover:bg-fuchsia-500 hover:text-white transition-all active:scale-95"
                >
                    {t('rap_battle_screen.another_button')}
                </button>
            </div>
        )}
      </div>
    </ScreenWrapper>
  );
};

export default RapBattleScreen;
