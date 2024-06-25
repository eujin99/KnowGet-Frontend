<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="header" v-if="successCase"></q-header>

    <q-page-container>
      <q-page class="page-wrapper">
        <q-card class="page-card" v-if="successCase">
          <q-card-section>
            <div class="header">
              <div class="sc-title">{{ successCase.title }}</div>
              <div class="text-caption">작성자: {{ successCase.username }}</div>
              <div class="text-caption">
                게시 일자:
                {{ new Date(successCase.createdDate).toLocaleDateString() }}
              </div>
            </div>
            <q-separator spaced />

            <q-card class="content-card">
              <q-card-section class="content-section">
                <p>{{ successCase.content }}</p>
              </q-card-section>

              <q-separator spaced />
              <div class="comment-form">
                <q-input
                  filled
                  outlined
                  dense
                  v-model="newComment"
                  placeholder="댓글을 작성해주세요..."
                  clearable
                  @keydown.enter="submitComment"
                />
                <q-btn color="primary" label="확인" @click="submitComment" />
              </div>

              <div class="comments-section" v-if="comments.length > 0">
                <div
                  class="comment"
                  v-for="comment in comments"
                  :key="comment.commentId"
                >
                  <div class="comment-writer">
                    작성자 {{ comment.username }}
                  </div>
                  <div v-if="!comment.editing" class="comment-content">
                    {{ comment.content }}
                  </div>
                  <div v-if="comment.editing">
                    <q-input
                      filled
                      outlined
                      dense
                      v-model="comment.newContent"
                      :placeholder="comment.content"
                      clearable
                    />
                    <q-btn
                      color="primary"
                      label="저장"
                      @click="saveEditedComment(comment)"
                    />
                  </div>
                  <div class="comment-date">
                    작성 시각
                    {{ new Date(comment.createdDate).toLocaleDateString() }}
                    <div v-if="comment.username === authStore.username">
                      <q-btn
                        color="primary"
                        label="수정"
                        @click="toggleEditing(comment)"
                      />
                      <q-btn
                        color="primary"
                        label="삭제"
                        @click="confirmDeleteComment(comment.commentId)"
                      />
                    </div>
                  </div>

                  <!-- 답글 버튼 또는 답글 개수 보기 -->
                  <q-btn
                    v-if="!comment.showReplies"
                    color="primary"
                    :label="
                      comment.replies.length > 0
                        ? `${comment.replies.length}개의 답글 보기`
                        : '답글 보기'
                    "
                    @click="toggleShowReplies(comment)"
                  />
                  <q-btn
                    v-else-if="comment.showReplies"
                    color="primary"
                    label="답글 숨기기"
                    @click="toggleShowReplies(comment)"
                  />
                  <!-- 답글 목록 -->
                  <div v-if="comment.showReplies">
                    <div v-if="comment.replies.length === 0" class="noReply">
                      현재 해당 댓글의 답글이 없습니다.
                    </div>
                    <div
                      class="reply"
                      v-for="reply in comment.replies"
                      :key="reply.replyId"
                    >
                      <div class="reply-writer">
                        작성자 {{ reply.username }}
                      </div>
                      <div v-if="!reply.editing" class="reply-content">
                        {{ reply.content }}
                      </div>
                      <div v-if="reply.editing">
                        <q-input
                          filled
                          outlined
                          dense
                          v-model="reply.newContent"
                          :placeholder="reply.content"
                          clearable
                        />
                        <q-btn
                          color="primary"
                          label="저장"
                          @click="saveEditedReply(comment.commentId, reply)"
                        />
                      </div>
                      <div class="reply-date">
                        작성 시각
                        {{ new Date(reply.createdDate).toLocaleDateString() }}
                        <div v-if="reply.username === authStore.username">
                          <q-btn
                            color="primary"
                            label="수정"
                            @click="toggleEditingReply(reply)"
                          />
                          <q-btn
                            color="primary"
                            label="삭제"
                            @click="deleteReply(reply.replyId)"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- 답글 작성 폼 -->
                    <div class="reply-form">
                      <q-input
                        filled
                        outlined
                        dense
                        v-model="newReplyContent[comment.commentId]"
                        placeholder="답글을 작성해주세요..."
                        clearable
                        @keydown.enter="submitReply(comment.commentId)"
                      />
                      <q-btn
                        color="primary"
                        label="확인"
                        @click="submitReply(comment.commentId)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </q-card>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api, customApi } from 'boot/axios';
