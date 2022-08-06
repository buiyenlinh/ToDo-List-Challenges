import { recoilPersist } from 'recoil-persist'
import { atom } from "recoil";
const { persistAtom } = recoilPersist()
export const langList = atom({
    key: "LangList",
    default: ['vi', 'en'],
})

export const currentLang = atom({
    key: "CurrentLang",
    default: "vi",
    effects_UNSTABLE: [persistAtom]
})