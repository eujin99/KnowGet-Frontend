<template>
  <q-page class="page-wrapper">
    <q-card class="mypage-card">
      <q-card-section>
        <div class="text-h5">내 성공사례 목록</div>
        <div v-if="successCases.length === 0" class="empty-state">
          <p>아직 작성하신 성공사례가 없네요! 성공사례를 작성해보세요!</p>
          <q-btn color="primary" @click="goToSuccessWritePage"
            >성공사례 작성하기</q-btn
          >
        </div>
        <div v-else class="table-wrapper">
          <table class="success-case-table">
            <thead>
              <tr>
                <th>제목</th>
                <th class="wide-column">등록일</th>
                <th>승인 상태</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="success in successCases"
                :key="success.successCaseId"
                @click="openSuccessDetail(success.successCaseId)"
                class="clickable-row"
              >
                <td>{{ success.title }}</td>
                <td>{{ formatDate(success.createdDate) }}</td>
                <td>
                  <span :class="getApprovalClass(success.isApproved)">
                    {{ getApprovalStatus(success.isApproved) }}
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
import { customApi } from 'src/boot/axios';
import { useAuthStore } from 'stores/authStore';
import { useRouter } from 'vue-router';
import { Notify, date } from 'quasar';

const authStore = useAuthStore();
const router = useRouter();
const successCases = ref([]);

const getSuccessCases = async () => {
  try {
    const response = await customApi.get('/mypage/success-case');
    successCases.value = response.data;
  } catch (error) {
    console.error('Error fetching success cases:', error);
    Notify.create({
      type: 'negative',
      message: '성공사례를 불러오는 데 실패했습니다.',
      position: 'top',
    });
  }
};

const getApprovalStatus = status => {
  switch (status) {
    case 0:
      return '승인 대기';
    case 1:
      return '승인됨';
    case 2:
      return '거절됨';
    default:
      return '알 수 없음';
  }
};

const getApprovalClass = status => {
  switch (status) {
    case 0:
      return 'status-pending';
    case 1:
      return 'status-approved';
    case 2:
      return 'status-rejected';
    default:
      return '';
  }
};

const formatDate = dateString => {
  const dateObj = new Date(dateString);
  return isNaN(dateObj) ? '' : date.formatDate(dateObj, 'YYYY-MM-DD');
};

const openSuccessDetail = successCaseId => {
  router.push({ name: 'MyPageSuccessDetail', params: { id: successCaseId } });
};

const goToSuccessWritePage = () => {
  router.push({ path: '/success-write' });
};

onMounted(getSuccessCases);
</script>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.mypage-card {
  width: 1000px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

.table-wrapper {
  overflow-x: auto;
}

.success-case-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1em;
  font-family: sans-serif;
  table-layout: fixed;
}

.success-case-table th,
.success-case-table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.success-case-table thead tr {
  background-color: #009879;
  color: #ffffff;
}

.success-case-table tbody tr {
  transition: background-color 0.3s ease;
}

.success-case-table tbody tr:hover {
  background-color: #f1f1f1;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wide-column {
  width: 50%;
}

.status-approved {
  color: #4caf50;
}

.status-pending {
  color: #000000;
}

.status-rejected {
  color: #ff5252;
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

@media (max-width: 600px) {
  .mypage-card {
    width: 100%;
    padding: 10px;
  }

  .success-case-table th,
  .success-case-table td {
    padding: 8px;
    font-size: 0.8em;
  }

  .wide-column {
    width: 40%;
  }

  .empty-state p {
    font-size: 1em;
  }

  .empty-state q-btn {
    font-size: 0.9em;
  }
}
</style>
