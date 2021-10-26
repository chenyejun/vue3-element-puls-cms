<template>
  <div class="about">
    <g-table :fields="fields" :columns="columns"></g-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from 'vue'
import store from '@/store'
export default defineComponent({
  name: 'About',
  setup() {
    const state = reactive({
      fields: [
        {
          component: 'select',
          label: '下拉选择',
          placeholder: 'dfdf',
          prop: 'select',
          options: [
            {
              value: '选项1',
              label: '黄金糕'
            },
            {
              value: '选项2',
              label: '双皮奶'
            },
            {
              value: '选项21',
              label: '双皮奶1'
            }
          ]
        },
        {
          component: 'radio',
          label: '单选',
          prop: 'radio',
          options: [
            {
              label: '男',
              value: 1
            },
            {
              label: '女',
              value: 2
            }
          ]
        },
        {
          component: 'input',
          lable: 'input',
          prop: 'input',
          'prefix-icon': 'el-icon-search'
        }
      ],
      columns: [
        { prop: 'id', label: 'ID' },
        { prop: 'name', label: '姓名' }
      ]
    })
    const tableRef = ref(null)
    const onCellClick = () => {
      console.log(434)
      store.dispatch('increment')
      console.log(store.state.count)
    }
    const onTest = () => {
      console.log(34)
      const value = tableRef.value as any
      console.log(value)
    }
    return {
      ...toRefs(state),
      onCellClick,
      onTest,
      tableRef
    }
  }
})
</script>
<style lang="scss">
.about {
  height: 100%;
}
</style>
