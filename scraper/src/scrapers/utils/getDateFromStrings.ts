const getDateFromStrings = ({ day, month, year, hour }: { day: string, month: string, year: string, hour?: string }): Date => {
    if (!hour) return new Date(`${month} ${day}, ${year}`);
    return new Date(`${month} ${day}, ${year} ${hour}`); //All times GMT, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
}
export default getDateFromStrings;