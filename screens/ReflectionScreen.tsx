
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import PointsSummary from '../components/PointsSummary';
import { MOOD_EMOJIS, MOOD_COLORS } from '../constants';
import { MoodEntry, ReflectionEntry, StoryEntry, Mood } from '../types';
import { useTranslation } from '../hooks/useTranslation';

const MOOD_HEX_COLORS: Record<Mood, string> = {
  Happy: '#FACC15',
  Sad: '#60A5FA',
  Angry: '#F87171',
  Worried: '#C084FC',
  Tired: '#9CA3AF',
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
};

const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

const MoodChart: React.FC<{ history: MoodEntry[], isAdult: boolean, isOlderTeen: boolean }> = ({ history, isAdult, isOlderTeen }) => {
    const { t } = useTranslation();
    const data = useMemo(() => {
        if (history.length === 0) return [];
        const counts: Record<string, number> = {};
        let totalCounted = 0;
        
        history.forEach(entry => {
            // Support both legacy single mood and new moods array
            const entryMoods = entry.moods || [(entry as any).mood];
            entryMoods.forEach((mood: Mood) => {
                if (mood) {
                    counts[mood] = (counts[mood] || 0) + 1;
                    totalCounted++;
                }
            });
        });

        if (totalCounted === 0) return [];

        let accumulatedPercent = 0;
        return Object.keys(counts).map(mood => {
            const count = counts[mood];
            const percent = count / totalCounted;
            const startPercent = accumulatedPercent;
            accumulatedPercent += percent;
            return { mood: mood as Mood, count, percent, startPercent };
        });
    }, [history]);

    if (history.length === 0 || data.length === 0) return null;

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    const containerClasses = (isAdult || isOlderTeen)
        ? "bg-white border border-slate-200 shadow-sm mx-0 mb-6 pt-6 rounded-2xl"
        : "bg-white shadow-md mx-1 mb-6 transform rotate-1 pt-6 rounded-xl border border-gray-100";
    
    const badgeClasses = (isAdult || isOlderTeen)
        ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
        : "bg-yellow-100 text-yellow-800 shadow-sm transform -rotate-2 border border-yellow-200";

    return (
        <div className={`flex flex-col items-center justify-center py-4 relative ${containerClasses}`}>
             <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-[10px] font-black uppercase tracking-widest z-30 whitespace-nowrap rounded-full ${badgeClasses}`}>
                {t('reflections_screen.mood_chart_title')}
            </div>
            <div className="flex flex-row items-center justify-center gap-6 p-2 w-full">
                <div className="relative w-24 h-24 flex-shrink-0">
                    <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full" style={{ overflow: 'visible' }}>
                        {data.map((slice, index) => {
                            const [startX, startY] = getCoordinatesForPercent(slice.startPercent);
                            const [endX, endY] = getCoordinatesForPercent(slice.startPercent + slice.percent);
                            if (slice.percent === 1) return <circle cx="0" cy="0" r="1" fill={MOOD_HEX_COLORS[slice.mood]} key={index} />;
                            const largeArcFlag = slice.percent > 0.5 ? 1 : 0;
                            const pathData = [`M 0 0`, `L ${startX} ${startY}`, `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, `Z`].join(' ');
                            return <path d={pathData} fill={MOOD_HEX_COLORS[slice.mood]} key={index} stroke="white" strokeWidth="0.05" />;
                        })}
                        <circle cx="0" cy="0" r="0.75" fill="white" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                        <span className="text-xl font-black text-slate-800 leading-none mb-0.5">{history.length}</span>
                        <span className="text-[0.6rem] uppercase text-slate-400 font-bold leading-none tracking-tighter">Logs</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-grow">
                    {data.sort((a,b) => b.count - a.count).map((slice) => (
                        <div key={slice.mood} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: MOOD_HEX_COLORS[slice.mood] }}></div>
                            <span className="text-xs font-bold text-slate-600 leading-tight">{t(`moods.${slice.mood}`)}</span>
                            <span className="text-[10px] text-slate-400 font-mono flex-shrink-0 ml-auto">{Math.round(slice.percent * 100)}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ReflectionScreen: React.FC = () => {
  const { moodHistory, reflections, stories, addReflection, ageGroup } = useAppContext();
  const { t } = useTranslation();
  const [newReflection, setNewReflection] = useState('');
  const [expandedStoryDate, setExpandedStoryDate] = useState<string | null>(null);

  const screenTitle = t(`home.age_${ageGroup}.reflections_title`);
  const isAdult = ageGroup === '12+';
  const isOlderTeen = ageGroup === '10-12';

  const prompt = useMemo(() => {
    const promptsArray = t('reflections_screen.prompts');
    if (Array.isArray(promptsArray) && promptsArray.length > 0) {
        return promptsArray[Math.floor(Math.random() * promptsArray.length)];
    }
    return "What was the best part of your day?";
  }, [t]);

  const handleAddReflection = () => {
    if (newReflection.trim()) {
      addReflection({ 
        prompt, 
        text: newReflection, 
        date: new Date().toISOString(),
        category: 'general'
      });
      setNewReflection('');
    }
  };

  const toggleStoryExpansion = (date: string) => {
    setExpandedStoryDate(currentDate => currentDate === date ? null : date);
  };

  const combinedEntries = useMemo(() => {
    return [...moodHistory, ...reflections, ...stories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [moodHistory, reflections, stories]);

  const mainContainerClass = isAdult 
    ? 'bg-white rounded-3xl shadow-sm border border-slate-100 p-2' 
    : (isOlderTeen ? 'bg-slate-50/50 rounded-2xl shadow-sm border border-slate-100' : 'bg-[#fdfbf7] rounded-r-lg rounded-l-md shadow-2xl border-l-8 border-teal-800/80');
  
  const renderEntry = (entry: MoodEntry | ReflectionEntry | StoryEntry, index: number) => {
    const rotation = (!isAdult && !isOlderTeen && index % 2 === 0) ? '-rotate-1' : (!isAdult && !isOlderTeen ? 'rotate-1' : '');
    const headerDateStyle = "text-[10px] uppercase tracking-widest text-slate-400 font-black mb-2";
    const entryTitleStyle = (isAdult || isOlderTeen) ? "text-lg font-black text-slate-800 leading-tight mb-2" : "text-xl font-bold text-[#064e3b] leading-tight mb-1";
    const entryBodyStyle = (isAdult || isOlderTeen) 
        ? "text-[15px] text-slate-600 leading-relaxed font-medium whitespace-pre-wrap break-words" 
        : "text-[15px] text-slate-600 leading-relaxed italic opacity-90 whitespace-pre-wrap break-words";

    const entryContainerClass = (isAdult || isOlderTeen) 
        ? "mb-6 p-5 bg-white rounded-2xl shadow-sm border border-slate-50 transition-all hover:shadow-md"
        : `mb-6 relative pl-4 pr-4 transform ${rotation} hover:rotate-0 transition-transform`;

    if ('moods' in entry || 'mood' in entry) {
        const moods = (entry as any).moods || [(entry as any).mood];
        const moodNames = moods.map((m: Mood) => t(`moods.${m}`)).join(', ');

        return (
            <div className={entryContainerClass}>
                <p className={headerDateStyle}>
                    {formatDate(entry.date)} • {formatTime(entry.date)}
                </p>
                <div className="flex items-start gap-4">
                    <div className="flex flex-col gap-1 flex-shrink-0 mt-1">
                        {moods.slice(0, 3).map((m: Mood) => (
                             <span key={m} className="text-xl leading-none">{MOOD_EMOJIS[m]}</span>
                        ))}
                    </div>
                    <div className="flex-grow min-w-0">
                        <h3 className={entryTitleStyle}>
                            {t('reflections_screen.feeling_mood').replace('{mood}', moodNames)}
                        </h3>
                        {(entry as any).note && <p className={entryBodyStyle}>"{(entry as any).note}"</p>}
                    </div>
                </div>
                {(!isAdult && !isOlderTeen) && <div className="w-full h-px bg-teal-900/10 mt-4"></div>}
            </div>
        );
    }

    if ('content' in entry) {
        const isExpanded = expandedStoryDate === entry.date;
        return (
             <div className={`${entryContainerClass} cursor-pointer`} onClick={() => toggleStoryExpansion(entry.date)}>
                <p className={headerDateStyle}>
                    {formatDate(entry.date)} • {formatTime(entry.date)}
                </p>
                <div className="flex items-start gap-4">
                    <span className={`text-xl flex-shrink-0 mt-1 ${isAdult || isOlderTeen ? 'bg-indigo-50 text-indigo-500 rounded-lg p-1' : ''}`}>📖</span>
                    <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between">
                            <h3 className={entryTitleStyle}>{entry.title}</h3>
                            <span className="text-slate-300 text-lg">{isExpanded ? '−' : '+'}</span>
                        </div>
                        {!isExpanded && <p className={`${entryBodyStyle} truncate`}>"{entry.content[0]}..."</p>}
                        {isExpanded && (
                            <div className="mt-4 space-y-3 max-h-96 overflow-y-auto story-scroll pr-2">
                                {entry.content.map((part, partIndex) => (
                                    <p key={partIndex} className={`text-[15px] whitespace-pre-wrap break-words leading-relaxed ${partIndex % 2 === 0 ? 'text-slate-700 font-bold' : 'text-indigo-600 italic'}`}>
                                    {part}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {(!isAdult && !isOlderTeen) && <div className="w-full h-px bg-teal-900/10 mt-4"></div>}
            </div>
        );
    }

    // It's a ReflectionEntry
    const isGratitude = entry.category === 'gratitude';
    const icon = isGratitude ? "🌟" : "📝";

    return (
        <div className={entryContainerClass}>
            <p className={headerDateStyle}>
                {formatDate(entry.date)} • {formatTime(entry.date)}
            </p>
            <div className="flex items-start gap-4">
                <span className={`text-xl flex-shrink-0 mt-1 ${isGratitude ? 'text-amber-400' : 'text-slate-300'}`}>{icon}</span>
                <div className="flex-grow min-w-0">
                    <h3 className={entryTitleStyle}>{entry.prompt || t('reflections_screen.reflection_title')}</h3>
                    <p className={entryBodyStyle}>{entry.text}</p>
                </div>
            </div>
            {(!isAdult && !isOlderTeen) && <div className="w-full h-px bg-teal-900/10 mt-4"></div>}
        </div>
    );
  }

  const themeColors = {
    '7-9': { blob1: 'bg-teal-50', blob2: 'bg-amber-50' },
    '10-12': { blob1: 'bg-indigo-50', blob2: 'bg-cyan-50' },
    '12+': { blob1: 'bg-slate-100', blob2: 'bg-indigo-50' }
  }[ageGroup || '7-9'];

  return (
    <ScreenWrapper title={screenTitle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
        .font-handwriting { font-family: 'Dancing Script', cursive; }
        .lined-paper { background-color: #fdfbf7; background-image: linear-gradient(#e5e5e5 1px, transparent 1px); background-size: 100% 2.5rem; }
        .notebook-holes { background-image: radial-gradient(#f3f4f6 20%, transparent 20%); background-size: 100% 40px; background-position: 10px 10px; }
        .story-scroll { scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent; }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 10s infinite alternate ease-in-out; }
      `}</style>
      <div className="flex flex-col flex-grow h-full relative">
        
        {/* BACKGROUND BLOBS */}
        <div className={`absolute top-20 -left-16 w-72 h-72 ${themeColors.blob1} rounded-full opacity-60 filter blur-3xl animate-blob pointer-events-none`}></div>
        <div className={`absolute bottom-20 -right-16 w-72 h-72 ${themeColors.blob2} rounded-full opacity-60 filter blur-3xl animate-blob animation-delay-4000 pointer-events-none`}></div>

        <div className="mb-4 z-10"> <PointsSummary /> </div>
        <div className={`flex-grow overflow-hidden flex flex-col relative z-10 ${mainContainerClass}`}>
            {!isAdult && !isOlderTeen && <div className="absolute left-0 top-0 bottom-0 w-8 z-10 notebook-holes border-r border-gray-200/50"></div>}
            <div className={`p-6 pb-0 relative z-0 ${(!isAdult && !isOlderTeen) ? 'pl-10' : ''}`}>
                {isAdult || isOlderTeen ? (
                     <div className="bg-white p-5 rounded-2xl shadow-sm border border-teal-50">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-teal-500 text-lg">💡</span>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-500">{prompt}</p>
                        </div>
                         <textarea className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-teal-100/50 focus:border-teal-200 transition-all resize-none font-medium placeholder:text-slate-300" rows={3} placeholder={t('reflections_screen.reflection_placeholder')} value={newReflection} onChange={(e) => setNewReflection(e.target.value)} />
                        <div className="flex justify-end mt-3">
                             <button onClick={handleAddReflection} disabled={!newReflection.trim()} className="bg-teal-600 text-white font-black py-2.5 px-8 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all disabled:opacity-30 active:scale-95">
                                {t('reflections_screen.save_reflection_button')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={`relative bg-yellow-200 p-4 pb-12 shadow-md transform -rotate-1 transition-transform focus-within:rotate-0 focus-within:scale-[1.02] duration-300`}>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 rotate-2 z-10 pointer-events-none">
                            <div className="w-full h-full bg-white/40 backdrop-blur-[1px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border-l border-r border-white/60"></div>
                        </div>
                        <p className="font-handwriting text-xl text-gray-800 mb-2 opacity-75 text-center mt-2">"{prompt}"</p>
                        <textarea className={`w-full bg-transparent border-b border-gray-400/30 focus:border-gray-500 focus:outline-none text-2xl font-handwriting text-gray-900 leading-relaxed placeholder-gray-500/50 resize-none`} rows={2} placeholder={t('reflections_screen.reflection_placeholder')} value={newReflection} onChange={(e) => setNewReflection(e.target.value)} />
                        <div className="absolute bottom-2 right-2">
                            <button onClick={handleAddReflection} disabled={!newReflection.trim()} className="bg-teal-700 text-white font-bold py-1 px-4 rounded-full text-sm shadow hover:bg-teal-800 transition-colors disabled:opacity-50 font-sans">
                                {t('reflections_screen.save_reflection_button')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className={`flex-grow overflow-y-auto p-6 relative ${(!isAdult && !isOlderTeen) ? 'pl-12 lined-paper' : ''}`}>
                <MoodChart history={moodHistory} isAdult={isAdult} isOlderTeen={isOlderTeen} />
                <h2 className={`text-center text-teal-800 mb-8 ${isAdult || isOlderTeen ? 'text-xs font-black uppercase tracking-[0.3em] opacity-50' : 'text-3xl font-handwriting underline decoration-wavy decoration-teal-300/50'}`}>
                    {t('reflections_screen.journal_title')}
                </h2>
                <div className="space-y-4">
                {combinedEntries.length > 0 ? (
                    combinedEntries.map((entry, index) => <div key={entry.date}>{renderEntry(entry, index)}</div>)
                ) : (
                    <div className="text-center py-10 opacity-50">
                        <p className={`${(isAdult || isOlderTeen) ? 'text-sm font-bold uppercase tracking-widest' : 'font-handwriting text-2xl'} text-slate-400`}>{t('reflections_screen.journal_empty')}</p>
                    </div>
                )}
                </div>
            </div>
        </div>
      </div>
    </ScreenWrapper>
  );
};

export default ReflectionScreen;
