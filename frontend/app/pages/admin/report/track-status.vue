<template>
    <UiHeader title="ติดตามสถานะการประเมิน" description="ตรวจสอบความคืบหน้า" />

    <div class="space-x-2 mb-3">
        <UiBadge class="cursor-pointer" @click="mode = 'evaluator'" title="กรรมการผู้ประเมิน"
            :color="mode === 'evaluator' ? 'badge-secondary' : 'badge-ghost'" />
        <UiBadge class="cursor-pointer" @click="mode = 'evaluatee'" title="ผู้รับประเมิน"
            :color="mode === 'evaluatee' ? 'badge-primary' : 'badge-ghost'" />
    </div>

    <UiTable :rows="data_evaluator" :cols="cols_evaluator" v-if="mode === 'evaluator'" :isSearch="false">
    </UiTable>

    <UiTable :rows="data_evaluatee" :cols="cols_evaluatee" v-if="mode === 'evaluatee'" :isSearch="false">
    </UiTable>
</template>

<script setup>
definePageMeta({
    layout: "main-layout",
});

const store = dataStore()
const assign = computed(() => store.assignments)
const mode = ref('evaluator')

const cols_evaluator = [
    { field: "title", label: "รอบการประเมิน" },
    { field: "fullName", label: "ชื่อกรรมการ" },
    // { field: "progress", label: "ความคืบหน้า" },
    { field: "status", label: "สถานะ" },
];

const cols_evaluatee = [
    { field: "title", label: "รอบการประเมิน" },
    { field: "fullName", label: "ผู้รับการประเมิน" },
    // { field: "progress", label: "ความคืบหน้า" },
    { field: "status", label: "สถานะรวม" },
];

const data_evaluator = ref([])
const data_evaluatee = ref([])

const fetchTrackStatus = async () => {
    data_evaluator.value = []
    data_evaluatee.value = []


    for (const ass of assign.value) {
        if (mode.value === 'evaluator') {
            const res = await Fetch(`/api/assessments/track-status/${ass.eval_id}/committee`)
            const data = res.rows.map(item => ({ ...item, title: ass.title, progress: res.Progress }))
            data_evaluator.value = [...data_evaluator.value, ...data]
        } else if (mode.value === 'evaluatee') {
            const res = await Fetch(`/api/assessments/track-status/${ass.eval_id}/self`)
            const data = res.rows.map(item => ({ ...item, title: ass.title, progress: res.Progress }))
            data_evaluatee.value = [...data_evaluatee.value, ...data]
        }
    }
}

watch(mode, () => {
    fetchTrackStatus()
})

onMounted(async () => {
    fetchTrackStatus()
})
</script>