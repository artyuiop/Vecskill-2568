<template>
  <nav
    class="p-4 navbar flex justify-between items-center w-full bg-white shadow-sm"
  >
    <label for="my-drawer-4" class="btn">
      <i class="mdi mdi-menu"></i>
    </label>

    <div class="dropdown dropdown-end">
      <div tabindex="0" class="avatar avatar-online avatar-placeholder">
        <div class="w-9 bg-neutral text-neutral-content rounded-full">
          <span class="uppercase">{{ firstUsername }}</span>
        </div>
      </div>

      <ul
        tabindex="0"
        class="dropdown-content menu w-50 bg-white shadow-sm rounded-[10px]"
      >
        <li @click="openModalProfile">
          <a><i class="mdi mdi-account"></i>ข้อมูลส่วนตัว</a>
        </li>
        <li onclick="confirmDelete.showModal()">
          <a><i class="mdi mdi-logout"></i>ออกจากระบบ</a>
        </li>
      </ul>
    </div>
  </nav>

</template>

<script setup>

</script>
