<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <q-btn
          flat
          round
          dense
          icon="arrow_back"
          @click="goBack"
          class="back-btn"
        />
        <p/>
        <div class="text-h5">{{ successCase.title }}</div>
      </q-card-section>

      <q-card-section>
        <table class="success-case-table">
          <tbody>
            <tr>
              <th>작성자</th>
              <td>{{ successCase.username }}</td>
            </tr>
            <tr>
              <th>등록일</th>
              <td>{{ formatDate(successCase.createdDate) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="content-box">
          <div class="content" v-html="successCase.content"></div>
        </div>
        <q-btn
          v-if="authStore.username === successCase.username"
          label="삭제"
          color="negative"
          @click="deleteSuccessCase"
          icon="delete"
          flat
          dense
          size="sm"
        />
      </q-card-section>

      <q-card-section>
        <div class="comments-section">
          <q-input
            v-model="newComment"
            :placeholder="
              authStore.isLoggedIn
                ? '댓글을 입력하세요.'
                : '로그인 후에 이용할 수 있습니다.'
            "
            :disable="!authStore.isLoggedIn"
            outlined
            dense
            class="comment-input"
            autofocus
            @keyup.enter="postComment"
          />
          <q-btn
            label="등록"
            color="primary"
            @click="postComment"
            :disable="!authStore.isLoggedIn"
            flat
            dense
          />
        </div>
        <div class="comments-list">
          <q-card
            v-for="comment in comments"
            :key="comment.commentId"
            class="comment-card"
            flat
            bordered
          >
            <q-card-section>
              <div class="comment-header">
                <div>
                  <div class="author">{{ comment.username }}</div>
                  <div class="date">{{ formatDate(comment.createdDate) }}</div>
                </div>
                <div>
                  <q-btn
                    icon="edit"
                    flat
                    dense
                    v-if="authStore.username === comment.username"
                    label="수정"
                    @click="toggleEditComment(comment.commentId)"
                    size="sm"
                  />
                  <q-btn
                    v-if="authStore.username === comment.username"
                    label="삭제"
                    color="negative"
                    @click="deleteComment(comment.commentId)"
                    icon="delete"
                    flat
                    dense
                    size="sm"
                  />
                </div>
              </div>
              <div class="comment-content">
                <q-input
                  v-if="editCommentId === comment.commentId"
                  v-model="newCommentContent"
                  placeholder="수정할 내용을 입력하세요"
                  outlined
                  dense
                  autofocus
                  @keyup.enter="saveEditComment(comment.commentId)"
                />
                <div v-else>{{ comment.content }}</div>
              </div>
              <q-btn
                v-if="editCommentId === comment.commentId"
                label="저장"
                color="primary"
                @click="saveEditComment(comment.commentId)"
                flat
                dense
              />
              <q-btn
                flat
                dense
                color="primary"
                label="답글 보기"
                @click="toggleReplies(comment.commentId)"
              />
              <div v-if="repliesVisible[comment.commentId]" class="replies">
                <q-card
                  v-for="reply in comment.replies"
                  :key="reply.replyId"
                  class="reply-card"
                  flat
                  bordered
                >
                  <q-card-section>
                    <div class="reply-header">
                      <div>
                        <div class="author">{{ reply.username }}</div>
                        <div class="date">
                          {{ formatDate(reply.createdDate) }}
                        </div>
                      </div>
                      <div>
                        <q-btn
                          v-if="authStore.username === reply.username"
                          label="수정"
                          size="sm"
                          @click="
                            toggleEditReply(comment.commentId, reply.replyId)
                          "
                          icon="edit"
                          flat
                          dense
                        />
                        <q-btn
                          v-if="authStore.username === reply.username"
                          label="삭제"
                          color="negative"
                          size="sm"
                          @click="deleteReply(comment.commentId, reply.replyId)"
                          icon="delete"
                          flat
                          dense
                        />
                      </div>
                    </div>
                    <div class="reply-content">
                      <q-input
                        v-if="editReplyId === reply.replyId"
                        v-model="newReplyContent"
                        placeholder="수정할 내용을 입력하세요"
                        outlined
                        dense
                        autofocus
                        @keyup.enter="
                          saveEditReply(comment.commentId, reply.replyId)
                        "
                      />
                      <div v-else>{{ reply.content }}</div>
                    </div>
                    <q-btn
                      v-if="editReplyId === reply.replyId"
                      label="저장"
                      color="primary"
                      @click="saveEditReply(comment.commentId, reply.replyId)"
                      flat
                      dense
                      size="sm"
                    />
                  </q-card-section>
                </q-card>
                <q-input
                  v-model="newReply[comment.commentId]"
                  :placeholder="
                    authStore.isLoggedIn
                      ? '답글을 입력하세요.'
                      : '로그인 후에 이용할 수 있습니다.'
                  "
                  :disable="!authStore.isLoggedIn"
                  outlined
                  dense
                  class="reply-input"
                  @keyup.enter="postReply(comment.commentId)"
                />
                <q-btn
                  label="등록"
                  color="primary"
                  @click="postReply(comment.commentId)"
                  :disable="!authStore.isLoggedIn"
                  flat
                  dense
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from 'stores/authStore';
import { api, customApi } from 'boot/axios';
import { date, Notify } from 'quasar';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const caseId = route.params.caseId;

const successCase = ref({});
const comments = ref([]);
const newComment = ref('');
const newReply = ref({});
const repliesVisible = ref({});
const editCommentId = ref(null);
const newCommentContent = ref('');
const editReplyId = ref(null);
const newReplyContent = ref('');

const fetchSuccessCaseDetails = async () => {
  try {
    const response = await api.get(`/success-case/${caseId}`);
    successCase.value = response.data;
  } catch (error) {
    console.error('취업 성공 사례 fetch failed', error);
  }
};

const fetchComments = async () => {
  try {
    const response = await api.get(`/success-case/${caseId}/comments`);
    comments.value = response.data.sort(
      (a, b) => new Date(b.createdDate) - new Date(a.createdDate),
    );
    for (const comment of comments.value) {
      comment.replies = [];
      await fetchReplies(comment.commentId);
    }
  } catch (error) {
    console.error('Error fetching comments', error);
  }
};

const fetchReplies = async commentId => {
  try {
    const response = await api.get(`/comment/${commentId}/replies`);
    const comment = comments.value.find(c => c.commentId === commentId);
    if (comment) {
      comment.replies = response.data.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate),
      );
    }
  } catch (error) {
    console.error('Error fetching replies', error);
  }
};

