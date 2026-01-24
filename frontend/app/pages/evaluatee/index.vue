<template>
    <!-- Header & เลือกรอบประเมิน & Export Pdf -->
    <UiHeader title="ประเมินตนเอง" description="รอบการประเมิน">
        <div class="flex items-center gap-3">
            <div class="fieldset w-40">
                <legend>เลือกรอบการประเมิน</legend>
                <select class="select" v-model="selectAssignId">
                    <option :value="ass.assign_id" v-for="ass in assignments">
                        {{ ass.title }}
                    </option>
                </select>
            </div>
            <button class="btn btn-primary btn-outline mt-6 shadow-sm">
                <i class="mdi mdi-printer text-lg"></i> Export PDF
            </button>
        </div>
    </UiHeader>

    <!-- ความคืบหน้า -->
    <UiCard class="mt-2 p-3">
        <label class="text-lg">ความคืบหน้า รอบประเมิน</label>
        <span class="progress progress-primary"></span>
    </UiCard>

    <!-- ตารางตัวชี้วัด -->
    <UiTable class="mt-4" :cols="cols" :rows="indic">
        <template #action="{ row }">
            <UiBadge icon="mdi mdi-pencil" color="badge-primary" @click="openModal(row)" />
        </template>
    </UiTable>

    <UiModal modal_id="modal_self" size="max-w-4xl" :title="'ตัวชี้วัด ' + selectModalIndic?.name">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">

            <div class="space-y-4 border-r pr-6 border-slate-200">
                <UiBadge icon="mdi mdi-account" title="ส่วนผู้รับการประเมิน" color="badge-neutral"/>
                <div class="fieldset">
                    <legend>คะแนนที่ประเมินตนเอง</legend>
                    <select class="select w-full" v-if="selectModalIndic?.type === 'score'">
                        <option value="">เลือกคะแนน</option>
                        <option></option>
                    </select>
                    <select class="select w-full" v-if="selectModalIndic?.type === 'boolean'">
                        <option value="มี">มี</option>
                        <option value="ไม่มี">ไม่มี</option>
                    </select>
                </div>
                
                <UiInput type="file" label="อัพโหลดหลักฐานเอกสาร" />
                
                <div class="fieldset">
                    <legend>คำอธิบายเพิ่มเติม/หมายเหตุ</legend>
                    <textarea class="textarea textarea-bordered w-full h-24" placeholder="ระบุรายละเอียด..."></textarea>
                </div>
            </div>
            
            <div class="space-y-4">
                <UiBadge icon="mdi mdi-account" title="ส่วนสำหรับกรรมการ" color="badge-primary"/>
                
                <UiCard class="px-2">
                    <h1 class="text-primary"><i class="mdi mdi-comment"></i> ความคิดเห็นกรรมการ</h1>
                    <div class="chat chat-start">
                        <div class="chat-bubble">You underestimate my power!</div>
                    </div>
                </UiCard>
            </div>
        </div>

        <div class="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button class="btn btn-ghost" @click="CloseModal('modal_self')">ยกเลิก</button>
            <button class="btn btn-primary px-8" @click="handleSubmit">บันทึกการประเมิน</button>
        </div>
    </UiModal>
</template>

<script setup>
definePageMeta({
    layout: "main-layout",
});
const store = dataStore();

const assignments = computed(() => store.assignments);
const indic = ref([]);
const selectAssignId = ref(null);
const selectModalIndic = ref(null);
const cols = [
    { field: "name", label: "ชื่อตัวชี้วัด" },
    { field: "", label: "สถานะ" },
    { field: "action", label: "จัดการ" },
];

const fetchIndic = async (assignId) => {
    if (!assignId) return;

    const job = assignments.value.find((a) => a.assign_id === assignId);
    if (job) {
        const res = await Fetch(`/api/indicators/${job.eval_id}`);
        indic.value = res;
    }
};

const openModal = (row) => {
    showModal("modal_self");
    selectModalIndic.value = row;
};

onMounted(async () => {
    if (store.assignments.length === 0) {
        await store.fetchAllData(true);
    }
    if (assignments.value.length > 0) {
        selectAssignId.value = assignments.value[0].assign_id;
    }
});

watch(selectAssignId, (newId) => {
    fetchIndic(newId);
});
</script>
