# 使用文档
【管道说明】

给cookie的使用加了一层封装，暴露出的是一个对象，该对象上分别挂载3个方法，分别是 setCookie(设置/更新)，getCookie(获取)，removeCookie(移除)。

## 参数

### setCookie
共【3】个参数:
- `【key】`,是【string】,【必填】,例如:`【"TEST_KEY"】`
- `【value】`,是【string】,【必填】,例如:`【"TEST_VALUE"】`
- `【expires】`,是【string】,【选填】,例如:`【new Date().toGMTString()】`

### getCookie
共【1】个参数:
- `【key】`,是【string】,【必填】,例如:`【"TEST_KEY"】`

### removeCookie
共【1】个参数:
- `【key】`,是【string】,【必填】,例如:`【"TEST_KEY"】`

## 使用方法

```
pipe.cookie.setCookie(key, value, ?expires);
pipe.cookie.getCookie(key);
pipe.cookie.removeCookie(key);
```

## 使用例子

### 设置
```
pipe.cookie.setCookie("TEST_KEY", "TEST_VALUE");
```

### 获取
```
pipe.cookie.getCookie("TEST_KEY");
```

### 移除
```
pipe.cookie.removeCookie("TEST_KEY");
```