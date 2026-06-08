<script lang="ts" setup>
interface TypeRaw {
  type: number | string
  name: string
  [K: string]: unknown
}
defineProps<{
  modelValue: number | string
  list: TypeRaw[]
}>()
const emit = defineEmits(['change', 'update:modelValue'])
function handleClick(data: TypeRaw): void {
  emit('update:modelValue', data.type)
  emit('change', data)
}
</script>

<template>
  <div class="stone-type">
    <span v-for="(item, index) in list" :key="index" class="stone-type-item" :class="{ active: modelValue === item.type }" @click="handleClick(item)">
      {{ item.name }}
    </span>
  </div>
</template>
