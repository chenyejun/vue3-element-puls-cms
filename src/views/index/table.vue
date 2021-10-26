<template>
  <div class="table">
    <VirtualTable :data="dataList" lazy :load="onLoad">
      <VirtualTableColumn label="姓名" prop="name"></VirtualTableColumn>
      <VirtualTableColumn label="值" prop="value"> </VirtualTableColumn>
      <VirtualTableColumn label="其他" prop="other">
        <template v-slot="{ rowIndexInfo }">
          {{ rowIndexInfo }}
        </template>
      </VirtualTableColumn>
      <div>dfdf</div>
    </VirtualTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import VirtualTable from '@/components/VirtualTable.vue'
import VirtualTableColumn from '@/components/VirtualTableColumn.vue'
export default defineComponent({
  name: 'table',
  components: {
    VirtualTable,
    VirtualTableColumn
  },
  setup() {
    const dataList = ref<any[]>([])
    dataList.value = new Array(100).fill('.').map((item, index) => {
      return {
        id: index,
        name: '哈哈哈哈' + index,
        value: '会获得很好地'
      }
    })

    const onLoad = (row: any, index: number, resolve: any) => {
      setTimeout(() => {
        resolve(
          new Array(15).fill('.').map((item: any, i: number) => {
            return {
              id: index + '-' + i,
              name: index + '-' + i,
              value: 'jjjjj'
            }
          })
        )
      }, 1500)
    }
    return {
      dataList,
      onLoad
    }
  }
})
</script>
<style lang="scss">
.table {
  flex: 1;
  padding: 12px;
  box-sizing: border-box;
  height: 100%;
}
</style>
