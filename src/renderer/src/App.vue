<script setup lang="ts">
import { RouterView } from 'vue-router'
import Loading from '@renderer/components/Loading.vue'
import StoneHeader from '@renderer/components/StoneHeader.vue'
import StoneNav from '@renderer/components/StoneNav.vue'
</script>

<template>
  <div class="w-full h-full">
    <StoneHeader />
    <div class="w-full h-[calc(100%-40px)] f-center-center">
      <div class="w-60px h-full shrink-0 relative">
        <StoneNav is-show />
      </div>
      <main class="flex-1 h-full overflow-x-auto">
        <RouterView />
      </main>
    </div>
    <Loading />
  </div>
</template>

<style lang="scss" scoped></style>
