import * as requestUtils from './utils/requestUtils'
import * as listTools from './utils/listTools'
import { convertCurrency } from './utils/amountInWord'
import * as components from './utils/components'

import customDialog from './mixins/customDialogMixin'
import * as componentsMixin from './mixins/componentsMixin'
import * as assembleMixin from './mixins/assembleMixin'


window.codelessMixins = {
    customDialog,
    ...componentsMixin,
    ...assembleMixin
};

window.codelessUtils = {
    ...window.codelessUtils,
    ...requestUtils,
    ...listTools,
    ...components,
    convertCurrency
}

