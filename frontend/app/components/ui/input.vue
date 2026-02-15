<template>
  <div class="fieldset">
    <legend>{{ label }}</legend>
    <input
      :type="type"
      :class="type === 'file' ? 'file-input w-full' : 'input w-full'"
      v-model="model"
    />
  </div>
</template>

<script setup>
defineProps({
  label: String,
  type: String,
});

const model = defineModel()
</script>
