<script setup lang="ts">
import { eurekaLogosCrystal } from '@renderer/data/eureka.data'
import { reactive, ref } from 'vue'

const logosType = ref(1)
const logosTypeList = [
  { type: 1, name: '碎晶' },
  { type: 2, name: '文理' },
]

const crystalColumns = [
  { key: 'name', title: '名称' },
  { key: 'logos', title: '可鉴定文理' },
  { key: 'sources', title: '常见获取方式' },
  { key: 'description', title: '备注' },
]

const tableData = reactive({
  columns: crystalColumns,
  dataArr: eurekaLogosCrystal,
})

function getIcon(iconId: string): string {
  if (!iconId) return ''
  const iconname = iconId.padStart(6, '0')
  const iconParent = `${iconname.slice(0, 3)}000`
  return `https://xivapi.com/i/${iconParent}/${iconname}.png`
}
</script>

<template>
  <div class="w-full h-full px-1em pb-1em">
    <div class="w-full h-3em f-center-center gap-2">
      <stone-type v-model="logosType" :list="logosTypeList"></stone-type>
    </div>
    <div class="w-full h-[calc(100%-3em)]">
      <stone-table :tableData="tableData" class="cold" fix-head>
        <template #name="{ row, value }">
          <p class="if-center">
            <img class="icon icon-m" :src="getIcon(row.icon)" />
            <span class="ml-1">{{ value }}</span>
          </p>
        </template>
        <template #logos="{ value }">
          <p v-for="(item, index) in value" :key="index" class="f-center-center lh-6">
            <img class="icon icon-m" :src="getIcon(item.icon)" />
            <span class="inline-block ml-1 w-6em text-left">{{ item.name }}</span>
          </p>
        </template>
        <template #sources="{ value }">
          <p v-for="(item, index) in value" :key="index" class="f-center lh-6">
            <img v-for="icon in item.icons" :key="icon" class="icon icon-m" :src="getIcon(icon)" />
            <span class="ml-1">{{ item.name }}</span>
            <span v-if="item.levels.length">：{{ item.levels.join('、') }}</span>
          </p>
        </template>
        <template #description="{ value }">
          <p class="ws-pre">{{ value }}</p>
        </template>
      </stone-table>
    </div>
  </div>
</template>

<style scoped></style>
