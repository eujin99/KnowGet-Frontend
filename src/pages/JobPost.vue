<template>
  <q-page>
    <q-toolbar>
      <q-toolbar-title>Job Listings</q-toolbar-title>
    </q-toolbar>
    <q-list bordered>
      <q-item v-for="post in paginatedPosts" :key="post.postId" clickable @click="viewDetails(post)">
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
    <pagination-control :total-pages="totalPages" v-model="page" @update:model-value="updatePagination"/>
  </q-page>
</template>

<script>
import {computed, onMounted, ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import {useQuasar} from 'quasar'
import {api} from 'boot/axios'
import {useAuthStore} from 'stores/authStore'
import {isAfter, parseISO} from 'date-fns'
import PaginationControl from 'components/PaginationControl.vue'

export default {
  components: {
    PaginationControl
  },
  setup() {
    const $q = useQuasar()
    const posts = ref([])
    const page = ref(1)
    const itemsPerPage = 10
    const totalPages = computed(() => Math.ceil(posts.value.length / itemsPerPage))
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

    const paginatedPosts = computed(() => {
      const start = (page.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return posts.value.slice(start, end)
    })

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

    watch(page, fetchPosts()) // 페이지가 변경될 때마다 fetchPosts 호출

    onMounted(fetchPosts)

    return {
      posts,
      page,
      totalPages,
      paginatedPosts,
      fetchPosts,
      viewDetails,
      toggleBookmark,
      getRecruitmentStatus,
      updatePagination: fetchPosts // 페이지네이션 컨트롤에서 페이지 변경 시 fetchPosts 호출
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
