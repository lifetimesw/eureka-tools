<template>
  <img @error="handleError" />
</template>

<script setup lang="ts">
import errorImg from '@renderer/assets/images/060042.png'

function handleError(event: Event): void {
  const img = event.target as HTMLImageElement
  img.src = errorImg
  img.onerror = null
}
</script>

<style scoped></style>
