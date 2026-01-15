<template>
  <button class="btn btn-sm" :class="'btn-' + color">
    {{ title }}
  </button>
</template>

<script setup>
defineProps({
  title: String,
  color: String,
});
</script>
