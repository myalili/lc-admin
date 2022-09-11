
import _spa_import from "../util/_spa_import.js";

import store from "../store";
import Vue from "vue";
import Amodal from "../components/modal.vue";
import AEmpty from "../components/empty.vue";
import _previewLib from '../util/_previewLib'
const ComponentModal = Vue.extend(Amodal);
const _import_pro = file => () => {
  return (window.V8._spa_import && window.V8._spa_import(file, mixins)) || (_spa_import && _spa_import.default && _spa_import.default(file, mixins)) || _spa_import(file, mixins)
}

export const _require = file => () => window.systemjs.import(`${file}`).then((module) => {
  if (!module.default.mixins) {
    module.default.mixins = []
  }
  module.default.mixins.push(mixins);

  return module.default
}).catch(e => {
  console.log('_require出错：' + e)
})

const __import = (file, incDeploy) => {
  const DEPLOY_PREVIEW = process.env.NODE_ENV === 'development' && process.env.VUE_APP_DEPLOY_PREVIEW === 'true';

  if (DEPLOY_PREVIEW || process.env.NODE_ENV === 'production' && (process.env.VUE_APP_DEPLOY === 'true' || incDeploy)) {
    file = file.replace(/\.vue$/, '');
    let fileName = file.split('/').join('-');
    let ds = "";
    if (process.env.VUE_APP_DEPLOY_STATIC) {
      ds = process.env.VUE_APP_DEPLOY_STATIC;
    }
    return _require(`${ds}/js/${file}/${fileName}.umd.js`)
  } else {
    return _import_pro(file)
  }
}

export const _import = process.env.VUE_APP_PREVIEW === 'true' ? _previewLib(mixins) : __import;

