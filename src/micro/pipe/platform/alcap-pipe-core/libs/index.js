import * as userUtils from './utils/user'
import * as entityUtils from './utils/entity'
import * as resource from './utils/resource'
import * as assembler from './utils/assembler'

import './utils/Activator' 
import { caseRouter } from './router/case';

import router,{mainRouter,resetRouter} from './router/router'
import {setRouterIntercept} from './router/routerIntercept'


window.alcapCoreUtils = {
    ...window.alcapCoreUtils,
    ...userUtils,
    ...entityUtils,
    ...resource,
    ...assembler,
    router,
    mainRouter,
    resetRouter,
    caseRouter,
    setRouterIntercept
}