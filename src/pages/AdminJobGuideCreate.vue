<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <div class="text-h5">취업 가이드 작성</div>
        <q-input v-model="title" label="제목" outlined />
        <q-editor
          v-model="content"
          :toolbar="toolbar"
          :definitions="editorDefinitions"
        />
        <div v-if="selectedFiles.length" class="file-info">
          선택된 파일:
          <div v-for="(fileObj, index) in selectedFiles" :key="index">
            {{ fileObj.file.name }}
            <img
              v-if="fileObj.isImage"
              :src="fileObj.previewUrl"
              alt="Image Preview"
              style="max-width: 100%; height: auto"
            />
          </div>
        </div>
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
    <input
      type="file"
      ref="fileInput"
      @change="onFileChange"
      accept="image/*, .pdf , .doc , .hwp , .csv, .ppt"
      multiple
      style="display: none"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { customApi } from 'boot/axios';
import { useAuthStore } from 'stores/authStore';

const title = ref('');
const content = ref('');
const router = useRouter();
const isCancelDialogOpen = ref(false);
const authStore = useAuthStore();
const fileInput = ref(null);
const selectedFiles = ref([]);

const onFileChange = event => {
  selectedFiles.value = Array.from(event.target.files).map(file => {
    const isImageFile = isImage(file);
    const previewUrl = isImageFile ? URL.createObjectURL(file) : null;
    return { file, isImage: isImageFile, previewUrl };
  });
};

const isImage = file => {
  return file && file.type && file.type.startsWith('image/');
};

const handleFileUploads = async jobGuideId => {
  for (const { file, isImage } of selectedFiles.value) {
    const formData = new FormData();
    formData.append('files', file);
    const apiUrl = isImage
      ? `/image/${jobGuideId}/update`
      : `/document/${jobGuideId}/update`;
    try {
      const response = await customApi.put(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const fileUrl = isImage
        ? response.data['이미지url']
        : response.data['문서url'];
      content.value += isImage
        ? `<img src="${fileUrl}" style="max-width: 100%; height: auto;" alt="Uploaded Image">`
        : `<a href="${fileUrl}" target="_blank">Uploaded Document</a>`;
    } catch (error) {
      console.error(`${isImage ? 'Image' : 'Document'} upload failed:`, error);
    }
  }
};

const createJobGuide = async () => {
  // 권한 확인
  if (authStore.role !== 'ADMIN') {
    alert('권한이 없습니다.');
    return;
  }
  ``;

  try {
    const jobGuideData = {
      username: authStore.username,
      title: title.value,
      content: content.value,
    };

    const jobGuideResponse = await customApi.post('/job-guide', jobGuideData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    const jobGuideId =
      jobGuideResponse.data.guidId || jobGuideResponse.data.guideId;

    if (!jobGuideId) {
      throw new Error('Invalid job guide ID');
    }

    // 파일 업로드
    if (selectedFiles.value.length > 0) {
      await handleFileUploads(jobGuideId);
    }

    alert('취업 가이드가 등록되었습니다.');
    router.push({ path: `/dashboard` });
  } catch (error) {
    console.error('Failed to create job guide:', error);
    alert('등록 중 오류가 발생했습니다.');
  }
};

const toolbar = [
  ['bold', 'italic', 'strike', 'underline'],
  ['upload', 'save'],
];

const editorDefinitions = {
  upload: {
    tip: '파일 업로드',
    icon: 'cloud_upload',
    label: 'Upload',
    handler: () => {
      fileInput.value.click(); // 파일 입력 창을 여는 역할
    },
  },
  save: {
    tip: '저장하기',
    icon: 'save',
    label: 'Save',
    handler: createJobGuide,
  },
};

// authStore 초기화
onMounted(() => {
  authStore.initializeAuth();
  console.log('Auth initialized:', authStore.role); // auth 초기화 후 역할 출력
});

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

.file-info {
  margin-top: 10px;
  color: #333;
}

.submit-button {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

#image-upload {
  display: none;
}
</style>
