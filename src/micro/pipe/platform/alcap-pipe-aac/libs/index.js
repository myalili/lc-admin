import * as intoAuthoritiesTree from './utils/intoAuthoritiesTree'
import * as listTools from './utils/listTools'

import baseInfoMixin from './mixins/baseInfoMixin'

window.aacUtils = {
    ...intoAuthoritiesTree,
    ...listTools
}

window.aacMixins = {
    baseInfoMixin
}