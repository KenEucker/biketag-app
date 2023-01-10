import {
  createRouter,
  createWebHistory,
  type Router,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteRecordRaw
} from 'vue-router'
import { nextTick } from 'vue'
import authGuard from './auth/authGuard'

// Pinia Store
import { useGlobal } from '@/store'

// Components
// import AboutPage from '@/views/AboutPage.vue'
// import HomePage from '@/views/HomePage.vue'
// import DashboardPage from '@/views/DashboardPage.vue'

/** Router Rules */
// const routes: RouteRecordRaw[] = [
//   {
//     path: '/',
//     name: 'Home',
//     component: HomePage,
//     meta: {
//       icon: 'mdi-home'
//     }
//   },
//   {
//     path: '/about',
//     name: 'About',
//     component: AboutPage
//   },
//   {
//     path: '/dashboard',
//     name: 'Dashboard',
//     component: DashboardPage
//   }
// ]

/** Router Rules */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      icon: 'mdi-game-controller',
      layout: 'Empty'
    }
  },
  {
    path: '/guest/games',
    name: 'ClientGamesDashboard',
    component: () => import('@/views/ClientGamesDashboard.vue'),
    meta: {
      icon: 'mdi-game-controller',
      layout: 'Dashboard',
      showSearchBar: true
    }
  },
  // {
  //   path: '/guest/games/:name',
  //   name: 'ClientTagsDashboard',
  //   component: () => import('@/views/ClientTagsDashboard.vue'),
  //   meta: {
  //     icon: 'mdi-game-controller',
  //     layout: 'Dashboard',
  //     showSearchBar: true
  //   }
  // },
  {
    path: '/privacy',
    name: 'Privacy Policy',
    component: () => import('@/views/Wiki.vue'),
    meta: {
      icon: 'mdi-game-controller',
      layout: 'Empty'
    }
  },
  {
    path: '/conduct',
    name: 'Code Of Conduct',
    component: () => import('@/views/Wiki.vue'),
    meta: {
      icon: 'mdi-game-controller',
      layout: 'Empty'
    }
  },
  {
    path: '/terms',
    name: 'Terms Of Service',
    component: () => import('@/views/Wiki.vue'),
    meta: {
      icon: 'mdi-game-controller',
      layout: 'Empty'
    }
  },
  {
    path: '/configuration',
    name: 'Configuration For Self Hosting',
    component: () => import('@/views/Wiki.vue'),
    meta: {
      icon: 'mdi-game-controller',
      layout: 'Empty'
    }
  },
  {
    path: '/contributing',
    name: 'Contributing To Projects',
    component: () => import('@/views/Wiki.vue'),
    meta: {
      icon: 'mdi-game-controller',
      layout: 'Empty'
    }
  },
  {
    path: '/developers',
    name: 'Developers Portal',
    component: () => import('@/views/Wiki.vue'),
    meta: {
      icon: 'mdi-game-controller',
      layout: 'Empty'
    }
  }
]

const protectedRoutes: Array<RouteRecordRaw> = [
  {
    path: '/games',
    name: 'GamesDashboard',
    beforeEnter: authGuard,
    component: () => import('@/views/GamesDashboard.vue'),
    meta: {
      icon: 'mdi-game-controller',
      layout: 'Dashboard',
      showSearchBar: true
    }
  }
  // {
  //   path: '/games/:name',
  //   name: 'TagsDashboard',
  //   beforeEnter: authGuard,
  //   component: () => import('@/views/TagsDashboard.vue'),
  //   meta: {
  //     icon: 'mdi-game-controller',
  //     layout: 'Dashboard',
  //     showSearchBar: true
  //   }
  // }
  // {
  //   path: '/games/:name/import',
  //   name: 'ImportTags',
  //   beforeEnter: authGuard,
  //   component: () => import('@/views/ImportTags.vue'),
  //   meta: {
  //     icon: 'mdi-game-controller',
  //     layout: 'Dashboard',
  //     showSearchBar: false
  //   }
  // },
  // {
  //   path: '/profile',
  //   name: 'Profile',
  //   beforeEnter: authGuard,
  //   component: () => import('@/views/Profile.vue'),
  //   meta: {
  //     icon: 'mdi-game-controller',
  //     layout: 'Dashboard',
  //     showSearchBar: false
  //   }
  // }
]

/** Vue Router */
const router: Router = createRouter({
  /**
   * History Mode
   *
   * @see {@link https://router.vuejs.org/guide/essentials/history-mode.html}
   */
  history: createWebHistory(import.meta.env.BASE_URL), // createWebHashHistory(import.meta.env.BASE_URL)

  routes: [...routes, ...protectedRoutes],
  scrollBehavior() {
    return { top: 0 }
  }
})

// Global before guards
// https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards}
router.beforeEach(
  async (
    _to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const globalStore = useGlobal()
    // Show Loading
    globalStore.setLoading(true)
    // Hide snack bar
    globalStore.setMessage('')
    await nextTick()

    next()
  }
)

// Global After Hooks
// https://router.vuejs.org/guide/advanced/navigation-guards.html#global-after-hooks}
router.afterEach(() => {
  const globalStore = useGlobal()
  // Hide Loading
  globalStore.setLoading(false)
})

export default router
