import Vue from 'vue';
import VueI18n from 'vue-i18n';
import defLan from './zh_CN';
import { getCookie } from '@/api/cookie';
import axios from '@/api/http/axios';
import localesMap from './filesMap.json';
import { myStorage } from '@/utils/utils';

Vue.use(VueI18n);
const lang = getCookie('lan') || 'zh_CN';
const langKey = localesMap[lang];


const messages = {
  def_Lan: {
    ...defLan,
  },
};
export const i18n = new VueI18n({
  locale: 'def_Lan',
  messages,
});


function loadLocaleMessage(locale, cb) {
  const localeCache = myStorage.get('locale') || {};
  const localeJson = localeCache[langKey];
  if (localeJson) {
    cb(null, localeJson);
  } else {
    axios({
      url: `./static/locales/${localesMap[lang]}`,
      method: 'get',
      hostType: 'def',
    }).then((res) => {
      cb(null, res);
    }).catch((error) => {
      cb(error);
    });
  }
}

export function changeLanguage(lan, change) {
  const localeCache = myStorage.get('locale') || {};
  loadLocaleMessage(lan, (error, message) => {
    if (error) {
      console.log(error);
    }
    i18n.locale = lan;
    i18n.setLocaleMessage(lan, message);
    const keys = Object.keys(localeCache);
    keys.forEach((item) => {
      if (item.indexOf(lan) > -1) {
        delete localeCache[item];
      }
    });
    localeCache[langKey] = message;
    myStorage.set('locale', localeCache);
    if (change) {
      window.location.reload();
    }
  });
}

changeLanguage(lang);
