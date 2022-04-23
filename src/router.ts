import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { layout: 'Empty' },
  },
]

const protectedRoutes: Array<RouteRecordRaw> = [
  {
    path: '/games',
    name: 'GamesDashboard',
    beforeEnter: authGuard,
    component: () => import('@/views/GamesDashboard.vue'),
    meta: { layout: 'Dashboard', showSearchBar: true },
  },
  {
    path: '/games/:name',
    name: 'TagsDashboard',
    beforeEnter: authGuard,
    component: () => import('@/views/TagsDashboard.vue'),
    meta: { layout: 'Dashboard', showSearchBar: true },
  },
  {
    path: '/games/:name/import',
    name: 'ImportTags',
    beforeEnter: authGuard,
    component: () => import('@/views/ImportTags.vue'),
    meta: { layout: 'Dashboard', showSearchBar: false },
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
