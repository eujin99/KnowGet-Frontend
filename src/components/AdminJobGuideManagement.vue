<template>
  <div class="job-guide-management">
    <button @click="goToCreatePage" class="create-button">
      취업 가이드 작성하기
    </button>
    <table class="job-guide-table">
      <thead>
        <tr>
          <th>가이드 ID</th>
          <th>제목</th>
          <th>작성일</th>
          <th>삭제</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="jobGuide in jobGuides" :key="jobGuide.guideId">
          <td @click="goToDetailPage(jobGuide.guideId)">
            {{ jobGuide.guideId }}
          </td>
          <td @click="goToDetailPage(jobGuide.guideId)">
            {{ jobGuide.title }}
          </td>
          <td @click="goToDetailPage(jobGuide.guideId)">
            {{ jobGuide.createdDate }}
          </td>
          <td>
            <button
              class="delete-button"
              @click="deleteJobGuide(jobGuide.guideId)"
            >
              삭제
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { customApi } from 'boot/axios';
import { QIcon, Notify } from 'quasar';

const jobGuides = ref([]);
const router = useRouter();

const fetchJobGuides = async () => {
  try {
    const response = await customApi.get('/job-guide');
    jobGuides.value = response.data;
  } catch (error) {
    console.error('Failed to fetch job guides:', error);
  }
};

const deleteJobGuide = async id => {
  try {
    await customApi.delete(`/job-guide/${id}`);
    jobGuides.value = jobGuides.value.filter(
      jobGuide => jobGuide.guideId !== id,
    );
    Notify.create({
      type: 'positive',
      message: '가이드가 삭제되었습니다.',
    });
  } catch (error) {
    console.error('Failed to delete job guide:', error);
    Notify.create({
      type: 'negative',
      message: '가이드를 삭제하는데 실패했습니다.',
    });
  }
};

const goToCreatePage = () => {
  router.push({ name: 'AdminJobGuideCreate' });
};

const goToDetailPage = id => {
  router.push({ name: 'AdminJobGuideDetail', params: { id } });
};

onMounted(fetchJobGuides);
</script>

<style scoped>
.job-guide-management {
  padding: 20px;
}

.create-button {
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #009879;
  color: #ffffff;
  border: none;
  cursor: pointer;
}

.create-button:hover {
  background-color: #007a62;
}

.job-guide-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 1em;
  font-family: sans-serif;
  min-width: 600px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.job-guide-table th,
.job-guide-table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: left;
}

.job-guide-table thead tr {
  background-color: #009879;
  color: #ffffff;
  text-align: left;
}

.job-guide-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.job-guide-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}

.job-guide-table tbody tr:hover {
  background-color: #f1f1f1;
  cursor: pointer;
}

.delete-button {
  background: none;
  border: none;
  color: #ff4c4c;
  cursor: pointer;
}

.delete-button:hover {
  color: #e60000;
}
</style>
