# 使用文档
【管道说明】

给store的使用加了一层封装，暴露出的是一个对象，该对象上分别挂载3个方法，分别是 setStore(设置/更新)，getStore(获取)，removeStore(移除)。

## 参数

### setStore
共【2】个参数:
- `【key】`,是【string】,【必填】,例如:`【"TEST_KEY"】`
- `【value】`,是【any】,【必填】,例如:`【"TEST_VALUE"】`

### getStore
共【1】个参数:
- `【key】`,是【string】,【必填】,例如:`【"TEST_KEY"】`

### removeStore
共【1】个参数:
- `【key】`,是【string】,【必填】,例如:`【"TEST_KEY"】`

## 使用方法

```
pipe.store.setStore(key, value);
pipe.store.getStore(key);
pipe.store.removeStore(key);
```

## 使用例子

### 设置
```
pipe.store.setStore("TEST_KEY", "TEST_VALUE");
```

### 获取
```
pipe.store.getStore("TEST_KEY");
```

### 移除
```
pipe.store.removeStore("TEST_KEY");
```