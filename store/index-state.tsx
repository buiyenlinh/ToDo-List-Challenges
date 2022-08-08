import { atom } from "recoil";
export const langListState = atom({
    key: "LangListState",
    default: ['vi', 'en'],
})