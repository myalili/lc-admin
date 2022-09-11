export const setRouterIntercept = (router,store,whiteList)=>{
     const {
        getToken,
        getAppearanceLibs
      } = window.alcapCoreUtils;
      
      
      router.beforeEach(async (to, from, next) => {

        // NProgress.start();
      
        let wpath = window.location.hash.split('?')[0].replace('#/', '');
        let routes = router.options.routes
      
      
      
        // //WEBIDE预览
        // if (window.V8._preview(router, to, next)) {
        //   return;
        // }
      
        // //打开新窗口
        if (localStorage.getItem('openWindow') && localStorage.getItem('openWindow') === wpath) {
          routes.push({
            path: '/' + wpath,
            component: window.V8._import(wpath),
            hidden: true
          });
          router.addRoutes(routes);
        }
      
        const token = getToken()
      
        if (token) {
      
          if (to.path === '/login') {
            next({
              path: '/'
            })
          } else {
      
            //是否已经获取菜单
            const hasMenu = store.state.user.hasMenu;
      
            if (hasMenu) {
              next()
            } else {
              try {
      
                //获取菜单
                const menus = await store.dispatch('user/getMenus', {
                  ctoken: token
                });
                window.alcapConfig.needArm && await getAppearanceLibs();
      
                store.dispatch('icon/unloadIcon');
                store.dispatch('icon/getIconResource', store.getters['user/tenantId'])
                // let openedTabs = store.state.tabs && store.state.tabs.openedTabs.filter(item => item.component) || []
                let routes = [...menus];
                let cacheRoutes = window.V8.getCacheRoute()
                if (cacheRoutes && cacheRoutes.length) {
                  routes = [...routes, ...cacheRoutes]
                }
                // console.log(routes);
      
                //把菜单转化为路由
                const accessRoutes = await store.dispatch('permission/transformRoutes', routes)
                console.log(accessRoutes);
                // debugger;
      
                //把菜单加入到路由
      
      
                const routeSeed = router.options.routes;
      
                for (let i = -1, element; (element = routeSeed[++i]);) {
                  if (element.children && element.children.length) {
                    routeSeed.push(...element.children)
                  }
                  if (element.id) {
                    if (!element.children) element.children = [];
                    //element.children.push(...accessRoutes); 
                    const layoutRoutes = accessRoutes.filter(item => {
                      return item.layout === element.id;
                    });
                    element.children.push(...layoutRoutes);
                  } else if (element.isLayout) {
                    const layoutRoutes = accessRoutes.filter(item => {
                      return !item.layout;
                    });
                    if (!element.children) element.children = [];
                    element.children.push(...layoutRoutes);
                  }
                }
      
      
      
                // router.options.routes.forEach(element => {
                //   if (element.id) {
                //     if (!element.children) element.children = [];
                //     //element.children.push(...accessRoutes); 
                //     const layoutRoutes = accessRoutes.filter(item => {
                //       return item.layout === element.id;
                //     });
                //     element.children.push(...layoutRoutes);
                //     return false;
                //   } else if (element.isLayout) {
                //     const layoutRoutes = accessRoutes.filter(item => {
                //       return !item.layout;
                //     });
                //     if (!element.children) element.children = [];
                //     element.children.push(...layoutRoutes);
                //     return;
                //   }
                // });
                router.addRoutes(router.options.routes)
      
                next({
                  path: to.redirectedFrom || to.path,
                  replace: true,
                  query: to.query
                })
              } catch (error) {
      
                // 删除token 并跳转到登录页
                console.log(error);
                await store.dispatch('user/resetToken')
                next(`/login`)
              }
            }
          }
        } else {
      
          //不需要登录的页面
          if (whiteList.indexOf(to.path) !== -1 || to.path === '/login' || to.path === '/innerLogin') {
            store.dispatch('icon/reloadIcon')
            next()
          } else {
            next(`/login`)
          }
        }
      
      
      
      })
      
      router.afterEach(() => {
        // 在即将进入新的页面组件前，关闭掉进度条
        // NProgress.done()
      })
}