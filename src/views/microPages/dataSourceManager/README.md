# 租户管理

## 引入

```js
import dataSourceManager from './dataSourceManager'
```

需要配置验证中心代理，请求前缀：/auth-center。axios需要配置全局拦截器，发送请求时带上token