import { useAuthStore } from 'stores/authStore';

const successCase = ref(null);
const comments = ref([]);
const newComment = ref('');
const newReplyContent = reactive({});
const router = useRouter();
const caseId = router.currentRoute.value.params.caseId;
const authStore = useAuthStore();

const fetchSuccessCase = async () => {
  try {
    const response = await api.get(`/success-case/${caseId}`);
    successCase.value = response.data;
    fetchComments();
  } catch (error) {
    console.error('성공사례 fetch failed', error);
  }
};

// fetchComments 함수 추가
// 댓글 목록을 불러오는 API를 호출하고, 불러온 댓글 목록을 comments 변수에 저장
const fetchComments = async () => {
  try {
    const response = await customApi.get(`/success-case/${caseId}/comments`);
    if (Array.isArray(response.data)) {
      const fetchedComments = response.data.map(comment => ({
        ...comment,
        editing: false,
        newContent: '',
        showReplies: false,
        replies: [],
      }));

      // 각 댓글마다 답글 로딩(for n개의 답글 보기 버튼)
      for (let comment of fetchedComments) {
        // fetchedComments 배열의 각 요소를 comment로 받아와서 반복문을 실행
        const replyResponse = await customApi.get(
          `/comment/${comment.commentId}/replies`,
        );
        if (Array.isArray(replyResponse.data)) {
          // replyResponse.data가 배열이면
          comment.replies = replyResponse.data.map(reply => ({
            ...reply,
            editing: false,
            newContent: '',
          }));
        } else {
          throw new Error('replies에 대한 API 응답 오류');
        }
      }

      // comments 업데이트 - 최신순 정렬
      comments.value = fetchedComments.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate),
      );

      // newReplyContent 초기화
      comments.value.forEach(comment => {
        newReplyContent[comment.commentId] = '';
      });
    } else {
      throw new Error('comments에 대한 API 응답 오류');
    }
  } catch (error) {
    console.error('댓글 fetch 에러:', error);
  }
};

//댓글 수정
const editComment = async commentId => {
  try {
    const newContent = newContent.length();
    if (newContent.length === 0) {
      window.alert('댓글 내용을 최소 1자 이상 입력해주세요');
    } else {
      const response = await customApi.patch(
        `/success-case/${caseId}/comment/${commentId}`,
        { content: newContent },
      );

      console.log('댓글 수정 성공:', response.data.message);

      const commentIndex = comments.value.findIndex(
        comment => comment.commentId === commentId,
      );

      if (commentIndex !== -1) {
        comments.value[commentIndex].content = newContent;
      }

      // 수정 후 댓글 목록을 다시 불러옴
      fetchComments();

      // 입력 상자 초기화
      newCommentForEdit.value = '';
    }
  } catch (error) {
    console.error('댓글 수정 에러:', error);
  }
};

// 댓글 삭제 confirm msg
const confirmDeleteComment = async commentId => {
  const comment = comments.value.find(
    comment => comment.commentId === commentId,
  );

  if (comment.replies.length > 0) {
    window.confirm('댓글에 답글이 달려있습니다. 삭제가 불가합니다.');
  } else {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      deleteComment(commentId);
    }
  }
};

// 댓글 삭제
const deleteComment = async commentId => {
  try {
    const response = await customApi.delete(
      `/success-case/${caseId}/comment/${commentId}`,
    );
    console.log('댓글 삭제 성공:', response.data.message);

    fetchComments();
  } catch (error) {
    console.error('댓글 삭제 에러:', error);
  }
};

const toggleEditing = comment => {
  comment.editing = !comment.editing;
  if (comment.editing) {
    comment.newContent = comment.content;
  }
};

// 댓글 수정 저장
const saveEditedComment = async comment => {
  try {
    const newContent = comment.newContent.trim();
    if (newContent.length === 0) {
      console.log('댓글 내용을 최소 1자 이상 입력해주세요');
      return;
    }

    const response = await customApi.patch(
      `/success-case/${caseId}/comment/${comment.commentId}`,
      { content: newContent },
    );

    console.log('댓글 수정 성공:', response.data.message);

    // 수정 후 댓글 목록을 다시 불러옴
    fetchComments();
  } catch (error) {
    console.error('댓글 수정 에러:', error);
  }
};

