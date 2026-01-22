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
const data = dataStore();

onMounted(() => {
  data.fetchAllData()
})
</script>
