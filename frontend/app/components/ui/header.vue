<template>
    <div class="flex-between  p-2 rounded-[10px]">
        <div>
            <h1 class="text-xl">{{ title }}</h1>
            <p class="text-xs text-gray-600">{{ description }}</p>
        </div>
        <div>
            <slot></slot>
        </div>
    </div>
    <div class="mt-2 mb-3"></div>
</template>

<script setup>
defineProps({
    title: String,
    description: String,
})
</script>
