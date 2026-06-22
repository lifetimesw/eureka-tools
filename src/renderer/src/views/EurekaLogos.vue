<script setup lang="ts">
import { eurekaLogosCrystal, eurekaLogos } from '@renderer/data/eureka.data'
import { getIcon } from '@renderer/api/request'
import { Logos } from '@renderer/types/eureka.type'
import constants from '@renderer/api/constants'

const logosType = ref(1)
const logosTypeList = [
  { type: 1, name: '文理' },
  { type: 2, name: '文理图鉴' },
  { type: 3, name: '碎晶' },
]

const crystalColumns = [
  { key: 'name', title: '名称' },
  { key: 'logos', title: '可鉴定文理' },
  { key: 'sources', title: '常见获取方式' },
  { key: 'description', title: '备注' },
]
const logosColumns = [
  { key: 'order', title: '序号' },
  { key: 'icon', title: '图标' },
  { key: 'name', title: '名称' },
  { key: 'synthesisRecipes', title: '鉴定 | 合成' },
  { key: 'jobs', title: '适应职业' },
  { key: 'description', title: '说明' },
]

const checkedLogos = reactive<Record<number, boolean>>({})
eurekaLogos.forEach((item) => {
  checkedLogos[item.order] = true
})
function resetChecked(): void {
  eurekaLogos.forEach((item) => {
    checkedLogos[item.order] = true
  })
}
function uncheckAll(): void {
  eurekaLogos.forEach((item) => {
    checkedLogos[item.order] = false
  })
}

const filterText = ref('')

const tableData = computed(() => {
  const fContent = filterText.value.trim()
  if (logosType.value === 3) {
    if (fContent) {
      return {
        columns: crystalColumns,
        dataArr: eurekaLogosCrystal.filter((item) => item.name.includes(fContent) || item.logos.find((x) => x.name.includes(fContent))),
      }
    }
    return {
      columns: crystalColumns,
      dataArr: eurekaLogosCrystal,
    }
  }
  if (fContent) {
    return {
      columns: logosColumns,
      dataArr: eurekaLogos.filter(
        (item) => item.name.includes(fContent) || item.synthesisRecipes.find((x) => x.find((s) => s.name.includes(fContent)))
      ),
    }
  }
  return {
    columns: logosColumns,
    dataArr: eurekaLogos,
  }
})
function handleFilter(event: KeyboardEvent): void {
  filterText.value = (event.target as HTMLInputElement).value
}

function getInfoModel(rowData: Logos): string {
  const { icon, name, type, castTime, recastTime, range, radius, uses, jobs, synthesisRecipes, description } = rowData
  return `
  <div class="logos-tooltip">
      <div class="tooltip-header">
        <div class="logos-header-left">
          <img class="logos-icon" src="${getIcon(icon)}" />
        </div>
        <div class="logos-header-right">
          <span class="title">${name}</span>
          <div class="logos-type">
            <span class="type">${type}</span>
            <div class="logos-range">
              <span>距离</span>
              <span class="mr-2">${range}米</span>
              <span>范围</span>
              <span>${radius}米</span>
            </div>
          </div>
        </div>
      </div>
      <div class="tooltip-use">
        <div class="use-item">
          <span class="title">咏唱时间</span>
          <span>${castTime === 0 ? '即时' : `${castTime} 秒`}</span>
        </div>
        <div class="use-item">
          <span class="title">复唱时间</span>
          <span>${recastTime} 秒</span>
        </div>
        ${
          uses > 0
            ? `<div class="use-item">
          <span class="title">次数</span>
          <span>${uses}/${uses}</span>
        </div>`
            : ''
        }
      </div>
      <div class="tooltip-main">
        ${description
          .map((item) => {
            if (Array.isArray(item)) {
              return `<p class="logos-desc">
                ${item
                  .map((x, i) =>
                    x.includes('：')
                      ? `<span class="c-green-600 ${i > 0 ? 'ml-2' : 0}">${x.split('：')[0]}：</span>
                    <span>${x.split('：')[1]}</span>`
                      : `<span>${x}</span>`
                  )
                  .join('')}
                </p>`
            }
            return `<p class="logos-desc">
              <span>${item}</span>
            </p>`
          })
          .join('')}
        <div class="logos-jobs">
          <span class="name">适应职业</span>
          <div class="jobs-group">
            ${jobs
              .map(
                (item) => `<div class="jobs-item">
                <img class="icon icon-m" src="${getIcon(item.icon)}" />
                <span>${item.name}</span>
              </div>`
              )
              .join('')}
          </div>
        </div>
        <div class="logos-recipes">
          <span class="name">鉴定 | 合成</span>
          <div class="recipes-group">
            ${synthesisRecipes
              .map(
                (item) => `<div class="recipes-item">
                ${item
                  .map(
                    (x, i) => `${i !== 0 ? `<span class="mx-1">+</span>` : ''}
                    <img class="icon icon-m" src="${getIcon(x.icon)}" />
                    <span>${x.name}</span>`
                  )
                  .join('')}
              </div>`
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>
  `
}
</script>

