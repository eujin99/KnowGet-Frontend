<template>
  <q-card class="mypage-card">
    <q-card-section>
      <div class="text-h5">취업 성공사례 내역</div>
      <!-- 성공사례 리스트 구현 -->
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from 'stores/authStore';

const authStore = useAuthStore();

onMounted(() => {
  authStore.initializeAuth();
  // 성공사례 데이터 로드
});
</script>

<style scoped>
.mypage-card {
  width: 100%;
  max-width: 800px;
}
</style>
