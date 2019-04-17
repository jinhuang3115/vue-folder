import Vue from 'vue';
import Router from 'vue-router';
import { routerEnv } from '../utils/utils';

const evnConfig = ['ex'];

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: `${routerEnv}/`,
      name: 'home',
      meta: {

      },
      component: () => import('../views/home/index.vue'),
    },
  ],
});

if (process.env.NODE_ENV === 'development') {
  router.beforeEach((to, from, next) => {
    const { path, query } = to;
    let toPath = '';
    const match = from.params.pathMatch;
    if (!new RegExp(evnConfig.map(item => `${item}/`).join('|'), 'ig').test(to.path)) {
      toPath = match + path;
      if (to.redirectedFrom) {
        toPath = to.redirectedFrom.split('/')[1] + path;
      }
      next({ path: toPath, query });
    } else {
      next({ query });
    }
    return false;
  });
}

export default router;
