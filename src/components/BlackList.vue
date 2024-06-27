<template>
  <div class="blacklist-management">
    <table class="blacklist-table">
      <thead>
        <tr>
          <th>회원 ID</th>
          <th>회원 이름</th>
          <th>희망 근무지</th>
          <th>희망 직종</th>
          <th>사유</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in blacklistUsers" :key="user.userId">
          <td>{{ user.userId }}</td>
          <td>{{ user.userName }}</td>
          <td>{{ user.prefLocation }}</td>
          <td>{{ getJobLabel(user.prefJob) }}</td>
          <td>{{ user.reason }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const blacklistUsers = ref([]);

const jobMappings = [
  { label: '행정 및 사무', value: '0' },
  { label: '마케팅 및 기획', value: '1' },
  { label: '교육, 연구 및 개발', value: '2' },
  { label: '건설 및 시설 관리', value: '3' },
  { label: '보안, 안전 및 재난', value: '4' },
  { label: '의료, 복지 및 지원 서비스', value: '5' },
  { label: '창작 및 미용', value: '6' },
  { label: '요식, 조리 및 제과', value: '7' },
  { label: '운송, 영업 및 판매', value: '8' },
  { label: '제조 및 기술', value: '9' },
];

const getJobLabel = prefJobValue => {
  const job = jobMappings.find(job => job.value === prefJobValue);
  return job ? `${prefJobValue} - ${job.label}` : prefJobValue;
};

const fetchBlacklistUsers = async () => {
  const storedBlacklist = JSON.parse(localStorage.getItem('blacklist')) || [];
  blacklistUsers.value = storedBlacklist;
};

onMounted(fetchBlacklistUsers);
</script>

<style scoped>
.blacklist-management {
  padding: 20px;
}

.blacklist-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 1em;
  font-family: sans-serif;
  min-width: 600px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.blacklist-table th,
.blacklist-table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: left;
}

.blacklist-table thead tr {
  background-color: #009879;
  color: #ffffff;
  text-align: left;
}

.blacklist-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.blacklist-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}
</style>
