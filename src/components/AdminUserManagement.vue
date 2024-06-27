<template>
  <div class="user-management">
    <table class="user-table">
      <thead>
        <tr>
          <th>회원 ID</th>
          <th>회원 이름</th>
          <th>희망 근무지</th>
          <th>희망 직종</th>
          <th>활성 / 비활성</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.userId">
          <td>{{ user.userId }}</td>
          <td>{{ user.userName }}</td>
          <td>{{ user.prefLocation }}</td>
          <td>{{ getJobLabel(user.prefJob) }}</td>
          <td class="toggle-cell">
            <label class="toggle-switch">
              <input
                type="checkbox"
                v-model="user.isActive"
                @change="() => handleToggleChange(user)"
              />
              <span class="slider"></span>
            </label>
          </td>
        </tr>
      </tbody>
    </table>
    <button class="save-button" @click="saveChanges">저장</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { customApi } from 'boot/axios';
import { useAuthStore } from 'stores/authStore';

const users = ref([]);
const changedUsers = ref([]); // 변경된 사용자 추적

const columns = [
  { name: 'userId', label: '회원 ID', align: 'left' },
  { name: 'userName', label: '회원 이름', align: 'left' },
  { name: 'prefLocation', label: '희망 근무지', align: 'left' },
  { name: 'prefJob', label: '희망 직종', align: 'left' },
  { name: 'isActive', label: '활성 / 비활성', align: 'center' },
];

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

const authStore = useAuthStore();

const fetchUsers = async () => {
  try {
    if (!authStore.isLoggedIn) {
      console.error('User is not logged in.');
      return;
    }

    const response = await customApi.get('/admin/users');
    users.value = response.data.map(user => ({
      userId: user.userId,
      userName: user.userName,
      prefLocation: user.prefLocation,
      prefJob: user.prefJob,
      isActive: user.isActive,
    }));
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

const handleToggleChange = user => {
  // 사용자의 변경 사항을 추적
  const existingUser = changedUsers.value.find(u => u.userId === user.userId);
  if (existingUser) {
    existingUser.isActive = user.isActive;
  } else {
    changedUsers.value.push({ ...user });
  }
};

const saveChanges = async () => {
  try {
    // 변경된 모든 사용자의 상태 저장
    const updatePromises = changedUsers.value.map(user =>
      customApi.patch(`/admin/user/${user.userId}`, {
        isActive: user.isActive,
      }),
    );
    await Promise.all(updatePromises);
    alert('변경 사항이 성공적으로 저장되었습니다.');
    changedUsers.value = []; // 저장 후 변경된 사용자 목록 초기화
  } catch (error) {
    console.error('Failed to save changes:', error);
    alert('변경 사항 저장 중 오류가 발생했습니다.');
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 1em;
  font-family: sans-serif;
  min-width: 600px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.user-table th,
.user-table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: left;
}

.user-table thead tr {
  background-color: #009879;
  color: #ffffff;
  text-align: left;
}

.user-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.user-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}

.toggle-cell {
  text-align: center;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #66bb6a;
}

input:checked + .slider:before {
  transform: translateX(14px);
}

.save-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #009879;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #007f6a;
}
</style>
