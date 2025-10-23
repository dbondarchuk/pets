import { useTranslation } from '@/i18n/client';
import { useRegisterActions } from 'kbar';
import { useTheme } from 'next-themes';

const useThemeSwitching = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const themeAction = [
    {
      id: 'toggleTheme',
      name: t('toggle_theme'),
      shortcut: ['t', 't'],
      section: t('theme_section'),
      perform: toggleTheme
    },
    {
      id: 'setLightTheme',
      name: t('set_light_theme'),
      section: t('theme_section'),
      perform: () => setTheme('light')
    },
    {
      id: 'setDarkTheme',
      name: t('set_dark_theme'),
      section: t('theme_section'),
      perform: () => setTheme('dark')
    }
  ];

  useRegisterActions(themeAction, [theme]);
};

export default useThemeSwitching;
