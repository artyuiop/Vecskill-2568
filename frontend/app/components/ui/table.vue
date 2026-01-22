<template>
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
                <tr v-for="row in rows">
                    <td v-for="col in cols" class="border-b border-r border-gray-200/30">
                        <div :class="col.field === 'action' ? 'text-center' : ''">
                            <slot :name="col.field" :row="row">
                                {{ row[col.field] || '-' }}
                            </slot>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
defineProps({
    cols: Array,
    rows: Array
})
</script>