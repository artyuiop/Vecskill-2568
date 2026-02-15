<!-- <template>
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="opacity-0 translate-x-30"
    leave-active-class="transition-all duration-300"
    leave-to-class="opacity-0 translate-x-30"
  >
    <div
      v-if="show"
      ref="toastRef"
      popover="manual"
      class="toast z-50 fixed toast-top"
      :class="position"
    >
      <div
        role="alert"
        class="alert text-white shadow-lg min-w-[300px]"
        :class="alertColorClass"
      >
        <i :class="`${iconClass} text-[24px]`"></i>
        <div class="flex flex-col">
          <span>{{ title }}</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  title: String,
  status: String,
  show: Boolean,
});

const toastRef = ref(null);
watch(() => props.show, async() => {
  await nextTick()
  if(toastRef.value){
    toastRef.value.showPopover()
  }
})


const alertColorClass = computed(() => {
  switch (props.status) {
    case "success":
      return "alert-success text-success border-success/20";
    case "error":
      return "alert-error text-error border-error/20";
  }
});

const iconClass = computed(() => {
  switch (props.status) {
    case "success":
      return "mdi mdi-check-circle";
    case "error":
      return "mdi mdi-alert-circle";
  }
});
</script> -->

<!-- 
<template>
  <div class="toast toast-top toast-end z-[9999]">
    
    <TransitionGroup 
      enter-active-class="duration-500 transition-all"
      enter-from-class="-translate-y-60 opacity-0"
      leave-active-class="duration-500 transition-all"
      leave-to-class="-translate-y-60 opacity-0"
      class="flex flex-col gap-2"
    >
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="alert shadow-lg min-w-[320px] cursor-pointer"
        :class="alert.status === 'success' ? 'alert-success text-white' : 'alert-error text-white'"
        @click="removeAlert(alert.id)"
      >
        <i class="text-2xl" 
           :class="alert.status === 'success' ? 'mdi mdi-check-circle' : 'mdi mdi-alert-circle'">
        </i>
        
        <div class="flex flex-col">
          <h3 class="font-bold text-sm">
            {{ alert.status === 'success' ? 'สำเร็จ' : 'ข้อผิดพลาด' }}
          </h3>
          <span class="text-xs opacity-90">{{ alert.title }}</span>
        </div>

        <div class="absolute bottom-0 left-0 h-1 bg-white/40 animate-progress w-full"></div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
</script>

<style scoped>
@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}
.animate-progress {
  animation: progress 2s linear forwards;
}
</style> -->
<!-- 
<template>
  <div class="toast toast-top z-999">
    <TransitionGroup
    enter-active-class="duration-500 transition-all"
    enter-from-class="-translate-y-60 opacity-0"
    leave-active-class="duration-500 transition-all"
    leave-to-class="-translate-y-60 opacity-0"
    class="flex flex-col"
    >
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="alert min-w-[320px] text-white"
        :class="alert.status === 'success' ? 'alert-success' : 'alert-error'"
      >
        <i :class="alert.status === 'success' ? 'mdi mdi-check-circle' : 'mdi mdi-alert-circle'"></i>
        <div class="flex flex-col">
          <h1 class="font-bold text-sm">
            {{ alert.status === 'success' ? 'สำเร็จ' : 'เกิดข้อผิดพลาด' }}
          </h1>
          <p class="text-xs opacity-90">{{ alert.title }}</p>
        </div>
        
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
</script> -->

<template>
  <div class="toast toast-top z-999">
    <TransitionGroup
      enter-active-class="duration-500 transition-all"
      enter-from-class="-translate-y-60 opacity-0"
      leave-active-class="duration-500 transition-all"
      leave-to-class="-translate-y-60 opacity-0"
      class="flex flex-col"     
    >
    <div
      v-for="alert in alerts"
      class="min-w-[320px] text-white alert"
      :class="alert.status === 'success' ? 'alert-success' : 'alert-error'"
    >
      <i :class="alert.status === 'success' ? 'mdi mdi-check-circle' : 'mdi mdi-alert-circle'"></i>
      <div>
        <h1 class="font-bold text-sm">{{ alert.status === 'success' ? 'แจ้งเตือนสำเร็จ': 'แจ้งเตือนข้อผิดพลาด' }}</h1>
        <p class="text-xs">{{ alert.title }}</p>
      </div>
    </div>
  </TransitionGroup>
  </div>
</template>

<script setup>

</script>