

import AExternal from '@/views/external.vue';

const filterAsyncRouter = async (asyncRoutes) => {
    let {getSource} = window.alcapCoreUtils;
    let res =[];
    for(let i=0;i<asyncRoutes.length;i++){
        let route = asyncRoutes[i];
        let component;
        if (!route.component) {
            route.component = window.V8.AEmpty;
        }else if (typeof route.component === 'string') {
            // route.componentUrl = route.component;
            if (route.pageType === 'js') {
                route.component = window.V8._require(route.component)
            } else if (route.pageType === 'iframe') {
                component = route.component;
                route.component = window.V8.AEmpty;
                route.meta = route.meta || {};
                route.meta.iframeUrl = component;
            } else if (route.pageType === 'external') {
                component = route.component;
                route.component = AExternal;
                route.meta = route.meta || {};
                route.meta.externalUrl = component;

            } else if (route.pageType === 'component') {
                route.component = Vue && Vue.options.components[route.component] || window.V8.AEmpty;

            } else if(route.pageType==='release'){
                // console.log(route)
                route.component = async()=>await getSource('@micro-page/appRender')

            }else if(route.pageType==='arm'){
                // console.log(route)
                route.component = await getSource(route.component)
                // console.log(route.component)
            }else {
                if (route.pageType === 'deploy') {
                    route.deploy = true;
                }
                route.component = window.V8._import(route.component, route.deploy);
            }
        }
        if (route.children && route.children.length) {
            route.children = await filterAsyncRouter(route.children)
        }
        // console.log(route)
       res.push(route)
    }
    return res;
}

const state = {
    routes: []
}
const mutations = {
    SET_ROUTES(state, routes) {
        state.routes = routes;
    }
}
const actions = {
    transformRoutes({ commit }, routes) {
        return new Promise((resolve, reject) => {
            let accessRoutes = filterAsyncRouter(routes, true);
            commit('SET_ROUTES', accessRoutes)
            resolve(accessRoutes)
        })


    }
}

const getters = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters

}