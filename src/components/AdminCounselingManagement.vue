<template>
  <div class="counseling-management">
    <table class="counseling-table">
      <thead>
      <tr>
        <th>상담 ID</th>
        <th>사용자</th>
        <th>카테고리</th>
        <th>내용</th>
        <th>날짜</th>
        <th>상태</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="counseling in counselings"
        :key="counseling.counselingId"
        @click="goToCounselingDetail(counseling.counselingId)"
      >
        <td>{{ counseling.counselingId }}</td>
        <td>{{ counseling.user }}</td>
        <td>{{ counseling.category }}</td>
        <td>{{ counseling.content }}</td>
        <td>{{ formatDate(counseling.sentDate) }}</td>
        <td :class="getStatusClass(counseling.isAnswered)">{{ counseling.isAnswered ? '답변 완료' : '답변 대기' }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {customApi} from 'boot/axios';
import {format} from "date-fns";
import {ko} from "date-fns/locale";

const counselings = ref([]);
const router = useRouter();

const fetchCounselings = async () => {
  try {
    const response = await customApi.get('/counseling');
    counselings.value = response.data;
  } catch (error) {
    console.error('Failed to fetch counseling data:', error);
  }
};

const goToCounselingDetail = counselingId => {
  router.push({name: 'AdminCounselingDetail', params: {id: counselingId}});
};

const formatDate = dateString => {
  return dateString
    ? format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss', {locale: ko})
    : '유효하지 않은 날짜';
};

const getStatusClass = isApproved => {
  if (isApproved === true) return 'status-answered';
  if (isApproved === false) return 'status-not-answered';
};

onMounted(fetchCounselings);
</script>

<style scoped>
.counseling-management {
  padding: 20px;
}

.counseling-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 1em;
  font-family: sans-serif;
  min-width: 600px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.counseling-table th,
.counseling-table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: left;
}

.counseling-table thead tr {
  background-color: #009879;
  color: #ffffff;
  text-align: left;
}

.counseling-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.counseling-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}

.counseling-table tbody tr:hover {
  background-color: #f1f1f1;
  cursor: pointer;
}

.status-answered {
  color: green;
  font-weight: bold;
}

.status-not-answered {
  color: orangered;
  font-weight: bold;
}
</style>
