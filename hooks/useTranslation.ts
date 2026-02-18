import { useAppContext } from '../context/AppContext';

export const useTranslation = () => {
  const { t, language } = useAppContext();
  return { t, language: language || 'en' };
};