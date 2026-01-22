<template>
  <button class="badge badge-soft" :class="color">
    <i :class="icon"></i>
    {{ title }}
  </button>
</template>

<script setup>
defineProps({
  title: String,
  color: String,
  icon: String
});
</script>
