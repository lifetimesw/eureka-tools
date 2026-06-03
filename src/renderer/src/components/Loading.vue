<template>
  <div class="loading-mask" v-if="requestStore.isLoading">
    <div class="loading"></div>
  </div>
</template>

<script setup lang="ts">
import { useRequestStore } from '@renderer/stores'

const requestStore = useRequestStore()
</script>

<style scoped>
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}
.loading {
  position: absolute;
  left: calc(50% - 15px);
  top: calc(50% - 15px);
  width: 30px;
  height: 30px;
  border: 3px solid #000;
  border-top-color: rgba(0, 0, 0, 0.2);
  border-right-color: rgba(0, 0, 0, 0.2);
  border-bottom-color: rgba(0, 0, 0, 0.2);
  border-radius: 100%;

  animation: circle infinite 0.75s linear;
}

@keyframes circle {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
