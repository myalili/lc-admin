import Vue from 'vue'
import Vuex from 'vuex'

import overview from './serverCatalog/overview';
import operation from './serverCatalog/operation';
import onlineSummary from './serverCatalog/onlineSummary';
import system from './auth/system';
import tenant from './auth/tenant';
import { default as longProcess, getStore as getLpStore } from './portalLong/longProcess';
import lpDefinition1 from './afoe/lpDefinition';
import lpInstance1 from './afoe/lpInstance1';
import lpInstTask from './afoe/lpInstTask';
import lpInstVariable from './afoe/lpInstVariable';
import systemApi from './afoe/systemApi';
import afoeAdminLpTodoTask from './afoeAdmin/lpTodoTask';
import afoeAdminLpDoneTask from './afoeAdmin/lpDoneTask';
import afoeAdminLpDefinition from './afoeAdmin/lpDefinition';
import afoeAdminLpRuInstInvolvedMe from './afoeAdmin/lpRuInstInvolvedMe';
import afoeAdminLpRuInstStartedByMe from './afoeAdmin/lpRuInstStartedByMe';
import afoeAdminLpHiInstStartedByMe from './afoeAdmin/lpHiInstStartedByMe';
import afoeAdminLpHiInstInvolvedMe from './afoeAdmin/lpHiInstInvolvedMe';
import afoeAdminLpInstance from './afoeAdmin/lpInstance';
Vue.use(Vuex)
const modules={
    system,
    overview,
    operation,
    onlineSummary,
    longProcess,
    longProcessForTree: getLpStore(),
    tenant,
    systemApi,
    lpDefinition1,
    lpInstance1,
    lpInstTask,
    lpInstVariable,
    afoeAdminLpDefinition,
    afoeAdminLpTodoTask,
    afoeAdminLpDoneTask,
    afoeAdminLpRuInstInvolvedMe,
    afoeAdminLpRuInstStartedByMe,
    afoeAdminLpHiInstInvolvedMe,
    afoeAdminLpHiInstStartedByMe,
    afoeAdminLpInstance,
    
  };


 let aopsStore= new Vuex.Store({
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

  window.aopsStore  = aopsStore;