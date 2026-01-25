<template>
    <!-- Header & เลือกรอบประเมิน & Export Pdf -->
    <UiHeader title="ประเมินตนเอง" :description="'รอบการประเมิน ' + selectAssignName">
        <div class="flex items-center gap-3">
            <div class="fieldset w-40">
                <legend>เลือกรอบการประเมิน</legend>
                <select class="select" v-model="selectAssignId">
                    <option :value="ass.assign_id" v-for="ass in assignments">
                        {{ ass.title }}
                    </option>
                </select>
            </div>
            <button class="btn btn-secondary btn-outline mt-6 shadow-sm" @click="openModalComment">
                <i class="mdi mdi-comment text-lg"></i> ดูความคิดเห็นกรรมการ
            </button>
            <button class="btn btn-primary btn-outline mt-6 shadow-sm">
                <i class="mdi mdi-printer text-lg"></i> Export PDF
            </button>
        </div>
    </UiHeader>

    <!-- ความคืบหน้า -->
    <UiCard class="mt-2 mb-4 p-3">
        <div class="flex-between">
            <label class="text-lg">ความคืบหน้า รอบประเมิน {{ selectAssignName }}</label>
            <span>{{ progress.progress }}</span>
        </div>
        <progress class="progress progress-primary" :value="progressPercent" max="100"></progress>
    </UiCard>

    <!-- ตารางตัวชี้วัด -->
    <UiTable class="mt-4" :cols="cols" :rows="indic">
        <template #action="{ row }">
            <UiBadge icon="mdi mdi-pencil" color="badge-primary" @click="openModal(row)" />
        </template>
        <template #status="{ row }">
            <UiBadge :class="row.status === null ? 'badge-error' : 'badge-primary'"
                :title="row.status || 'ยังไม่เริ่มประเมิน'" />
        </template>
    </UiTable>

    <UiModal modal_id="modal_comment" :title="'ดูความคิดเห็นกรรมการ รอบ'">
        {{ selectAssignName }}
    </UiModal>

    <!-- Modal - ประเมินตนเอง และ แนบหลักฐาน -->
    <UiModal modal_id="modal_self" size="max-w-4xl" :title="'ตัวชี้วัด ' + selectModalIndic?.name">
        <div class="gap-6 mt-5">
            <div class="space-y-4 border-r pr-6 border-slate-200">
                <div class="fieldset">
                    <legend>คะแนนที่ประเมินตนเอง</legend>
                    <select class="select w-full" v-if="selectModalIndic?.type === 'score'">
                        <option disabled="">เลือกคะแนน</option>
                        <option v-for="level in selectModalIndic?.level" :value="level.id">
                           {{ level.level }} {{ level.description || level.descripton }}
                        </option>
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

// -- state --
const assignments = computed(() => store.assignments);
const indic = ref([]);
const progress = ref({ progress: '', status: '' })
const selectAssignId = ref(null);
const selectModalIndic = ref(null);
const cols = [
    { field: "name", label: "ชื่อตัวชี้วัด" },
    { field: "status", label: "สถานะ" },
    { field: "action", label: "จัดการ" },
];

const fetchIndic = async (assignId) => {
    if (!assignId) return;

    const job = assignments.value.find((a) => a.assign_id === assignId);
    if (job) {
        const res = await Fetch(`/api/assessments/getIndicatorProgress/${job.assign_id}`)
        progress.value = {
            progress: res.Progress,
            status: res.status
        }
        indic.value = res.indicators;
    }
};

// Modal ประเมินตนเอง
const openModal = (row) => {
    showModal("modal_self");
    selectModalIndic.value = row;
};

// Modal ความคิดเห็นกรรมการ
const openModalComment = () => {
    showModal('modal_comment')
}

// function หาชื่อรอบประเมินตามที่เลือก
const selectAssignName = computed(() => {
    const current = assignments.value.find(a => a.assign_id === selectAssignId.value)
    return current ? current.title : 'ไม่มีรอบประเมิน'
})

// คำนวณ progress
const progressPercent = computed(() => {
    if (!progress.value.progress) return 0;
    const [current, total] = progress.value.progress.split(' / ').map(Number);
    return total > 0 ? (current / total) * 100 : 0;
});

const handleSubmit = async() => {
    const res = await Insert('');
    console.log(res)
}

watch(selectAssignId, (newId) => {
    fetchIndic(newId);
});

onMounted(async () => {
    if (store.assignments.length === 0) {
        await store.fetchAllData(true);
    }
    if (assignments.value.length > 0) {
        selectAssignId.value = assignments.value[0].assign_id;
    }
});
</script>