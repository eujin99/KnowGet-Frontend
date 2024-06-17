<!-- src/pages/EducationPage.vue -->
<template>
  <q-page>
    <q-card class="page-card">
      <q-card-section>
        <div class="text-h5">교육 찾기</div>
        <p>교육 정보를 확인하세요.</p>
      </q-card-section>
      <q-card-section>
        <q-list>
          <q-item
            v-for="course in courses"
            :key="course.courseNm"
            class="q-mb-sm"
          >
            <q-item-section>
              <q-item-label
                ><strong>{{ course.courseNm }}</strong></q-item-label
              >
              <q-item-label caption
                >교육 기관: {{ course.deptNm }}</q-item-label
              >
              <q-item-label caption
                >신청 기간: {{ course.courseRequestStrDt }} ~
                {{ course.courseRequestEndDt }}</q-item-label
              >
              <q-item-label caption
                >교육 기간: {{ course.courseStrDt }} ~
                {{ course.courseEndDt }}</q-item-label
              >
              <q-item-label caption>정원: {{ course.capacity }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';

const courses = ref([]);

// API에서 교육 데이터를 가져오는 함수
const fetchCourses = async () => {
  try {
    const response = await api.get('/education');
    courses.value = response.data;
  } catch (error) {
    console.error('Failed to fetch education data:', error);
  }
};

onMounted(() => {
  fetchCourses();
});
</script>

<style scoped>
.page-card {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
