import type { ComputedRef, Ref } from 'vue'

interface HandleOptions {
  childFn: (data: object) => void
  orderChange: (data: object) => void
  pageChange: (page: number) => void
  pageSizeChange: (pageSize: number) => void
}

export type RenderType = 'button' | 'radio' | 'checkbox'
export interface RenderData {
  key: string
  totalIndex: number
  index: number
  checked?: boolean
  row?: RowRow
}
export interface ColumnRow {
  key: string
  title: string
  children?: ColumnRow[]
  isLeaf: boolean
  offset: number
  startOffset: number
  endOffset: number
  colspan: number
  rowspan: number
  [key: string]: unknown
}
export interface RowRow {
  orderBy?: number
  [key: string]: string | number | boolean | unknown[] | Record<string, { buttons?: { name: string }[] }> | undefined
}
export interface MergeRow {
  s: { r: number; c: number }
  e: { r: number; c: number }
}
export type ColumnValue<C extends { key: string }, I> = C['key'] extends keyof I ? I[C['key']] : unknown
export type Slots = {
  [K in ColumnRow[][number] as K['key']]: (props: {
    row?: RowRow
    column?: ColumnRow
    index?: number
    page?: number
    value?: ColumnValue<K, RowRow>
  }) => unknown
}

export interface TableProps {
  tableData: { columns: ColumnRow[]; dataArr: RowRow[] }
  bodyMerge?: MergeRow[]
  isPagination?: boolean
  pageSize?: number
  paginationType?: 'local' | 'online'
  currentPage?: number
  totalPage?: number
  totalSize?: number
  showPageSize?: boolean
  pageSizeArr?: number[]
  showTotalSize?: boolean
  customOrder?: boolean
  autoOrder?: boolean
  orderKeys?: string[]
  fixHead?: boolean
  fixed?: number[]
  zIndex?: number
  mergeMethod?: (
    row: RowRow,
    col: ColumnRow,
    rowIndex: number,
    colIndex: number,
    showRows: RowRow[]
  ) => number[] | { rowspan: number; colspan: number }
}

interface SpanInfo {
  show: boolean
  rowspan: number
  colspan: number
}
interface Span {
  rowIndex: number
  colIndex: number
  colspan: number
  rowspan: number
}
interface HideTd {
  colIndex: number
  rowIndex: number
}
interface UseTableReturn {
  fixedData: ComputedRef<{ left: number; right: number }>
  bodyMergeComputed: ComputedRef<{ spans: Span[]; hideTd: HideTd[] }>
  columns: Ref<ColumnRow[][]>
  columnKeys: Ref<ColumnRow[]>
  rows: Ref<RowRow[]>
  getSpanByArr: (rowIndex: number, colIndex: number) => SpanInfo
  getSpan: (row: RowRow, col: ColumnRow, rowIndex: number, colIndex: number) => SpanInfo
  renderFn: (type: RenderType, data: RenderData) => void
  selectAll: () => void
  orderKey: Ref<string>
  orderType: Ref<string>
  orderList: ComputedRef<ColumnRow[]>
  orderChange: () => void
  pageComputed: ComputedRef<number>
  pageList: ComputedRef<(string | number)[]>
  pageChange: (page: number | string) => void
  pageSizeChange: (e: Event) => void
  pageRows: Ref<RowRow[][]>
  showRows: Ref<RowRow[]>
}

