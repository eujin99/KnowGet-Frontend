<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <div class="header">
          <div>
            <div class="text-h5">성공 사례</div>
            <p>성공 사례를 확인하세요.</p>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div v-for="sc in paginatedSuccessCases" :key="sc.id" class="q-my-md">
          <q-card @click="showDetails(sc)">
            <q-card-section>
              <div class="text-h6">{{ sc.title }}</div>
              <div>작성자: {{ sc.username }}</div>
              <div>게시 일자: {{ new Date(sc.createdDate).toLocaleDateString() }}</div>
            </q-card-section>
          </q-card>
        </div>
        <pagination-control :total-pages="totalPages" v-model="page" @update:model-value="updatePagination"/>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ selectedCase.title }}</div>
          <div>작성자: {{ selectedCase.username }}</div>
          <div>게시 일자: {{ new Date(selectedCase.createdDate).toLocaleDateString() }}</div>
          <div>내용: {{ selectedCase.content }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { api } from 'boot/axios';
import PaginationControl from 'components/PaginationControl.vue';

const successCases = ref([]);
const page = ref(1);
const itemsPerPage = 10;
const totalPages = computed(() => Math.ceil(successCases.value.length / itemsPerPage));
const showDialog = ref(false);
const selectedCase = ref(null);

const fetchSuccessCases = async () => {
   try {
      const response = await api.get('/success-case');
      successCases.value = response.data.filter(successCase => successCase.isApproved === 1);
    } catch (error) {
      console.error('Failed to fetch success cases:', error);
    }
};

onMounted(fetchSuccessCases);

const updatePagination = (newPage) => {
  page.value = newPage;
  fetchSuccessCases();
};

const paginatedSuccessCases = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return successCases.value.slice(start, end);
});

const showDetails = (sc) => {
  selectedCase.value = sc;
  showDialog.value = true;
};
</script>

<style scoped>
.page-wrapper {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
}

.page-card {
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
