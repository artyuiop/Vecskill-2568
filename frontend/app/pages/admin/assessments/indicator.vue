<template>
    <div>
        <h1>indicator</h1>
        <UiButton title="test modal" color="btn-primary" @click="showModal('modal_indicator')" />
    </div>

    <UiModal title="เพิ่มตัวชี้วัด" modal_id="modal_indicator" size="max-w-3xl">
        <div class="grid grid-cols-2 gap-4">
            <UiInput label="ชื่อตัวชี้วัด" type="text" v-model="formIndicator.name" />

            <div>
                <label class="fieldset">เลือกหัวข้อประเมิน</label>
                <select class="select w-full" v-model="formIndicator.eval_id">
                    <option v-for="evaluation in data_evaluation" :value="evaluation.id">
                        {{ evaluation.title }}
                    </option>
                </select>
            </div>
            <UiInput label="รายละเอียด" type="text" v-model="formIndicator.description" />
            <UiInput label="น้ำหนักคะแนน" type="number" v-model="formIndicator.weight" />
            <!-- <UiInput label="ประเภทหลักฐาน" type="text" v-model="formIndicator.file_type" /> -->
        </div>
        <div>
            <label class="label font-bold text-xs mb-3">รูปแบบการประเมิน</label>

            <div class="flex gap-6">
                <label class="flex items-center gap-2 cursor-pointer hover:opacity-80">
                    <input type="radio" class="radio radio-primary radio-sm" value="boolean"
                        v-model="formIndicator.type" />
                    <span class="text-sm">แบบตัวเลือก (มี/ไม่มี)</span>
                </label>

                <label class="flex items-center gap-2 cursor-pointer hover:opacity-80">
                    <input type="radio" class="radio radio-primary radio-sm" value="score"
                        v-model="formIndicator.type" />
                    <span class="text-sm">แบบสเกล (1-4)</span>
                </label>
            </div>
        </div>
        <div v-if="formIndicator.type === 'score'">
            <UiInput v-model="formLevel.level1"/>
            <UiInput v-model="formLevel.level2"/>
            <UiInput v-model="formLevel.level3"/>
            <UiInput v-model="formLevel.level4"/>
        </div>
        <div class="flex-end gap-3 mt-2">
            <button class="btn">ยกเลิก</button>
            <button class="btn btn-primary" @click="handleInsert">ตกลง</button>
        </div>
    </UiModal>
</template>

<script setup>
definePageMeta({
    layout: "main-layout",
});
const store = dataStore();
const data_evaluation = computed(() => store.evaluation)

const formIndicator = ref({});
const formLevel = ref({});

const handleInsert = async () => {
    try{
        const res = await Insert('/api/indicators', formIndicator.value)
        console.log(res)

        if(res && formIndicator.value.type === 'score'){
            const indic_id = res.id //id จาก response backend
            const levelPayload = {
                levels: [
                    { level: 1, description: formLevel.value.level1 },
                    { level: 2, description: formLevel.value.level2 },
                    { level: 3, description: formLevel.value.level3 },
                    { level: 4, description: formLevel.value.level4 },
                ]
            }

            await Insert(`/api/indicators/levels/${indic_id}`, levelPayload)
        }
    }catch(e){
        console.log(e)
    }
}


</script>
