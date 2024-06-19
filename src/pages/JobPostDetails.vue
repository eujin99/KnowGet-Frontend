<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section v-if="post">
        <q-btn flat round dense icon="arrow_back" @click="$router.back()" align="flex-start"/>
        <p/>
        <div class="text-h5">{{ post.joSj }}</div>
        <p/>
        <p>등록일: {{ post.joRegDt }}</p>
      </q-card-section>

      <q-card-section v-if="post">
        <div class="detail-info">
          <q-table :rows="details" :columns="columns" row-key="key" flat bordered/>
        </div>
      </q-card-section>

      <q-card-section v-if="post">
        <div class="additional-info">
          <h6>기타사항</h6>
          <!--          <p>{{ post.etc }}</p>-->
        </div>
      </q-card-section>

      <q-card-section v-else>
        <q-spinner color="primary" size="30px"/>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import {api} from 'boot/axios'

const route = useRoute()
const post = ref(null)

const fetchPostDetails = async () => {
  try {
    const response = await api.get(`/posts/${route.params.postId}`)
    post.value = response.data
  } catch (error) {
    console.error('Error fetching job details: ', error)
  }
}

const getCloseDate = (rceptClosNm) => {
  const dateMatch = rceptClosNm.match(/\d{4}-\d{2}-\d{2}/)
  if (!dateMatch) return '확인필요'
  return dateMatch[0]
}

onMounted(fetchPostDetails)

const details = computed(() => post.value ? [
  {key: '기업 명칭', value: post.value.cmpnyNm},
  {key: '기업 주소', value: post.value.bassAdresCn},
  {key: '모집 직종', value: post.value.jobcodeNm},
  {key: '사업 요약 내용', value: post.value.bsnsSumryCn},
  {key: '모집 인원 수', value: post.value.rcritNmprCo},
  {key: '급여', value: post.value.hopeWage},
  {key: '근무시간', value: post.value.workTimeNm},
  {key: '복리후생', value: post.value.joFeinsrSbscrbNm},
  {key: '근무장소', value: post.value.workPararBassAdresCn},
  {key: '마감일', value: getCloseDate(post.value.rceptClosNm)},
] : [])

const columns = [
  {name: 'key', required: true, label: '항목', align: 'left', field: row => row.key},
  {name: 'value', required: true, label: '내용', align: 'left', field: row => row.value}
]

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

.detail-info {
  margin-bottom: 20px;
}

.additional-info h6 {
  margin-top: 0;
}
</style>
