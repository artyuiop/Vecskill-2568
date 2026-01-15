<template>
  <!-- MenuMain -->
  <ul class="menu w-full p-0 mb-2" v-for="menu in menuGroup">
    <li>
      <details open>
        <summary
          class="group bg-white text-black text-gray-500 text-xs list-none is-drawer-close:after:!content-none cursor-pointer"
        >
          <i :class="['mdi', `${menu.Icon}`]"></i>
          <span class="is-drawer-close:hidden">{{ menu.name }}</span>
        </summary>
        <ul>
          <li v-for="menuChildren in menu.children">
            <NuxtLink
              :to="menuChildren.path"
              active-class="group text-primary bg-primary/10 !translate-x-0"
              class="is-drawer-close:hidden duration-300 transition-all mb-3 hover:translate-x-2 hover:bg-primary/5 text-[13px]"
            >
              <div
                class="w-1.5 h-1.5 bg-primary rounded-full hidden group-[.router-link-exact-active]:block"
              ></div>
              <span>{{ menuChildren.name }}</span>
            </NuxtLink>
          </li>
        </ul>
      </details>
    </li>
  </ul>
</template>

<script setup>
defineProps({
  menuGroup: Array,
});
</script>
