<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <div class="text-h5">내 성공사례 목록</div>
        <q-list>
          <q-item
            v-for="success in successCases"
            :key="success.successCaseId"
            clickable
            @click="openSuccessDetail(success.successCaseId)"
          >
            <q-item-section>
              <q-item-label>{{ success.title }}</q-item-label>
              <q-item-label caption>{{ success.createdDate }}</q-item-label>
              <q-item-label caption>{{
                getApprovalStatus(success.isApproved)
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { customApi } from 'src/boot/axios';
import { useAuthStore } from 'stores/authStore';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';

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

const openSuccessDetail = successCaseId => {
  router.push({ name: 'MyPageSuccessDetail', params: { id: successCaseId } });
};

onMounted(getSuccessCases);
</script>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.page-card {
  width: 1000px;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}
</style>
