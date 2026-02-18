
import React from 'react';
import { useAppContext } from './context/AppContext';
import { Screen } from './types';
import HomeScreen from './screens/HomeScreen';
import MoodCheckScreen from './screens/MoodCheckScreen';
import GratitudeScreen from './screens/GratitudeScreen';
import MoveScreen from './screens/MoveScreen';
import CalmZoneScreen from './screens/CalmZoneScreen';
import KindnessScreen from './screens/KindnessScreen';
import ReflectionScreen from './screens/ReflectionScreen';
import StoryCreatorScreen from './screens/StoryCreatorScreen';
import RapBattleScreen from './screens/RapBattleScreen';
import Toast from './components/Toast';
import WelcomeScreen from './screens/LanguageSelectionScreen';

const App: React.FC = () => {
  const { currentScreen, toastMessage, ageGroup, language, birthDate } = useAppContext();

  const getBackgroundColor = () => {
    if (!ageGroup) return 'bg-slate-50';
    switch (ageGroup) {
      case '7-9': return 'bg-amber-50/50';
      case '10-12': return 'bg-slate-50';
      case '12+': return 'bg-slate-50';
      default: return 'bg-slate-50';
    }
  }

  // ПРОВЕРКА: Ова е најважниот дел. Ако јазикот или роденденот не се поставени во меморијата,
  // корисникот НИКОГАШ не може да ги види активностите, туку секогаш оди на WelcomeScreen.
  if (!language || !birthDate || language === null || birthDate === null) {
    return (
      <div className="bg-slate-50 min-h-screen font-sans">
        <WelcomeScreen />
        {toastMessage && <Toast message={toastMessage} />}
      </div>
    );
  }

  const renderContent = () => {
    switch (currentScreen) {
      case Screen.Home:
        return <HomeScreen />;
      case Screen.MoodCheck:
        return <MoodCheckScreen />;
      case Screen.Gratitude:
        return <GratitudeScreen />;
      case Screen.Move:
        return <MoveScreen />;
      case Screen.CalmZone:
        return <CalmZoneScreen />;
      case Screen.Kindness:
        return <KindnessScreen />;
      case Screen.Reflection:
        return <ReflectionScreen />;
      case Screen.StoryCreator:
        return <StoryCreatorScreen />;
      case Screen.RapBattle:
        return <RapBattleScreen />;
      case Screen.LanguageSelection:
      case Screen.AgeSelection:
        return <WelcomeScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className={`${getBackgroundColor()} min-h-screen font-sans relative transition-colors duration-1000`}>
      {renderContent()}
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
};

export default App;
