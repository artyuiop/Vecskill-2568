<template>
    <div class="flex-between mb-2">
        <label class="input">
            <i class="mdi mdi-magnify"></i>
            <input type="search" class="grow" placeholder="Search" v-model="searchQuery" />
        </label>
        <div class="flex items-center gap-2 text-sm">
            <span class="opacity-60">แสดง</span>
            <select v-model="countPage" class="select select-sm">
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
            </select>
            <span class="opacity-60">รายการ</span>
        </div>
    </div>
    <div class="w-full overflow-auto rounded-[20px] border border-gray-200/30">
        <table class="table table-zebra">
            <thead>
                <tr>
                    <th class="border-b border-r border-gray-200/30 font-normal" v-for="col in cols">
                        <div :class="col.field === 'action' ? 'text-center' : ''">
                            {{ col.label }}
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in filterRow">
                    <td v-for="col in cols" class="border-b border-r border-gray-200/30">
                        <div :class="col.field === 'action' ? 'text-center' : ''">
                            <slot :name="col.field" :row="row">
                                {{ row[col.field] || '-' }}
                            </slot>
                        </div>
                    </td>
                </tr>
                <tr v-if="!rows || rows.length === 0">
                    <td :colspan="cols.length" class="text-center text-gray-400">ไม่มีข้อมูล</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
const props = defineProps({
    cols: Array,
    rows: Array
})

const searchQuery = ref('')

const filterRow = computed(() => {
    if (!props.rows) return []
    if (!searchQuery.value) return props.rows

    const query = searchQuery.value.toLowerCase()

    return props.rows.filter(row => {
        return Object.values(row).some(val =>
            String(val).toLowerCase().includes(query)
        )
    })
})

</script>