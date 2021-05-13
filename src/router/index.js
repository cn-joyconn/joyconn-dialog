import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const scrollBehavior = (to, from, savedPosition) => {
    if (savedPosition) {
     // savedPosition is only available for popstate navigations.
     return savedPosition
    } else {
     const position = {}
     // new navigation.
     // scroll to anchor by returning the selector
     if (to.hash) {
      position.selector = to.hash
     }
     // check if any matched route config has meta that requires scrolling to top
     if (to.matched.some(m => m.meta.scrollToTop)) {
      // cords will be used if no selector is provided,
      // or if the selector didn't match any element.
      position.x = 0
      position.y = 0
     }
     // if the returned position is falsy or an empty object,
     // will retain current scroll position.
     return position
    }
   }
const router = new Router({
  mode: 'history',//适用于golang proxy 模式
  //  mode:'hash',
  scrollBehavior,
  routes: [
     
      {
          path: '/',
          redirect: '/demo',
      },
      {
          path: '/demo',
          name:'/demo',
          component: resolve => require(['../views/demo.vue'], resolve),
          meta: { title: '2d视图编辑',needLogin:false,scrollToTop: true }
      },
   
    
  ]
});

export default router;