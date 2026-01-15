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
import { dataStore } from './stores/dataStore';
const data = dataStore()

// console.log = function() {} 

onMounted(async () => {
  await data.fetchEvaluatee();
})
</script>
