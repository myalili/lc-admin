
!window.V8 && (window.V8 = {});
const _import = (file, mixins) => {
    // debugger;
    return import(
        /* webpackExclude: /\.def$/ */
        /* webpackChunkName: "[request]"*/
        /* webpackMode: "lazy" */
        `@/views/${file}`).then((module) => {
            if (!module.default.mixins) {
                module.default.mixins = []
            }
            mixins && module.default.mixins.push(mixins);
            return module.default;
        });
}
const _import_V2Comps = (url)=>{
    return import('@/v2Components'+url.replace(/^@\/v2Components/,"").replace(/\.vue$/,"")+'.vue')
          .then((module)=>{
            return module.default;
          })
}

window.V8._spa_import = _import;
window.V8._import_V2Comps = _import_V2Comps;