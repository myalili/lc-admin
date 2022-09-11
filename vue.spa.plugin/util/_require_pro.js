
const mixins = require('../mixin/index');
const _require = file => () => window.systemjs.import(`${file}`).then((module) => {
    if (!module.default.mixins) {
        module.default.mixins = []
    }
    module.default.mixins.push(mixins.default);
    return module.default
})


export default _require
