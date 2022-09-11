import * as bffApi from './bffApi'
import * as pageApi from './page'
import * as dataFactoryApi from './dataFactoryApi'

window.getBffApi = ()=>{
    return {
        ...bffApi,
        ...pageApi,
        ...dataFactoryApi
    }
}


