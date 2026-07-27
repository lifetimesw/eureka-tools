<script lang="ts" setup>
import { createCalendar, Day } from '@renderer/utils/date.util'
import { useElementBounding } from '@vueuse/core'
import type { StyleValue } from 'vue'

interface TimeProps {
  type: 'minute' | 'day' | 'month' | 'year'
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
const formatType = {
  year: 'YYYY',
  month: 'YYYY-MM',
  day: 'YYYY-MM-DD',
  minute: 'YYYY-MM-DD HH:mm',
}

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

const iconRef = useTemplateRef('iconRef')
const pickerRef = useTemplateRef('pickerRef')
const yearRef = useTemplateRef('yearRef')
const hourRef = useTemplateRef('hourRef')
const minuteRef = useTemplateRef('minuteRef')
const dateTimeDateRef = useTemplateRef('dateTimeDateRef')
const dateTimeTimeRef = useTemplateRef('dateTimeTimeRef')
const minuteWindowRef = useTemplateRef('minuteWindowRef')
const dayWindowRef = useTemplateRef('dayWindowRef')
const monthWindowRef = useTemplateRef('monthWindowRef')
const yearWindowRef = useTemplateRef('yearWindowRef')
const windowRef = computed(() => {
  switch (props.type) {
    case 'minute': {
      return minuteWindowRef.value
    }
    case 'day': {
      return dayWindowRef.value
    }
    case 'month': {
      return monthWindowRef.value
    }
    case 'year': {
      return yearWindowRef.value
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
  if (!iconRef.value || !pickerRef.value || !windowRef.value) return
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
          if (!hourRef.value || !minuteRef.value) return
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
          if (!yearRef.value) return
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
function selectDay(dayData: Day): void {
  dateSelect.year = dayData.year
  dateSelect.month = dayData.month
  dateSelect.day = dayData.day
  updateDate()
}
function selectMonth(month: number): void {
  dateSelect.month = month
  dateSelect.day = Math.min(dateSelect.day, new Date(dateSelect.year, dateSelect.month, 0).getDate())
  updateDate()
}
function selectYear(year: number): void {
  dateSelect.year = year
  updateDate()
  currentWindow.value = ''
}
function updateDate(): void {
  const date = new Date(dateSelect.year, (dateSelect.month ?? 1) - 1, dateSelect.day ?? 1, dateSelect.hour ?? 0, dateSelect.minute ?? 0)

  let currentDate = formatType[props.type] ? dayjs(date).format(formatType[props.type]) : ''

  emit('update:modelValue', currentDate)
}

function isCurrent(rowData: Day): boolean {
  return rowData.day === dateSelect.day && rowData.month === dateSelect.month && rowData.year === dateSelect.year
}
function isToday(rowData: Day): boolean {
  const today = new Date()
  return rowData.day === today.getDate() && rowData.month === today.getMonth() + 1 && rowData.year === today.getFullYear()
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

const { x: pickerX, y: pickerY } = useElementBounding(pickerRef)
watch([pickerX, pickerY], () => {
  if (currentWindow.value) {
    currentWindow.value = ''
  }
})
function handleClickFn(event: Event): void {
  const targetEl = event.target as HTMLElement | null
  if (currentWindow.value && !pickerRef.value?.contains(targetEl) && windowRef.value && !windowRef.value.contains(targetEl)) {
    currentWindow.value = ''
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickFn)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickFn)
})
</script>
<template>
  <div class="stone-time">
    <div ref="pickerRef" class="stone-time-picker" :class="[`${type}-picker`]" @click="showWindow">
      <div ref="iconRef" class="icon-date">
        <i class="icon i-lucide:calendar"></i>
      </div>
      <span class="picker-date">{{ showDate }}</span>
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
              <select v-model="dateSelect.month" class="month-select" @change="selectMonth(dateSelect.month)">
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
                    <span
                      class="day"
                      :class="{ 'current-month': dItem.isCurrentMonth, 'active': isCurrent(dItem), 'today': isToday(dItem) }"
                      @click="selectDay(dItem)">
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
      <div v-if="type === 'day'" v-show="currentWindow === 'day'" ref="dayWindowRef" class="stone-time-window-hour" :style="windowPosition">
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
                    class="day"
                    :class="{ 'current-month': dItem.isCurrentMonth, 'active': isCurrent(dItem), 'today': isToday(dItem) }"
                    @click="selectDay(dItem)">
                    {{ dItem.day }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else-if="type === 'month'" v-show="currentWindow === 'month'" ref="monthWindowRef" class="stone-time-window-day" :style="windowPosition">
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
      <div v-else-if="type === 'year'" v-show="currentWindow === 'year'" ref="yearWindowRef" class="stone-time-window-month" :style="windowPosition">
        <ul ref="yearRef">
          <li v-for="(item, index) in yearArr" :key="index" :class="{ active: item === Number(modelValue) }" @click="selectYear(item)">
            {{ item }}
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>
