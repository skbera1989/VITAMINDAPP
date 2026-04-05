import { environment } from '../environments/environment';

const BASE_URL = environment.apiUrl;

export const ENDPOINTS = {
  AUTH: {
    init: `${BASE_URL}/init`,
  },
  CHAT: {
    chat: `${BASE_URL}/chat`,
  },
};