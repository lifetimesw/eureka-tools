<script setup lang="ts">
import type { DataCenter, World } from '@renderer/types/market.type'
import { computed, onMounted, reactive, ref, shallowRef, toRaw, watch } from 'vue'
import constants from '@renderer/api/constants'
import { axiosRequest } from '@renderer/api/request'
import { StoneMessage } from '@renderer/components/base/message'
import {
  getHistoryData,
  getMarketable,
  getPinData,
  getServerData,
  setHistoryData,
  setPinData,
  updateMarketable,
  updateServerData,
} from '@renderer/utils/market.util'
import { IpcResponse } from '@shared/response'

interface Item {
  id?: number
  icon?: string
  name?: string
  enName?: string
  sheet?: string
}
interface SearchResult {
  row_id: number
  fields: {
    Name: string
    Icon: {
      id: number
      path: string
    }
  }
  score: number
  sheet: string
}
interface TableRow {
  hq: boolean
  worldName: string
  pricePerUnit: string
  quantity: number
  total: string
  retainerName?: string
  buyerName?: string
  buyTime?: string
}
interface PriceResult {
  lastUploadTime: string
  worldName?: string
  listings: {
    hq: boolean
    worldName: string
    pricePerUnit: number
    quantity: number
    total: number
    retainerName: string
  }[]
  recentHistory: {
    hq: boolean
    worldName: string
    pricePerUnit: number
    quantity: number
    total: number
    buyerName: string
    timestamp: number
  }[]
}

const marketColumns = [
  { key: 'worldName', title: '区服' },
  { key: 'hq', title: 'HQ' },
  { key: 'pricePerUnit', title: '单价' },
  { key: 'quantity', title: '数量' },
  { key: 'total', title: '总计' },
  { key: 'retainerName', title: '雇员' },
]
const historyColumns = [
  { key: 'worldName', title: '区服' },
  { key: 'hq', title: 'HQ' },
  { key: 'pricePerUnit', title: '单价' },
  { key: 'quantity', title: '数量' },
  { key: 'total', title: '总计' },
  { key: 'buyerName', title: '买家' },
  { key: 'buyTime', title: '时间' },
]

const isUpdating = ref(false)
const marketableList = ref<number[]>([])
const lastUploadTime = ref('')

const marketType = ref(1)
const marketTypeList = [
  { type: 1, name: '当前' },
  { type: 2, name: '历史' },
]
const itemName = ref('')
const itemList = ref<Item[]>([])
const itemInfo = ref<Item>({})
const historyItems = reactive<Item[]>([])
const pinItems = reactive<Item[]>([])
const priceResult = shallowRef<PriceResult | null>(null)

function getBuyTime(timestamp: number): string {
  const now = new Date()
  const target = new Date(timestamp)
  const diffMs = now.getTime() - target.getTime()
  const diffHours = diffMs / 3600000
  if (diffHours < 24) {
    if (diffMs < 60000) return '刚刚'
    if (diffMs < 3600000) {
      const minutes = Math.floor(diffMs / 60000)
      return `${minutes}分钟前`
    }
    const hours = Math.floor(diffHours)
    return `${hours}小时前`
  }
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfTargetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  const diffDays = Math.floor((startOfToday.getTime() - startOfTargetDay.getTime()) / 86400000)
  if (diffDays === 1) return '昨天'
  return `${diffDays}天前`
}

/* 读取缓存 */
async function loadMarketableList(): Promise<void> {
  try {
    const marketableInfo = await getMarketable()
    const { lastUpdated, itemIds } = marketableInfo
    marketableList.value = itemIds || []

    const now = Date.now()
    const updateGap = 7 * 24 * 60 * 60 * 1000

    // 如果数据为空或过期，则更新
    if (marketableList.value.length === 0 || now - Number(lastUpdated) > updateGap) {
      await updateMarketable()
      // 更新后重新加载
      const newData = await getMarketable()
      marketableList.value = newData.itemIds || []
    }
  } catch (error) {
    console.error('Load marketable error:', error)
    // 如果读取失败（例如文件不存在），尝试更新
    await updateMarketable()
    const newData = await getMarketable()
    marketableList.value = newData.itemIds || []
  }
}
/* 更新缓存 */
async function handleUpdateMarketable(): Promise<void> {
  if (isUpdating.value) {
    return
  }
  isUpdating.value = true
  try {
    // 调用更新接口
    await updateMarketable()
    // 更新成功后，重新加载本地数据以反映最新状态
    await loadMarketableList()
    // 可选：提示用户成功
    StoneMessage.success('市场数据已更新')
  } catch (error) {
    console.error('更新市场数据失败:', error)
    // ElMessage.error('更新失败')
  } finally {
    isUpdating.value = false
  }
}

