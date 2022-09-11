let axios = window.axios;
import userConfig from './userConfig'
// import choreography from './choreography'
import tools from './tools'
// import page from './page'
// import role from './role'
// import combine from './combine'
// import deviceControl from './deviceControl'
// import bff from './bff'
// import pageResource from './pageResource'
const prefix = axios.bff


// 设置超时时长


//错误信息过滤
// axios.interceptors.response.use(data => {
//     if (data.success != undefined && data.success == false) {
//         console.log('[api]请求错误：' + data.msg);
//         data.msg && (data.msg = ('' + data.msg).replaceAll(/[a-zA-Z：.\/:-_]/g, ""))
//     }
//     return data
// })

// 模块注册
const ApiModule = {
    userConfig,
    // choreography,
    tools,
    // page,
    // role,
    // combine,
    // deviceControl,
    // bff,
    // pageResource
}

//匹配模块中的api
const analyzeApiName = name => {
    const list = Object.keys(ApiModule)
    for (let i = 0; i < list.length; i++) {
        if (ApiModule[list[i]][name]) {
            return ApiModule[list[i]]
        }
    }
    return false
}

export default {
    source: prefix,
    /**
     * 统一请求模块
     * 定义好模块后，只需要传入name属性即可匹配到
     * 不传入回调函数默认返回 Promise
     * @param {*} name 
     * @param {*} params 
     * @param {*} success 
     * @param {*} error 
     */
    request(name, params, success, errorCb) {
        let postfixStr = ''
        let modelName = name
        let matchRes = name.match(/[\/|?]/)
        if (matchRes) {
            modelName = name.substring(0, matchRes.index)
            postfixStr = name.substring(matchRes.index)
        }
        const modules = analyzeApiName(modelName)
        if (modules) {
            const config = modules[modelName]
            //工具类直接执行 并绑定当前上下文
            if (config.type === 'tools') {
                return config.cb.apply(this, Array.prototype.slice.call(arguments, 1))
            }
            let data = params
            config.type === 'get' && (data = { params })
            const promiseContent = axios[config.type](
                (modules.custom_Prefix || axios.bff) + config.path + (postfixStr || ''),
                data,
            )
            if (!success && !errorCb) return promiseContent;
            promiseContent.then(response => {
                if (response.success) {
                    success && success(response)
                } else {
                    throw new Error(response.msg)
                }
            }).catch(error => {
                if(!error.response || error.response.status !== 401){
                    errorCb && errorCb(error)
                    modules.errorGlobalHandle && modules.errorGlobalHandle(error)
                }
                
            })
        }
    },

    //设置统一错误回调函数
    setErrorHandle(name, cb) {
        if (ApiModule[name]) {
            ApiModule[name].errorGlobalHandle = cb
        }
    }
}