export function useTable(props: TableProps, handleOptions: HandleOptions): UseTableReturn {
  const columns = ref<ColumnRow[][]>([])
  const columnKeys = ref<ColumnRow[]>([])
  const rows = ref<RowRow[]>([])
  const pageRows = ref<RowRow[][]>([])
  const showRows = ref<RowRow[]>([])
  const checkedKey = ref<string>('')
  const checkedList = ref<number[]>([])

  const fixedData = computed(() => {
    const data = props.fixed
    const result = { left: 0, right: 0 }
    if (Array.isArray(data) && props.tableData.columns.length > 0) {
      if (data[0] + data[1] < props.tableData.columns.length) {
        result.left = data[0] || 0
        result.right = data[1] || 0
      }
    }
    return result
  })

  const bodyMergeComputed = computed(() => {
    const bodyMerges: MergeRow[] = JSON.parse(JSON.stringify(props.bodyMerge))
    const spans: Span[] = []
    const hideTd: HideTd[] = []
    bodyMerges.forEach((merge) => {
      const start = merge.s
      const end = merge.e
      for (let r = start.r; r <= end.r; r++) {
        for (let c = start.c; c <= end.c; c++) {
          if (c !== start.c || r !== start.r) {
            hideTd.push({ colIndex: c, rowIndex: r })
          }
        }
      }

      const span = {
        rowIndex: start.r,
        colIndex: start.c,
        colspan: end.c - start.c + 1,
        rowspan: end.r - start.r + 1,
      }
      spans.push(span)
    })
    return { spans, hideTd }
  })

  function parseHeader(cols: ColumnRow[], result: ColumnRow[][], deep = 0, left = false, right = false): number {
    // offset 叶子节点数量
    let offset = 0
    let cur = result[deep]
    if (!cur) {
      cur = result[deep] = []
    }
    for (let i = 0; i < cols.length; i++) {
      const head = cols[i]
      let curLeft = left
      let curRight = right

      cur.push(head)
      // lock 纵向固定
      if (deep === 0) {
        if (i < fixedData.value.left) {
          curLeft = true
        } else if (i >= cols.length - fixedData.value.right) {
          curRight = true
        }
      }
      head.left = curLeft
      head.right = curRight
      if (curLeft) {
        if (i === fixedData.value.left - 1) {
          head.fixEnd = true
        }
      } else if (curRight) {
        if (i === cols.length - fixedData.value.right) {
          head.fixEnd = true
        }
      }
      if (Object.hasOwn(head, 'children') && Array.isArray(head.children) && head.children.length > 0) {
        const childOffset = parseHeader(head.children, result, deep + 1)
        head.colspan = childOffset
        offset += childOffset
      } else {
        offset++
      }
    }
    return offset
  }

  function flatHeader(cols: ColumnRow[]): ColumnRow[] {
    const result: ColumnRow[] = []
    cols.forEach((col) => {
      if (col.children) {
        result.push(...flatHeader(col.children))
      } else {
        result.push(col)
      }
    })
    return result
  }

  function setHeaderRowspan(cols: ColumnRow[], max: number, deep = 0, offset = 0): number {
    // offset 叶子节点偏移量
    // startOffset 节点开始偏移量
    // endOffset 节点结束偏移量
    for (let i = 0; i < cols.length; i++) {
      const head = cols[i]
      if (Object.hasOwn(head, 'children') && Array.isArray(head.children) && head.children.length > 0) {
        head.startOffset = offset + 1
        offset = setHeaderRowspan(head.children, max, deep + 1, offset)
        head.endOffset = offset
      } else {
        if (max - deep > 1) {
          head.rowspan = max - deep
        }
        offset++
        head.isLeaf = true
        head.offset = offset
        head.startOffset = offset
        head.endOffset = offset
      }
    }
    return offset
  }

  function getSpanByArr(rowIndex: number, colIndex: number): SpanInfo {
    const { spans, hideTd } = bodyMergeComputed.value
    const result = {
      show: true,
      rowspan: 1,
      colspan: 1,
    }
    for (const td of spans) {
      if (rowIndex === td.rowIndex && colIndex === td.colIndex) {
        result.rowspan = td.rowspan
        result.colspan = td.colspan
      }
    }
    for (const td of hideTd) {
      if (rowIndex === td.rowIndex && colIndex === td.colIndex) {
        result.show = false
      }
    }
    return result
  }

  function getSpanByMethod(row: RowRow, col: ColumnRow, rowIndex: number, colIndex: number): SpanInfo {
    const result = {
      show: true,
      rowspan: 1,
      colspan: 1,
    }
    const span = typeof props.mergeMethod === 'function' ? props.mergeMethod(row, col, rowIndex, colIndex, showRows.value) : null
    if (span) {
      if (Array.isArray(span)) {
        result.show = !!(span[0] && span[1])
        result.rowspan = span[0]
        result.colspan = span[1]
      } else if (Object.prototype.toString.call(span) === '[object Object]') {
        result.show = !!(span.rowspan && span.colspan)
        result.rowspan = span.rowspan
        result.colspan = span.colspan
      }
    }
    return result
  }

  function getSpan(row: RowRow, col: ColumnRow, rowIndex: number, colIndex: number): SpanInfo {
    return props.bodyMerge && props.bodyMerge.length > 0 ? getSpanByArr(rowIndex, colIndex) : getSpanByMethod(row, col, rowIndex, colIndex)
  }

  /* 自定义单元格事件 */
  function renderFn(type: RenderType, data: RenderData): void {
    switch (type) {
      case 'button': {
        handleOptions.childFn({
          type,
          data,
        })
        break
      }
      case 'radio': {
        const rowArr = rows.value
        const selectedIndex = props.paginationType === 'local' ? data.totalIndex : data.index
        const selectedData = rowArr[selectedIndex]

        handleOptions.childFn({
          type,
          data: selectedData,
        })

        break
      }
      case 'checkbox': {
        const checkedArr = checkedList.value
        const rowArr = rows.value
        const checkedIndex = props.paginationType === 'local' ? data.totalIndex : data.index

        if (data.checked) {
          checkedArr.push(checkedIndex)
        } else {
          const indexInCheckedArr = checkedArr.findIndex((item: number) => item === checkedIndex)
          checkedArr.splice(indexInCheckedArr, 1)
        }

        const checkedData = Array.from(checkedArr, (item: number) => rowArr[item])
        handleOptions.childFn({
          type,
          data: checkedData,
        })
        break
      }
    }
  }

  /* 排序 */
  const orderKey = ref('')
  const orderType = ref('')
  const orderList = computed(() => {
    const list = columnKeys.value
    const keys = props.orderKeys || []
    return list.filter((item: ColumnRow) => keys.includes(item.key))
  })
  watch(
    orderList,
    (newList) => {
      orderKey.value = newList[0]?.key || ''
    },
    { immediate: true }
  )

  function orderChange(): void {
    handleOptions.orderChange({ key: orderKey.value, type: orderType.value })
  }

  /* 分页 */
  const curPage = ref(1)
  const pageComputed = computed(() => {
    return props.paginationType === 'local' ? curPage.value : (props.currentPage ?? 1)
  })
  const pageCount = computed(() => {
    if (props.paginationType === 'local') {
      return pageRows.value.length
    } else {
      return props.totalPage ? props.totalPage : Math.ceil((props.totalSize ?? 0) / (props.pageSize ?? 1))
    }
  })
  const pageList = computed(() => {
    const current = pageComputed.value ?? 1
    const total = pageCount.value
    const pageL = current - 1
    const pageR = total - current
    const pages: (string | number)[] = [1]
    if (total <= 9) {
      for (let i = 2; i <= total; i++) {
        pages.push(i)
      }
    } else if (pageL < 5 && pageR > 4) {
      for (let i = 2; i <= 7; i++) {
        pages.push(i)
      }
      pages.push('···')
      pages.push(total)
    } else if (pageL > 4 && pageR < 5) {
      pages.push('···')
      for (let i = total - 6, l = total - 1; i <= l; i++) {
        pages.push(i)
      }
      pages.push(total)
    } else if (pageL > 4 && pageR > 4) {
      pages.push('···')
      for (let i = current - 2, l = current + 2; i <= l; i++) {
        pages.push(i)
      }
      pages.push('···')
      pages.push(total)
    }
    return pages
  })

  function pageChange(page: number | string): void {
    if (typeof page === 'number') {
      if (page > pageCount.value || page < 1) {
        return
      }
      curPage.value = page
      handleOptions.pageChange(page)
    }
  }

  function pageSizeChange(e: Event): void {
    curPage.value = 1
    handleOptions.pageSizeChange(Number((e.target as HTMLInputElement).value))
  }

  /* 全选方法 */
  function selectAll(): void {
    const checkedArr = checkedList.value
    const curRows = showRows.value
    const rowArr = rows.value
    const key = checkedKey.value
    const page = pageComputed.value ?? 1
    const pageSize = props.pageSize ?? 1

    const isSelectedAll = curRows.every((_, index) => {
      const totalIndex = (page - 1) * pageSize + index
      const checkedIndex = props.paginationType === 'local' ? totalIndex : index
      return checkedArr.includes(checkedIndex)
    })
    if (isSelectedAll) {
      curRows.forEach((item, index) => {
        const totalIndex = (page - 1) * pageSize + index
        const checkedIndex = props.paginationType === 'local' ? totalIndex : index

        const indexInCheckedArr = checkedArr.findIndex((item: number) => item === checkedIndex)
        checkedArr.splice(indexInCheckedArr, 1)
        item[key] = false
      })
    } else {
      curRows.forEach((item, index) => {
        const totalIndex = (page - 1) * pageSize + index
        const checkedIndex = props.paginationType === 'local' ? totalIndex : index

        if (!checkedArr.includes(checkedIndex)) {
          checkedArr.push(checkedIndex)
        }
        item[key] = true
      })
    }
    const checkedData = Array.from(checkedArr, (item: number) => rowArr[item])
    handleOptions.childFn({
      type: 'checkbox',
      data: checkedData,
    })
  }

  watch(
    () => props.tableData,
    (newData) => {
      const header: ColumnRow[][] = []
      const cols = newData.columns ? JSON.parse(JSON.stringify(newData.columns)) : []
      rows.value = newData.dataArr ? JSON.parse(JSON.stringify(newData.dataArr)) : []
      parseHeader(cols, header)
      setHeaderRowspan(cols, header.length)
      columns.value = header
      columnKeys.value = flatHeader(cols)
      curPage.value = 1
    },
    { deep: true, immediate: true }
  )

  watchEffect(() => {
    const data = [...rows.value]
    const key = orderKey.value
    const type = orderType.value

    const result: RowRow[][] = []
    if (props.paginationType === 'local') {
      if (props.customOrder) {
        if (type === 'rise') {
          data.sort((a, b) => Number(a[key]) - Number(b[key]))
        } else if (type === 'drop') {
          data.sort((a, b) => Number(b[key]) - Number(a[key]))
        }
      } else if (props.autoOrder) {
        data.sort((a, b) => (a.orderBy ?? 0) - (b.orderBy ?? 0))
      }

      if (props.isPagination) {
        for (let i = 0; i < data.length; ) {
          result.push(data.slice(i, (i += props.pageSize ?? 0)))
        }
      } else {
        result.push(data)
      }
    } else {
      result.push(data)
    }
    pageRows.value = result
  })
  watchEffect(() => {
    const data = pageRows.value
    const page = pageComputed.value ?? 1

    showRows.value = props.paginationType === 'local' ? data[page - 1] || [] : data[0]
  })

  watch(
    pageRows,
    () => {
      const checkboxColumn = columnKeys.value.find((item: ColumnRow) => item.type === 'checkbox')
      if (checkboxColumn) {
        const checkedArr: number[] = []
        checkedKey.value = checkboxColumn.key
        rows.value.forEach((item, index) => {
          if (item[checkedKey.value]) {
            checkedArr.push(index)
          }
        })
        checkedList.value = checkedArr
      }
    },
    { deep: true, immediate: true }
  )

  return {
    fixedData,
    bodyMergeComputed,
    columns,
    columnKeys,
    rows,
    getSpanByArr,
    getSpan,
    renderFn,
    selectAll,
    orderKey,
    orderType,
    orderList,
    orderChange,
    pageComputed,
    pageList,
    pageChange,
    pageSizeChange,
    pageRows,
    showRows,
  }
}
