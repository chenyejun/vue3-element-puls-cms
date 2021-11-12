<template>
  <section
    class="virtual-container"
    :style="{ 'min-height': `${minHeight}px` }"
  >
    <div ref="hiddenSlot" class="hidden-slot">
      <slot></slot>
    </div>
    <table class="thead" border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td
          v-for="(item, index) in headData"
          :key="index"
          :width="getColumnProVal(index, 'width')"
        >
          <div class="cell">
            {{ item.label }}
          </div>
        </td>
      </tr>
    </table>
    <div class="tbody" ref="tbodyRef" @scroll="scrollEvent">
      <div class="tbody-phantom" :style="{ height: `${listHeight}px` }"></div>
      <table
        class="tbody-list"
        :style="{ transform: getTransform }"
        border="0"
        cellpadding="0"
        cellspacing="0"
      >
        <tr v-for="(row, rowIndex) in visibleData" :key="row[rowKey]">
          <td
            v-for="(childItem, childIndex) in headData"
            :key="`${row[rowKey]}-${childIndex}`"
            :width="getColumnProVal(childIndex, 'width')"
          >
            <div
              class="cell tbody-cell"
              :style="{ height: `${itemSize}px`, lineHeight: `${itemSize}px` }"
            >
              <!-- 展开子层图标 start -->
              <div
                v-if="
                  isHasChildren(row) && childIndex === 0 && !row._vr_child_tag
                "
                class="expand-icon"
                :class="{ 'expand-icon-ac': row._vr_insertChildCount }"
                @click="onExpandChild(row, row._vr_originIndex, rowIndex)"
              >
                <i
                  :class="
                    row._vr_expandLoading
                      ? 'el-icon-loading'
                      : 'el-icon-arrow-right'
                  "
                ></i>
              </div>
              <!-- 展开子层图标 end -->
              <div
                :style="{
                  'padding-left':
                    row._vr_child_tag && childIndex === 0 ? '20px' : 0
                }"
              >
                <!-- 渲染virtualTableColumn内的插槽内容 start -->
                <component
                  v-if="columnRefList[childIndex].children"
                  :is="columnRefList[childIndex].children.default"
                  :row="row"
                  :rowIndexInfo="{
                    index:
                      row._vr_originIndex >= 0
                        ? row._vr_originIndex
                        : row._vr_child_parentIndex,
                    childIndex:
                      row._vr_child_index >= 0 ? row._vr_child_index : null
                  }"
                ></component>
                <!-- 渲染virtualTableColumn内的插槽内容 end -->
                <div v-else>
                  {{ row[childItem.prop] }}
                </div>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import moniResize from '@/composables/moniResizeTool'
