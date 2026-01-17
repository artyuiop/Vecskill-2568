<template>
    <button @click="openModal('create')">add</button>
    <UiTable :cols="cols" :rows="data_users">
        <template #action="{ row }">
            <div class="space-x-2">
                <UiButton title="แก้ไข" color="btn-warning" @click="openModal('edit', row)" />
                <UiButton title="ลบ" color="btn-error" @click="Delete('/api/')" />
            </div>
        </template>
    </UiTable>

    <UiModal modal_id="modal_evaluator" :title="mode === 'create' ? 'เพิ่มข้อมูล': 'แก้ไขข้อมูล'">
        <div class="grid grid-cols-2 gap-5">
            <UiInput label="ชื่อ" type="text" v-model="formRef.fname" />
            <UiInput label="นามสกุล" type="text" v-model="formRef.lname" />
            <UiInput label="ชื่อผู้ใช้งาน" type="text" v-model="formRef.username" />
            <UiInput label="รหัสผ่าน" type="password" v-model="formRef.password" />
        </div>
        <div class="flex justify-end gap-2 mt-3">
            <button class="btn" @click="CloseModal('modal_evaluator')">ยกเลิก</button>
            <button class="btn btn-primary" @click="handleSubmit">ตกลง</button>
        </div>
    </UiModal>
    
</template>

<script setup>
definePageMeta({
    layout: 'main-layout'
})
const store = dataStore();
const endpoint = '/api/users'

const cols = [
    { field: "id", label: "ลำดับ" },
    { field: "fname", label: "ชื่อ" },
    { field: "lname", label: "นามสกุล" },
    { field: "username", label: "ชื่อผู้ใช้งาน" },
    { field: "action", label: "จัดการ" },
];

// state
const mode = ref('create') // ตัวแปรคุมโหมด create & update
const formRef = ref({
    id: null,
    fname: "",
    lname: "",
    username: "",
    password: "",
    role: "evaluator"
})

const openModal = (type, row = null) => {
    mode.value = type

    if(type === 'create'){
        resetForm(formRef.value)
        formRef.value.role = "evaluator"
    }else{
        formRef.value = { ...row }
    }

    showModal('modal_evaluator')
}

const handleSubmit = async () => {
    if(mode.value === 'create') {
        await Insert(endpoint, formRef.value)
    }else{
        await Update(`${endpoint}/${formRef.value.id}`, formRef.value)
    }
    // console.log(formRef.value)

    await store.fetchAllData(true)
    CloseModal('modal_evaluator')
}

// โหลด ข้อมูล evaluator
const data_users = computed(() => store.evaluator)
</script>