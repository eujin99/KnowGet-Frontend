<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <div class="text-h5">취업 가이드 작성</div>
        <q-input v-model="username" label="작성자" outlined />
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
        <q-file
          v-model="files"
          label="파일 업로드"
          filled
          multiple
          class="file-input"
        />
        <div class="submit-button">
          <q-btn label="등록" color="primary" @click="createJobGuide" />
          <q-btn label="취소" color="secondary" @click="openCancelDialog" />
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="isCancelDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">취소 확인</div>
          <p>저장되지 않습니다, 정말 취소하시겠습니까?</p>
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
import { customApi } from 'boot/axios';

const username = ref('관리자 계정명'); // 관리자 계정명 초기값 설정
const title = ref('');
const content = ref('');
const files = ref([]);
const router = useRouter();

const isCancelDialogOpen = ref(false);

const createJobGuide = async () => {
  try {
    // Job Guide 생성
    const jobGuideData = {
      username: username.value,
      title: title.value,
      content: content.value,
    };

    const jobGuideResponse = await customApi.post('/job-guide', jobGuideData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(jobGuideResponse.data); // 응답 데이터 확인

    const jobGuideId =
      jobGuideResponse.data.guidId || jobGuideResponse.data.guideId;

    if (!jobGuideId) {
      throw new Error('Invalid job guide ID');
    }

    // 이미지 및 문서 업로드
    const imageFormData = new FormData();
    const documentFormData = new FormData();
    for (const file of files.value) {
      if (file.type.startsWith('image/')) {
        imageFormData.append('files', file);
      } else {
        documentFormData.append('files', file);
      }
    }

    console.log([...imageFormData]); // 디버깅을 위한 이미지 FormData 항목 로그

    let imageUrls = [];
    let documentUrls = [];

    if (imageFormData.has('files')) {
      const imageUploadResponse = await customApi.post(
        `/image-transfer/${jobGuideId}/uploads`,
        imageFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log('Image Upload Response:', imageUploadResponse.data);
      // 이미지 URL 저장
      imageUrls = imageUploadResponse.data.urls;
    }

    if (documentFormData.has('files')) {
      const documentUploadResponse = await customApi.post(
        `/document-transfer/${jobGuideId}/uploads`,
        documentFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log('Document Upload Response:', documentUploadResponse.data);
      // 문서 URL 저장
      documentUrls = documentUploadResponse.data.urls;
    }

    // Update the job guide with URLs if necessary
    // alert('취업 가이드가 등록되었습니다.');
    router.push({ path: `/job-guide/${jobGuideId}` }); // 상세 페이지로 이동
  } catch (error) {
    console.error('Failed to create job guide:', error);
    alert('등록 중 오류가 발생했습니다.');
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
  router.push({ path: '/dashboard' });
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

.file-input {
  width: 100%;
  margin-top: 20px;
}

.submit-button {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
