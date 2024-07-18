import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { Notify } from 'quasar';
import { useAuthStore } from 'stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const customApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
  response => response,
  async error => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    // 토큰 만료 오류 처리
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/user/refresh-token`,
          {
            refreshToken: refreshToken,
          },
        );

        if (response.status === 200) {
          const newAccessToken = response.data.accessToken;
          console.log('newAccessToken : ', newAccessToken);
          localStorage.setItem('accessToken', newAccessToken);
          customApi.defaults.headers.common[
            'Authorization'
            ] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return customApi(originalRequest);
        }
      } catch (error) {
        authStore.logout();
        Notify.create({
          message: '로그인이 필요합니다.',
          color: 'negative',
          position: 'top',
        });
        console.log('refresh token expired');
        window.location.href = '/';
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
