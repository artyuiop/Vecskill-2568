<template>
    <UiHeader title="สรุปผลการประเมินกรรมการ"
        description="แสดงผลสรุปการประเมินรายกรรมการ ประเมินผู้รับการประเมินแต่ละคน">
        <div class="fieldset w-50">
            <legend>เลือกรอบประเมิน</legend>
            <select class="select" v-model="eval_id">
                <option v-for="evaluation in data_evaluation" :value="evaluation.id">
                    {{ evaluation.title }}
                </option>
            </select>
        </div>
    </UiHeader>
    <UiTable :cols="cols" :rows="sumary_assign">
        <template #action="{ row }">
            <UiBadge @click="openModal(eval_id, row.evaluator_id)" title="ดูผล" color="badge-primary" />
        </template>
        <template #completed="{ row }">
            {{ row.completed }}
        </template>
    </UiTable>

    <UiModal modal_id="modal_detail" title="รายละเอียดการประเมินของ : " size="max-w-3xl">
        <UiTable :cols="cols_detail" :rows="sumary_assignDetail" :isSearch="false" />
    </UiModal>
</template>

<script setup>
definePageMeta({
    layout: "main-layout",
});

const store = dataStore();

// state
const data_evaluation = computed(() => store.evaluation);
const eval_id = ref(null);
const sumary_assign = ref([]);
const sumary_assignDetail = ref([]);

const fetchSummaryAssign = async () => {
    if (!eval_id.value) return;
    const res = await Fetch(`/api/report/summary-assign/${eval_id.value}`);
    sumary_assign.value = res;
};

const openModal = async(eval_id, evaluator_id) => {
    console.log(eval_id, evaluator_id)
    const res = await Fetch(`/api/report/detail-score/${eval_id}/${evaluator_id}`)
    sumary_assignDetail.value = res
    console.log(res)
    showModal('modal_detail')
}

onMounted(() => fetchSummaryAssign());
watch(eval_id, () => {
    fetchSummaryAssign();
});

const cols = [
    { field: "evaluator_name", label: "ชื่อกรรมการ" },
    { field: "assigned", label: "มอบหมาย(คน)" },
    { field: "completed", label: "ประเมินเสร็จ" },
    { field: "status", label: "สถานะรวม" },
    { field: "action", label: "จัดการ" },
];

const cols_detail = [
    { field: "evaluatee_name", label: "ผู้รับการประเมิน" },
    { field: "status", label: "สถานะ" },
    { field: "total_score", label: "คะแนนรวมที่ให้" },
];
</script>
