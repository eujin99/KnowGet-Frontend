// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

//이건 mypage 접근 시 비밀번호 확인
router.beforeEach((to, from, next) => {
  if (to.path === '/mypage' && !localStorage.getItem('isLoggedIn')) {
    next('/');
  } else {
    next();
  }
});

export default router;
