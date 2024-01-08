import { route } from 'quasar/wrappers';
import {
  // createMemoryHistory,
  createRouter,
  // createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { useAuthStore } from 'src/stores/auth';
import { storeToRefs } from 'pinia';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  // const createHistory = process.env.SERVER
  //   ? createMemoryHistory
  //   : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const useAuth = useAuthStore();
  const { isAuthenticated } = storeToRefs(useAuth);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHistory(),
  });
  Router.beforeEach(async (to, from, next) => {
    if (!to.meta?.isAuthRequired) {
      return isAuthenticated.value && to.path === '/login'
        ? from.path !== '/games'
          ? next('/games')
          : next(false)
        : next();
    }
    if (to.meta?.isAuthRequired && !isAuthenticated.value) {
      return next('/login');
    }
    return next();
  });

  return Router;
});
