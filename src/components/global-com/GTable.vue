<template>
  <el-container class="g-table">
    <el-header height="45px" style="padding: 0">
      <el-form inline :model="form">
        <template v-for="field in fields" :key="field.prop">
          <el-form-item :prop="field.prop">
            <el-select
              v-if="field.component === 'select'"
              v-bind="field"
              v-model="form[field.prop]"
              @change="onChange(field)"
            >
              <el-option
                v-for="(option, oInedx) in field.options"
                :key="oInedx"
                v-bind="option"
              ></el-option>
            </el-select>
            <el-radio-group
              v-else-if="field.component === 'radio'"
              v-bind="field"
              v-model="form[field.prop]"
              @change="onChange"
            >
              <el-radio-button
                v-for="option in field.options"
                :key="option.value"
                :label="option.value"
                >{{ option.label }}</el-radio-button
              >
            </el-radio-group>
            <component
              v-else-if="field.component !== undefined"
              :is="
                typeof field.component === 'string'
                  ? `el-${field.component}`
                  : field.component
              "
              v-bind="field"
              v-model="form[field.prop]"
              @change="onChange"
              v-on="field.listeners"
            >
            </component>
          </el-form-item>
        </template>
        <el-form-item class="operate">
          <slot name="operate"></slot>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main style="padding: 0" class="table-main">
      <template v-if="columns">
        <el-table ref="table" v-loading="loading" v-bind="$attrs" :data="data">
          <template v-for="(column, index) in columns">
            <el-table-column
              v-if="column.slot === 'selection'"
              type="selection"
              width="55"
              :key="`selection-${index}`"
            ></el-table-column>
            <slot v-else-if="column.slot" :name="column.slot"></slot>
            <component
              v-else-if="column.component"
              :is="column.component"
              :column="column"
              :key="`component-${index}`"
            ></component>
            <el-table-column v-else v-bind="column" :key="`column-${index}`">
              <template v-slot="scope">
                {{
                  column.filter
                    ? column.filter(scope.row[column.prop])
                    : scope.row[column.prop]
                }}
              </template>
            </el-table-column>
          </template>
        </el-table>
      </template>
    </el-main>
    <el-footer
      class="table-footer"
      v-if="paging && pagination.pageSizes.some((x) => pagination.total > x)"
    >
      <!-- 表格底部内容 分页 -->
      <div>
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="pagination.pageSize"
          :page-sizes="pagination.pageSizes"
          :current-page="pagination.current_page"
          :total="pagination.total"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
        ></el-pagination>
      </div>
    </el-footer>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
export default defineComponent({
  name: 'GTable',
  emits: [
    'before-fetch', // 接口请求前的事件，可修改请求参数
    'after-fetch' // 接口请求后的事件，可修改请求后数据
  ],
  props: {
    api: {
      type: Function
    },
    fields: {
      type: Array,
      default: () => {
        return []
      }
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    paging: {
      // 是否存在分页
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      form: props.fields.reduce((json: any, field: any): void => {
        json[field.prop] = field.vlaue || ''
        return json
      }, {}) as any,
      loading: false,
      data: [],
      pagination: {
        total: 0,
        current_page: 1,
        last_page: 0,
        pageSize: localStorage.getItem('pageSize') || 30,
        pageSizes: [15, 30, 50, 80, 100]
      }
    })
    // 模拟假数据
    const getSimuData = () => {
      return new Array(30).fill('.').map((x: any, index: number) => {
        const value = `demo-${index}`
        const valueJson: any = {}
        props.columns.forEach((x: any) => {
          const prop = x.prop
          valueJson[prop] = `${prop}-${value}`
        })
        return valueJson
      }) as any
    }

    const getList = async () => {
      if (!props.api) {
        if (process.env.NODE_ENV !== 'production') {
          state.data = getSimuData()
        }
        return false
      }
      const params = cloneDeep(state.form)
      const pagination = state.pagination
      emit('before-fetch', params)
      const res = await props.api({
        ...params,
        page_size: pagination.pageSize,
        page: pagination.current_page
      })
      const { data = [], total } = res.data
      state.pagination.total = total
      emit('after-fetch', data)
      state.data = data
    }
    getList()

    const onChange = () => {
      console.log('change', state.form)
    }

    const onSizeChange = (pageSize: string) => {
      state.pagination.pageSize = +pageSize
      state.pagination.current_page = 1
      localStorage.setItem('pageSize', pageSize)
      getList()
    }
    const onCurrentChange = (current_page: number) => {
      state.pagination.current_page = current_page
      getList()
    }
    return {
      ...toRefs(state),
      onChange,
      getList,
      onSizeChange,
      onCurrentChange
    }
  }
})
</script>
<style lang="scss">
.g-table {
  padding: 12px;
  box-sizing: border-box;
  height: 100%;
  .el-form {
    display: flex;
    justify-content: flex-end;
  }
  .table {
    &-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>
