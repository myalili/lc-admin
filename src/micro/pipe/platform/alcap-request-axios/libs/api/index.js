let axios = window.axios;
import source from './source.js';



for (let i in source) {
  axios[i] = source[i];
}

// axios 配置
axios.defaults.timeout = 60000;
axios.defaults.withCredentials = true;
//axios.defaults.headers["Content-Type"] = `application/x-www-form-urlencoded`; //如果所有请求都是这种形式可以打开统一配置，如果不是就要修改以下拦截加判断

axios.interceptors.request.use(
  
  config => {
    const { getToken} = window.alcapCoreUtils;
    config.headers.common['Authorization'] = 'Bearer ' + getToken();



    return config;
  },
  err => {
    return Promise.reject(err);
  });
// 拦截器为了适配AWEB后台，这里是当token过期是，页面跳转到登陆页
axios.interceptors.response.use(
  (response) => {

    // if (!response) {
    //   Notification.error({
    //     title: '错误',
    //     message: '系统错误0X08:后台服务报错'
    //   })
    //   return false;
    // }
    let data = response.data;
    if (data.status) {
      return data
    } else {
      // switch (data.errorCode) {
      //   case '100001':
      //     MessageBox.confirm('会话超时，请重新登录！')
      //       .then(() => {
      //         removeToken();
      //         window.location.href = './';

      //       })
      //       .catch(() => { });
      //     break;
      //   case '100002':
      //     Notification.error({
      //       title: '错误',
      //       message: '系统错误0X06:' + data.errorMsg || '字段校验失败'
      //     })
      //     break;
      //   default:
      //     return data;
      // }
      return data;

    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          const { removeToken} = window.alcapCoreUtils;
          removeToken()
          window.location.href = './';
      }
    }
    return Promise.reject(error.response && error.response.data)
  });









