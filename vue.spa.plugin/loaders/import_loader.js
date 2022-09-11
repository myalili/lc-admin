module.exports = function () {
    let source =
        'const _import = (file,mixins) => import(\n' +
        '/* webpackExclude: /\.def$/ */ \n' +
        '/* webpackChunkName: "[request]"*/\n' +
        '/* webpackMode: "lazy" */ \n' +
        ' `@/views/${file}`).then((module) => {\n' +
        ' if (!module.default.mixins) {\n' +
        '  module.default.mixins = []\n' +
        '}\n' +
        ' mixins && module.default.mixins.push(mixins);\n' +
        ' return module.default;\n' +
        '});\n' +
        'export default _import;\n';
    return source
}