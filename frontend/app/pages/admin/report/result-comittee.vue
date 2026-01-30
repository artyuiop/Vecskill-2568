<template>
    <UiHeader title="สรุปผลการประเมินกรรมการ"
        description="แสดงผลสรุปการประเมินรายกรรมการ ประเมินผู้รับการประเมินแต่ละคน">
        <div class="fieldset w-50">
            <legend>เลือกรอบประเมิน</legend>
            <select class="select"></select>
        </div>
    </UiHeader>
    <UiTable :cols="cols" :rows="rows">
        <template #action="{ row }">
            <UiBadge @click="showModal('modal_detail')" title="ดูผล" color="badge-primary" />
        </template>
    </UiTable>

    <UiModal modal_id="modal_detail" title="รายละเอียดการประเมินของ : " size="max-w-3xl">
        <UiTable :cols="cols_detail" :isSearch="false"/>
    </UiModal>
</template>

<script setup>
definePageMeta({
    layout: 'main-layout'
})

const cols = [
    { field: "", label: "ชื่อกรรมการ" },
    { field: "", label: "มอบหมาย(คน)" },
    { field: "", label: "ประเมินเสร็จ" },
    { field: "", label: "สถานะรวม" },
    { field: "action", label: "จัดการ" },
];

const rows = [
    {}
]

const cols_detail = [
    { field: "", label: "ผู้รับการประเมิน" },
    { field: "", label: "สถานะ" },
    { field: "", label: "คะแนนรวมที่ให้"},
];
</script>
