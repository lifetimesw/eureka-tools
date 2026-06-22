<script lang="ts" setup>
import type { EurekaAreaId, Fate, ForecastItem } from '@renderer/types/eureka.type'
import { IpcResponse } from '@shared/response'
import StoneMessage from '@renderer/components/base/message'
import { eurekaAreaFates } from '@renderer/data/eureka.data'
import { EorzeaWeather } from '@renderer/utils/weather.util'
import { useClockStore } from '@renderer/stores'
import { getIcon } from '@renderer/api/request'
import { Eureka } from '@renderer/utils/eureka.util'

const clockStore = useClockStore()

const areaId = ref<EurekaAreaId>('area.EurekaAnemos')
const areaList = [
  { id: 'area.EurekaAnemos', name: '常风之地' },
  { id: 'area.EurekaPagos', name: '恒冰之地' },
  { id: 'area.EurekaPyros', name: '涌火之地' },
  { id: 'area.EurekaHydatos', name: '丰水之地' },
]
const columns = [
  { key: 'level', title: '等级', class: 'w-3em' },
  { key: 'name', title: '名称' },
  { key: 'aliases', title: '别称' },
  { key: 'triggerCondition', title: '触发方式' },
  { key: 'triggerTime', title: '触发状态', class: 'w-14em' },
  { key: 'normalRewards', title: '通常奖励' },
  { key: 'specialRewards', title: '特殊奖励' },
]

const triggerMap = reactive<Record<EurekaAreaId, Record<string, string>>>({
  'area.EurekaAnemos': {},
  'area.EurekaPagos': {},
  'area.EurekaHydatos': {},
  'area.EurekaPyros': {},
})
const forecastWeather = ref<ForecastItem[]>([])

const tableData = computed(() => {
  const fateList = eurekaAreaFates[areaId.value]
  const areaTrigger = triggerMap[areaId.value] || {}
  const dataArr = fateList.map((fate) => {
    const weather = fate.triggerCondition.weather
    return {
      level: fate.level,
      title: fate.title,
      name: fate.name,
      aliases: fate.aliases,
      triggerCondition: fate.triggerCondition,
      triggerWeather: weather ? Eureka.getWeatherInfo(weather) : weather,
      normalRewards: fate.normalRewards,
      specialRewards: fate.specialRewards,
      description: fate.description,
      triggerTime: areaTrigger[fate.name] || '',
    }
  })
  return {
    columns: columns,
    dataArr: dataArr,
  }
})

const triggeredHistory = computed(() => {
  const history = tableData.value.dataArr.filter((item) => item.triggerTime)
  if (history.length) {
    return history.map((item) => item.aliases[0] ?? item.name).join('—')
  }
  return '无'
})
const notTriggeredHistory = computed(() => {
  const history = tableData.value.dataArr.filter((item) => !item.triggerTime)
  if (history.length) {
    return history.map((item) => item.aliases[0] ?? item.name).join('—')
  }
  return '无'
})

function copyHistory(trigger: boolean): void {
  const history = tableData.value.dataArr.filter((item) => !!item.triggerTime === trigger)
  const content = history
    .map((item) => {
      const name = item.aliases[0] ?? item.name
      if (item.triggerTime) {
        const minuteAfter = Math.floor((new Date().getTime() - new Date(item.triggerTime || '').getTime()) / 1000 / 60)
        return `${name}(${minuteAfter}分前)`
      }
      return name
    })
    .join('—')
  const type = trigger ? '【已触发】' : '【可触发】'
  window.api.clipboard.writeText(type + (content || '无')).then((result: IpcResponse) => {
    if (result.success) {
      StoneMessage.success('复制成功')
    }
  })
}

function copyFate(rowData: Fate): void {
  const timeAfter = (new Date().getTime() - new Date(rowData.triggerTime || '').getTime()) / 1000
  const content = `【${rowData.name}】触发于${dayjs(rowData.triggerTime).format('YYYY-MM-DD HH:mm')}，已经过去${Math.floor(timeAfter / 60)}分。`
  window.api.clipboard.writeText(content).then((result: IpcResponse) => {
    if (result.success) {
      StoneMessage.success(`${rowData.name} 触发记录复制成功`)
    }
  })
}

function toggleTrigger(name: string): void {
  const areaTrigger = triggerMap[areaId.value]
  if (areaTrigger[name]) {
    areaTrigger[name] = ''
  } else {
    areaTrigger[name] = dayjs().format('YYYY-MM-DD HH:mm')
  }
}
function resetTrigger(): void {
  if (confirm('确定要重置所有触发状态吗？')) {
    const areaTrigger = triggerMap[areaId.value]
    Object.keys(areaTrigger).forEach((key) => {
      areaTrigger[key] = ''
    })
  }
}