<template>
  <div class="w-full h-full px-1em pb-1em">
    <div class="w-full h-3em f-center-center gap-2">
      <input type="text" class="normal-input" placeholder="检索碎晶/文理图鉴 ⮠" @keyup.enter="handleFilter" />
      <stone-type v-model="logosType" :list="logosTypeList"></stone-type>
    </div>
    <div class="w-full h-[calc(100%-3em)]">
      <div v-if="logosType === 1" class="w-full h-full f-center-start-col">
        <div class="f-center-center py-1em gap-4">
          <span class="c-blue cursor-pointer" @click="resetChecked">显示所有</span>
          <span class="c-blue cursor-pointer" @click="uncheckAll">隐藏所有</span>
        </div>
        <div class="logos-box">
          <div
            v-for="item in eurekaLogos"
            :key="item.order"
            class="f-center-center w-full h-full rounded-md overflow-hidden cursor-pointer relative"
            @click="checkedLogos[item.order] = !checkedLogos[item.order]">
            <img v-if="checkedLogos[item.order]" class="select-none" :src="getIcon(item.icon)" v-title:bottom.template="getInfoModel(item)" />
            <img v-else class="select-none" :src="getIcon(constants.unknownIcon)" />
          </div>
        </div>
      </div>
      <div v-else-if="logosType === 2" class="w-full h-full">
        <stone-table :table-data="tableData" class="cold" fix-head>
          <template #icon="{ value }">
            <img class="rounded-md select-none" :src="getIcon(value)" />
          </template>
          <template #synthesisRecipes="{ value }">
            <div v-for="(child, index) in value" :key="index" class="f-center">
              <i class="icon icon-s mr-1 i-lucide:circle-divide"></i>
              <div v-for="(item, idx) in child" :key="item.icon" class="if-center lh-6">
                <span v-if="idx !== 0" class="mx-2">+</span>
                <img class="icon mr-1" :src="getIcon(item.icon)" />
                <span>{{ item.name }}</span>
              </div>
            </div>
          </template>
          <template #jobs="{ value }">
            <p v-for="item in value" :key="item.icon" class="f-center lh-6">
              <img class="icon mr-1" :src="getIcon(item.icon)" />
              <span>{{ item.name }}</span>
            </p>
          </template>
          <template #description="{ value }">
            <template v-for="(item, index) in value" :key="index">
              <div v-if="Array.isArray(item)" class="lh-5 text-3 ws-pre-wrap text-left">
                <template v-for="(sItem, xIdx) in item" :key="sItem">
                  <template v-if="sItem.includes('：')">
                    <span class="c-green-600" :class="{ 'ml-3': xIdx !== 0 }">{{ sItem.split('：')[0] }}：</span>
                    <span class="c-#393d44">{{ sItem.split('：')[1] }}</span>
                  </template>
                  <span v-else>{{ sItem }}</span>
                </template>
              </div>
              <p v-else-if="item.includes('：')" class="lh-5 text-3 ws-pre-wrap text-left">
                <span class="c-green-600">{{ item.split('：')[0] }}：</span>
                <span class="c-#393d44">{{ item.split('：')[1] }}</span>
              </p>
              <p v-else class="lh-5 text-3 ws-pre-wrap text-left">
                <span>{{ item }}</span>
              </p>
            </template>
          </template>
        </stone-table>
      </div>
      <div v-else-if="logosType === 3" class="w-full h-full">
        <stone-table :table-data="tableData" class="cold" fix-head>
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
  </div>
</template>

<style lang="scss" scoped>
.logos-box {
  display: grid;
  grid-template-columns: repeat(10, auto);
  grid-template-rows: repeat(6, auto);
  gap: 0.5em;
}
</style>
