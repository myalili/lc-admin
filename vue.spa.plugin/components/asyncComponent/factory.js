import LoadingComponent from './loading.vue'
import ErrorComponent from './error.vue'
import { _import } from "../../mixin/index"

// const _spa_import=require('../../util/_spa_import.js');
// import _previewLib from "../../util/_previewLib.js"


// const _import_dep = (file, incDeploy) => {
//         file = file.replace(/\\/g, '/').replace(/(\/)+/g, '/').replace(/^\//, '');
//         if (process.env.NODE_ENV === 'production' && (process.env.VUE_APP_DEPLOY==='true' || incDeploy)) {
//             file = file.replace(/\.vue$/, '');
//             let fileName = file.split('/').join('-')
//             return window.systemjs.import(`./js/${file}/${fileName}.umd.js`).then((module) => {
//                 if (!module.default.mixins) {
//                     module.default.mixins = []
//                 }
//                 module.default.mixins.push(mixins.default);
//                 return module.default
//             })
//         } else {
//             return  ( _spa_import &&  _spa_import.default && _spa_import.default(file))||_spa_import(file)
//         }
//     }


export default (path, delay, timeout, deploy) => () => ({
    component: _import(path, deploy)(),
    loading: LoadingComponent,
    error: ErrorComponent,
    // 展示加载时组件的延时时间。默认值是 200 (毫秒)
    delay: delay,
    // 如果提供了超时时间且组件加载也超时了，
    // 则使用加载失败时使用的组件。默认值是：`Infinity`,一般用3000
    timeout: timeout

})
