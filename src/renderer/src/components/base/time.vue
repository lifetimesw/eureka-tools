<script lang="ts" setup>
import { createCalendar, Day } from '@renderer/utils/date.util'
import type { StyleValue } from 'vue'

interface TimeProps {
  type: 'minute' | 'hour' | 'day' | 'month' | 'year'
  modelValue: string
}
const props = withDefaults(defineProps<TimeProps>(), {
  type: 'minute',
  modelValue: '',
})
const emit = defineEmits(['update:modelValue'])

const weekArr = ['日', '一', '二', '三', '四', '五', '六']
const monthArr = [
  ['01', '02', '03'],
  ['04', '05', '06'],
  ['07', '08', '09'],
  ['10', '11', '12'],
]
const now = new Date()
const dateSelect = reactive({
  year: now.getFullYear(),
  month: now.getMonth(),
  day: now.getDate(),
  hour: now.getHours(),
  minute: now.getMinutes(),
})
const currentWindow = ref('')
const windowPosition = shallowRef<StyleValue>()
const showDate = computed(() => {
  return props.type === 'year' ? '逐年' : props.modelValue || '未选择'
})
const yearArr = computed(() => {
  const curYear = new Date().getFullYear()
  const result: number[] = []
  for (let i = curYear - 10; i <= curYear + 10; i++) {
    result.push(i)
  }
  return result
})
const dayArr = computed(() => {
  return createCalendar(dateSelect.year ?? 0, dateSelect.month ?? 0)
})

const iconRef = shallowRef()
const pickerRef = shallowRef()
const yearRef = shallowRef()
const dateRef = shallowRef()
const hourRef = shallowRef()
const minuteRef = shallowRef()
const dateTimeDateRef = shallowRef()
const dateTimeTimeRef = shallowRef()
const minuteWindowRef = shallowRef()
const hourWindowRef = shallowRef()
const dayWindowRef = shallowRef()
const monthWindowRef = shallowRef()
const windowRef = computed(() => {
  switch (props.type) {
    case 'minute': {
      return minuteWindowRef.value
    }
    case 'hour': {
      return hourWindowRef.value
    }
    case 'day': {
      return dayWindowRef.value
    }
    case 'month': {
      return monthWindowRef.value
    }
    default: {
      return null
    }
  }
})

function getComputedRect(element: HTMLElement): { width: number; height: number } {
  const computedStyle = window.getComputedStyle(element, null)
  const width = Number(computedStyle.getPropertyValue('width').match(/\d+/))
  const height = Number(computedStyle.getPropertyValue('height').match(/\d+/))
  return { width, height }
}
function setWindowPosition(): void {
  const position: StyleValue = {}
  const iconRect = iconRef.value.getBoundingClientRect()
  const pickerRect = pickerRef.value.getBoundingClientRect()
  const windowRect = getComputedRect(windowRef.value)

  const toBottom = pickerRect.bottom + windowRect.height
  const toRight = iconRect.left + windowRect.width
  if (toBottom > window.innerHeight) {
    position.top = `${pickerRect.top - windowRect.height - 5}px`
  } else {
    position.top = `${pickerRect.bottom + 3}px`
  }
  if (toRight > window.innerWidth) {
    position.left = `${pickerRect.right - windowRect.width}px`
  } else {
    position.left = `${props.type === 'month' ? iconRect.right : iconRect.left}px`
  }
  windowPosition.value = position
}
function showWindow(): void {
  if (currentWindow.value) {
    currentWindow.value = ''
  } else {
    currentWindow.value = props.type
    if (props.type === 'minute') {
      const dateRef = dateTimeDateRef.value
      const timeRef = dateTimeTimeRef.value
      if (dateRef && timeRef) {
        nextTick(() => {
          timeRef.style.height = dateRef.clientHeight + 'px'
          setWindowPosition()
          const hourEl = hourRef.value.children[dateSelect.hour ?? 0]
          const minuteEl = minuteRef.value.children[dateSelect.minute ?? 0]
          if (hourEl) {
            hourEl.scrollIntoView({ behavior: 'auto', block: 'center' })
          }
          if (minuteEl) {
            minuteEl.scrollIntoView({ behavior: 'auto', block: 'center' })
          }
        })
      }
    } else if (props.type !== 'year') {
      setWindowPosition()
      if (props.type === 'month') {
        nextTick(() => {
          const index = yearArr.value.findIndex((item) => item === dateSelect.year)
          const cYearEl = yearRef.value.children[index]
          cYearEl.scrollIntoView({ behavior: 'auto', block: 'center' })
        })
      }
    }
  }
}
function selectHour(hour: number): void {
  dateSelect.hour = hour
  updateDate()
}
function selectMinute(minute: number): void {
  dateSelect.minute = minute
  updateDate()
}
function selectDay(day: number): void {
  dateSelect.day = day
  updateDate()
  if (props.type === 'hour') {
    currentWindow.value = ''
  }
}
function selectMonth(month: number): void {
  dateSelect.month = month
  updateDate()
  currentWindow.value = ''
}
function selectYear(year: number): void {
  dateSelect.year = year
  updateDate()
  currentWindow.value = ''
}
function updateDate(): void {
  const year = dateSelect.year
  const month = dateSelect.month?.toString().padStart(2, '0')
  const day = dateSelect.day?.toString().padStart(2, '0')
  const hour = dateSelect.hour?.toString().padStart(2, '0')
  const minute = dateSelect.minute?.toString().padStart(2, '0')
  let currentDate = ''
  switch (props.type) {
    case 'month':
      currentDate = `${year}`
      break
    case 'day':
      currentDate = `${year}-${month}`
      break
    case 'hour':
      currentDate = `${year}-${month}-${day}`
      break
    case 'minute':
      currentDate = `${year}-${month}-${day} ${hour}:${minute}`
      break
  }
  emit('update:modelValue', currentDate)
}

