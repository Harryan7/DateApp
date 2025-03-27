import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Dil kaynaklarını içe aktarıyoruz
import enTranslation from './locales/en.json';
import trTranslation from './locales/tr.json';

// i18next yapılandırması
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources: {
      en: { translation: enTranslation },
      tr: { translation: trTranslation },
    },
    lng: Localization.locale.split('-')[0], // Cihaz dilini varsayılan olarak kullan
    fallbackLng: 'en', // Varsayılan dil: İngilizce
    interpolation: {
      escapeValue: false // React zaten XSS koruması sağlıyor
    }
  });

export default i18n; 