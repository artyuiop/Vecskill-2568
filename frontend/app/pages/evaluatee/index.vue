<template>
    <!-- Header & เลือกรอบประเมิน & Export Pdf -->
    <UiHeader title="ประเมินตนเอง" :description="'รอบการประเมิน ' + selectAssignName">
        <div class="flex flex-col md:flex-row md:items-end gap-3 w-full md:w-auto">
            <div class="fieldset w-full md:w-47">
                <legend>เลือกรอบการประเมิน</legend>
                <select class="select -mb-1" v-model="selectAssignId">
                    <option :value="ass.assign_id" v-for="ass in assignments">
                        {{ ass.title }}
                    </option>
                </select>
            </div>
            <div class="flex w-full md:w-auto gap-3">
                <button class="btn btn-secondary btn-outline flex-1 shadow-sm" @click="openModalComment">
                    <i class="mdi mdi-comment text-lg"></i>
                    <span class="hidden md:block truncate">ดูความคิดเห็นกรรมการ</span>
                </button>
                <button class="btn btn-primary btn-outline flex-1 shadow-sm" @click="handleExportPdf">
                    <i class="mdi mdi-printer text-lg"></i>
                    <span class="hidden md:block">Export PDF</span>
                </button>
            </div>
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
            <div class="space-x-2">
                <UiBadge icon="mdi mdi-delete" color="badge-error" @click="Delete('/api/indicators/')" />
                <UiBadge icon="mdi mdi-pencil" color="badge-primary" @click="openModal(row)" />
            </div>
        </template>
        <template #status="{ row }">
            <UiBadge :class="row.status === null ? 'badge-error' : 'badge-primary'"
                :title="row.status === 'completed' ? 'ดำเนินการสำเร็จ' : 'ยังไม่เริ่มประเมิน'" />
        </template>
    </UiTable>

    <UiModal modal_id="modal_comment" :title="'ดูความคิดเห็นกรรมการ ' + selectAssignName">
        <h1>ความคิดเห็นกรรมการ</h1>
        <UiBadge color="badge-primary" :title="evaluator_comment?.[0]?.comment" />
    </UiModal>

    <!-- Modal - ประเมินตนเอง และ แนบหลักฐาน -->
    <UiModal modal_id="modal_self" size="max-w-4xl" :title="'ตัวชี้วัด ' + selectModalIndic?.name">
        <div class="gap-6 mt-5">
            <div class="space-y-4 pr-6">
                <!-- เลือกคะแนน -->
                <div class="fieldset">
                    <legend>คะแนนที่ประเมินตนเอง</legend>
                    <select v-model="form_score.score" class="select w-full" v-if="selectModalIndic?.type === 'score'">
                        <option v-for="level in selectModalIndic?.level" :value="level.level">
                            {{ level.level }} {{ level.description || level.descripton }}
                        </option>
                    </select>
                    <select v-model="form_score.hasIt" class="select w-full"
                        v-if="selectModalIndic?.type === 'boolean'">
                        <option value="have">มี</option>
                        <option value="not_have">ไม่มี</option>
                    </select>
                </div>

                <!-- อัพโหลดหลักฐาน -->
                <div v-if="
                    selectModalIndic?.type_file === 'image' ||
                    selectModalIndic?.type_file === 'pdf'
                ">
                    <UiInput type="file" label="อัพโหลดหลักฐานเอกสาร (รูปภาพ, ไฟล์pdf)" @change="handleFileChange" />
                </div>
                <div v-else>
                    <UiInput label="อัพโหลดหลักฐาน URL" v-model="form_upload.file_url" />
                </div>

                <!-- คำอธิบายหลักฐาน -->
                <div class="fieldset">
                    <legend>คำอธิบายเพิ่มเติม/หมายเหตุ</legend>
                    <textarea v-model="form_upload.description" class="textarea textarea-bordered w-full h-24"
                        placeholder="ระบุรายละเอียด..."></textarea>
                </div>
            </div>
        </div>

        <div class="mt-8 flex justify-end gap-3 pt-4">
            <button class="btn btn-neutral btn-soft" @click="CloseModal('modal_self')">
                ยกเลิก
            </button>
            <button class="btn btn-primary px-8" @click="handleSubmit">
                บันทึกการประเมิน
            </button>
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
const progress = ref({ progress: "", status: "" });
const selectAssignId = ref(null);
const selectModalIndic = ref(null);
const cols = [
    { field: "name", label: "ชื่อตัวชี้วัด" },
    { field: "status", label: "สถานะ" },
    { field: "action", label: "จัดการ" },
];

