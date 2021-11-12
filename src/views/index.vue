<template>
  <el-container class="app-container">
    <el-aside width="160px">
      <el-menu>
        <el-submenu index="1">
          <template #title><i class="el-icon-message"></i>导航一</template>
          <el-menu-item
            index="1-4-1"
            @click="$router.push('/demo/g-svg-icon-demo')"
            >demo列表</el-menu-item
          >
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="app-header">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 5px"></i>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>查看</el-dropdown-item>
              <el-dropdown-item>新增</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import router from '@/router'
export default defineComponent({
  name: 'Index',
  setup() {
    const onTest = () => {
      router.push('/about')
    }
    return {
      onTest
    }
  }
})
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.app-container {
  height: 100%;
}
.app-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 13px;
}
.app-main {
  border: 12px solid #f2f2f2;
  box-sizing: border-box;
  height: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
}
</style>
