<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <div class="header">
          <div>
            <div class="text-h5">북마크한 공고</div>
            <p>북마크한 공고를 확인하세요.</p>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="job-listings">
          <template v-if="bookmarkedPosts.length > 0">
            <q-card
              v-for="post in bookmarkedPosts"
              :key="post.postId"
              class="job-card"
              clickable
              @click="viewDetails(post)"
            >
              <q-card-section class="job-card-section">
                <q-img :src="post.imageUrl" class="job-image" />
                <div class="job-info">
                  <q-item-label class="job-title">{{ post.joSj }}</q-item-label>
                  <q-item-label caption>{{ post.cmpnyNm }}</q-item-label>
                  <div class="job-details">
                    <q-item-label caption>
                      <q-icon name="place" />
                      {{ post.gu }}
                    </q-item-label>
                    <q-item-label caption>
                      <q-icon name="work" />
                      {{ post.careerCndNm }}
                    </q-item-label>
                    <q-item-label caption>
                      <q-icon name="school" />
                      {{ post.acdmcrNm }}
                    </q-item-label>
                  </div>
                </div>
                <div class="job-actions">
                  <q-icon
                    :name="post.isBookmarked ? 'bookmark' : 'bookmark_border'"
                    :color="post.isBookmarked ? 'red-5' : 'grey'"
                    @click.stop="toggleBookmark(post)"
                    class="bookmark-icon"
                  />
                  <q-badge
                    :color="getStatusColor(post.rceptClosNm)"
                    outline
                    class="status-badge"
                  >
                    <q-item-label
                      >{{ getRecruitmentStatus(post.rceptClosNm) }}
                    </q-item-label>
                  </q-badge>
                </div>
              </q-card-section>
            </q-card>
          </template>
          <div v-else class="no-results">북마크한 공고가 없습니다.</div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { customApi } from 'boot/axios';
import { useAuthStore } from 'stores/authStore';
import { isAfter, parseISO } from 'date-fns';

export default {
  setup() {
    const router = useRouter();
    const bookmarkedPosts = ref([]);
    const authStore = useAuthStore();

    const fetchBookmarkedPosts = async () => {
      try {
        const response = await customApi.get('/mypage/bookmark');
        if (Array.isArray(response.data)) {
          bookmarkedPosts.value = response.data.map(post => ({
            ...post,
            imageUrl: getRandomJobImage(post.jobCode),
            isBookmarked: true,
          }));
        } else {
          throw new Error('Invalid API response');
        }
      } catch (error) {
        console.error('Error fetching bookmarked posts:', error);
        Notify.create({
          type: 'negative',
          message: '북마크한 공고를 불러오는 도중 오류가 발생했습니다.',
          position: 'bottom',
          timeout: 2000,
        });
      }
    };

    const getRecruitmentStatus = rceptClosNm => {
      const dateMatch = rceptClosNm.match(/\d{4}-\d{2}-\d{2}/);
      if (!dateMatch) return '확인 필요';
      const closeDate = parseISO(dateMatch[0]);
      return isAfter(closeDate, new Date()) ? '구인 중' : '구인 마감';
    };

    const getStatusColor = rceptClosNm => {
      return getRecruitmentStatus(rceptClosNm) === '구인 마감'
        ? 'grey'
        : 'green';
    };

    const viewDetails = post => {
      router.push({
        name: 'JobPostDetails',
        params: { postId: post.postId },
      });
    };

    const toggleBookmark = async post => {
      if (!authStore.isLoggedIn) {
        Notify.create({
          type: 'negative',
          message: '로그인이 필요합니다',
          timeout: 2000,
          position: 'top',
        });
        return;
      }

      try {
        await customApi.post(`/bookmark/${post.postId}`);
        post.isBookmarked = !post.isBookmarked;
        Notify.create({
          type: 'positive',
          message: post.isBookmarked
            ? '북마크에 추가되었습니다.'
            : '북마크에서 제거되었습니다.',
          position: 'bottom',
          timeout: 2000,
        });

        // 북마크 해제 시 목록에서 제거
        if (!post.isBookmarked) {
          bookmarkedPosts.value = bookmarkedPosts.value.filter(
            bookmarkedPost => bookmarkedPost.postId !== post.postId,
          );
        }
      } catch (error) {
        console.error('Error toggling bookmark:', error);
        Notify.create({
          type: 'negative',
          message: '북마크를 토글하는 중 오류가 발생했습니다.',
          position: 'bottom',
          timeout: 2000,
        });
      }
    };

    onMounted(fetchBookmarkedPosts);

    const getRandomJobImage = jobCode => {
      const jobImages = {
        0: [
          'job0-1.jpg',
          'job0-2.jpg',
          'job0-3.jpg',
          'job0-4.jpg',
          'job0-5.jpg',
        ],
        1: [
          'job1-1.jpg',
          'job1-2.jpg',
          'job1-3.jpg',
          'job1-4.jpg',
          'job1-5.jpg',
        ],
        2: [
          'job2-1.jpg',
          'job2-2.jpg',
          'job2-3.jpg',
          'job2-4.jpg',
          'job2-5.jpg',
        ],
        3: [
          'job3-1.jpg',
          'job3-2.jpg',
          'job3-3.jpg',
          'job3-4.jpg',
          'job3-5.jpg',
        ],
        4: [
          'job4-1.jpg',
          'job4-2.jpg',
          'job4-3.jpg',
          'job4-4.jpg',
          'job4-5.jpg',
        ],
        5: [
          'job5-1.jpg',
          'job5-2.jpg',
          'job5-3.jpg',
          'job5-4.jpg',
          'job5-5.jpg',
        ],
        6: [
          'job6-1.jpg',
          'job6-2.jpg',
          'job6-3.jpg',
          'job6-4.jpg',
          'job6-5.jpg',
        ],
        7: [
          'job7-1.jpg',
          'job7-2.jpg',
          'job7-3.jpg',
          'job7-4.jpg',
          'job7-5.jpg',
        ],
        8: [
          'job8-1.jpg',
          'job8-2.jpg',
          'job8-3.jpg',
          'job8-4.jpg',
          'job8-5.jpg',
        ],
        9: [
          'job9-1.jpg',
          'job9-2.jpg',
          'job9-3.jpg',
          'job9-4.jpg',
          'job9-5.jpg',
        ],
      };

      const images = jobImages[jobCode] || [];
      if (images.length === 0) return '';

      const randomIndex = Math.floor(Math.random() * images.length);
      return `/icons/${images[randomIndex]}`;
    };

    return {
      bookmarkedPosts,
      getRecruitmentStatus,
      getStatusColor,
      viewDetails,
      toggleBookmark,
    };
  },
};
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
}

.header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-btn {
  flex: 1;
}

.job-listings {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.job-card {
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s;
  cursor: pointer;
  overflow: hidden;
}

.job-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.job-card-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
}

.job-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.job-info {
  padding: 10px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.job-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.job-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.bookmark-icon {
  cursor: pointer;
  font-size: 1.5rem;
}

.status-badge {
  margin-top: 10px;
}

.job-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  gap: 10px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding-top: 16px;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  font-size: 1.2rem;
  color: #999;
  padding: 20px;
  box-sizing: border-box;
}

@media (max-width: 600px) {
  .filters {
    flex-direction: column;
  }

  .filter-btn {
    width: 100%;
  }

  .job-card {
    width: 100%;
  }

  .job-title {
    font-size: 0.9rem;
  }
}
</style>
