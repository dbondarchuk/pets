export const fallbackLng = 'en' as const;
export const languages = [fallbackLng, 'es'] as const;

export const defaultNS = 'translation';
export const cookieName = 'i18next';

export function getOptions(
  lng: (typeof languages)[number] = fallbackLng,
  ns = defaultNS
) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  };
}
