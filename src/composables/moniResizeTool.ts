import { throttle } from 'lodash-es'
import { onUnmounted } from 'vue'
export default function moniResize(fun: () => any): any {
  const onResize = throttle(fun, 500)
  window.addEventListener('resize', onResize, false)
  onUnmounted(() => {
    window.removeEventListener('resize', onResize, false)
  })
}