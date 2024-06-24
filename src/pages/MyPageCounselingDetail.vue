<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <div class="text-h5">상담 내용</div>
        <div class="consultation-details">
          <div class="consultation-item">
            <strong>카테고리:</strong> {{ counseling.category }}
          </div>
          <div class="consultation-item">
            <strong>내용:</strong>
            <p>{{ counseling.content }}</p>
          </div>
          <div class="consultation-item">
            <strong>날짜:</strong> {{ counseling.sentDate }}
          </div>
          <div class="consultation-item">
            <strong>상태:</strong>
            {{ counseling.isAnswered ? '답변 완료' : '답변 대기' }}
          </div>
        </div>
      </q-card-section>
      <q-card-section v-if="counseling.isAnswered">
        <div class="text-h5">등록된 답변</div>
        <q-item-label v-if="answerContent">{{ answerContent }}</q-item-label>
        <q-item-label v-else>답변이 없습니다.</q-item-label>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { customApi } from 'boot/axios';

const route = useRoute();
const counseling = ref({});
const answerContent = ref('');

const fetchCounselingDetail = async () => {
  try {
    const response = await customApi.post(`/counseling/${route.params.id}`);
    console.log('Counseling details:', response.data);
    counseling.value = response.data;

    if (counseling.value.isAnswered) {
      await fetchAnswerContent(counseling.value.counselingId);
    }
  } catch (error) {
    console.error('Failed to fetch counseling details:', error);
  }
};

const fetchAnswerContent = async counselingId => {
  try {
    const answerResponse = await customApi.post(`/answer/${counselingId}`);
    console.log('Answer content:', answerResponse.data);
    answerContent.value = answerResponse.data.content;
  } catch (error) {
    console.error('Failed to fetch answer content:', error);
  }
};

onMounted(fetchCounselingDetail);
</script>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.page-card {
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.consultation-details {
  display: flex;
  flex-direction: column;
}

.consultation-item {
  margin-bottom: 15px;
}
</style>
