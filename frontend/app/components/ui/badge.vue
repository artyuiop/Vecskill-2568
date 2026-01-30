<template>
  <button class="badge badge-soft hover:-translate-y-1 hover:cursor-pointer duration-200" :class="color">
    <i v-if="icon" :class="icon"></i>
    <span class="truncate">
      {{ title }}
    </span>
  </button>
</template>

<script setup>
defineProps({
  title: String,
  color: String,
  icon: String
});
</script>
