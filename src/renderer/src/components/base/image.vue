<template>
  <img @error="handleError" />
</template>

<script setup lang="ts">
import constants from '@renderer/api/constants'
import { getIcon } from '@renderer/api/request'

function handleError(event: Event): void {
  const img = event.target as HTMLImageElement
  img.src = getIcon(constants.unknownIcon)
  img.onerror = null
}
</script>

<style scoped></style>
