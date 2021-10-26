<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    // 隐藏index.html的开屏动画
    onMounted(() => {
      const timer = setTimeout(() => {
        const oBody = document.querySelector('body') as HTMLElement
        const oLevel = document.querySelector('#level-out') as HTMLElement
        oBody.removeChild(oLevel)
        clearTimeout(timer)
      }, 500)
    })
  }
})
</script>
<style lang="scss">
@import './assets/styles/reset.scss';
html,
body {
  height: 100%;
}
</style>
