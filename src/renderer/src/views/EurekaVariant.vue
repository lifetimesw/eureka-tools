<script lang="ts" setup>
import type { EurekaAreaId, ForecastItem } from '@renderer/types/eureka.type'
import { computed, onMounted, ref, watch } from 'vue'
import { eurekaAreaVariants, eurekaAreaWeatherRates } from '@renderer/data/eureka.data'
import { EorzeaWeather } from '@renderer/utils/weather.util'
import { useClockStore } from '@renderer/stores'

const clockStore = useClockStore()

const areaId = ref<EurekaAreaId>('area.EurekaPagos')
const areaList = [
  { id: 'area.EurekaPagos', name: '恒冰之地' },
  { id: 'area.EurekaPyros', name: '涌火之地' },
  { id: 'area.EurekaHydatos', name: '丰水之地' },
]
const variantName = ref<string>('')

const tableData = computed(() => {
  const areaWeather = eurekaAreaWeatherRates[areaId.value]
  const filterName = variantName.value.trim()
  const variantList = eurekaAreaVariants[areaId.value]
  const weatherCols = areaWeather.map((weather) => {
    return {
      key: weather.weather,
      title: weather.name,
    }
  })
  return {
    columns: [{ key: 'level', title: '等级' }, { key: 'name', title: '名称' }, { key: 'element', title: '属性' }, ...weatherCols],
    dataArr: filterName ? variantList.filter((x) => x.name.includes(filterName)) : variantList,
  }
})

const forecastWeather = ref<ForecastItem[]>([])
const currentWeather = computed(() => {
  return forecastWeather.value[0]?.weather || ''
})

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
  },
  { deep: true }
)
onMounted(() => {
  calculateForecast()
})
</script>

<template>
  <div class="w-full h-full px-1em pb-1em">
    <div class="h-3em f-center-center">
      <select class="normal-select" v-model="areaId" @change="calculateForecast">
        <option :value="item.id" v-for="item in areaList" :key="item.id">{{ item.name }}</option>
      </select>
      <input type="text" v-model="variantName" class="ml-1em normal-input" placeholder="请输入名称筛选" />
      <div class="ml-1em gap-2 if-start-start">
        <i
          v-for="(item, index) in forecastWeather"
          :key="index"
          v-title:bottom.interactive="getWeatherTitle(item, index)"
          class="cursor-pointer icon icon-l rounded-full"
          :class="[`icon-eureka-${item.weather}`, index === 0 ? 'b-2 b-solid b-orange-500' : '']">
        </i>
      </div>
    </div>
    <div class="w-full h-[calc(100%-3em)]">
      <stone-table :table-data="tableData" class="cold" fix-head>
        <template #head="{ column }">
          <span v-if="column.key === 'name' || column.key === 'level' || column.key === 'element'">
            {{ column.title }}
          </span>
          <i
            class="icon rounded-full"
            :class="[`icon-eureka-${column.key}`, currentWeather === column.key ? 'b-2 b-solid b-orange-500' : '']"
            v-title="column.title"
            v-else></i>
        </template>
        <template #default="{ row, column, value }">
          <span v-if="column.key === 'level'">
            {{ value }}
          </span>
          <i
            class="icon icon-m"
            :class="[row.weather.includes(column.key) ? `i-lucide:${row.timePeriod}` : '', { 'text-orange-500': currentWeather === column.key }]"
            v-else>
          </i>
        </template>
        <template #name="{ row, value }">
          <i class="icon icon-m" :class="`icon-eureka-${row.type}`"></i>
          <span>{{ value }}</span>
        </template>
        <template #element="{ value }">
          <div class="transfer" v-if="value.length === 2">
            <i class="icon icon-l" :class="`icon-element-${value[0]}`"></i>
            <i class="icon icon-m i-lucide:arrow-right"></i>
            <i class="icon icon-l" :class="`icon-element-${value[1]}`"></i>
          </div>
          <i class="icon icon-l" :class="`icon-element-${value[0]}`" v-else></i>
        </template>
      </stone-table>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