// 댓글 작성
const submitComment = async () => {
  try {
    const response = await customApi.post(`/success-case/${caseId}/comment`, {
      caseId: caseId,
      content: newComment.value,
    });

    console.log('댓글 작성 성공:', response.data.message);

    // 댓글 작성 후 입력 상자 초기화 및 댓글 목록 다시 불러옴
    newComment.value = '';
    fetchComments();
  } catch (error) {
    console.error('댓글 작성 에러:', error);
  }
};

// 답글 작성
const submitReply = async commentId => {
  try {
    const content = newReplyContent[commentId];
    if (!content || content.trim() === '') {
      console.log('답글 내용을 최소 1자 이상 입력해주세요');
      return;
    }

    // API를 호출하여 답글을 서버에 전송
    const response = await customApi.post(`/comment/${commentId}/reply`, {
      content: content.trim(), // 답글 내용을 보내기 전에 trim()으로 앞뒤 공백 제거
    });

    console.log('답글 작성 성공:', response.data.message);
    fetchComments();
    // 답글 객체 생성
    const newReply = {
      replyId: response.data.replyId, // 서버에서 생성한 답글의 ID
      content: content.trim(), // 입력된 답글 내용
      createdDate: new Date().toISOString(),
      username: authStore.username,
      editing: false,
      newContent: '', // 편집할 내용 초기값
    };

    // 답글 목록에 새로 추가
    const commentIndex = comments.value.findIndex(
      comment => comment.commentId === commentId,
    );
    if (commentIndex !== -1) {
      comments.value[commentIndex].replies.unshift(newReply); // 답글을 최상단에 추가
    }

    newReplyContent[commentId] = '';
  } catch (error) {
    console.error('답글 작성 에러:', error);
  }
};

// 답글 수정
const saveEditedReply = async (commentId, reply) => {
  try {
    const newContent = reply.newContent.trim();
    if (newContent.length === 0) {
      console.log('답글 내용을 최소 1자 이상 입력해주세요');
      return;
    }

    const response = await customApi.patch(
      `/comment/${commentId}/reply/${reply.replyId}`,
      { content: newContent },
    );

    console.log('답글 수정 성공:', response.data.message);

    reply.editing = false;
    fetchComments();
  } catch (error) {
    console.error('답글 수정 에러:', error);
  }
};

// 답글 삭제
const deleteReply = async (commentId, replyId) => {
  try {
    const response = await customApi.delete(
      `/comment/${commentId}/reply/${replyId}`,
    );

    console.log('답글 삭제 성공:', response.data.message);

    fetchComments();
  } catch (error) {
    console.error('답글 삭제 에러:', error);
  }
};

const toggleShowReplies = async comment => {
  try {
    // 현재 답글 상태를 토글
    comment.showReplies = !comment.showReplies;

    // 답글을 보여줄 때, 답글 목록을 API
    if (comment.showReplies && comment.replies.length === 0) {
      const response = await customApi.get(
        `/comment/${comment.commentId}/replies`,
      );
      if (Array.isArray(response.data)) {
        // 가져온 답글 목록을 comment 객체에 업데이트
        comment.replies = response.data.map(reply => ({
          ...reply,
          editing: false,
          newContent: '',
        }));
      } else {
        throw new Error('Invalid API response for replies');
      }
    }
  } catch (error) {
    console.error('Error fetching replies:', error);
  }
};

const toggleEditingReply = reply => {
  reply.editing = !reply.editing;
  if (reply.editing) {
    reply.newContent = reply.content;
  }
};

onMounted(fetchSuccessCase);
</script>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.page-card {
  width: 100%;
  max-width: 800px;
}

.header {
  font-size: 20px;
  font-weight: bold;
}

.sc-title {
  font-size: 24px;
}

.content-card {
  margin-top: 20px;
}

.content-section {
  white-space: pre-wrap;
}

.comment {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
}

.comment-writer {
  font-weight: bold;
}

.comment-content {
  margin-top: 10px;
}

.comment-date {
  font-size: 12px;
  color: #888;
}

.comment-form {
  flex: auto;
  margin-top: 20px;
  margin-left: 10px;
  margin-right: 10px;
}

.comments-section {
  margin-top: 20px;
}

.reply {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #eee;
}

.reply-writer {
  font-weight: bold;
}

.reply-content {
  margin-top: 10px;
}

.reply-date {
  font-size: 12px;
  color: #888;
}

.reply-form {
  margin-top: 10px;
  display: flex;
  align-items: center;
}
.noReply {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #eee;
  text-align: center;
}
</style>
