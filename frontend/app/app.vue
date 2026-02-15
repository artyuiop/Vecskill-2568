<template>
  <UiAlert />
  <NuxtLayout :name="route.path === '/' ? 'default' : 'main-layout'">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
useHead({
  title: "ระบบประเมินบุคลากร"
})
const route = useRoute()
const store = dataStore();
const auth = authStore();
onMounted(() => {
  if(auth.token){
    store.fetchAllData()
  }
})
watch(() => auth.token, (token) => {
  if(token){
    store.fetchAllData(true)
  }else{
    store.$reset()
  }
}, {immediate: true})



// onMounted(() => {
//   if (auth.token) {
//     store.fetchAllData();
//   }
// });

// watch(() => auth.token, (newToken) => {
//   if (newToken) {
//     // บังคับดึงข้อมูลใหม่เสมอเมื่อมีการ login ใหม่
//     store.fetchAllData(true); 
//   } else {
//     // ถ้า logout ก็ล้างข้อมูลทิ้ง
//     store.$reset();
//   }
// }, { immediate: true });
// console.log = function(){}
</script>
