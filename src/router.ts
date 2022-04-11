import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/Index.vue'),
    meta: {
      title: 'The BikeTag Game',
    },
  },
  {
    path: '/games',
    component: () => import('@/views/Dashboard.vue')
  },
  {
    path: '/games/:name',
    component: () => import('@/views/GameDashboard.vue')
  }
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
