<template>
  <q-page class="page-wrapper">
    <q-card class="mypage-card">
      <q-card-section>
        <div class="text-h5">상담 내역</div>
        <div v-if="consultations.length === 0" class="empty-state">
          <p>
            아직 진행하신 상담이 없네요! 필요하신 도움이 있다면 상담을
            신청해보세요!
          </p>
          <q-btn color="primary" @click="goToConsultPage">상담하러가기</q-btn>
        </div>
        <div v-else class="table-wrapper">
          <table class="counseling-table">
            <thead>
              <tr>
                <th>카테고리</th>
                <th class="wide-column">내용</th>
                <th>날짜</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="consultation in consultations"
                :key="consultation.counselingId"
                @click="goToConsultationDetail(consultation.counselingId)"
                class="clickable-row"
              >
                <td>{{ consultation.category }}</td>
                <td class="text-ellipsis">{{ consultation.content }}</td>
                <td>{{ formatDate(consultation.sentDate) }}</td>
                <td>
                  <span
                    :class="{
                      'status-answered': consultation.isAnswered,
                      'status-pending': !consultation.isAnswered,
                    }"
                  >
                    {{ consultation.isAnswered ? '답변 완료' : '답변 대기' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'stores/authStore';
import { customApi } from 'boot/axios';
import { format } from 'date-fns'; // Import date-fns for date formatting

const authStore = useAuthStore();
const consultations = ref([]);
const router = useRouter();

const fetchConsultations = async () => {
  try {
    if (authStore.isLoggedIn) {
      const response = await customApi.get('/mypage/counseling');
      console.log('Fetched consultations:', response.data);
      consultations.value = response.data;
    }
  } catch (error) {
    console.error('상담 내역을 가져오는데 실패했습니다:', error);
  }
};

const goToConsultationDetail = counselingId => {
  router.push({ name: 'MyPageCounselingDetail', params: { id: counselingId } });
};

const goToConsultPage = () => {
  router.push({ path: '/consult' });
};

const formatDate = date => {
  return format(new Date(date), 'yyyy-MM-dd');
};

onMounted(fetchConsultations);
</script>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.mypage-card {
  width: 100%;
  max-width: 1400px; /* Increased max-width for a more spacious layout */
  margin: 0 auto;
  padding: 0;
}

.table-wrapper {
  overflow-x: auto;
}

.counseling-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1em;
  font-family: sans-serif;
  table-layout: fixed; /* Fixed layout to handle ellipsis */
}

.counseling-table th,
.counseling-table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: center; /* Center-align all table fields */
  white-space: nowrap; /* Prevents vertical overflow */
  overflow: hidden; /* Ensures overflow is hidden */
  text-overflow: ellipsis; /* Adds ellipsis for overflow */
}

.counseling-table thead tr {
  background-color: #009879;
  color: #ffffff;
}

.counseling-table tbody tr {
  transition: background-color 0.3s ease;
}

.counseling-table tbody tr:hover {
  background-color: #f1f1f1;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wide-column {
  width: 50%; /* Make the content column wider */
}

.status-answered {
  color: #4caf50; /* Green for answered */
}

.status-pending {
  color: #ff5252; /* Red for pending */
}

.clickable-row {
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 20px;
}

.empty-state p {
  margin-bottom: 20px;
  font-size: 1.2em;
}

.empty-state q-btn {
  font-size: 1em;
}
</style>
