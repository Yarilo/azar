import { default as axios } from "axios";
import type { EventFields, PlaceFields, UserFields } from "../types/index.js";
import { URLS, BASE_URL } from '../constants.js'

const instance = axios.create({
  baseURL: BASE_URL,
});




export default {
  get: async (url: URLS) => {
    const response = await instance.get(url);
    return response && response.data;
  },
  post: async (url: URLS, data: EventFields | PlaceFields | UserFields) => {
    const response = await instance.post(url, data);
    return response && response.data;
  },
  authenticate: (authToken: string) => {
    instance.interceptors.request.use((config: any) => { // Perhaps a bit hackish...
      config.headers = { Authorization: authToken };
      return config;
    });
  }
};
