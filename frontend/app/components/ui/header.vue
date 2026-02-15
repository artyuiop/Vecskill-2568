<template>
    <div class="flex flex-col gap-4 p-4 rounded-[10px] shadow-sm border border-slate-100 bg-white">
        <div class="border-b border-slate-100 pb-2">
            <h1 class="text-xl font-bold text-primary">{{ title }}</h1>
            <p class="text-xs text-gray-500">{{ description }}</p>
        </div>

        <div class="w-full">
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