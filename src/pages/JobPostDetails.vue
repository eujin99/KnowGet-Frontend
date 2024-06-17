<template>
  <q-page>
    <q-toolbar>
      <q-btn flat round dense icon="arrow_back" @click="$router.back()"/>
      <q-toolbar-title>{{ post.joSj }}</q-toolbar-title>
    </q-toolbar>
    <q-card>
      <q-card-section>
        <div>회사 이름: {{ post.cmpnyNm }}</div>
        <div>사업 요약 내용: {{ post.bsnsSumryCn }}</div>
        <div>근무지 구: {{ post.gu }}</div>
        <div>경력 조건: {{ post.careerCndNm }}</div>
        <div>학력: {{ post.acdmcrNm }}</div>
        <div>등록일: {{ post.joRegDt }}</div>
        <div>구인 상태: {{ post.rceptClosNm.includes('마감') ? '구인 마감' : '구인 중' }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {computed} from 'vue'
import {useRoute} from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    const post = computed(() => route.params.post)

    return {
      post
    }
  }
}
</script>
