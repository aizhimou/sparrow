import axios from 'axios';
import { getStoredAccessToken } from '../../app/auth/authTokenStorage';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api',
  timeout: 15_000,
});

httpClient.interceptors.request.use((config) => {
  const token = getStoredAccessToken();

  config.headers.set('Accept', 'application/json');
  config.headers.set('Accept-Language', navigator.language || 'en-NZ');

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});
