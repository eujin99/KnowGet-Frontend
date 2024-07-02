<template>
  <q-page>
    <div class="mypage-container">
      <div class="mypage-header">
        <q-btn
          @click="selectTab('info')"
          :outline="selectedTab !== 'info'"
          :class="{ 'selected-tab': selectedTab === 'info' }"
          >내 정보</q-btn
        >
        <q-btn
          @click="selectTab('counseling')"
          :outline="selectedTab !== 'counseling'"
          :class="{ 'selected-tab': selectedTab === 'counseling' }"
          >상담 내역</q-btn
        >
        <q-btn
          @click="selectTab('success')"
          :outline="selectedTab !== 'success'"
          :class="{ 'selected-tab': selectedTab === 'success' }"
          >취업 성공사례 내역</q-btn
        >
        <q-btn
          @click="selectTab('bookmarks')"
          :outline="selectedTab !== 'bookmarks'"
          :class="{ 'selected-tab': selectedTab === 'bookmarks' }"
          >북마크</q-btn
        >
      </div>
      <router-view />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const selectedTab = ref(route.name.split('.')[1]);

function selectTab(tab) {
  router.push({ name: `MyPage.${tab}` });
  selectedTab.value = tab;
}
</script>

<style scoped>
.mypage-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.mypage-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
}

.selected-tab {
  border-bottom: 2px solid #42a5f5;
  background-color: #c3e4ff;
}

.q-btn {
  flex: 1;
  text-align: center;
  margin: 0 5px;
  transition: border-bottom 0.3s;
}

.q-btn:hover {
  border-bottom: 2px solid #42a5f5;
}
</style>
