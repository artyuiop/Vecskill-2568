<template>
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
watch(
  () => props.show,
  async (newVal) => {
    if (newVal && props.toast) {
      await nextTick();
      if (toastRef.value) {
        toastRef.value.showPopover();
      }
    }
  }
);

const alertColorClass = computed(() => {
  switch (props.status) {
    case "success":
      return "alert-success text-success border-success/20";
    case "error":
      return "alert-error text-error border-error/20";
    case "warning":
      return "alert-warning text-warning border-warning/20";
    case "info":
      return "alert-info text-info border-info/20";
    default:
      return "";
  }
});

const iconClass = computed(() => {
  switch (props.status) {
    case "success":
      return "mdi mdi-check-circle";
    case "error":
      return "mdi mdi-alert-circle";
    case "warning":
      return "mdi mdi-alert";
    case "info":
      return "mdi mdi-information";
    default:
      return "mdi mdi-help-circle";
  }
});
</script>
