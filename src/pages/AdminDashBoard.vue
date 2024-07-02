<template>
  <q-page class="admin-dashboard">
    <q-tabs v-model="selectedTab" @update:model-value="onTabChange" dense>
      <q-tab name="user-management" label="사용자 관리" />
      <q-tab name="user-statistics" label="이용자 통계" />
      <q-tab name="counseling-management" label="상담 관리" />
      <q-tab name="job-guide-management" label="취업 가이드 관리" />
      <q-tab name="success-management" label="성공사례 관리" />
      <q-tab name="black-list" label="블랙리스트" />
    </q-tabs>

    <router-view />
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from 'stores/authStore';

const selectedTab = ref('user-management');
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

onMounted(() => {
  authStore.initializeAuth();
  selectedTab.value = route.path.split('/').pop() || 'user-management';
});

watch(route, newRoute => {
  selectedTab.value = newRoute.path.split('/').pop() || 'user-management';
});

const onTabChange = newTab => {
  router.push(`/dashboard/${newTab}`);
};
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}
</style>
