import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    username: '',
    role: '',
    accessToken: '',
    refreshToken: '',
    // isActive: true,
  }),

  actions: {
    async login(credentials) {
      try {
        const response = await api.post('/user/login', credentials);

        if (response.status === 200) {
          // console.log('isActive:', response.data.isActive);

          // if (!response.data.isActive) {
          //   console.log('계정이 비활성화되어 있습니다.');
          //   throw new Error('계정이 비활성화되어 있습니다.');
          // }

          this.setAuthData(response.data);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', response.data.username);
          localStorage.setItem('role', response.data.role);
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          // localStorage.setItem('isActive', response.data.isActive);
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    logout() {
      this.clearAuthData();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // localStorage.removeItem('isActive');
    },

    setAuthData({ username, role, accessToken, refreshToken, isActive }) {
      this.isLoggedIn = true;
      this.username = username;
      this.role = role;
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      // this.isActive = isActive;
    },

    clearAuthData() {
      this.isLoggedIn = false;
      this.username = '';
      this.role = '';
      this.accessToken = '';
      this.refreshToken = '';
      // this.isActive = null;
    },

    initializeAuth() {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const username = localStorage.getItem('username');
      const role = localStorage.getItem('role');
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      // const isActive = localStorage.getItem('isActive');

      if (
        isLoggedIn &&
        username &&
        role &&
        accessToken &&
        refreshToken //&&
        // isActive
      ) {
        this.setAuthData({
          username,
          role,
          accessToken,
          refreshToken,
          // isActive,
        });
      } else {
        this.clearAuthData();
      }
    },
  },
});
