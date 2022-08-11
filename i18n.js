import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import vi from "./public/lang/vi.json"
import en from "./public/lang/en.json"

let lang = "vi";
if (typeof window !== 'undefined') {
    let recoil_persist = localStorage.getItem("recoil-persist");
    if (recoil_persist) {
        recoil_persist = JSON.parse(recoil_persist);
        if (recoil_persist.CurrentLanguageState) {
            lang = recoil_persist.CurrentLanguageState;
        }
    }
}

i18next.use(initReactI18next).init({
    resources: {
        vi: {
            translation: vi
        },
        en: {
            translation: en
        }
    },
    lng: lang
})

export default i18next;