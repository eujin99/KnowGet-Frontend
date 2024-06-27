<template>
  <q-card class="mypage-card">
    <q-card-section>
      <div class="text-h5">취업 성공사례 내역</div>
      <div v-if="userSuccessStories.length === 0" class="no-stories">
        아직 작성하신 성공사례 글이 없어요. <br />
        취업에 성공하셨다면 다른 분들을 위해 성공사례를 남겨주세요!
      </div>
      <q-list v-else bordered class="q-mt-md">
        <q-item
          v-for="story in userSuccessStories"
          :key="story.caseId"
          clickable
          @click="goToSuccessDetail(story.caseId)"
        >
          <q-item-section>
            <q-item-label>{{ story.title }}</q-item-label>
            <q-item-label caption>{{ story.createdDate }}</q-item-label>
            <q-item-label caption>{{
              story.isApproved === 1
                ? '승인됨'
                : story.isApproved === 2
                ? '거절됨'
                : '대기 중'
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { customApi } from 'boot/axios';
import { useAuthStore } from 'stores/authStore';

const authStore = useAuthStore();
const userSuccessStories = ref([]);
const router = useRouter();

const fetchUserSuccessStories = async () => {
  try {
    const response = await customApi.get('/success-case');
    // 사용자의 글만 필터링
    userSuccessStories.value = response.data.filter(
      successStory => successStory.username === authStore.username,
    );
  } catch (error) {
    console.error('성공사례 글 불러오기 실패.', error);
  }
};

const goToSuccessDetail = caseId => {
  router.push({ name: 'MyPageSuccessDetail', params: { id: caseId } });
};

onMounted(() => {
  authStore.initializeAuth();
  fetchUserSuccessStories();
});
</script>

<style scoped>
.mypage-card {
  width: 100%;
  max-width: 800px;
  margin: auto;
}

.no-stories {
  padding: 20px;
  text-align: center;
  color: #888;
}
</style>
