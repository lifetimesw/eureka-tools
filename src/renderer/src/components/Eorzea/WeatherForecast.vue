<script lang="ts" setup>
import { useWeatherForecast, WeatherForecastProps, FORECAST_STATUS } from '@renderer/hooks/Eorzea/useWeatherForecast'
import { WeatherRate } from '@renderer/types/eureka.type'

import { EorzeaClock } from '@renderer/utils/clock.util'
import { Eureka } from '@renderer/utils/eureka.util'
import { computed } from 'vue'

const props = withDefaults(defineProps<WeatherForecastProps>(), {
  areaId: 'area.EurekaAnemos',
  startClock: () => new EorzeaClock(),
  endClock: () => new EorzeaClock(),
})
const {
  areaName,
  weatherLock,
  forecastComputed,
  getForecastStatus,
  handleLock,
  getWeatherProgress,
  setWeatherRef,
  copyForeastWeather,
  copyWeather,
  resize,
} = useWeatherForecast(props)

const weatherList = Eureka.getAreaWeather(props.areaId)
const weatherMap = weatherList.reduce(
  (acc, cur) => {
    acc[cur.weather] = cur
    return acc
  },
  {} as Record<string, WeatherRate>
)
const weatherLockNames = computed(() => {
  return weatherLock.map((item) => weatherMap[item].name)
})

defineExpose({ resize })
</script>
<template>
  <div class="ulk-weather">
    <div class="area-header">
      <div class="f-center-start">
        <span class="text-5">{{ areaName }}</span>
        <i class="cursor-pointer ml-2 icon-s i-lucide:copy" @click="copyForeastWeather"></i>
        <div class="ml-4em gap-2 if-start-start">
          <i
            v-for="item in weatherList"
            :key="item.weather"
            v-title="item.name"
            class="cursor-pointer icon icon-l"
            :class="[`icon-eureka-${item.weather}`, { 'weather-active': weatherLock.includes(item.weather) }]"
            @click="handleLock(item.weather)"></i>
        </div>
        <span class="cursor-default font-400 ml-2 text-3">点击筛选</span>
        <span v-show="weatherLockNames.length" class="cursor-default font-400 ml-2 text-3 text-orange-600">({{ weatherLockNames.join(', ') }})</span>
      </div>
    </div>
    <div class="area-foreasts custom-scroll">
      <div
        v-for="(item, index) in forecastComputed"
        v-show="item.show"
        :ref="(el) => setWeatherRef(el, item)"
        :key="index"
        class="foreast-item"
        :class="{
          'foreast-before': getForecastStatus(item) === FORECAST_STATUS.BEFORE,
          'foreast-current': getForecastStatus(item) === FORECAST_STATUS.CURRENT,
          'foreast-after': getForecastStatus(item) === FORECAST_STATUS.AFTER,
          'foreast-locked': weatherLock.includes(item.weather),
          'start': item.type === 'start',
          'middle': item.type === 'middle',
          'end': item.type === 'end',
          'single': item.type === 'single',
        }"
        @click="handleLock(item.weather)"
        @contextmenu.prevent.stop="copyWeather(item, index)">
        <span class="foreast-lt-date">{{ item.localDateStr }}</span>
        <div class="foreast-weather">
          <i class="icon" :class="`icon-eureka-${item.weather}`"></i>
          <span>{{ item.name }}</span>
        </div>
        <span class="foreast-lt-time">{{ item.localTimeStr }}</span>
        <span class="foreast-et">{{ item.time }}</span>
        <div v-if="getForecastStatus(item) === FORECAST_STATUS.CURRENT" class="weather-progress-bar">
          <div class="weather-progress-fill" :style="{ width: getWeatherProgress(item) + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ulk-weather {
  width: 100%;
  height: auto;
  margin-bottom: 0.625em;
  .area-header {
    width: 100%;
    height: auto;
    font-weight: bold;
    text-align: left;
    // border-bottom: 1px solid rgb(226, 232, 240);
    .title {
      font-size: 1.25rem;
    }
    .weather-active {
      border: 2px solid #ea580c;
      border-radius: 50%;
    }
  }
  .area-foreasts {
    width: 100%;
    height: auto;
    padding: 0.25em 0;
    white-space: nowrap;
    scroll-behavior: smooth;
    overflow-x: scroll;
    text-align: left;
    .foreast-item {
      @include inline-flex(center, space-between, column);
      position: relative;
      width: 7em;
      height: 7em;
      margin: 0 0.2em;
      padding: 0.5em 0;
      vertical-align: top;
      border: 1px solid #d8e0eb;
      border-radius: 0.5em;
      cursor: pointer;
      transition: margin 0.2s linear;
      &.head {
        width: 4em;
      }

      .foreast-weather {
        @include flex();
        width: 100%;
        .icon {
          margin-right: 0.5em;
        }
      }
      .foreast-lt-date {
        font-size: 0.75rem;
        color: #9aa9bf;
      }
      .foreast-lt-time {
        font-size: 1.125rem;
        font-weight: 700;
      }
      .foreast-et {
        font-size: 0.75rem;
        font-weight: 400;
      }
      .weather-progress-bar {
        position: absolute;
        bottom: 0.25em;
        left: 0.5em;
        width: calc(100% - 1em);
        height: 3px;
        background-color: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
        .weather-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0ea5e9, #0284c7);
          border-radius: 4px;
          transition: width 0.2s linear;
        }
      }

      &:hover {
        border-color: #94a3b8;
        background: #f8fafc;
      }
      &.foreast-before {
        opacity: 0.55;
        filter: grayscale(0.3);
        background: #f1f5f9;
        border-color: #cbd5e1;
        &:hover {
          opacity: 0.7;
          filter: grayscale(0.2);
          background: #f8fafc;
        }
      }
      &.foreast-current {
        background: #f0f9ff;
        border-color: #0ea5e9;
        // box-shadow: 0 6px 14px rgba(14, 165, 233, 0.12);
        color: #0f172a;
        font-weight: 500;
        color: #0369a1;
      }
      &.foreast-locked {
        // background: #eff6ff;
        // border: 1px solid #7dd3fc;
        box-shadow: none;
        .weather-progress-fill {
          background-color: #0284c7; // 深一点的蓝色
        }
      }
      &.start {
        border-right: none;
        margin-right: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      &.middle {
        border-right: none;
        border-left: none;
        margin: 0;
        border-radius: 0;
      }
      &.end {
        border-left: none;
        margin-left: 0;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
}
</style>
