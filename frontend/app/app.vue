<template>
  <NuxtLayout>
    <UiAlert
      :title="alert.title"
      :status="alert.status"
      :show="alert.show"
    />
    <NuxtPage/>
  </NuxtLayout>
</template>

<script setup>
import { dataStore } from '#imports';
const store = dataStore();
const auth = authStore();

watch(() => auth.token, (newToken) => {
  if (newToken) {
    store.fetchAllData();
  }
}, { immediate: true });

onMounted(() => {
  if (auth.token) {
    store.fetchAllData();
  }
});
</script>
