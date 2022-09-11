const {
    getToken,
    setToken,
    removeToken,
    getUser,
    removeUser,
    setUser,
    setUserInfo,
    getUserInfo,
    removeUserInfo,
    getAuth,
    setDepartmentId,
    getDepartmentId,
    removeDepartmentId,
    // setTenantId,
    // setAuth,
    removeAuth,
    resetRouter,
    caseRouter
} = window.alcapCoreUtils
const {
    modifiedPassword,
    requestLogin,
    getTenants,
    logout,
    getRoutersList,
    setTenant
} = window.getAacApi();
const {
    refreshUserInfo
} = window.getBffApi();

let caseList = caseRouter;
// let transformMenu = list => {
//     let menuObj = {},
//         result = list || [];

//     if (result.length) {
//         result
//             .sort((a, b) => {
//                 return parseInt(a.order || -1, 10) - parseInt(b.order || -1, 10);
//             })
//             .map(i => {
//                 !i.parentId && (i.parentId = "");
//                 let p = menuObj[i.parentId];
//                 if (!p) {
//                     p = menuObj[i.parentId] = {
//                         id: i.parentId,
//                         children: []
//                     };
//                 } else {
//                     !p.children && (p.children = []);
//                 }
//                 let item = menuObj[i.id] || {
//                     id: i.id
//                     //children:[]
//                 };
//                 item.parentId = i.parentId || "";
//                 item.name = i.id;
//                 item.path = i.id;

//                 item.deploy = i.deploy;
//                 item.pageType = i.pageType;
//                 item.type = i.type;
//                 item.pageId = i.pageId;

//                 i.path && (item.component = i.path);
//                 item.meta = {
//                     title: i.title,
//                     icon: i.icon || 'icon-yemianmingcheng3',
//                     external: i.external,
//                     externalUrl: i.externalUrl
//                 };
//                 menuObj[i.id] = item;
//                 p.children.push(item);
//             });

//         Object.keys(menuObj)
//             .filter(e => !menuObj[e].children)
//             .map(e => delete menuObj[e]);

//         // menuObj[""].children[0].meta.icon = 'user'
//         return menuObj[""].children;
//     } else {
//         return [];
//     }
// };

