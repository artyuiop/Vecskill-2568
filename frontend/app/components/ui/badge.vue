<template>
  <button class="badge" :class="'badge-' + color + ' ' + 'badge-' + type">
    {{ title }}
  </button>
</template>

<script setup>
defineProps({
  title: String,
  color: String,
  type: String,
});
</script>
