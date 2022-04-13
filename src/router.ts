import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   component: () => import('@/views/Index.vue'),
  //   meta: {
  //     title: 'The BikeTag Game',
  //   },
  // },
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { layout: 'Empty' },
  },
  {
    path: '/games',
    name: 'GamesDashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { layout: 'Dashboard' }
  },
  {
    path: '/games/:name',
    name: 'TagsDashboard',
    component: () => import('@/views/GameDashboard.vue'),
    meta: { layout: 'Dashboard' }
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
