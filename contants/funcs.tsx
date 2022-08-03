import moment from "moment"

export const convertIntToDate = (_int: number) => {
    return moment(_int * 1000).format('hh:mm, DD/MM/YYYY')
}