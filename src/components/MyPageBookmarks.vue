<template>
  <q-card class="mypage-card">
    <q-card-section>
      <div class="text-h5">북마크 내용</div>
      <!-- 북마크 리스트 구현 -->
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from 'stores/authStore';
import { customApi } from 'boot/axios';

const authStore = useAuthStore();
const bookmarks = ref([]);

const fetchBookmarks = async () => {
  if (!authStore.isLoggedIn) {
    return;
  }
  try {
    const response = await customApi.get('/mypage/bookmarks');
    bookmarks.value = response.data;
  } catch (error) {
    console.error('북마크 데이터를 가져오는데 실패했습니다:', error);
  }
};

onMounted(() => {
  authStore.initializeAuth();
  fetchBookmarks();
});
</script>

<style scoped>
.mypage-card {
  width: 100%;
  max-width: 800px;
}
</style>
