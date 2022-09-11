版本9.0.1  修复路由缓存逻辑

版本9.0.0  添加打开组件类型，优化多布局，挂载公共方法到window.V8

版本8.0.5  暴露subPageCtn

版本8.0.4 修复Vue undefined报错

版本8.0.3 修复打开微页面时，直接使用window.v8方法和参数query是对象不能出现在子地址栏

版本8.0.2 修复open打开params，会重复加入路由

版本8.0.1 打开多布局功能

版本8.0.0 新增微页面功能，和优化功能

版本7.1.18 添加修改弹窗文本，默认在回调函数获取到子页面的实例

版本7.1.17 增加弹窗header的操作按钮列,控制放大和缩小,控制值dialogGorw存放于appearance.json文件里,dialogGorw为true时,全屏放大缩小,为数字时,按数字倍数放大缩小

版本7.1.16 修复弹窗在IE的报错

版本7.1.15 增加弹窗header的操作按钮列

版本7.1.14 修复弹窗组件生命周期多次调用

版本7.1.13 默认点击 modal 遮罩不关闭 Dialog

版本7.1.12 弹窗添加事件钩子

版本7.1.11 优化弹窗关闭和打开

版本7.1.10 删除console.log

版本7.1.9 修复打开子页面时，component可以直接写()=>import("@/views/xxx.vue");

版本7.1.8 修复弹窗的样式问题

版本7.1.7

  自定义配置增量部署时静态路径， 在根目录env.production文件添加VUE_APP_DEPLOY_STATIC，例如

  ```
    VUE_APP_DEPLOY_STATIC=/dist
  ```


版本7.1.6 修复异步组件factory.js拼接文件路径问题。

版本7.1.5 修复异步组件factory.js拼接文件路径问题。

版本7.1.4 修改弹窗布局为flex布局。

版本7.1.3 修改`util/preview.js`。根据环境变量，控制是否使用预览功能。

版本7.1.0

- 修复增量部署不需要把页面的@v2-lib/vue.spa.plugin 的mixins 去掉，需要在vue.config.js chainWebpack添加一个loader ，代码如下：

```
 if (!(process.argv.includes('--target') && process.argv.includes('lib'))) {
      config.module
        .rule('import-rule')
        .test(/_spa_import\.js/g)
        .use(path.resolve(__dirname, './node_modules/@v2-lib/vue.spa.plugin/loaders/import_loader.js'))
        .loader(path.resolve(__dirname, './node_modules/@v2-lib/vue.spa.plugin/loaders/import_loader.js'))
        .end()
 }
```

如图：

![image](https://unpkg.awebide.com/@v2-lib/vue.spa.plugin@7.1.0/img/1.png)