function isCurrent(rowData: Day): boolean {
  return rowData.day === dateSelect.day && rowData.month === dateSelect.month && rowData.year === dateSelect.year
}

watch(
  () => [props.type, props.modelValue] as const,
  ([, newValue]) => {
    const date = newValue ? new Date(newValue) : new Date()
    dateSelect.year = date.getFullYear()
    dateSelect.month = date.getMonth() + 1
    dateSelect.day = date.getDate()
    dateSelect.hour = date.getHours()
    dateSelect.minute = date.getMinutes()
  },
  { immediate: true }
)

function hideFn(event: Event): void {
  if (currentWindow && !dateRef.value.contains(event.target)) {
    currentWindow.value = ''
  }
}

onMounted(() => {
  document.addEventListener('click', hideFn)
  document.addEventListener('scroll', hideFn, { capture: true })
})
onBeforeUnmount(() => {
  document.removeEventListener('click', hideFn)
  document.removeEventListener('scroll', hideFn, { capture: true })
})
</script>
<template>
  <div ref="dateRef" class="stone-time">
    <div ref="pickerRef" class="yds-picker" :class="[`${type}-picker`]">
      <div ref="iconRef" class="icon-date">
        <i class="icon i-lucide:calendar"></i>
      </div>
      <span class="picker-date" @click="showWindow">{{ showDate }}</span>
    </div>
    <Teleport to="body">
      <div
        v-if="type === 'minute'"
        v-show="currentWindow === 'minute'"
        ref="minuteWindowRef"
        class="stone-time-window-datetime"
        :style="windowPosition">
        <div ref="dateTimeDateRef" class="datetime-date">
          <div class="day-header">
            <span class="date-btn" @click="emit('update:modelValue', '')">清除</span>
            <div class="date-select">
              <select v-model="dateSelect.year" class="year-select">
                <option v-for="(item, index) in yearArr" :key="index" :value="item">{{ item }}</option>
              </select>
              <span>年</span>
              <select v-model="dateSelect.month" class="month-select">
                <option v-for="(item, index) in 12" :key="index" :value="item">
                  {{ item }}
                </option>
              </select>
              <span>月</span>
            </div>
            <span class="date-btn" @click="emit('update:modelValue', dayjs().format('YYYY-MM-DD HH:mm'))">今天</span>
          </div>
          <div class="day-table">
            <table>
              <thead>
                <tr>
                  <th v-for="(item, index) in weekArr" :key="index">{{ item }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(week, index) in dayArr" :key="index">
                  <td v-for="(dItem, dIndex) in week" :key="`${index}_${dIndex}`">
                    <span v-if="dItem.isCurrentMonth" class="current-month" :class="{ active: isCurrent(dItem) }" @click="selectDay(dItem.day)">
                      {{ dItem.day }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div ref="dateTimeTimeRef" class="datetime-time">
          <div ref="hourRef" class="hour-group">
            <div v-for="(item, index) in 24" :key="item" class="hour" :class="{ active: dateSelect.hour === index }" @click="selectHour(index)">
              <span>{{ String(index).padStart(2, '0') }}</span>
            </div>
          </div>
          <div ref="minuteRef" class="minute-group">
            <div v-for="(item, index) in 60" :key="item" class="minute" :class="{ active: dateSelect.minute === index }" @click="selectMinute(index)">
              <span>{{ String(index).padStart(2, '0') }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="type === 'hour'" v-show="currentWindow === 'hour'" ref="hourWindowRef" class="stone-time-window-hour" :style="windowPosition">
        <div class="date-select">
          <select v-model="dateSelect.year" style="width: 5em">
            <option v-for="(item, index) in yearArr" :key="index" :value="item">{{ item }}</option>
          </select>
          <span>年</span>
          <select v-model="dateSelect.month" style="width: 4em">
            <option v-for="(item, index) in 12" :key="index" :value="item">
              {{ item }}
            </option>
          </select>
          <span>月</span>
        </div>
        <div class="day-table">
          <table>
            <thead>
              <tr>
                <th v-for="(item, index) in weekArr" :key="index">{{ item }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(week, index) in dayArr" :key="index">
                <td v-for="(dItem, dIndex) in week" :key="`${index}_${dIndex}`">
                  <span
                    v-if="dItem.isCurrentMonth"
                    class="current-month"
                    :class="{ active: dItem.date === modelValue }"
                    @click="selectDay(dItem.day)">
                    {{ dItem.day }}
                  </span>
                  <!-- <span v-else>{{ dItem.day }}</span> -->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else-if="type === 'day'" v-show="currentWindow === 'day'" ref="dayWindowRef" class="stone-time-window-day" :style="windowPosition">
        <div class="year-switch">
          <div class="pre-year" @click="dateSelect.year--" />
          <span>{{ dateSelect.year }}</span>
          <div class="next-year" @click="dateSelect.year++" />
        </div>
        <div class="month-table">
          <table>
            <tbody>
              <tr v-for="(item, index) in monthArr" :key="index">
                <td v-for="(mItem, mIndex) in item" :key="`${index}_${mIndex}`">
                  <span class="current-month" :class="{ active: `${dateSelect.year}-${mItem}` === modelValue }" @click="selectMonth(Number(mItem))">
                    {{ mItem }}月
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        v-else-if="type === 'month'"
        v-show="currentWindow === 'month'"
        ref="monthWindowRef"
        class="stone-time-window-month"
        :style="windowPosition">
        <ul ref="yearRef">
          <li v-for="(item, index) in yearArr" :key="index" :class="{ active: item === Number(modelValue) }" @click="selectYear(item)">
            {{ item }}
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>
