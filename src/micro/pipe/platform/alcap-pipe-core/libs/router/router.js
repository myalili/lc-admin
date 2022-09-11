

import Vue from 'vue';
import vueRouter from 'vue-router';

Vue.use(vueRouter);

import _ from 'lodash';



//console.log(loginPageType);


//import Login from "@/views/Login"
import noFound from "@/views/error/404"
// import { Layout } from 'ant-design-vue';

//3.1版本 在路由跳转的时候两次push replace 的path地址相同
const routerPush = vueRouter.prototype.push
vueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
const routerReplace = vueRouter.prototype.replace
vueRouter.prototype.replace = function push(location) {
  return routerReplace.call(this, location).catch(error => error)
}
const getComponent = async (packageName)=>{
  let {getSource} = window.alcapCoreUtils;
  let component = await getSource(packageName);
  console.log('component',component);
  return component
}


//基本的路由页面，不需要通过后台返回的
export const mainRouter = [{
  path: "/",
  component: () => getComponent(window.alcapConfig.layout),
  //component:() => import(`@/views/microPages/layout/defaultLayout/index.vue`),
  // component: () => import(`@/layoutV2/index.vue`),
  redirect: 'main',
  isLayout: true,
  children: [
    {
      path: '/redirect/:path*',
      component: () => import('@/micro/pipe/platform/alcap-pipe-core/libs/components/redirect.vue')
    },
    {
      path: "/main",
      name: 'main',
      //component: () => import(`@/views/microPages/main/index.vue`),
      component:() => getComponent("@micro-page/main")
    },
    {
      path: '/404',
      component: noFound,
      hidden: true,
      meta: {
        title: "404"
      }
    },

    {
      path: "/openSinglePage",
      id:"backTop",
      // component: () => import(`@/views/appPage/index.vue`),
      component: ()=>getComponent("@micro-page/open-single-page"),
      // children: [{
      //   path: "/openSinglePage/preview",
      //   name: 'openSinglePagePreview',
      //   component: () => import(`@/views/codeLess/index.vue`),
      // }]
    },
    // {
    //   path: "/aopsDeal",
    //   // component:
    //   component: () => import(`@/views/microPages/myToDoList/components/afoe/userTask/CompleteTask.vue`),
    //   children: [{
    //     path: "/aopsDeal/preview",
    //     name: 'aopsDealPreview',
    //     component: () => import(`@/views/codeLess/index.vue`),
    //   }]
    // },
    // {
    //   path: "/app",
    //   component: () => import(`@/views/codeLess/appDetail.vue`),
    //   id: "app",
    //   children: [
    //     {
    //       path: "/app/addPageIndex",
    //       name: 'addPageIndex',
    //       component: () => import(`@/views/codeLess/addPageIndex.vue`),
    //     },
    //     {
    //       path: "/app/render",
    //       name: 'appRender',
    //       component: () => import(`@/views/codeLess/index.vue`),
    //     }
    //   ]
    // },
    // {
    //   path: "/openPage",
    //   component: () => import(`@/views/appPage/index.vue`),
    //   children: [{
    //     path: "/app/openPage/detail",
    //     name: 'appOpenPage',
    //     component: () => import(`@/views/codeLess/index.vue`),
    //   }]
    // },
    {
      path: "/appV2",
      component: ()=>getComponent("@micro-page/appDetails"),
      id:"appV2"
      // children: [{
      //   path: "/appV2/addPageIndexV2",
      //   name: 'addPageIndexV2',
      //   component: () => import("@/views/microPages/appManagement/addPageIndex/index.vue"),
      // }, {
      //   path: "/appV2/renderV2",
      //   name: 'appRenderV2',
      //   component: () => import(`@/views/microPages/appManagement/appRender/index.vue`),
      // }],
    }

  ]
},

{
  path: "/login",
  //component: () => import(`@/views/microPages/login/alcapDefaultLogin/index.vue`),
  component:()=>getComponent(window.alcapConfig.login)
},
// {
//   path: "/innerLogin",
//   component: () => import(`@/login/pages/AMDP/index.vue`),
// },
{
  path: '*',
  redirect: '/404',
  component: noFound,
  hidden: true
}
];



const createRouter = () => {
  return new vueRouter({
    routes: _.cloneDeep(mainRouter)
  })
}

const router = createRouter()

// 退出登录或者更改角色或者重新addroutes 需要resetRouter
export function resetRouter() {
  const newRouter = createRouter()
  router.options.routes = _.cloneDeep(mainRouter)

  router.matcher = newRouter.matcher // reset router
}

window.router = router;
export default router