const postComment = async () => {
  if (!authStore.isLoggedIn) {
    Notify.create({
      type: 'negative',
      message: '로그인 후 이용할 수 있습니다.',
      timeout: 2000,
      position: 'top',
    });
    return;
  }
  if (!newComment.value.trim()) {
    return;
  }
  try {
    await customApi.post(`/success-case/${caseId}/comment`, {
      content: newComment.value,
    });
    newComment.value = '';
    await fetchComments();
  } catch (error) {
    console.error('댓글 작성 에러', error);
  }
};

const postReply = async commentId => {
  if (!authStore.isLoggedIn) {
    Notify.create({
      type: 'negative',
      message: '로그인 후 이용할 수 있습니다.',
      timeout: 2000,
      position: 'top',
    });
    return;
  }
  const replyContent = newReply.value[commentId]?.trim();
  if (!replyContent) {
    return;
  }
  try {
    await customApi.post(`/comment/${commentId}/reply`, {
      content: newReply.value[commentId],
    });
    newReply.value[commentId] = '';
    await fetchReplies(commentId);
  } catch (error) {
    console.error('답글 작성 에러', error);
  }
};

const deleteSuccessCase = async () => {
  try {
    await customApi.delete(`/success-case/${caseId}`);
    Notify.create({
      type: 'positive',
      message: '취업 성공 사례 게시글이 삭제되었습니다.',
      timeout: 2000,
      position: 'top',
    });
    const previousPage = route.query.page || 1;
    await router.push({ path: '/success', query: { page: previousPage } });
  } catch (error) {
    console.error('취업 성공 사례 삭제 에러', error);
  }
};