let transformMenu = (list,commit) => {
    let menuObj = {},
        result = list || [];

    let parentMenu = result.filter(item => {
        return !item.parentId
    }).sort((a, b) => {
        return parseInt(a.order || -1, 10) - parseInt(b.order || -1, 10);
    })

    let childMenu = result.filter(item => {
        return item.parentId
    }).sort((a, b) => {
        return parseInt(a.order || -1, 10) - parseInt(b.order || -1, 10);
    })

    result = parentMenu.concat(childMenu);

    if (result.length) {
        // result
        // .sort((a, b) => {
        //     return parseInt(a.order || -1, 10) - parseInt(b.order || -1, 10);
        // })
        result.map(i => {
            !i.parentId && (i.parentId = "");
            let p = menuObj[i.parentId];
            if (!p) {
                p = menuObj[i.parentId] = {
                    id: i.parentId,
                    children: []
                };
            } else {
                !p.children && (p.children = []);
            }
            let item = menuObj[i.id] || {
                id: i.id
                //children:[]
            };
            item.parentId = i.parentId || "";
            item.name = i.name;
            item.path = p.name ? "/" + p.name + "/" + i.name : "/" + i.name;

            item.deploy = i.deploy;
            item.pageType = i.pageType;
            item.type = i.type;
            // item.pageId = i.pageId;
            item.codelessType = i.codelessType;
            if(item.pageType === 'release'){
                item.prototypeId = i.path;
            }

            item.component = i.path;
            item.meta = {
                title: i.title,
                icon: i.icon || 'icon-yemianmingcheng3',
                external: i.external,
                externalUrl: i.externalUrl
            };
            // debugger;
            //华兴poc
            if (i.title && i.title.includes('首页')) {
                item.meta.title = '首页'
                item.meta.fixed = true

            }
            menuObj[i.id] = item;
            p.children.push(item);
        });

        Object.values(menuObj).forEach(val=>{
           let pid = val.parentId;
           let path = [val.name];
            while(pid && menuObj[pid]){
                let parent = menuObj[pid]
                path.unshift(parent.name);
                pid = parent.parentId
            }
            val.path = '/'+path.join('/')
        })

        commit('set_menu_map',JSON.parse(JSON.stringify(menuObj)))

        Object.keys(menuObj)
            .filter(e => !menuObj[e].children)
            .map(e => delete menuObj[e]);

            

        // menuObj[""].children[0].meta.icon = 'user'
        return menuObj[""].children;
    } else {
        return [];
    }
};
const state = {
    tenantList: [],
    tenantInfo: {},
    currentData: null,
    hasMenu: false,
    token: getToken(),
    userName: getUser(),
    avatar: './img/user.png',
    menus: [],
    userInfo: getUserInfo(),
    auth: getAuth() || {},
    menuMap:{},
    // formatMenus: [],
    // currentHeadrMenus: "",
    currentMenus: [],
    //部门列表
    curDepartment:{}
}
const getters = {
    menu:(state)=>(id)=>{
        return state.menuMap[id]||''
       
    },
    userName: (state) => {
        return state.userInfo.name
    },
    tenantId: (state) => {
        return state.tenantInfo.id
    },
    subMenus: (state) => (pid) => {
        let ret = [];
        state.menus.forEach(m => {
            if (m.id === pid) {
                ret = m.children || []
            }
        })
        return ret;
    }
}
const mutations = {
    set_menu_map(state,data){
        state.menuMap = data
    },
    SET_CURRENT_DATA(state, data) {
        state.currentData = data
    },
    SET_CURRENT_MENUS(state, data) {
        state.currentMenus = data;
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },

    SET_USER_NAME: (state, userName) => {
        state.userName = userName
    },
    SET_MENUS: (state, menus) => {
        state.hasMenu = true;
        state.menus = menus;
    },
    SET_MENUS_STATE(state, status) {
        state.hasMenu = status
    },
    SET_USER_INFO(state, info) {
        state.userInfo = info
    },
    SET_AUTH(state, auth) {
        state.auth = auth || {}
    },
    // SET_CURRENT_HEADER_MENUS(state, path) {
    //     state.currentHeadrMenus = path;

    // },
    SET_TENANT_INFO(state, data) {
        state.tenantInfo = data;
    },
    SET_TANENT_LIST(state, data) {
        state.tenantList = data;
    },
    // 设置部门列表
    SET_CURDEPARTMENT(state,data){
        state.curDepartment = data;
    }
}

