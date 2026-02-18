import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

const PointsSummary: React.FC = () => {
  const { totalPoints, points, streakDays } = useAppContext();
  const { t } = useTranslation();

  const renderStreakMessage = () => {
    if (streakDays >= 14) {
      return (
        <p className="text-yellow-500 font-semibold animate-pulse">🥇 Wow, a Gold Streak! Amazing!</p>
      );
    }
    if (streakDays >= 7) {
      return (
        <p className="text-gray-500 font-semibold animate-pulse">🥈 You've earned a Silver Streak!</p>
      );
    }
    if (streakDays >= 3) {
      return (
        <p className="text-amber-600 font-semibold animate-pulse">🥉 You're on a Bronze Streak!</p>
      );
    }
    return null;
  };

  const streakMessage = renderStreakMessage();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
            {/* Main Stats Section */}
            <div className="flex-1 flex justify-around items-center text-center pr-2 border-r border-gray-200">
                <div>
                    <span className="text-3xl font-bold text-teal-600">{totalPoints}</span>
                    <p className="text-sm text-gray-600">{t('points_summary.points')}</p>
                </div>
                <div className="text-center">
                    <span className={`text-3xl font-bold flex items-center justify-center gap-1 ${streakDays > 0 ? 'text-amber-500' : 'text-gray-400'}`}>
                        <span className={streakDays > 0 ? 'animate-pulse [filter:drop-shadow(0_0_4px_rgba(245,158,11,0.7))]' : 'opacity-50 [filter:grayscale(1)]'}>🔥</span>
                        <span>{streakDays}</span>
                    </span>
                    <p className="text-sm text-gray-600">{t('points_summary.streak')}</p>
                </div>
            </div>
            {/* Breakdown Section */}
            <div className="flex-1 grid grid-cols-2 gap-2 text-center pl-2">
                 <div className="flex items-center justify-center">
                    <p className="text-lg font-bold text-yellow-500">🌟 {points.gratitude}</p>
                </div>
                <div className="flex items-center justify-center">
                    <p className="text-lg font-bold text-sky-500">💪 {points.physical}</p>
                </div>
                <div className="flex items-center justify-center">
                    <p className="text-lg font-bold text-rose-500">💖 {points.kindness}</p>
                </div>
                <div className="flex items-center justify-center">
                    <p className="text-lg font-bold text-purple-500">📖 {points.creativity}</p>
                </div>
            </div>
        </div>
        {streakMessage && (
            <div className="text-center mt-3 pt-3 border-t border-gray-200">
                {streakMessage}
            </div>
        )}
    </div>
  );
};

export default PointsSummary;