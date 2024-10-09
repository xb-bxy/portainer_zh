import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend'; // 保留这个导入

const systemLanguage = navigator.language || 'en';

i18n
  .use(Backend) // 使用这个而不是 HttpApi
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    lng: systemLanguage, // 默认语言跟随系统
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    debug: process.env.NODE_ENV === 'development', // 仅在开发模式下启用调试
  });

export default i18n;
