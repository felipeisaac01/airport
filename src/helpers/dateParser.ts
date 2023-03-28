import { addHours, addMinutes } from "date-fns";

export function dateParser(data: {
    date: string;
    time: string;
}) {
    const { date, time } = data
    const [hours, minutes] = time.split(":")
    return addMinutes(addHours(new Date(date.split("/").reverse().join("/")), parseInt(hours)), parseInt(minutes))
}