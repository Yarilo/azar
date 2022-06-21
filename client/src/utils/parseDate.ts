export default (dateString: string):string => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes() === 0 ? "00" : date.getMinutes();
    return `${hours}:${minutes}h`;
};