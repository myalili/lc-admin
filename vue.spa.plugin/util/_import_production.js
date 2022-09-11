// const mixins = require('../mixin/index');
const _spa_import=require('./_spa_import.js');
const _import = file => () => ( _spa_import &&  _spa_import.default && _spa_import.default(file))||_spa_import(file)


// import(
//     /* webpackExclude: /\.def$/ */
//     /* webpackChunkName: "[request]"*/
//     /* webpackMode: "lazy" */
//     `@/views/${file}`).then((module) => {

//         if (!module.default.mixins) {
//             module.default.mixins = []
//         }
//         module.default.mixins.push(mixins.default);
//         return module.default
//     })

export default _import