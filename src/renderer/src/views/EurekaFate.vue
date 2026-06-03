<script lang="ts" setup>
import type { EurekaAreaId, Fate, ForecastItem } from '@renderer/types/eureka.type'
import { IpcResponse } from '@shared/response'
import StoneMessage from '@renderer/components/base/message'
import { computed, onMounted, reactive, ref, toRaw, watch } from 'vue'
import { eurekaAreaFates } from '@renderer/data/eureka.data'
import { EorzeaWeather } from '@renderer/utils/weather.util'
import { useClockStore } from '@renderer/stores'

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
  { key: 'normalRewards', title: '通常奖励' },
  { key: 'specialRewards', title: '特殊奖励' },
  { key: 'triggerTime', title: '触发状态' },
]

const triggerMap = reactive<Record<EurekaAreaId, Record<number, string>>>({
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
    return {
      level: fate.level,
      title: fate.title,
      name: fate.name,
      aliases: fate.aliases,
      triggerCondition: fate.triggerCondition,
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
  const type = trigger ? '【已触发】' : '【未触发】'
  window.api.clipboard.writeText(type + content).then((result: IpcResponse) => {
    if (result.success) {
      StoneMessage.success('复制成功')
    }
  })
}

function copyFate(rowData: Fate): void {
  const timeAfter = (new Date().getTime() - new Date(rowData.triggerTime || '').getTime()) / 1000
  const content = `【${rowData.name}】触发于${rowData.triggerTime}。已经过去${Math.floor(timeAfter / 60)}分${Math.floor(timeAfter % 60)}秒`
  window.api.clipboard.writeText(content).then((result: IpcResponse) => {
    if (result.success) {
      StoneMessage.success(`${rowData.name} 触发记录复制成功`)
    }
  })
}

function getIcon(iconId: string): string {
  if (!iconId) return ''
  const iconname = iconId.padStart(6, '0')
  const iconParent = `${iconname.slice(0, 3)}000`
  return `https://xivapi.com/i/${iconParent}/${iconname}.png`
}
function toggleTrigger(name: string): void {
  const areaTrigger = triggerMap[areaId.value]
  if (areaTrigger[name]) {
    areaTrigger[name] = ''
  } else {
    areaTrigger[name] = new Date().toLocaleString()
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
        <i
          v-for="(item, index) in forecastWeather"
          :key="index"
          v-title:bottom.interactive="getWeatherTitle(item, index)"
          class="cursor-pointer icon icon-l rounded-full"
          :class="[`icon-eureka-${item.weather}`, index === 0 ? 'b-2 b-solid b-orange-600' : '']">
        </i>
      </div>
      <button class="normal-button" @click="copyHistory(true)" v-title:bottom="triggeredHistory">复制已触发</button>
      <button class="normal-button" @click="copyHistory(false)" v-title:bottom="notTriggeredHistory">复制未触发</button>
    </div>
    <div class="w-full h-[calc(100%-3em)]">
      <stone-table :table-data="tableData" class="cold" :fixed="[2, 1]" fix-head>
        <template #head="{ column }">
          <div v-if="column.key === 'triggerTime'" class="f-center-center">
            <span>{{ column.title }}</span>
            <button class="normal-button ml-1em" @click="resetTrigger">重置</button>
          </div>
        </template>
        <template #default="{ row, value }">
          <span :class="{ 'text-#176b48': row.triggerTime, 'fw-bold': row.triggerTime }">{{ value }}</span>
        </template>
        <template #name="{ row }">
          <span :class="{ 'text-#176b48': row.triggerTime, 'fw-bold': row.triggerTime }">{{ row.title + '——' + row.name }}</span>
        </template>
        <template #aliases="{ row, value }">
          <span :class="{ 'text-#176b48': row.triggerTime, 'fw-bold': row.triggerTime }">{{ value.join('、') }}</span>
        </template>
        <template #triggerCondition="{ row, value }">
          <p class="f-center">
            击杀【{{ row.level + 5 }}级 {{ value.monster }}<i v-if="value.night" v-title="'夜晚'" class="icon icon-s i-lucide:moon"></i>】
          </p>
          <p v-if="value.weather" class="f-center">
            在【<i class="icon icon-s" :class="`icon-eureka-${value.weather.weather}`"></i>{{ value.weather.name }}】出现
          </p>
        </template>
        <template #normalRewards="{ value }">
          <p v-for="(item, index) in value" :key="index" class="f-center">
            <img class="mr-1 icon icon-s" :src="getIcon(item.icon)" />{{ item.name }} * {{ item.quantity }}
          </p>
        </template>
        <template #specialRewards="{ value }">
          <p v-for="(item, index) in value" :key="index" class="f-center">
            <img class="mr-1 icon icon-s" :src="getIcon(item.icon)" />{{ item.name }}
          </p>
        </template>
        <template #triggerTime="{ row, value }">
          <button
            class="trigger-button"
            :class="{ 'bg-#e0f2ea': value, 'b- #9fc7b5': value, 'text-#176b48': value }"
            @click="toggleTrigger(row.name)">
            {{ value ? '已触发' : '标记触发' }}
          </button>
          <i v-if="value" class="ml-2 icon icon-s i-lucide:copy cursor-pointer" @click="copyFate(row)"></i>
          <br />
          <p v-if="value" class="if-center-center mt-1 bg-#e9f4ef px-2 py-3px rounded-lg text-3 fw-500 text-#6a7a8a">
            <span>触发于 {{ value }}</span>
          </p>
          <p v-else class="if-center-center text-3 mt-1 px-2 py-3px text-#6a7a8a">待触发</p>
        </template>
      </stone-table>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
