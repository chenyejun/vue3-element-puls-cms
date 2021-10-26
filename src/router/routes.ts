import { RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    name: 'index',
    path: '/',
    component: () => import(/* webpackChunkName: "index" */ '@/views/index.vue'),
    children: [
      {
        name: 'indexAbout',
        path: '/about',
        component: () => import(/* webpackChunkName: "about" */ '@/views/index/about.vue')
      },
      {
        name: 'indexTable',
        path: '/table',
        component: () => import(/* webpackChunkName: "table" */ '@/views/index/table.vue')
      }
    ]
  },
  {
    name: 'notFound',
    path: '/not-found',
    component: () => import(/* webpackChunkName: "not-found" */ '@/views/not-found.vue')
  }
]
export default routes
