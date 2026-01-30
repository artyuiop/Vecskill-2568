<template>
    <div class="stats shadow w-full mb-2">
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
    </div>
    <UiHeader title="รายงานสรุปผลการประเมินรายบุคคล" description="Individual summary report">
        <div class="flex gap-3">
            <div class="fieldset w-50">
                <legend>เลือกการประเมิน</legend>
                <select class="select" v-model="eval_id">
                    <option v-for="evaltion in evaluation" :value="evaltion.id">
                        {{ evaltion.title }}
                    </option>
                </select>
            </div>
            <div class="fieldset w-50">
                <legend>เลือกผู้รับการประเมิน</legend>
                <select class="select" v-model="user_id">
                    <option v-for="evaltee in evaluatee" :value="evaltee.id">
                        {{ evaltee.fname + " " + evaltee.lname }}
                    </option>
                </select>
            </div>
        </div>
    </UiHeader>
    <UiTable :cols="cols" :rows="dataReport.details" :isSearch="false" />
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
    { field: "self_score", label: "คะแนนตนเอง" },
    { field: "committee_score", label: "คะแนนกรรมการ" },
    { field: "", label: "คะแนนสุทธิ" },
];

const fetchReport = async () => {
    if (!eval_id.value || !user_id.value) return

    const res = await Fetch(`/api/report/reportByuser/${eval_id.value}/${user_id.value}`)
    dataReport.value = res
    console.log(res)
}

watch([eval_id, user_id], () => {
    fetchReport()
})
</script>