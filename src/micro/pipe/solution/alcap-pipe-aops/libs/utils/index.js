import Vue from 'vue';


import * as longProcess from './longProcess'
import * as constant from './constant'
import * as response from './response'
import * as serverCatalog from './serverCatalog'
import * as common from './common'
import * as translate from './translate'
import * as fileSaver from './fileSaver'


import date from './filters/date.js'
Vue.filter(date.name, date.filter);


Vue.prototype.aopsChoreRequest = async function (request, message) {
    const prefix = message ? message + ': ' : '';
    try {
      const res = await request;
      if (res.success) {
        return res.content ?? true;
      } else {
        this.$message({ message: prefix + (res.errorMessage ?? res.errorTips?.join(',')), type: 'error', showClose: true });
      }
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : JSON.stringify(err);
      this.$message({ message: prefix + errorMessage, type: 'error', showClose: true });
    }
  };
let aopsUtils = {
    ...longProcess,
    ...constant,
    ...response,
    ...serverCatalog,
    ...common,
    ...translate,
    ...fileSaver
}

window.aopsUtils = aopsUtils;

// export default aopsUtils