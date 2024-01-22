import { RouteRecordRaw } from 'vue-router'
// import { authGuard } from '@auth0/auth0-vue'
// import { debug, isAuthenticationEnabled } from 'biketag-vue/common/utils'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // {
      //   path: '',
      //   component: () => import('pages/IndexPage.vue'),
      //   meta: {
      //     isAuthRequired: true,
      //   },
      // },
      {
        path: '/games',
        name: 'GamesDashboard',
        component: () => import('pages/GamesDashboard.vue'),
      },
      {
        path: '/games/:name',
        name: 'TagDashboard',
        component: () => import('pages/TagsDashboard.vue'),
      },
      {
        path: '/games/action/:name?',
        name: 'GameCreation',
        component: () => import('pages/GameCreationForm.vue'),
        meta: {
          isAuthRequired: true,
        },
      },
      {
        path: '/games/ambassador',
        name: 'AddAmbassador',
        component: () => import('pages/AmbassadorForm.vue'),
        meta: {
          isAuthRequired: true,
        },
      },
      {
        path: '/games/player/action',
        name: 'AddPlayer',
        component: () => import('pages/PlayerForm.vue'),
        meta: {
          isAuthRequired: true,
        },
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('pages/ProfilePage.vue'),
        meta: {
          isAuthRequired: true,
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/LoginPage.vue'),
    meta: {
      isAuthRequired: false,
    },
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

const protectedRoutes: Array<RouteRecordRaw> = []

// if (isAuthenticationEnabled()) {
//   protectedRoutes = [
//     {
//       path: '/profile',
//       name: 'Profile',
//       beforeEnter: authGuard,
//       component: () => import('@/views/Profile.vue'),
//     },
//     {
//       path: '/approve',
//       name: 'Approve',
//       beforeEnter: authGuard,
//       component: () => import('@/views/Approve.vue'),
//     },
//   ]
// }

export default [...routes, ...protectedRoutes]
