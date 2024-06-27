<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <div class="text-h5">상담 내용</div>
        <div class="consultation-details">
          <div class="consultation-item">
            <strong>상담 ID:</strong> {{ counseling.counselingId }}
          </div>
          <div class="consultation-item">
            <strong>사용자:</strong> {{ counseling.user }}
          </div>
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
          <q-btn label="답변 등록" color="primary" @click="submitAnswer"/>
        </div>
      </q-card-section>
      <q-card-section v-else>
        <div class="text-h5">등록된 답변</div>
        <p v-if="answerContent">{{ answerContent }}</p>
        <p v-else>답변이 없습니다.</p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {customApi} from 'boot/axios';

const route = useRoute();
const router = useRouter();
const counseling = ref({});
const answerContent = ref('');

const fetchCounselingDetail = async () => {
  try {
    const response = await customApi.post(`/counseling/${route.params.id}`);
    // console.log('Counseling details:', response.data);
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
    const answerResponse = await customApi.post(`/answer/${counselingId}`);
    // console.log('답변:', answerResponse.data);
    answerContent.value = answerResponse.data.content;
  } catch (error) {
    console.error('Failed to fetch answer content:', error);
  }
};

const submitAnswer = async () => {
  try {
    const response = await customApi.post('/answer', {
      counselingId: counseling.value.counselingId,
      content: answerContent.value,
    });

    counseling.value.isAnswered = true;
    counseling.value.answerId = response.data.answerId;

    alert('답변이 등록되었습니다.');
    await router.push({name: 'AdminCounselingDetail'});
  } catch (error) {
    console.error('Failed to submit answer:', error);
    alert('답변 등록 중 오류가 발생했습니다.');
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
