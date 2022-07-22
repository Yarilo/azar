const getPriceWithNumbersOnly = (priceString: string): string => priceString.replace(/[^0-9,€]/g, "").replace(",", ".",);

const parsePrice = (priceString: string): number => Number(getPriceWithNumbersOnly(priceString).split("€")[0]);
export default parsePrice;