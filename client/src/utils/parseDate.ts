export default (dateString: string): string => {
    const date = new Date(dateString);
    const hours = date.getUTCHours(); // As everything is stored in Madrid timezone already, otherwise we will apply +1/2 here 
    const minutes = date.getMinutes() === 0 ? "00" : date.getMinutes();
    return `${hours}:${minutes}h`;
};