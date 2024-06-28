<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <div class="text-h5">상담 내용</div>
        <table class="consultation-table">
          <tr>
            <th>상담 ID</th>
            <td>{{ counseling.counselingId }}</td>
          </tr>
          <tr>
            <th>사용자</th>
            <td>{{ counseling.user }}</td>
          </tr>
          <tr>
            <th>카테고리</th>
            <td>{{ counseling.category }}</td>
          </tr>
          <tr>
            <th>내용</th>
            <td>{{ counseling.content }}</td>
          </tr>
          <tr>
            <th>날짜</th>
            <td>{{ counseling.sentDate }}</td>
          </tr>
          <tr>
            <th>상태</th>
            <td>{{ counseling.isAnswered ? '답변 완료' : '답변 대기' }}</td>
          </tr>
        </table>
      </q-card-section>
      <q-card-section v-if="counseling.isAnswered">
        <div class="text-h5">등록된 답변</div>
        <div class="answer-content">
          <p v-if="answerContent">{{ answerContent }}</p>
          <p v-else>답변이 없습니다.</p>
        </div>
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
    console.log('Answer content:', answerResponse.content);
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
  box-sizing: border-box;
  background-color: #f9f9f9;
}

.page-card {
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.consultation-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.consultation-table th,
.consultation-table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
}

.consultation-table th {
  background-color: #f0f0f0;
  text-align: left;
  font-weight: bold;
}

.consultation-table td {
  background-color: #fff;
}

.text-h5 {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 16px;
}

.answer-content {
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-top: 10px;
}
</style>
