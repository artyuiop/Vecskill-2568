<template>
    <dialog class="modal backdrop-blur-[10px]" :id="modal_id">
        <div class="modal-box">
            <div class="flex justify-between items-center">
                <span></span>
                <button>
                    <i class="mdi mdi-close" @click="CloseModal(modal_id)"></i>
                </button>
            </div>
        </div>
    </dialog>
</template>

<script setup>
defineProps({
    modal_id: String
})
</script>