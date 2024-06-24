import {defineStore} from 'pinia';
import {customApi} from 'boot/axios';
import {formatDistanceToNow, parseISO} from 'date-fns';
import {ko} from 'date-fns/locale';
import {useAuthStore} from 'src/stores/authStore';
import {ref} from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([]);
  const unreadCount = ref(0);
  const authStore = useAuthStore();

  const fetchUnreadCount = async () => {
    if (!authStore.isLoggedIn) return;
    try {
      const response = await customApi.get('/notifications/unread-count');
      unreadCount.value = response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    if (!authStore.isLoggedIn) return;
    try {
      const response = await customApi.get('/notifications/all');
      notifications.value = response.data.map(notification => ({
        ...notification,
        formattedDate: formatDistanceToNow(parseISO(notification.sentDate), {
          addSuffix: true,
          locale: ko,
        }),
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notification) => {
    if (!authStore.isLoggedIn) return;
    try {
      await customApi.post(
        `/notifications/read/${notification.notificationId}`);
      notification.isRead = true;
      unreadCount.value -= 1;
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!authStore.isLoggedIn) return;
    try {
      await customApi.delete(`/notifications/${notificationId}`);

      // 로컬 상태에서 알림 삭제
      notifications.value = notifications.value.filter(
        notification => notification.notificationId !== notificationId
      );
      // 읽지 않은 알림 개수 갱신
      await fetchUnreadCount();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    fetchUnreadCount,
    fetchNotifications,
    markAsRead,
    deleteNotification,
  };
});
