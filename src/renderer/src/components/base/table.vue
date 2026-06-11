<script lang="ts" setup generic="TRow extends object, const TCol extends readonly {key:string}[]">
import type { ColumnRow, Slots, TableProps } from '@renderer/hooks/useTable'
import { useTable } from '@renderer/hooks/useTable'
import RenderTd from './renderTd.vue'

const props = withDefaults(defineProps<TableProps>(), {
  tableData: () => ({
    columns: [],
    dataArr: [],
  }),
  /* 表体单元格合并, 仅对当前页有效 */
  bodyMerge: () => [],
  // 是否分页
  isPagination: false,
  // 默认单页数量
  pageSize: 15,
  // 分页类型：local 本地分页， online 后台分页
  paginationType: 'local',
  // 当前页码，在后台分页时使用，本地分页无效
  currentPage: 1,
  // 分页总数量，在后台分页时使用
  totalPage: 0,
  // 数据数量，在后台分页时使用
  totalSize: 0,
  // 显示单页数量选择
  showPageSize: false,
  // 单页数量选择配置
  pageSizeArr: () => [15, 25, 35, 45],
  // 是否显示总数
  showTotalSize: false,
  customOrder: false,
  orderKeys: () => [],
  fixHead: false,
  fixed: () => [0, 0],
  zIndex: 20,
  mergeMethod() {
    return [1, 1]
  },
})
const emit = defineEmits<{
  childFn: [data: object]
  orderChange: [data: object]
  pageChange: [page: number]
  pageSizeChange: [pageSize: number]
}>()
const slots = defineSlots<Slots>()
const {
  fixedData,
  columns,
  columnKeys,
  rows,
  getSpan,
  showRows,
  orderKey,
  orderType,
  orderList,
  orderChange,
  pageComputed,
  pageList,
  pageChange,
  pageSizeChange,
  selectAll,
  renderFn,
} = useTable(props, {
  childFn: (data: object) => emit('childFn', data),
  orderChange: (data: object) => emit('childFn', data),
  pageChange: (page: number) => emit('pageChange', page),
  pageSizeChange: (pageSize: number) => emit('pageSizeChange', pageSize),
})
defineExpose({ selectAll })

const theadRef = ref()
const tableRef = ref()
const leftScroll = ref(false)
const rightScroll = ref(false)
const leafThRefs: Record<number, HTMLElement> = {}
const tdRef: Record<number, Record<number, HTMLElement>> = {}

function setLeafThRef(el: HTMLElement, col: ColumnRow): void {
  if (el && col.isLeaf) {
    leafThRefs[col.offset] = el
  }
}

function setTdRef(el: HTMLElement, ri: number, ci: number): void {
  if (Object.hasOwn(tdRef, ri)) {
    tdRef[ri][ci] = el
  } else {
    tdRef[ri] = { [ci]: el }
  }
}

function setFixed(): void {
  const thead = theadRef.value

  // 表头固定行
  if (props.fixHead) {
    let top = 0
    for (let rIndex = 0; rIndex < thead.children.length; rIndex++) {
      const tr = thead.children[rIndex]
      for (let hIndex = 0; hIndex < tr.children.length; hIndex++) {
        const th = tr.children[hIndex]
        th.style.position = 'sticky'
        th.style.top = `${top}px`
        th.style.zIndex = props.zIndex
      }
      top += tr.getBoundingClientRect().height
    }
  }

  if (fixedData.value.left > 0 || fixedData.value.right > 0) {
    // 表头固定列
    columns.value.forEach((row, rIndex) => {
      row.forEach((col: ColumnRow, index: number) => {
        const th = thead.children[rIndex].children[index]
        if (col.left) {
          let left = 0
          for (let i = 1; i < col.startOffset; i++) {
            left += leafThRefs[i].getBoundingClientRect().width
          }

          th.style.position = 'sticky'
          th.style.left = `${left}px`
          th.style.zIndex = props.zIndex + 1
        } else if (col.right) {
          let right = 0
          for (let i = columnKeys.value.length; i > col.endOffset; i--) {
            right += leafThRefs[i].getBoundingClientRect().width
          }

          th.style.position = 'sticky'
          th.style.right = `${right}px`
          th.style.zIndex = props.zIndex + 1
        } else {
          if (props.fixHead) {
            th.style.right = null
          } else {
            th.style = null
          }
        }
      })
    })

    // 表体固定列
    if (columnKeys.value.length > 0) {
      columnKeys.value.forEach((col, index) => {
        if (col.left) {
          for (let rIndex = 0; rIndex < showRows.value.length; rIndex++) {
            const row = showRows.value[rIndex]
            const span = getSpan(row, col, rIndex, index)

            if (span.show) {
              const td = tdRef[rIndex][index]
              let left = 0
              for (let i = 0; i < index; i++) {
                left += leafThRefs[i + 1].getBoundingClientRect().width
              }
              td.style.position = 'sticky'
              td.style.left = `${left}px`
              td.style.zIndex = props.zIndex.toString()
            }
          }
        } else if (col.right) {
          for (let rIndex = 0; rIndex < showRows.value.length; rIndex++) {
            const row = showRows.value[rIndex]
            const span = getSpan(row, col, rIndex, index)
            if (span.show) {
              const td = tdRef[rIndex][index]
              let right = 0
              for (let i = columnKeys.value.length - 1; i > index; i--) {
                right += leafThRefs[i + 1].getBoundingClientRect().width
              }
              td.style.position = 'sticky'
              td.style.right = `${right}px`
              td.style.zIndex = props.zIndex.toString()
            }
          }
        }
      })
    }
    // 滚动状态
    const el = tableRef.value

    if (el.scrollLeft === 0) {
      leftScroll.value = false
    } else {
      leftScroll.value = true
    }
    if (el.scrollWidth - el.scrollLeft === el.clientWidth) {
      rightScroll.value = false
    } else {
      rightScroll.value = true
    }
  }
}

