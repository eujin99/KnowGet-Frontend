import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { useAuthStore } from 'stores/authStore';

const api = axios.create({ baseURL: 'http://localhost:8080/api/v1' });

const customApi = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

customApi.interceptors.request.use(
  async config => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

customApi.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/user/refresh-token', {
          refreshToken: refreshToken,
        });

        if (response.status === 200) {
          const newAccessToken = response.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          customApi.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return customApi(originalRequest);
        }
      } catch (error) {
        authStore.logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api, customApi };
