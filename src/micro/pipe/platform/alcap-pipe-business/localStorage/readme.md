# 使用文档
【管道说明】

给localstorage的使用加了一层封装，暴露出的是一个对象，该对象上分别挂载3个方法，分别是 setStorage(设置/更新)，getStorage(获取)，removeStorage(移除)。

## 参数

### setStorage
共【2】个参数:
- `【key】`,是【string】,【必填】,例如:`【"TEST_KEY"】`
- `【value】`,是【string】,【必填】,例如:`【"TEST_VALUE"】`

### getStorage
共【1】个参数:
- `【key】`,是【string】,【必填】,例如:`【"TEST_KEY"】`

### removeStorage
共【1】个参数:
- `【key】`,是【string】,【必填】,例如:`【"TEST_KEY"】`

## 使用方法

```
pipe.localStorage.setStorage(key, value);
pipe.localStorage.getStorage(key);
pipe.localStorage.removeStorage(key);
```

## 使用例子

### 设置
```
pipe.localStorage.setStorage("TEST_KEY", "TEST_VALUE");
```

### 获取
```
pipe.localStorage.getStorage("TEST_KEY");
```

### 移除
```
pipe.localStorage.removeStorage("TEST_KEY");
```