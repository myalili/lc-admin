import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

//动态添加模块
const modulesFiles = require.context('./modules', true, /\.js$/)
const modules={};
modulesFiles.keys().map(key => {
  const keys = key.replace(/(\.\/|\.js)/g, '')
  modules[keys.split('/').pop()] = modulesFiles(key).default
})
// console.log(modules);


export default new Vuex.Store({
  modules,
  state: {
   
  },
  getters:{
 
  },
  mutations: {
   
  },
  actions: {

  }
})
