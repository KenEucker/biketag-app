import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { layout: 'Empty' },
  },
  {
    path: '/guest/games',
    name: 'ClientGamesDashboard',
    component: () => import('@/views/ClientGamesDashboard.vue'),
    meta: { layout: 'Dashboard', showSearchBar: true },
  },
  {
    path: '/guest/games/:name',
    name: 'ClientTagsDashboard',
    component: () => import('@/views/ClientTagsDashboard.vue'),
    meta: { layout: 'Dashboard', showSearchBar: true },
  },
  {
    path: '/privacy',
    name: 'Privacy Policy',
    component: () => import('@/views/Wiki.vue'),
    meta: { layout: 'Empty' },
  },
  {
    path: '/conduct',
    name: 'Code Of Conduct',
    component: () => import('@/views/Wiki.vue'),
    meta: { layout: 'Empty' },
  },
  {
    path: '/terms',
    name: 'Terms Of Service',
    component: () => import('@/views/Wiki.vue'),
    meta: { layout: 'Empty' },
  },
  {
    path: '/configuration',
    name: 'Configuration For Self Hosting',
    component: () => import('@/views/Wiki.vue'),
    meta: { layout: 'Empty' },
  },
  {
    path: '/contributing',
    name: 'Contributing To Projects',
    component: () => import('@/views/Wiki.vue'),
    meta: { layout: 'Empty' },
  },
  {
    path: '/developers',
    name: 'Developers Portal',
    component: () => import('@/views/Wiki.vue'),
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
  {
    path: '/profile',
    name: 'Profile',
    beforeEnter: authGuard,
    component: () => import('@/views/Profile.vue'),
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
