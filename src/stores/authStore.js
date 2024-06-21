import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false, // 사용자가 로그인 했는지 여부임 !
    user: {},
  }),
  actions: {
    async login(credentials) {
      try {
        //서버에 로그인 요청 보내는 코드 !
        const response = await api.post('/user/login', credentials);

        if (response.status === 200) {
          // 로그인 성공하면 상태 없데ㅔ이트 됨!!
          this.isLoggedIn = true;
          this.user = response.data;
          localStorage.setItem('isLoggedIn', 'true'); //로그인 상태 로컬에 저장
          localStorage.setItem('user', JSON.stringify(response.data)); //사용자 정보 로컬에 저장
        } else {
          throw new Error('Login failed');
        }
      } catch (error) {
        this.isLoggedIn = false;
        this.user = {};
        throw error;
      }
    },
    logout() {
      this.isLoggedIn = false;
      this.user = {};
      localStorage.removeItem('isLoggedIn'); //로컬에서 로그인 상태 ㅈ제거
      localStorage.removeItem('user'); //로컬에서 사용자 정보도 제거
    },
  },
});
