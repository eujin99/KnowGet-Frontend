<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section v-if="post">
        <q-btn flat round dense icon="arrow_back" @click="goBack" class="back-btn"/>
        <p/>
        <div class="text-h5">{{ post.joSj }}</div>
        <p/>
        <p>등록일: {{ post.joRegDt }}</p>
      </q-card-section>

      <q-card-section v-if="post">
        <table class="details-table">
          <tbody>
          <tr>
            <th colspan="2">구인상태</th>
          </tr>
          <tr>
            <td class="center-align">구인 상태</td>
            <td>{{ getRecruitmentStatus(post.rceptClosNm) }}</td>
          </tr>
          <tr>
            <th colspan="2">구인 업체 현황</th>
          </tr>
          <tr>
            <td class="center-align">업체명</td>
            <td>{{ post.cmpnyNm }}</td>
          </tr>
          <tr>
            <td class="center-align">위치</td>
            <td>{{ post.bassAdresCn }}</td>
          </tr>
          <tr>
            <td class="center-align">업종</td>
            <td>{{ post.bsnsSumryCn }}</td>
          </tr>
          <tr>
            <th colspan="2">구인 내용</th>
          </tr>
          <tr v-for="(value, key) in jobDetails" :key="key">
            <td class="center-align">{{ key }}</td>
            <td>{{ value }}</td>
          </tr>
          <tr>
            <th colspan="2">기타사항</th>
          </tr>
          <tr>
            <td colspan="2">{{ post.etc }}</td>
          </tr>
          </tbody>
        </table>
      </q-card-section>

      <q-card-section v-else>
        <q-spinner color="primary" size="30px"/>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {api} from 'boot/axios'
import {isAfter, parseISO} from "date-fns";

const route = useRoute()
const router = useRouter()
const post = ref(null)

const fetchPostDetails = async () => {
  try {
    const response = await api.get(`/posts/${route.params.postId}`)
    post.value = response.data
  } catch (error) {
    console.error('Error fetching job details: ', error)
  }
}

const getRecruitmentStatus = (rceptClosNm) => {
  const dateMatch = rceptClosNm.match(/\d{4}-\d{2}-\d{2}/)
  if (!dateMatch) return '확인필요'
  const closeDate = parseISO(dateMatch[0])
  return isAfter(closeDate, new Date()) ? '구인중' : '구인마감'
}

const getCloseDate = (rceptClosNm) => {
  const dateMatch = rceptClosNm.match(/\d{4}-\d{2}-\d{2}/)
  if (!dateMatch) return '확인필요'
  return dateMatch[0]
}

const jobDetails = computed(() => post.value ? {
  '모집 직종': post.value.jobcodeNm,
  '모집 인원 수': post.value.rcritNmprCo,
  '급여': post.value.hopeWage,
  '근무시간': post.value.workTimeNm,
  '복리후생': post.value.joFeinsrSbscrbNm,
  '근무장소': post.value.workPararBassAdresCn,
  '마감일': getCloseDate(post.value.rceptClosNm)
} : {})

onMounted(fetchPostDetails)

const goBack = () => {
  const previousPage = route.query.page || 1
  router.push({name: 'JobPost', query: {page: previousPage}})
}

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
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back-btn {
  display: flex;
  align-items: flex-start;
}

.details-table {
  width: 100%;
  border-collapse: collapse;
}

.details-table th,
.details-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.details-table th {
  background-color: #f2f2f2;
  text-align: left;
}

.details-table th[colspan="2"] {
  text-align: center;
  background-color: #f9f9f9;
}

.center-align {
  text-align: center;
}
</style>
