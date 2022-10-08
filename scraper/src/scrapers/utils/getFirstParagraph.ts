const getFirstParagraph = (text: string) => {
    if (text.includes('.\n')) return text.substring(0, text.indexOf('.\n') + 1).trimEnd();
    return text;
}
export default getFirstParagraph;