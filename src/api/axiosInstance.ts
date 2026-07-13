import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';

const axiosInstance = axios.create({
  baseURL: '/',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;