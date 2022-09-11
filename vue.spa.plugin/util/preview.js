// import _require from "./_require_pro.js"
import { _import } from "../mixin/index";


export default (router, to, next) => {
    let wpath = window.location.hash.split('?')[0].replace('#/', '');
    let urlParam = window.location.hash.split('?')[1];
    let isPreview = false;
    //IDE 预览
    if (wpath && urlParam && urlParam.indexOf('IDE') !== -1) {
        let hasIn = false;
        let path = '/' + wpath;
        let matcher = router.match(path)
        matcher && (hasIn = matcher.matched.some(item => {
            return item.path === path
        }))
        if (!hasIn) {
            let isLayout = false;
            let elRoute = {
                path: path,
                replace: true,
                component: _import(wpath),
                meta: {
                    title: '预览',
                    type: 'preview'
                }
            }
            router.options.routes.forEach(element => {
                if (element.isLayout) {
                    isLayout = true;
                    if (!element.children) element.children = [];
                    element.children.push(elRoute);

                    return;
                }
            });
            if (!isLayout) {
                router.options.routes.push(elRoute);
            }
            router.addRoutes(router.options.routes)
            next({ path: to.redirectedFrom || to.path, replace: true })

        } else {
            next()

        }

        isPreview = true;

    }
    return isPreview;
}