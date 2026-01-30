<script setup>
const route = useRoute();

// state
const assignId = route.params.id;
const evaluatee_name = route.query.name;
const evaluatee_id = route.query.evaluatee_id;
const title = route.query.title;
const indicator = ref([]);
const result_table = ref([])
const cols_result = [
  { field: 'indic_name', label: 'ตัวชี้วัด' },
  { field: 'evaluatee_name', label: 'ชื่อผู้รับประเมิน' },
  // { field: '', label: 'น้ำหนักคะแนน' },
  { field: 'self_display', label: 'คะแนนตนเอง' },
  { field: 'comittee_display', label: 'คะแนนกรรมการ' },
  { field: 'net_score', label: 'คะแนนสุทธิ' },
]

const fetchIndicatorDetail = async () => {
  const res = await Fetch(`/api/assessments/indicators-detail/${assignId}/${evaluatee_id}`);
  indicator.value = res.indicators;
  res.indicators.forEach(indic => {
    formScore.value[indic.id] = { score: null, hasIt: null }
  })
  console.log(indicator.value)
};

// state ประเมิน
const formSignComment = ref({
  sign_file: '',
  comment: ''
})

const formScore = ref({})

// ส่งประเมิน
const submitScore = async (indic_id) => {
  const scoreData = {
    indic_id: indic_id,
    ...formScore.value[indic_id]
  }
  await Insert(`/api/assessments/give-score/${assignId}`, scoreData)
}

const submitSignComment = async () => {
  await Insert(`/api/assessments/sign-commnents/${assignId}`, formSignComment.value)
  CloseModal('modal_sign_comment')
}

const handleSubmit = async () => {
  if (confirm('คุณต้องการส่งประเมินหรือไม่')) {
    const res = await Insert(`/api/assessments/submitAssess/${assignId}`, {})
  }
}

const fetchResultTable = async () => {
  const res = await Fetch(`/api/report/result-Table/${assignId}`)
  result_table.value = res
}


const selectedImageUrl = ref('');
const openPreview = (file_path, file_url) => {
  const config = useRuntimeConfig()

  if (file_path) {
    selectedImageUrl.value = `${config.public.BASEAPI}/${file_path}`;
    showModal('modal_preview_image');
  } else if (file_url) {
    window.open(file_url.startsWith('http') ? file_url : `https://${file_url}`, '_blank');
  }
};

const calculateNetScore = (row) => {
  const weight = row.weight || 1;

  if (row.score_committee !== null) {
    return (row.score_committee * weight).toFixed(2);
  }

  if (row.bool_committee === 'have') {
    return (1 * weight).toFixed(2);
  }

  return "0.00";
};

onMounted(() => {
  fetchIndicatorDetail();
  fetchResultTable();
});

definePageMeta({
  layout: "main-layout",
});
</script>
<template>
  <div class="breadcrumbs text-sm">
    <ul>
      <li>
        <nuxt-link to="/evaluator">
          <i class="mdi mdi-arrow-left"></i> หน้าหลัก
        </nuxt-link>
      </li>
      <li><a>ประเมิน</a></li>
    </ul>
  </div>
  <!-- Header -->
  <UiHeader :title="title" :description="'ของ ผู้รับประเมิน' + evaluatee_name">
    <UiButton @click="showModal('modal_sign_comment')" title="ให้ความคิดเห็นและลายเซ็น"
      color="btn-secondary btn-soft mr-2" />
    <UiButton @click="showModal('modal_result')" title="ผลลัพธ์การประเมิน" color="btn-secondary btn-soft mr-2" />
    <UiButton @click="handleSubmit" title="ยืนยันการส่งประเมิน" color="btn-primary mr-2" />
  </UiHeader>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">

    <UiCard v-for="(indic, i) in indicator" class="mb-3 p-3">
      <UiBadge color="badge-primary badge-xs" :title="'ตัวชี้วัดที่' + `${i + 1}`" />
      <h1 class="font-bold text-[18px]">{{ indic.name }}</h1>
      <p class="-mt-2">{{ indic.description }}</p>

      <h1 class="font-bold text-[13px] mt-3">หลักฐานและคะแนนที่ประเมินตนเอง</h1>
      <div class="grid grid-cols-2 gap-3">
        <UiCard>
          <h1>คะแนนประเมินตนเอง</h1>
          <p></p>
        </UiCard>
        <UiCard>
          <h1>หลักฐานที่ผู้รับประเมินที่แนบ</h1>
          <div v-if="!indic.file_path && !indic.file_url">
            <UiBadge title="ผู้รับประเมินยังไม่แนบหลักฐาน" color="badge-error" />
          </div>
          <div v-else>
            <UiBadge @click="openPreview(indic.file_path, indic.file_url)" :title="indic.file_path ? 'ดูหลักฐานไฟล์' : 'ดูหลักฐานลิ้งค์'" class="badge-primary"
              :icon="indic.file_path ? 'mdi mdi-file' : 'mdi mdi-link'" />
          </div>
        </UiCard>
        <!-- <UiInput v-model="formSignComment[indic.id].sign_file" label="ลงนามลายเซ็น" class="mt-3" /> -->
      </div>
      <div class="fieldset mt-3">
        <legend>เลือกคะแนนจะประเมิน</legend>
        <select class="select w-full" v-if="indic.type === 'score'" v-model="formScore[indic.id].score">
          <option v-for="level in indic.level" :key="level.id" :value="level.level">
            {{ level.descripton || level.description }}
          </option>
        </select>
        <select class="select w-full" v-model="formScore[indic.id].hasIt" v-else>
          <option value="have">มี</option>
          <option value="not_have">ไม่มี</option>
        </select>
      </div>
      <div class="flex-end">
        <UiButton color="btn-primary px-7" @click="submitScore(indic.id)" title="ประเมิน" />
      </div>
    </UiCard>

  </div>

  <!-- Modal ให้ความคิดเห็นและลายเซ็น -->
  <UiModal modal_id="modal_sign_comment" title="ให้ความคิดเห็นและลายเซ็น">
    <UiInput label="ลงนามลายเซ็น" v-model="formSignComment.sign_file" class="mt-3" />
    <div class="fieldset mt-3">
      <legend>ให้ความคิดเห็นภาพรวม</legend>
      <textarea v-model="formSignComment.comment" class="textarea w-full"></textarea>
    </div>
    <div class="flex justify-end mt-2 space-x-2">
      <UiButton title="ยกเลิก" color="btn-neutral btn-soft" @click="CloseModal('modal_sign_comment')" />
      <UiButton title="ตกลง" color="btn-primary" @click="submitSignComment" />
    </div>
  </UiModal>

  <!-- Modal - ผลลัพธ์การประเมิน -->
  <UiModal modal_id="modal_result" title="ผลลัพธ์การประเมิน" size="max-w-4xl">
    <UiTable :cols="cols_result" :rows="result_table" :isSearch="false">
      <template #self_display="{ row }">
        <span>{{ row.score || row.bool_score || "ยังไม่ประเมิน" }}</span>
      </template>
      <template #comittee_display="{ row }">
        <span>{{ row.score_committee || row.bool_committee || "ยังไม่ประเมิน" }}</span>
      </template>
      <template #net_score="{ row }">
        <span>
          {{ calculateNetScore(row) }}
        </span>
      </template>
    </UiTable>
  </UiModal>

  <UiModal modal_id="modal_preview_image" title="หลักฐานการประเมิน" size="max-w-2xl">
    <div class="flex justify-center p-2">
      <img :src="selectedImageUrl" class="rounded-lg shadow-lg max-w-full h-auto" />
    </div>
  </UiModal>

</template>
