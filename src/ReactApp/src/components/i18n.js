/* 
 *  Copyright (c) 2019,2021 Beawre Digital SL
 *  
 *  This program and the accompanying materials are made available under the
 *  terms of the Eclipse Public License 2.0 which is available at
 *  http://www.eclipse.org/legal/epl-2.0.
 *  
 *  SPDX-License-Identifier: EPL-2.0 3
 *  
 */

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
