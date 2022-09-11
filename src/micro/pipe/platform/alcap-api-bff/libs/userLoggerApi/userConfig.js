export default {
    errorGlobalHandle: null,

    // ====== 日志 ======= 
    getLogModuleInfo: {
        path: '/log/get-log-module-info',
        type: 'get'
    },
    getLogList: {
        path: '/log/list',
        type: 'post'
    },
    exportLog: {
        path: '/log/export-excel',
        type: 'post'
    },
    starLog: {
        path: '/log/star',
        type: 'post'
    },

}