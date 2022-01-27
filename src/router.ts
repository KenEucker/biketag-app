import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/Index.vue'),
    meta: {
      title: 'The BikeTag Game',
    },
  },
]

const protectedRoutes: Array<RouteRecordRaw> = []

const router = createRouter({
  history: createWebHistory(),
  routes: [...routes, ...protectedRoutes],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
