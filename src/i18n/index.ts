import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { cookies } from 'next/headers';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { cookieName, getOptions, languages } from './settings';

const initI18next = async (lng?: (typeof languages)[number], ns?: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./locales/${language}/${namespace}.json`)
      )
    )
    .init(getOptions(lng, ns));
  return i18nInstance;
};

export const getLanguage = async () => {
  const headerCookies = await cookies();
  const value = headerCookies.get(cookieName)
    ?.value as (typeof languages)[number];
  return !!value && languages.includes(value) ? value : undefined;
};

export async function getI18nAsync(
  lng?: (typeof languages)[number],
  ns?: string,
  options: { keyPrefix?: string } = {}
) {
  if (!lng) lng = await getLanguage();
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(
      lng || null,
      Array.isArray(ns) ? ns[0] : ns,
      options.keyPrefix
    ),
    i18n: i18nextInstance
  };
}