export default defineComponent({
  name: 'VirtualTable',
  emits: [
    'load-more' // 滚动到底部，加载更多回调事件
  ],
  props: {
    // 表格的最小高度
    minHeight: {
      type: Number,
      default: 300
    },
    // 传入的data中，需要一个唯一的key，默认指向id
    rowKey: {
      type: String,
      default: 'id'
    },
    // 设置每行的高度，单位px
    itemSize: {
      type: Number || String,
      default: 40
    },
    // 开启子节点展开触发加载远程数据
    lazy: {
      type: Boolean,
      default: false
    },
    // 开启lazy后，子节点展开触发load方法
    load: {
      type: Function
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  setup(props, { slots, emit }) {
    const slotsList = (slots as any).default()
    const headData = ref<any[]>([])
    let screenHeight = ref<number | undefined>(0)
    let startOffset = ref<number>(0)
    let startIndex = ref<number>(0)
    let endIndex = ref<number>(0)
    let visibleCount = 0

    const allData = ref<any>([]) // 所有数据
    watch(
      props.data,
      (newVal) => {
        console.log('初始')
        allData.value = cloneDeep(newVal).map((item: any, index: number) => {
          item._vr_originIndex = index // 注入原始索引，因为虚拟滚动中，index会混乱
          return item
        })
      },
      {
        immediate: true
      }
    )

    const listHeight = computed(() => {
      // 计算总高度，用于撑开滚动条
      return allData.value.length * props.itemSize
    })

    // 计算列表显示的行数
    const calcVisibleCount = () => {
      screenHeight.value = document
        .querySelector('.virtual-container .tbody')
        ?.getBoundingClientRect().height
      visibleCount = Math.ceil((screenHeight.value as number) / props.itemSize)
      endIndex.value = startIndex.value + visibleCount
    }

    // 真实渲染到页面的数据
    const visibleData = computed(() => {
      return allData.value.slice(
        startIndex.value,
        Math.min(endIndex.value, allData.value.length)
      )
    })
    const getTransform = computed(() => {
      return `translate3d(0,${startOffset.value}px,0)`
    })
    const tbodyRef = ref(null) as any
    const scrollEvent = () => {
      // 当前滚动位置
      const scrollTop = tbodyRef.value.scrollTop
      // 此时的开始索引
      startIndex.value = Math.floor(scrollTop / props.itemSize)
      // 此时的结束索引
      endIndex.value = startIndex.value + visibleCount

      // 滚动到底部，触发回调事件
      if (endIndex.value > allData.value.length) {
        emit('load-more')
      }
      // 此时的偏移量
      startOffset.value = scrollTop - (scrollTop % props.itemSize)
    }

    /**
     * 判断节点是否存在子节点
     */
    const isHasChildren = (row: any) => {
      return !!row.children || props.lazy
    }

    /**
     * 点击展开子节点
     * 给行数据row注入一些私有的字段
     * {
     *   _vr_insertChildCount: 记录插入了多少个子元素,
     *   _vr_child_parentIndex: 子节点存储的父节点索引,
     *   _vr_child_index: 存储当前子节点的索引,
     *   _vr_child_tag: 标识当前节点为子节点,
     *   _vr_expandLoading: 懒加载子层的loading,
     * }
     */
    const onExpandChild = (row: any, originIndex: number, rowIndex: number) => {
      const actualIndex = startIndex.value + rowIndex + 1 // 在所有数据中的实际索引
      const insertChildren = () => {
        row._vr_insertChildCount = row.children.length // 记录插入了多少个子元素，用于关闭删除
        row.children.forEach((x: any, index: number) => {
          x._vr_child_parentIndex = originIndex
          x._vr_child_index = index
          x._vr_child_tag = true // 子节点插入_vr_child_tag标识
        })
        allData.value.splice(actualIndex, 0, ...row.children)
      }
      if (row.children && row.children.length > 0) {
        // 插入数据
        if (!row._vr_insertChildCount) {
          insertChildren()
        } else {
          // 删除数据
          allData.value.splice(actualIndex, row._vr_insertChildCount)
          row._vr_insertChildCount = null
        }
        return false
      }
      // lazy开启，触发远程加载
      if (props.lazy && !row._vr_expandLoading) {
        row._vr_expandLoading = true
        row._loadPromise = new Promise((resolve) => {
          props.load && props.load(row, originIndex, resolve)
        })
          .then((res) => {
            // 远程数据插入到children，走前面的逻辑
            row.children = res
            insertChildren()
          })
          .finally(() => {
            row._vr_expandLoading = false
            row._loadPromise = null
          })
      }
    }

    /**
     * 处理slot中子组件VirtualTableColumn的参数值
     */
    console.log(slotsList)
    // 获取指定子组件实例
    const columnRefList = slotsList.reduce((list: any[], instan: any) => {
      const { type } = instan
      if (type.name === 'VirtualTableColumn') {
        const { props } = instan
        headData.value.push(props)
        list.push(instan)
      }
      return list
    }, [])

    // 获取VirtualTableColumn指定的参数值
    const getColumnProVal = (index: number, propName: string) => {
      return headData.value[index][propName] || 'auto'
    }

    // console.log(columnRefList[0].children.default())

    onMounted(() => {
      calcVisibleCount()
    })
    // 浏览器窗口大小变动，重新计算列表显示行数
    moniResize(calcVisibleCount)

    return {
      startIndex,
      listHeight,
      tbodyRef,
      visibleData,
      getTransform,
      scrollEvent,
      headData,
      columnRefList,
      isHasChildren,
      onExpandChild,
      getColumnProVal
    }
  }
})
</script>

<style lang="scss">
@mixin ell($line) {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $line;
}
.virtual-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  $table-border-color: #ebeef5;
  $table-bg--hover: #f5f7fa;
  .hidden-slot {
    display: none;
  }
  table {
    table-layout: fixed;
  }
  .cell {
    padding: 0 10px;
    line-height: 40px;
  }
  .expand-icon {
    display: inline-block;
    width: 20px;
    line-height: 20px;
    height: 20px;
    text-align: center;
    margin-right: 3px;
    font-size: 12px;
    color: #606266;
    position: relative;
    cursor: pointer;
    transition: all 0.5s;
    &-ac {
      transform: rotate(90deg);
    }
  }
  .thead {
    width: 100%;
    color: #909399;
    border-bottom: 1px solid $table-border-color;
  }
  .tbody {
    flex: 1;
    overflow: auto;
    position: relative;
    -webkit-overflow-scrolling: touch;
    color: #606266;
    /*绝对定位， 虽然脱离了文档流，但是受制于其父元素，当父元素设置了overflow: auto;当其高度
    高于父元素时候，就会出现滚动条。在此作用是，展示列表的总高度，但是不渲染列表。*/
    &-phantom {
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      width: 100%;
    }
    /**绝对定位，层级高于infinite-list-phantom，用于可视区渲染的容器。当滚动发生时，需要通过transformY实时的将此容器移动到可视区范围内。此容器内要渲染的数据，是根据滚动的状态变化的。*/
    &-list {
      left: 0;
      top: 0;
      position: absolute;
      width: 100%;
    }
    tr {
      border-bottom: 1px solid $table-border-color;
      &:hover {
        background: $table-bg--hover;
      }
    }
    &-cell {
      display: flex;
      align-items: center;
      @include ell(1);
      > div {
        &:last-of-type {
          flex: 1;
        }
      }
    }
  }
}
</style>
