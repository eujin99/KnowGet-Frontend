<template>
  <q-page class="success-detail-page">
    <q-card class="success-detail-card">
      <q-card-section>
        <div class="text-h5">{{ success.title }}</div>
      </q-card-section>

      <q-card-section>
        <div>
          <p><strong>작성자:</strong> {{ success.username }}</p>
          <p><strong>내용:</strong> <span v-html="success.content"></span></p>
          <p><strong>작성 날짜:</strong> {{ formattedDate }}</p>
          <p>
            <strong>상태:</strong>
            <span :class="getStatusClass(success.isApproved)">
            {{
                success.isApproved === 1
                  ? '승인'
                  : success.isApproved === 2
                    ? '거절'
                    : '대기'
              }}
            </span>
          </p>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" @click="updateApprovalStatus(1)" label="승인"/>
        <q-btn color="negative" @click="updateApprovalStatus(2)" label="거절"/>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {customApi} from 'boot/axios';
import {format} from 'date-fns';
import {ko} from 'date-fns/locale';

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

const formattedDate = computed(() => {
  return success.value.createdDate
    ? format(new Date(success.value.createdDate), 'yyyy-MM-dd HH:mm:ss', {locale: ko})
    : '유효하지 않은 날짜';
});

const getStatusClass = (isApproved) => {
  if (isApproved === 1) return 'status-approved';
  if (isApproved === 2) return 'status-rejected';
  return 'status-pending';
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

.q-card-section p {
  margin: 0 0 10px 0;
}

.q-card-section strong {
  display: block;
  margin-bottom: 5px;
}

.status-approved {
  color: green;
  font-weight: bold;
}

.status-rejected {
  color: red;
  font-weight: bold;
}

.status-pending {
  color: orange;
  font-weight: bold;
}
</style>
