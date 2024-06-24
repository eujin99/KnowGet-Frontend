<template>
  <q-dialog v-model="isDialogOpen">
    <q-card>
      <q-card-section>
        <q-icon name="mail" size="sm"/>
        <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
        <q-card-section v-html="formattedContent"></q-card-section>
        <q-card-actions align="right">
          <q-btn flat color="primary" @click="goToPost">바로가기</q-btn>
          <q-btn flat label="닫기" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import {computed, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';

export default {
  name: 'NotificationPopup',
  setup() {
    const isDialogOpen = ref(false);
    const selectedNotification = ref({});
    const router = useRouter();
    const route = useRoute();

    function showNotificationPopup(notification) {
      selectedNotification.value = notification;
      isDialogOpen.value = true;
    }

    const formattedContent = computed(() => {
      if (selectedNotification.value.content) {
        const lines = selectedNotification.value.content.split('\n');
        lines[0] = `<strong class = "title">${lines[0]}</strong><br><br>`;
        return lines.join('<br>');
      }
      return '';
    });

    const goToPost = () => {
      if (selectedNotification.value.postId) {
        isDialogOpen.value = false; // 팝업을 닫음
        router.push({
          name: 'JobPostDetails',
          params: {postId: selectedNotification.value.postId},
        });
      }
    };


    return {
      isDialogOpen,
      selectedNotification,
      showNotificationPopup,
      formattedContent,
      goToPost,
    };
  },
};
</script>

<style scoped>
.title {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
