# 项目管理

## 引入

```js
import tenantManager from './tenantManager'
```

需要配置验证中心代理，请求前缀：/auth-center。axios需要配置全局拦截器，发送请求时带上token

## 组件参数

| 名字  | 类型   | 描述                               |
| ----- | ------ | ---------------------------------- |
| title | String | 左上角的标题名字，默认值：租户管理 |
|icon-menu | Boolean|租户列表是否使用icon菜单，如果为true，会禁用右键悬浮菜单，默认值为false|
