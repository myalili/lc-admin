
import axios from 'axios';
export default (Vue) => {
    Vue.prototype.$axios = axios;
    Vue.prototype.$get = (url, params) => {

        return axios.get(url, { params: params });
    }
    Vue.prototype.$post = (url, params) => {

        return axios.post(url, params);
    }

    Vue.prototype.$put = (url, params) => {


        return axios.put(url, params);
    }
//不能用$delete,会覆盖vue的$delete
    Vue.prototype.$deleteAxios = (url, params) => {


        return axios.delete(url, { params: params });
    }

    window.$axios = axios;

    if (process.env.NODE_ENV === "development" && window.isDebug) {
        window.$axios.interceptors.response.handlers.unshift({
            fulfilled: response => {
                window.queryData = {
                    url: response.request.responseURL,
                    data: response.data
                }
                return response;
            },
            rejected: error => {
                return Promise.reject(error);
            }
        })
    }


}