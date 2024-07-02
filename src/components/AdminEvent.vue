<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <div class="text-h5">홍보 기록</div>
        <table class="record-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>홍보 경로</th>
              <th>홍보한 날짜</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in records" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ record.path }}</td>
              <td>{{ record.date }}</td>
            </tr>
          </tbody>
        </table>
      </q-card-section>
      <q-card-section v-if="isAdmin">
        <div class="text-h5">홍보 기록 추가</div>
        <q-select
          v-model="newRecord.path"
          :options="promotionPaths"
          label="홍보 경로"
          outlined
        />
        <q-input
          v-model="newRecord.date"
          label="홍보한 날짜"
          outlined
          type="date"
        />
        <q-btn color="primary" @click="addRecord">추가</q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from 'stores/authStore';

const promotionPaths = ['SNS', '블로그', '오프라인', '유료광고'];
const records = ref([]);

const newRecord = ref({
  path: '',
  date: '',
});

const authStore = useAuthStore();
const isAdmin = ref(false);
const userId = ref('');

const loadRecords = () => {
  const storedRecords = localStorage.getItem(
    `promotionRecords_${userId.value}`,
  );
  if (storedRecords) {
    records.value = JSON.parse(storedRecords);
  }
};

const saveRecords = () => {
  localStorage.setItem(
    `promotionRecords_${userId.value}`,
    JSON.stringify(records.value),
  );
};

const addRecord = () => {
  if (newRecord.value.path && newRecord.value.date) {
    records.value.push({ ...newRecord.value });
    newRecord.value.path = '';
    newRecord.value.date = '';
    saveRecords();
  }
};

onMounted(() => {
  authStore.initializeAuth();
  if (authStore.isLoggedIn && authStore.role === 'ADMIN') {
    isAdmin.value = true;
    userId.value = authStore.username;
    loadRecords();
  }
});
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

.record-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.record-table th,
.record-table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: left;
}

.record-table th {
  background-color: #f5f5f5;
}

.q-input,
.q-select {
  margin-top: 10px;
}

.q-btn {
  margin-top: 20px;
}
</style>
