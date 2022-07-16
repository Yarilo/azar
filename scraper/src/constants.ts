
const { AZAR_SERVER_URL = '' } = process.env;

export const BASE_URL = AZAR_SERVER_URL;
export const enum URLS {
    PLACES = '/places',
    EVENTS = '/events',
    LOGIN = '/login',
}