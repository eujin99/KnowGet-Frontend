<template>
  <q-page class="non-admin-page">
    <q-card>
      <q-card-section>
        <div class="text-h5">접근 불가</div>
        <br />
        <p>어라라 ?<br />여길 어떻게 들어오셨죠 ?</p>
        <p>죄송합니다, 이 곳은 접근이 불가한 페이지 입니다.</p>
        <q-btn label="홈으로 돌아가기" @click="goHome" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.non-admin-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}
</style>