/* 获取服务器信息 */
const regionKey = ref('中国')
const dataCenterKey = ref('莫古力')
const worldKey = ref<string | number>('')
const worldMap = ref<Record<string, World>>({})
const regionMap = ref<Record<string, DataCenter[]>>({})
const dataCenterMap = ref<Record<string, DataCenter>>({})

const tableData = computed(() => {
  let dataArr: TableRow[] = []
  let columns = marketType.value === 1 ? marketColumns : historyColumns
  if (priceResult.value) {
    if (marketType.value === 1) {
      dataArr = priceResult.value.listings.map((item) => ({
        hq: item.hq,
        worldName: priceResult.value?.worldName || item.worldName,
        pricePerUnit: item.pricePerUnit.toLocaleString(),
        quantity: item.quantity,
        total: item.total.toLocaleString(),
        retainerName: item.retainerName,
      }))
    } else {
      dataArr = priceResult.value.recentHistory.map((item) => {
        return {
          hq: item.hq,
          worldName: priceResult.value?.worldName || item.worldName,
          pricePerUnit: item.pricePerUnit.toLocaleString(),
          quantity: item.quantity,
          total: item.total.toLocaleString(),
          buyerName: item.buyerName,
          buyTime: getBuyTime(item.timestamp * 1000),
        }
      })
    }
  }
  return {
    columns,
    dataArr,
  }
})

const regionListComputed = computed(() => {
  return Object.keys(regionMap.value)
})
const dataCenterListComputed = computed(() => {
  const all = { name: regionKey.value, region: regionKey.value, worlds: [] }
  if (Object.hasOwn(regionMap.value, regionKey.value)) {
    const result = Array.from(regionMap.value[regionKey.value])
    result.unshift(all)
    return result
  }
  return [all]
})
const worldListComputed = computed(() => {
  if (Object.hasOwn(dataCenterMap.value, dataCenterKey.value)) {
    const result = Array.from(dataCenterMap.value[dataCenterKey.value].worlds)
    result.unshift(dataCenterKey.value)
    return result
  }
  return [dataCenterKey.value]
})

function processServerData(worlds: World[], dataCenters: DataCenter[]): void {
  const cMap: Record<string, World> = {}
  worlds.forEach((item) => {
    cMap[item.id] = item
  })
  worldMap.value = cMap

  const cRegionMap: Record<string, DataCenter[]> = {}
  const cDataCenterMap: Record<string, DataCenter> = {}

  dataCenters.forEach((item) => {
    cDataCenterMap[item.name] = item
    if (Object.hasOwn(cRegionMap, item.region)) {
      cRegionMap[item.region].push(item)
    } else {
      cRegionMap[item.region] = [item]
    }
  })

  if (!Object.hasOwn(cRegionMap, regionKey.value)) {
    const keys = Object.keys(cRegionMap)
    if (keys.length > 0) {
      regionKey.value = keys[0]
    }
  }

  // 初始化选择
  if (regionKey.value && Object.hasOwn(cRegionMap, regionKey.value)) {
    if (Object.hasOwn(cDataCenterMap, dataCenterKey.value)) {
      worldKey.value = dataCenterKey.value
    } else {
      dataCenterKey.value = regionKey.value
      worldKey.value = regionKey.value
    }
  } else if (Object.keys(cDataCenterMap).length > 0) {
    //  fallback
    const firstDc = Object.values(cDataCenterMap)[0]
    regionKey.value = firstDc.region
    dataCenterKey.value = firstDc.name
    worldKey.value = firstDc.name
  }

  regionMap.value = cRegionMap
  dataCenterMap.value = cDataCenterMap
}
async function loadWorldsAndDataCenters(): Promise<void> {
  try {
    // 尝试从本地加载
    const serverData = await getServerData()
    if (serverData && serverData.worlds.length && serverData.dataCenters.length) {
      processServerData(serverData.worlds, serverData.dataCenters)
    } else {
      await updateServerData()
      loadWorldsAndDataCenters()
    }
  } catch {
    StoneMessage.error('加载服务器数据失败')
    // console.log('No cached server data or expired, fetching from network')
  }
}
function handleRegionChange(): void {
  dataCenterKey.value = regionKey.value
  worldKey.value = regionKey.value
  loadPriceInfo()
}
function handleDataCenterChange(): void {
  worldKey.value = dataCenterKey.value
  loadPriceInfo()
}