const actions = {
    setcurDepartment({
        dispatch,
        commit
    },params){
        return new Promise(async(resolve,reject)=>{
            try{
                commit('SET_CURDEPARTMENT',params);
                setDepartmentId(params.id)
                commit('tabs/EMPTY_TABS', [], {
                    root: true
                });
                // window.sessionStorage.removeItem('openTabs')
                resetRouter();
               
                window.V8 &&  window.V8.clearCache();
                window.V8 && window.V8.removeCacheRoute();
                let list = (params && params.menus) || [];
                list = list.filter(item=>{
                    return item.codelessType === "devMenu" || item.codelessType ==="runtimeMenu"
                })
                console.log(list)
                commit("SET_CURRENT_MENUS", list);
                //转化后台的数据
                let menus = transformMenu(list,commit);
                let showCaseList = true;
                // debugger;
                if (showCaseList === undefined || showCaseList) {
                    caseList = caseList.map(item=>{
                        item.codelessType = 'caseMenu';
                        return item
                    })
                    // debugger;
                    menus = [...menus, ...caseList];
                }
                commit('SET_MENUS', menus);
                let routes = [...menus];
                let cacheRoutes = window.V8.getCacheRoute();
                // console.log(cacheRoutes)
                if (cacheRoutes && cacheRoutes.length) {
                  routes = [...routes, ...cacheRoutes]
                }
                // console.log(routes)
                //把菜单转化为路由
                const accessRoutes = await dispatch('permission/transformRoutes', routes,{root:true})
                // console.log(accessRoutes);
      
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
                window.router.addRoutes(router.options.routes);
                resolve(true)
            }catch(e){
                console.log(e);
                reject(false)
            }
           

        })
       
    },
    logout({
        dispatch,
        commit
    }, params) {
        return new Promise((resolve, reject) => {
            logout(params).then(response => {
                if (response.success) {
                    
                    dispatch('resetToken')
                    dispatch('resetUser')
                    dispatch('resetUserInfo')
                    dispatch('resetAuth')
                    commit('SET_MENUS_STATE', false);
                    commit('SET_CURDEPARTMENT',{});
                    removeDepartmentId();
                    commit('tabs/EMPTY_TABS', [], {
                        root: true
                    });
                    // debugger;
                    // window.sessionStorage.removeItem('openTabs')
                    resetRouter()
                    window.V8 &&  window.V8.clearCache()
                    resolve()
                }
            }).catch(error => {
                console.log(error);
                reject(error)
            })

        })
    },
    // logout({
    //     dispatch,
    //     commit
    // }, params) {
    //     return new Promise((resolve, reject) => {
    //         logout(params).then(response => {
    //             if (response.status) {

    //                 dispatch('resetToken')
    //                 dispatch('resetUser')
    //                 dispatch('resetUserInfo')
    //                 dispatch('resetAuth')
    //                 commit('SET_MENUS_STATE', false);
    //                 commit('tabs/DELETE_ALL_TABS', [], {
    //                     root: true
    //                 });
    //                 resetRouter()
    //                 resolve()
    //             }
    //         }).catch(error => {
    //             console.log(error);
    //             reject(error)
    //         })

    //     })
    // },
    login({
        commit
    }, params) {
        return new Promise((resolve, reject) => {
            requestLogin(params).then(response => {
                if (response.success) {
                    if (response.content.confirm) {
                        resolve(response);
                    } else {
                        const userData = response.content,
                            token = userData.access_token;

                        if (userData && token) {
                            commit('SET_TOKEN', token);
                            setToken(token);
                        }
                        refreshUserInfo().then(() => {
                            resolve(response);
                        })
                    }
                } else {
                    reject(response);
                }
            }).catch(error => {
                reject(error)
            })
        })
    },

    // login({
    //     commit
    // }, params) {

    //     return new Promise((resolve, reject) => {
    //         requestLogin(params).then(response => {
    //             if (response.status && response.success) {
    //                 const userData = response.obj,
    //                     token = userData.token;

    //                 if (userData && token) {
    //                     commit('SET_TOKEN', token);
    //                     setToken(token);
    //                     window.axios.defaults.headers.common["X-CSRF-TOKEN"] = token;
    //                 }
    //                 resolve(response);

    //             } else {
    //                 reject(response);
    //             }
    //         }).catch(error => {
    //             reject(error)
    //         })
    //     })
    // },
    // getMenus({ commit }, params) {
    //     return new Promise((resolve, reject) => {
    //         getRoutersList(params).then(res => {
    //             if (res && res.status) {
    //                 var list = (res && res.content && res.content.menus) || [];
    //                 //转化后台的数据
    //                 let menus = transformMenu(list);
    //                 menus=[...menus,...caseList]
    //                 commit('SET_MENUS', menus);
    //                 resolve(menus)
    //             } else {
    //                 reject();
    //             }
    //         });
    //     });
    // },
    getMenus({
        commit,
        rootGetters
    }, params) {
        return new Promise(async (resolve, reject) => {
            getRoutersList(params).then(res => {
                console.log(res);
                if (res) {
                    let list = (res && res.menus) || [],
                    userData = res.user || {};
                    userData.username = res.username
                    commit('SET_CURRENT_DATA', res);
                    res.tenant && commit("SET_TENANT_INFO", res.tenant)
                    // setTenantId(res.tenant);
                    setUser(userData.username);
                    commit('SET_USER_NAME', userData.username);
                    setUserInfo(userData);
                    commit('SET_USER_INFO', userData);

                    

                    //存在关联部门，需要拿关联部门的菜单
                    if(res.department && res.department.length){
                        let curId = getDepartmentId();
                        let result = res.department.filter(item=>item.id===curId);
                        let curDepartment = res.department[0]
                        if(result.length){
                            curDepartment = result[0];
                        }
                        commit('SET_CURDEPARTMENT',curDepartment);
                        
                        list = curDepartment.menus.concat(list); 
                        let listMap = {};
                        list.forEach(item=>{
                            listMap[item.id] =item;
                        })

                        list = Object.values(listMap);
                    }

                    

                    //设置没有转化的数据
                    list = list.filter(item=>{
                        return item.codelessType === "devMenu" || item.codelessType ==="runtimeMenu"
                    })
                    console.log(list)
                    commit("SET_CURRENT_MENUS", list);
                    //转化后台的数据
                    let menus = transformMenu(list,commit);
                    // console.log('menus', menus);
                    // let { showCaseList } = rootGetters['project/GET_PROJECT_INFO'];
                    let showCaseList = true;
                    // let showCaseList = false;
                    // debugger;
                    if (showCaseList === undefined || showCaseList) {
                        caseList = caseList.map(item=>{
                            item.codelessType = 'caseMenu';
                            return item
                        })
                        // debugger;
                        menus = [...menus, ...caseList];
                    }
                    // menus = [{ path: "/main", meta: { title: "工作台", icon: "icon-gongzuotai" } }, ...menus]
                    // menus=caseList;
                    commit('SET_MENUS', menus);
                    // commit('SET_USER_INFO', res.obj);

                    //设置前端权限
                    // commit('SET_AUTH',userData.permissions&&userData.permissions.permissions);
                    // setAuth(userData.permissions&&userData.permissions.permissions);

                    resolve(menus)
                }
            }).catch(error => {
                // debugger
                reject(error);
            })
        });
    },
    // getMenus({
    //     commit,
    //     rootGetters
    // }, params) {
    //     return new Promise((resolve, reject) => {
    //         getRoutersList(params).then(res => {
    //             console.log(res);
    //             if (res && res.status && res.success) {
    //                 var list = (res && res.obj && res.obj.menus) || [],
    //                     userData = res.obj || {};

    //                 setUser(userData.username);
    //                 commit('SET_USER_NAME', userData.username);
    //                 setUserInfo(userData);
    //                 commit('SET_USER_INFO', userData);
    //                 //设置没有转化的数据
    //                 commit("SET_CURRENT_MENUS", list);
    //                 //转化后台的数据
    //                 let menus = transformMenu(list);
    //                 let { showCaseList } = rootGetters['project/GET_PROJECT_INFO'];
    //                 if (showCaseList === undefined || showCaseList) {
    //                     menus = [...menus, ...caseList];
    //                 }
    //                 menus = [{ path: "/main", meta: { title: "工作台", icon: "icon-gongzuotai" } }, ...menus]
    //                 // menus=caseList;
    //                 commit('SET_MENUS', menus);
    //                 // commit('SET_USER_INFO', res.obj);

    //                 //设置前端权限
    //                 // commit('SET_AUTH',userData.permissions&&userData.permissions.permissions);
    //                 // setAuth(userData.permissions&&userData.permissions.permissions);

    //                 resolve(menus)
    //             } else {
    //                 reject(res.msg);
    //             }
    //         }).catch(error => {
    //             debugger
    //             reject(error);
    //         })
    //     });
    // },
    resetToken({
        commit
    }) {
        commit('SET_TOKEN', null)
        removeToken();

    },
    resetUser({
        commit
    }) {
        commit('SET_USER_NAME', '')
        removeUser();
    },
    resetUserInfo({
        commit
    }) {
        commit('SET_USER_INFO', '')
        removeUserInfo();
    },
    resetAuth({
        commit
    }) {
        commit('SET_AUTH', {})
        removeAuth();
    },
    resetPassword({
        commit
    }, params) {
        return new Promise((resolve, reject) => {
            modifiedPassword(params).then(response => {
                if (response.success) {
                    resolve(response)
                } else {
                    reject(response);
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    changeTenant({
        commit
    }, params) {
        return new Promise((resolve, reject) => {
            setTenant(params).then(res => {
                // console.log(res);
                if (res.success) {
                    commit('SET_MENUS_STATE', false);
                    commit('SET_CURDEPARTMENT',{});
                    removeDepartmentId();
                    commit('tabs/EMPTY_TABS', [], {
                        root: true
                    });
                    resetRouter()
                    resolve(res)
                } else {
                    reject(res);
                }


            }).catch(error => {
                // debugger
                console.log(error);
                reject(error);
            })
        });
    },
    setTenants({
        commit
    }) {
        return new Promise((resolve, reject) => {
            getTenants().then(res => {
                console.log(res);
                if (res.success) {
                    if (Array.isArray(res.content)) {
                        commit("SET_TANENT_LIST", res.content)
                    }
                    resolve(res)
                } else {
                    reject(res);
                }


            }).catch(error => {
                // debugger
                console.log(error);
                reject(error);
            })
        });
    }


}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters

}