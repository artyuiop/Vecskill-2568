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

watch(() => auth.token, (newToken) => {
  if (newToken) {
    // บังคับดึงข้อมูลใหม่เสมอเมื่อมีการ login ใหม่
    store.fetchAllData(true); 
  } else {
    // ถ้า logout ก็ล้างข้อมูลทิ้ง
    store.$reset();
  }
}, { immediate: true });
// console.log = function(){}
</script>
