import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'stores/authStore';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.initializeAuth(); // 새로고침 시 인증 상태 복원

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isLoggedIn) {
      next('/otherpage');
    } else if (
      to.matched.some(record => record.meta.role) &&
      authStore.role !== to.meta.role
    ) {
      next('/otherpage'); // 권한이 없는 경우
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
