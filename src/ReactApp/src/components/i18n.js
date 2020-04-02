import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import XHR from 'i18next-xhr-backend';

i18n
    .use(initReactI18next)
    .use(XHR)
    .init({
        interpolation: {
            escapeValue: false
        },
        lng: "en",
        fallbackLng: "en",
        debug: false,
        backend: {
            loadPath: '/locales/{{lng}}.json'
        }
    });

export default i18n;
