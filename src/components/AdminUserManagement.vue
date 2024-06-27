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

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <p>비활성화 사유 입력</p>
        <textarea
          v-model="deactivationReason"
          placeholder="사유를 입력하세요"
        ></textarea>
        <div class="modal-buttons">
          <button @click="saveReason" class="modal-button">저장</button>
          <button @click="closeModal" class="modal-button">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { customApi } from 'boot/axios';
import { useAuthStore } from 'stores/authStore';

const users = ref([]);
const changedUsers = ref([]);
const showModal = ref(false);
const deactivationReason = ref('');
let userToDeactivate = null;

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
  if (!user.isActive) {
    //사유 적으세욧 !!!!!
    userToDeactivate = user;
    showModal.value = true;
  } else {
    const existingUser = changedUsers.value.find(u => u.userId === user.userId);
    if (existingUser) {
      existingUser.isActive = user.isActive;
    } else {
      changedUsers.value.push({ ...user });
    }

    //true 되면 로컬스토리지에서 내려가용
    const blacklist = JSON.parse(localStorage.getItem('blacklist')) || [];
    const updatedBlacklist = blacklist.filter(u => u.userId !== user.userId);
    localStorage.setItem('blacklist', JSON.stringify(updatedBlacklist));
  }
};

const closeModal = () => {
  showModal.value = false;
  deactivationReason.value = '';
  userToDeactivate = null;
};

const saveReason = async () => {
  try {
    if (userToDeactivate) {
      userToDeactivate.isActive = false;
      const existingUser = changedUsers.value.find(
        u => u.userId === userToDeactivate.userId,
      );
      if (existingUser) {
        existingUser.isActive = userToDeactivate.isActive;
      } else {
        changedUsers.value.push({ ...userToDeactivate });
      }

      const blacklist = JSON.parse(localStorage.getItem('blacklist')) || [];
      if (!blacklist.find(u => u.userId === userToDeactivate.userId)) {
        blacklist.push({
          userId: userToDeactivate.userId,
          userName: userToDeactivate.userName,
          prefLocation: userToDeactivate.prefLocation,
          prefJob: userToDeactivate.prefJob,
          reason: deactivationReason.value,
        });
        localStorage.setItem('blacklist', JSON.stringify(blacklist));
      }

      closeModal();
    }
  } catch (error) {
    console.error('Failed to save reason:', error);
    alert('사유 저장 중 오류가 발생했습니다.');
  }
};

const saveChanges = async () => {
  try {
    const updatePromises = changedUsers.value.map(async user => {
      await customApi.patch(`/admin/user/${user.userId}`, {
        isActive: user.isActive,
      });
    });
    await Promise.all(updatePromises);
    alert('변경 사항이 성공적으로 저장되었습니다.');
    changedUsers.value = [];
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 400px;
  text-align: center;
}

.modal-content h3 {
  margin-top: 0;
}

.modal-content textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}

.modal-button {
  background-color: #009879;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.modal-button:hover {
  background-color: #007f6a;
}
</style>
