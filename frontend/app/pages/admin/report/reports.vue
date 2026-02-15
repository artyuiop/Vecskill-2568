<template>
    <div class="stats stats-vertical md:stats-horizontal shadow w-full mb-2">
        <div class="stat">
            <div class="stat-title">ผู้รับประเมิน</div>
            <div class="stat-value text-[25px]">{{ dataReport.info?.evaluatee_name || 'ยังไม่มีข้อมูล' }}</div>
        </div>
        <div class="stat">
            <div class="stat-title">กรรมการผู้ประเมิน</div>
            <div class="stat-value text-[25px]">{{ dataReport.info?.evaluator_name || 'ยังไม่มีข้อมูล' }}</div>
        </div>
        <div class="stat">
            <div class="stat-title">ความคิดเห็นกรรมการ</div>
            <div class="stat-value text-[25px]">{{ dataReport.info?.comment || 'ยังไม่มีข้อมูล' }}</div>
            <div class="stat-desc">ความคิดเห็นภาพรวมของกรรมการ</div>
        </div>
        <div class="stat">
            <div class="stat-title">คะแนนสุทธิ</div>
            <div class="stat-value text-[25px]">{{ totalScore }}</div>
            <div class="stat-desc">สรุปผลคะแนนสุทธิของ กรรมการประเมิน</div>
        </div>
    </div>
    <UiHeader title="รายงานสรุปผลการประเมินรายบุคคล" description="Individual summary report">
        <div class="flex gap-3 w-full">
            <div class="fieldset w-full md:w-60">
                <legend>เลือกการประเมิน</legend>
                <select class="select" v-model="eval_id">
                    <option v-for="evaltion in evaluation" :value="evaltion.id">
                        {{ evaltion.title }}
                    </option>
                </select>
            </div>
            <div class="fieldset w-full md:w-60">
                <legend>เลือกผู้รับการประเมิน</legend>
                <select class="select" v-model="user_id">
                    <option v-for="evaltee in evaluatee" :value="evaltee.id">
                        {{ evaltee.fname + " " + evaltee.lname }}
                    </option>
                </select>
            </div>
        </div>
    </UiHeader>
    <UiTable :cols="cols" :rows="dataReport.details" :isSearch="false">
        <template #self_score="{ row }">
            <UiBadge color="badge-secondary"
                :title="row.self_score !== null ? Number(row.self_score).toFixed(2) : row.self_bool" />
        </template>
        <template #com_score="{ row }">
            <UiBadge :color="row.com_score !== null ? 'badge-primary' : 'badge-success'"
                :title="row.com_score !== null ? Number(row.com_score).toFixed(2) : (row.com_bool === 'have' ? 'ผ่าน (1.00)' : row.com_bool)" />
        </template>
    </UiTable>

    <div class="flex-end mt-6">
        <div v-if="dataReport.info?.sign_file" class="flex-end flex-col p-7">
            <p>ลงนาม ลายเซ็น โดย {{ dataReport.info?.evaluator_name }}</p>
            <div class="border border-dashed w-70 mt-2 mb-2 text-gray-700"></div>
            <span class="text-4xl text-slate-800 select-none font-sign">
                {{ dataReport.info.sign_file || null }}
            </span>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'main-layout'
})
const store = dataStore()
const evaluatee = computed(() => store.evaluatee)
const evaluation = computed(() => store.evaluation)
const dataReport = ref([])
const eval_id = ref(null)
const user_id = ref(null)

const cols = [
    { field: "name", label: "ตัวชี้วัด" },
    { field: "weight", label: "น้ำหนักคะแนน" },
    { field: "self_score", label: "คะแนนตนเอง(ประเมินตนเอง)" },
    { field: "com_score", label: "คะแนนกรรมการ" },
];

const fetchReport = async () => {
    if (!eval_id.value || !user_id.value) return

    const res = await Fetch(`/api/report/reportByuser/${eval_id.value}/${user_id.value}`)
    dataReport.value = res
    console.log(res)
}

const totalScore = computed(() => {
    if (!dataReport.value.details) return "0.00";
    return dataReport.value.details.reduce((sum, item) => {
        let score = 0;
        if (item.com_score !== null) {
            score = Number(item.com_score);
        } else if (item.com_bool === 'have') {
            score = 1;
        }

        const weight = Number(item.weight || 1);
        return sum + (score * weight);
    }, 0).toFixed(2);
});

watch([eval_id, user_id], () => {
    fetchReport()
})
</script>