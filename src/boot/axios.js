import {boot} from 'quasar/wrappers';
import axios from 'axios';
import {Notify} from 'quasar';
import {useAuthStore} from 'stores/authStore';

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const api = axios.create({baseURL: 'http://3.36.148.87:8080/api/v1'});

const customApi = axios.create({
  baseURL: 'http://3.36.148.87:8080/api/v1',
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
    if (
      error.response.status === 401 ||
      (error.response.status === 400 && !originalRequest._retry)
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          'http://3.36.148.87:8080/api/v1/user/refresh-token',
          {
            refreshToken: refreshToken,
          },
        );

        if (response.status === 200) {
          const newAccessToken = response.data.accessToken;
          console.log('newAccessToken : ', newAccessToken)
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
        console.log('refresh token expired')
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  },
);

export default boot(({app}) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export {api, customApi};
