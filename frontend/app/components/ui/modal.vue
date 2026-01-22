<template>
    <dialog class="modal backdrop-blur-[10px]" :id="modal_id">
        <div class="modal-box" :class="size">
            <div class="flex justify-between items-center">
                <span class="font-bold">{{ title }}</span>
                <button>
                    <i class="mdi mdi-close" @click="CloseModal(modal_id)"></i>
                </button>
            </div>

            <hr class="mt-2 mb-2 border-dashed text-gray-300">

            <div>
                <slot></slot>
            </div>
        </div>
    </dialog>
</template>

<script setup>
defineProps({
    title: String,
    modal_id: String,
    size: String
})
</script>