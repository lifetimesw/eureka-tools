export type Language = 'chs' | 'ja' | 'en' | 'de' | 'fr' | 'ko'

export interface MarketBoardData {
  lastUpdated: number
  itemIds: number[]
}

export interface World {
  id: number
  name: string
}
export interface DataCenter {
  name: string
  region: string
  worlds: (string | number)[]
}

export interface ServerData {
  worlds: World[]
  dataCenters: DataCenter[]
}
