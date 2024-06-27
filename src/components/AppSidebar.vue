<template>
  <q-drawer
    :model-value="isOpen"
    @update:model-value="onUpdateModelValue"
    show-if-above
    bordered
    class="app-sidebar"
  >
    <div class="sidebar-header">
      <h2 class="logo-title">KnowGet</h2>
    </div>
    <div v-if="authStore.isLoggedIn">
      <!-- 로그인 완료 섹션 -->
      <div class="sidebar-login-complete">
        <div class="welcome-message">
          <strong>{{ authStore.username }}</strong> 님, 오늘도 응원합니다.
        </div>
        <div v-if="authStore.role !== 'ADMIN'">
          <q-btn
            label="마이페이지"
            color="primary"
            class="q-mt-sm full-width"
            @click="goToMyPage"
          />
          <!-- 알림 아코디언 -->
          <q-expansion-item
            dense
            switch-toggle-side
            class="notification-accordion"
          >
            <template v-slot:header>
              <div class="notification-header">
                <div class="notification-text-container">
                  <q-icon name="mail" class="mail-icon" />
                  <q-badge
                    v-if="notificationStore.unreadCount > 0"
                    color="red"
                    floating
                  >
                    {{ notificationStore.unreadCount }}
                  </q-badge>
                  <span class="notification-label">알림왔어요!</span>
                </div>
              </div>
            </template>
            <div class="notification-list">
              <div
                v-for="notification in notifications"
                :key="notification.notificationId"
                :class="{
                  'notification-item': true,
                  read: notification.isRead,
                }"
              >
                <div class="notification-content">
                  <small class="notification-time">
                    {{ notification.formattedDate }}
                  </small>
                  <p @click="handleNotificationClick(notification)">
                    {{ notification.content }}
                  </p>
                </div>
                <q-btn
                  dense
                  icon="close"
                  @click="deleteNotification(notification.notificationId)"
                  class="delete-button"
                />
              </div>
            </div>
          </q-expansion-item>
        </div>
        <div v-else>
          <q-btn
            label="관리자 대시보드"
            color="primary"
            class="q-mt-sm full-width"
            @click="goToDashboard"
          />
        </div>
        <q-btn
          label="로그아웃"
          flat
          class="q-mt-sm full-width logout-button"
          @click="logout"
        />
        <NotificationPopup ref="notificationPopup" />
      </div>
    </div>
    <div v-else>
      <!-- 로그인 전 섹션 -->
      <AppLogin />
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
  </q-drawer>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useAuthStore } from 'stores/authStore';
import AppLogin from 'components/AppLogin.vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from 'stores/notificationStore';
import NotificationPopup from 'components/NotificationPopup.vue';
import { Notify } from 'quasar';

export default defineComponent({
  components: {
    AppLogin,
    NotificationPopup,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const router = useRouter();
    const authStore = useAuthStore();
    const notificationStore = useNotificationStore();
    const notifications = computed(() => notificationStore.notifications);

    const onUpdateModelValue = value => {
      emit('update:isOpen', value);
    };

    onMounted(async () => {
      if (localStorage.getItem('isLoggedIn') === 'true') {
        authStore.isLoggedIn = true;
        authStore.username = localStorage.getItem('username');
        authStore.role = localStorage.getItem('role');
      }
      await notificationStore.fetchUnreadCount();
      await notificationStore.fetchNotifications();
    });

    const goToMyPage = () => {
      router.push('/mypage');
    };

    const goToDashboard = () => {
      router.push('/dashboard');
    };

    const logout = () => {
      authStore.logout();
      router.push('/');
      Notify.create({
        type: 'info', // 알림 유형 (info, positive, negative 등)
        message: '로그아웃되었습니다. 이용해 주셔서 감사합니다.',
        timeout: 3000, // 알림이 표시되는 시간 (밀리초)
        position: 'top-right', // 알림이 표시되는 위치 (top, bottom, left, right 등 조합 가능)
      });
    };

    const handleNotificationClick = async notification => {
      if (!notification.isRead) {
        await notificationStore.markAsRead(notification);
      }
      if (notificationPopup.value) {
        notificationPopup.value.showNotificationPopup(notification);
      }
    };

    const notificationPopup = ref(null);

    const deleteNotification = async notificationId => {
      try {
        await notificationStore.deleteNotification(notificationId);
        Notify.create({
          type: 'info',
          message: '알림이 삭제되었습니다.',
          timeout: 3000,
          position: 'top-right',
        });
      } catch (error) {
        console.error('Failed to delete notification:', error);
        Notify.create({
          type: 'negative',
          message: '알림 삭제 중 오류가 발생했습니다.',
          timeout: 3000,
          position: 'top-right',
        });
      }
    };

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

    return {
      props,
      authStore,
      notificationStore,
      notifications,
      onUpdateModelValue,
      goToMyPage,
      goToDashboard,
      logout,
      handleNotificationClick,
      notificationPopup,
      deleteNotification,
      linksList,
    };
  },
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

.sidebar-login-complete {
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
}

.notification-text-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.notification-label {
  flex-grow: 1;
  text-align: center;
}

.mail-icon-container {
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
}

.mail-icon {
  margin-right: 0;
}

.notification-badge {
  position: absolute;
  top: -10px;
  right: -10px;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background-color 0.3s;
}

.notification-item:hover {
  background-color: #f0f8ff;
}

.notification-item.read {
  background-color: #f5f5f5;
  color: #888;
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

.delete-button {
  margin-left: 10px;
  font-size: 7px;
}
</style>
