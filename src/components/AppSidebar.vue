<template>
  <q-drawer
    :model-value="isOpen"
    @update:model-value="onUpdateModelValue"
    show-if-above
    bordered
    class="app-sidebar"
  >
    <div v-if="isLoggedIn">
      <!-- 로그인 완료 섹션 -->
      <div class="sidebar-header">
        <h2 class="logo-title">KnowGet</h2>
      </div>
      <div class="sidebar-login-complete">
        <div class="welcome-message">
          <strong>{{ userName }}</strong> 님, 오늘도 응원합니다.
        </div>
        <q-btn
          label="마이페이지"
          color="primary"
          class="q-mt-sm full-width"
          @click="openPasswordConfirmPopup"
        />
        <q-btn
          label="로그아웃"
          flat
          class="q-mt-sm full-width logout-button"
          @click="logout"
        />
        <!-- 알림 아코디언 -->
        <q-expansion-item
          icon="mail"
          label="알림왔어요!"
          header-class="notification-header"
          dense
          switch-toggle-side
          class="notification-accordion"
        >
          <div class="notification-list">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="notification-item"
            >
              <div class="notification-content">
                <small class="notification-time">{{ notification.time }}</small>
                <p>{{ notification.message }}</p>
              </div>
            </div>
          </div>
        </q-expansion-item>
      </div>
    </div>
    <div v-else>
      <!-- 로그인 전 섹션 -->
      <div class="sidebar-header">
        <h2 class="logo-title">KnowGet</h2>
      </div>
      <div class="sidebar-login">
        <p>로그인 후 너겟을 마음껏 이용해보세요!</p>
        <q-input
          filled
          v-model="loginData.username"
          placeholder="아이디"
          class="q-mt-sm"
        />
        <q-input
          filled
          v-model="loginData.password"
          type="password"
          placeholder="비밀번호"
          class="q-mt-sm"
        />
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
    </div>

    <!-- 메뉴 항목 섹션 -->
    <q-list class="q-mt-md">
      <router-link
        v-for="link in linksList"
        :key="link.title"
        :to="link.link"
        class="router-link"
      >
        <q-item clickable v-ripple class="menu-item">
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
            <q-item-label caption>{{ link.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </router-link>
    </q-list>

    <!-- 비밀번호 확인 팝업 -->
    <PasswordConfirmPopup ref="passwordConfirmPopup" />
  </q-drawer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { defineProps, defineEmits, getCurrentInstance } from 'vue';
import axios from 'axios';
import PasswordConfirmPopup from 'components/PasswordConfirmPopup.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:isOpen']);

function onUpdateModelValue(value) {
  emit('update:isOpen', value);
}

const isLoggedIn = ref(false);
const userName = ref('');
const loginData = ref({
  username: '',
  password: '',
});
const notifications = ref([]);

const linksList = ref([
  {
    title: 'KnowGet 너겟',
    caption: '너겟 메인페이지',
    icon: 'home',
    link: '/',
  },
  {
    title: '일자리 찾기',
    caption: '일자리 공고입니다.',
    icon: 'work',
    link: '/jobpost',
  },
  {
    title: '교육 찾기',
    caption: '교육 정보를 확인하세요.',
    icon: 'school',
    link: '/education',
  },
  {
    title: '취업 가이드',
    caption: '취업 정보를 제공합니다.',
    icon: 'book',
    link: '/guide',
  },
  {
    title: '취업 성공사례',
    caption: '성공적인 취업 사례를 확인하세요.',
    icon: 'thumb_up',
    link: '/success',
  },
  {
    title: '상담하기',
    caption: '상담 서비스를 이용해보세요.',
    icon: 'chat',
    link: '/consult',
  },
]);

const { proxy } = getCurrentInstance();

function openPasswordConfirmPopup() {
  proxy.$refs.passwordConfirmPopup.openDialog();
}

async function login() {
  try {
    const response = await axios.post('/user/login', {
      username: loginData.value.username,
      password: loginData.value.password,
    });
    if (response.data.success) {
      isLoggedIn.value = true;
      userName.value = loginData.value.username;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', userName.value);

      // Fetch notifications after login
      notifications.value = [
        // Dummy data for now
        {
          id: 1,
          time: '14시간 전',
          read: false,
          message: '"동작구" 일자리 공고 안내 드립니다.',
        },
        // Add more notifications if needed
      ];
    } else {
      alert('로그인 실패: ' + response.data.message);
    }
  } catch (error) {
    console.error('로그인 중 오류 발생:', error);
    alert('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
  }
}

function logout() {
  isLoggedIn.value = false;
  loginData.value = { username: '', password: '' };
  userName.value = '';
  notifications.value = [];
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userName');
}

onMounted(() => {
  if (localStorage.getItem('isLoggedIn') === 'true') {
    isLoggedIn.value = true;
    userName.value = localStorage.getItem('userName') || '';
  }
});
</script>

<style scoped>
.app-sidebar {
  background-color: #e9f5fe;
}

.sidebar-header {
  text-align: center;
  padding-left: 20px;
  padding-right: 20px;
}

.sidebar-login,
.sidebar-login-complete {
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
}

.sidebar-login p,
.sidebar-login-complete p {
  margin-bottom: 0.5rem;
  color: #555;
}

.welcome-message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
}

.q-btn.primary {
  background-color: #5e9fcf;
  color: white;
}

.logout-button {
  background-color: #cccccc;
  color: #000;
}

.signup-button {
  background-color: #7bcaff;
  color: #000;
}

.router-link {
  text-decoration: none;
  color: inherit;
}

.router-link:hover .menu-item {
  background-color: #c3e2f7;
}

.full-width {
  width: 100%;
}

.logo-title {
  font-size: 1.5rem;
  color: #333;
  font-weight: bold;
}

.menu-item {
  padding: 10px 20px;
  border-radius: 4px;
}

.menu-item:hover {
  background-color: #c3e2f7;
}

.notification-header {
  background-color: #f7f9fc;
}

.notification-accordion {
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 10px;
}

.notification-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
}

.notification-item {
  padding: 10px;
  transition: background-color 0.3s;
}

.notification-item:hover {
  background-color: #f0f8ff;
}

.notification-content {
  flex-grow: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  white-space: pre-wrap;
}

.notification-time {
  color: #888;
  font-size: 0.9em;
  margin-bottom: 5px;
  display: block;
}
</style>
