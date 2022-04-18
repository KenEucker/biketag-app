import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './auth'

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   component: () => import('@/views/Index.vue'),
  //   meta: {
  //     title: 'The BikeTag Game',
  //   },
  // },
  // {
  //   path: '/',
  //   name: 'Login',
  //   component: () => import('@/views/Login.vue'),
  //   meta: { layout: 'Empty' },
  // },
  {
    path: '/',
    redirect: '/games',
  },
  // {
  //   path: '/games',
  //   name: 'GamesDashboard',
  //   component: () => import('@/views/Dashboard.vue'),
  //   meta: { layout: 'Dashboard' }
  // },
  // {
  //   path: '/games/:name',
  //   name: 'TagsDashboard',
  //   component: () => import('@/views/GameDashboard.vue'),
  //   meta: { layout: 'Dashboard' }
  // }
]

const protectedRoutes: Array<RouteRecordRaw> = [
  {
    path: '/games',
    name: 'GamesDashboard',
    beforeEnter: authGuard,
    component: () => import('@/views/GamesDashboard.vue'),
    meta: { layout: 'Dashboard' },
  },
  {
    path: '/games/:name',
    name: 'TagsDashboard',
    beforeEnter: authGuard,
    component: () => import('@/views/TagsDashboard.vue'),
    meta: { layout: 'Dashboard' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...routes, ...protectedRoutes],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
