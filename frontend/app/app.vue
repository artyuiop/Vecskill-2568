<template>
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
</template>

<script setup>
import { dataStore } from './stores/dataStore';
const data = dataStore()


onMounted(async () => {
  await data.fetchEvaluatee();
})
</script>
