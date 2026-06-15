<script setup lang="ts">
import { eurekaLogosCrystal, eurekaLogos } from '@renderer/data/eureka.data'
import { getIcon } from '@renderer/api/request'
import { Logos } from '@renderer/types/eureka.type'

const logosType = ref(2)
const logosTypeList = [
  { type: 1, name: '碎晶' },
  { type: 2, name: '文理' },
  { type: 3, name: '文理图鉴' },
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

const filterText = ref('')

const tableData = computed(() => {
  const fContent = filterText.value.trim()
  if (logosType.value === 1) {
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
      <input type="text" class="normal-input" placeholder="检索碎晶/文理 ⮠" @keyup.enter="handleFilter" />
      <stone-type v-model="logosType" :list="logosTypeList"></stone-type>
    </div>
    <div class="w-full h-[calc(100%-3em)]">
      <stone-table v-if="logosType === 1" :table-data="tableData" class="cold" fix-head>
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
      <stone-table v-else :table-data="tableData" class="cold" fix-head>
        <template #icon="{ row, value }">
          <img class="icon icon-xxl" :src="getIcon(value)" v-title:right.template="getInfoModel(row)" />
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
  </div>
</template>

<style scoped></style>