// ดึงข้อมูล indicator
const fetchIndic = async (assignId) => {
    if (!assignId) return;

    const job = assignments.value.find((a) => a.assign_id === assignId);
    if (job) {
        const res = await Fetch(
            `/api/assessments/getIndicatorProgress/${job.assign_id}`,
        );
        console.log(res)
        progress.value = {
            progress: res.Progress,
            status: res.status,
        };
        indic.value = res.indicators;
    }
};

// Modal ประเมินตนเอง
const openModal = (row) => {
    showModal("modal_self");
    selectModalIndic.value = row;
};

// Modal ความคิดเห็นกรรมการ
const evaluator_comment = ref()
const openModalComment = async () => {
    showModal("modal_comment");
    const res = await Fetch(`/api/assessments/get-comment/${selectAssignId.value}`)
    evaluator_comment.value = res
};

// function หาชื่อรอบประเมินตามที่เลือก
const selectAssignName = computed(() => {
    const current = assignments.value?.find(
        (a) => a.assign_id === selectAssignId.value,
    );
    return current ? current.title : "ไม่มีรอบประเมิน";
});

// คำนวณ progress
const progressPercent = computed(() => {
    if (!progress.value.progress) return 0;
    const [current, total] = progress.value.progress.split(" / ").map(Number);
    return total > 0 ? (current / total) * 100 : 0;
});

// State ประเมินตนเอง & อัพโหลด
const form_score = ref({
    indic_id: null,
    score: "",
    hasIt: "",
});

const form_upload = ref({
    file_url: "",
    file: null,
    description: "",
});

// ประเมินตนเอง
const handleSubmit = async () => {
    const indicId = selectModalIndic.value.id;
    const type_file = selectModalIndic.value.type_file;
    const formdata = new FormData();
    const assignId = selectAssignId.value;
    form_score.value.indic_id = indicId;
    formdata.append("description", form_upload.value.description);

    if (!form_score.value.score && !form_score.value.hasIt) {
        return showAlert('กรุณาระบุคะแนน', "error")
    }

    if (type_file === "url" && !form_upload.value.file_url) {
        return showAlert('กรุณากรอกลิ้งค์ URL หลักฐาน', "error")
    }

    if ((type_file === "image" || type_file === "pdf") && !form_upload.value.file) {
        return showAlert('กรุณาแนบไฟล์หลักฐาน', "error")
    }

    await api.post(`/api/assessments/give-score/${assignId}`, form_score.value)
    if (type_file === "url") {
        formdata.append("file_url", form_upload.value.file_url);
    } else {
        if (form_upload.value.file) {
            formdata.append("file", form_upload.value.file);
        }
    }

    const res = await Insert(`/api/indicators/evidence/${indicId}`, formdata);
    fetchIndic(assignId)
    CloseModal('modal_self')
}

const handleFileChange = async (e) => {
    form_upload.value.file = e.target.files[0];
};

// Export PDF
const handleExportPdf = async () => {
    const currentAssign = assignments.value.find(a => a.assign_id === selectAssignId.value)
    const eval_id = currentAssign.eval_id
    console.log(eval_id)

    const res = await api.get(`/api/report/export-pdf/${eval_id}`, {
        responseType: 'blob'
    })
    console.log(res)
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    window.open(url, '_blank')
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