watch(
  [columns, showRows],
  () => {
    nextTick(() => {
      setFixed()
    })
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div class="stone-table">
    <div
      ref="tableRef"
      class="ytl-table"
      :class="{
        'has-control': isPagination || customOrder || showTotalSize,
        'left-scrolling': leftScroll,
        'right-scrolling': rightScroll,
      }">
      <table cellspacing="0" border="0" cellpadding="0">
        <thead ref="theadRef" :class="{ 'fix-head': fixHead }">
          <tr v-for="(tr, rIndex) in columns" :key="rIndex">
            <th
              v-for="(th, hIndex) in tr"
              :key="`${rIndex}_${hIndex}`"
              :ref="(el) => setLeafThRef(el as HTMLElement, th)"
              :colspan="th.colspan"
              :rowspan="th.rowspan"
              :class="[th.class, `th-${th.startOffset}`, { 'fix-end': th.fixEnd, 'fix-left': th.left, 'fix-right': th.right }]">
              <slot name="head" :column="th">
                <span>{{ th.title }}</span>
              </slot>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tr, rIndex) in showRows" :key="rIndex">
            <template v-for="(td, dIndex) in columnKeys">
              <td
                v-if="getSpan(tr, td, rIndex, dIndex).show"
                :key="`key${pageComputed}_${rIndex}_${dIndex}`"
                :ref="(el) => setTdRef(el as HTMLElement, rIndex, dIndex)"
                :class="[td.class, `td-${dIndex + 1}`, { 'fix-end': td.fixEnd, 'fix-left': td.left, 'fix-right': td.right }]"
                :rowspan="getSpan(tr, td, rIndex, dIndex).rowspan"
                :colspan="getSpan(tr, td, rIndex, dIndex).colspan">
                <slot v-if="slots[td.key]" :name="td.key" :row="tr" :column="td" :index="rIndex" :page="pageComputed" :value="tr[td.key]" />
                <slot v-else :row="tr" :column="td" :index="rIndex" :page="pageComputed" :value="tr[td.key]">
                  <RenderTd
                    v-model="tr[td.key]"
                    :row="tr"
                    :column="td"
                    :index="rIndex"
                    :page="pageComputed"
                    :page-size="pageSize"
                    @render-fn="renderFn" />
                </slot>
              </td>
            </template>
          </tr>
          <tr v-if="!rows.length">
            <td class="td-1" :colspan="columnKeys.length">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="isPagination || customOrder || showTotalSize" class="pageControl-box">
      <div v-if="customOrder" class="pageNum fl">
        <span>排序：</span>
        <div class="orderSelect">
          <select v-model="orderKey" class="normalSelect" @change="orderChange">
            <option v-for="(item, index) in orderList" :key="index" :value="item.key">
              {{ item.title }}
            </option>
          </select>
          <select v-model="orderType" class="normalSelect" @change="orderChange">
            <option value="">默认</option>
            <option value="rise">升序</option>
            <option value="drop">降序</option>
          </select>
        </div>
      </div>
      <div v-if="isPagination || showTotalSize" class="pageControl fr">
        <div v-if="showTotalSize" class="totalSize">
          共<span class="value">{{ paginationType === 'local' ? rows.length : totalSize }}</span
          >条
        </div>
        <button v-if="isPagination" class="normalButton" @click="pageChange(pageComputed - 1)">上一页</button>
        <template v-if="isPagination">
          <button
            v-for="(item, index) in pageList"
            :key="index"
            class="normalButton onePage"
            :class="{ default: pageComputed === item }"
            @click="pageChange(item)">
            {{ item }}
          </button>
        </template>
        <button v-if="isPagination" class="normalButton" @click="pageChange(pageComputed + 1)">下一页</button>
        <select v-if="isPagination && showPageSize" class="normalSelect" :value="pageSize" @change="pageSizeChange">
          <option v-for="(item, index) in pageSizeArr" :key="index" :value="item">{{ item }}/页</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
