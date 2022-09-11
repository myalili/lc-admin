import * as admin from './libs/admin'

import * as portalLong from './libs/portalLong'

let api = {
    ...admin,
    ...portalLong
}

window.getAopsApi = ()=>{
    return api
}
// export default api
