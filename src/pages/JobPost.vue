<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <div class="header">
          <div>
            <div class="text-h5">일자리 정보</div>
            <p>일자리 정보를 확인하세요.</p>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-list bordered>
          <q-item v-for="post in paginatedPosts" :key="post.postId" clickable @click="viewDetails(post)">
            <q-item-section class="middle">
              <q-item-label class="title">{{ post.joSj }}</q-item-label>
              <q-item-label caption>{{ post.cmpnyNm }}</q-item-label>
            </q-item-section>
            <q-item-section side class="details-section">
              <q-item-label caption>
                <q-icon name="place" class="q-mr-sm"/>
                {{ post.gu }}
              </q-item-label>
              <q-item-label caption>
                <q-icon name="work" class="q-mr-sm"/>
                {{ post.careerCndNm }}
              </q-item-label>
              <q-item-label caption>
                <q-icon name="school" class="q-mr-sm"/>
                {{ post.acdmcrNm }}
              </q-item-label>
            </q-item-section>
            <q-item-section class="bookmark-section">
              <q-icon name="bookmark" :size="bookmarkIconSize" :color="post.isBookmarked ? 'yellow' : 'grey'"
                      @click.stop="toggleBookmark(post)"/>
              <q-badge :color="getStatusColor(post.rceptClosNm)" outline
                       class="status-badge">
                <q-item-label>{{ getRecruitmentStatus(post.rceptClosNm) }}</q-item-label>
                <q-tooltip class="tooltip-with-arrow">마감일 : {{ getCloseDate(post.rceptClosNm) }}</q-tooltip>
              </q-badge>
            </q-item-section>
          </q-item>
        </q-list>
        <pagination-control :total-pages="totalPages" v-model="page" @update:model-value="updatePagination"/>
      </q-card-section>
    </q-card>
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
          throw new Error('Invalid API response')
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
      if (!dateMatch) return '확인필요'
      const closeDate = parseISO(dateMatch[0])
      return isAfter(closeDate, new Date()) ? '구인중' : '구인마감'
    }

    const getStatusColor = rceptClosNm => {
      return getRecruitmentStatus(rceptClosNm) === '구인마감' ? 'grey' : 'green';
    };

    const getCloseDate = (rceptClosNm) => {
      const dateMatch = rceptClosNm.match(/\d{4}-\d{2}-\d{2}/)
      if (!dateMatch) return '확인필요'
      return dateMatch[0]
    }

    watch(page, fetchPosts) // 페이지가 변경될 때마다 fetchPosts 호출

    onMounted(fetchPosts)

    const bookmarkIconSize = '28px';

    return {
      posts,
      page,
      totalPages,
      paginatedPosts,
      fetchPosts,
      viewDetails,
      toggleBookmark,
      getRecruitmentStatus,
      getStatusColor,
      getCloseDate,
      updatePagination: fetchPosts, // 페이지네이션 컨트롤에서 페이지 변경 시 fetchPosts 호출
      bookmarkIconSize,
    }
  }
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
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.q-item-section {
  display: flex;
  align-items: center;
  padding: 8px;
}

.middle {
  flex: 2.05;
  padding-left: 10px;
}

.details-section {
  flex: 0.85;
  padding-left: 10px;
  padding-right: 5px;
  align-items: flex-end;
  align-self: center;
}

.bookmark-section {
  flex: 0 0 50px;
  max-width: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  font-size: 0.65rem;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 24px;
  text-align: center;
  border-radius: 12px;
}

.tooltip-with-arrow .q-tooltip {
  position: relative;
  padding: 5px 10px;
}

.tooltip-with-arrow .q-tooltip::after {
  content: '';
  position: absolute;
  bottom: 100%; /* 위쪽에 화살표를 표시합니다 */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #ccc transparent transparent transparent; /* 화살표 색상 */
}

@media (max-width: 400px) {
  .q-item-section {
    padding: 4px;
    flex-direction: column;
    align-items: flex-start;
  }

  .middle, .details-section {
    padding-left: 5px; /* Adjust padding as needed for smaller screens */
  }

  .bookmark-section {
    align-self: flex-end;
    margin-top: 8px;
  }

  .status-badge {
    font-size: 0.55rem;
    text-align: center;
  }

  .q-item-label {
    font-size: 0.875rem;
    margin-bottom: 4px;
  }

  .q-item-label[caption] {
    font-size: 0.75rem;
  }

  .title {
    font-size: 0.7rem;
    margin-bottom: 4px;
  }

  .text-caption {
    font-size: 0.5rem;
    font-weight: 400;
    line-height: 1.25rem;
    letter-spacing: 0.03333em;
  }
}
</style>
