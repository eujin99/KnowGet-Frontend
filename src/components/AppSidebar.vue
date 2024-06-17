<!-- src/components/AppSidebar.vue -->
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
          <q-btn dense round flat icon="mail" @click="toggleNotificationPopup">
            <q-badge color="red" floating transparent v-if="unreadMessages">{{
              unreadMessages
            }}</q-badge>
          </q-btn>
          <NotificationPopup
            :notifications="notifications"
            ref="notificationPopup"
            @notification-updated="updateUnreadMessages"
          />
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
      </div>
      <div class="location-section">
        <p>
          <q-icon name="place" size="xs" />
          <span> {{ userName }} 님의 희망 근무지예요. </span>
        </p>
        <SelectBoxComponent
          v-model="selectedLocation"
          :options="locations"
          label="근무 희망 지역"
        />
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
import NotificationPopup from './NotificationPopup.vue';
import SelectBoxComponent from './SelectBoxComponent.vue';
import PasswordConfirmPopup from './PasswordConfirmPopup.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  staticSidebar: {
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
const unreadMessages = ref(4);
const loginData = ref({
  username: '',
  password: '',
});
const selectedLocation = ref(null);
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

const locations = ref([
  { label: '강남구', value: '강남구' },
  { label: '강동구', value: '강동구' },
  { label: '강북구', value: '강북구' },
  { label: '강서구', value: '강서구' },
  { label: '관악구', value: '관악구' },
  { label: '광진구', value: '광진구' },
  { label: '구로구', value: '구로구' },
  { label: '금천구', value: '금천구' },
  { label: '노원구', value: '노원구' },
  { label: '도봉구', value: '도봉구' },
  { label: '동대문구', value: '동대문구' },
  { label: '동작구', value: '동작구' },
  { label: '마포구', value: '마포구' },
  { label: '서대문구', value: '서대문구' },
  { label: '서초구', value: '서초구' },
  { label: '성동구', value: '성동구' },
  { label: '성북구', value: '성북구' },
  { label: '송파구', value: '송파구' },
  { label: '양천구', value: '양천구' },
  { label: '영등포구', value: '영등포구' },
  { label: '용산구', value: '용산구' },
  { label: '은평구', value: '은평구' },
  { label: '종로구', value: '종로구' },
  { label: '중구', value: '중구' },
  { label: '중랑구', value: '중랑구' },
]);

const { proxy } = getCurrentInstance();

function toggleNotificationPopup() {
  if (notificationPopup.value) {
    notificationPopup.value.show();
  }
}

function openPasswordConfirmPopup() {
  proxy.$refs.passwordConfirmPopup.openDialog();
}

function login() {
  isLoggedIn.value = true;
  userName.value = loginData.value.username;
  selectedLocation.value = localStorage.getItem('location');
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userName', userName.value);

  notifications.value = [
    {
      id: 1,
      avatar: 'path/to/avatar1.png',
      user: '관리자',
      target: userName.value,
      time: '14시간 전',
      read: false,
    },
    {
      id: 2,
      avatar: 'path/to/avatar2.png',
      user: '관리자',
      target: userName.value,
      time: '2일 전',
      read: false,
    },
    {
      id: 3,
      avatar: 'path/to/avatar3.png',
      user: '관리자',
      target: userName.value,
      time: '2일 전',
      read: false,
    },
    {
      id: 4,
      avatar: 'path/to/avatar4.png',
      user: '관리자',
      target: userName.value,
      time: '2일 전',
      read: false,
    },
    {
      id: 5,
      avatar: 'path/to/avatar5.png',
      user: '관리자',
      target: userName.value,
      time: '3일 전',
      read: false,
    },
    {
      id: 6,
      avatar: 'path/to/avatar6.png',
      user: '관리자',
      target: userName.value,
      time: '4일 전',
      read: false,
    },
    {
      id: 7,
      avatar: 'path/to/avatar7.png',
      user: '관리자',
      target: userName.value,
      time: '5일 전',
      read: false,
    },
  ];
  unreadMessages.value = notifications.value.filter(n => !n.read).length;
}

function logout() {
  isLoggedIn.value = false;
  loginData.value = { username: '', password: '' };
  userName.value = '';
  selectedLocation.value = '';
  notifications.value = [];
  unreadMessages.value = 0;
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userName');
}

function selectLocation(location) {
  selectedLocation.value = location;
  localStorage.setItem('location', location);
}

function updateUnreadMessages() {
  unreadMessages.value = notifications.value.filter(n => !n.read).length;
}

onMounted(() => {
  if (localStorage.getItem('isLoggedIn') === 'true') {
    isLoggedIn.value = true;
    userName.value = localStorage.getItem('userName') || '';
    selectedLocation.value = localStorage.getItem('location');
    notifications.value = [
      {
        id: 1,
        avatar: 'path/to/avatar1.png',
        user: '관리자',
        target: userName.value,
        time: '14시간 전',
        read: false,
      },
      {
        id: 2,
        avatar: 'path/to/avatar2.png',
        user: '관리자',
        target: userName.value,
        time: '2일 전',
        read: false,
      },
      {
        id: 3,
        avatar: 'path/to/avatar3.png',
        user: '관리자',
        target: userName.value,
        time: '2일 전',
        read: false,
      },
      {
        id: 4,
        avatar: 'path/to/avatar4.png',
        user: '관리자',
        target: userName.value,
        time: '2일 전',
        read: false,
      },
      {
        id: 5,
        avatar: 'path/to/avatar5.png',
        user: '관리자',
        target: userName.value,
        time: '3일 전',
        read: false,
      },
      {
        id: 6,
        avatar: 'path/to/avatar6.png',
        user: '관리자',
        target: userName.value,
        time: '4일 전',
        read: false,
      },
      {
        id: 7,
        avatar: 'path/to/avatar7.png',
        user: '관리자',
        target: userName.value,
        time: '5일 전',
        read: false,
      },
    ];
    unreadMessages.value = notifications.value.filter(n => !n.read).length;
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

.location-section {
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
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
</style>
