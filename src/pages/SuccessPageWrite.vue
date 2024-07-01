<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <div class="text-h5">취업 성공사례 작성</div>
        <br />
        <q-input v-model="title" label="제목" outlined />
        <q-input
          v-model="content"
          label="내용"
          type="textarea"
          placeholder="내용을 입력하세요."
          filled
          class="content-input"
          rows="6"
        />
        <div class="submit-button">
          <q-btn label="등록" color="primary" @click="openSubmitDialog" />
          <q-btn label="취소" color="secondary" @click="openCancelDialog" />
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="isSubmitDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">작성 확인</div>
          <p>입력하신 내용으로 취업 성공 사례를 게시하시겠습니까?</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="예" color="primary" @click="confirmSubmit" />
          <q-btn
            flat
            label="아니요"
            color="primary"
            @click="closeSubmitDialog"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isCancelDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">취소 확인</div>
          <p>작성하신 내용이 저장되지 않습니다. 정말 취소하시겠습니까?</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="예" color="primary" @click="confirmCancel" />
          <q-btn
            flat
            label="아니요"
            color="primary"
            @click="closeCancelDialog"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { customApi } from 'src/boot/axios';
import { useAuthStore } from 'stores/authStore';
import { Notify } from 'quasar';

const router = useRouter();
const authStore = useAuthStore();
const title = ref('');
const content = ref('');

const isSubmitDialogOpen = ref(false);
const isCancelDialogOpen = ref(false);

const createSuccessCase = async () => {
  try {
    const successCaseData = {
      title: title.value,
      content: content.value,
      username: authStore.username,
    };

    await customApi.post('/success-case', successCaseData);
    await router.push({ name: 'SuccessPage' });
    Notify.create({
      type: 'positive',
      message: '글 작성에 성공했습니다. 관리자의 승인 후 게시됩니다.',
      position: 'center',
    });
  } catch (error) {
    console.error('글 작성 실패:', error);
    Notify.create({
      type: 'negative',
      message: '글 작성에 실패했습니다.',
      position: 'top',
    });
  }
};
const openCancelDialog = () => {
  isCancelDialogOpen.value = true;
};

const closeCancelDialog = () => {
  isCancelDialogOpen.value = false;
};

const confirmCancel = () => {
  isCancelDialogOpen.value = false;
  router.push({ name: 'SuccessPage' });
};

const openSubmitDialog = () => {
  isSubmitDialogOpen.value = true;
};

const closeSubmitDialog = () => {
  isSubmitDialogOpen.value = false;
};

const confirmSubmit = () => {
  isSubmitDialogOpen.value = false;
  createSuccessCase();
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
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.content-input {
  width: 100%;
  min-height: 150px;
  margin-top: 20px;
}

.submit-button {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
