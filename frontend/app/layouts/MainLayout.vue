<template>
  <div class="flex min-h-screen">
    <div class="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" class="drawer-toggle" :checked="true" />
      <div class="drawer-content">
        <!-- Component Header -->
        <LayoutsHeader />

        <!-- Main Content -->
        <div class=" p-5 shadow-sm mx-6 mt-6 mb-2 rounded-[10px] bg-white">
          <transition
          >
            <slot></slot>
          </transition>
        </div>
      </div>

      <div class="drawer-side is-drawer-close:overflow-visible">
        <label for="my-drawer-4" class="drawer-overlay"></label>
        <div
          class="flex min-h-full flex-col bg-white items-start shadow-sm border-r border-gray-200 transition-all duration-200 is-drawer-close:w-15 is-drawer-close:p-3 is-drawer-open:w-70 is-drawer-open:p-4"
        >
          <!-- Component Sidebar -->
          <LayoutsSidebar :menu-group="currentMenu" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  background-color: rgb(250, 250, 250);
}
</style>

<script setup>
import menuData from './menu.json'

const route = useRoute()

const currentMenu = computed(() => {
    if(route.path.startsWith('/admin')) return menuData.admin
    if(route.path.startsWith('/evaluatee')) return menuData.evaluatee
    return menuData.evaluator
})
</script>
