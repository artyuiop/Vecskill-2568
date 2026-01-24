<template>
    <UiHeader title="มอบหมายการประเมิน" description="Assign assessment">
        <UiButton title="เพิ่มข้อมูล" color="btn-primary" @click="openModal('create')" />
    </UiHeader>
    <UiTable :cols="cols" :rows="assignments">
        <template #action="{ row }">
            <div class="space-x-2">
                <UiBadge icon="mdi mdi-account-edit" title="แก้ไข" color="badge-warning"
                    @click="openModal('edit', row)" />
                <UiBadge icon="mdi mdi-delete" title="ลบ" color="badge-error" @click="Delete(endpoint, row.assign_id)" />
            </div>
        </template>
    </UiTable>

    <UiModal modal_id="modal_assignment" :title="mode === 'create' ? 'เพิ่มข้อมูล' : 'แก้ไขข้อมูล'">
        <div class="grid grid-cols-2 gap-5">
            <div class="fieldset">
                <legend>เลือกหัวข้อการมอบหมาย</legend>
                <select class="select w-full" v-model="formRef.eval_id">
                    <option v-for="evaltion in evaluation" :value="evaltion.id">
                        {{ evaltion.title }}
                    </option>
                </select>
            </div>
            <div class="fieldset">
                <legend>เลือกผู้ถูกประเมิน</legend>
                <select class="select w-full" v-model="formRef.evaluatee_id">
                    <option v-for="evaltee in evaluatee" :value="evaltee.id">
                        {{ evaltee.fname + " " + evaltee.lname }}
                    </option>
                </select>
            </div>
            <div class="fieldset">
                <legend>เลือกกรรมการ</legend>
                <select class="select w-full" v-model="formRef.evaluator_id">
                    <option v-for="evaltor in evaluator" :value="evaltor.id">
                        {{ evaltor.fname + " " + evaltor.lname }}
                    </option>
                </select>
            </div>
            <div class="fieldset">
                <legend>เลือกตำแหน่งมอบหมาย</legend>
                <select class="select w-full" v-model="formRef.position">
                    <option value="ประธาน">ประธาน</option>
                    <option value="กรรมการ">กรรมการ</option>
                </select>
            </div>
        </div>
        <div class="mt-3 flex justify-end gap-3">
            <button class="btn" @click="CloseModal('modal_assignment')">
                ยกเลิก
            </button>
            <button class="btn btn-primary" @click="handleSubmit">มอบหมาย</button>
        </div>
    </UiModal>
</template>

<script setup>
definePageMeta({
    layout: "main-layout",
});
const store = dataStore();
const evaluatee = computed(() => store.evaluatee);
const evaluator = computed(() => store.evaluator);
const evaluation = computed(() => store.evaluation);
const assignments = computed(() => store.assignments);
const endpoint = "/api/assignments";

const cols = [
    { field: "title", label: "หัวข้อประเมิน" },
    { field: "evaluator_name", label: "กรรมการ" },
    { field: "evaluatee_name", label: "ผู้รับประเมิน" },
    { field: "position", label: "ตำแหน่ง" },
    { field: "action", label: "จัดการ" },
];


// state
const mode = ref("create"); // ตัวแปรคุมโหมด create & update
const formRef = ref({
    id: null,
    eval_id: "",
    evaluatee_id: "",
    evaluator_id: "",
    position: "",
});

const openModal = (type, row = null) => {
    mode.value = type;

    if (type === "create") {
        resetForm(formRef.value);
    } else {
        formRef.value = { ...row };
        formRef.value.id = row.assign_id
    }

    showModal("modal_assignment");
};

const handleSubmit = async () => {
    if (mode.value === "create") {
        const res = await Insert(endpoint, formRef.value);
        console.log(res)
    } else {
        await Update(`${endpoint}/${formRef.value.id}`, formRef.value);
    }
    await store.fetchAllData(true);
    CloseModal("modal_assignment");
};

</script>
