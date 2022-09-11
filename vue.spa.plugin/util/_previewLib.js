
// import _import from './_import_production.js';
// import mixins, { _import } from '../mixin/index';
// window.root=root;
// import { root, cpt, widget } from '@v2-lib/webide.support.fusion/mixin/v2-view'
// import events from '@v2-lib/webide.support.fusion/mixin/events'

// import mixins from "@v2-lib/vue.spa.plugin/mixin";

function dynamicLoadCss(url) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    head.appendChild(link);
}

const _require = (file, mixins) => () => window.systemjs.import(`${file}`).then((module) => {
    if (!module.default.mixins) {
        module.default.mixins = []
    }
    mixins && module.default.mixins.push(mixins);
    dynamicLoadCss("./css/_preview.css");
    return module.default
})

const sysImport = (file, mixins) => {
    file = file.replace(/\.vue$/, '');
    console.log("%c [previewPlugin📺]预览" + file, "color:#fff;background-color:#009fc3;border-radius:4px;padding:3px 5px;");
    return _require(`/js/${file}._preview.js`, mixins)
}

const main = (mixins) => {
    return (wpath) => {
        return sysImport(wpath, mixins)

        // if (process.env.VUE_APP_PREVIEW == "true") {
        //     // window._preview = {
        //     //     root, cpt, widget, events, mixins
        //     // }
        // } else {
        //     return _import(wpath)
        // }
    }

}
if (process.env.VUE_APP_PREVIEW == "true") {
    console.log("%c [previewPlugin📺]预览插件已启用！", "color:#fff;background-color:#009fc3;border-radius:4px;padding:3px 5px;");
}
export default main;