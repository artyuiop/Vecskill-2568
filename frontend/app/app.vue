<template>
  <UiAlert :title="alert.title" :status="alert.status" :show="alert.show" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { dataStore } from '#imports';
const store = dataStore();
const auth = authStore();
onMounted(() => {
  if (auth.token) {
    store.fetchAllData();
  }
});
// console.log = function(){}
</script>
