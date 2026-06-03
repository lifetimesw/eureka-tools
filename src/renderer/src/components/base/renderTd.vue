<script>
export default {
  name: 'RenderTd',
  props: {
    isMeasure: Boolean,
    row: {
      type: Object,
      default() {
        return {}
      },
    },
    column: {
      type: Object,
      default() {
        return {}
      },
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    page: {
      type: Number,
      default: 1,
    },
    index: {
      type: Number,
      default: null,
    },
    modelValue: {
      type: [Number, String, Object, Array, Boolean],
      default: null,
    },
  },
  emits: ['renderFn', 'update:modelValue'],
  data() {
    return {
      checked: this.modelValue,
      radioChecked: false,
      radio: this.modelValue,
    }
  },
  watch: {
    modelValue: {
      handler(newValue) {
        if (this.type === 'checkbox') {
          this.checked = newValue
        } else if (this.type === 'radio') {
          this.radioChecked = this.isMeasure ? false : this.modelValue
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    buttonClick(btnData) {
      this.$emit('renderFn', 'button', {
        row: this.row,
        type: btnData.type,
      })
    },
    radioClick() {
      this.$emit('renderFn', 'radio', {
        index: this.index,
        totalIndex: this.totalIndex,
        key: this.column.key,
      })
    },
    checkboxClick(event) {
      this.$emit('update:modelValue', event.target.checked)
      this.$emit('renderFn', 'checkbox', {
        index: this.index,
        totalIndex: this.totalIndex,
        checked: event.target.checked,
      })
    },
  },
  computed: {
    type() {
      return this.column.type || ''
    },
    totalIndex() {
      return (this.page - 1) * this.pageSize + this.index
    },
    radioName() {
      return this.column.radioName || 'select'
    },
  },
}
</script>

<template>
  <template v-if="type === 'button'">
    <button v-for="(item, index) in modelValue.buttons" :key="index" :class="item.bClass" @click="buttonClick(item)">
      {{ item.name }}
    </button>
  </template>
  <template v-else-if="type === 'input'">
    <input type="text" class="table-input" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
  </template>
  <template v-else-if="type === 'numInput'">
    <input type="number" class="table-input" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
  </template>
  <template v-else-if="type === 'radio'">
    <input type="radio" class="table-radio" :value="index" :checked="radioChecked" :name="radioName" @click="radioClick" />
  </template>
  <template v-else-if="type === 'checkbox'">
    <input type="checkbox" class="table-checkbox" v-model="checked" @click="checkboxClick" />
  </template>
  <template v-else-if="type === 'styleText'">
    <span :style="modelValue.style">{{ modelValue.text }}</span>
  </template>
  <template v-else-if="type === 'i'">
    <i :class="modelValue"></i>
  </template>
  <template v-else>
    {{ modelValue }}
  </template>
</template>

<style lang="less" scoped></style>
