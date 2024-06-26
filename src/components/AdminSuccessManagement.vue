<template>
  <div class="success-management">
    <table class="success-table">
      <thead>
        <tr>
          <th>글 ID</th>
          <th>작성자</th>
          <th>제목</th>
          <th>내용</th>
          <th>날짜</th>
          <th>상태</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="success in successList"
          :key="success.caseId"
          @click="goToSuccessDetail(success.caseId)"
        >
          <td>{{ success.caseId }}</td>
          <td>{{ success.username }}</td>
          <td>{{ success.title }}</td>
          <td>{{ success.content }}</td>
          <td>{{ success.createdDate }}</td>
          <td>{{ success.isApproved === 1 ? '승인' : '대기' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { customApi } from 'boot/axios';

const successList = ref([]);
const router = useRouter();

const fetchSuccessList = async () => {
  try {
    const response = await customApi.get('/success-case');
    successList.value = response.data;
  } catch (error) {
    console.error('Failed to fetch success case data:', error);
  }
};

const goToSuccessDetail = caseId => {
  router.push({ name: 'AdminSuccessDetail', params: { id: caseId } });
};

onMounted(fetchSuccessList);
</script>

<style scoped>
.success-management {
  padding: 20px;
}

.success-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 1em;
  font-family: sans-serif;
  min-width: 600px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.success-table th,
.success-table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: left;
}

.success-table thead tr {
  background-color: #009879;
  color: #ffffff;
  text-align: left;
}

.success-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.success-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}

.success-table tbody tr:hover {
  background-color: #f1f1f1;
  cursor: pointer;
}
</style>
