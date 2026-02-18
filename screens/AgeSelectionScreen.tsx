
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTranslation } from '../hooks/useTranslation';

const AgeSelectionScreen: React.FC = () => {
  const { setBirthDate } = useAppContext();
  const { t } = useTranslation();
  const [displayDate, setDisplayDate] = useState(''); // What the user sees (DD.MM.YYYY)
  const [error, setError] = useState<string | null>(null);

  // Helper to calculate age from current displayDate string
  const getLiveAge = (dateStr: string) => {
    const parts = dateStr.split('.');
    if (parts.length !== 3 || parts[2].length !== 4) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const dateObj = new Date(year, month, day);
    if (dateObj.getFullYear() !== year || dateObj.getMonth() !== month || dateObj.getDate() !== day) {
        return null;
    }

    const today = new Date();
    let age = today.getFullYear() - dateObj.getFullYear();
    const m = today.getMonth() - dateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dateObj.getDate())) {
      age--;
    }
    return age;
  };

  const currentAge = useMemo(() => getLiveAge(displayDate), [displayDate]);
  const isInvalidAge = currentAge !== null && (currentAge < 3 || currentAge > 100);

  // Helper to format/mask the input while typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 8) value = value.slice(0, 8); // Max 8 digits

    let formatted = value;
    if (value.length > 2 && value.length <= 4) {
      formatted = `${value.slice(0, 2)}.${value.slice(2)}`;
    } else if (value.length > 4) {
      formatted = `${value.slice(0, 2)}.${value.slice(2, 4)}.${value.slice(4)}`;
    }

    setDisplayDate(formatted);
    
    // Clear error if user starts typing again after an error
    if (error) setError(null);
  };

  const validateAndConfirm = () => {
    const age = getLiveAge(displayDate);
    
    if (age === null) {
      setError(t('age_selection.invalid_date', 'Please enter a real date'));
      return;
    }

    if (age < 3) {
      setError(t('age_selection.too_young', 'You must be at least 3 years old!'));
      return;
    }

    if (age > 100) {
       setError(t('age_selection.too_old', 'Is that a real year? :)'));
       return;
    }

    // Convert DD.MM.YYYY to YYYY-MM-DD for storage
    const parts = displayDate.split('.');
    const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    setBirthDate(isoDate);
  };

  const placeholderText = t('age_selection.placeholder', 'дд.мм.гггг');
  const isButtonDisabled = displayDate.length < 10 || isInvalidAge;

  return (
    <ScreenWrapper title="" showBackButton={false}>
      <div className="flex flex-col items-center justify-center text-center flex-grow space-y-10 py-10 px-4">
        
        <div className="flex flex-col items-center gap-4">
            <h1 className="text-4xl font-bold text-teal-800 leading-tight">
                {t('age_selection.welcome')}
            </h1>
            <img 
                src="https://i.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" 
                alt="Waving hand animation" 
                className="w-24 h-24 drop-shadow-sm"
            />
        </div>

        <div className="space-y-4 max-w-sm">
            <h2 className="text-2xl font-bold text-teal-700">
                {t('age_selection.happy_to_see_you')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
                {t('age_selection.birthdate_prompt')}
            </p>
        </div>

        <div className="w-full max-w-xs space-y-4 pt-2">
          <div className="flex flex-col items-start gap-3">
            <label className="text-teal-600 font-black text-sm uppercase tracking-widest pl-2">
                {t('age_selection.select_date')}
            </label>
            <div className="relative w-full">
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder={placeholderText}
                    value={displayDate}
                    onChange={handleInputChange}
                    className={`w-full bg-white border-4 ${error || isInvalidAge ? 'border-red-400' : 'border-teal-100'} rounded-3xl p-5 text-2xl font-bold text-teal-800 focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all shadow-inner text-center`}
                    style={{ minHeight: '70px' }}
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
            </div>
            {(error || (displayDate.length === 10 && isInvalidAge)) && (
                <p className="text-red-500 text-sm font-bold pl-2 animate-pulse">
                    {error || (currentAge !== null && currentAge < 3 ? t('age_selection.too_young') : t('age_selection.too_old'))}
                </p>
            )}
          </div>

          <button
            onClick={validateAndConfirm}
            disabled={isButtonDisabled}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-black text-2xl py-6 px-4 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:grayscale mt-6 disabled:cursor-not-allowed"
          >
            {t('age_selection.confirm_button', 'Let\'s Go! 🚀')}
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-auto font-medium">
            {t('age_selection.reset_note')}
        </p>
      </div>
    </ScreenWrapper>
  );
};

export default AgeSelectionScreen;
