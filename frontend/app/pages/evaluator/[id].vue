<script setup>
const route = useRoute();

// state จากหน้า evaluatorที่ส่งมา
const assignId = route.params.id;
const evaluatee_name = route.query.name;
const evaluatee_id = route.query.evaluatee_id;
const title = route.query.title;

const indicator = ref([])
const fetchIndicatorDetail = async () => {
  const res = await Fetch(`/api/assessments/indicators-detail/${evaluatee_id}`)
  indicator.value = res.indicator
  console.log(res)
}

onMounted(() => {
  fetchIndicatorDetail();
})

definePageMeta({
  layout: "main-layout",
});
</script>
<template>
  <UiHeader :title="'รอบประเมิน ' + title" :description="'ของ ผู้รับประเมิน' + evaluatee_name">
    <nuxt-link to="/evaluator" clsss="btn btn-ghost">
      <i class="mdi mdi-arrow-left"></i>
    </nuxt-link>
  </UiHeader>
  <div class="grid grid-cols-2 gap-3">
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
            <UiBadge title="ผู้รับประเมินยังไม่แนบหลักฐาน" color="badge-error"/>
          </div>
          
        </UiCard>

        <div class="fieldset mt-3">
          <legend>เลือกคะแนนจะประเมิน</legend>
          <select class="select" v-if="indic.type === 'score'">
            <option value="" v-for="level in indic.levels">
              {{ level.description }}
            </option>
          </select>
          <select class="select" v-else>
            <option value="มี">มี</option>
            <option value="ไม่มี">ไม่มี</option>
          </select>
        </div>

        <UiInput label="ลงนามลายเซ็น" class="mt-3" />
      </div>
      <div class="fieldset mt-3">
        <legend>ให้ความคิดเห็นภาพรวม</legend>
        <textarea class="textarea w-full"></textarea>
      </div>
      <div class="flex-end">
        <UiButton color="btn-primary px-7" title="ประเมิน"/>
      </div>
    </UiCard>
  </div>
</template>
