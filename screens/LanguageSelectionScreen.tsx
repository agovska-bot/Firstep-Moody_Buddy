
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Language } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import ScreenWrapper from '../components/ScreenWrapper';

const FlagUK: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" {...props}>
    <clipPath id="a"><path d="M0 0h60v30H0z"/></clipPath>
    <g clipPath="url(#a)">
      <path d="M0 0v30h60V0z" fill="#012169"/>
      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6"/>
      <path d="M0 0l60 30m0-30L0 30" clipPath="url(#b)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
    <clipPath id="b">
      <path d="M0 0l30 15H0zm30 0l30 15V0zm0 15l30 15H30zM0 15l30 15V15z"/>
    </clipPath>
  </svg>
);

const FlagMK: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" {...props}>
    <rect width="60" height="30" fill="#d20000"/>
    <g fill="#ffe600">
      <polygon points="0,0 6,0 30,15 0,3"/>
      <polygon points="0,30 0,27 30,15 6,30"/>
      <polygon points="60,0 60,3 30,15 54,0"/>
      <polygon points="60,30 54,30 30,15 60,27"/>
      <rect x="0" y="13.5" width="60" height="3"/>
      <rect x="28.5" y="0" width="3" height="30"/>
    </g>
    <circle cx="30" cy="15" r="4.5" fill="#ffe600"/>
    <circle cx="30" cy="15" r="3.5" fill="#d20000"/>
  </svg>
);

const FlagTR: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" {...props}>
    <path fill="#e30a17" d="M0 0h60v30H0z"/>
    <circle cx="22.5" cy="15" r="7.5" fill="#fff"/>
    <circle cx="24.3" cy="15" r="6" fill="#e30a17"/>
    <path fill="#fff" d="M29 15l5.8-1.8-3.6 4.7v-5.8l3.6 4.7z"/>
  </svg>
);

const BuddyLogoHeader: React.FC = () => {
    return (
      <div className="flex flex-row items-center justify-center gap-1 animate-fadeIn relative z-20 py-4 w-full">
        {/* Logo Container - Big Mascot and Plus */}
        <div className="relative flex items-center justify-center h-36 w-36">
          {/* Adjusted viewBox to 85x55 to crop empty space at the bottom, ensuring vertical centering of the artwork */}
          <svg viewBox="0 0 85 55" className="w-full h-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
            <style>{`
              @keyframes blink-header { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
              .buddy-eye-header { animation: blink-header 5s infinite ease-in-out; transform-origin: center center; }
            `}</style>
            <path d="M45.7,21.9c0-12.1-9.8-21.9-21.9-21.9S2,9.8,2,21.9c0,9.1,5.6,16.9,13.6,20.2l-0.7,5.7c-0.1,0.8,0.5,1.5,1.3,1.5c0.1,0,0.2,0,0.3-0.1l7.3-5.2c1.3,0.2,2.6,0.2,4,0.2C35.9,43.8,45.7,34,45.7,21.9z" fill="#50C878" stroke="#004D40" strokeWidth="3" />
            <circle className="buddy-eye-header" cx="15.8" cy="20.5" r="3" fill="#004D40" />
            <circle className="buddy-eye-header" cx="32.8" cy="20.5" r="3" fill="#004D40" />
            <path d="M18.8,29.5c0,0,3,4,8,0" fill="none" stroke="#004D40" strokeWidth="3" strokeLinecap="round" />
            
            <g transform="translate(42, 26) scale(0.82)">
                <path d="M15,2v26 M2,15h26" fill="none" stroke="#004D40" strokeWidth="17" strokeLinecap="round"/>
                <path d="M15,2v26 M2,15h26" fill="none" stroke="#FFCB05" strokeWidth="11" strokeLinecap="round"/>
            </g>
          </svg>
        </div>
        {/* Text Container - Flex centered vertically with the logo */}
        <div className="flex flex-col items-start leading-[0.8] ml-2">
            <span className="text-[3.2rem] font-black text-[#004D40] tracking-tighter">Moody</span>
            <span className="text-[3.2rem] font-black text-[#004D40] tracking-tighter">Buddy</span>
        </div>
      </div>
    );
};