/* 获取物品信息和价格 */
const priceRequestKey = ref('')
function getIconById(id: number): string {
  // const path = item.fields.Icon.path.match(/ui\/icon\/(.*?)\.tex$/)
  // icon: path && path[1] ? `https://xivapi.com/i/${path[1]}.png` : null,
  const iconname = id.toString().padStart(6, '0')
  const iconParent = `${iconname.slice(0, 3)}000`
  return `https://xivapi.com/i/${iconParent}/${iconname}.png`
}
function loadPriceInfo(): void {
  if (priceRequestKey.value) {
    axiosRequest.cancel(priceRequestKey.value)
  }
  priceResult.value = null
  lastUploadTime.value = ''
  if (itemInfo.value.id) {
    const reqData = {
      listings: '200',
      // hq: true,
      noGst: true,
    }
    const url = `${constants.url.universalis}/api/${worldKey.value}/${itemInfo.value.id}`
    priceRequestKey.value = `get:${url}:${JSON.stringify(reqData)}`
    axiosRequest.get(url, reqData, { requestKey: priceRequestKey.value }).then((response: unknown) => {
      if (response as PriceResult) {
        const result = response as PriceResult
        lastUploadTime.value = new Date(result.lastUploadTime).toLocaleString()
        priceResult.value = result
      }
    })
  }
}
function loadItemInfo(item: Item): void {
  itemInfo.value = item
  const hIndex = historyItems.findIndex((x) => x.id === item.id)
  const pIndex = pinItems.findIndex((x) => x.id === item.id)
  if (pIndex === -1 && hIndex === -1) {
    if (historyItems.length >= 10 - pinItems.length) {
      historyItems.pop()
    }
    historyItems.unshift(item)
  }
  loadPriceInfo()
}
function loadBlurItem(): void {
  if (itemName.value.trim() === '') {
    return
  }
  const enNameKey = 'Name@lang(en)'
  const reqData = {
    query: `Name~"${itemName.value}"`,
    sheets: 'Item',
    fields: `Name,${enNameKey},Icon`,
  }
  itemList.value = []
  axiosRequest.get(`${constants.url.cafemaker}/api/search`, reqData).then((response: unknown) => {
    if (response) {
      const dataArr = (response as { results: SearchResult[] }).results
        .filter((item: SearchResult) => marketableList.value.includes(item.row_id))
        .map((item: SearchResult) => {
          return {
            id: item.row_id,
            name: item.fields.Name,
            enName: item.fields[enNameKey],
            icon: getIconById(item.fields.Icon.id),
            score: item.score,
            sheet: item.sheet,
          }
        })
      itemList.value = dataArr
    }
  })
}

/* 物品复制和WIKI跳转 */
function copy(content?: string): void {
  if (content) {
    window.api.clipboard.writeText(content).then((result: IpcResponse) => {
      if (result.success) {
        StoneMessage.success('复制成功')
      }
    })
  }
}
function goToWiki(): void {
  if (itemInfo.value.name) {
    window.api.shell.openExternal(`https://ff14.huijiwiki.com/wiki/物品:${itemInfo.value.name}`).then((result: IpcResponse) => {
      if (result.success) {
        StoneMessage.success('打开成功')
      }
    })
  }
}

async function loadHistoryData(): Promise<void> {
  const historyData = ((await getHistoryData()) as Item[]) || []
  const pinData = ((await getPinData()) as Item[]) || []
  historyItems.push(...historyData)
  pinItems.push(...pinData)
}
function handlePin(item): void {
  pinItems.push(item)
  const hIndex = historyItems.findIndex((x) => x.id === item.id)
  historyItems.splice(hIndex, 1)
}
function handlePinOff(item): void {
  historyItems.unshift(item)
  const pIndex = pinItems.findIndex((x) => x.id === item.id)
  pinItems.splice(pIndex, 1)
}
watch(historyItems, (newHistoryItems) => {
  setHistoryData(toRaw(newHistoryItems))
})
watch(pinItems, (newPinItems) => {
  setPinData(toRaw(newPinItems))
})

onMounted(() => {
  loadMarketableList()
  loadWorldsAndDataCenters()
  loadHistoryData()
})
</script>

