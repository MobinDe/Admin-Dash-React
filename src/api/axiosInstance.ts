import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/', // از خود پروژه واکشی کنه
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

// interceptor برای خطاهای سراسری (اختیاری)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;