const deleteComment = async commentId => {
  try {
    await customApi.delete(`/success-case/${caseId}/comment/${commentId}`);
    await fetchComments();
  } catch (error) {
    console.error('댓글 삭제 에러', error);
  }
};

const deleteReply = async (commentId, replyId) => {
  try {
    await customApi.delete(`/comment/${commentId}/reply/${replyId}`);
    await fetchReplies(commentId);
  } catch (error) {
    console.error('답글 삭제 에러', error);
  }
};

const toggleReplies = commentId => {
  repliesVisible.value[commentId] = !repliesVisible.value[commentId];
};

const toggleEditComment = commentId => {
  if (editCommentId.value === commentId) {
    editCommentId.value = null;
    newCommentContent.value = '';
  } else {
    editCommentId.value = commentId;
    const comment = comments.value.find(c => c.commentId === commentId);
    newCommentContent.value = comment.content;
  }
};

const saveEditComment = async commentId => {
  try {
    await customApi.patch(`/success-case/${caseId}/comment/${commentId}`, {
      content: newCommentContent.value,
    });
    const comment = comments.value.find(c => c.commentId === commentId);
    comment.content = newCommentContent.value;
    editCommentId.value = null;
    newCommentContent.value = '';
    await fetchComments();
  } catch (error) {
    console.error('댓글 수정 에러', error);
  }
};

const toggleEditReply = (commentId, replyId) => {
  if (editReplyId.value === replyId) {
    editReplyId.value = null;
    newReplyContent.value = '';
  } else {
    editReplyId.value = replyId;
    const comment = comments.value.find(c => c.commentId === commentId);
    const reply = comment.replies.find(r => r.replyId === replyId);
    newReplyContent.value = reply.content;
  }
};

const saveEditReply = async (commentId, replyId) => {
  try {
    await customApi.patch(`/comment/${commentId}/reply/${replyId}`, {
      content: newReplyContent.value,
    });
    const comment = comments.value.find(c => c.commentId === commentId);
    const reply = comment.replies.find(r => r.replyId === replyId);
    reply.content = newReplyContent.value;
    editReplyId.value = null;
    newReplyContent.value = '';
    await fetchReplies(commentId);
  } catch (error) {
    console.error('답글 수정 에러', error);
  }
};

const formatDate = dateString => {
  const dateObj = new Date(dateString);
  return isNaN(dateObj) ? '' : date.formatDate(dateObj, 'YYYY-MM-DD');
};

watch(
  () => route.params.caseId,
  async () => {
    await fetchSuccessCaseDetails();
  },
);

const goBack = () => {
  const previousPage = route.query.page || 1;
  router.push({ name: 'SuccessPage', query: { page: previousPage } });
};

onMounted(async () => {
  await fetchSuccessCaseDetails();
  await fetchComments();
});
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.meta-info {
  display: flex;
  flex-direction: column;
}

.success-case-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.success-case-table th,
.success-case-table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
}

.success-case-table th {
  background-color: #f5f5f5;
  text-align: left;
}

.content-box {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}

.comments-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.comment-input {
  flex-grow: 1;
  margin-right: 10px;
}

.comments-list {
  margin-top: 20px;
}

.comment-card {
  border: 1px solid #e0e0e0;
  margin-bottom: 10px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-content {
  margin-top: 10px;
}

.replies {
  padding-left: 20px;
  margin-top: 10px;
}

.reply-card {
  border: 1px solid #e0e0e0;
  margin-bottom: 10px;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reply-content {
  margin-top: 10px;
}

.reply-input {
  flex-grow: 1;
  margin-right: 10px;
}
</style>