<template>
  <div class="w-full h-full of-hidden f-center-start text-[0.875rem]">
    <div class="h-full px-1em w-22em b-r-solid b-r-blueGray b-r-1">
      <div class="h-3em w-full gap-1 f-center-start">
        <input v-model="itemName" type="text" class="flex-1 normal-input" @keyup.enter="loadBlurItem" />
        <button class="flex-shrink-0 normal-button" @click="loadBlurItem">查询</button>
        <button v-title="'更新可交易物品列表'" class="flex-shrink-0 normal-button" :disabled="isUpdating" @click="handleUpdateMarketable">
          {{ isUpdating ? '更新中...' : '更新' }}
        </button>
      </div>
      <div class="h-[calc(100%-26em)] w-full overflow-y-auto">
        <div
          v-for="item in itemList"
          :key="item.id"
          class="cursor-pointer h-2em w-full f-center-start hover:text-blue"
          :class="{ active: item.id === itemInfo.id }"
          @click="loadItemInfo(item)">
          <img class="mr-1 icon" :src="item.icon" />
          <span>{{ item.name }}</span>
        </div>
      </div>
      <div class="h-22em w-full">
        <div class="divider">
          <div class="divider-line-left"></div>
          <span class="divider-text">历史</span>
          <div class="divider-line-right"></div>
        </div>
        <div class="h-[calc(100%-2em)] w-full overflow-y-auto">
          <div class="h-2em w-full group f-center-start" :class="{ active: item.id === itemInfo.id }" v-for="item in pinItems" :key="item.id">
            <div class="cursor-pointer f-center" :class="{ active: item.id === itemInfo.id }" @click="loadItemInfo(item)">
              <img class="mr-1 icon" :src="item.icon" />
              <span>{{ item.name }}</span>
            </div>
            <i class="cursor-pointer ml-auto icon-m i-lucide:pin hover:i-lucide:pin-off" @click="handlePinOff(item)"></i>
          </div>
          <div class="h-2em w-full group f-center-start" v-for="item in historyItems" :key="item.id">
            <div class="cursor-pointer f-center hover:text-blue" :class="{ active: item.id === itemInfo.id }" @click="loadItemInfo(item)">
              <img class="mr-1 icon" :src="item.icon" />
              <span>{{ item.name }}</span>
            </div>
            <i class="cursor-pointer ml-auto icon-m i-lucide:pin hidden group-hover:inline-block" @click="handlePin(item)"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="h-full flex-1 px-1em">
      <div class="h-4em w-full f-center-start">
        <img v-show="itemInfo.icon" class="h-3em mr-1 w-3em inline-block" :src="itemInfo.icon" alt="" />
        <div class="flex-1 f-start-center-col">
          <div class="f-center-center">
            <span class="font-bold text-lg">{{ itemInfo.name || '--' }}</span>
            <i class="cursor-pointer ml-xs i-lucide:copy hover:text-blue" @click="copy(itemInfo.name)" />
          </div>
          <!-- <span class="stack">EN：{{ itemInfo.enName || '--' }}</span> -->
          <span class="cursor-pointer text-sm hover:text-blue" @click="goToWiki" v-show="itemInfo.name">在Wiki中查看</span>
        </div>
      </div>
      <div class="h-[calc(100%-4em)] w-full">
        <div class="h-3em gap-1 f-center">
          <select v-model="regionKey" class="normal-select" @change="handleRegionChange">
            <option v-for="item in regionListComputed" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
          <select v-model="dataCenterKey" class="normal-select" @change="handleDataCenterChange">
            <option v-for="item in dataCenterListComputed" :key="item.name" :value="item.name">
              {{ item.name }}
            </option>
          </select>
          <select v-model="worldKey" class="normal-select" @change="loadPriceInfo">
            <option v-for="item in worldListComputed" :key="item" :value="item">
              {{ typeof item === 'number' ? worldMap[item].name : item }}
            </option>
          </select>
          <stone-type v-model="marketType" :list="marketTypeList"></stone-type>
          <span class="ml-[0.5em] lh-1em" v-title="'最后上传时间'">{{ lastUploadTime }}</span>
        </div>
        <div class="h-[calc(100%-3em)] w-full">
          <stone-table :table-data="tableData" class="cold" fix-head show-total-size>
            <template #hq="{ value }">
              <img v-if="value" class="align-middle" src="@renderer/assets/images/icons/hq.png" alt="" />
            </template>
          </stone-table>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
