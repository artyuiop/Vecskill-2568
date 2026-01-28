<template>
  <button class="btn btn-sm" :class="color">
    {{ title }}
  </button>
</template>

<script setup>
defineProps({
  title: String,
  color: String,
});
</script>
