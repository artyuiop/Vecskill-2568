<template>
    <div class="w-full overflow-auto shadow-sm">
        <table class="table text-center">
            <thead class="bg-base-200">
                <tr>
                    <th v-for="col in cols">{{ col.label }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in rows">
                    <td v-for="col in cols">
                        <slot :name="col.field" :row="row">
                            {{ row[col.field] || '-' }}
                        </slot>
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