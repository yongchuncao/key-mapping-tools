import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

//这里动态导入模块，生成一个Promise异步对象,并把这个对象赋值给login变量
//正常情况下ES6 import（）是立即执行导入到html的，webpack打包的时候,重写了它把import变成了需要用的时候执行import
const home = () => import(/* webpackChunkName: "home" */'@/modules/home/home.vue');
const whitelisted = () => import(/* webpackChunkName: "white-listed" */'@/modules/whitelisted/white-listed.vue');

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'home'
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: "/whitelisted",
      name: 'whitelisted',
      component: whitelisted
    }
  ]
});