function calculateForecast(): void {
  if (areaId.value && clockStore.eorzeaClock) {
    forecastWeather.value = EorzeaWeather.getExtendedForecast(areaId.value, clockStore.eorzeaClock, 5, 0)
  }
}
function getWeatherTitle(forecastItem: ForecastItem, index: number): string {
  if (index === 0) {
    return `当前：${forecastItem.name}`
  }
  return `${forecastItem.name}\n${forecastItem.time}\n${forecastItem.localTimeStr}\n`
}
watch(
  () => clockStore.eorzeaClock,
  (newClock, oldClock) => {
    const newBaseClock = newClock.getWeatherBaseClock()
    const oldBaseClock = oldClock.getWeatherBaseClock()
    const newBaseSec = Math.floor(newBaseClock.getTime() / 1000)
    const oldBaseSec = Math.floor(oldBaseClock.getTime() / 1000)
    if (newBaseSec !== oldBaseSec) {
      calculateForecast()
    }

    const localTime = newClock.getLocalTime()
    localTime.setHours(localTime.getHours() - 2)
    const areaTrigger = triggerMap[areaId.value]
    Object.keys(areaTrigger).forEach((key) => {
      if (areaTrigger[key]) {
        const triggerTime = new Date(areaTrigger[key])
        if (localTime >= triggerTime) {
          areaTrigger[key] = ''
        }
      }
    })
  },
  { deep: true }
)
watch(triggerMap, (newMap) => {
  window.api.store.set('eurekaTrigger', toRaw(newMap))
})
onMounted(async () => {
  const tMap = await window.api.store.get('eurekaTrigger')
  if (tMap.success && tMap.data) {
    Object.keys(triggerMap).forEach((key) => {
      triggerMap[key] = tMap.data[key] ?? {}
    })
  }
  calculateForecast()
})
</script>

<template>
  <div class="w-full h-full px-1em pb-1em">
    <div class="h-3em f-center-center gap-2">
      <select v-model="areaId" class="normal-select" @change="calculateForecast">
        <option v-for="item in areaList" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select>
      <div class="gap-2 if-start-start">
        <img
          v-for="(item, index) in forecastWeather"
          :key="index"
          :src="getIcon(item.icon)"
          v-title:bottom.interactive="getWeatherTitle(item, index)"
          class="cursor-pointer icon icon-l rounded-full"
          :class="[index === 0 ? 'b-2 b-solid b-orange-500' : '']" />
      </div>
      <button class="normal-button" @click="copyHistory(true)" v-title:bottom="triggeredHistory">复制已触发</button>
      <button class="normal-button" @click="copyHistory(false)" v-title:bottom="notTriggeredHistory">复制未触发</button>
    </div>
    <div class="w-full h-[calc(100%-3em)]">
      <stone-table :table-data="tableData" class="cold" :fixed="[2, 0]" fix-head>
        <template #head="{ column }">
          <div v-if="column.key === 'triggerTime'" class="f-center-center">
            <span>{{ column.title }}</span>
            <button class="normal-button ml-1em" @click="resetTrigger">重置</button>
          </div>
        </template>
        <template #default="{ row, value }">
          <span :class="{ 'text-orange-500': row.triggerTime }">{{ value }}</span>
        </template>
        <template #name="{ row }">
          <p class="text-3" :class="{ 'text-orange-500': row.triggerTime }" v-if="row.title">【{{ row.title }}】</p>
          <p class="fw-bold" :class="{ 'text-orange-500': row.triggerTime }">{{ row.name }}</p>
        </template>
        <template #aliases="{ value }">
          <div class="f-center-center lh-1em gap-[3px]">
            <span class="p-1 bg-gray-200 rounded ws-nowrap" v-for="item in value" :key="item">
              {{ item }}
            </span>
          </div>
        </template>
        <template #triggerCondition="{ row, value }">
          <p class="f-center">
            击杀【{{ row.level + 5 }}级 {{ value.monster }}<i v-if="value.night" v-title="'夜晚'" class="icon icon-s i-lucide:moon"></i>】
          </p>
          <p v-if="row.triggerWeather" class="f-center">
            在【<img class="icon icon-s" :src="getIcon(row.triggerWeather.icon)" />{{ row.triggerWeather.name }}】出现
          </p>
        </template>
        <template #normalRewards="{ value }">
          <p v-for="(item, index) in value" :key="index" class="f-center">
            <!-- <img class="mr-1 icon icon-s" :src="getIcon(item.icon)" />{{ item.name }} * {{ item.quantity }} -->
            <stone-image class="mr-1 icon icon-s" :src="getIcon(item.icon)" v-title:left="item.name" /> * {{ item.quantity }}
          </p>
        </template>
        <template #specialRewards="{ value }">
          <p v-for="(item, index) in value" :key="index" class="f-center">
            <stone-image class="mr-1 icon icon-s" :src="getIcon(item.icon)" />{{ item.name }}
          </p>
        </template>
        <template #triggerTime="{ row, value }">
          <button
            class="trigger-button"
            :class="{ 'bg-orange-100': value, 'b-orange-300': value, 'text-orange-500': value }"
            @click="toggleTrigger(row.name)">
            {{ value ? '已触发' : '标记触发' }}
          </button>
          <i v-if="value" class="ml-2 icon icon-s i-lucide:copy cursor-pointer" @click="copyFate(row)"></i>
          <br />
          <div v-if="value" class="f-center-center mt-1 bg-orange-100 px-2 rounded-lg text-3 fw-500 text-gray-500">
            <span>触发于</span>
            <stone-time type="minute" v-model="triggerMap[areaId][row.name]" class="trigger-time"></stone-time>
          </div>
          <div v-else class="f-center-center text-3 mt-1 px-2 text-gray-500">待触发</div>
        </template>
      </stone-table>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
