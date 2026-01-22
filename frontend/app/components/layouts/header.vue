<template>
  <nav class="p-4 navbar flex justify-between items-center w-full bg-white shadow-sm">
    <label for="my-drawer-4" class="btn">
      <i class="mdi mdi-menu"></i>
    </label>

    <div class="dropdown dropdown-end">
      <div tabindex="0" class="avatar avatar-online avatar-placeholder">
        <div class="w-9 bg-neutral text-neutral-content rounded-full">
          <span class="uppercase">{{ firstUsername }}</span>
        </div>
      </div>

      <ul tabindex="0" class="dropdown-content menu w-50 bg-white shadow-sm rounded-[10px]">
        <li @click="showModal('update_profile')">
          <a><i class="mdi mdi-account"></i>ข้อมูลส่วนตัว</a>
        </li>
        <li @click="auth.logout()">
          <a><i class="mdi mdi-logout"></i>ออกจากระบบ</a>
        </li>
      </ul>
    </div>
  </nav>

  <UiModal modal_id="update_profile" title="แก้ไขข้อมูลส่วนตัว">
    <div class="grid grid-2 gap-4">
      <div>
        <UiInput v-model="formUpdateProfile.fname" label="ชื่อจริง" />
        <UiInput v-model="formUpdateProfile.lname" label="นามสกุล" />
      </div>
      <div>
        <UiInput v-model="formUpdateProfile.username" label="ชื่อผู้ใช้งาน" />
        <UiInput v-model="formUpdateProfile.password" label="รหัสผ่าน" />
      </div>
    </div>
    <div class="flex justify-end mt-2">
      <button class="btn btn-neutral btn-sm" @click="">ตกลง</button>
    </div>
  </UiModal>

</template>

<script setup>
const formUpdateProfile = ref({})
const auth = authStore()

onMounted(() => {
  auth.getProfile()
  formUpdateProfile.value = auth.profile
  console.log(auth.profile)
})
</script>
