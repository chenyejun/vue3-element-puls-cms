<template>
  <svg class="mw-svg" aria-hidden="true" :style="{ fill: color }">
    <use :xlink:href="iconName"></use>
  </svg>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
export default defineComponent({
  name: 'm-svg',
  props: {
    name: { type: String, default: '' },
    color: { type: String, default: 'currentColor' }
  },
  setup(props) {
    const iconName = computed(() => `#${props.name}`)
    return {
      iconName
    }
  }
})
</script>
<style lang="scss" scoped>
.mw-svg {
  width: 1.4em;
  height: 1.4em;
  fill: currentColor;
  overflow: hidden;
  line-height: 1em;
  display: inline-block;
}
</style>