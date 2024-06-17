<template>
  <q-page>
    <q-toolbar>
      <q-toolbar-title>Job Listings</q-toolbar-title>
    </q-toolbar>
    <q-list bordered>
      <q-item v-for="post in posts" :key="post.postId" clickable @click="viewDetails(post)">
        <q-item-section side>
          <q-item-label label>{{ getRecruitmentStatus(post.rceptClosNm) }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ post.joSj }}</q-item-label>
          <q-item-label caption>{{ post.cmpnyNm }}</q-item-label>
          <q-item-label caption>{{ post.bsnsSumryCn }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label>{{ post.gu }}</q-item-label>
          <q-item-label caption>경력 : {{ post.careerCndNm }}</q-item-label>
          <q-item-label caption>학력 : {{ post.acdmcrNm }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn dense round icon="bookmark" :color="post.isBookmarked ? 'yellow' : 'grey'"
                 @click.stop="toggleBookmark(post)"/>
        </q-item-section>
      </q-item>
    </q-list>
    <q-pagination v-model="page" :max="totalPages" @update:model-value="fetchPosts"/>
  </q-page>
</template>

<script>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {useQuasar} from 'quasar'
import {api} from 'boot/axios'
import {useAuthStore} from 'stores/authStore'
import {isAfter, parseISO} from 'date-fns'

export default {
  setup() {
    const $q = useQuasar()
    const posts = ref([])
    const page = ref(1)
    const totalPages = ref(1)
    const authStore = useAuthStore()
    const router = useRouter()

    const fetchPosts = async () => {
      try {
        const response = await api.get(`/posts`)
        console.log('API response:', response.data) // 응답 콘솔에 출력
        if (Array.isArray(response.data)) {
          posts.value = response.data.map(post => ({
            ...post,
            isBookmarked: false // 실제 사용자 데이터에서 북마크 여부 가져와야 함
          }))
          // 페이지네이션 처리를 위한 totalPages 설정
          totalPages.value = Math.ceil(response.data.length / 10) // 50개씩 페이징
        } else {
          throw new Error('Invalid APi response')
        }
      } catch (error) {
        console.error('Error fetching jobs:', error)
        $q.notify({
          type: 'negative',
          message: 'Failed to fetch job listings'
        })
      }
    }

    const viewDetails = (post) => {
      router.push({name: 'JobPostDetails', params: {post}})
    }

    const toggleBookmark = async (post) => {
      if (!authStore.isLoggedIn) {
        $q.notify('로그인이 필요합니다.')
        return
      }
      await api.post(`/bookmark/${post.joRegistNo}`)
    }

    const getRecruitmentStatus = (rceptClosNm) => {
      const dateMatch = rceptClosNm.match(/\d{4}-\d{2}-\d{2}/)
      if (!dateMatch) return '상태 불명'
      const closeDate = parseISO(dateMatch[0])
      return isAfter(closeDate, new Date()) ? '구인중' : '구인 마감'
    }

    onMounted(fetchPosts)

    return {
      posts,
      page,
      totalPages,
      fetchPosts,
      viewDetails,
      toggleBookmark,
      getRecruitmentStatus
    }
  }
}
</script>

<style scoped>
.q-item-section {
  flex: 1;
}

.q-item-section.side {
  flex: 0 0 150px;
  max-width: 150px;
}

.q-item-section.middle {
  flex: 2;
}
</style>
