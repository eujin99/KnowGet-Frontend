<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <div class="text-h5">취업 가이드 상세</div>
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
        <div class="file-list">
          <h4>기존 파일</h4>
          <ul>
            <li v-for="file in existingFiles" :key="file.url">
              <template v-if="file.type === 'image/'">
                <img
                  :src="file.url"
                  :alt="file.name"
                  style="max-width: 100px"
                />
              </template>
              <template v-else>
                <a :href="file.url" target="_blank">{{ file.name }}</a>
              </template>
              <q-btn
                icon="delete"
                color="negative"
                @click="removeFile(file.url)"
                flat
              />
            </li>
          </ul>
        </div>
        <q-file
          v-model="newFiles"
          label="새 파일 추가"
          filled
          multiple
          class="file-input"
        />
        <div class="submit-button">
          <q-btn label="수정" color="primary" @click="updateJobGuide" />
          <q-btn label="취소" color="secondary" @click="cancelEdit" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { customApi } from 'boot/axios';

const route = useRoute();
const router = useRouter();
const jobGuideId = route.params.id;

const title = ref('');
const content = ref('');
const newFiles = ref([]);
const existingFiles = ref([]);

const fetchJobGuideDetail = async () => {
  try {
    const response = await customApi.get(`/job-guide/${jobGuideId}`);
    console.log('Response Data:', response.data); // 응답 데이터 로그 출력
    title.value = response.data.title;
    content.value = response.data.content;

    // Check if imageUrls and documentUrls exist before mapping
    const existingImages = response.data.imageUrls
      ? response.data.imageUrls.map(url => ({ url, type: 'image/' }))
      : [];
    const existingDocuments = response.data.documentUrls
      ? response.data.documentUrls.map(url => ({ url, type: 'document/' }))
      : [];
    existingFiles.value = [...existingImages, ...existingDocuments];
  } catch (error) {
    console.error('Failed to fetch job guide detail:', error);
  }
};

const updateJobGuide = async () => {
  try {
    // Job Guide 수정
    await customApi.put(`/job-guide/${jobGuideId}`, {
      title: title.value,
      content: content.value,
    });

    alert('취업 가이드가 수정되었습니다.');
    router.push({ path: '/dashboard' }); // 대시보드 페이지로 이동
  } catch (error) {
    console.error('Failed to update job guide:', error);
    alert('수정 중 오류가 발생했습니다.');
  }
};

const removeFile = async fileUrl => {
  try {
    await customApi.delete(fileUrl);
    existingFiles.value = existingFiles.value.filter(
      file => file.url !== fileUrl,
    );
  } catch (error) {
    console.error('Failed to delete file:', error);
    alert('파일 삭제 중 오류가 발생했습니다.');
  }
};

const cancelEdit = () => {
  router.push({ path: '/dashboard' });
};

onMounted(fetchJobGuideDetail);
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

.file-list {
  margin-top: 20px;
}

.file-list h4 {
  margin-bottom: 10px;
}

.file-list ul {
  list-style-type: none;
  padding: 0;
}

.file-list li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.submit-button {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
