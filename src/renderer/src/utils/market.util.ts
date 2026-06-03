import type { DataCenter, MarketBoardData, ServerData, World } from '@renderer/types/market.type'
import constants from '@renderer/api/constants'
import { axiosRequest } from '@renderer/api/request'
import { IpcResponse } from '@shared/response'

/* 获取可交易物品列表 */
export function updateMarketable(): Promise<void> {
  return new Promise((resolve, reject) => {
    axiosRequest.get(`${constants.url.universalis}/api/marketable`, {}).then(async (response: unknown) => {
      if (response) {
        const marketableData: MarketBoardData = {
          lastUpdated: Date.now(),
          itemIds: response as number[],
        }
        try {
          await window.api.store.set('marketableData', marketableData)
          resolve()
        } catch {
          reject(new Error('Failed to parse marketable'))
        }
      } else {
        reject(new Error('Failed to fetch marketable data from Universalis'))
      }
    })
  })
}
export function getMarketable(): Promise<MarketBoardData> {
  return new Promise<MarketBoardData>((resolve) => {
    window.api.store.get('marketableData').then((response: IpcResponse<unknown>) => {
      if (response) {
        const marketableInfo = response.data as MarketBoardData
        resolve(marketableInfo)
      } else {
        resolve({
          lastUpdated: 0,
          itemIds: [],
        })
      }
    })
  })
}

export function updateServerData(): Promise<void> {
  return new Promise((resolve, reject) => {
    // 如果缓存无效或不存在，从网络获取
    try {
      // 并行请求两个接口
      Promise.all([
        new Promise<World[]>((resolve, reject) => {
          axiosRequest.get(`${constants.url.universalis}/api/v2/worlds`, {}).then((response: unknown) => {
            if (response) {
              resolve(response as World[])
            } else {
              reject(new Error('Failed to fetch worlds'))
            }
          })
        }),
        new Promise<DataCenter[]>((resolve, reject) => {
          axiosRequest.get(`${constants.url.universalis}/api/v2/data-centers`, {}).then((response: unknown) => {
            if (response) {
              resolve(response as DataCenter[])
            } else {
              reject(new Error('Failed to fetch data centers'))
            }
          })
        }),
      ])
        .then(([worldsRes, dcRes]) => {
          // 保存到本地
          setServerData(worldsRes, dcRes)
          resolve()
        })
        .catch((error: unknown) => {
          reject(error)
        })
    } catch {
      reject(new Error('Failed to load server data'))
    }
  })
}

/* 获取区服信息 */
export async function setServerData(worlds: World[], dataCenters: DataCenter[]): Promise<void> {
  const serverData: ServerData = {
    worlds,
    dataCenters,
  }
  try {
    await window.api.store.set('serverData', serverData)
  } catch {
    throw new Error('Failed to set server data')
  }
}
export function getServerData(): Promise<ServerData> {
  return new Promise((resolve, reject) => {
    window.api.store
      .get('serverData')
      .then((response: IpcResponse) => {
        try {
          const serverData = response.data as ServerData
          resolve(serverData)
        } catch {
          reject(new Error('Failed to parse server data'))
        }
      })
      .catch((error: unknown) => {
        reject(error)
      })
  })
}

export async function setHistoryData(historyData: unknown): Promise<void> {
  try {
    await window.api.store.set('historyData', historyData)
  } catch {
    throw new Error('Failed to set server data')
  }
}
export function getHistoryData(): Promise<unknown[]> {
  return new Promise((resolve, reject) => {
    window.api.store
      .get('historyData')
      .then((response: IpcResponse) => {
        try {
          const historyData = response.data as unknown[]
          resolve(historyData)
        } catch {
          reject(new Error('Failed to parse server data'))
        }
      })
      .catch((error: unknown) => {
        reject(error)
      })
  })
}

export async function setPinData(pinData: unknown): Promise<void> {
  try {
    await window.api.store.set('pinData', pinData)
  } catch {
    throw new Error('Failed to set server data')
  }
}
export function getPinData(): Promise<unknown[]> {
  return new Promise((resolve, reject) => {
    window.api.store
      .get('pinData')
      .then((response: IpcResponse) => {
        try {
          const pinData = response.data as unknown[]
          resolve(pinData)
        } catch {
          reject(new Error('Failed to parse server data'))
        }
      })
      .catch((error: unknown) => {
        reject(error)
      })
  })
}
