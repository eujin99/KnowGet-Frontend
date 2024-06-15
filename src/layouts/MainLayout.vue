<!-- src/layouts/MainLayout.vue -->
<template>
  <q-layout view="lHh Lpr lFf">
    <AppHeader :title="pageTitle" @toggle-sidebar="toggleLeftDrawer" />
    <AppSidebar
      :model-value="leftDrawerOpen"
      @update:model-value="setLeftDrawerOpen"
    />
    <q-page-container>
      <router-view @route-changed="updatePageTitle" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from 'components/AppHeader.vue';
import AppSidebar from 'components/AppSidebar.vue';

const leftDrawerOpen = ref(false);
const pageTitle = ref('');

function updatePageTitle(route) {
  pageTitle.value = route.meta.title || 'Default Title';
}

const route = useRoute();
watch(
  route,
  newRoute => {
    updatePageTitle(newRoute);
  },
  { immediate: true },
);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function setLeftDrawerOpen(value) {
  leftDrawerOpen.value = value;
}
</script>
