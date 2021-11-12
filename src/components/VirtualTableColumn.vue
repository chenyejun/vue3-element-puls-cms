<template>
  <div class="virtual-table-column">
    <slot :slot-scope="{ row, rowIndexInfo }"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'VirtualTableColumn',
  props: {
    label: {
      type: String,
      require: true
    },
    prop: {
      type: String,
      require: true
    },
    // 每行数据
    row: {
      type: Object
    },
    rowIndexInfo: {
      type: Object,
      default() {
        return {
          index: '', // 父节点的索引
          childIndex: '' // 当前父节点下，子节点的索引，父节点该字段为null
        }
      }
    },
    width: {
      type: [String, Number]
    },
    minWidth: {
      type: [String, Number]
    }
  }
})
</script>

<style lang="scss">
.virtual-table-column {
}
</style>
