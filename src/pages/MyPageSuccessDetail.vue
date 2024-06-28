<template>
  <q-page class="page-wrapper">
    <q-card class="mypage-detail-card">
      <q-card-section>
        <div class="text-h5">{{ successStory.title }}</div>
        <div class="q-mt-md">
          <p><strong>작성자:</strong> {{ successStory.username }}</p>
          <p><strong>내용:</strong> {{ successStory.content }}</p>
          <p>
            <strong>작성 날짜:</strong>
            {{ formatDate(successStory.createdDate) }}
          </p>
          <p>
            <strong>상태:</strong>
            {{ getStatusText(successStory.isApproved) }}
          </p>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { customApi } from 'boot/axios';
import { useAuthStore } from 'stores/authStore';
import { format, parseISO } from 'date-fns';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const successStory = ref({});

const fetchSuccessDetail = async () => {
  const caseId = route.params.caseId;
  if (!caseId) {
    console.error('Case ID is undefined');
    router.push({ name: 'MyPageSuccessStories' });
    return;
  }

  try {
    const response = await customApi.get(
      `/api/v1/mypage/success-case/${caseId}`,
    );
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

const formatDate = date => {
  if (!date) return 'N/A';
  try {
    return format(parseISO(date), 'yyyy-MM-dd');
  } catch (error) {
    console.error('Invalid date format:', date);
    return 'Invalid date';
  }
};

const getStatusText = status => {
  switch (status) {
    case 1:
      return '승인됨';
    case 2:
      return '거절됨';
    default:
      return '대기 중';
  }
};

onMounted(fetchSuccessDetail);
</script>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: #f9f9f9;
}

.mypage-detail-card {
  width: 100%;
  max-width: 800px;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.q-mt-md {
  margin-top: 16px;
}

.text-h5 {
  font-size: 1.25rem;
  font-weight: bold;
}

p {
  margin: 0 0 10px;
}

p strong {
  display: inline-block;
  width: 100px;
  color: #333;
}
</style>
