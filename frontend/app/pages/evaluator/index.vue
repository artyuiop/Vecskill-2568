<template>
    <div>
        <UiHeader title="การประเมินผู้รับประเมิน" description="เลือกรายชื่อผู้รับการประเมิน"></UiHeader>
        <UiTable :cols="cols" :rows="assign">
            <template #action="{ row }">
                <NuxtLink 
                    :to="{
                        path: `/evaluator/${row.assign_id}`,
                        query: {
                            name: row.evaluatee_name,
                            evaluatee_id: row.evaluatee_id,
                            title: row.title,
                        }
                    }"
                >
                    <UiBadge title="ประเมิน" icon="mdi mdi-arrow-right" color="badge-primary" />
                </NuxtLink>
            </template>
        </UiTable>
    </div>
</template>

<script setup>
definePageMeta({
    layout: "main-layout",
});
const store = dataStore();
const assign = computed(() => store.assignments);
console.log(assign.value);

const cols = [
    { field: "title", label: "รอบประเมิน" },
    { field: "evaluatee_name", label: "ชื่อ-สกุล" },
    { field: "status", label: "สถานะ" },
    { field: "action", label: "จัดการ" },
];
</script>