const WelcomeScreen: React.FC = () => {
  const { setLanguage, setBirthDate, language: selectedLang } = useAppContext();
  const { t } = useTranslation();
  const [displayDate, setDisplayDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const headers = ["Choose your language", "Избери јазик", "Dilini seç"];
  const [headerIndex, setHeaderIndex] = useState(0);

  useEffect(() => {
    if (!selectedLang) {
        const interval = setInterval(() => setHeaderIndex((p) => (p + 1) % headers.length), 2500);
        return () => clearInterval(interval);
    }
  }, [selectedLang]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); 
    if (value.length > 8) value = value.slice(0, 8);
    let formatted = value;
    if (value.length > 2 && value.length <= 4) formatted = `${value.slice(0, 2)}.${value.slice(2)}`;
    else if (value.length > 4) formatted = `${value.slice(0, 2)}.${value.slice(2, 4)}.${value.slice(4)}`;
    setDisplayDate(formatted);
    if (error) setError(null);
  };

  const validateAndConfirm = () => {
    const parts = displayDate.split('.');
    if (parts.length !== 3 || parts[2].length !== 4) { setError(t('age_selection.invalid_date')); return; }
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const dateObj = new Date(year, month, day);
    const today = new Date();
    let age = today.getFullYear() - dateObj.getFullYear();
    const m = today.getMonth() - dateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dateObj.getDate())) age--;
    if (age < 3) { setError(t('age_selection.too_young')); return; }
    setBirthDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50">
      <div className="fixed top-[-10%] left-[-20%] w-[50rem] h-[50rem] bg-yellow-100/40 rounded-full filter blur-[100px] animate-blob z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-20%] w-[50rem] h-[50rem] bg-blue-100/40 rounded-full filter blur-[100px] animate-blob animation-delay-4000 z-0 pointer-events-none"></div>

      <ScreenWrapper title="" showBackButton={false}>
        <div className="flex flex-col items-center justify-start flex-grow relative z-10 py-6">
          <BuddyLogoHeader />

          <div className="flex flex-col items-center justify-center gap-8 w-full max-w-md mt-8">
            {!selectedLang ? (
              <>
                <h2 className="text-2xl font-black text-teal-800 transition-all duration-500 min-h-[3rem] text-center flex items-center leading-tight">
                  {headers[headerIndex]}
                </h2>
                <div className="flex flex-col gap-4 w-full px-4">
                  <button
                    onClick={() => setLanguage('mk')}
                    className="flex items-center gap-6 bg-[#FFCB05] p-5 rounded-2xl hover:brightness-105 active:scale-[0.98] transition-all shadow-md group relative overflow-hidden"
                  >
                    <div className="animate-flagSway">
                        <FlagMK className="w-14 h-auto rounded-md shadow-sm" />
                    </div>
                    <span className="text-[1.75rem] font-black text-[#664d00] tracking-tight flex-grow text-center pr-12">Македонски</span>
                  </button>

                  <button
                    onClick={() => setLanguage('tr')}
                    className="flex items-center gap-6 bg-[#FF4545] p-5 rounded-2xl hover:brightness-105 active:scale-[0.98] transition-all shadow-md group relative overflow-hidden"
                  >
                    <div className="animate-flagSway animation-delay-500">
                        <FlagTR className="w-14 h-auto rounded-md shadow-sm" />
                    </div>
                    <span className="text-[1.75rem] font-black text-white tracking-tight flex-grow text-center pr-12">Türkçe</span>
                  </button>

                  <button
                    onClick={() => setLanguage('en')}
                    className="flex items-center gap-6 bg-[#4A86E8] p-5 rounded-2xl hover:brightness-105 active:scale-[0.98] transition-all shadow-md group relative overflow-hidden"
                  >
                    <div className="animate-flagSway animation-delay-1000">
                        <FlagUK className="w-14 h-auto rounded-md shadow-sm" />
                    </div>
                    <span className="text-[1.75rem] font-black text-white tracking-tight flex-grow text-center pr-12">English</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full flex flex-col items-center gap-8 animate-fadeIn px-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-black text-teal-800 text-center leading-tight">
                        {t('age_selection.happy_to_see_you')}
                    </h2>
                </div>
                
                <div className="w-full space-y-6">
                  <div className="bg-white/80 border-4 border-teal-50 p-6 rounded-[2.5rem] shadow-sm relative">
                    <p className="text-[#004D40] font-bold text-center text-lg leading-relaxed">
                        {t('age_selection.birthdate_prompt')}
                    </p>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-r-4 border-b-4 border-teal-50 rotate-45"></div>
                  </div>

                  <div className="space-y-4 pt-2 max-w-[280px] mx-auto w-full">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={t('age_selection.placeholder', 'дд.мм.гггг')}
                      value={displayDate}
                      onChange={handleInputChange}
                      className={`w-full bg-slate-50 border-4 ${
                        error ? 'border-red-400' : 'border-teal-100'
                      } rounded-3xl p-4 text-2xl font-black text-teal-800 focus:outline-none focus:border-teal-400 transition-all shadow-inner text-center placeholder:opacity-30`}
                    />
                  </div>

                  {error && <p className="text-red-500 font-black text-center animate-pulse text-lg">{error}</p>}
                  
                  <button
                    onClick={validateAndConfirm}
                    disabled={displayDate.length < 10}
                    className="w-full bg-teal-600 text-white font-black text-2xl py-6 rounded-[2rem] shadow-xl hover:bg-teal-700 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale mt-4"
                  >
                    {t('age_selection.confirm_button', "Let's Go! 🚀")}
                  </button>
                  
                  <button 
                      onClick={() => { setLanguage(null as any); setDisplayDate(''); setError(null); }} 
                      className="w-full text-[13px] text-teal-400 font-black uppercase tracking-[0.2em] mt-6 hover:text-teal-600 transition-colors"
                  >
                      ← {t('language_selection.title')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScreenWrapper>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(70px, -90px) scale(1.1); }
          66% { transform: translate(-60px, 60px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 15s infinite alternate ease-in-out;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-3deg) translateY(0); }
          50% { transform: rotate(3deg) translateY(-2px); }
        }
        .animate-flagSway {
          animation: sway 3s infinite ease-in-out;
        }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;
