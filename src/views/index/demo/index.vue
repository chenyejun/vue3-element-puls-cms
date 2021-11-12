<template>
  <section class="index-demo">
    <div class="nav">
      <a
        :class="[item.routeName == current ? 'active' : '']"
        v-for="item in menuList"
        :key="item.routeName"
        @click.prevent="onMenu(item)"
      >
        {{ item.name }}
      </a>
    </div>
    <div class="content">
      <router-view />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from 'vue'
import router from '@/router'

export default defineComponent({
  name: 'index-demo',
  setup() {
    const currentRoute = router.currentRoute
    const current = ref<string[]>([currentRoute.value.name as string])
    const state: {
      menuList: any[]
    } = reactive({
      menuList: [
        {
          routeName: 'index-demo-g-svg-icon-demo',
          name: 'g-svg-icon-demo'
        },
        {
          routeName: 'index-demo-g-table-demo',
          name: 'index-demo-g-table-demo'
        },
        {
          routeName: 'index-demo-virtual-table-demo',
          name: 'virtual-table-demo'
        }
      ]
    })
    const onMenu = (item: any) => {
      current.value = item.routeName
      router.push({ name: item.routeName })
    }
    return {
      onMenu,
      ...toRefs(state),
      current
    }
  }
})
</script>
<style lang="scss">
.index-demo {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
  background: white;
  box-sizing: border-box;
  .nav {
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
    > a {
      text-decoration: none;
      display: inline-block;
      padding: 0 16px;
      color: #333;
      font-size: 14px;
      cursor: pointer;
      line-height: 46px;
      margin: 0 10px;
    }
    .active {
      color: $mainColor;
      position: relative;
      &::before {
        content: '';
        width: 100%;
        height: 2px;
        background: $mainColor;
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
  }
  .content {
    box-sizing: border-box;
    flex: 1;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
}
</style>

