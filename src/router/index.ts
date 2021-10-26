import { createRouter, createWebHistory } from "vue-router"
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const { matched } = to
  if (matched.length === 0) { // 匹配不到路由，跳转404
    next('/not-found')
  }
  next()
})

export default router
