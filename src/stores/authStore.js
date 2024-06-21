import { defineStore } from 'pinia';
import { api, customApi } from 'boot/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    username: '',
    role: '',
    token: '',
  }),

  actions: {
    async login(credentials) {
      try {
        const response = await api.post('/user/login', credentials);

        if (response.status === 200) {
          this.setAuthData(response.data);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', response.data.username);
          localStorage.setItem('role', response.data.role);
          localStorage.setItem('token', response.data.token);
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
      localStorage.removeItem('token');
    },

    setAuthData({ username, role, token }) {
      this.isLoggedIn = true;
      this.username = username;
      this.role = role;
      this.token = token;
    },

    clearAuthData() {
      this.isLoggedIn = false;
      this.username = '';
      this.role = '';
      this.token = '';
    },

    initializeAuth() {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const username = localStorage.getItem('username');
      const role = localStorage.getItem('role');
      const token = localStorage.getItem('token');

      if (isLoggedIn && username && role && token) {
        this.setAuthData({ username, role, token });
      } else {
        this.clearAuthData();
      }
    },
  },
});
