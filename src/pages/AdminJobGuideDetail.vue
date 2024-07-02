<template>
  <q-page class="page-wrapper">
    <q-card class="page-card">
      <q-card-section>
        <q-btn flat icon="arrow_back" @click="goBack" />
        <div class="text-h5">{{ jobGuide.title }}</div>
        <div v-html="jobGuide.content" class="job-guide-content"></div>
      </q-card-section>
      <q-card-section v-if="images.length">
        <div
          class="image-preview"
          v-for="(image, index) in images"
          :key="index"
        >
          <img
            :src="image"
            alt="Job Guide Image"
            style="max-width: 100%; height: auto"
          />
        </div>
      </q-card-section>
      <q-card-section v-if="documents.length">
        <div class="text-h6">첨부 문서</div>
        <div
          class="document-link"
          v-for="(document, index) in documents"
          :key="index"
        >
          <a :href="document" target="_blank">문서 링크 {{ index + 1 }}</a>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { customApi } from 'boot/axios';

const jobGuide = ref({
  title: '',
  content: '',
});
const images = ref([]);
const documents = ref([]);

const route = useRoute();
const router = useRouter();

const fetchJobGuide = async () => {
  const jobGuideId = route.params.id;
  try {
    const response = await customApi.get(`/job-guide/${jobGuideId}`);
    jobGuide.value = response.data;

    const imageResponse = await customApi.get(`/image/${jobGuideId}`);
    console.log('Image response:', imageResponse.data);
    images.value = imageResponse.data || [];

    const documentResponse = await customApi.get(`/document/${jobGuideId}`);
    console.log('Document response:', documentResponse.data);
    documents.value = documentResponse.data['URLs'] || [];
  } catch (error) {
    console.error('Failed to fetch job guide:', error);
  }
};

const goBack = () => {
  router.go(-1);
};

onMounted(() => {
  fetchJobGuide();
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
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.job-guide-content {
  margin-top: 20px;
  color: #333;
}

.image-preview {
  margin-top: 10px;
}

.document-link {
  margin-top: 10px;
}
</style>
