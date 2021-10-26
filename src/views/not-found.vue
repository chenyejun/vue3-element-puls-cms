<template>
  <div class="not-found">
    <el-empty description="页面不存在"></el-empty>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NotFound',
  props: {
    msg: String
  }
})
</script>

<style lang="scss">
.not-found {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
