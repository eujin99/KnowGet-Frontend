<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98" v-if="successCase">
      <q-toolbar>
        <q-btn dense flat round icon="arrow_back" @click="goBack" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          {{ successCase.title }}
        </q-toolbar-title>

        <q-space />

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
    </q-drawer>

    <q-page-container>
      <q-page class="page-wrapper">
        <q-card class="page-card" v-if="successCase">
          <q-card-section>
            <div class="header">
              <div class="text-h5">{{ successCase.title }}</div>
              <div class="text-caption">작성자: {{ successCase.username }}</div>
              <div class="text-caption">게시 일자: {{ new Date(successCase.createdDate).toLocaleDateString() }}</div>
            </div>
            <q-separator spaced />

            <q-card class="content-card">
              <q-card-section class="content-section">
                <p>{{ successCase.content }}</p>
              </q-card-section>
            </q-card>

            <q-separator spaced />

            <!-- Comments Section -->
            <q-card class="comment-section">
              <q-card-section>
                <div class="text-h6">댓글</div>
                <div v-if="successCase.comments && successCase.comments.length > 0">
                  <div v-for="(comment, index) in successCase.comments" :key="index" class="comment-item">
                    <div class="text-caption">{{ comment.username }} - {{ new Date(comment.createdDate).toLocaleString() }}</div>
                    <div>{{ comment.text }}</div>
                  </div>
                </div>
                <div v-else class="text-caption">댓글이 없습니다.</div>

                <!-- 댓글 form -->
                <div class="q-mt-md q-flex q-items-center">
                  <q-input
                    filled
                    rounded
                    dense
                    v-model="newComment"
                    placeholder="댓글을 작성해주세욤..."
                    clearable
                    class="q-mr-sm"
                    @keydown.enter="submitComment"
                  />
                  <q-btn
                    color="primary"
                    label="확인"
                    @click="submitComment"
                  />
                </div>
              </q-card-section>
            </q-card>
          </q-card-section>
        </q-card>
        <q-spinner v-else />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'boot/axios';

const successCase = ref(null);
const router = useRouter();
const caseId = router.currentRoute.value.params.caseId;

const fetchSuccessCase = async () => {
  try {
    const response = await api.get(`/success-case/${caseId}`);
    successCase.value = response.data;
  } catch (error) {
    console.error('Failed to fetch success case:', error);
  }
};

onMounted(fetchSuccessCase);

const goBack = () => {
  router.go(-1);
};

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};

const submitComment = async () => {
  try {
    const response = await api.post(`/success-case/${caseId}/comments`, {
      text: newComment.value
    });

    // 새로운 댓글을 배열에 추가
    if (!successCase.value.comments) {
      successCase.value.comments = [];
    }
    successCase.value.comments.push(response.data);

    // 입력 필드 초기화
    newComment.value = '';
  } catch (error) {
    console.error('Failed to submit comment:', error);
  }
};

const newComment = ref('');

</script>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-caption {
  font-size: 14px;
  color: #666;
}

.content-card {
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-section {
  padding: 20px;
}

.comment-section {
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.comment-item {
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}

.q-mr-sm {
  margin-right: 10px;
}
</style>
