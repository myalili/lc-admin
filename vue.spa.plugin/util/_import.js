import _require from "./_require_pro.js"
import _import from "./_import_production.js"
import _preview from "./_previewLib.js";

const _import_dep = (file, incDeploy) => {
    if (process.env.NODE_ENV === 'production' && (process.env.VUE_APP_DEPLOY === 'true' || incDeploy)) {
        file = file.replace(/\.vue$/, '');
        let fileName = file.split('/').join('-');
        let ds = "";
        if (process.env.VUE_APP_DEPLOY_STATIC) {
            ds = process.env.VUE_APP_DEPLOY_STATIC;
        }
        return _require(`${ds}/js/${file}/${fileName}.umd.js`)
    } else {
        return _import(file)
    }
}
const output = process.env.VUE_APP_PREVIEW==='true'?_preview:_import_dep;

export default output
