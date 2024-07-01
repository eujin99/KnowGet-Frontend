<template>
  <q-page class="success-detail-page">
    <q-card class="success-detail-card">
      <q-card-section>
        <div class="text-h5">{{ success.title }}</div>
      </q-card-section>

      <q-card-section>
        <div class="table-container">
          <table class="success-detail-table">
            <tbody>
              <tr>
                <th>작성자</th>
                <td>{{ success.username }}</td>
              </tr>
              <tr>
                <th>내용</th>
                <td>{{ success.content }}</td>
              </tr>
              <tr>
                <th>작성 날짜</th>
                <td>{{ formatDate(success.createdDate) }}</td>
              </tr>
              <tr>
                <th>상태</th>
                <td :class="getApprovalClass(success.isApproved)">
                  {{
                    success.isApproved === 1
                      ? '승인'
                      : success.isApproved === 2
                      ? '거절'
                      : '대기'
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" @click="updateApprovalStatus(1)" label="승인" />
        <q-btn color="negative" @click="updateApprovalStatus(2)" label="거절" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { customApi } from 'boot/axios';
import { date } from 'quasar';

const route = useRoute();
const router = useRouter();
const success = ref({});

const fetchSuccessDetail = async () => {
  try {
    const response = await customApi.get(`/success-case/${route.params.id}`);
    success.value = response.data;
  } catch (error) {
    console.error('Failed to fetch success case detail:', error);
  }
};

const updateApprovalStatus = async status => {
  try {
    await customApi.patch(
      `/success-case/approval/${route.params.id}/${status}`,
    );
    success.value.isApproved = status;
  } catch (error) {
    console.error('Failed to update approval status:', error);
  }
};

const formatDate = dateString => {
  const dateObj = new Date(dateString);
  return isNaN(dateObj) ? '' : date.formatDate(dateObj, 'YYYY-MM-DD');
};

const getApprovalClass = status => {
  switch (status) {
    case 1:
      return 'status-approved';
    case 2:
      return 'status-rejected';
    default:
      return 'status-pending';
  }
};

onMounted(fetchSuccessDetail);
</script>

<style scoped>
.success-detail-page {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.success-detail-card {
  max-width: 800px;
  width: 100%;
}

.table-container {
  overflow-x: auto;
}

.success-detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1em;
  font-family: sans-serif;
}

.success-detail-table th,
.success-detail-table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: left;
}

.success-detail-table th {
  background-color: #f5f5f5;
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

.q-card-section p {
  margin: 0 0 10px 0;
}

.q-card-section strong {
  display: block;
  margin-bottom: 5px;
}
</style>
