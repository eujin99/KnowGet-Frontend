import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useAuthStore = defineStore('auth', {
  //상태 정의
  state: () => ({
    isLoggedIn: false,
    username: '',
    role: '',
    token: '',
  }),

  //동작 정의
  actions: {
    /**
     * 로그인
     * 서버에 로그인 요청을 보내고, 성공하면 상태와 로컬 저장소에 사용자 정보를 저장
     * @param {Object} credentials - 로그인 자격증명 (username, password)
     * @author 윾진
     */
    async login(credentials) {
      try {
        const response = await api.post('/user/login', credentials);

        if (response.status === 200) {
          // 요청 성공
          this.setAuthData(response.data); // 스토어 상태 업데이트
          // 로컬 저장소에 로그인 정보 저장
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', response.data.username);
          localStorage.setItem('role', response.data.role);
          localStorage.setItem('token', response.data.token);
        } else {
          console.log(response.data.message); // 요청 실패 메시지 출력
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    /**
     * 로그아웃
     * 스토어 상태와 로컬 저장소에서 사용자 정보를 제거
     * @author 윾진
     */
    logout() {
      this.clearAuthData(); // 스토어 상태 초기화
      // 로컬 저장소에서 로그인 정보 제거
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('token');
    },

    /**
     * 인증 데이터 설정
     * 로그인 성공 시 스토어 상태를 업데이트
     * @param {Object} authData - 인증 데이터 (username, role, token)
     * @author 윾진
     */
    setAuthData({ username, role, token }) {
      this.isLoggedIn = true; // 로그인 상태를 true로 설정
      this.username = username; // 사용자 이름 설정
      this.role = role; // 사용자 역할 설정
      this.token = token; // 사용자 토큰 설정
    },

    /**
     * 인증 데이터 초기화
     * 로그아웃 시 스토어 상태를 기본값으로 초기화
     * @author 윾진
     */
    clearAuthData() {
      this.isLoggedIn = false; // 로그인 상태를 false로 설정
      this.username = ''; // 사용자 이름 초기화
      this.role = ''; // 사용자 역할 초기화
      this.token = ''; // 사용자 토큰 초기화
    },

    /**
     * 인증 초기화
     * 애플리케이션 시작 시 로컬 저장소에서 로그인 정보를 읽어와 스토어 상태를 복원
     * @author 윾진
     */
    initializeAuth() {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // 로컬 저장소에서 로그인 상태 확인
      const username = localStorage.getItem('username'); // 로컬 저장소에서 사용자 이름 가져오기
      const role = localStorage.getItem('role'); // 로컬 저장소에서 사용자 역할 가져오기
      const token = localStorage.getItem('token'); // 로컬 저장소에서 사용자 토큰 가져오기

      if (isLoggedIn && username && role && token) {
        // 모든 정보가 유효할 때
        this.setAuthData({ username, role, token }); // 스토어 상태 복원
      } else {
        this.clearAuthData(); // 유효하지 않은 경우 스토어 상태 초기화
      }
    },
  },
});
