
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { MOOD_OPTIONS, MOOD_EMOJIS, MOOD_COLORS } from '../constants';
import { Mood, Screen } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import TTSButton from '../components/TTSButton';

declare const __API_KEY__: string;

const MoodCheckScreen: React.FC = () => {
  const { addMood, setCurrentScreen, age, language } = useAppContext();
  const { t } = useTranslation();
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([]);
  const [note, setNote] = useState('');
  const [buddyResponse, setBuddyResponse] = useState<string | null>(null);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [streamedText, setStreamedText] = useState('');

  const toggleMood = (mood: Mood) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood) 
        : [...prev, mood]
    );
  };

  const generateBuddySupport = async (moods: Mood[], userNote: string) => {
    const apiKey = typeof __API_KEY__ !== 'undefined' ? __API_KEY__ : "";
    setIsGeneratingResponse(true);
    setStreamedText('');
    
    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `You are Buddy, a supportive friend for a ${age}-year-old. 
                      User feels: ${moods.join(", ")}. User note: "${userNote}". 
                      Respond in ${language === 'mk' ? 'Macedonian' : (language === 'tr' ? 'Turkish' : 'English')}. 
                      Be empathetic, encouraging, and brief (max 2 sentences).`;
      
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      
      let fullText = "";
      for await (const chunk of responseStream) {
          const text = (chunk as GenerateContentResponse).text;
          if (text) {
              fullText += text;
              setStreamedText(fullText);
          }
      }
      setBuddyResponse(fullText);
    } catch (error) {
      console.error("AI Error:", error);
      setBuddyResponse("I'm here for you! Let's keep going.");
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const handleSubmit = async () => {
    if (selectedMoods.length > 0) {
      addMood({ moods: selectedMoods, note: note, date: new Date().toISOString() });
      await generateBuddySupport(selectedMoods, note);
    }
  };

  return (
    <ScreenWrapper title={t('mood_check_screen.buddy_support', 'Buddy is here')}>
      <div className="flex flex-col items-center space-y-6 flex-grow">
        {buddyResponse ? (
          <div className="w-full flex flex-col items-center space-y-6 animate-fadeIn">
            <div className="relative w-full p-8 bg-white rounded-[2rem] shadow-xl shadow-teal-900/5 border border-teal-50 italic text-xl text-teal-900 leading-relaxed text-center">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-sm">
                Buddy
              </div>
              "{streamedText || buddyResponse}"
            </div>
            
            <div className="flex gap-4">
               <TTSButton textToSpeak={streamedText || buddyResponse} className="w-14 h-14 bg-teal-50 text-teal-600 shadow-md" />
            </div>

            <button 
              onClick={() => setCurrentScreen(Screen.Home)} 
              className="w-full max-w-xs bg-teal-600 text-white font-black py-5 rounded-2xl shadow-lg hover:bg-teal-700 transition-all active:scale-95 text-lg uppercase tracking-wider"
            >
              {t('mood_check_screen.continue', 'Continue')}
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
                <p className="text-teal-900 font-black text-xl leading-tight">
                    {language === 'mk' ? 'Како се чувствуваш?' : (language === 'tr' ? 'Nasıl hissediyorsun?' : 'How are you feeling?')}
                </p>
                <p className="text-slate-400 text-sm font-bold">
                    {language === 'mk' ? '(Можеш да избереш повеќе)' : (language === 'tr' ? '(Birden fazla seçebilirsin)' : '(You can pick more than one)')}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {MOOD_OPTIONS.map(m => {
                const isSelected = selectedMoods.includes(m);
                const colorClass = MOOD_COLORS[m];
                return (
                  <button 
                    key={m} 
                    onClick={() => toggleMood(m)} 
                    className={`p-5 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 border-4 ${
                      isSelected 
                        ? `${colorClass} border-black/10 scale-105 shadow-lg text-white` 
                        : 'bg-white border-slate-50 text-slate-400 hover:border-slate-200 shadow-sm'
                    }`}
                  >
                    <span className={`text-4xl transition-transform ${isSelected ? 'scale-110' : ''}`}>{MOOD_EMOJIS[m]}</span>
                    <span className="font-black text-sm uppercase tracking-widest">{t(`moods.${m}`)}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-teal-700 pl-2">
                    {t('mood_check_screen.placeholder')}
                </label>
                <textarea 
                    className="w-full p-5 bg-white border-2 border-slate-50 rounded-[1.5rem] focus:border-teal-400 outline-none text-teal-900 text-lg placeholder:text-slate-200 transition-all shadow-inner min-h-[120px] resize-none"
                    placeholder="..."
                    value={note} 
                    onChange={e => setNote(e.target.value)} 
                />
            </div>

            <button 
                onClick={handleSubmit} 
                disabled={isGeneratingResponse || selectedMoods.length === 0} 
                className="w-full bg-teal-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-teal-100 active:scale-95 disabled:opacity-30 transition-all text-xl uppercase tracking-widest border-b-4 border-teal-800"
            >
              {isGeneratingResponse ? t('mood_check_screen.buddy_thinking', 'Thinking...') : t('mood_check_screen.save_button', 'Save')}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </ScreenWrapper>
  );
};

export default MoodCheckScreen;
