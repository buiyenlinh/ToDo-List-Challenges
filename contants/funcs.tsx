import moment from "moment"

export const DOMAIN = "http://localhost:3000";
export const convertIntToDate = (_int: number) => {
    return moment(_int * 1000).format('HH:mm, DD/MM/YYYY')
}
