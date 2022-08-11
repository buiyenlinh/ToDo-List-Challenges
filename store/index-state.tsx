import { atom } from "recoil";
import { recoilPersist } from 'recoil-persist'
const { persistAtom } = recoilPersist();
export const langListState = atom({
    key: "LangListState",
    default: [
        {
            id: 'vi',
            name: "Việt Nam"
        },
        {
            id: 'en',
            name: "English"
        }
    ],
})

export const currentLanguageState = atom({
    key: "CurrentLanguageState",
    default: "",
    effects_UNSTABLE: [persistAtom]
})