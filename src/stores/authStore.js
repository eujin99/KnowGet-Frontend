import {defineStore} from 'pinia';
import {api} from 'boot/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false, // 사용자가 로그인 했는지 여부임 !
    username: '', // 사용자 이름
    role: '', // 사용자 역할
    token: '', // 사용자 토큰
  }),
  actions: {
    async login(credentials) {
      try {
        //서버에 로그인 요청 보내는 코드 !
        const response = await api.post('/user/login', credentials);

        if (response.status === 200) {
          // 로그인 성공하면 상태 업데이트 됨!!
          this.isLoggedIn = true;
          this.username = response.data.username;
          this.role = response.data.role;
          this.token = response.data.token;
          localStorage.setItem('isLoggedIn', 'true'); //로그인 상태 로컬에 저장
          localStorage.setItem('username', response.data.username); //사용자 정보 로컬에 저장
          localStorage.setItem('role', response.data.role); //사용자 정보 로컬에 저장
          localStorage.setItem('token', response.data.token); //사용자 정보 로컬에 저장
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    logout() {
      this.isLoggedIn = false;
      this.username = '';
      this.role = '';
      this.token = '';
      localStorage.setItem('isLoggedIn', 'false'); //로컬에서 로그인 상태 제거
      localStorage.removeItem('username'); //로컬에서 사용자 정보 제거
      localStorage.removeItem('role'); //로컬에서 사용자 정보 제거
      localStorage.removeItem('token'); //로컬에서 사용자 정보 제거
    },
  },
});
