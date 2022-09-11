// import 'babel-polyfill'   //如果需要兼容到IE9就打开


import Vue from 'vue'
import App from './App'
import moment from "moment";
import packageV from "packageJSON";
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// import './assets/element-variables.scss'
import 'animate.css/source/animate.css'
import echarts from 'echarts'
import axios from 'axios'
import './assets/tailwind.css'
// import components from "@/@aweb-components/aweb.components.js";
// import './micro/index'


window.axios = axios;
window.Vue = Vue;
Vue.use(ElementUI)
window.alcapVersion = packageV.version
window.platform = "ALCAP";
window.moment = moment;
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;

let initVue=()=>{
  let store = window.alcapCoreStore;
  window.store = store;
  Vue.prototype.$store = store;

    const {
      router,
      setRouterIntercept
    } = window.alcapCoreUtils;
    const whiteList = []
    setRouterIntercept && setRouterIntercept(router,store,whiteList)

    new Vue({
      // i18n,
      router,
      store,
      methods: {
        closeTab(path) {
          this.$store.commit("tabs/DELETE_TABS", path || this.$store.getters.getActiveTab);
        },
        close(path) {
          this.closeTab(path)
        }

      },
      render: h => h(App)
    }).$mount('#app')
};

let {preload,libs} = window.alcapConfig;
let appearanceLibsMap =window.appearanceLibsMap = {};
const getAppearanceJson = async()=>{
  let {libs} = window.alcapConfig;
  libs.forEach(lib=>{
      appearanceLibsMap[lib.name] = lib
  })
};

const getSource =  async(packageName,options={})=>{
  // console.log(packageName);
  let {
      useLocalPath,//使用的本地路径，dev环境有此属性时优先使用该属性填写的路径
      ver//版本
      ,isCss//是否为样式文件
      ,isMicroPipe//是否为公共方法包
  } = options;
  let pck = appearanceLibsMap[packageName];
  if(!pck){
      console.log(`appearanceLibsMap不存在${packageName}的相关信息`)
      return packageName
     
      // return ''
  }
  let {version,localPath,microSupport} = pck;

  //加载微页面公共包，目前先递归，后面根据需要改成for循环
  if(microSupport && microSupport.js && microSupport.js.length){
      
     let promises =  microSupport.js.map(js => {
          return getSource(js,{
              isMicroPipe:/^@micro\-pipe/.test(js)
          })
     })
     
    await Promise.all(promises)
     
  }
  if(microSupport && microSupport.css && microSupport.css.length){
     let promises = microSupport.css.map(css=>{
          return getSource(css,{
              isCss:true,
          })
      })
      await Promise.all(promises)
  }
  
  let env = window.alcapConfig.env;
  //url默认拿资源市场路径
  let url = `${process.env.VUE_APP_UNPKG}/${packageName}@${ver?ver:version}/dist/index.umd.min.js`;
  switch(env){
      case "serve-dev":
          //有本地路径获取本地路径
              localPath && (url = localPath.replace('@','.'))
          
          break;
      case "dev":
      //拿资源市场路径
        break;
            
      case "pro":
        //生产环境
        //拿本地下载好的文件路径
         url = `${process.env.BASE_URL}/files/${packageName}@${ver?ver:version}/dist/index.umd.min.js`;
        break;
  }
  // console.log(url)
  let res ="";
  if(isCss){
    url = url.replace(/dist\/index\.umd\.min\.js$/,"index.css");
  }
  if(localPath){
    // if(url.includes('pck')){//本地测试用
    //   res = await window.systemjs.import(`${process.env.BASE_URL}/files/@v2-lib/vue.spa.plugin@9.0.0/dist/index.umd.min.js`)
    // }else{
      res  = await import(`${url}`)
    // }
   
  }else{
    res = await window.systemjs.import(`${url}`)
  }
  
  // console.log(url,res)
  return res;
};


if(preload.length && libs.length){
  console.log('preload',preload);
  getAppearanceJson()
  let queue = [];
  let next = async function () {
    let n = queue.shift();
    n && (await n());
  };
  preload.forEach((p,index)=>{
    let step = next;
    if(preload.length===index+1){
      step = initVue;
    }
    if(appearanceLibsMap[p]){
      queue.push(async()=>{
        await getSource(appearanceLibsMap[p].name);
       step()
       
      })
      
    }
  })
  next()
}else{
  initVue()
}





