import { RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    name: 'index',
    path: '/',
    component: () => import(/* webpackChunkName: "index" */ '@/views/index.vue'),
    children: [
      {
        name: 'index-about',
        path: 'about',
        component: () => import(/* webpackChunkName: "about" */ '@/views/index/about.vue')
      },
      {
        name: 'index-table',
        path: 'table',
        component: () => import(/* webpackChunkName: "table" */ '@/views/index/table.vue')
      },
      {
        name: 'index-demo',
        path: 'demo',
        component: () => import(/* webpackChunkName: "demo" */ '@/views/index/demo/index.vue'),
        children: [
          {
            name: 'index-demo-g-svg-icon-demo',
            path: 'g-svg-icon-demo',
            component: () => import(/* webpackChunkName: "demo" */ '@/views/index/demo/g-svg-icon-demo.vue')
          },
          {
            name: 'index-demo-g-table-demo',
            path: 'g-table-demo',
            component: () => import(/* webpackChunkName: "demo" */ '@/views/index/demo/g-table-demo.vue')
          },
          {
            name: 'index-demo-virtual-table-demo',
            path: 'virtual-table-demo',
            component: () => import(/* webpackChunkName: "demo" */ '@/views/index/demo/virtual-table-demo.vue')
          }
        ]
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
