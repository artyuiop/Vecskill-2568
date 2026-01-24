<template>
    <UiHeader title="จัดการหัวข้อการประเมิน" description="manage evaluation">
        <UiButton title="เพิ่มข้อมูล" color="btn-primary btn-soft" @click="openModal('create')" />
    </UiHeader>
    <UiTable :cols="cols" :rows="data_evaluation">
        <template #action="{ row }">
            <div class="space-x-2">
                <UiBadge icon="mdi mdi-account-edit" title="แก้ไข" color="badge-warning"
                    @click="openModal('edit', row)" />
                <UiBadge icon="mdi mdi-delete" title="ลบ" color="badge-error" @click="Delete(endpoint, row.id)" />
            </div>
        </template>
    </UiTable>

    <UiModal modal_id="modal_evaluation" :title="mode === 'create' ? 'เพิ่มข้อมูล' : 'แก้ไขข้อมูล'">
        <UiInput label="ชื่อรอบประเมิน" type="text" v-model="formRef.title" />
        <div class="grid grid-cols-2 gap-5">
            <UiInput label="วันเริ่มประเมิน" type="date" v-model="formRef.start_date" />
            <UiInput label="สิ้นสุดวันประเมิน" type="date" v-model="formRef.end_date" />
        </div>
        <div class="flex justify-end gap-2 mt-3">
            <button class="btn" @click="CloseModal('modal_evaluation')">ยกเลิก</button>
            <button class="btn btn-primary" @click="handleSubmit">ตกลง</button>
        </div>
    </UiModal>

</template>

<script setup>
definePageMeta({
    layout: 'main-layout'
})
const store = dataStore();
const endpoint = '/api/evaluations'

const cols = [
    { field: "title", label: "ชื่อรอบประเมิน" },
    { field: "start_date", label: "วันเริ่มประเมิน" },
    { field: "end_date", label: "สิ้นสุดวันประเมิน" },
    { field: "action", label: "จัดการ" },
];

// state
const mode = ref('create') // ตัวแปรคุมโหมด create & update
const formRef = ref({
    id: null,
    title: "",
    start_date: "",
    end_date: "",
})

const openModal = (type, row = null) => {
    mode.value = type

    if (type === 'create') {
        resetForm(formRef.value)
        formRef.value.role = "evaluation"
    } else {
        formRef.value = { ...row }
    }

    showModal('modal_evaluation')
}

const handleSubmit = async () => {
    if (mode.value === 'create') {
        await Insert(endpoint, formRef.value)
    } else {
        await Update(`${endpoint}/${formRef.value.id}`, formRef.value)
    }
    await store.fetchAllData(true)
    CloseModal('modal_evaluation')
}

// โหลด ข้อมูล evaluation
const data_evaluation = computed(() => store.evaluation)
</script>