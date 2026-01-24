<template>
    <UiHeader title="จัดการกรรมการผู้ประเมิน" description="manage evaluator">
        <UiButton title="เพิ่มข้อมูล" color="btn-primary btn-soft" @click="openModal('create')" />
    </UiHeader>

    <UiTable :cols="cols" :rows="data_users">
        <template #action="{ row }">
            <div class="space-x-2">
                <UiBadge icon="mdi mdi-account-edit" title="แก้ไข" color="badge-warning"
                    @click="openModal('edit', row)" />
                <UiBadge icon="mdi mdi-delete" title="ลบ" color="badge-error" @click="Delete(endpoint, row.id)" />
            </div>
        </template>
        <template #role="{ row }">
            <UiBadge color="badge-primary" icon="mdi mdi-account" title="กรรมการผู้ประเมิน" />
        </template>
        <template #fullname="{ row }">
            <div class="flex items-center gap-3">
                <div class="avatar avatar-online avatar-placeholder">
                    <div class="w-9 rounded-[10px] bg-neutral text-neutral-content uppercase">
                        {{ row.username[0] }}
                    </div>
                </div>
                <div>
                    <div class="font-bold">{{ row.fname + ' ' + row.lname }}</div>
                    <div class="text-sm opacity-50">{{ row.username }}</div>
                </div>
            </div>
        </template>
    </UiTable>

    <UiModal modal_id="modal_evaluator" :title="mode === 'create' ? 'เพิ่มข้อมูล' : 'แก้ไขข้อมูล'">
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
    { field: "fullname", label: "ชื่อ-นามสกุล" },
    { field: "role", label: "ตำแหน่ง" },
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

    if (type === 'create') {
        resetForm(formRef.value)
        formRef.value.role = "evaluator"
    } else {
        formRef.value = { ...row }
    }

    showModal('modal_evaluator')
}

const handleSubmit = async () => {
    if (mode.value === 'create') {
        await Insert(endpoint, formRef.value)
    } else {
        await Update(`${endpoint}/${formRef.value.id}`, formRef.value)
    }
    // console.log(formRef.value)

    await store.fetchAllData(true)
    CloseModal('modal_evaluator')
}

// โหลด ข้อมูล evaluator
const data_users = computed(() => store.evaluator)
</script>