const mixins = {
  data() {
    return {
      awb__modal__store: null,
      // AParams:
      //   (this.$parent && this.$parent.params) ||
      //   (this.$route && this.$route.query) ||
      //   {},
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (window.isDebug && process.env.NODE_ENV === "development")
        window.activeVm = vm;

      let toComp = vm.$router.getMatchedComponents(to)[1]
        ? vm.$router.getMatchedComponents(to)[1]
        : vm.$router.getMatchedComponents(to)[0];

      toComp.resume && toComp.resume.call(vm);

      vm.__resume && vm.__resume();
    });
  },
  beforeRouteLeave(to, from, next) {
    let fromCom = this.$router.getMatchedComponents(from)[1]
      ? this.$router.getMatchedComponents(from)[1]
      : this.$router.getMatchedComponents(from)[0];

    fromCom.pause && fromCom.pause.call(this);

    this.__pause && this.__pause();

    next();
  },
  computed: {
    AParams() {
      let ret = {};
      if (this.$route && this.$route.query) {
        ret = this.$route.query;
        let v8id = this.$route.query.v8id
        if (v8id) {
          let params = window.V8.getCache(v8id) || {}
          ret = { ...ret, ...params }
        }
      } else {
        ret = (this.$parent && this.$parent.params) || {}
      }
      return ret
    }
  },
  created() { },
  mounted() {
    // console.log("mounted",this.$el)
    this.awb__modal__store = store();
  },
  methods: {
    async open(option) {
      let {
        // status,
        page,
        path,
        title,
        type,
        params,
        hideCancelBtn,
        hideConfirmBtn,
        confirmCallback,
        cancelCallback,
        other,
        meta,
        width,
        height,
        deploy,
        customClass,
        component,
        closeOnClickModal,
        optBtns,
        customConfirmBtn,
        customCancelBtn,
        pageType,
        beforeConfirm,
        fullScreen
      } = option;
      let rt = this.$router || this.$root.__parent.$router
      let routerTemp = rt && rt.options.routes;
      let layoutRoute = [];
      let componentModal;
      //判断是否存在路由表
      let hasIn = false;

      let self = this;
      let relComp;
      component = component || page;
      path = path || component;

      if (path) {
        if (path.charAt(0) !== "/") {
          path = `/${path}`;
        }
        path = path.replace(/(\/)+/g, "/");
        // debugger;
        if (routerTemp) {
          const findLayoutId = (data) => {
            for (let i = -1, element; (element = data[++i]);) {
              if (option.layout && option.layout === element.id) {
                if (!element.children) element.children = [];
                layoutRoute = element.children;
                return true;
              } else if (element.children) {
                let ret = findLayoutId(element.children);
                if (ret) {
                  return ret;
                }
              }
            }

          }

          let matchId = findLayoutId(routerTemp);
          if (!matchId) {
            for (let i = -1, item; (item = routerTemp[++i]);) {
              if (item.isLayout) {
                if (!item.children) item.children = [];
                layoutRoute = item.children;
                break;
              }
            }
          }


          // routerTemp.forEach((element) => {
          //   if (option.layout && option.layout === element.id) { 
          //     if (!element.children) element.children = [];
          //     layoutRoute = element.children;
          //     return;


          //   } else if (element.isLayout) {
          //     if (!element.children) element.children = [];
          //     layoutRoute = element.children;
          //     return;
          //   } else if (routerTemp.children) {
          //     // routerTemp.children.forEach((e) => {
          //     //   if (e.isLayout) {
          //     //     if (!e.children) e.children = [];
          //     //     layoutRoute = e.children;
          //     //   }
          //     //   return;
          //     // });
          //   }
          // });

          let matcher = rt.match(path);
          matcher &&
            (hasIn = matcher.matched.some((item) => {
              return item.path === path || (item.path && item.path.includes(":"));
            }));
        }

        // if (!self.beforeOpen || (await self.beforeOpen(option))) {
        switch (type) {
          case "SUB":
            if (!self.awb__modal__store.state.modalIns) {

              componentModal = new ComponentModal({
                propsData: {
                  awb__modal__store: self.awb__modal__store,
                  __parent: self,
                  deploy,
                  other,
                  pageType,
                  width,
                  height,
                  customClass,
                  closeOnClickModal,
                  cancelCallback,
                  confirmCallback,
                  hideCancelBtn,
                  hideConfirmBtn,
                  component,
                  params,
                  title,
                  optBtns,
                  customConfirmBtn: customConfirmBtn || '提交',
                  customCancelBtn: customCancelBtn || '取消',
                  fullScreen,
                  beforeConfirm,
                }

              }).$mount();
              let appendEl = self.$el;
              if (option.body) {
                appendEl = document.querySelector("body");
              }
              appendEl.appendChild(componentModal.$el);
              self.awb__modal__store.commit('set_modalIns', componentModal);

            }
            self.awb__modal__store.commit('set_modalVisible', true);


            self.__pause && self.__pause();

            break;
          case "WINDOW":
            localStorage.setItem("openWindow", component);
            let routerUrl =
              window.location.origin +
              "/#/" +
              component +
              (params ? "?params=" + JSON.stringify(params) : "");
            window.open(encodeURI(routerUrl));

            break;
          default:
            meta = meta || {};
            meta = { ...meta, title, type, pageType };

            //不存在路由表里
            if (!hasIn && component) {

              if (pageType === 'iframe') {
                meta.iframeUrl = component;
                relComp = AEmpty;
              } else if (pageType === 'js' || other) {
                // other = true;
                relComp = _require(component)
              } else if (pageType === 'component') {
                relComp = Vue && Vue.options.components[component] || AEmpty
              } else if (typeof component === "string") {
                relComp = _import(component, deploy)
              } else {
                relComp = component
              }


              layoutRoute.push({
                path: path,
                props: true,
                component: relComp,
                meta: meta,
              });
              rt.addRoutes(routerTemp);


            }

            //query 过滤对象，或者对象字符串
            let v8id = new Date().getTime();
            let _params = {};
            if (params) {
              let cache = {};
              for (let p in params) {
                if (typeof params[p] === 'object') {
                  cache[p] = params[p]
                } else {
                  cache[p] = params[p];
                  _params[p] = params[p];
                }
              }
              _params.v8id = v8id;
              window.V8.setCache(v8id, cache)
            }

            rt.push({
              path: path,
              query: _params,
              meta: meta,
            });

            meta.__path = path;
            // let allRoute = {
            //   [path]: 
            // };

            let cacheRoute = window.V8.getCacheRoute();
            let cahceMap = {};
            cacheRoute.forEach(item => {
              cahceMap[item.path] = item
            })
            cahceMap[path] = {
              ...option,
              query: params,
              component: typeof component === "string" && component || '',
              path,
              meta,
              __time: v8id
            }
            console.log('cahceMap',cahceMap)
            cacheRoute = Object.values(cahceMap);
            console.log('cacheRoute',cacheRoute)
            cacheRoute = cacheRoute.sort((a, b) => {
              return b.__time - a.__time
            }).slice(0, 7)
            console.log('cacheRoute',cacheRoute)
            window.V8.setCacheRoute(JSON.stringify(cacheRoute));
            // window.localStorage.setItem('routeConfig', JSON.stringify(allRoute));

            //兼容7.x.x版本
            sessionStorage.setItem('meta', JSON.stringify(meta));
        }
        // }
      }

    },

    async close(option) {
      let self = this;

      // if (!self.beforeClose || (await self.beforeClose(option))) {
      self.$root.close(option);
      // }




    },
    getUID() {
      return Number(
        Math.random()
          .toString()
          .substr(3, length) + Date.now()
      ).toString(36);
    },

  },
  beforeDestroy() {

  }


};


export default mixins;
