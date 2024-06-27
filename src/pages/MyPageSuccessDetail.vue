<template>
  <q-card class="mypage-detail-card">
    <q-card-section>
      <div class="text-h5">{{ successStory.title }}</div>
      <div class="q-mt-md">
        <p><strong>작성자:</strong> {{ successStory.username }}</p>
        <p><strong>내용:</strong> {{ successStory.content }}</p>
        <p><strong>작성 날짜:</strong> {{ successStory.createdDate }}</p>
        <p>
          <strong>상태:</strong>
          {{
            successStory.isApproved === 1
              ? '승인됨'
              : successStory.isApproved === 2
              ? '거절됨'
              : '대기 중'
          }}
        </p>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { customApi } from 'boot/axios';
import { useAuthStore } from 'stores/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const successStory = ref({});

const fetchSuccessDetail = async () => {
  try {
    const response = await customApi.get(`/success-case/${route.params.id}`);
    if (response.data.username === authStore.username) {
      successStory.value = response.data;
    } else {
      router.push({ name: 'MyPageSuccessStories' });
    }
  } catch (error) {
    console.error('Failed to fetch success story detail:', error);
    router.push({ name: 'MyPageSuccessStories' });
  }
};

onMounted(fetchSuccessDetail);
</script>

<style scoped>
.mypage-detail-card {
  width: 100%;
  max-width: 800px;
  margin: auto;
  padding: 20px;
}
</style>
