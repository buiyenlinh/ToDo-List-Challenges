import { atom } from "recoil";
export const langList = atom({
    key: "LangList",
    default: ['vi', 'en'],
})