<template>
  <div class="sidebar-login">
    <p>로그인 후 너겟을 마음껏 이용해보세요!</p>
    <form>
      <q-input
        filled
        v-model="loginData.username"
        placeholder="아이디"
        class="q-mt-sm"
        autocomplete="username"
        @keyup.enter="login"
      />
      <q-input
        filled
        v-model="loginData.password"
        type="password"
        placeholder="비밀번호"
        class="q-mt-sm"
        autocomplete="current-password"
        @keyup.enter="login"
      />
    </form>
    <q-btn
      label="로그인"
      color="primary"
      class="q-mt-sm full-width"
      @click="login"
    />
    <q-btn
      label="회원가입"
      flat
      class="q-mt-sm full-width signup-button"
      @click="$router.push('/signup')"
    />
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useAuthStore} from 'stores/authStore';
import {useNotificationStore} from 'stores/notificationStore';
import {Notify} from 'quasar';

const loginData = ref({
  username: '',
  password: '',
});

const authStore = useAuthStore();
const router = useRouter();
const notificationStore = useNotificationStore();

async function login() {
  try {
    await authStore.login(loginData.value);

    if (authStore.isLoggedIn) {
      await notificationStore.fetchUnreadCount();
      await notificationStore.fetchNotifications();
      await router.push('/');
      Notify.create({
        message: authStore.username + '님, 환영합니다!',
        color: 'positive',
        position: 'top-right',
        timeout: 2000,
      });
    } else {
      alert('로그인 실패: 서버에서 올바른 응답을 받지 못했습니다.');
    }
  } catch (error) {
    Notify.create({
      message: '아이디 혹은 비밀번호를 다시 확인해 주세요!',
      color: 'negative',
      position: 'top-right',
      timeout: 2000,
    });
  }
}
</script>

<style scoped>
.sidebar-login {
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
}

.sidebar-login p {
  margin-bottom: 0.5rem;
  color: #555;
}

.q-btn.primary {
  background-color: #5e9fcf;
  color: white;
}

.signup-button {
  background-color: #7bcaff;
  color: #000;
}

.full-width {
  width: 100%;
}
</style>
