'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/i18n/client';
import { cookieName as langCookieName, languages } from '@/i18n/settings';
import { addYears } from 'date-fns';
import { useCookies } from 'react-cookie';

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const [cookies, setCookie] = useCookies([langCookieName]);
  const langMap: Record<string, string> = {
    en: 'English',
    es: 'Español'
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setCookie('i18next', lang, {
      expires: addYears(new Date(), 5),
      path: '/'
    });

    window?.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='relative h-8 w-8 rounded-none capitalize'
        >
          {cookies.i18next || 'en'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        {languages.map((lang) => (
          <DropdownMenuItem onClick={() => changeLanguage(lang)} key={lang}>
            {langMap[lang] || lang}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
