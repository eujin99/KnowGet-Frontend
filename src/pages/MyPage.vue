<template>
  <q-page>
    <div class="mypage-container">
      <div class="mypage-header">
        <q-btn @click="selectTab('info')" :outline="selectedTab !== 'info'"
          >내 정보</q-btn
        >
        <q-btn
          @click="selectTab('counseling')"
          :outline="selectedTab !== 'counseling'"
          >상담 내역</q-btn
        >
        <q-btn
          @click="selectTab('success')"
          :outline="selectedTab !== 'success'"
          >취업 성공사례 내역</q-btn
        >
        <q-btn
          @click="selectTab('bookmarks')"
          :outline="selectedTab !== 'bookmarks'"
          >북마크</q-btn
        >
      </div>

      <component :is="currentComponent" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { defineAsyncComponent } from 'vue';

const tabComponents = {
  info: defineAsyncComponent(() => import('components/MyPageInfo.vue')),
  counseling: defineAsyncComponent(() =>
    import('components/MyPageCounseling.vue'),
  ),
  success: defineAsyncComponent(() => import('components/MyPageSuccess.vue')),
  // bookmarks: defineAsyncComponent(() =>
  //   import('components/MyPageBookmarks.vue'),
  // ),
};

const selectedTab = ref('info');

const currentComponent = computed(() => tabComponents[selectedTab.value]);

function selectTab(tab) {
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
</style>
