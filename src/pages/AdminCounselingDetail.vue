<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <q-btn flat icon="arrow_back" @click="goBack" />
        <div class="text-h5">상담 내용</div>
        <div class="table-container">
          <table class="consultation-table">
            <tbody>
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
                <th>날짜</th>
                <td>{{ formatDate(counseling.sentDate) }}</td>
              </tr>
              <tr>
                <th>상태</th>
                <td>
                  {{ counseling.isAnswered ? '답변 완료' : '답변 대기' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="content-box">
          <strong>내용:</strong>
          <p>{{ counseling.content }}</p>
        </div>
      </q-card-section>
      <q-card-section v-if="!counseling.isAnswered">
        <div class="text-h5">답변 작성</div>
        <q-input
          v-model="answerContent"
          type="textarea"
          placeholder="답변 내용을 적어주세요."
          filled
          class="content-input"
          rows="6"
        />
        <div class="submit-button">
          <q-btn label="답변 등록" color="primary" @click="submitAnswer" />
        </div>
      </q-card-section>
      <q-card-section v-else>
        <div class="text-h5">등록된 답변</div>
        <div class="answer-box">
          <p v-if="answerContent">{{ answerContent }}</p>
          <p v-else>답변이 없습니다.</p>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { customApi } from 'boot/axios';
import { Notify, date } from 'quasar';

const route = useRoute();
const router = useRouter();
const counseling = ref({});
const answerContent = ref('');
const counselingId = ref(route.params.id);

const fetchCounselingDetail = async () => {
  try {
    const response = await customApi.post(`/counseling/${counselingId.value}`);
    counseling.value = response.data;

    if (counseling.value.isAnswered) {
      await fetchAnswerContent(counseling.value.counselingId);
    }
  } catch (error) {
    console.error('가져오는 데에 실패:', error);
  }
};

const fetchAnswerContent = async counselingId => {
  try {
    const answerResponse = await customApi.get(`/answer/${counselingId}`);
    answerContent.value = answerResponse.data.content;
  } catch (error) {
    console.error('Failed to fetch answer content:', error);
  }
};

const submitAnswer = async () => {
  if (!answerContent.value.trim()) {
    Notify.create({
      type: 'negative',
      message: '답변 내용을 입력해주세요.',
      timeout: 2000,
      position: 'top',
    });
    return;
  }
  try {
    const response = await customApi.post('/answer', {
      counselingId: counseling.value.counselingId,
      content: answerContent.value,
    });

    counseling.value.isAnswered = true;
    counseling.value.answerId = response.data.answerId;

    Notify.create({
      type: 'positive',
      message: '답변이 등록되었습니다.',
      timeout: 2000,
      position: 'top',
    });
    await router.push({
      name: 'AdminCounselingDetail',
      params: { id: counseling.value.counselingId },
    });
  } catch (error) {
    console.error('Failed to submit answer:', error);
    Notify.create({
      type: 'negative',
      message: '답변 등록 중 오류가 발생했습니다.',
      timeout: 2000,
      position: 'top',
    });
  }
};

const formatDate = dateString => {
  const dateObj = new Date(dateString);
  return isNaN(dateObj) ? '' : date.formatDate(dateObj, 'YYYY-MM-DD');
};

const goBack = () => {
  router.go(-1);
};

onMounted(fetchCounselingDetail);
</script>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.page-card {
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.table-container {
  overflow-x: auto;
}

.consultation-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1em;
  font-family: sans-serif;
}

.consultation-table th,
.consultation-table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: left;
}

.consultation-table th {
  background-color: #f5f5f5;
}

.content-box,
.answer-box {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.content-input {
  width: 100%;
  min-height: 150px;
}

.submit-button {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
